# server.py
from __future__ import annotations
import os, json, uuid
from datetime import datetime
from typing import Any, Dict, List, Tuple

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

# Reuse the SAME logic your Streamlit app uses
from extractor import extract_guidelines, generate_rubrics_from_categories, flatten_guidelines_from_consolidated, generate_workflow_from_guidelines, extract_overview,merge_overview_results
from helpers import consolidate_json, render_markdown, validate_rubrics
# from validate import minicheck_validate  # optional; safe to disable below

# --------- Config ---------
ALLOWED_EXTS = {".pdf", ".doc", ".docx", ".txt"}
MAX_MB = 50
RUN_MINICHECK = False  # turn on if you want to run minicheck before HIL
CORS_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]

# --------- App + CORS ---------
app = FastAPI(title="Guideline Processing API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,       # ok if you're not using cookies; harmless otherwise
    allow_methods=["*"],          # or ["GET","POST","OPTIONS"]
    allow_headers=["*"],          # lets 'content-type' & any custom headers pass
    max_age=3600,
)

# --------- In-memory state (swap for Redis/db if needed) ---------
STATE: Dict[str, Dict[str, Any]] = {}

# --------- Helpers copied from your Streamlit flow (no UI deps) ---------
DEFAULT_GROUPS = {
    "Quality_Assurance": [],
    "Process_and_Workflow": [],
    "Compliance and Governance": [],
    "Data_Processing_and_Requirements": [],
    "Integrations": [],
    "Assumptions": ["Recommendations"],
}

# def _grouped_to_flat(parsed: Dict[str, Any]) -> Dict[str, Dict[str, List[Dict[str, Any]]]]:
#     """
#     Keep the grouped structure: {Group: {Category: [rules]}}
#     Just normalize the items inside each category.
#     """
#     result: Dict[str, Dict[str, List[Dict[str, Any]]]] = {}
    
#     for group_name, group_content in (parsed or {}).items():
#         if not isinstance(group_content, dict):
#             continue
            
#         result[group_name] = {}
        
#         for category, items in (group_content or {}).items():
#             normalized_items = []
            
#             for item in (items or []):
#                 # Skip "none" entries
#                 if isinstance(item, str) and item.lower() == "none":
#                     continue
                    
#                 # Convert string to dict
#                 if isinstance(item, str):
#                     item = {"rule": item}
                    
#                 # Ensure it's a dict
#                 if isinstance(item, dict):
#                     normalized_items.append(item)
            
#             # Only add category if it has items
#             if normalized_items:
#                 result[group_name][category] = normalized_items
    
#     # Remove empty groups
#     result = {k: v for k, v in result.items() if v}
#     return result

# def _bootstrap_hil(grouped: Dict[str, Dict[str, List[Dict[str, Any]]]]) -> Dict[str, Dict[str, List[Dict[str, Any]]]]:
#     """
#     Add standard HIL fields to each item, maintaining the grouped structure.
#     """
#     fixed: Dict[str, Dict[str, List[Dict[str, Any]]]] = {}
    
#     for group, categories in (grouped or {}).items():
#         fixed[group] = {}
#         for category, items in (categories or {}).items():
#             normalized = []
#             for item in items:
#                 item = dict(item) if isinstance(item, dict) else {"rule": str(item)}
#                 item.setdefault("rule", "")
#                 item.setdefault("quote", item.get("quote", ""))
#                 item.setdefault("page", item.get("page", 1))
#                 item.setdefault("status", "pending")
#                 item.setdefault("last_updated", None)
#                 normalized.append(item)
#             fixed[group][category] = normalized
    
#     return fixed

