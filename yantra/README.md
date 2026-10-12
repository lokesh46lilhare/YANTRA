# YANTRA — Rural Employment & Engineering Services Platform (demo)

काम आपके फोन पर, अवसर आपके गाँव में।  Streamlit + Python + SQLite demo for Balaghat district, Madhya Pradesh.

**DEMO DISCLAIMER:** all users, jobs, equipment and posts marked DEMO are fictional sample data, not verified real listings.
Authentication is a development mode: **no OTP, SMS or WhatsApp is sent**, and no identity or payment is verified or processed.

## Run
    pip install -r requirements.txt
    cp .env.example .env        # optional; sets DEMO_PASSWORD and YANTRA_DB
    streamlit run app.py
The database (`yantra.db`) and demo data are created automatically on first launch and kept across reruns.
Reset demo data (deletes the database): `python -m database.seed_data`

## Demo accounts (password: `Demo@1234`, or DEMO_PASSWORD)
| Role | Mobile |
|---|---|
| Worker | 9000000001 (workers 9000000001-9000000015) |
| Contractor | 9000100001 (contractors ...0001-...0005) |
| Engineer | 9000200001 (...0001-...0005) |
| Employer | 9000300001, 9000300002 |
| Equipment owner | 9000400001, 9000400002 |
| Admin | 9000500001 |

## Modules
Find Work (filters, apply, pagination, reports) · Worker dashboard & profile (photo, wage visibility, travel radius) ·
Contractor jobs & applicants · Hire Workers (directory, shortlist, invitations) · Messaging & notifications ·
Equipment rental (inventory-safe bookings, simulated payment) · Engineer network (connections, feed) ·
Professional jobs (private PDF resumes) · Admin (stats, charts, user suspension, reports, audit log, CSV exports, locations).
Hindi/English switch via `utils/i18n.py`. Folder `views/` replaces the spec's `pages/` (Streamlit treats `pages/` specially).

## Security notes
Werkzeug password hashing, parameterized SQL, ownership/role checks inside services, upload size/type checks (images via Pillow,
PDFs by extension + `%PDF` header), uploads stored in `uploads/` and served only through authorized download buttons,
suspended users are logged out, admin actions are audit-logged, exports exclude passwords and contact details.

## Moving to production (not included in this demo)
- **Login:** replace password-only login with SMS OTP via a provider (e.g. MSG91, Twilio): generate a short-lived code, store its hash with expiry and attempt limits, send via the provider API using credentials from environment variables, verify before creating the session.
- **Notifications:** keep in-app notifications and add an optional WhatsApp/SMS sender triggered from `services/job_service.notify`; do nothing when no credentials are set.
- **Payments:** integrate a gateway (e.g. Razorpay) for rentals; current totals are estimates only.
- **Verification:** add document/KYC verification before showing any "verified" badge.
- **Data & hosting:** move to PostgreSQL, object storage for uploads, HTTPS, rate limiting, backups, and privacy-policy/terms pages reviewed legally.

## Known limitations
The admin PDF summary needs `pip install reportlab`. Districts and blocks come from the admin-editable locations table.
