import re
def valid_mobile(m): return bool(re.fullmatch(r"[6-9]\d{9}", m or ""))
def valid_email(e): return not e or bool(re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", e))
def valid_password(p): return len(p or "") >= 8
