import os
import io
import base64
import yaml
from crewai import Agent, Task, Crew
from langchain_openai import AzureChatOpenAI
from dotenv import load_dotenv
from document_parser import parse_pdf, parse_docx
import json, re

# Load environment variables
load_dotenv()
base_dir = os.path.dirname(__file__)
yaml_path = os.path.join(base_dir, "task_descriptions.yaml")

with open(yaml_path, "r", encoding="utf8") as f:
    task_config = yaml.safe_load(f)

# # Load task config
# with open("task_descriptions.yaml", "r",encoding='utf8') as f:
#     task_config = yaml.safe_load(f)

extraction_cfg = task_config["extraction_agent"]
rubric_cfg = task_config["rubric_agent"]
overview_cfg = task_config["overview_agent"]

# Azure OpenAI deployments from .env
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT") or ""
TEXT_DEPLOYMENT = os.getenv("TEXT_DEPLOYMENT")   # gpt-4o
IMAGE_DEPLOYMENT = os.getenv("IMAGE_DEPLOYMENT") # gpt-4.1
AZURE_API_KEY = os.getenv("AZURE_OPENAI_API_KEY") or ""

os.environ["AZURE_API_KEY"] = AZURE_API_KEY
os.environ["AZURE_API_BASE"] = AZURE_OPENAI_ENDPOINT
os.environ["AZURE_API_VERSION"] = "2024-05-01-preview"
os.environ["OPENAI_API_KEY"] = AZURE_API_KEY

# Create two AzureChatOpenAI clients: one for text, one for image
llm_text = AzureChatOpenAI(
    deployment_name=TEXT_DEPLOYMENT,
    azure_endpoint=AZURE_OPENAI_ENDPOINT,
    api_key=AZURE_API_KEY,
    api_version="2024-05-01-preview",
    temperature=0
)

llm_image = AzureChatOpenAI(
    deployment_name=IMAGE_DEPLOYMENT,
    azure_endpoint=AZURE_OPENAI_ENDPOINT,
    api_key=AZURE_API_KEY,
    api_version="2024-05-01-preview",
    temperature=0
)

def safe_parse_json(s: str):
    s = s.strip()
    # strip accidental fences if any
    s = re.sub(r"^```(?:json)?|```$", "", s, flags=re.IGNORECASE|re.MULTILINE)
    return json.loads(s)

def extract_guidelines(file_path):
    # """Extract guidelines from both text and image content in PDF/DOCX."""
    # if file_path.endswith(".pdf"):
    #     texts, images = parse_pdf(file_path)
    # elif file_path.endswith(".docx"):
    #     texts, images = parse_docx(file_path)

    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".pdf":
        texts, images = parse_pdf(file_path)
    elif ext == ".docx":
        texts, images = parse_docx(file_path)
    else:
        raise ValueError("Unsupported file type")

    results = []

    # Process text with GPT-4o
    for text in texts:
        response = llm_text.invoke(
            f"{extraction_cfg['task_description']}\n\nDocument Segment:\n{text}"
        )
        results.append(safe_parse_json(response.content))

    # Process images with GPT-4.1
    for img_data in images:
        buf = None
        
        if isinstance(img_data, dict):
            img = img_data.get('image')
            if img and hasattr(img, 'save'):
                buf = io.BytesIO()
                img.save(buf, format="PNG")
                buf.seek(0)
        elif hasattr(img_data, 'save'):
            # It's already a PIL Image
            buf = io.BytesIO()
            img_data.save(buf, format="PNG")
            buf.seek(0)
        
        # Skip if we couldn't get valid image data
        if buf is None:
            continue
            
        img_b64 = base64.b64encode(buf.getvalue()).decode("utf-8")

        response = llm_image.invoke([
            {"role": "system", "content": "You are an expert annotation guideline extractor. Return ONLY valid minified JSON with the required keys. No markdown"},
            {"role": "user", "content": [
                {"type": "text", "text": extraction_cfg["task_description"]},
                {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{img_b64}"}}
            ]}
        ])
        results.append(safe_parse_json(response.content))

    return results

def generate_rubrics_from_categories(consolidated_categories: dict) -> dict:
    """
    Call the rubric agent with your consolidated categories JSON and return parsed rubric JSON.
    """
    prompt = (
        f"{rubric_cfg['task_description']}\n\n"
        f"INPUT CATEGORIES JSON:\n{json.dumps(consolidated_categories, ensure_ascii=False)}"
    )
    resp = llm_text.invoke(prompt)
    return safe_parse_json(resp.content)

def extract_json_from_output(output):
    """Extract JSON from CrewOutput object or string"""
    output_str = str(output).strip()
    
    # Remove any potential wrapper text and get just the JSON part
    start_idx = output_str.find('{')
    end_idx = output_str.rfind('}') + 1
    
    if start_idx == -1 or end_idx == 0:
        raise ValueError(f"No JSON object found in output: {output_str}")
    
    json_str = output_str[start_idx:end_idx]
    
    try:
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"Raw output that failed to parse: {json_str}")
        # Try to fix common JSON issues
        try:
            import re
            json_str = re.sub(r'(\w+):', r'"\1":', json_str)
            return json.loads(json_str)
        except:
            raise ValueError(f"Failed to parse JSON from output: {e}")

