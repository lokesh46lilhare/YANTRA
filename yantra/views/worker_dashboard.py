import streamlit as st
from datetime import date
from services import worker_service as ws

def render(user):
    st.header("📊 My Dashboard")
    d = ws.dashboard(user["id"], str(date.today())); p = d["profile"]
    if p["photo_path"]: st.image(p["photo_path"], width=90)
    av = ["Available today", "Available tomorrow", "Available this week", "Currently unavailable"]
    new = st.selectbox("Availability", av, av.index(p["availability"]))
    if new != p["availability"]: ws.set_availability(user["id"], new); st.rerun()
    st.progress(d["pct"] / 100, text=f"Profile {d['pct']}% complete")
    cols = st.columns(4)
    for col, s in zip(cols, ["Pending", "Shortlisted", "Accepted", "Rejected"]): col.metric(s, d["counts"].get(s, 0))
    for title, rows in (("Recommended jobs", d["recommended"]), ("Jobs near you (same block)", d["nearby"])):
        st.subheader(title)
        if not rows: st.caption("None right now.")
        for j in rows: st.info(f"**{j['title']}** · {j['block']} · ₹{j['wage']}/{j['payment_type']} `DEMO`")
    st.subheader("Upcoming work")
    for u in d["upcoming"]: st.success(f"{u['title']} · starts {u['start_date']} · {u['block']}")
    if not d["upcoming"]: st.caption("No accepted engagements yet.")
    st.subheader("Recent activity")
    for a in d["activity"]: st.write(f"• {a['t']} — {a['at']}")
    for n in d["notes"]: st.caption(f"🔔 {n['message']}")
