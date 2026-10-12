import streamlit as st
from datetime import date, timedelta
from services import rental_service as rs
from services.admin_service import create_report

def render(user):
    st.header("🏗️ Equipment Rental")
    st.caption("Payments are simulated in this demo. Listings marked DEMO are sample data.")
    tabs = st.tabs(["Browse", "My bookings"] + (["My listings & requests"] if user and user["role"] == "equipment_owner" else []))
    with tabs[0]:
        c1, c2, c3 = st.columns(3)
        f = {"name": c1.text_input("Name"), "category": c2.selectbox("Category", ["All"] + rs.CATS), "locality": c3.text_input("Location")}
        rows = rs.search(f)
        if not rows: st.warning("No equipment found.")
        for e in rows:
            with st.container(border=True):
                if e["image_path"]: st.image(e["image_path"], width=200)
                st.markdown(f"**{e['name']}** `DEMO` · {e['category']} · 📍 {e['locality']} · ₹{e['rate']}/{e['rate_type']} · {e['quantity']} units · {e['owner']}")
                with st.expander("Details & rent"):
                    st.write(e["description"])
                    a, b, q = st.columns(3)
                    s = a.date_input("From", date.today(), key=f"s{e['id']}"); en = b.date_input("To", date.today() + timedelta(2), key=f"e{e['id']}")
                    n = q.number_input("Qty", 1, e["quantity"], 1, key=f"q{e['id']}")
                    if en >= s: st.info(f"Estimated: ₹{rs.estimate(e['rate'], e['rate_type'], s, en, n)} (simulated payment)")
                    if st.button("Request rental", key=f"r{e['id']}", type="primary"):
                        ok, m = rs.request_booking(user, e["id"], s, en, n); (st.success if ok else st.error)(m)
                    if user:
                        with st.popover("Report listing"):
                            rr = st.text_input("Reason", key=f"er{e['id']}")
                            if st.button("Submit report", key=f"es{e['id']}"): st.success("Report submitted") if create_report(user, "equipment", e["id"], rr) else st.error("Enter a reason")
    with tabs[1]:
        if not user: st.info("Login to see bookings")
        else:
            for b in rs.my_bookings(user["id"]):
                st.write(f"**{b['name']}** · {b['start_date']} → {b['end_date']} · {b['qty']} units · ₹{b['total']} · *{b['status']}*")
                if b["status"] in ("Pending", "Accepted") and b["start_date"] > str(date.today()) and st.button("Cancel", key=f"c{b['id']}"):
                    rs.cancel(b["id"], user["id"]); st.rerun()
    if len(tabs) > 2:
        with tabs[2]:
            with st.form("el", clear_on_submit=True):
                n = st.text_input("Equipment name"); cat = st.selectbox("Category", rs.CATS, key="elc"); d = st.text_area("Description")
                r = st.number_input("Rate ₹", 0, 1000000, 500, 50); rt = st.selectbox("Rate type", ["Daily", "Weekly", "Monthly"])
                qn = st.number_input("Quantity", 1, 500, 1); loc = st.text_input("Location"); img = st.file_uploader("Image", ["png", "jpg", "jpeg"])
                if st.form_submit_button("Add listing", type="primary"):
                    p, err = rs.save_image(img)
                    err = err or rs.add_listing(user, dict(name=n, category=cat, description=d, rate=r, rate_type=rt, quantity=qn, locality=loc, image_path=p))
                    st.error(err) if err else st.success("Listing added")
            for l in rs.my_listings(user["id"]):
                if st.button(f"{'Pause' if l['available'] else 'Activate'}: {l['name']}", key=f"t{l['id']}"): rs.toggle_available(l["id"], user["id"]); st.rerun()
            st.subheader("Requests")
            for b in rs.owner_requests(user["id"]):
                st.write(f"**{b['name']}** · {b['renter']} · {b['start_date']} → {b['end_date']} · {b['qty']} · ₹{b['total']} · *{b['status']}*")
                for s, lab in {"Pending": [("Accepted", "Accept"), ("Rejected", "Reject")], "Accepted": [("Completed", "Mark completed")]}.get(b["status"], []):
                    if st.button(lab, key=f"{s}{b['id']}"):
                        e = rs.decide(b["id"], user["id"], s)
                        st.error(e) if e else st.rerun()
