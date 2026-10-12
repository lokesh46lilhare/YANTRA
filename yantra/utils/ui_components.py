ICONS = {"Pending": "🟡", "Shortlisted": "🔵", "Accepted": "🟢", "Rejected": "🔴", "Withdrawn": "⚪", "Cancelled": "⚪", "Completed": "✅", "Open": "🟢", "Closed": "🔴"}
def badge(status): return ICONS.get(status, "•")
