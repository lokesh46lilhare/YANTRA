from database.connection import get_conn
def notify(c, uid, msg): c.execute("INSERT INTO notifications(user_id,message) VALUES(?,?)", (uid, msg))

def search_jobs(f, page=0, size=8):
    q, p = " FROM jobs j JOIN users u ON u.id=j.owner_id WHERE 1=1", []
    for key, sql in [("title", "j.title LIKE ?"), ("category", "j.category=?"), ("district", "j.district=?"), ("block", "j.block=?"), ("village", "j.village LIKE ?"),
                     ("min_wage", "j.wage>=?"), ("max_wage", "j.wage<=?"), ("payment_type", "j.payment_type=?"),
                     ("experience", "j.experience<=?"), ("start_by", "j.start_date<=?")]:
        v = f.get(key)
        if v not in (None, "", 0, "All"): q += f" AND {sql}"; p.append(f"%{v}%" if key in ("title", "village") else v)
    if f.get("food"): q += " AND (j.food=1 OR j.accommodation=1)"
    q += " AND j.status='Open'"
    with get_conn() as c:
        n = c.execute("SELECT COUNT(*)" + q, p).fetchone()[0]
        rows = c.execute("SELECT j.*,u.name AS owner" + q + " ORDER BY j.id DESC LIMIT ? OFFSET ?", p + [size, page * size]).fetchall()
    return rows, n

def apply(job_id, user):
    if not user or user["role"] != "worker": return False, "Login as a worker to apply"
    with get_conn() as c:
        j = c.execute("SELECT * FROM jobs WHERE id=?", (job_id,)).fetchone()
        if not j or j["status"] != "Open": return False, "This job is closed"
        if j["owner_id"] == user["id"]: return False, "You cannot apply to your own job"
        if c.execute("SELECT 1 FROM job_applications WHERE job_id=? AND worker_id=?", (job_id, user["id"])).fetchone():
            return False, "You have already applied"
        c.execute("INSERT INTO job_applications(job_id,worker_id) VALUES(?,?)", (job_id, user["id"]))
        notify(c, j["owner_id"], f"New application from {user['name']} for {j['title']}")
    return True, "Application submitted (Pending)"

def my_applications(uid):
    with get_conn() as c:
        return c.execute("SELECT a.*,j.title,j.wage,j.block,j.village FROM job_applications a JOIN jobs j ON j.id=a.job_id "
                         "WHERE a.worker_id=? ORDER BY a.id DESC", (uid,)).fetchall()

def withdraw(app_id, uid):
    with get_conn() as c:
        c.execute("UPDATE job_applications SET status='Withdrawn' WHERE id=? AND worker_id=? AND status IN ('Pending','Shortlisted')", (app_id, uid))

def create_job(uid, d):
    if d["wage"] <= 0 or d["workers_needed"] <= 0 or not d["title"].strip(): return "Title, wage and worker count must be valid"
    with get_conn() as c:
        c.execute(f"INSERT INTO jobs(owner_id,{','.join(d)}) VALUES(?,{','.join('?' * len(d))})", [uid, *d.values()])
    return ""

def owner_jobs(uid):
    with get_conn() as c:
        return c.execute("SELECT j.*,(SELECT COUNT(*) FROM job_applications a WHERE a.job_id=j.id) AS apps FROM jobs j WHERE owner_id=? ORDER BY id DESC", (uid,)).fetchall()

def set_job_status(job_id, uid, status):
    with get_conn() as c:
        c.execute("UPDATE jobs SET status=? WHERE id=? AND owner_id=?", (status, job_id, uid))

def applicants(job_id, uid):
    with get_conn() as c:
        return c.execute("SELECT a.id,a.status,u.name,u.locality,w.primary_skill,w.experience_years,w.preferred_wage FROM job_applications a "
                         "JOIN jobs j ON j.id=a.job_id JOIN users u ON u.id=a.worker_id LEFT JOIN worker_profiles w ON w.user_id=u.id "
                         "WHERE a.job_id=? AND j.owner_id=?", (job_id, uid)).fetchall()

def set_app_status(app_id, uid, status):
    with get_conn() as c:
        r = c.execute("SELECT a.worker_id,j.title FROM job_applications a JOIN jobs j ON j.id=a.job_id WHERE a.id=? AND j.owner_id=?", (app_id, uid)).fetchone()
        if r:
            c.execute("UPDATE job_applications SET status=? WHERE id=?", (status, app_id))
            notify(c, r["worker_id"], f"Your application for {r['title']} is now {status}")

def notifications(uid):
    with get_conn() as c:
        rows = c.execute("SELECT * FROM notifications WHERE user_id=? ORDER BY id DESC LIMIT 50", (uid,)).fetchall()
        c.execute("UPDATE notifications SET is_read=1 WHERE user_id=?", (uid,))
    return rows

def stats():
    with get_conn() as c:
        g = lambda s: c.execute(s).fetchone()[0]
        return g("SELECT COUNT(*) FROM jobs WHERE status='Open'"), g("SELECT COUNT(*) FROM users WHERE role='worker'"), g("SELECT COUNT(*) FROM users WHERE role='contractor'")