def flatten_guidelines_from_consolidated(consolidated_data: dict) -> list:
    """
    Extract a flat list of guidelines from the consolidated/grouped structure.
    Handles both string guidelines and dict guidelines with 'rule' key.
    """
    guidelines = []
    
    def extract_from_structure(obj):
        if isinstance(obj, dict):
            # Check if this is a guideline dict with 'rule' key
            if 'rule' in obj:
                rule = obj['rule'].strip()
                if rule and rule.lower() != 'none':
                    guidelines.append(rule)
            else:
                # Recurse into nested dicts
                for value in obj.values():
                    extract_from_structure(value)
        elif isinstance(obj, list):
            for item in obj:
                if isinstance(item, str):
                    item = item.strip()
                    if item and item.lower() != 'none':
                        guidelines.append(item)
                elif isinstance(item, dict) and 'rule' in item:
                    rule = item['rule'].strip()
                    if rule and rule.lower() != 'none':
                        guidelines.append(rule)
                else:
                    extract_from_structure(item)
        elif isinstance(obj, str):
            obj = obj.strip()
            if obj and obj.lower() != 'none':
                guidelines.append(obj)
    
    extract_from_structure(consolidated_data)
    
    # Remove duplicates while preserving order
    seen = set()
    unique_guidelines = []
    for g in guidelines:
        if g not in seen:
            seen.add(g)
            unique_guidelines.append(g)
    
    return unique_guidelines

