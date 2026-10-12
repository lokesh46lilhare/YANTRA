import streamlit as st
from services.admin_service import create_report, districts, blocks_for
from database.seed_data import CATS
from services import job_service as js
from utils.formatting import haversine_km

def render(user):
    st.header("🔨 Find Work")
    with st.expander("Filters", expanded=True):
        dist = st.selectbox("District", ["All"] + districts())
        c1, c2 = st.columns(2)
        f = {"title": c1.text_input("Job title"), "category": c2.selectbox("Category", ["All"] + CATS),
             "district": dist, "block": c1.selectbox("Block", ["All"] + blocks_for(dist)), "village": c2.text_input("Village"),
             "min_wage": c1.number_input("Min wage ₹", 0, step=50), "max_wage": c2.number_input("Max wage ₹ (0 = any)", 0, step=50),
             "payment_type": c1.selectbox("Payment", ["All", "Daily", "Weekly", "Monthly", "Project"]),
             "experience": c2.number_input("My experience (years)", 0, 40, 40), "food": st.checkbox("Food/accommodation provided")}
        f["max_wage"] = f["max_wage"] or None
        st.caption("Optional: enter your coordinates to see approximate distances. GPS is never required.")
        lat0 = st.number_input("My latitude", -90.0, 90.0, 0.0, format="%.4f"); lng0 = st.number_input("My longitude", -180.0, 180.0, 0.0, format="%.4f")
        max_km = st.number_input("Only jobs within (km) - needs my coordinates and job coordinates; 0 = off", 0, 500, 0)
    page = st.session_state.get("fw_page", 0)
    if lat0 and lng0 and max_km:
        allr, _ = js.search_jobs(f, 0, 500)
        allr = [j for j in allr if j["lat"] and j["lng"] and haversine_km(lat0, lng0, j["lat"], j["lng"]) <= max_km]
        n, rows = len(allr), allr[page * 8:(page + 1) * 8]
        st.caption("Distance filter on: jobs without coordinates are hidden. Distances are approximate straight-line.")
    else:
        rows, n = js.search_jobs(f, page)
    st.caption(f"{n} jobs found")
    if not rows: st.warning("No jobs match. Try fewer filters.")
    for j in rows:
        with st.container(border=True):
            st.markdown(f"**{j['title']}** `DEMO` · {j['owner']}")
            st.write(f"📍 {j['village']}, {j['block']} · 👷 {j['workers_needed']} needed · ₹{j['wage']} {j['payment_type']} · ⏱ {j['duration']}, {j['hours']}")
            if lat0 and lng0 and j["lat"] and j["lng"]: st.caption(f"≈ {haversine_km(lat0, lng0, j['lat'], j['lng']):.1f} km straight-line (approximate)")
            else: st.caption("Locality-based match only (no exact distance)")
            with st.expander("View Details"):
                st.write(j["description"]); st.write(f"Start: {j['start_date']} · Experience: {j['experience']}+ yrs · Food: {'Yes' if j['food'] else 'No'} · Stay: {'Yes' if j['accommodation'] else 'No'}")
                st.write(f"Safety: {j['safety']} · Posted: {j['created_at']} · Status: {j['status']}")
            if st.button("Apply for Job", key=f"ap{j['id']}", type="primary"):
                ok, msg = js.apply(j["id"], user)
                (st.success if ok else st.error)(msg)
            if user:
                with st.popover("Report listing"):
                    rr = st.text_input("Reason", key=f"rr{j['id']}")
                    if st.button("Submit report", key=f"rs{j['id']}"): st.success("Report submitted") if create_report(user, "job", j["id"], rr) else st.error("Enter a reason")
    p1, p2 = st.columns(2)
    if p1.button("◀ Prev", disabled=page == 0): st.session_state["fw_page"] = page - 1; st.rerun()
    if p2.button("Next ▶", disabled=(page + 1) * 8 >= n): st.session_state["fw_page"] = page + 1; st.rerun()
