import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from database.connection import get_conn
from utils.validators import valid_mobile, valid_email, valid_password
ROLES = ["worker", "contractor", "employer", "equipment_owner", "engineer"]

def register(name, mobile, email, password, role, district, locality, accepted):
    errs = []
    if not name.strip(): errs.append("Name required")
    if not valid_mobile(mobile): errs.append("Enter a valid 10-digit Indian mobile number")
    if not valid_email(email): errs.append("Invalid email")
    if not valid_password(password): errs.append("Password must be at least 8 characters")
    if role not in ROLES: errs.append("Invalid account type")
    if not accepted: errs.append("Accept terms and privacy policy")
    if errs: return errs
    try:
        with get_conn() as c:
            uid = c.execute("INSERT INTO users(name,mobile,email,password_hash,role,district,locality) VALUES(?,?,?,?,?,?,?)",
                            (name.strip(), mobile, email or None, generate_password_hash(password), role, district, locality)).lastrowid
            if role == "worker": c.execute("INSERT INTO worker_profiles(user_id) VALUES(?)", (uid,))
            if role == "engineer": c.execute("INSERT INTO professional_profiles(user_id) VALUES(?)", (uid,))
    except sqlite3.IntegrityError:
        return ["This mobile number is already registered"]
    return []

def login(mobile, password):
    with get_conn() as c:
        u = c.execute("SELECT * FROM users WHERE mobile=?", (mobile,)).fetchone()
    if not u or not check_password_hash(u["password_hash"], password): return None, "Invalid mobile number or password"
    if u["status"] != "active": return None, "Account suspended"
    return {k: u[k] for k in ("id", "name", "mobile", "role", "district", "locality")}, ""

def change_password(uid, old, new):
    if not valid_password(new): return "New password must be at least 8 characters"
    with get_conn() as c:
        u = c.execute("SELECT password_hash FROM users WHERE id=?", (uid,)).fetchone()
        if not check_password_hash(u["password_hash"], old): return "Current password is wrong"
        c.execute("UPDATE users SET password_hash=? WHERE id=?", (generate_password_hash(new), uid))
    return ""

def is_active(uid):
    with get_conn() as c:
        r = c.execute("SELECT status FROM users WHERE id=?", (uid,)).fetchone()
    return bool(r and r[0] == "active")
