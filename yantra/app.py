import os
import streamlit as st
from dotenv import load_dotenv
load_dotenv()
from database.seed_data import seed, seed_extras, seed_phase3, seed_phase4
from services.admin_service import locations_list
from services import auth_service, notification_service
from utils.i18n import t
from views import home, find_work, my_applications, post_job, notifications, my_profile, hire_workers, invitations, messages, equipment_rental, engineer_network, professional_jobs, admin_dashboard, worker_dashboard

st.set_page_config(page_title="YANTRA", page_icon="🛠️", layout="centered")
st.markdown("<style>.stButton>button{min-height:3rem;font-size:1.05rem;border-radius:10px}h1,h2{color:#0b3d91}</style>", unsafe_allow_html=True)
seed(); seed_extras(); seed_phase3(); seed_phase4()
st.session_state.setdefault("user", None)
if os.path.exists("assets/logo.png"): st.sidebar.image("assets/logo.png", width=72)
st.sidebar.radio("Language / भाषा", ["हिन्दी", "English"], key="lang", horizontal=True)
user = st.session_state["user"]
if user and not auth_service.is_active(user["id"]): st.session_state["user"] = user = None
VIEWS = {"home": home, "find_work": find_work, "my_apps": my_applications, "post_job": post_job, "notifs": notifications, "hire": hire_workers, "dashboard": worker_dashboard, "admin": admin_dashboard, "equip": equipment_rental, "network": engineer_network, "prof_jobs": professional_jobs, "invites": invitations, "messages": messages, "profile": my_profile}
allowed = ["home", "find_work", "equip", "prof_jobs"] + (["admin"] if user and user["role"] == "admin" else []) + (["network"] if user and user["role"] == "engineer" else []) + (["dashboard", "my_apps"] if user and user["role"] == "worker" else []) + \
          (["post_job", "hire"] if user and user["role"] in ("contractor", "employer") else []) + (["invites"] if user and user["role"] == "worker" else []) + (["messages"] if user else []) + (["notifs", "profile"] if user else [])
st.session_state.setdefault("nav", "home")
if st.session_state["nav"] not in allowed: st.session_state["nav"] = "home"
st.sidebar.radio("Menu", allowed, format_func=t, key="nav")

if user:
    st.sidebar.write(f"👋 {user['name']}")
    _n, _m = notification_service.unread_totals(user["id"]); st.sidebar.caption(f"🔔 {_n} unread · ✉️ {_m} new messages")
    if st.sidebar.button(t("logout")): st.session_state["user"] = None; st.rerun()
else:
    with st.sidebar.expander(t("login"), expanded=True):
        m = st.text_input("Mobile", max_chars=10); p = st.text_input("Password", type="password")
        if st.button(t("login") + " ", type="primary"):
            u, err = auth_service.login(m, p)
            if u: st.session_state["user"] = u; st.rerun()
            else: st.error(err)
    with st.sidebar.expander(t("register")):
        with st.form("reg"):
            n = st.text_input("Full name"); rm = st.text_input("Mobile (10 digits)"); em = st.text_input("Email (optional)")
            rp = st.text_input("Password (8+ chars)", type="password"); role = st.selectbox("Account type", auth_service.ROLES)
            loc = st.selectbox("District / Locality", locations_list(), format_func=lambda x: f"{x[1]}, {x[0]}"); ok = st.checkbox("I accept Terms & Privacy Policy")
            if st.form_submit_button(t("register")):
                errs = auth_service.register(n, rm, em, rp, role, loc[0], loc[1], ok)
                for e in errs: st.error(e)
                if not errs: st.success("Registered! Now log in.")
    with st.sidebar.expander("🧪 Demo login (development only)"):
        st.caption("Dev auth mode: no real OTP is sent. Password: DEMO_PASSWORD (default Demo@1234)")
        st.code("Worker: 9000000001\nContractor: 9000100001\nAdmin: 9000500001")

VIEWS[st.session_state["nav"]].render(user)