def _grouped_to_flat(parsed: Dict[str, Any]) -> Dict[str, Dict[str, List[Dict[str, Any]]]]:
    """
    Keep the grouped structure: {Group: {Category: [rules]}}
    Just normalize the items inside each category.
    """
    result: Dict[str, Dict[str, List[Dict[str, Any]]]] = {}
    
    for group_name, group_content in (parsed or {}).items():
        if not isinstance(group_content, dict):
            continue
            
        result[group_name] = {}
        
        for category, items in (group_content or {}).items():
            normalized_items = []
            
            for item in (items or []):
                # Skip "none" entries
                if isinstance(item, str) and item.lower() == "none":
                    continue
                    
                # Convert string to dict
                if isinstance(item, str):
                    item = {"rule": item}
                    
                # Ensure it's a dict
                if isinstance(item, dict):
                    normalized_items.append(item)
            
            # Only add category if it has items
            if normalized_items:
                result[group_name][category] = normalized_items
    
    # Remove empty groups
    result = {k: v for k, v in result.items() if v}
    return result

def _bootstrap_hil(grouped: Dict[str, Dict[str, List[Dict[str, Any]]]]) -> Dict[str, Dict[str, List[Dict[str, Any]]]]:
    """
    Add standard HIL fields to each item, maintaining the grouped structure.
    """
    fixed: Dict[str, Dict[str, List[Dict[str, Any]]]] = {}
    
    for group, categories in (grouped or {}).items():
        fixed[group] = {}
        for category, items in (categories or {}).items():
            normalized = []
            for item in items:
                item = dict(item) if isinstance(item, dict) else {"rule": str(item)}
                item.setdefault("rule", "")
                item.setdefault("quote", item.get("quote", ""))
                item.setdefault("page", item.get("page", 1))
                item.setdefault("status", "pending")
                item.setdefault("last_updated", None)
                normalized.append(item)
            fixed[group][category] = normalized
    
    return fixed

def _apply_hil_patch(hil: Dict[str, Dict[str, List[Dict[str, Any]]]], group: str, category: str, index: int, patch: Dict[str, Any]) -> None:
    """Update a specific item in the grouped HIL structure."""
    if group in hil and category in hil[group] and 0 <= index < len(hil[group][category]):
        hil[group][category][index].update(patch)
        hil[group][category][index]["last_updated"] = datetime.utcnow().isoformat() + "Z"
    else:
        raise IndexError("Invalid group/category/index")

def _export_final(hil: Dict[str, Dict[str, List[Dict[str, Any]]]], groups: Dict[str, list]) -> Dict[str, Any]:
    """Export only accepted/edited items."""
    final_out: Dict[str, Any] = {}
    
    for group_name, categories in hil.items():
        group_dict: Dict[str, List[str]] = {}
        
        for category, items in categories.items():
            rules: List[str] = []
            for item in items:
                if item.get("status") in ("accepted", "edited"):
                    r = (item.get("rule") or "").strip()
                    if r:
                        rules.append(r)
            
            if rules:
                # Deduplicate
                seen, dedup = set(), []
                for r in rules:
                    if r not in seen:
                        seen.add(r)
                        dedup.append(r)
                group_dict[category] = dedup
        
        if group_dict:
            final_out[group_name] = group_dict
    
    return final_out

# --------- API Endpoints ---------
@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    # 1) validate + save
    name = file.filename or "upload"
    ext = os.path.splitext(name)[1].lower()
    if ext not in ALLOWED_EXTS:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {ext}")

    data = await file.read()
    if len(data) > MAX_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File too large (> {MAX_MB}MB)")

    os.makedirs("uploads", exist_ok=True)
    path = os.path.join("uploads", name)
    with open(path, "wb") as f:
        f.write(data)

    # 2) create session with status=uploaded (no extraction here)
    sid = str(uuid.uuid4())
    STATE[sid] = {
        "status": "uploaded",
        "file_path": path,
        "filename": name,
        "size_bytes": len(data),
        # placeholders for later steps:
        "extracted_json": None,
        "groups": None,
        "hil_data": None,
        "rubrics": None,
        "overview": None,
    }

    return {
        "session_id": sid,
        "status": "uploaded",
        "filename": name,
        "size_bytes": len(data),
    }

# New: do heavy work when the user clicks in the Extraction tab
from extractor import extract_guidelines, generate_rubrics_from_categories
from helpers import consolidate_json, render_markdown, validate_rubrics

