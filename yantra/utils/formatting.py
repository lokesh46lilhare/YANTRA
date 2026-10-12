import math

def haversine_km(lat1, lon1, lat2, lon2):
    """Approximate straight-line distance in km between two coordinates (not road distance)."""
    p1, p2 = math.radians(lat1), math.radians(lat2)
    a = math.sin((p2 - p1) / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(math.radians(lon2 - lon1) / 2) ** 2
    return 6371.0 * 2 * math.asin(math.sqrt(a))

def inr(n): return f"₹{n:,}"
