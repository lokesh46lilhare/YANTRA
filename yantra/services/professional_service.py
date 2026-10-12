import os, sqlite3, uuid
from database.connection import get_conn
from services.job_service import notify
TYPES = ["Fresher", "Internship", "Experienced", "Freelance", "Contract"]
SPECS = ["Civil engineer", "Mechanical engineer", "Electrical engineer", "Software developer", "Data analyst", "AI/ML engineer", "Site supervisor", "Quantity surveyor", "Architect", "Freelancer"]

def save_resume(f):
    if f is None: return None, ""
    if not f.name.lower().endswith(".pdf"): return None, "Resume must be a PDF"
    data = f.getvalue()
    if len(data) > 2_000_000: return None, "PDF must be under 2 MB"
    if not data.startswith(b"%PDF"): return None, "File is not a valid PDF"
    os.makedirs("uploads/resumes", exist_ok=True); p = f"uploads/resumes/{uuid.uuid4().hex}.pdf"; open(p, "wb").write(data); return p, ""

def get_profile(uid):
    with get_conn() as c: return c.execute("SELECT * FROM professional_profiles WHERE user_id=?", (uid,)).fetchone()

def update_profile(uid, d, resume):
    path, err = save_resume(resume)
    if err: return err
    if path: d["resume_path"] = path
    with get_conn() as c: c.execute(f"UPDATE professional_profiles SET {','.join(k + '=?' for k in d)} WHERE user_id=?", [*d.values(), uid])
    return ""

def search_pros(f, me):
    q, p = "SELECT u.id,u.name,u.locality,p.* FROM professional_profiles p JOIN users u ON u.id=p.user_id WHERE u.status='active' AND u.id!=?", [me]
    if f.get("spec") not in (None, "All"): q += " AND p.specialization=?"; p.append(f["spec"])
    if f.get("text"): q += " AND (p.skills LIKE ? OR p.headline LIKE ?)"; p += [f"%{f['text']}%"] * 2
    with get_conn() as c: return c.execute(q + " LIMIT 30", p).fetchall()

def connect(user, other):
    if other == user["id"]: return False, "Cannot connect with yourself"
    with get_conn() as c:
        if c.execute("SELECT 1 FROM professional_connections WHERE (requester_id=? AND receiver_id=?) OR (requester_id=? AND receiver_id=?)", (user["id"], other, other, user["id"])).fetchone():
            return False, "Request already exists"
        c.execute("INSERT INTO professional_connections(requester_id,receiver_id) VALUES(?,?)", (user["id"], other))
        notify(c, other, f"New connection request from {user['name']}")
    return True, "Connection request sent"

def pending_requests(uid):
    with get_conn() as c: return c.execute("SELECT k.id,u.name FROM professional_connections k JOIN users u ON u.id=k.requester_id WHERE k.receiver_id=? AND k.status='Pending'", (uid,)).fetchall()

def respond(cid, user, accept):
    with get_conn() as c:
        r = c.execute("SELECT requester_id FROM professional_connections WHERE id=? AND receiver_id=? AND status='Pending'", (cid, user["id"])).fetchone()
        if r:
            c.execute("UPDATE professional_connections SET status=? WHERE id=?", ("Accepted" if accept else "Declined", cid))
            notify(c, r[0], f"{user['name']} {'accepted' if accept else 'declined'} your connection request")

def connections(uid):
    with get_conn() as c: return c.execute("SELECT u.name FROM professional_connections k JOIN users u ON u.id=CASE WHEN k.requester_id=? THEN k.receiver_id ELSE k.requester_id END WHERE k.status='Accepted' AND ? IN (k.requester_id,k.receiver_id)", (uid, uid)).fetchall()

def post(uid, body):
    if not body.strip() or len(body) > 500: return "Post must be 1-500 characters"
    with get_conn() as c: c.execute("INSERT INTO professional_posts(author_id,body) VALUES(?,?)", (uid, body.strip()))
    return ""