# --------- Overview Endpoints ---------
@app.get("/overview/{session_id}")
def get_overview(session_id: str):
    """Get overview for a session"""
    s = STATE.get(session_id)
    if not s:
        raise HTTPException(status_code=404, detail="Session not found")
    
    overview = s.get("overview")
    if not overview:
        return {"overview": None, "message": "No overview generated yet"}
    
    return {"overview": overview}

@app.post("/overview/{session_id}/generate")
def generate_overview_endpoint(session_id: str):
    """Generate overview from the uploaded document"""
    s = STATE.get(session_id)
    if not s:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if s["status"] not in ("uploaded", "extracted", "error"):
        raise HTTPException(status_code=400, detail="Invalid status for overview generation")
    
    file_path = s.get("file_path")
    if not file_path or not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Source file not found")
    
    try:
        print(f"Generating overview for session {session_id}...")
        
        # Extract overview
        overview_results = extract_overview(file_path)
        overview = merge_overview_results(overview_results)
        
        # Store in session
        s["overview"] = overview
        
        print(f"Overview generated successfully:")
        print(f"  - Scope: {'✓' if overview.get('scope') else '✗'}")
        print(f"  - Objective: {'✓' if overview.get('objective') else '✗'}")
        print(f"  - Quality Criteria: {len(overview.get('quality_criteria', []))}")
        print(f"  - Edge Cases: {len(overview.get('edge_cases', []))}")
        print(f"  - Responsibilities: {len(overview.get('annotator_responsibilities', []))}")
        print(f"  - Throughput: {'✓' if overview.get('expected_throughput') else '✗'}")
        
        return {
            "overview": overview,
            "summary": {
                "has_scope": bool(overview.get("scope")),
                "has_objective": bool(overview.get("objective")),
                "quality_criteria_count": len(overview.get("quality_criteria", [])),
                "positive_examples": len(overview.get("examples", {}).get("positive", [])),
                "negative_examples": len(overview.get("examples", {}).get("negative", [])),
                "edge_cases_count": len(overview.get("edge_cases", [])),
                "responsibilities_count": len(overview.get("annotator_responsibilities", [])),
                "has_throughput": bool(overview.get("expected_throughput"))
            }
        }
        
    except Exception as e:
        import traceback
        print("ERROR generating overview:")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Failed to generate overview: {e}")

@app.post("/overview/{session_id}/update")
async def update_overview(session_id: str, payload: Dict[str, Any]):
    """Update specific overview fields"""
    s = STATE.get(session_id)
    if not s:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if not s.get("overview"):
        raise HTTPException(status_code=400, detail="No overview exists to update")
    
    overview = s["overview"]
    
    # Update specific fields based on payload
    field = payload.get("field")
    value = payload.get("value")
    
    if field and field in overview:
        overview[field] = value
        s["overview"] = overview
        return {"ok": True, "overview": overview}
    else:
        raise HTTPException(status_code=400, detail=f"Invalid field: {field}")

@app.delete("/overview/{session_id}")
def delete_overview(session_id: str):
    """Delete overview"""
    s = STATE.get(session_id)
    if not s:
        raise HTTPException(status_code=404, detail="Session not found")
    
    s["overview"] = None
    return {"ok": True}

