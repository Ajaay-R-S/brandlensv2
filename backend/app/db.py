import json
import os
import uuid
from typing import List, Optional, Dict, Any
from app.models import (
    KBEntry, Submission, Finding, Comment, RevisionHistory, ContrastPair
)
from app.seed_data import SEED_KB_ENTRIES, SAMPLE_SUBMISSIONS, SEED_HISTORICAL_INSIGHTS

DB_FILE = os.environ.get(
    "DB_FILE",
    os.path.join(os.path.dirname(__file__), "..", "data.json"),
)

class Database:
    def __init__(self):
        self.kb_entries: Dict[str, KBEntry] = {}
        self.submissions: Dict[str, Submission] = {}
        self.historical_insights: List[Dict[str, Any]] = []
        self._load()

    def _load(self):
        if os.path.exists(DB_FILE):
            try:
                with open(DB_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.kb_entries = {k: KBEntry(**v) for k, v in data.get("kb_entries", {}).items()}
                    self.submissions = {k: Submission(**v) for k, v in data.get("submissions", {}).items()}
                    self.historical_insights = data.get("historical_insights", [])
                    return
            except Exception as e:
                print(f"Error loading database file, reinitializing: {e}")

        # Initialize defaults
        self.reset_to_seeds()

    def save(self):
        try:
            data = {
                "kb_entries": {k: v.dict() for k, v in self.kb_entries.items()},
                "submissions": {k: v.dict() for k, v in self.submissions.items()},
                "historical_insights": self.historical_insights
            }
            os.makedirs(os.path.dirname(DB_FILE), exist_ok=True)
            with open(DB_FILE, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Failed to save db: {e}")

    def reset_to_seeds(self):
        self.kb_entries = {entry["id"]: KBEntry(**entry) for entry in SEED_KB_ENTRIES}
        self.historical_insights = list(SEED_HISTORICAL_INSIGHTS)
        self.submissions = {}
        self.save()

    # Knowledge Base methods
    def get_all_kb(self, category: Optional[str] = None) -> List[KBEntry]:
        entries = list(self.kb_entries.values())
        if category:
            entries = [e for e in entries if e.category == category]
        return entries

    def get_kb(self, entry_id: str) -> Optional[KBEntry]:
        return self.kb_entries.get(entry_id)

    def upsert_kb(self, entry: KBEntry) -> KBEntry:
        self.kb_entries[entry.id] = entry
        self.save()
        return entry

    def delete_kb(self, entry_id: str) -> bool:
        if entry_id in self.kb_entries:
            del self.kb_entries[entry_id]
            self.save()
            return True
        return False

    # Submission methods
    def get_all_submissions(self) -> List[Submission]:
        return sorted(list(self.submissions.values()), key=lambda s: s.created_at, reverse=True)

    def get_submission(self, sub_id: str) -> Optional[Submission]:
        return self.submissions.get(sub_id)

    def save_submission(self, sub: Submission) -> Submission:
        self.submissions[sub.id] = sub
        self.save()
        return sub

    def delete_submission(self, sub_id: str) -> bool:
        if sub_id in self.submissions:
            del self.submissions[sub_id]
            self.save()
            return True
        return False

    # Historical insights logging
    def log_finding_action(self, rule_id: str, rule_title: str, finding_type: str, content_type: str, action: str, reason: Optional[str] = None):
        self.historical_insights.append({
            "rule_id": rule_id,
            "rule_title": rule_title,
            "type": finding_type,
            "content_type": content_type,
            "action": action,
            "reason": reason
        })
        self.save()

db = Database()
