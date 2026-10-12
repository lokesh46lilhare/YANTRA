import sqlite3
import pandas as pd
from database.connection import get_conn
from services.job_service import notify
from utils.permissions import require_role

def _adm(u): require_role(u, "admin")

def _log(c, a, act): c.execute("INSERT INTO audit_logs(actor_id,action) VALUES(?,?)", (a["id"], act))

def df(sql, p=()):
    with get_conn() as c: return pd.read_sql_query(sql, c, params=p)

def _ensure(c):
    from database.seed_data import BLOCKS
    if True:  # idempotent: base Balaghat blocks always present
        c.executemany("INSERT OR IGNORE INTO locations(district,block) VALUES('Balaghat',?)", [(b,) for b in BLOCKS])

def locations_list():
    with get_conn() as c:
        _ensure(c); return [(r[0], r[1]) for r in c.execute("SELECT district,block FROM locations ORDER BY district,block")]

def districts(): return sorted({d for d, _ in locations_list()})

def blocks_for(district=None): return sorted({b for d, b in locations_list() if district in (None, "All", d)})

def block_list(): return blocks_for(None)

def create_report(user, ttype, tid, reason):
    if not user or not (reason or "").strip(): return False
    try:
        with get_conn() as c: c.execute("INSERT INTO reports(reporter_id,target_type,target_id,reason) VALUES(?,?,?,?)", (user["id"], ttype, tid, reason.strip()[:300]))
    except sqlite3.IntegrityError: return True
    return True

STAT_SQL = {"Total users": "SELECT COUNT(*) FROM users", "Workers": "SELECT COUNT(*) FROM users WHERE role='worker'", "Contractors": "SELECT COUNT(*) FROM users WHERE role='contractor'",
 "Engineers": "SELECT COUNT(*) FROM users WHERE role='engineer'", "Employers": "SELECT COUNT(*) FROM users WHERE role='employer'", "Equipment owners": "SELECT COUNT(*) FROM users WHERE role='equipment_owner'",
 "Total jobs": "SELECT COUNT(*) FROM jobs", "Open jobs": "SELECT COUNT(*) FROM jobs WHERE status='Open'", "Applications": "SELECT COUNT(*) FROM job_applications",
 "Accepted applications": "SELECT COUNT(*) FROM job_applications WHERE status='Accepted'", "Equipment listings": "SELECT COUNT(*) FROM equipment_listings",
 "Rental requests": "SELECT COUNT(*) FROM rental_bookings", "Open reports": "SELECT COUNT(*) FROM reports WHERE status='Open'"}
def stats(u):
    _adm(u)
    with get_conn() as c: return {k: c.execute(q).fetchone()[0] for k, q in STAT_SQL.items()}

CHARTS = {"Registrations by role": "SELECT role, COUNT(*) AS n FROM users GROUP BY role", "Jobs by category": "SELECT category, COUNT(*) AS n FROM jobs GROUP BY category",
 "Jobs by district": "SELECT district, COUNT(*) AS n FROM jobs GROUP BY district", "Applications by status": "SELECT status, COUNT(*) AS n FROM job_applications GROUP BY status",
 "Rental requests by status": "SELECT status, COUNT(*) AS n FROM rental_bookings GROUP BY status"}
def chart_data(u, title): _adm(u); return df(CHARTS[title])

def search_users(u, q):
    _adm(u)
    return df("SELECT id,name,role,district,locality,status,is_demo,created_at,substr(mobile,1,2)||'XXXXXX'||substr(mobile,9) AS mobile FROM users WHERE name LIKE ? OR mobile LIKE ? ORDER BY id DESC LIMIT 50", (f"%{q}%", f"%{q}%"))

def set_user_status(u, uid, status):
    _adm(u)
    with get_conn() as c:
        t = c.execute("SELECT role,name FROM users WHERE id=?", (uid,)).fetchone()
        if not t or t["role"] == "admin" or uid == u["id"]: return "Cannot change this account"
        c.execute("UPDATE users SET status=? WHERE id=?", (status, uid)); _log(c, u, f"Set user #{uid} ({t['name']}) to {status}")
    return ""

def open_reports(u):
    _adm(u)
    return df("SELECT r.id,r.target_type,r.target_id,r.reason,r.created_at,u.name AS reporter,COALESCE(j.title,e.name,t.name) AS title,COALESCE(j.status,CASE WHEN e.id IS NOT NULL THEN CASE WHEN e.available=1 THEN 'live' ELSE 'hidden' END END,t.status) AS job_status FROM reports r JOIN users u ON u.id=r.reporter_id LEFT JOIN jobs j ON r.target_type='job' AND j.id=r.target_id LEFT JOIN equipment_listings e ON r.target_type='equipment' AND e.id=r.target_id LEFT JOIN users t ON r.target_type='user' AND t.id=r.target_id WHERE r.status='Open' ORDER BY r.id")

