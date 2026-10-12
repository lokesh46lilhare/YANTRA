import streamlit as st
from services import professional_service as ps

def render(user):
    st.header("💼 Engineering Jobs & Internships")
    st.caption("Sample listings are DEMO data. Resumes are stored privately and visible only to the employer you apply to.")
    tabs = st.tabs(["Browse", "My applications"] + (["Post & manage"] if user and user["role"] == "employer" else []))
    with tabs[0]:
        c1, c2, c3 = st.columns(3)
        rows = ps.search_jobs({"type": c1.selectbox("Type", ["All"] + ps.TYPES), "loc": c2.text_input("Location"), "text": c3.text_input("Title")})
        if not rows: st.warning("No jobs found.")
        for j in rows:
            with st.container(border=True):
                st.markdown(f"**{j['title']}** `DEMO` · {j['job_type']} · 📍 {j['location']} · {j['salary']} · {j['employer']}")
                with st.expander("Details & apply"):
                    st.write(j["description"])
                    if not user: st.info("Login to apply")
                    else:
                        rf = st.file_uploader("Resume PDF (optional if profile/resume saved)", ["pdf"], key=f"rf{j['id']}")
                        if st.button("Apply", key=f"pa{j['id']}", type="primary"): ok, m = ps.apply(user, j["id"], rf); (st.success if ok else st.error)(m)
    with tabs[1]:
        if not user: st.info("Login to see applications")
        else:
            for a in ps.my_apps(user["id"]): st.write(f"**{a['title']}** · *{a['status']}* · {a['applied_at']}")
    if len(tabs) > 2:
        with tabs[2]:
            with st.form("pj", clear_on_submit=True):
                t = st.text_input("Title"); ty = st.selectbox("Type", ps.TYPES, key="pjt"); lo = st.text_input("Location"); sa = st.text_input("Salary / stipend"); d = st.text_area("Description")
                if st.form_submit_button("Post job", type="primary"):
                    e = ps.create_pro_job(user, dict(title=t, job_type=ty, location=lo, salary=sa, description=d)); st.error(e) if e else st.success("Posted")
            for j, apps in ps.employer_jobs(user["id"]):
                with st.expander(f"{j['title']} · {len(apps)} applicants"):
                    for a in apps:
                        st.write(f"**{a['name']}** · *{a['status']}*")
                        cols = st.columns(4)
                        for col, s in zip(cols, ["Shortlisted", "Accepted", "Rejected"]):
                            if col.button(s, key=f"{s}{a['id']}"): ps.set_app_status(a["id"], user["id"], s); st.rerun()
                        rb = ps.resume_bytes(a["id"], user["id"])
                        if rb: cols[3].download_button("Resume", rb, f"resume_{a['id']}.pdf", key=f"dl{a['id']}")
