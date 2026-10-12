from database.connection import get_conn
from services.job_service import notify

def contacts(uid):
    sql = """SELECT DISTINCT other FROM (
      SELECT worker_id other FROM work_invitations WHERE owner_id=:u UNION SELECT owner_id FROM work_invitations WHERE worker_id=:u
      UNION SELECT a.worker_id FROM job_applications a JOIN jobs j ON j.id=a.job_id WHERE j.owner_id=:u
      UNION SELECT j.owner_id FROM job_applications a JOIN jobs j ON j.id=a.job_id WHERE a.worker_id=:u
      UNION SELECT CASE WHEN user_a=:u THEN user_b ELSE user_a END FROM conversations WHERE :u IN (user_a,user_b))"""
    with get_conn() as c:
        ids = [r[0] for r in c.execute(sql, {"u": uid})]
        res = []
        for o in ids:
            n = c.execute("SELECT name FROM users WHERE id=? AND status='active'", (o,)).fetchone()
            un = c.execute("SELECT COUNT(*) FROM messages m JOIN conversations v ON v.id=m.conv_id WHERE m.sender_id=? AND m.is_read=0 AND ? IN (v.user_a,v.user_b)", (o, uid)).fetchone()[0]
            if n: res.append((o, n[0], un))
    return res

def _pair(a, b): return (min(a, b), max(a, b))

def send_message(user, other, body):
    body = (body or "").strip()
    if not body or len(body) > 500: return "Message must be 1-500 characters"
    if other not in [c[0] for c in contacts(user["id"])]: return "You can only message people you have an application or invitation with"
    a, b = _pair(user["id"], other)
    with get_conn() as c:
        c.execute("INSERT OR IGNORE INTO conversations(user_a,user_b) VALUES(?,?)", (a, b))
        cid = c.execute("SELECT id FROM conversations WHERE user_a=? AND user_b=?", (a, b)).fetchone()[0]
        c.execute("INSERT INTO messages(conv_id,sender_id,body) VALUES(?,?,?)", (cid, user["id"], body))
        notify(c, other, f"New message from {user['name']}")
    return ""

def thread(user, other):
    a, b = _pair(user["id"], other)
    with get_conn() as c:
        v = c.execute("SELECT id FROM conversations WHERE user_a=? AND user_b=?", (a, b)).fetchone()
        if not v: return []
        c.execute("UPDATE messages SET is_read=1 WHERE conv_id=? AND sender_id=?", (v[0], other))
        return c.execute("SELECT sender_id,body,created_at FROM messages WHERE conv_id=? ORDER BY id", (v[0],)).fetchall()

def unread_totals(uid):
    with get_conn() as c:
        n = c.execute("SELECT COUNT(*) FROM notifications WHERE user_id=? AND is_read=0", (uid,)).fetchone()[0]
        m = c.execute("SELECT COUNT(*) FROM messages m JOIN conversations v ON v.id=m.conv_id WHERE m.sender_id!=? AND m.is_read=0 AND ? IN (v.user_a,v.user_b)", (uid, uid)).fetchone()[0]
    return n, m
