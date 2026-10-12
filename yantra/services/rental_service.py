import math, os, uuid
from datetime import date, timedelta
from PIL import Image
from database.connection import get_conn
from services.job_service import notify
CATS = ["Construction equipment", "Civil engineering equipment", "Electrical equipment", "Mechanical equipment", "IT equipment", "Surveying equipment", "Tools and machinery"]

def save_image(f, folder="equipment"):
    if f is None: return None, ""
    if f.size > 2_000_000: return None, "Image must be under 2 MB"
    try:
        Image.open(f).verify(); f.seek(0); im = Image.open(f).convert("RGB"); im.thumbnail((800, 800))
    except Exception: return None, "Invalid image file"
    os.makedirs(f"uploads/{folder}", exist_ok=True); p = f"uploads/{folder}/{uuid.uuid4().hex}.jpg"; im.save(p, "JPEG"); return p, ""

def estimate(rate, rtype, s, e, qty):
    d = (e - s).days + 1
    return (d if rtype == "Daily" else math.ceil(d / 7) if rtype == "Weekly" else math.ceil(d / 30)) * rate * qty

def add_listing(user, d):
    if user["role"] != "equipment_owner": return "Only equipment owners can list equipment"
    if not d["name"].strip() or d["rate"] <= 0 or d["quantity"] <= 0: return "Name, rate and quantity must be valid"
    with get_conn() as c: c.execute(f"INSERT INTO equipment_listings(owner_id,{','.join(d)}) VALUES(?,{','.join('?' * len(d))})", [user["id"], *d.values()])
    return ""

def search(f):
    q, p = "SELECT e.*,u.name AS owner FROM equipment_listings e JOIN users u ON u.id=e.owner_id WHERE e.available=1", []
    if f.get("category") not in (None, "All"): q += " AND e.category=?"; p.append(f["category"])
    if f.get("locality"): q += " AND e.locality LIKE ?"; p.append(f"%{f['locality']}%")
    if f.get("name"): q += " AND e.name LIKE ?"; p.append(f"%{f['name']}%")
    with get_conn() as c: return c.execute(q + " ORDER BY e.id DESC LIMIT 30", p).fetchall()

def my_listings(uid):
    with get_conn() as c: return c.execute("SELECT * FROM equipment_listings WHERE owner_id=? ORDER BY id DESC", (uid,)).fetchall()

def toggle_available(lid, uid):
    with get_conn() as c: c.execute("UPDATE equipment_listings SET available=1-available WHERE id=? AND owner_id=?", (lid, uid))

def free_qty(c, lid, s, e, exclude=None):
    q = c.execute("SELECT quantity FROM equipment_listings WHERE id=?", (lid,)).fetchone()[0]
    rows = c.execute("SELECT start_date,end_date,qty FROM rental_bookings WHERE listing_id=? AND status='Accepted' AND start_date<=? AND end_date>=? AND id IS NOT ?", (lid, str(e), str(s), exclude)).fetchall()
    peak, d = 0, s
    while d <= e:
        peak = max(peak, sum(r["qty"] for r in rows if r["start_date"] <= str(d) <= r["end_date"])); d += timedelta(1)
    return q - peak

def request_booking(user, lid, s, e, qty):
    if not user: return False, "Login to request a rental"
    if s < date.today() or e < s: return False, "Choose valid dates (start today or later, end on/after start)"
    with get_conn() as c:
        l = c.execute("SELECT * FROM equipment_listings WHERE id=?", (lid,)).fetchone()
        if not l or not l["available"]: return False, "Listing not available"
        if l["owner_id"] == user["id"]: return False, "You cannot rent your own equipment"
        if qty < 1 or qty > free_qty(c, lid, s, e): return False, "Not enough units free for those dates"
        c.execute("INSERT INTO rental_bookings(listing_id,renter_id,start_date,end_date,qty,total) VALUES(?,?,?,?,?,?)", (lid, user["id"], str(s), str(e), qty, estimate(l["rate"], l["rate_type"], s, e, qty)))
        notify(c, l["owner_id"], f"Rental request from {user['name']} for {l['name']}")
    return True, "Request sent (Pending). Payment is simulated in this demo."

def my_bookings(uid):
    with get_conn() as c: return c.execute("SELECT b.*,l.name FROM rental_bookings b JOIN equipment_listings l ON l.id=b.listing_id WHERE b.renter_id=? ORDER BY b.id DESC", (uid,)).fetchall()

def cancel(bid, uid):
    with get_conn() as c: c.execute("UPDATE rental_bookings SET status='Cancelled' WHERE id=? AND renter_id=? AND status IN ('Pending','Accepted') AND start_date>?", (bid, uid, str(date.today())))

def owner_requests(uid):
    with get_conn() as c: return c.execute("SELECT b.*,l.name,u.name AS renter FROM rental_bookings b JOIN equipment_listings l ON l.id=b.listing_id JOIN users u ON u.id=b.renter_id WHERE l.owner_id=? ORDER BY b.id DESC", (uid,)).fetchall()

def decide(bid, uid, status):
    with get_conn() as c:
        b = c.execute("SELECT b.*,l.name FROM rental_bookings b JOIN equipment_listings l ON l.id=b.listing_id WHERE b.id=? AND l.owner_id=?", (bid, uid)).fetchone()
        if not b: return "Not allowed"
        ok = {"Accepted": "Pending", "Rejected": "Pending", "Completed": "Accepted"}[status]
        if b["status"] != ok: return f"Booking is {b['status']}"
        if status == "Accepted" and b["qty"] > free_qty(c, b["listing_id"], date.fromisoformat(b["start_date"]), date.fromisoformat(b["end_date"]), bid): return "Would exceed inventory"
        c.execute("UPDATE rental_bookings SET status=? WHERE id=?", (status, bid))
        notify(c, b["renter_id"], f"Your rental request for {b['name']} was {status.lower()}")
    return ""
