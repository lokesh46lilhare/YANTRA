def require_role(user, *roles):
    if not user or user.get("role") not in roles: raise PermissionError("Not allowed for this account type")

def is_owner(user, owner_id): return bool(user) and user["id"] == owner_id
