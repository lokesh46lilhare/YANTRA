import streamlit as st
T = {"home": ("होम", "Home"), "find_work": ("मुझे काम चाहिए", "Find Work"), "hire": ("मुझे मजदूर चाहिए", "Hire Workers"),
     "post_job": ("जॉब / आवेदक", "Jobs & Applicants"), "my_apps": ("मेरे आवेदन", "My Applications"),
     "notifs": ("सूचनाएँ", "Notifications"), "profile": ("मेरी प्रोफ़ाइल", "My Profile"), "hire_nav": ("मजदूर खोजें", "Hire Workers"), "invites": ("निमंत्रण", "Invitations"), "messages": ("संदेश", "Messages"), "equip": ("उपकरण किराये पर लें", "Rent Equipment"), "prof_jobs": ("इंजीनियरिंग जॉब्स", "Engineering Jobs"), "network": ("इंजीनियर नेटवर्क", "Engineer Network"), "admin": ("एडमिन", "Admin"), "dashboard": ("मेरा डैशबोर्ड", "My Dashboard"), "login": ("लॉगिन", "Login"),
     "register": ("रजिस्टर", "Register"), "logout": ("लॉगआउट", "Logout"), "apply": ("आवेदन करें", "Apply"),
     "tagline": ("काम आपके फोन पर, अवसर आपके गाँव में।", "Work on your phone, opportunity in your village."),
     "headline": ("अब काम खोजने के लिए भटकना नहीं।", "No more wandering to find work."),
     "sub": ("अपने मोबाइल से काम खोजें, आवेदन करें और अपने क्षेत्र के ठेकेदारों से जुड़ें।", "Find work, apply and connect with contractors from your phone.")}
def t(k):
    return T[k][0 if st.session_state.get("lang", "हिन्दी") == "हिन्दी" else 1]
