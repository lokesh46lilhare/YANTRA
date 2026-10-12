import streamlit as st
from services.admin_service import block_list, create_report
from services import worker_service as ws, job_service as js
from services.admin_service import create_report

def render(user):
    st.header("👷 Hire Workers")
    if not user or user["role"] not in ("contractor", "employer"):
        st.info("Login as a contractor or employer to hire workers."); return
    t1, t2, t3 = st.tabs(["Directory", "Shortlist", "Sent invitations"])
    saved = ws.saved_ids(user["id"]); jobs = [j for j in js.owner_jobs(user["id"]) if j["status"] == "Open"]
    with t1:
        c1, c2 = st.columns(2)
        f = {"skill": c1.text_input("Skill"), "block": c2.selectbox("Locality", ["All"] + block_list()),
             "min_exp": c1.number_input("Min experience (yrs)", 0, 40, 0), "min_radius": c1.number_input("Willing to travel at least (km)", 0, 200, 0), "max_wage": c2.number_input("Max expected wage ₹ (0 = any)", 0, 5000, 0, 50),
             "availability": st.selectbox("Availability", ["All", "Available today", "Available tomorrow", "Available this week", "Currently unavailable"])}
        card_list(ws.search_workers(f), user, saved, jobs, "d")
    with t2:
        rows = [w for w in ws.search_workers({}, 200) if w["id"] in saved]
        card_list(rows, user, saved, jobs, "s") if rows else st.info("No saved workers yet.")
    with t3:
        rows = ws.sent_invitations(user["id"])
        if not rows: st.info("No invitations sent.")
        for r in rows: st.write(f"• **{r['name']}** · {r['title']} · *{r['status']}* · {r['created_at']}")

def card_list(rows, user, saved, jobs, pre):
    if not rows: st.warning("No workers match."); return
    for w in rows:
        with st.container(border=True):
            st.markdown(f"**{w['name']}** `DEMO` · {w['primary_skill']} · {w['experience_years']} yrs")
            st.write(f"📍 {w['locality']} · 🟢 {w['availability']} · {('₹' + str(w['preferred_wage']) + '/day') if w['show_wage'] else 'Wage on request'} · 🚶 up to {w['radius_km']} km · ☑ Verification: not verified (demo)")
            with st.expander("View Profile"): st.write(w["intro"] or "No introduction.")
            a, b = st.columns(2)
            if b.button("★ Saved" if w["id"] in saved else "☆ Save to Shortlist", key=f"{pre}sv{w['id']}"):
                ws.toggle_shortlist(user["id"], w["id"]); st.rerun()
            with b.popover("Report worker"):
                rr = st.text_input("Reason", key=f"{pre}rr{w['id']}")
                if st.button("Submit report", key=f"{pre}rs{w['id']}"): st.success("Report submitted") if create_report(user, "user", w["id"], rr) else st.error("Enter a reason")
            with a.popover("Send Work Invitation"):
                if not jobs: st.warning("Post an open job first.")
                else:
                    j = st.selectbox("Job", jobs, format_func=lambda x: x["title"], key=f"{pre}j{w['id']}")
                    note = st.text_input("Note", key=f"{pre}n{w['id']}")
                    if st.button("Send", key=f"{pre}i{w['id']}", type="primary"):
                        ok, msg = ws.invite(user, w["id"], j["id"], note); (st.success if ok else st.error)(msg)