@app.post("/extract/{session_id}")
def run_extraction(session_id: str):
    s = STATE.get(session_id)
    if not s:
        raise HTTPException(status_code=404, detail="Session not found")
    if s["status"] not in ("uploaded", "error"):
        return {"status": s["status"]}

    s["status"] = "processing"
    try:
        print(f"Starting extraction for {s['file_path']}")
        results = extract_guidelines(s["file_path"])
        print(f"Extraction complete, got results")
        
        merged = consolidate_json(results)
        print(f"Consolidated results")
        
        extracted_json, groups = render_markdown(merged)
        print(f"Rendered markdown, groups: {groups}")
        
        # Parse and debug
        parsed = json.loads(extracted_json) if extracted_json else {}
        print(f"Parsed JSON keys: {list(parsed.keys())}")
        
        # Flatten and bootstrap
        hil_flat = _grouped_to_flat(parsed)
        print(f"Flattened groups: {list(hil_flat.keys())}")
        
        hil_data = _bootstrap_hil(hil_flat)
        print(f"Bootstrapped HIL: {list(hil_data.keys())}")
        
        s["extracted_json"] = extracted_json
        s["groups"] = groups or DEFAULT_GROUPS
        s["hil_data"] = hil_data
        s["status"] = "extracted"
        
        return {"status": s["status"], "extracted_json": extracted_json, "groups": groups}
    except Exception as e:
        import traceback
        print("ERROR in extraction:")
        print(traceback.format_exc())
        s["status"] = "error"
        raise HTTPException(status_code=500, detail=f"{type(e).__name__}: {e}")


@app.get("/hil/{session_id}")
def get_hil(session_id: str):
    s = STATE.get(session_id)
    if not s:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"hil_data": s["hil_data"], "groups": s["groups"]}

