import os, random
from datetime import date, timedelta
from werkzeug.security import generate_password_hash
from database.connection import get_conn, DB_PATH
from database.schema import init_db
BLOCKS = {"Balaghat": ["Rampayli", "Garra"], "Baihar": ["Baihar", "Malajkhand"], "Birsa": ["Birsa", "Tirodi"],
          "Katangi": ["Katangi", "Tumsar"], "Waraseoni": ["Waraseoni", "Lalbarra"], "Lanji": ["Lanji", "Kirnapur"]}
CATS = ["Construction helper", "Raj Mistri", "Electrician", "Plumber", "Painter", "Tile installer", "Carpenter",
        "Welder", "Bar bender", "Shuttering carpenter", "Fitter", "HVAC technician", "Machine operator", "Civil engineer", "Other skilled work"]
NAMES = ["Ramesh Uikey", "Sunita Bai", "Mohan Patle", "Geeta Markam", "Dinesh Kanwar", "Pooja Meshram", "Arjun Bisen", "Kavita Dhurve",
         "Sanjay Raut", "Lalita Netam", "Vikas Thakre", "Meena Sahu", "Rajesh Yadav", "Anita Bhalavi", "Suresh Parte", "Hemant Chourey",
         "Kiran Barmaiya", "Deepak Nagpure", "Rakesh Tekam", "Seema Katre"]
def seed():
    init_db()
    with get_conn() as c:
        if c.execute("SELECT COUNT(*) FROM users").fetchone()[0]:
            return
        r = random.Random(42)
        pw = generate_password_hash(os.getenv("DEMO_PASSWORD", "Demo@1234"))
        def user(name, mobile, role):
            return c.execute("INSERT INTO users(name,mobile,password_hash,role,district,locality,is_demo) VALUES(?,?,?,?,?,?,1)",
                             (name, mobile, pw, role, "Balaghat", r.choice(list(BLOCKS)))).lastrowid
        workers = []
        for i in range(15):
            uid = user(NAMES[i], f"90000{i+1:05d}", "worker"); workers.append(uid)
            blk = r.choice(list(BLOCKS))
            c.execute("INSERT INTO worker_profiles(user_id,primary_skill,experience_years,preferred_wage,availability,block,village,intro) VALUES(?,?,?,?,?,?,?,?)", (uid, CATS[i % 8], r.randint(1, 12), r.choice([400, 500, 600, 800]),
                      r.choice(["Available today", "Available tomorrow", "Available this week"]), blk, r.choice(BLOCKS[blk]), "Demo profile"))
        owners = [user(f"{n} (Contractor)", f"90001{i+1:05d}", "contractor") for i, n in enumerate(NAMES[15:20])]
        for i in range(20):
            blk = r.choice(list(BLOCKS)); cat = CATS[i % len(CATS)]
            c.execute("""INSERT INTO jobs(owner_id,title,category,description,workers_needed,district,block,village,wage,payment_type,start_date,
              duration,hours,experience,food,accommodation,safety,is_demo) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1)""",
                      (owners[i % 5], f"{cat} needed - Site {i+1}", cat, "DEMO listing: not a real job.", r.randint(1, 10), "Balaghat", blk,
                       r.choice(BLOCKS[blk]), r.choice([450, 500, 600, 700, 900]), r.choice(["Daily", "Weekly", "Monthly", "Project"]),
                       str(date.today() + timedelta(days=r.randint(1, 20))), r.choice(["1 week", "1 month", "3 months"]), "8 hours",
                       r.randint(0, 5), r.randint(0, 1), r.randint(0, 1), "Helmet and shoes required"))
        for j in range(1, 11):
            for w in r.sample(workers, 2):
                c.execute("INSERT OR IGNORE INTO job_applications(job_id,worker_id,status) VALUES(?,?,?)", (j, w, r.choice(["Pending", "Shortlisted", "Accepted", "Rejected"])))
        c.execute("INSERT INTO notifications(user_id,message) VALUES(?,?)", (workers[0], "Welcome to YANTRA (demo notification)"))
if __name__ == "__main__":
    if os.path.exists(DB_PATH): os.remove(DB_PATH)
    seed(); print("Demo data reset.")

def seed_extras():
    with get_conn() as c:
        if c.execute("SELECT COUNT(*) FROM work_invitations").fetchone()[0] or not c.execute("SELECT 1 FROM jobs WHERE id=1").fetchone():
            return
        o = c.execute("SELECT owner_id FROM jobs WHERE id=1").fetchone()[0]
        c.execute("INSERT INTO work_invitations(owner_id,worker_id,job_id,note) VALUES(?,?,?,?)", (o, 2, 1, "DEMO invitation"))
        c.execute("INSERT INTO conversations(user_a,user_b) VALUES(?,?)", (2, o))
        c.execute("INSERT INTO messages(conv_id,sender_id,body) VALUES(1,?,?)", (o, "DEMO: Can you join next week?"))
        c.execute("INSERT INTO notifications(user_id,message) VALUES(?,?)", (2, "Work invitation received (demo)"))