def generate_workflow_from_guidelines(guidelines: list) -> dict:
    """
    Generate a workflow structure from a list of guidelines using clustering and workflow builder agents.
    """
    if not guidelines:
        raise ValueError("No guidelines provided for workflow generation")
    
    print(f"Generating workflow from {len(guidelines)} guidelines...")

    max_retries = 3
    clusters_json = None

    for attempt in range(max_retries):
    
        # Step 1: Clustering
        cluster_task = Task(
            description=f"""
            CRITICAL: You MUST include ALL {len(guidelines)} guidelines from the input. Do not miss any.

            Guidelines to cluster ({len(guidelines)} total):
            {chr(10).join([f'{i+1}. {guideline}' for i, guideline in enumerate(guidelines)])}

            Task:
            1. Group related guidelines into 3-5 meaningful clusters based on common themes
            2. Ensure EVERY guideline is included in exactly one cluster
            3. Create clusters that make logical sense for workflow design
            4. Provide descriptive cluster names that reflect the theme

            Output MUST be valid JSON format only:
            {{
            "Clusters": [
                {{
                "Cluster_name": "Descriptive theme name",
                "Guidelines": ["guideline 1", "guideline 2", ...],
                "Cluster_description": "Brief description of what this cluster covers"
                }}
            ],
            "Total_guidelines_processed": {len(guidelines)},
            "Guidelines_coverage_check": "All guidelines must be included"
            }}

            Important: Verify that all {len(guidelines)} guidelines are distributed across clusters.
            """,
            agent=clustering_agent,
            expected_output="JSON clusters with all guidelines included"
        )

        clustering_crew = Crew(
            agents=[clustering_agent],
            tasks=[cluster_task],
            verbose=True
        )
        
        clusters_output = clustering_crew.kickoff()
        clusters_json = extract_json_from_output(clusters_output)
    
    # Verify all guidelines are included
        total_clustered = sum(len(cluster['Guidelines']) for cluster in clusters_json['Clusters'])
        if total_clustered == len(guidelines):
                print(f"✓ Clustering successful on attempt {attempt + 1}. Found {len(clusters_json['Clusters'])} clusters covering all {total_clustered} guidelines.")
                break
        else:
            print(f"⚠ Attempt {attempt + 1}: Coverage mismatch - {total_clustered} clustered vs {len(guidelines)} input")
            
            if attempt == max_retries - 1:
                # Last attempt - find and add missing guidelines
                all_clustered = set()
                for cluster in clusters_json['Clusters']:
                    all_clustered.update(cluster['Guidelines'])
                
                missing = [g for g in guidelines if g not in all_clustered]
                
                if missing:
                    print(f"⚠ Missing {len(missing)} guidelines. Adding to 'General Compliance' cluster.")
                    # Add missing guidelines to a general cluster
                    general_cluster = next(
                        (c for c in clusters_json['Clusters'] if 'general' in c['Cluster_name'].lower()),
                        clusters_json['Clusters'][0]  # or first cluster
                    )
                    general_cluster['Guidelines'].extend(missing)
                    clusters_json['Total_guidelines_processed'] = len(guidelines)
                    
                    print(f"✓ Recovered all guidelines. Total: {sum(len(c['Guidelines']) for c in clusters_json['Clusters'])}")
    
    # Step 2: Workflow Design
    workflow_task = Task(
        description=f"""
        Create a comprehensive sequential workflow definition that covers the end-to-end process from uploading a document to generating the final dashboard.

        Create a comprehensive workflow definition based on these clusters:

        Clusters ({len(clusters_json['Clusters'])}):
        {json.dumps(clusters_json, indent=2)}

        CRITICAL REQUIREMENTS:
        1. First, outline the sequential steps involved in the entire process.Each step must include the following fields:
                - Step_name: short title of the step
                - Description: what happens in this step
                - Expected_output: what this step produces for the next stage
        2. Create one agent for each cluster - DO NOT MISS ANY GUIDELINES FROM THE INPUT JSON.
        3. For each agent, define:
           - Agent_name: Descriptive name based on cluster theme
           - Role_description: Detailed role description including domain focus
           - Skillset: Technical skills + Domain knowledge + Fact-checking capabilities
           - Guidelines: ALL guidelines from the cluster (MUST include every single one)
           - Validations: Specific checks the agent will perform on annotated data
           - Decision_points: Conditional logic for escalation (e.g., "If fact-check score < 0.8 → escalate to HIL")
        4. Define the execution sequence for agents based on logical dependencies
        5. Provide comprehensive workflow summary and overview which incldues:
            - Must include complete end-to-end process overview from document upload to final deliverables
            - Must list all final deliverables the system will produce
            - Must describe the overall objective and key phases
        7. For Worflow process: 
            - Analyze the guidelines to understand what annotators need to do
            - Derive the sequential annotation workflow steps based on:
                * The nature of guidelines (what are they about?)
                * The type of annotation task implied
                * The logical order annotators must follow
                * Quality checks and validations required
            - Each step represents a phase in the annotation process and hence define:
              -Step name: Decriptive name for that step
              -Description: Describe what is happening in this step
              -Annotators action: List the annotator actions inovlved
              -Expected_output: Define what will be the expected output
              -Quality Gates: List the quality gates that can be used for this step
        - Steps should reflect ACTUAL ANNOTATION WORK, not just system operations
        - Include: data intake → annotation tasks → quality checks → review → finalization 
        6. ABSOLUTELY NO quality scoring rules

        Output MUST be comprehensive JSON with this structure and below is an Example output: 
        {{
          "Workflow_Overview": {{
            "Workflow_name": "Comprehensive Guideline Compliance & Validation Workflow",
            "Total_agents": {len(clusters_json['Clusters'])},
            "Total_guidelines_covered": {len(guidelines)},
            "Workflow_description": "Multi-agent workflow for guideline compliance verification and fact-checking with HIL escalation",
            "Execution_sequence": ["Agent1_name", "Agent2_name", ...],
            "Validation_framework": "Multi-stage validation with automated checks and human escalation points"
          }},
          "Workflow_Summary": {{
                "Workflow_name": "Comprehensive Guideline Compliance & Quality Assurance Workflow",
                "End_to_end_process": "Complete process: document upload → guideline extraction → clustering → agent creation → annotation with multi-agent validation → HIL review for escalations → quality assessment → dashboard generation with metrics and insights.",
                "Final_deliverables": [
                "Comprehensive compliance report with guideline adherence metrics",
                "Quality assurance dashboard with validation results",
                "Agent validation outputs with confidence scores",
                ],
                "Objective": "Ensure comprehensive guideline compliance through multi-stage validation with automated fact-checking and human escalation for critical decisions",
                "Key_phases": [
                "Phase 1: Document upload and guideline extraction",
                "Phase 2: Guideline clustering and agent creation", 
                "Phase 3: Annotation execution with agent-based validation",
                ],
                "Quality_assurance_approach": "Multi-layer validation with automated fact-checking, agent-based guideline compliance verification, and human oversight for ambiguous or low-confidence cases"
            }},
          "Workflow_Process": [
                {{
                    "Step_name": "Data Intake and Preparation",
                    "Description": "Annotators receive dataset/content and system prepares data per guideline requirements.",
                    "Annotator_actions": [List of Annotator actions],
                    "Expected_output": "Clean, validated dataset ready for annotation with required metadata",
                    "Quality_gates": ["Data completeness check", "Format validation", "Scope verification"]
                }},
                {{
                    "Step_name": "Primary Annotation Execution",
                    "Description": "Annotators perform core annotation tasks per guidelines with agent validation.",
                    "Annotator_actions": ["Apply annotation guidelines", "Make labeling decisions", "Document edge cases", "Follow domain-specific rules"],
                    "Agent_involvement": "Agents monitor annotations for guideline compliance within their domain expertise",
                    "Expected_output": "Annotated dataset with guideline-compliant labels and decisions",
                    "Quality_gates": ["Guideline adherence check", "Consistency validation", "Completeness verification"]
                }},
                {{
                    "Step_name": "Quality Review and Compliance Check",
                    "Description": "All agents validate annotations against guideline clusters with inter-agent consistency checks.",
                    "Annotator_actions": ["Review quality reports", "Address flagged issues", "Refine annotations as needed"],
                    "Agent_involvement": "All agents perform cross-validation, generate compliance reports, identify issues",
                    "Expected_output": "Quality assessment report with compliance metrics per guideline cluster",
                    "Quality_gates": ["Multi-agent consensus check", "Guideline coverage verification", "Quality threshold validation"]
                }}
            ],
          "Agents": [
            {{
              "Agent_name": "Descriptive Name reflecting domain expertise",
              "Role_description": "Detailed description including domain focus and validation responsibilities",
              "Skillset": [
                "Technical skill with proficiency level",
                "Domain knowledge: [Specific domain expertise required]",
                "Fact-checking: [Specific fact-verification capabilities]",
                "Validation methodology: [Approach for data validation]"
              ],
              "Domain_knowledge": [
                "Specific industry knowledge area 1",
                "Regulatory framework expertise 2", 
                "Technical domain specialization 3"
              ],
              "Guidelines": [List of all the guidelines that the agent is handling],
              "Validations": [
                "Validation check 1: Description of what to verify",
                "Validation check 2: Specific criteria to assess",
                "Data quality assessment: Metrics and thresholds"
              ],
              "Decision_points": [
                "If fact-check confidence < 0.8 → escalate to human reviewer",
                "If validation score < threshold → flag for manual inspection",
                "If ambiguous evidence → request additional context"
              ],
              "Sequence_position": 1,
              "HIL_escalation_triggers": ["Low confidence scores", "Conflicting evidence", "Ambiguous guidelines"]
            }}
          ],
        }}

        VALIDATION: Before finalizing output, verify that ALL {len(guidelines)} input guidelines are distributed across agents. 
        Each guideline must appear exactly once in the final workflow.
        """,
        agent=workflow_builder_agent,
        expected_output="Comprehensive workflow JSON with domain expertise"
    )

    workflow_crew = Crew(
        agents=[workflow_builder_agent],
        tasks=[workflow_task],
        verbose=True
    )
    
    workflow_output = workflow_crew.kickoff()
    workflow_json = extract_json_from_output(workflow_output)
    
    # Validate structure
    required_keys = ['Workflow_Overview','Workflow_Process', 'Agents', 'Workflow_Summary']
    for key in required_keys:
        if key not in workflow_json:
            raise ValueError(f"Missing required key: {key}")
    
    print(f"✓ Workflow design successful. Created {len(workflow_json['Agents'])} agents.")
    
    return workflow_json

