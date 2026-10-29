from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

class KBEntry(BaseModel):
    id: str
    category: str  # "guideline" | "glossary" | "fact"
    title: str
    content: str
    banned_terms: List[str] = []
    approved_terms: List[str] = []
    version: str = "1.0"
    is_approved: bool = True
    severity_default: str = "medium"  # "high" | "medium" | "low"
    reason_template: str = ""
    suggested_template: str = ""
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class Finding(BaseModel):
    id: str
    finding_number: int
    type: str  # "RULE_VIOLATION" | "CONTRADICTED_CLAIM" | "NOT_VERIFIABLE"
    category: str  # "Terminology" | "Promotional claims" | "Pricing & Delivery" | "Brand Tone" | "Accessibility"
    severity: str  # "high" | "medium" | "low"
    flagged_text: str
    why_flagged: str
    suggested_revision: str
    cited_source_id: str
    cited_source_title: str
    cited_source_text: str
    status: str = "open"  # "open" | "accepted" | "edited" | "dismissed" | "sent_to_reviewer"
    dismissal_reason: Optional[str] = None
    dismissal_note: Optional[str] = None
    user_revision: Optional[str] = None

class Comment(BaseModel):
    id: str
    finding_id: Optional[str] = None  # None if document-level comment
    author_name: str
    author_role: str  # "creator" | "reviewer" | "manager"
    message: str
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class RevisionHistory(BaseModel):
    version: int
    text: str
    changed_by: str
    change_summary: str
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    findings_count: int = 0
    resolved_count: int = 0

class ContrastPair(BaseModel):
    foreground: str  # Hex code e.g. #FFFFFF
    background: str  # Hex code e.g. #10B981
    label: Optional[str] = "Headline text"

class Submission(BaseModel):
    id: str
    title: str
    content_type: str  # "social_post" | "ad_copy" | "blog_post" | "product_description" | "email_newsletter"
    original_text: str
    current_text: str
    image_url: Optional[str] = None
    alt_text: Optional[str] = None
    contrast_pairs: List[ContrastPair] = []
    status: str = "draft"  # "draft" | "under_review" | "changes_requested" | "approved" | "rejected"
    version: int = 1
    is_locked: bool = False
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    created_by: str = "Jane Doe (Creator)"
    approved_by: Optional[str] = None
    approved_at: Optional[str] = None
    approval_notes: Optional[str] = None
    applied_guideline_versions: Dict[str, str] = {}
    ai_service_disclosed: bool = True
    ai_disclosure_notes: str = "Deterministic rules + Approved-source lexical retrieval and claims validation. External training disabled."
    findings: List[Finding] = []
    comments: List[Comment] = []
    history: List[RevisionHistory] = []

# Request/Response models
class CreateSubmissionRequest(BaseModel):
    title: str
    content_type: str
    text: str
    image_url: Optional[str] = None
    alt_text: Optional[str] = None
    contrast_pairs: List[ContrastPair] = []
    created_by: Optional[str] = "Jane Doe (Creator)"

class FindingActionRequest(BaseModel):
    action: str  # "accept" | "edit" | "dismiss" | "send_to_reviewer"
    dismissal_reason: Optional[str] = None
    dismissal_note: Optional[str] = None
    user_revision: Optional[str] = None

class SaveRevisionRequest(BaseModel):
    text: str
    changed_by: str
    change_summary: str

class AddCommentRequest(BaseModel):
    finding_id: Optional[str] = None
    author_name: str
    author_role: str
    message: str

class ReviewDecisionRequest(BaseModel):
    decision: str  # "approve" | "request_changes" | "reject"
    reviewer_name: str
    reviewer_role: str
    feedback: Optional[str] = ""

class ContrastCheckRequest(BaseModel):
    foreground: str
    background: str
    text_size: str = "normal"  # "normal" | "large"