def resolve_report(u, rid, close_job, note):
    _adm(u)
    with get_conn() as c:
        r = c.execute("SELECT * FROM reports WHERE id=? AND status='Open'", (rid,)).fetchone()
        if not r: return False
        c.execute("UPDATE reports SET status='Resolved',resolved_by=?,resolution=? WHERE id=?", (u["id"], note[:300], rid))
        if close_job and r["target_type"] == "job":
            j = c.execute("SELECT owner_id,title FROM jobs WHERE id=?", (r["target_id"],)).fetchone()
            c.execute("UPDATE jobs SET status='Closed' WHERE id=?", (r["target_id"],)); notify(c, j["owner_id"], f"Your job '{j['title']}' was closed after a report review")
        if close_job and r["target_type"] == "user":
            c.execute("UPDATE users SET status='suspended' WHERE id=? AND role!='admin'", (r["target_id"],))
        if close_job and r["target_type"] == "equipment":
            e = c.execute("SELECT owner_id,name FROM equipment_listings WHERE id=?", (r["target_id"],)).fetchone()
            c.execute("UPDATE equipment_listings SET available=0 WHERE id=?", (r["target_id"],)); notify(c, e["owner_id"], f"Your listing '{e['name']}' was hidden after a report review")
        _log(c, u, f"Resolved report #{rid} ({'job closed' if close_job else 'no action'})")
    return True

def close_job(u, jid):
    _adm(u)
    with get_conn() as c: c.execute("UPDATE jobs SET status='Closed' WHERE id=?", (jid,)); _log(c, u, f"Closed job #{jid}")

def set_equipment(u, eid, flag):
    _adm(u)
    with get_conn() as c: c.execute("UPDATE equipment_listings SET available=? WHERE id=?", (flag, eid)); _log(c, u, f"Set equipment #{eid} available={flag}")

def add_location(u, district, block):
    _adm(u)
    if not district.strip() or not block.strip(): return "District and block required"
    with get_conn() as c: c.execute("INSERT OR IGNORE INTO locations(district,block) VALUES(?,?)", (district.strip(), block.strip())); _log(c, u, f"Added location {district}/{block}")
    return ""

def activity(u):
    _adm(u)
    return df("SELECT * FROM (SELECT created_at,'New user: '||name AS event FROM users UNION ALL SELECT created_at,'Job posted: '||title FROM jobs UNION ALL SELECT applied_at,'Application #'||id FROM job_applications "
              "UNION ALL SELECT created_at,'Rental request #'||id FROM rental_bookings) ORDER BY 1 DESC LIMIT 30")

def audit(u):
    _adm(u)
    return df("SELECT a.created_at,u.name AS actor,a.action FROM audit_logs a LEFT JOIN users u ON u.id=a.actor_id ORDER BY a.id DESC LIMIT 100")

EXPORTS = {"users": "SELECT id,name,role,district,locality,status,is_demo,created_at FROM users", "jobs": "SELECT * FROM jobs", "applications": "SELECT * FROM job_applications",
 "equipment": "SELECT * FROM equipment_listings", "rentals": "SELECT * FROM rental_bookings", "reports": "SELECT * FROM reports", "audit_log": "SELECT * FROM audit_logs"}
def export_csv(u, name):
    _adm(u)
    data = df(EXPORTS[name]).to_csv(index=False).encode()
    with get_conn() as c: _log(c, u, f"Exported {name} CSV")
    return data

def notify_user(u, uid, msg):
    _adm(u)
    with get_conn() as c: notify(c, uid, f"Admin notice: {msg.strip()[:300]}"); _log(c, u, f"Sent in-app notice to user #{uid}")

def pdf_summary(u):
    """Optional PDF report; needs `pip install reportlab`."""
    _adm(u)
    import io
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import getSampleStyleSheet
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
    buf = io.BytesIO(); doc = SimpleDocTemplate(buf, pagesize=A4); ss = getSampleStyleSheet()
    def tbl(rows):
        t = Table(rows); t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0b3d91")), ("TEXTCOLOR", (0, 0), (-1, 0), colors.white), ("GRID", (0, 0), (-1, -1), 0.5, colors.grey)])); return t
    els = [Paragraph("YANTRA Platform Summary (demo data)", ss["Title"]), tbl([["Metric", "Value"]] + [[k, str(v)] for k, v in stats(u).items()]), Spacer(1, 12)]
    for title in CHARTS:
        d = chart_data(u, title); els += [Paragraph(title, ss["Heading3"]), tbl([list(d.columns)] + d.astype(str).values.tolist()), Spacer(1, 8)]
    doc.build(els)
    with get_conn() as c: _log(c, u, "Exported PDF summary")
    return buf.getvalue()
