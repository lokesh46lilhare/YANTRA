import streamlit as st
import plotly.express as px
from services import admin_service as ad

def render(user):
    if not user or user["role"] != "admin": st.error("Administrator access required."); return
    st.header("🛡️ Admin Dashboard")
    tabs = st.tabs(["Overview", "Users", "Reports", "Listings", "Activity & audit", "Exports", "Locations"])
    with tabs[0]:
        sts = ad.stats(user); cols = st.columns(3)
        for i, (k, v) in enumerate(sts.items()): cols[i % 3].metric(k, v)
        for title in ad.CHARTS:
            d = ad.chart_data(user, title)
            if len(d): st.plotly_chart(px.bar(d, x=d.columns[0], y="n", title=title, color_discrete_sequence=["#0b3d91"]), use_container_width=True)
    with tabs[1]:
        q = st.text_input("Search name or mobile"); d = ad.search_users(user, q); st.dataframe(d, use_container_width=True, hide_index=True)
        if len(d):
            sel = st.selectbox("Account", d.to_dict("records"), format_func=lambda r: f"#{r['id']} {r['name']} ({r['role']}, {r['status']})")
            new = "suspended" if sel["status"] == "active" else "active"
            if st.checkbox(f"Confirm: set {sel['name']} to {new}") and st.button("Apply", type="primary"):
                e = ad.set_user_status(user, int(sel["id"]), new); st.error(e) if e else st.rerun()
            msg = st.text_input("In-app notice to this user (notification only, no SMS/WhatsApp)")
            if st.button("Send notice") and msg.strip(): ad.notify_user(user, int(sel["id"]), msg); st.success("Notification saved in-app")
    with tabs[2]:
        r = ad.open_reports(user)
        if not len(r): st.info("No open reports.")
        for x in r.to_dict("records"):
            with st.container(border=True):
                st.write(f"**{x['target_type'].title()}:** {x['title']} ({x['job_status']}) · by {x['reporter']}"); st.write(x["reason"])
                note = st.text_input("Resolution note", key=f"n{x['id']}"); a, b = st.columns(2)
                if a.button("Take action (close/hide/suspend) & resolve", key=f"c{x['id']}", type="primary"): ad.resolve_report(user, x["id"], True, note); st.rerun()
                if b.button("Dismiss", key=f"d{x['id']}"): ad.resolve_report(user, x["id"], False, note); st.rerun()
    with tabs[3]:
        st.subheader("Recent jobs")
        for j in ad.df("SELECT id,title,status,is_demo FROM jobs ORDER BY id DESC LIMIT 15").to_dict("records"):
            a, b = st.columns([4, 1]); a.write(f"#{j['id']} {j['title']} · {j['status']}")
            if j["status"] == "Open" and b.button("Close", key=f"cj{j['id']}"): ad.close_job(user, j["id"]); st.rerun()
        st.subheader("Equipment")
        for e in ad.df("SELECT id,name,available FROM equipment_listings ORDER BY id DESC LIMIT 15").to_dict("records"):
            a, b = st.columns([4, 1]); a.write(f"#{e['id']} {e['name']} · {'live' if e['available'] else 'hidden'}")
            if b.button("Hide" if e["available"] else "Show", key=f"eq{e['id']}"): ad.set_equipment(user, e["id"], 1 - e["available"]); st.rerun()
    with tabs[4]:
        st.subheader("Platform activity"); st.dataframe(ad.activity(user), use_container_width=True, hide_index=True)
        st.subheader("Audit log"); st.dataframe(ad.audit(user), use_container_width=True, hide_index=True)
    with tabs[5]:
        name = st.selectbox("Report", list(ad.EXPORTS))
        if st.button("Prepare CSV"): st.session_state["csv"] = (name, ad.export_csv(user, name))
        if st.session_state.get("csv"): st.download_button(f"Download {st.session_state['csv'][0]}.csv", st.session_state["csv"][1], f"{st.session_state['csv'][0]}.csv", "text/csv")
        if st.button("Prepare PDF summary"):
            try: st.session_state["pdf"] = ad.pdf_summary(user)
            except ImportError: st.warning("PDF export needs the optional package: pip install reportlab")
        if st.session_state.get("pdf"): st.download_button("Download summary.pdf", st.session_state["pdf"], "yantra_summary.pdf", "application/pdf")
        st.caption("Exports exclude passwords and contact details. Each export is audit-logged.")
    with tabs[6]:
        with st.form("loc", clear_on_submit=True):
            d = st.text_input("District"); b = st.text_input("Block / locality")
            if st.form_submit_button("Add location"):
                e = ad.add_location(user, d, b); st.error(e) if e else st.success("Location added (available in District/Block filters, job posting and registration)")