def feed(uid):
    with get_conn() as c:
        rows = c.execute("SELECT p.id,p.body,p.created_at,u.name,(SELECT COUNT(*) FROM post_likes l WHERE l.post_id=p.id) likes,(SELECT COUNT(*) FROM post_likes l WHERE l.post_id=p.id AND l.user_id=?) mine FROM professional_posts p JOIN users u ON u.id=p.author_id ORDER BY p.id DESC LIMIT 20", (uid,)).fetchall()
        return [(r, c.execute("SELECT c.body,u.name FROM post_comments c JOIN users u ON u.id=c.user_id WHERE c.post_id=? ORDER BY c.id", (r["id"],)).fetchall()) for r in rows]

def like(pid, uid):
    with get_conn() as c: c.execute("INSERT OR IGNORE INTO post_likes VALUES(?,?)", (pid, uid))

def comment(pid, uid, body):
    if body.strip():
        with get_conn() as c: c.execute("INSERT INTO post_comments(post_id,user_id,body) VALUES(?,?,?)", (pid, uid, body.strip()[:300]))

def create_pro_job(user, d):
    if user["role"] != "employer": return "Only employers can post professional jobs"
    if not d["title"].strip(): return "Title required"
    with get_conn() as c: c.execute(f"INSERT INTO pro_jobs(employer_id,{','.join(d)}) VALUES(?,{','.join('?' * len(d))})", [user["id"], *d.values()])
    return ""

def search_jobs(f):
    q, p = "SELECT j.*,u.name AS employer FROM pro_jobs j JOIN users u ON u.id=j.employer_id WHERE j.status='Open'", []
    if f.get("type") not in (None, "All"): q += " AND j.job_type=?"; p.append(f["type"])
    if f.get("loc"): q += " AND j.location LIKE ?"; p.append(f"%{f['loc']}%")
    if f.get("text"): q += " AND j.title LIKE ?"; p.append(f"%{f['text']}%")
    with get_conn() as c: return c.execute(q + " ORDER BY j.id DESC LIMIT 30", p).fetchall()

def apply(user, jid, resume):
    if user["role"] == "employer": return False, "Employers cannot apply"
    path, err = save_resume(resume)
    if err: return False, err
    prof = get_profile(user["id"])
    path = path or (prof["resume_path"] if prof else None)
    if not path and not (prof and prof["headline"]): return False, "Upload a PDF resume or complete your professional profile"
    try:
        with get_conn() as c:
            j = c.execute("SELECT title,employer_id,status FROM pro_jobs WHERE id=?", (jid,)).fetchone()
            if not j or j["status"] != "Open": return False, "Job is closed"
            c.execute("INSERT INTO pro_applications(job_id,applicant_id,resume_path) VALUES(?,?,?)", (jid, user["id"], path))
            notify(c, j["employer_id"], f"New application from {user['name']} for {j['title']}")
    except sqlite3.IntegrityError: return False, "Already applied"
    return True, "Application submitted (Pending)"

def my_apps(uid):
    with get_conn() as c: return c.execute("SELECT a.status,a.applied_at,j.title FROM pro_applications a JOIN pro_jobs j ON j.id=a.job_id WHERE a.applicant_id=? ORDER BY a.id DESC", (uid,)).fetchall()

def employer_jobs(uid):
    with get_conn() as c:
        js = c.execute("SELECT * FROM pro_jobs WHERE employer_id=? ORDER BY id DESC", (uid,)).fetchall()
        return [(j, c.execute("SELECT a.id,a.status,a.resume_path,u.name FROM pro_applications a JOIN users u ON u.id=a.applicant_id WHERE a.job_id=?", (j["id"],)).fetchall()) for j in js]

def set_app_status(aid, uid, status):
    with get_conn() as c:
        r = c.execute("SELECT a.applicant_id,j.title FROM pro_applications a JOIN pro_jobs j ON j.id=a.job_id WHERE a.id=? AND j.employer_id=?", (aid, uid)).fetchone()
        if r: c.execute("UPDATE pro_applications SET status=? WHERE id=?", (status, aid)); notify(c, r[0], f"Your application for {r[1]} is now {status}")

def resume_bytes(aid, uid):
    with get_conn() as c: r = c.execute("SELECT a.resume_path FROM pro_applications a JOIN pro_jobs j ON j.id=a.job_id WHERE a.id=? AND j.employer_id=?", (aid, uid)).fetchone()
    return open(r[0], "rb").read() if r and r[0] and os.path.exists(r[0]) else None
