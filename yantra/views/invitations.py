import streamlit as st
from services import worker_service as ws
def render(user):
    st.header("✉️ Work Invitations")
    rows = ws.my_invitations(user["id"])
    if not rows: st.info("No invitations yet.")
    for r in rows:
        with st.container(border=True):
            st.write(f"**{r['title']}** · {r['owner']} · {r['block']} · ₹{r['wage']} · *{r['status']}*")
            if r["note"]: st.caption(r["note"])
            if r["status"] == "Pending":
                a, b = st.columns(2)
                if a.button("Accept", key=f"a{r['id']}", type="primary"): ws.respond(r["id"], user, True); st.rerun()
                if b.button("Decline", key=f"d{r['id']}"): ws.respond(r["id"], user, False); st.rerun()