def extract_overview(file_path):
    """Extract high-level overview from guidelines document"""
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".pdf":
        texts, images = parse_pdf(file_path)
    elif ext == ".docx":
        texts, images = parse_docx(file_path)
    else:
        raise ValueError("Unsupported file type")

    results = []

    # Process text segments
    if texts:
        print(f"Processing {len(texts)} text segments for overview...")
        
        # Extract text content - handle multiple possible formats
        text_segments = []
        for item in texts:
            if isinstance(item, str):
                text_segments.append(item)
            elif isinstance(item, dict):
                text_content = (
                    item.get('text') or 
                    item.get('content') or 
                    item.get('page_content') or
                    item.get('extracted_text') or
                    str(item)
                )
                text_segments.append(text_content)
            else:
                text_segments.append(str(item))
        
        # Filter out empty segments
        text_segments = [t for t in text_segments if t and t.strip()]
        
        if text_segments:
            # Combine all text and process once
            combined_text = "\n\n--- PAGE BREAK ---\n\n".join(text_segments)
            
            response = llm_text.invoke(
                f"{overview_cfg['task_description']}\n\nFull Document Content:\n{combined_text}"
            )
            results.append(safe_parse_json(response.content))

    # Process images with vision model
    if images:
        print(f"Processing {len(images)} images for overview...")
        for idx, img_data in enumerate(images, 1):
            print(f"  Processing image {idx}/{len(images)}")
            buf = None
            
            if isinstance(img_data, dict):
                img = img_data.get('image')
                if img and hasattr(img, 'save'):
                    buf = io.BytesIO()
                    img.save(buf, format="PNG")
                    buf.seek(0)
            elif hasattr(img_data, 'save'):
                buf = io.BytesIO()
                img_data.save(buf, format="PNG")
                buf.seek(0)
            
            if buf is None:
                continue
                
            img_b64 = base64.b64encode(buf.getvalue()).decode("utf-8")

            response = llm_image.invoke([
                {"role": "system", "content": "You are an expert annotation guideline overview extractor. Return ONLY valid minified JSON with the required keys. No markdown"},
                {"role": "user", "content": [
                    {"type": "text", "text": overview_cfg["task_description"]},
                    {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{img_b64}"}}
                ]}
            ])
            results.append(safe_parse_json(response.content))

    return results

def merge_overview_results(results):
    """Merge multiple overview extractions into one comprehensive result"""
    merged = {
        "scope": None,
        "objective": None,
        "quality_criteria": [],
        "examples": {
            "positive": [],
            "negative": [],
            "general": []
        },
        "edge_cases": [],
        "annotator_responsibilities": [],
        "expected_throughput": None
    }
    
    for result in results:
        # Merge scope
        if result.get("scope") and not merged["scope"]:
            merged["scope"] = result["scope"]
        elif result.get("scope") and merged["scope"]:
            if result["scope"] not in merged["scope"]:
                merged["scope"] += " " + result["scope"]
        
        # Merge objective
        if result.get("objective") and not merged["objective"]:
            merged["objective"] = result["objective"]
        elif result.get("objective") and merged["objective"]:
            if result["objective"] not in merged["objective"]:
                merged["objective"] += " " + result["objective"]
        
        # Merge quality criteria
        if result.get("quality_criteria"):
            for criterion in result["quality_criteria"]:
                if criterion not in merged["quality_criteria"]:
                    merged["quality_criteria"].append(criterion)
        
        # Merge examples
        for ex_type in ["positive", "negative", "general"]:
            if result.get("examples", {}).get(ex_type):
                merged["examples"][ex_type].extend(result["examples"][ex_type])
        
        # Merge edge cases
        if result.get("edge_cases"):
            existing_cases = {ec["case"] for ec in merged["edge_cases"]}
            for edge_case in result["edge_cases"]:
                if edge_case["case"] not in existing_cases:
                    merged["edge_cases"].append(edge_case)
                    existing_cases.add(edge_case["case"])
        
        # Merge responsibilities
        if result.get("annotator_responsibilities"):
            for resp in result["annotator_responsibilities"]:
                if resp not in merged["annotator_responsibilities"]:
                    merged["annotator_responsibilities"].append(resp)
        
        # Merge throughput
        if result.get("expected_throughput") and not merged["expected_throughput"]:
            merged["expected_throughput"] = result["expected_throughput"]
    
    # Trim long strings
    if merged["scope"] and len(merged["scope"]) > 300:
        merged["scope"] = merged["scope"][:297] + "..."
    if merged["objective"] and len(merged["objective"]) > 300:
        merged["objective"] = merged["objective"][:297] + "..."
    
    return merged

# Define CrewAI agent
extraction_agent = Agent(
    role=extraction_cfg["role"],
    backstory=extraction_cfg["backstory"],
    goal=extraction_cfg["goal"],
    tasks=[
        Task(
            description=extraction_cfg["task_description"],
            expected_output="Valid JSON matching the schema (no markdown, no code fences)"
        )
    ],
    llm=llm_text  # default LLM for CrewAI conversations
)

rubric_agent = Agent(
    role=rubric_cfg["role"],
    backstory=rubric_cfg["backstory"],
    goal=rubric_cfg["goal"],
    tasks=[
        Task(
            description=rubric_cfg["task_description"],
            expected_output="Valid minified JSON matching the rubric schema; no markdown"
        )
    ],
    llm=llm_text
)

clustering_agent = Agent(
    role="Clustering Agent",
    goal="Group related guidelines into meaningful clusters without missing any guidelines from the input.",
    backstory="This agent specializes in analyzing guidelines and identifying thematic groupings while ensuring comprehensive coverage.",
    llm=f"azure/{TEXT_DEPLOYMENT}",
    verbose=True
)

workflow_builder_agent = Agent(
    role="Workflow Builder Agent",
    goal="Create a comprehensive workflow that includes all guidelines with detailed domain-specific skillsets and proper sequencing.",
    backstory="This agent structures clustered guidelines into a complete workflow definition with domain expertise and proper execution order.",
    llm=f"azure/{TEXT_DEPLOYMENT}",
    verbose=True
)

overview_agent = Agent(
    role=overview_cfg["role"],
    backstory=overview_cfg["backstory"],
    goal=overview_cfg["goal"],
    tasks=[
        Task(
            description=overview_cfg["task_description"],
            expected_output="Valid JSON with overview information (no markdown)"
        )
    ],
    llm=llm_text
)

# Main crew with all agents
crew = Crew(agents=[overview_agent, extraction_agent, rubric_agent, clustering_agent, workflow_builder_agent])