@app.post("/hil/{session_id}/update")
async def update_hil(session_id: str, payload: Dict[str, Any]):
    """
    Body: {"group": str, "category": str, "index": int, "patch": {...}}
    """
    s = STATE.get(session_id)
    if not s:
        raise HTTPException(status_code=404, detail="Session not found")

    try:
        _apply_hil_patch(
            s["hil_data"], 
            payload["group"], 
            payload["category"], 
            int(payload["index"]), 
            payload.get("patch", {})
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {"ok": True}

@app.get("/document/{session_id}")
def serve_document(session_id: str):
    s = STATE.get(session_id)
    if not s or not s.get("file_path"):
        raise HTTPException(status_code=404, detail="Document not found")
    return FileResponse(
        s["file_path"],
        media_type="application/pdf",
        filename=s.get("filename", "document.pdf")
    )

# --------- Rubric Management Endpoints ---------

@app.get("/rubrics/{session_id}")
def get_rubrics(session_id: str):
    """Get all rubrics for a session"""
    s = STATE.get(session_id)
    if not s:
        raise HTTPException(status_code=404, detail="Session not found")
    
    rubrics = s.get("rubrics", [])
    return {"rubrics": rubrics}

@app.post("/rubrics/{session_id}/generate")
def generate_rubrics_endpoint(session_id: str):
    """Generate rubrics from extracted guidelines"""
    s = STATE.get(session_id)
    if not s:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if not s.get("hil_data"):
        raise HTTPException(status_code=400, detail="No extracted data. Run extraction first.")
    
    try:
        # Get approved/accepted guidelines
        final_data = _export_final(s["hil_data"], s.get("groups", {}))
        print(f"DEBUG: Final data for rubrics: {final_data}")
        
        # Generate rubrics using your existing function
        rubrics_json = generate_rubrics_from_categories(json.dumps(final_data))
        
        # Parse rubrics
        rubrics_data = json.loads(rubrics_json) if isinstance(rubrics_json, str) else rubrics_json
        
        print(f"DEBUG: Rubrics structure: {rubrics_data.keys() if isinstance(rubrics_data, dict) else type(rubrics_data)}")
        
        # Extract rubrics list and scoring config
        rubrics_list = rubrics_data.get("rubrics", []) if isinstance(rubrics_data, dict) else []
        scoring_config = rubrics_data.get("scoring", {}) if isinstance(rubrics_data, dict) else {}
        
        print(f"DEBUG: Found {len(rubrics_list)} rubrics")
        
        # Convert to frontend format
        rubric_list = []
        for idx, rubric in enumerate(rubrics_list, start=1):
            penalty = abs(rubric.get("base_penalty", -10))
            
            if penalty >= 30:
                criticality = "critical"
            elif penalty >= 20:
                criticality = "high"
            elif penalty >= 10:
                criticality = "medium"
            else:
                criticality = "low"
            
            rubric_list.append({
                "id": str(idx),
                "errorType": rubric.get("error_type", "Unknown Error"),
                "category": rubric.get("category", ""),
                "description": rubric.get("definition", ""),
                "criticality": criticality,
                "penalty": penalty,
                "adjustmentRule": f"Correct {rubric.get('error_type', 'error')} to avoid penalty",
                "status": "draft",
                "validator": None,
                "evidence": rubric.get("evidence_links", [])
            })
        
        print(f"DEBUG: Converted {len(rubric_list)} rubrics")
        print(f"DEBUG: First rubric: {rubric_list[0] if rubric_list else 'None'}")
        
        s["rubrics"] = rubric_list
        s["scoring_config"] = scoring_config
        
        print(f"DEBUG: Stored rubrics in session, returning response")
        
        return {"rubrics": rubric_list, "scoring": scoring_config}
        
    except Exception as e:
        import traceback
        print("ERROR generating rubrics:")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Failed to generate rubrics: {e}")

@app.post("/rubrics/{session_id}/update")
async def update_rubric(session_id: str, payload: Dict[str, Any]):
    """Update a rubric rule"""
    s = STATE.get(session_id)
    if not s:
        raise HTTPException(status_code=404, detail="Session not found")
    
    rubrics = s.get("rubrics", [])
    rubric_id = payload.get("id")
    
    # Find and update the rubric
    for rubric in rubrics:
        if rubric["id"] == rubric_id:
            rubric.update(payload.get("updates", {}))
            break
    
    s["rubrics"] = rubrics
    return {"ok": True}

@app.post("/rubrics/{session_id}/add")
async def add_rubric(session_id: str, payload: Dict[str, Any]):
    """Add a new rubric rule"""
    s = STATE.get(session_id)
    if not s:
        raise HTTPException(status_code=404, detail="Session not found")
    
    rubrics = s.get("rubrics", [])
    new_id = str(len(rubrics) + 1)
    
    new_rubric = {
        "id": new_id,
        "errorType": payload.get("errorType", ""),
        "description": payload.get("description", ""),
        "criticality": payload.get("criticality", "medium"),
        "penalty": payload.get("penalty", 10),
        "adjustmentRule": payload.get("adjustmentRule", ""),
        "status": "draft",
        "validator": None
    }
    
    rubrics.append(new_rubric)
    s["rubrics"] = rubrics
    return {"rubric": new_rubric}

@app.delete("/rubrics/{session_id}/{rubric_id}")
def delete_rubric(session_id: str, rubric_id: str):
    """Delete a rubric rule"""
    s = STATE.get(session_id)
    if not s:
        raise HTTPException(status_code=404, detail="Session not found")
    
    rubrics = s.get("rubrics", [])
    s["rubrics"] = [r for r in rubrics if r["id"] != rubric_id]
    return {"ok": True}

@app.get("/rubrics/{session_id}")
def get_rubrics(session_id: str):
    """Get all rubrics for a session"""
    s = STATE.get(session_id)
    if not s:
        raise HTTPException(status_code=404, detail="Session not found")
    
    rubrics = s.get("rubrics", [])
    print(f"DEBUG: Returning {len(rubrics)} rubrics")
    return {"rubrics": rubrics}

@app.get("/workflow/{session_id}")
def get_workflow(session_id: str):
    """Get workflow for a session"""
    s = STATE.get(session_id)
    if not s:
        raise HTTPException(status_code=404, detail="Session not found")
    
    workflow = s.get("workflow")
    if not workflow:
        return {"workflow": None, "message": "No workflow generated yet"}
    
    return {"workflow": workflow}

@app.post("/workflow/{session_id}/generate")
def generate_workflow_endpoint(session_id: str):
    """Generate workflow from extracted guidelines"""
    s = STATE.get(session_id)
    if not s:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if not s.get("hil_data"):
        raise HTTPException(status_code=400, detail="No extracted data. Run extraction first.")
    
    try:
        # Get approved/accepted guidelines from HIL data
        final_data = _export_final(s["hil_data"], s.get("groups", {}))
        print(f"DEBUG: Final data for workflow: {json.dumps(final_data, indent=2)}")
        
        # Flatten guidelines from the consolidated structure
        guidelines = flatten_guidelines_from_consolidated(final_data)
        print(f"DEBUG: Extracted {len(guidelines)} guidelines for workflow")
        
        if not guidelines:
            raise ValueError("No guidelines found to generate workflow")
        
        # Generate workflow using the workflow creation agent
        workflow_json = generate_workflow_from_guidelines(guidelines)
        
        print(f"DEBUG: Generated workflow with {len(workflow_json.get('Agents', []))} agents")
        
        # Store workflow in session
        s["workflow"] = workflow_json
        
        # Return workflow summary
        return {
            "workflow": workflow_json,
            "summary": {
                "total_agents": workflow_json['Workflow_Overview']['Total_agents'],
                "total_guidelines": workflow_json['Workflow_Overview']['Total_guidelines_covered'],
                "workflow_name": workflow_json['Workflow_Overview']['Workflow_name'],
                "execution_sequence": workflow_json['Workflow_Overview']['Execution_sequence']
            }
        }
        
    except Exception as e:
        import traceback
        print("ERROR generating workflow:")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Failed to generate workflow: {e}")

@app.post("/workflow/{session_id}/update")
async def update_workflow(session_id: str, payload: Dict[str, Any]):
    """Update workflow structure"""
    s = STATE.get(session_id)
    if not s:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if not s.get("workflow"):
        raise HTTPException(status_code=400, detail="No workflow exists to update")
    
    # Update specific parts of the workflow
    workflow = s["workflow"]
    
    # Handle different update types
    update_type = payload.get("type")
    
    if update_type == "agent":
        # Update a specific agent
        agent_name = payload.get("agent_name")
        updates = payload.get("updates", {})
        
        for agent in workflow.get("Agents", []):
            if agent.get("Agent_name") == agent_name:
                agent.update(updates)
                break
    
    elif update_type == "overview":
        # Update workflow overview
        workflow["Workflow_Overview"].update(payload.get("updates", {}))
    
    elif update_type == "full":
        # Replace entire workflow
        workflow = payload.get("workflow", workflow)
    
    s["workflow"] = workflow
    return {"ok": True, "workflow": workflow}

@app.delete("/workflow/{session_id}")
def delete_workflow(session_id: str):
    """Delete workflow"""
    s = STATE.get(session_id)
    if not s:
        raise HTTPException(status_code=404, detail="Session not found")
    
    s["workflow"] = None
    return {"ok": True}


@app.get("/export/{session_id}/final")
def export_final(session_id: str):
    s = STATE.get(session_id)
    if not s:
        raise HTTPException(status_code=404, detail="Session not found")
    final = _export_final(s["hil_data"], s["groups"])
    return {"json": final}

@app.get("/export/{session_id}/full")
def export_full(session_id: str):
    s = STATE.get(session_id)
    if not s:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"json": s["hil_data"]}

@app.get("/export/{session_id}/workflow")
def export_workflow(session_id: str):
    """Export workflow JSON"""
    s = STATE.get(session_id)
    if not s:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if not s.get("workflow"):
        raise HTTPException(status_code=404, detail="No workflow to export")
    
    return {"workflow": s["workflow"]}

@app.get("/export/{session_id}/complete")
def export_complete(session_id: str):
    """Export complete package: guidelines, rubrics, and workflow"""
    s = STATE.get(session_id)
    if not s:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {
        "session_id": session_id,
        "filename": s.get("filename"),
        "overview": s.get("overview"),
        "guidelines": _export_final(s["hil_data"], s["groups"]),
        "rubrics": s.get("rubrics", []),
        "workflow": s.get("workflow"),
        "exported_at": datetime.utcnow().isoformat() + "Z"
    }

@app.get("/healthz")
def health():
    """Health check"""
    return {"ok": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)