from database.connection import get_conn
SCHEMA = """
CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, name TEXT NOT NULL, mobile TEXT UNIQUE NOT NULL,
 email TEXT, password_hash TEXT NOT NULL, role TEXT NOT NULL, district TEXT, locality TEXT,
 status TEXT DEFAULT 'active', is_demo INTEGER DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS worker_profiles(user_id INTEGER PRIMARY KEY REFERENCES users(id),
 primary_skill TEXT, experience_years INTEGER DEFAULT 0, preferred_wage INTEGER, availability TEXT DEFAULT 'Available today',
 block TEXT, village TEXT, intro TEXT);
CREATE TABLE IF NOT EXISTS jobs(id INTEGER PRIMARY KEY, owner_id INTEGER NOT NULL REFERENCES users(id),
 title TEXT NOT NULL, category TEXT NOT NULL, description TEXT, workers_needed INTEGER NOT NULL, district TEXT,
 block TEXT, village TEXT, wage INTEGER NOT NULL, payment_type TEXT, start_date TEXT, duration TEXT, hours TEXT,
 experience INTEGER DEFAULT 0, food INTEGER DEFAULT 0, accommodation INTEGER DEFAULT 0, safety TEXT,
 status TEXT DEFAULT 'Open', is_demo INTEGER DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS job_applications(id INTEGER PRIMARY KEY, job_id INTEGER NOT NULL REFERENCES jobs(id),
 worker_id INTEGER NOT NULL REFERENCES users(id), status TEXT DEFAULT 'Pending',
 applied_at TEXT DEFAULT CURRENT_TIMESTAMP, UNIQUE(job_id, worker_id));
CREATE TABLE IF NOT EXISTS notifications(id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id),
 message TEXT, is_read INTEGER DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS audit_logs(id INTEGER PRIMARY KEY, actor_id INTEGER, action TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS work_invitations(id INTEGER PRIMARY KEY, owner_id INTEGER NOT NULL REFERENCES users(id),
 worker_id INTEGER NOT NULL REFERENCES users(id), job_id INTEGER NOT NULL REFERENCES jobs(id), note TEXT, status TEXT DEFAULT 'Pending',
 created_at TEXT DEFAULT CURRENT_TIMESTAMP, UNIQUE(owner_id, worker_id, job_id));
CREATE TABLE IF NOT EXISTS saved_workers(owner_id INTEGER NOT NULL REFERENCES users(id), worker_id INTEGER NOT NULL REFERENCES users(id), PRIMARY KEY(owner_id, worker_id));
CREATE TABLE IF NOT EXISTS conversations(id INTEGER PRIMARY KEY, user_a INTEGER NOT NULL REFERENCES users(id), user_b INTEGER NOT NULL REFERENCES users(id), UNIQUE(user_a, user_b));
CREATE TABLE IF NOT EXISTS messages(id INTEGER PRIMARY KEY, conv_id INTEGER NOT NULL REFERENCES conversations(id), sender_id INTEGER NOT NULL REFERENCES users(id),
 body TEXT NOT NULL, is_read INTEGER DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS ix_msg_conv ON messages(conv_id, is_read);
CREATE TABLE IF NOT EXISTS equipment_listings(id INTEGER PRIMARY KEY, owner_id INTEGER NOT NULL REFERENCES users(id), name TEXT NOT NULL, category TEXT,
 description TEXT, rate INTEGER NOT NULL, rate_type TEXT NOT NULL, quantity INTEGER NOT NULL, locality TEXT, available INTEGER DEFAULT 1, image_path TEXT,
 is_demo INTEGER DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS rental_bookings(id INTEGER PRIMARY KEY, listing_id INTEGER NOT NULL REFERENCES equipment_listings(id), renter_id INTEGER NOT NULL REFERENCES users(id),
 start_date TEXT, end_date TEXT, qty INTEGER, total INTEGER, status TEXT DEFAULT 'Pending', created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS professional_profiles(user_id INTEGER PRIMARY KEY REFERENCES users(id), headline TEXT, specialization TEXT, skills TEXT,
 qualifications TEXT, experience_years INTEGER DEFAULT 0, portfolio TEXT, available INTEGER DEFAULT 1, resume_path TEXT);
CREATE TABLE IF NOT EXISTS professional_connections(id INTEGER PRIMARY KEY, requester_id INTEGER NOT NULL REFERENCES users(id), receiver_id INTEGER NOT NULL REFERENCES users(id),
 status TEXT DEFAULT 'Pending', UNIQUE(requester_id, receiver_id));
CREATE TABLE IF NOT EXISTS professional_posts(id INTEGER PRIMARY KEY, author_id INTEGER NOT NULL REFERENCES users(id), body TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS post_likes(post_id INTEGER REFERENCES professional_posts(id), user_id INTEGER REFERENCES users(id), PRIMARY KEY(post_id, user_id));
CREATE TABLE IF NOT EXISTS post_comments(id INTEGER PRIMARY KEY, post_id INTEGER REFERENCES professional_posts(id), user_id INTEGER REFERENCES users(id), body TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS pro_jobs(id INTEGER PRIMARY KEY, employer_id INTEGER NOT NULL REFERENCES users(id), title TEXT NOT NULL, job_type TEXT, location TEXT, description TEXT,
 salary TEXT, status TEXT DEFAULT 'Open', is_demo INTEGER DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS pro_applications(id INTEGER PRIMARY KEY, job_id INTEGER NOT NULL REFERENCES pro_jobs(id), applicant_id INTEGER NOT NULL REFERENCES users(id),
 resume_path TEXT, status TEXT DEFAULT 'Pending', applied_at TEXT DEFAULT CURRENT_TIMESTAMP, UNIQUE(job_id, applicant_id));
CREATE INDEX IF NOT EXISTS ix_equip ON equipment_listings(category, locality);
CREATE TABLE IF NOT EXISTS reports(id INTEGER PRIMARY KEY, reporter_id INTEGER NOT NULL REFERENCES users(id), target_type TEXT NOT NULL, target_id INTEGER NOT NULL,
 reason TEXT, status TEXT DEFAULT 'Open', resolved_by INTEGER, resolution TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP, UNIQUE(reporter_id, target_type, target_id));
CREATE TABLE IF NOT EXISTS locations(id INTEGER PRIMARY KEY, district TEXT NOT NULL, block TEXT NOT NULL, UNIQUE(district, block));
CREATE INDEX IF NOT EXISTS ix_jobs_search ON jobs(status, category, district, block);
CREATE INDEX IF NOT EXISTS ix_apps_worker ON job_applications(worker_id);
"""
def init_db():
    with get_conn() as c:
        c.executescript(SCHEMA)
        for tbl, adds in {"worker_profiles": (("show_wage", "INTEGER DEFAULT 1"), ("photo_path", "TEXT"), ("radius_km", "INTEGER DEFAULT 10")),
                          "jobs": (("lat", "REAL"), ("lng", "REAL"))}.items():
            cols = {r[1] for r in c.execute(f"PRAGMA table_info({tbl})")}
            for col, ddl in adds:
                if col not in cols: c.execute(f"ALTER TABLE {tbl} ADD COLUMN {col} {ddl}")
