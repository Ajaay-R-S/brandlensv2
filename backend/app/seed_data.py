from typing import List, Dict, Any

SEED_KB_ENTRIES: List[Dict[str, Any]] = [
    # Glossary Rules
    {
        "id": "T-01",
        "category": "glossary",
        "title": "FreshNest Brand Capitalization",
        "content": "The brand name must always be written as a single word 'FreshNest' with capital 'F' and capital 'N'.",
        "banned_terms": ["fresh nest", "freshnest", "fresh-nest", "Fresh nest"],
        "approved_terms": ["FreshNest"],
        "version": "1.0",
        "is_approved": True,
        "severity_default": "medium",
        "reason_template": "Glossary T-01 requires the brand name to be formatted as 'FreshNest' without spaces or hyphens.",
        "suggested_template": "FreshNest"
    },
    {
        "id": "T-02",
        "category": "glossary",
        "title": "SpicePod Nomenclature",
        "content": "FreshNest's custom pre-measured spice blends must be referred to exclusively as 'SpicePod'. Do not use generic terms like 'masala packet' or 'spice pouch'.",
        "banned_terms": ["masala pack", "masala packet", "spice pouch", "curry powder packet"],
        "approved_terms": ["SpicePod"],
        "version": "1.0",
        "is_approved": True,
        "severity_default": "low",
        "reason_template": "Glossary T-02 specifies proprietary naming: use 'SpicePod' instead of generic spice packaging terms.",
        "suggested_template": "SpicePod"
    },
    {
        "id": "T-07",
        "category": "glossary",
        "title": "Meal Kits Product Terminology",
        "content": "FreshNest provides chef-crafted meal solutions. Always refer to our product as 'meal kits' or 'boxes'. We never refer to them as 'diet boxes', 'diet packs', or 'slimming meals' because FreshNest focuses on wholesome culinary enjoyment rather than restrictive dieting.",
        "banned_terms": ["diet boxes", "diet packs", "diet box", "diet pack", "slimming box", "diet kit", "weight loss pack"],
        "approved_terms": ["meal kits", "meal kit boxes", "dinner kits"],
        "version": "1.2",
        "is_approved": True,
        "severity_default": "high",
        "reason_template": "Glossary T-07 states: use 'meal kits' instead of restrictive diet terminology like '{term}'.",
        "suggested_template": "meal kits"
    },
    {
        "id": "T-10",
        "category": "glossary",
        "title": "Zero-Waste Prep Terminology",
        "content": "Sustainability efforts should be described as 'Zero-Waste Prep' or 'pre-portioned ingredients'. Avoid vague greenwashing terms like 'eco food' or 'green diet'.",
        "banned_terms": ["eco food", "green diet", "eco ingredients"],
        "approved_terms": ["Zero-Waste Prep", "pre-portioned fresh ingredients"],
        "version": "1.0",
        "is_approved": True,
        "severity_default": "medium",
        "reason_template": "Glossary T-10 recommends 'Zero-Waste Prep' and 'pre-portioned fresh ingredients' over colloquial '{term}'.",
        "suggested_template": "Zero-Waste Prep"
    },
    {
        "id": "T-15",
        "category": "glossary",
        "title": "Farm-to-Door Logistics",
        "content": "Describe our sourcing and shipping model as 'Farm-to-Door'. 'Farm-to-table' is reserved only for our culinary hospitality partner programs.",
        "banned_terms": ["farm to table", "farm-to-table"],
        "approved_terms": ["Farm-to-Door"],
        "version": "1.0",
        "is_approved": True,
        "severity_default": "low",
        "reason_template": "Glossary T-15 requires 'Farm-to-Door' for direct residential meal kit delivery.",
        "suggested_template": "Farm-to-Door"
    },

    # Brand Guidelines & Claims Policies
    {
        "id": "CL-01",
        "category": "guideline",
        "title": "Competitive Superiority Claims",
        "content": "Do not make unsupported superiority claims against competitors (e.g., 'better than hello fresh', 'cheaper than grocery stores') without an explicit citation to a published third-party audit.",
        "banned_terms": ["cheaper than grocery", "better than competitors", "beating all other kits"],
        "approved_terms": [],
        "version": "1.0",
        "is_approved": True,
        "severity_default": "high",
        "reason_template": "Claims Policy CL-01 strictly prohibits unsubstantiated comparative superiority claims.",
        "suggested_template": "convenient, competitively priced meal kits"
    },
    {
        "id": "CL-02",
        "category": "guideline",
        "title": "Absolute Health & Cure Guarantees",
        "content": "Never guarantee specific medical or physiological outcomes (e.g. 'cures diabetes', 'guarantee weight loss in 2 weeks', 'burns belly fat in 7 days'). Health impact claims are strictly regulated by FSSAI/ASCI.",
        "banned_terms": ["guarantee weight loss in 2 weeks", "guarantee weight loss", "cures diabetes", "burns belly fat", "guaranteed weight loss", "cure fatigue"],
        "approved_terms": [],
        "version": "1.0",
        "is_approved": True,
        "severity_default": "high",
        "reason_template": "Claims Policy CL-02 prohibits absolute health or weight loss timelines. All health claims require clinical verification.",
        "suggested_template": "designed to support balanced eating and active lifestyles"
    },
    {
        "id": "CL-03",
        "category": "guideline",
        "title": "Claims Policy CL-3: Health and Superlative Claims",
        "content": "Health and superlative claims need approved evidence. No approved fact supports this claim, so BrandLens does not call it false. It routes the claim to a reviewer instead of guessing.",
        "banned_terms": [
            "healthiest in india", 
            "healthiest meal", 
            "healthiest in the country", 
            "number one meal kit", 
            "#1 meal kit in india",
            "best in class",
            "most nutritious in india"
        ],
        "approved_terms": ["chef-designed meal kits, with nutrition information on every pack"],
        "version": "1.1",
        "is_approved": True,
        "severity_default": "high",
        "reason_template": "Claims Policy CL-3: health and superlative claims need approved evidence. No approved fact supports this claim, so BrandLens does not call it false. It routes the claim to a reviewer instead of guessing.",
        "suggested_template": "Explore our chef-designed meal kits, with nutrition information on every pack."
    },
    {
        "id": "TONE-01",
        "category": "guideline",
        "title": "Empowering & Welcoming Brand Voice",
        "content": "FreshNest speaks with warmth, encouragement, and passion for good food. We never use shaming language, emergency pressure ('act now or stay unhealthy'), or restrictive diet anxiety.",
        "banned_terms": ["act now or stay unhealthy", "stop eating junk forever", "skinny body fast"],
        "approved_terms": ["discover fresh home-cooked flavours", "wholesome meals made effortless"],
        "version": "1.0",
        "is_approved": True,
        "severity_default": "medium",
        "reason_template": "Brand Tone Guideline TONE-01 advises empowering culinary language rather than high-pressure or guilt-based phrasing.",
        "suggested_template": "wholesome meals made effortless"
    },
    {
        "id": "ACC-01",
        "category": "guideline",
        "title": "Accessibility & Alt-Text Standards",
        "content": "All promotional visual assets must include descriptive alt-text for screen readers, and overlay text must satisfy WCAG AA contrast ratio (minimum 4.5:1 for body, 3:1 for large headlines).",
        "banned_terms": [],
        "approved_terms": [],
        "version": "1.0",
        "is_approved": True,
        "severity_default": "medium",
        "reason_template": "Accessibility Guideline ACC-01 mandates clear descriptive alt-text and WCAG AA contrast compliance.",
        "suggested_template": "Provide descriptive alt-text and adjust color contrast to ≥ 4.5:1."
    },

    # Approved Facts
    {
        "id": "F-01",
        "category": "fact",
        "title": "Metro City Delivery Coverage",
        "content": "FreshNest serves 18 major Indian metro cities with temperature-controlled cold-chain delivery.",
        "banned_terms": ["serves all india", "delivery across all 50 states", "available in 100 cities"],
        "approved_terms": ["serves 18 major Indian metro cities with temperature-controlled delivery"],
        "version": "1.0",
        "is_approved": True,
        "severity_default": "medium",
        "reason_template": "Contradicts Fact F-01: FreshNest currently operates in 18 metro cities, not all-India.",
        "suggested_template": "servicing 18 major metro cities across India"
    },
    {
        "id": "F-05",
        "category": "fact",
        "title": "Recyclable Box Packaging",
        "content": "100% recyclable insulated paper box packaging with non-toxic biodegradable chill packs.",
        "banned_terms": ["plastic boxes", "zero packaging waste"],
        "approved_terms": ["100% recyclable insulated paper box packaging"],
        "version": "1.0",
        "is_approved": True,
        "severity_default": "medium",
        "reason_template": "Fact F-05 confirms packaging is 100% recyclable insulated paper boxes.",
        "suggested_template": "100% recyclable insulated paper box packaging"
    },
    {
        "id": "F-08",
        "category": "fact",
        "title": "Chef-Designed Meals & Nutrition Facts",
        "content": "FreshNest offers chef-designed meal kits, with certified nutrition information on every pack.",
        "banned_terms": [],
        "approved_terms": ["chef-designed meal kits, with nutrition information on every pack"],
        "version": "1.0",
        "is_approved": True,
        "severity_default": "low",
        "reason_template": "Supported by Fact F-08: all recipes are chef-designed and clearly labeled with complete nutritional facts.",
        "suggested_template": "Explore our chef-designed meal kits, with nutrition information on every pack."
    },
    {
        "id": "F-12",
        "category": "fact",
        "title": "Free Delivery Order Threshold",
        "content": "Free delivery on orders of Rs 499 and above. Orders below Rs 499 have a flat Rs 49 delivery fee.",
        "banned_terms": [
            "free delivery on all orders", 
            "free shipping on every single order", 
            "always free delivery", 
            "free delivery with no minimum",
            "zero delivery fees on all orders",
            "free shipping with zero minimum spend"
        ],
        "approved_terms": ["free delivery on orders of Rs 499 and above"],
        "version": "1.0",
        "is_approved": True,
        "severity_default": "high",
        "reason_template": "Contradicts Fact F-12: Free delivery requires a minimum cart order of Rs 499.",
        "suggested_template": "free delivery on orders of Rs 499 and above (Rs 49 for smaller orders)"
    },
    {
        "id": "F-14",
        "category": "fact",
        "title": "Food Waste Reduction Statistic",
        "content": "Ingredients are pre-portioned to reduce household food waste by up to 60% compared to traditional grocery shopping.",
        "banned_terms": ["reduces 100% of food waste", "zero food waste guaranteed"],
        "approved_terms": ["reduces food waste by up to 60%"],
        "version": "1.0",
        "is_approved": True,
        "severity_default": "medium",
        "reason_template": "Fact F-14 specifies validated reduction is 'up to 60%', not 100%.",
        "suggested_template": "reduces food waste by up to 60%"
    },
    {
        "id": "F-18",
        "category": "fact",
        "title": "Sourcing and FSSAI Compliance",
        "content": "All chicken, seafood, and paneer are sourced daily from certified FSSAI farm partners.",
        "banned_terms": ["organic meat guaranteed without certification", "raw unpasteurized dairy"],
        "approved_terms": ["sourced from certified FSSAI farm partners"],
        "version": "1.0",
        "is_approved": True,
        "severity_default": "high",
        "reason_template": "Fact F-18 mandates specifying certified FSSAI farm partners.",
        "suggested_template": "sourced from certified FSSAI farm partners"
    },
    {
        "id": "F-21",
        "category": "fact",
        "title": "Subscription Flexibility",
        "content": "Subscription can be paused, modified, or cancelled anytime with 24 hours notice before delivery day.",
        "banned_terms": ["cancel with 1 hour notice", "lock-in for 1 year"],
        "approved_terms": ["paused or cancelled anytime with 24 hours notice"],
        "version": "1.0",
        "is_approved": True,
        "severity_default": "medium",
        "reason_template": "Fact F-21 confirms subscriptions can be paused or cancelled with 24 hours notice.",
        "suggested_template": "flexible subscriptions: pause or cancel anytime with 24 hours notice"
    }
]

