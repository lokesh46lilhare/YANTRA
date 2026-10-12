import streamlit as st
from services import professional_service as ps

def render(user):
    st.header("🧑‍💼 Engineer Network")
    t1, t2, t3, t4 = st.tabs(["Directory", "My profile", "Connections", "Feed"])
    with t1:
        c1, c2 = st.columns(2)
        for p in ps.search_pros({"spec": c1.selectbox("Specialization", ["All"] + ps.SPECS), "text": c2.text_input("Skill / headline")}, user["id"]):
            with st.container(border=True):
                st.markdown(f"**{p['name']}** · {p['headline'] or ''} · {p['specialization'] or ''} · {p['experience_years']} yrs · 📍 {p['locality']}")
                st.caption(f"Skills: {p['skills'] or '-'} · {'Available' if p['available'] else 'Not available'}")
                if st.button("Connect", key=f"cn{p['id']}"): ok, m = ps.connect(user, p["id"]); (st.success if ok else st.error)(m)
    with t2:
        p = ps.get_profile(user["id"])
        with st.form("pp"):
            h = st.text_input("Headline", p["headline"] or ""); sp = st.selectbox("Specialization", ps.SPECS, ps.SPECS.index(p["specialization"]) if p["specialization"] in ps.SPECS else 0)
            sk = st.text_input("Skills (comma-separated)", p["skills"] or ""); ql = st.text_input("Qualifications", p["qualifications"] or "")
            ex = st.number_input("Experience (years)", 0, 50, p["experience_years"] or 0); po = st.text_area("Portfolio / project history", p["portfolio"] or "")
            av = st.checkbox("Available for work", bool(p["available"])); rf = st.file_uploader("Resume (PDF, max 2 MB)", ["pdf"])
            if st.form_submit_button("Save", type="primary"):
                e = ps.update_profile(user["id"], dict(headline=h, specialization=sp, skills=sk, qualifications=ql, experience_years=ex, portfolio=po, available=int(av)), rf)
                st.error(e) if e else st.success("Profile saved")
    with t3:
        for r in ps.pending_requests(user["id"]):
            st.write(f"**{r['name']}** wants to connect")
            a, b = st.columns(2)
            if a.button("Accept", key=f"ca{r['id']}"): ps.respond(r["id"], user, True); st.rerun()
            if b.button("Decline", key=f"cd{r['id']}"): ps.respond(r["id"], user, False); st.rerun()
        st.subheader("My connections")
        for c in ps.connections(user["id"]): st.write("• " + c["name"])
    with t4:
        with st.form("post", clear_on_submit=True):
            b = st.text_area("Share an update (max 500 chars)")
            if st.form_submit_button("Post"):
                e = ps.post(user["id"], b); st.error(e) if e else st.rerun()
        for r, cm in ps.feed(user["id"]):
            with st.container(border=True):
                st.write(f"**{r['name']}** · {r['created_at']}"); st.write(r["body"])
                if st.button(f"👍 {r['likes']}" + (" (liked)" if r["mine"] else ""), key=f"l{r['id']}"): ps.like(r["id"], user["id"]); st.rerun()
                for c in cm: st.caption(f"💬 {c['name']}: {c['body']}")
                cb = st.text_input("Comment", key=f"cb{r['id']}")
                if st.button("Comment", key=f"cm{r['id']}"): ps.comment(r["id"], user["id"], cb); st.rerun()
