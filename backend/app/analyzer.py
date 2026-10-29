import re
import uuid
from typing import List, Dict, Any, Optional
from app.models import Finding, KBEntry, ContrastPair
from app.accessibility import evaluate_wcag

def find_substring_case_insensitive(text: str, sub: str) -> Optional[str]:
    pattern = re.compile(re.escape(sub), re.IGNORECASE)
    match = pattern.search(text)
    if match:
        return match.group(0)
    return None

def analyze_submission_text(
    text: str, 
    kb_entries: List[KBEntry],
    image_url: Optional[str] = None,
    alt_text: Optional[str] = None,
    contrast_pairs: Optional[List[ContrastPair]] = None
) -> List[Finding]:
    findings: List[Finding] = []
    finding_counter = 1

    # Map KB by ID for fast lookup
    kb_map = {e.id: e for e in kb_entries if e.is_approved}

    # 1. Deterministic Glossary & Banned Terms Check (RULE_VIOLATION)
    # Check T-01 FreshNest capitalization
    if "fresh nest" in text.lower() or "fresh-nest" in text.lower() or "freshnest" in text:
        # Check if actual text contains exact improper capitalization or space
        for bad in ["Fresh Nest", "fresh nest", "freshnest", "Fresh-Nest", "fresh-nest"]:
            if bad in text and bad != "FreshNest":
                kb = kb_map.get("T-01")
                if kb:
                    findings.append(Finding(
                        id=f"fnd-{uuid.uuid4().hex[:8]}",
                        finding_number=finding_counter,
                        type="RULE_VIOLATION",
                        category="Terminology",
                        severity=kb.severity_default,
                        flagged_text=bad,
                        why_flagged=kb.reason_template or "Glossary T-01 requires the brand name to be spelled 'FreshNest'.",
                        suggested_revision=kb.suggested_template or "FreshNest",
                        cited_source_id=f"Glossary {kb.id}",
                        cited_source_title=kb.title,
                        cited_source_text=kb.content,
                        status="open"
                    ))
                    finding_counter += 1
                break

    # Check T-07 Meal Kits ("diet boxes", "diet packs", etc.)
    t07 = kb_map.get("T-07")
    if t07:
        for term in t07.banned_terms:
            matched = find_substring_case_insensitive(text, term)
            if matched:
                findings.append(Finding(
                    id=f"fnd-{uuid.uuid4().hex[:8]}",
                    finding_number=finding_counter,
                    type="RULE_VIOLATION",
                    category="Terminology",
                    severity=t07.severity_default,
                    flagged_text=matched,
                    why_flagged=t07.reason_template.format(term=matched) if "{term}" in t07.reason_template else f"Glossary T-07 states: use 'meal kits' instead of restrictive diet terminology like '{matched}'.",
                    suggested_revision=t07.suggested_template or "meal kits",
                    cited_source_id=f"Glossary {t07.id}",
                    cited_source_title=t07.title,
                    cited_source_text=t07.content,
                    status="open"
                ))
                finding_counter += 1
                break

    # Check T-02 SpicePod ("masala pack", "spice pouch", etc.)
    t02 = kb_map.get("T-02")
    if t02:
        for term in t02.banned_terms:
            matched = find_substring_case_insensitive(text, term)
            if matched:
                findings.append(Finding(
                    id=f"fnd-{uuid.uuid4().hex[:8]}",
                    finding_number=finding_counter,
                    type="RULE_VIOLATION",
                    category="Terminology",
                    severity=t02.severity_default,
                    flagged_text=matched,
                    why_flagged=t02.reason_template or "Glossary T-02 specifies proprietary naming: use 'SpicePod'.",
                    suggested_revision=t02.suggested_template or "SpicePod",
                    cited_source_id=f"Glossary {t02.id}",
                    cited_source_title=t02.title,
                    cited_source_text=t02.content,
                    status="open"
                ))
                finding_counter += 1
                break

    # Check T-10 Zero-Waste Prep ("eco food", "green diet")
    t10 = kb_map.get("T-10")
    if t10:
        for term in t10.banned_terms:
            matched = find_substring_case_insensitive(text, term)
            if matched:
                findings.append(Finding(
                    id=f"fnd-{uuid.uuid4().hex[:8]}",
                    finding_number=finding_counter,
                    type="RULE_VIOLATION",
                    category="Terminology",
                    severity=t10.severity_default,
                    flagged_text=matched,
                    why_flagged=t10.reason_template.format(term=matched) if "{term}" in t10.reason_template else f"Glossary T-10 recommends 'Zero-Waste Prep' over colloquial '{matched}'.",
                    suggested_revision=t10.suggested_template or "Zero-Waste Prep",
                    cited_source_id=f"Glossary {t10.id}",
                    cited_source_title=t10.title,
                    cited_source_text=t10.content,
                    status="open"
                ))
                finding_counter += 1
                break

    # Check T-15 Farm-to-Door ("farm to table", "farm-to-table")
    t15 = kb_map.get("T-15")
    if t15:
        for term in t15.banned_terms:
            matched = find_substring_case_insensitive(text, term)
            if matched:
                findings.append(Finding(
                    id=f"fnd-{uuid.uuid4().hex[:8]}",
                    finding_number=finding_counter,
                    type="RULE_VIOLATION",
                    category="Terminology",
                    severity=t15.severity_default,
                    flagged_text=matched,
                    why_flagged=t15.reason_template or "Glossary T-15 requires 'Farm-to-Door' for direct residential delivery.",
                    suggested_revision=t15.suggested_template or "Farm-to-Door",
                    cited_source_id=f"Glossary {t15.id}",
                    cited_source_title=t15.title,
                    cited_source_text=t15.content,
                    status="open"
                ))
                finding_counter += 1
                break

    # 2. Unsupported / Health / Superlative Claims -> NOT_VERIFIABLE
    # Page 2 Mockup: "... Our boxes are the healthiest in India and guarantee weight loss in 2 weeks ..."
    cl03 = kb_map.get("CL-03")
    cl02 = kb_map.get("CL-02")
    f08 = kb_map.get("F-08")

    # Composite check for health superlatives + guarantees
    superlative_regex = re.compile(
        r"(?:(?:our (?:boxes|meal kits|food) are )?(?:the )?healthiest in (?:India|the country).*?(?:guarantee weight loss in \d+ (?:weeks|days)|guarantee weight loss))", 
        re.IGNORECASE
    )
    match_composite = superlative_regex.search(text)

    if match_composite and cl03:
        flagged_phrase = match_composite.group(0).strip()
        findings.append(Finding(
            id=f"fnd-{uuid.uuid4().hex[:8]}",
            finding_number=finding_counter,
            type="NOT_VERIFIABLE",
            category="Promotional claims",
            severity="high",
            flagged_text=flagged_phrase,
            why_flagged="Claims Policy CL-3: health and superlative claims need approved evidence. No approved fact supports this claim, so BrandLens does not call it false. It routes the claim to a reviewer instead of guessing.",
            suggested_revision="Explore our chef-designed meal kits, with nutrition information on every pack.",
            cited_source_id=f"Policy {cl03.id} / Fact {f08.id if f08 else 'F-08'}",
            cited_source_title="Claims Policy CL-3 (Evidence Requirement) & Fact F-08",
            cited_source_text=f"{cl03.content} Supported baseline: {f08.content if f08 else ''}",
            status="open"
        ))
        finding_counter += 1
    else:
        # Check individual CL-03 superlative phrases
        if cl03:
            for term in cl03.banned_terms:
                matched = find_substring_case_insensitive(text, term)
                if matched:
                    findings.append(Finding(
                        id=f"fnd-{uuid.uuid4().hex[:8]}",
                        finding_number=finding_counter,
                        type="NOT_VERIFIABLE",
                        category="Promotional claims",
                        severity="high",
                        flagged_text=matched,
                        why_flagged="Claims Policy CL-3: health and superlative claims need approved evidence. No approved fact supports this claim, so BrandLens does not call it false. It routes the claim to a reviewer instead of guessing.",
                        suggested_revision="chef-designed meal kits, with nutrition information on every pack",
                        cited_source_id=f"Policy {cl03.id}",
                        cited_source_title=cl03.title,
                        cited_source_text=cl03.content,
                        status="open"
                    ))
                    finding_counter += 1
                    break

        # Check CL-02 absolute guarantees if not caught in composite
        if cl02:
            for term in cl02.banned_terms:
                matched = find_substring_case_insensitive(text, term)
                if matched and not any(matched in f.flagged_text for f in findings):
                    findings.append(Finding(
                        id=f"fnd-{uuid.uuid4().hex[:8]}",
                        finding_number=finding_counter,
                        type="RULE_VIOLATION",
                        category="Promotional claims",
                        severity="high",
                        flagged_text=matched,
                        why_flagged=cl02.reason_template or "Claims Policy CL-02 prohibits absolute health guarantees.",
                        suggested_revision=cl02.suggested_template or "designed to support balanced eating",
                        cited_source_id=f"Policy {cl02.id}",
                        cited_source_title=cl02.title,
                        cited_source_text=cl02.content,
                        status="open"
                    ))
                    finding_counter += 1
                    break

    # 3. Contradicted Claims -> CONTRADICTED_CLAIM
    # Check Fact F-12 (free delivery minimum threshold)
    f12 = kb_map.get("F-12")
    if f12:
        for term in f12.banned_terms:
            matched = find_substring_case_insensitive(text, term)
            if matched:
                findings.append(Finding(
                    id=f"fnd-{uuid.uuid4().hex[:8]}",
                    finding_number=finding_counter,
                    type="CONTRADICTED_CLAIM",
                    category="Pricing & Delivery",
                    severity=f12.severity_default,
                    flagged_text=matched,
                    why_flagged=f12.reason_template or "Contradicts Fact F-12: Free delivery requires a minimum cart order of Rs 499.",
                    suggested_revision=f12.suggested_template or "free delivery on orders of Rs 499 and above",
                    cited_source_id=f"Fact {f12.id}",
                    cited_source_title=f12.title,
                    cited_source_text=f12.content,
                    status="open"
                ))
                finding_counter += 1
                break

    # Check Fact F-01 (city coverage)
    f01 = kb_map.get("F-01")
    if f01:
        for term in f01.banned_terms:
            matched = find_substring_case_insensitive(text, term)
            if matched:
                findings.append(Finding(
                    id=f"fnd-{uuid.uuid4().hex[:8]}",
                    finding_number=finding_counter,
                    type="CONTRADICTED_CLAIM",
                    category="Pricing & Delivery",
                    severity=f01.severity_default,
                    flagged_text=matched,
                    why_flagged=f01.reason_template or "Contradicts Fact F-01: FreshNest operates in 18 metro cities.",
                    suggested_revision=f01.suggested_template or "servicing 18 major metro cities across India",
                    cited_source_id=f"Fact {f01.id}",
                    cited_source_title=f01.title,
                    cited_source_text=f01.content,
                    status="open"
                ))
                finding_counter += 1
                break

    # Check Fact F-14 (food waste percentage)
    f14 = kb_map.get("F-14")
    if f14:
        for term in f14.banned_terms:
            matched = find_substring_case_insensitive(text, term)
            if matched:
                findings.append(Finding(
                    id=f"fnd-{uuid.uuid4().hex[:8]}",
                    finding_number=finding_counter,
                    type="CONTRADICTED_CLAIM",
                    category="Promotional claims",
                    severity=f14.severity_default,
                    flagged_text=matched,
                    why_flagged=f14.reason_template or "Fact F-14 verifies waste reduction is 'up to 60%', not 100%.",
                    suggested_revision=f14.suggested_template or "reduces food waste by up to 60%",
                    cited_source_id=f"Fact {f14.id}",
                    cited_source_title=f14.title,
                    cited_source_text=f14.content,
                    status="open"
                ))
                finding_counter += 1
                break

    # 4. Accessibility Checks (Round 3 Feature from Plan)
    acc01 = kb_map.get("ACC-01")
    acc_title = acc01.title if acc01 else "Accessibility & Alt-Text Standards"
    acc_text = acc01.content if acc01 else "All images must have descriptive alt-text and WCAG AA contrast."

    # Check Alt-text if image is provided
    if image_url and (not alt_text or len(alt_text.strip()) < 5):
        findings.append(Finding(
            id=f"fnd-{uuid.uuid4().hex[:8]}",
            finding_number=finding_counter,
            type="RULE_VIOLATION",
            category="Accessibility",
            severity="medium",
            flagged_text="[Image Asset without descriptive alt text]",
            why_flagged="Accessibility Guideline ACC-01: Every promotional image must include descriptive alt-text for screen readers and search accessibility.",
            suggested_revision="Provide a concise description of the culinary meal kit box contents.",
            cited_source_id="Guideline ACC-01",
            cited_source_title=acc_title,
            cited_source_text=acc_text,
            status="open"
        ))
        finding_counter += 1

    # Check Color Contrast pairs if provided
    if contrast_pairs:
        for pair in contrast_pairs:
            eval_result = evaluate_wcag(pair.foreground, pair.background)
            if not eval_result["passes_aa"]:
                findings.append(Finding(
                    id=f"fnd-{uuid.uuid4().hex[:8]}",
                    finding_number=finding_counter,
                    type="RULE_VIOLATION",
                    category="Accessibility",
                    severity="medium",
                    flagged_text=f"Color pair {pair.foreground} on {pair.background} ({pair.label or 'Text overlay'})",
                    why_flagged=f"Accessibility Guideline ACC-01: Contrast ratio is {eval_result['ratio']}:1, which fails the WCAG AA minimum requirement of 4.5:1.",
                    suggested_revision=f"Darken foreground or lighten background to achieve at least 4.5:1 contrast.",
                    cited_source_id="Guideline ACC-01",
                    cited_source_title=acc_title,
                    cited_source_text=acc_text,
                    status="open"
                ))
                finding_counter += 1

    return findings
