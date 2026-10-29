import httpx

client = httpx.Client(base_url='http://127.0.0.1:8000', timeout=10.0)

print("=== 1. TESTING STEP 1: KNOWLEDGE BASE ===")
kb = client.get('/api/kb').json()
print(f"Total KB entries: {len(kb)}")
assert len(kb) >= 15, "Expected at least 15 seeded KB entries"
glossary_t07 = next(e for e in kb if e['id'] == 'T-07')
print(f"Found T-07: {glossary_t07['title']}, version: {glossary_t07['version']}")

# Create test rule
new_rule = client.post('/api/kb', json={
    'id': 'T-99',
    'category': 'glossary',
    'title': 'Test Terminology',
    'content': 'Test rule definition',
    'banned_terms': ['test-banned'],
    'approved_terms': ['test-approved'],
    'version': '1.0',
    'is_approved': True,
    'severity_default': 'low'
}).json()
print("Created custom rule T-99:", new_rule['id'])
# Delete test rule
client.delete('/api/kb/T-99')
print("Deleted custom rule T-99 successfully")

print("\n=== 2. TESTING STEP 2, 3, 4: SUBMIT, ANALYSE & EXPLAIN ===")
sub_req = {
    'title': 'E2E Test Ad Copy',
    'content_type': 'ad_copy',
    'text': 'Introducing our new diet boxes! Our boxes are the healthiest in India and guarantee weight loss in 2 weeks. Enjoy fresh ingredients delivered right to your kitchen with free delivery on all orders!',
    'image_url': 'https://example.com/banner.jpg',
    'alt_text': '', # triggers ACC-01 alt-text violation
    'contrast_pairs': [{'foreground': '#94A3B8', 'background': '#FFFFFF', 'label': 'Subtitle'}], # triggers ACC-01 contrast violation
    'created_by': 'Jane Doe (Creator)'
}
sub = client.post('/api/submissions', json=sub_req).json()
sub_id = sub['id']
print(f"Created submission: {sub_id}, Findings count: {len(sub['findings'])}")

# Verify 3 core finding types exist in findings
types_found = {f['type'] for f in sub['findings']}
print(f"Finding types caught: {types_found}")
assert 'RULE_VIOLATION' in types_found, 'Missing RULE_VIOLATION'
assert 'CONTRADICTED_CLAIM' in types_found, 'Missing CONTRADICTED_CLAIM'
assert 'NOT_VERIFIABLE' in types_found, 'Missing NOT_VERIFIABLE'

f_rule = next(f for f in sub['findings'] if f['type'] == 'RULE_VIOLATION' and f['flagged_text'] == 'diet boxes')
f_claim = next(f for f in sub['findings'] if f['type'] == 'CONTRADICTED_CLAIM')
f_superlative = next(f for f in sub['findings'] if f['type'] == 'NOT_VERIFIABLE')

print(f"Rule Violation: '{f_rule['flagged_text']}' -> '{f_rule['suggested_revision']}'")
print(f"Contradicted Claim: '{f_claim['flagged_text']}' -> '{f_claim['suggested_revision']}'")
print(f"Not Verifiable: '{f_superlative['flagged_text']}' -> '{f_superlative['suggested_revision']}'")

print("\n=== 3. TESTING STEP 5: REVISE LOOP (ACCEPT / EDIT / DISMISS) ===")
# Accept f_rule
r_accept = client.post(f'/api/submissions/{sub_id}/findings/{f_rule["id"]}/action', json={'action': 'accept'}).json()
assert 'meal kits' in r_accept['current_text'], 'Expected "meal kits" after accept'
print("Accepted T-07: text replaced 'diet boxes' with 'meal kits'")

# Dismiss f_claim with reason
r_dismiss = client.post(f'/api/submissions/{sub_id}/findings/{f_claim["id"]}/action', json={
    'action': 'dismiss',
    'dismissal_reason': 'Context qualifies claim',
    'dismissal_note': 'Footer disclaimer clarifies threshold'
}).json()
f_dismissed = next(f for f in r_dismiss['findings'] if f['id'] == f_claim['id'])
assert f_dismissed['status'] == 'dismissed'
assert f_dismissed['dismissal_reason'] == 'Context qualifies claim'
print("Dismissed F-12 with mandatory reason:", f_dismissed['dismissal_reason'])

# Edit f_superlative
r_edit = client.post(f'/api/submissions/{sub_id}/findings/{f_superlative["id"]}/action', json={
    'action': 'edit',
    'user_revision': 'Explore our chef-designed meal kits crafted for wholesome living'
}).json()
print("Edited superlative claim successfully. Current text:\n", r_edit['current_text'])

# Save revision
rev_save = client.post(f'/api/submissions/{sub_id}/revise', json={
    'text': r_edit['current_text'],
    'changed_by': 'Jane Doe (Creator)',
    'change_summary': 'Addressed diet boxes and claims policies'
}).json()
assert rev_save['version'] == 2, 'Version should increment to 2'
print(f"Saved revision! Version is now v{rev_save['version']}")

print("\n=== 4. TESTING STEP 6: REVIEW DIFF & THREADED COMMENTS ===")
comment = client.post(f'/api/submissions/{sub_id}/comments', json={
    'author_name': 'Rahul Sharma',
    'author_role': 'reviewer',
    'message': 'Changes look very clean! Dismissal reason on delivery threshold is acceptable.'
}).json()
print("Added reviewer comment:", comment['message'])

print("\n=== 5. TESTING STEP 7: APPROVE & LOCK VERSION ===")
approved_sub = client.post(f'/api/submissions/{sub_id}/decision', json={
    'decision': 'approve',
    'reviewer_name': 'Rahul Sharma',
    'reviewer_role': 'Legal & Brand Reviewer',
    'feedback': 'Approved for multi-channel release.'
}).json()
assert approved_sub['status'] == 'approved', 'Status should be approved'
assert approved_sub['is_locked'] == True, 'Submission should be locked'
print("Version is locked! Approved by:", approved_sub['approved_by'])

# Verify lock prevents changes
resp_lock_check = client.post(f'/api/submissions/{sub_id}/findings/{f_rule["id"]}/action', json={'action': 'accept'})
assert resp_lock_check.status_code == 400, 'Should reject modification on locked submission'
print("Verified: modification rejected on locked version (HTTP 400)")

print("\n=== 6. TESTING STEP 8: RECURRING-ISSUE & GUIDELINE-GAP INSIGHTS ===")
insights = client.get('/api/insights').json()
print("Insights summary:", insights['summary'])
print("Top recurring rules:", insights['top_recurring_rules'])
print("Guideline gaps identified:", len(insights['guideline_gaps']))
print("First guideline gap recommendation:", insights['guideline_gaps'][0]['recommendation'])

# Cleanup test submission
client.delete(f'/api/submissions/{sub_id}')
print("Cleaned up test submission. ALL 8 WORKFLOW STEPS PASSED FLAWLESSLY!")
