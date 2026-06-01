import json
import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]

db_path = root / "data" / "database.json"
db = json.loads(db_path.read_text(encoding="utf-8"))
for p in db.get("projects", []):
    p["imageUrl"] = ""
    p["gallery"] = []
for b in db.get("blogs", []):
    b["imageUrl"] = ""
if "settings" in db:
    db["settings"]["notifiedEmail"] = "lorem.ipsum@placeholder.com"
    db["settings"]["senderEmail"] = "lorem.ipsum@placeholder.com"
db_path.write_text(json.dumps(db, ensure_ascii=False, indent=2), encoding="utf-8")

srv_path = root / "server.ts"
srv = srv_path.read_text(encoding="utf-8")
srv = re.sub(r'"https://images\.unsplash\.com[^"]*"', '""', srv)
srv = srv.replace("peacecuck@gmail.com", "lorem.ipsum@placeholder.com")
srv = srv.replace("onboarding@resend.dev", "lorem.ipsum@placeholder.com")
srv_path.write_text(srv, encoding="utf-8")
print("Updated database.json and server.ts")
