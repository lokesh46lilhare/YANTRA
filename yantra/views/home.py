import streamlit as st
from utils.i18n import t
from services import job_service as js

def go(p): st.session_state["nav"] = p

def render(user):
    st.markdown(f"## 🛠️ YANTRA\n**{t('tagline')}**")
    st.title(t("headline")); st.write(t("sub"))
    a, b = st.columns(2)
    a.button("🔨 " + t("find_work"), on_click=go, args=("find_work",), type="primary", use_container_width=True)
    b.button("👷 " + t("hire"), on_click=go, args=("hire",), use_container_width=True)
    c, d = st.columns(2)
    c.button("🏗️ Rent Equipment", on_click=go, args=("equip",), use_container_width=True)
    d.button("💼 Engineering Jobs", on_click=go, args=("prof_jobs",), use_container_width=True)
    jobs, workers, contractors = js.stats()
    c1, c2, c3 = st.columns(3)
    c1.metric("Open jobs", jobs); c2.metric("Workers", workers); c3.metric("Contractors", contractors)
    st.subheader("Recently posted")
    for j in js.search_jobs({}, 0, 4)[0]:
        st.info(f"**{j['title']}** · {j['block']} · ₹{j['wage']}/{j['payment_type']}  `DEMO`")
    st.subheader("How it works")
    st.write("1️⃣ Register  2️⃣ Search & apply  3️⃣ Contractor shortlists you  4️⃣ Get hired")
    st.caption("⚠️ Demo: all listings and accounts are sample data, not real jobs. No OTP/SMS/payment is performed.")
