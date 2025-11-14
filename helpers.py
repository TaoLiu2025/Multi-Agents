import json, re

import json, re

def consolidate_json(items):
    merged = {
        "quality_requirements": [],
        "workflow_steps": [],
        "classification_taxonomy": [],
        "annotation_expectations": [],
        "measurement_and_quantification": [],
        "edge_cases_and_exceptions": [],
        "compliance_and_constraints": [],
        "domain_knowledge": [],
        "success_metrics": [],
        "feedback_and_iteration": [],
        "tools_and_technology": [],
        "time_and_throughput_requirements": [],
        "cost_and_pricing_constraints": [],
        "training_and_skill_requirements": [],
        "security_and_privacy": [],
        "integration_and_dependencies": [],
        "user_and_experience_and_interface": [],
        "data_format_and_structure": [],
        "quality_assurance_and_testing": [],
        "recommendations": []   # only subcategory of Assumptions
    }

    seen = {k: set() for k in merged}

    def _norm_text(s: str) -> str:
        return re.sub(r"\s+", " ", s.strip().lower())

    def add(bucket, v):
        # --- Case 1: Recommendations (special handling) ---
        if bucket == "recommendations":
            if isinstance(v, dict):
                rule = v.get("rule")
                rationale = v.get("rationale")
                if isinstance(rule, str) and isinstance(rationale, str):
                    key = _norm_text(rule)
                    if key not in seen[bucket]:
                        seen[bucket].add(key)
                        merged[bucket].append({
                            "rule": rule.strip()[:140],
                            "rationale": rationale.strip()[:300]
                        })
            return

        # --- Case 2: Extractive guideline objects ---
        if isinstance(v, dict):
            rule = v.get("rule")
            quote = v.get("quote")
            page = v.get("page")

            if not (isinstance(rule, str) and isinstance(quote, str) and isinstance(page, int)):
                return

            key = f"{_norm_text(quote)}|{page}"
            if key not in seen[bucket]:
                seen[bucket].add(key)
                merged[bucket].append({
                    "rule": rule.strip()[:140],
                    "quote": quote.strip(),
                    "page": page
                })
            return

        # --- Case 3: plain string (e.g., "none") ---
        if isinstance(v, str):
            if v.strip().lower() == "none":
                return
            key = _norm_text(v)
            if key not in seen[bucket]:
                seen[bucket].add(key)
                merged[bucket].append(v.strip())
            return

        # ignore everything else
        return

    # items may be a list of objs or a single obj
    if isinstance(items, dict):
        items_iter = [items]
    else:
        items_iter = items or []

    for obj in items_iter:
        if not isinstance(obj, dict):
            continue
        for k in merged.keys():
            values = obj.get(k, [])
            if values is None or values == "none":
                continue
            if not isinstance(values, list):
                values = [values]
            for v in values:
                add(k, v)

    # Normalize empty categories → ["none"]
    for k in merged.keys():
        if k == "recommendations":
            continue
        if not merged[k]:
            merged[k] = ["none"]

    # Ensure recommendations is never empty
    if not merged["recommendations"]:
        merged["recommendations"] = [{
            "rule": "(none)",
            "rationale": "No additional recommendations were identified"
        }]

    return merged


def render_markdown(merged):
    SECTIONS = {
        "Quality requirements": "quality_requirements",
        "Measurement & Quantification": "measurement_and_quantification",
        "Success Metrics": "success_metrics",
        "Quality Assurance & Testing": "quality_assurance_and_testing",
        "Feedback & Iteration": "feedback_and_iteration",

        "Annotation expectations": "annotation_expectations",
        "Edge Cases & Exceptions": "edge_cases_and_exceptions",
        "Classification Taxonomy": "classification_taxonomy",
        "Workflow steps": "workflow_steps",

        "Compliance & Constraints": "compliance_and_constraints",
        "Security & Privacy": "security_and_privacy",
        "Cost & Pricing Constraints": "cost_and_pricing_constraints",
        "Time & Throughput Requirements": "time_and_throughput_requirements",

        "Tools & Technology": "tools_and_technology",
        "Domain Knowledge": "domain_knowledge",
        "Training & Skill Requirements": "training_and_skill_requirements",
        "Data Format & Structure": "data_format_and_structure",

        "Integration & Dependencies": "integration_and_dependencies",
        "User Experience & Interface": "user_and_experience_and_interface",

        "Recommendations": "recommendations"
    }

    GROUPS = {
        "Quality_Assurance": [
            "Quality requirements",
            "Measurement & Quantification",
            "Success Metrics",
            "Quality Assurance & Testing",
            "Feedback & Iteration",
        ],
        "Process_and_Workflow": [
            "Annotation expectations",
            "Edge Cases & Exceptions",
            "Classification Taxonomy",
            "Workflow steps",
        ],
        "Compliance and Governance": [
            "Compliance & Constraints",
            "Security & Privacy",
            "Cost & Pricing Constraints",
            "Time & Throughput Requirements",
        ],
        "Data_Processing_and_Requirements": [
            "Tools & Technology",
            "Domain Knowledge",
            "Training & Skill Requirements",
            "Data Format & Structure",
        ],
        "Integrations": [
            "Integration & Dependencies",
            "User Experience & Interface",
        ],
        "Assumptions": [
            "Recommendations"
        ],
    }

    def get_vals(key):
        vals = merged.get(key, [])
        if vals is None:
            return []
        if isinstance(vals, list):
            return vals
        return [vals]
    
    output = {}
    for group_name, section_titles in GROUPS.items():
        group_dict = {}
        for title in section_titles:
            key = SECTIONS[title]
            group_dict[key] = get_vals(key)
        output[group_name] = group_dict

    return json.dumps(output, ensure_ascii=False, indent=4),GROUPS

def validate_rubrics(rj: dict) -> bool:
    if not isinstance(rj, dict):
        return False
    scoring = rj.get("scoring", {})
    rubrics = rj.get("rubrics", [])
    if not isinstance(scoring, dict) or not isinstance(rubrics, list):
        return False
    # basic scoring checks
    if scoring.get("initial_score") != 100:
        return False
    if scoring.get("min_score") != 0:
        return False
    if not isinstance(scoring.get("fail_on_critical"), bool):
        return False
    # spot-check rubric items
    for it in rubrics:
        if not isinstance(it, dict):
            return False
        if not all(k in it for k in ("category","error_type","definition","base_penalty","evidence_links")):
            return False
        if not isinstance(it["base_penalty"], int):
            return False
    return True

# def render_rubrics_markdown(rj: dict) -> str:
#     if not rj or "rubrics" not in rj:
#         return "No rubrics."
#     lines = []
#     sc = rj.get("scoring", {})
#     lines.append(f"**Scoring**: start={sc.get('initial_score',100)}, min={sc.get('min_score',0)}, fail_on_critical={sc.get('fail_on_critical',True)}\n")
#     for i, it in enumerate(rj["rubrics"], 1):
#         lines.append(f"### {i}. {it.get('error_type','(unnamed)')}  ·  {it.get('severity','')}")
#         lines.append(f"- Category: `{it.get('category','')}`")
#         lines.append(f"- Base penalty: {it.get('base_penalty',0)}")
#         # show first evidence link
#         ev = it.get("evidence_links",[{}])[0]
#         lines.append(f"- Evidence: “{ev.get('quote','')}” (p.{ev.get('page','?')})\n")
#     return "\n".join(lines)
