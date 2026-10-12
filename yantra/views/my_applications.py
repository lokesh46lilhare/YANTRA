import streamlit as st
from services import job_service as js
from utils.ui_components import badge

def render(user):
    st.header("📋 My Applications")
    rows = js.my_applications(user["id"])
    if not rows: st.info("No applications yet. Use Find Work to apply.")
    for a in rows:
        with st.container(border=True):
            st.write(f"{badge(a['status'])} **{a['title']}** · {a['village']}, {a['block']} · ₹{a['wage']} · {a['status']} · {a['applied_at']}")
            if a["status"] in ("Pending", "Shortlisted") and st.button("Withdraw", key=f"w{a['id']}"):
                js.withdraw(a["id"], user["id"]); st.rerun()