# Sample Submissions for Instant Testing
SAMPLE_SUBMISSIONS = [
    {
        "title": "FreshNest Launch Ad Copy (Round 1 Plan Mockup)",
        "content_type": "ad_copy",
        "text": "Introducing our new diet boxes! Our boxes are the healthiest in India and guarantee weight loss in 2 weeks. Enjoy fresh ingredients delivered right to your kitchen with free delivery on all orders!",
        "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600",
        "alt_text": "",  # Missing alt text to trigger accessibility check
        "contrast_pairs": [
            {"foreground": "#94A3B8", "background": "#FFFFFF", "label": "Promo Banner Subtitle"}
        ],
        "created_by": "Jane Doe (Creator)"
    },
    {
        "title": "Weekend Social Campaign - Instagram Carousel",
        "content_type": "social_post",
        "text": "Tired of grocery runs? Fresh Nest delivers farm to table dinners right to your doorstep. Each kit includes a special masala pack for authentic flavour. Delivery is always free with zero minimum spend!",
        "image_url": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
        "alt_text": "A rustic wooden table with fresh culinary ingredients and recipe cards",
        "contrast_pairs": [
            {"foreground": "#FFFFFF", "background": "#059669", "label": "CTA Button Text"}
        ],
        "created_by": "Jane Doe (Creator)"
    },
    {
        "title": "Compliant Recipe Card Description (Clean Benchmark)",
        "content_type": "product_description",
        "text": "Explore FreshNest chef-designed meal kits, with nutrition information on every pack. Pre-portioned fresh ingredients help reduce food waste by up to 60% compared to traditional shopping. Enjoy free delivery on orders of Rs 499 and above.",
        "image_url": "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600",
        "alt_text": "Fresh vegetables and spice ingredients neatly arranged inside an insulated kraft box",
        "contrast_pairs": [
            {"foreground": "#0F172A", "background": "#F1F5F9", "label": "Nutrition Card Header"}
        ],
        "created_by": "Jane Doe (Creator)"
    }
]

