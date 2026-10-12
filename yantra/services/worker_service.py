import sqlite3
from database.connection import get_conn
from services.job_service import notify

def search_workers(f, limit=20):
    q, p = (" FROM users u JOIN worker_profiles w ON w.user_id=u.id WHERE u.status='active'", [])
    if f.get("skill"): q += " AND w.primary_skill LIKE ?"; p.append(f"%{f['skill']}%")
    if f.get("block") not in (None, "All"): q += " AND u.locality=?"; p.append(f["block"])
    if f.get("min_exp"): q += " AND w.experience_years>=?"; p.append(f["min_exp"])
    if f.get("min_radius"): q += " AND w.radius_km>=?"; p.append(f["min_radius"])
    if f.get("max_wage"): q += " AND w.preferred_wage<=?"; p.append(f["max_wage"])
    if f.get("availability") not in (None, "All"): q += " AND w.availability=?"; p.append(f["availability"])
    with get_conn() as c:   # no mobile/email selected: contact stays private
        return c.execute("SELECT u.id,u.name,u.locality,u.is_demo,w.primary_skill,w.experience_years,w.preferred_wage,w.availability,w.intro,w.show_wage,w.photo_path,w.radius_km" + q + " ORDER BY w.experience_years DESC LIMIT ?", p + [limit]).fetchall()

def toggle_shortlist(owner, worker):
    with get_conn() as c:
        if c.execute("DELETE FROM saved_workers WHERE owner_id=? AND worker_id=?", (owner, worker)).rowcount: return False
        c.execute("INSERT INTO saved_workers VALUES(?,?)", (owner, worker)); return True

def saved_ids(owner):
    with get_conn() as c: return {r[0] for r in c.execute("SELECT worker_id FROM saved_workers WHERE owner_id=?", (owner,))}

def invite(user, worker_id, job_id, note):
    if user["role"] not in ("contractor", "employer"): return False, "Only contractors/employers can invite"
    try:
        with get_conn() as c:
            j = c.execute("SELECT title,status FROM jobs WHERE id=? AND owner_id=?", (job_id, user["id"])).fetchone()
            w = c.execute("SELECT 1 FROM users WHERE id=? AND role='worker' AND status='active'", (worker_id,)).fetchone()
            if not j or not w: return False, "Invalid job or worker"
            if j["status"] != "Open": return False, "Job is closed"
            c.execute("INSERT INTO work_invitations(owner_id,worker_id,job_id,note) VALUES(?,?,?,?)", (user["id"], worker_id, job_id, note[:300]))
            notify(c, worker_id, f"Work invitation from {user['name']} for {j['title']}")
    except sqlite3.IntegrityError:
        return False, "You already invited this worker for this job"
    return True, "Invitation sent"

def sent_invitations(owner):
    with get_conn() as c:
        return c.execute("SELECT i.status,i.created_at,u.name,j.title FROM work_invitations i JOIN users u ON u.id=i.worker_id JOIN jobs j ON j.id=i.job_id WHERE i.owner_id=? ORDER BY i.id DESC", (owner,)).fetchall()

def my_invitations(worker):
    with get_conn() as c:
        return c.execute("SELECT i.id,i.status,i.note,i.created_at,u.name AS owner,j.title,j.wage,j.block FROM work_invitations i JOIN users u ON u.id=i.owner_id JOIN jobs j ON j.id=i.job_id WHERE i.worker_id=? ORDER BY i.id DESC", (worker,)).fetchall()

def respond(inv_id, worker, accept):
    status = "Accepted" if accept else "Declined"
    with get_conn() as c:
        r = c.execute("SELECT owner_id,job_id FROM work_invitations WHERE id=? AND worker_id=? AND status='Pending'", (inv_id, worker["id"])).fetchone()
        if not r: return False
        c.execute("UPDATE work_invitations SET status=? WHERE id=?", (status, inv_id))
        notify(c, r["owner_id"], f"{worker['name']} {status.lower()} your work invitation")
    return True

def set_availability(uid, a):
    with get_conn() as c: c.execute("UPDATE worker_profiles SET availability=? WHERE user_id=?", (a, uid))

def dashboard(uid, today):
    with get_conn() as c:
        p = c.execute("SELECT w.*,u.locality FROM worker_profiles w JOIN users u ON u.id=w.user_id WHERE w.user_id=?", (uid,)).fetchone()
        f = [p["primary_skill"], p["experience_years"], p["preferred_wage"], p["block"], p["village"], p["intro"], p["photo_path"]]
        base = "SELECT * FROM jobs j WHERE j.status='Open' AND j.id NOT IN (SELECT job_id FROM job_applications WHERE worker_id=?)"
        sk = f"%{p['primary_skill'] or ''}%"
        return dict(profile=p, pct=int(100 * sum(bool(x) for x in f) / len(f)),
            counts=dict(c.execute("SELECT status,COUNT(*) FROM job_applications WHERE worker_id=? GROUP BY status", (uid,)).fetchall()),
            recommended=c.execute(base + " AND (j.category LIKE ? OR j.title LIKE ?) ORDER BY j.id DESC LIMIT 5", (uid, sk, sk)).fetchall(),
            nearby=c.execute(base + " AND j.block=? ORDER BY j.id DESC LIMIT 5", (uid, p["locality"])).fetchall(),
            upcoming=c.execute("SELECT j.title,j.start_date,j.block FROM job_applications a JOIN jobs j ON j.id=a.job_id WHERE a.worker_id=? AND a.status='Accepted' AND j.start_date>=? ORDER BY j.start_date", (uid, today)).fetchall(),
            activity=c.execute("SELECT 'Applied: '||j.title||' ('||a.status||')' AS t,a.applied_at AS at FROM job_applications a JOIN jobs j ON j.id=a.job_id WHERE a.worker_id=? ORDER BY a.id DESC LIMIT 5", (uid,)).fetchall(),
            notes=c.execute("SELECT message,created_at FROM notifications WHERE user_id=? ORDER BY id DESC LIMIT 3", (uid,)).fetchall())
