import streamlit as st
from services import job_service as js
def render(user):
    st.header("🔔 Notifications")
    rows = js.notifications(user["id"])
    if not rows: st.info("No notifications.")
    for n in rows: st.write(f"• {n['message']} — _{n['created_at']}_")
