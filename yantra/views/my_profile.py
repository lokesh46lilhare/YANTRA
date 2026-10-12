import streamlit as st
from services.rental_service import save_image
from database.connection import get_conn
from services import auth_service
def render(user):
    st.header("👤 My Profile")
    st.write(f"**{user['name']}** · {user['role']} · {user['mobile']}")
    if user["role"] == "worker":
        with get_conn() as c: w = c.execute("SELECT * FROM worker_profiles WHERE user_id=?", (user["id"],)).fetchone()
        av = ["Available today", "Available tomorrow", "Available this week", "Currently unavailable"]
        with st.form("wp"):
            skill = st.text_input("Primary skill", w["primary_skill"] or ""); exp = st.number_input("Experience (years)", 0, 50, w["experience_years"] or 0)
            wage = st.number_input("Preferred wage ₹", 0, 100000, w["preferred_wage"] or 0, 50)
            a = st.selectbox("Availability", av, av.index(w["availability"])); intro = st.text_area("Introduction", w["intro"] or "")
            show = st.checkbox("Show my expected wage publicly", bool(w["show_wage"])); ph = st.file_uploader("Profile photo (max 2 MB)", ["png", "jpg", "jpeg"])
            rad = st.number_input("Preferred work radius (km)", 0, 200, w["radius_km"] or 10)
            if st.form_submit_button("Save"):
                pp, perr = save_image(ph, "photos")
                if perr: st.error(perr); st.stop()
                with get_conn() as c: c.execute("UPDATE worker_profiles SET primary_skill=?,experience_years=?,preferred_wage=?,availability=?,intro=?,show_wage=?,radius_km=?,photo_path=COALESCE(?,photo_path) WHERE user_id=?",
                                                (skill, exp, wage, a, intro, int(show), rad, pp, user["id"]))
                st.success("Profile updated")
    with st.form("pw"):
        old = st.text_input("Current password", type="password"); new = st.text_input("New password", type="password")
        if st.form_submit_button("Change password"):
            e = auth_service.change_password(user["id"], old, new); st.error(e) if e else st.success("Password changed")