# Historical recurring data for the insights dashboard
SEED_HISTORICAL_INSIGHTS = [
    {"rule_id": "T-07", "rule_title": "Meal Kits Product Terminology", "type": "RULE_VIOLATION", "content_type": "ad_copy", "action": "accepted", "reason": None},
    {"rule_id": "T-07", "rule_title": "Meal Kits Product Terminology", "type": "RULE_VIOLATION", "content_type": "social_post", "action": "dismissed", "reason": "Context qualifies claim"},
    {"rule_id": "T-07", "rule_title": "Meal Kits Product Terminology", "type": "RULE_VIOLATION", "content_type": "social_post", "action": "dismissed", "reason": "Creative wordplay / brand voice nuance"},
    {"rule_id": "T-07", "rule_title": "Meal Kits Product Terminology", "type": "RULE_VIOLATION", "content_type": "ad_copy", "action": "dismissed", "reason": "Context qualifies claim"},
    {"rule_id": "T-07", "rule_title": "Meal Kits Product Terminology", "type": "RULE_VIOLATION", "content_type": "blog_post", "action": "accepted", "reason": None},
    {"rule_id": "CL-03", "rule_title": "Claims Policy CL-3: Health and Superlative Claims", "type": "NOT_VERIFIABLE", "content_type": "ad_copy", "action": "accepted", "reason": None},
    {"rule_id": "CL-03", "rule_title": "Claims Policy CL-3: Health and Superlative Claims", "type": "NOT_VERIFIABLE", "content_type": "social_post", "action": "sent_to_reviewer", "reason": None},
    {"rule_id": "CL-03", "rule_title": "Claims Policy CL-3: Health and Superlative Claims", "type": "NOT_VERIFIABLE", "content_type": "email_newsletter", "action": "accepted", "reason": None},
    {"rule_id": "CL-03", "rule_title": "Claims Policy CL-3: Health and Superlative Claims", "type": "NOT_VERIFIABLE", "content_type": "ad_copy", "action": "dismissed", "reason": "Approved marketing exception"},
    {"rule_id": "F-12", "rule_title": "Free Delivery Order Threshold", "type": "CONTRADICTED_CLAIM", "content_type": "ad_copy", "action": "accepted", "reason": None},
    {"rule_id": "F-12", "rule_title": "Free Delivery Order Threshold", "type": "CONTRADICTED_CLAIM", "content_type": "social_post", "action": "accepted", "reason": None},
    {"rule_id": "F-12", "rule_title": "Free Delivery Order Threshold", "type": "CONTRADICTED_CLAIM", "content_type": "email_newsletter", "action": "dismissed", "reason": "Approved marketing exception"},
    {"rule_id": "T-01", "rule_title": "FreshNest Brand Capitalization", "type": "RULE_VIOLATION", "content_type": "blog_post", "action": "accepted", "reason": None},
    {"rule_id": "T-01", "rule_title": "FreshNest Brand Capitalization", "type": "RULE_VIOLATION", "content_type": "social_post", "action": "accepted", "reason": None},
    {"rule_id": "T-02", "rule_title": "SpicePod Nomenclature", "type": "RULE_VIOLATION", "content_type": "product_description", "action": "accepted", "reason": None},
    {"rule_id": "ACC-01", "rule_title": "Accessibility & Alt-Text Standards", "type": "RULE_VIOLATION", "content_type": "social_post", "action": "accepted", "reason": None},
    {"rule_id": "CL-02", "rule_title": "Absolute Health & Cure Guarantees", "type": "RULE_VIOLATION", "content_type": "ad_copy", "action": "accepted", "reason": None}
]
