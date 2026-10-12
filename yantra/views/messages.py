import streamlit as st
from services import notification_service as ns
def render(user):
    st.header("💬 Messages")
    cs = ns.contacts(user["id"])
    if not cs: st.info("You can message people once you have an application or invitation with them."); return
    o = st.selectbox("Conversation", cs, format_func=lambda c: f"{c[1]} ({c[2]} new)" if c[2] else c[1])[0]
    for m in ns.thread(user, o):
        with st.chat_message("user" if m["sender_id"] == user["id"] else "assistant"):
            st.write(m["body"]); st.caption(m["created_at"])
    with st.form("msg", clear_on_submit=True):
        body = st.text_input("Message (max 500 chars)")
        if st.form_submit_button("Send", type="primary"):
            e = ns.send_message(user, o, body)
            if e: st.error(e)
            else: st.rerun()
