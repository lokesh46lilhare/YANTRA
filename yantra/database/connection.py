import os, sqlite3
from contextlib import contextmanager
DB_PATH = os.getenv("YANTRA_DB", "yantra.db")

@contextmanager
def get_conn():
    c = sqlite3.connect(DB_PATH)
    c.row_factory = sqlite3.Row
    c.execute("PRAGMA foreign_keys=ON")
    try:
        yield c
        c.commit()
    except Exception:
        c.rollback()
        raise
    finally:
        c.close()
