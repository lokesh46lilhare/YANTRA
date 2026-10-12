import streamlit as st
from services.admin_service import locations_list, create_report
from database.seed_data import CATS
from services import job_service as js

def render(user):
    st.header("👷 Jobs & Applicants")
    t1, t2 = st.tabs(["Post a job", "My jobs & applicants"])
    with t1, st.form("job"):
        title = st.text_input("Job title"); cat = st.selectbox("Category", CATS); desc = st.text_area("Description")
        n = st.number_input("Workers required", 1, 500, 1); wage = st.number_input("Wage ₹", 0, 100000, 500, 50)
        ptype = st.selectbox("Payment type", ["Daily", "Weekly", "Monthly", "Project"]); loc = st.selectbox("District / Block", locations_list(), format_func=lambda x: f"{x[1]}, {x[0]}")
        vil = st.text_input("Village / worksite"); start = st.date_input("Start date"); dur = st.text_input("Duration", "1 month")
        hrs = st.text_input("Daily hours", "8 hours"); exp = st.number_input("Experience (years)", 0, 40, 0)
        food = st.checkbox("Food provided"); stay = st.checkbox("Accommodation provided"); safety = st.text_input("Safety requirements")
        lat = st.number_input("Worksite latitude (optional, 0 = none)", -90.0, 90.0, 0.0, format="%.4f"); lng = st.number_input("Worksite longitude (optional, 0 = none)", -180.0, 180.0, 0.0, format="%.4f")
        if st.form_submit_button("Post job", type="primary"):
            err = js.create_job(user["id"], dict(title=title, category=cat, description=desc, workers_needed=n, district=loc[0], block=loc[1],
                village=vil, wage=wage, payment_type=ptype, start_date=str(start), duration=dur, hours=hrs, experience=exp,
                food=int(food), accommodation=int(stay), safety=safety, lat=lat or None, lng=lng or None))
            st.error(err) if err else st.success("Job posted")
    with t2:
        for j in js.owner_jobs(user["id"]):
            with st.expander(f"{j['title']} · {j['status']} · {j['apps']} applicants"):
                nxt = "Closed" if j["status"] == "Open" else "Open"
                if st.button("Close job" if nxt == "Closed" else "Reopen job", key=f"s{j['id']}"):
                    js.set_job_status(j["id"], user["id"], nxt); st.rerun()
                for a in js.applicants(j["id"], user["id"]):
                    st.write(f"**{a['name']}** · {a['primary_skill']} · {a['experience_years']} yrs · {a['locality']} · *{a['status']}*")
                    cols = st.columns(3)
                    for col, s in zip(cols, ["Shortlisted", "Accepted", "Rejected"]):
                        if col.button(s, key=f"{s}{a['id']}"): js.set_app_status(a["id"], user["id"], s); st.rerun()