def seed_phase3():
    with get_conn() as c:
        if c.execute("SELECT COUNT(*) FROM equipment_listings").fetchone()[0] or not c.execute("SELECT 1 FROM users").fetchone(): return
        pw = generate_password_hash(os.getenv("DEMO_PASSWORD", "Demo@1234"))
        def user(n, m, role): return c.execute("INSERT INTO users(name,mobile,password_hash,role,district,locality,is_demo) VALUES(?,?,?,?,?,?,1)", (n, m, pw, role, "Balaghat", "Balaghat")).lastrowid
        owners = [user("Anil Rathod (Equipment)", "9000400001", "equipment_owner"), user("Bharat Sonwane (Equipment)", "9000400002", "equipment_owner")]
        emps = [user("Nirmal Infra Pvt (Employer)", "9000300001", "employer"), user("Satpura Tech (Employer)", "9000300002", "employer")]
        pros = [user(n, f"90002{i+1:05d}", "engineer") for i, n in enumerate(["Aditi Joshi", "Manish Verma", "Neha Kuril", "Prakash Gaikwad", "Rohit Dongre"])]
        specs = ["Civil engineer", "Mechanical engineer", "Software developer", "AI/ML engineer", "Quantity surveyor"]
        for i, u in enumerate(pros):
            c.execute("INSERT INTO professional_profiles(user_id,headline,specialization,skills,qualifications,experience_years,portfolio) VALUES(?,?,?,?,?,?,?)", (u, f"{specs[i]} (demo)", specs[i], "AutoCAD, Python, Estimation", "B.E./B.Tech", i + 1, "Demo portfolio"))
            c.execute("INSERT INTO professional_posts(author_id,body) VALUES(?,?)", (u, f"DEMO post: sharing a site learning #{i+1}") if i < 3 else (u, "DEMO post: hello network!"))
        items = [("Concrete mixer", 0, 800, "Daily", 3), ("Plate compactor", 0, 1200, "Daily", 2), ("Concrete vibrator", 0, 400, "Daily", 4), ("Scaffolding set", 0, 3000, "Weekly", 10),
                 ("Welding machine", 3, 700, "Daily", 3), ("Generator 5kVA", 2, 1500, "Daily", 2), ("Water pump", 3, 500, "Daily", 5), ("Excavator", 0, 12000, "Daily", 1),
                 ("Total station", 5, 2500, "Daily", 1), ("Ladder & power tools kit", 6, 6000, "Monthly", 4)]
        for i, (n, cat, rate, rt, q) in enumerate(items):
            c.execute("INSERT INTO equipment_listings(owner_id,name,category,description,rate,rate_type,quantity,locality,is_demo) VALUES(?,?,?,?,?,?,?,?,1)", (owners[i % 2], n, ["Construction equipment", "Civil engineering equipment", "Electrical equipment", "Mechanical equipment", "IT equipment", "Surveying equipment", "Tools and machinery"][cat], "DEMO listing", rate, rt, q, "Balaghat"))
        c.execute("INSERT INTO rental_bookings(listing_id,renter_id,start_date,end_date,qty,total) VALUES(1,16,date('now','+3 day'),date('now','+5 day'),1,2400)")
        types = ["Fresher", "Internship", "Experienced", "Freelance", "Contract"]
        for i in range(10):
            c.execute("INSERT INTO pro_jobs(employer_id,title,job_type,location,description,salary,is_demo) VALUES(?,?,?,?,?,?,1)", (emps[i % 2], f"{specs[i % 5]} - {types[i % 5]} role", types[i % 5], "Balaghat / Remote", "DEMO listing: not a real job.", "₹15,000-40,000/month"))
        c.execute("INSERT INTO professional_connections(requester_id,receiver_id) VALUES(?,?)", (pros[1], pros[0]))

def seed_phase4():
    with get_conn() as c:
        if c.execute("SELECT 1 FROM users WHERE role='admin'").fetchone() or not c.execute("SELECT 1 FROM jobs WHERE id=3").fetchone(): return
        pw = generate_password_hash(os.getenv("DEMO_PASSWORD", "Demo@1234"))
        c.execute("INSERT INTO users(name,mobile,password_hash,role,district,locality,is_demo) VALUES('Demo Admin','9000500001',?,'admin','Balaghat','Balaghat',1)", (pw,))
        c.execute("INSERT OR IGNORE INTO reports(reporter_id,target_type,target_id,reason) VALUES(1,'job',3,'DEMO report: wage looks unrealistic')")
