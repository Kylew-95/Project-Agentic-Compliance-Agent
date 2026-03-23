from flask import Blueprint, jsonify, request
from services.parliament_service import parliament_service
from services.compliance_service import compliance_service
from data.memory_store import company_data
import asyncio
from functools import wraps
import os
import io

# Optional PDF support
try:
    import PyPDF2
except ImportError:
    PyPDF2 = None

api_bp = Blueprint("api", __name__)

# Helper to run async functions in Flask
def async_route(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        return asyncio.run(f(*args, **kwargs))
    return wrapper

def _extract_text(file):
    filename = file.filename.lower()
    if filename.endswith(".txt"):
        return file.read().decode("utf-8")
    elif filename.endswith(".pdf") and PyPDF2:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file.read()))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text
    return "Unsupported file format"

def _infer_business_context(text):
    text = text.lower()
    inferred = {
        "name": "Extracted Entity",
        "sector": "Legal",
        "key_policies": [],
        "risk_tolerance": "Conservative"
    }
    
    if "bank" in text or "finance" in text or "fca" in text:
        inferred["sector"] = "Financial"
        inferred["name"] = "Financial Services Corp"
    elif "data" in text or "software" in text or "privacy" in text:
        inferred["sector"] = "Tech"
        inferred["name"] = "Digital Innovations Ltd"
    elif "education" in text or "school" in text:
        inferred["sector"] = "Education"
        inferred["name"] = "Academic Trust"
    
    if "iso27001" in text or "security" in text:
        inferred["key_policies"].append("Information Security")
    if "gdpr" in text or "privacy" in text:
        inferred["key_policies"].append("Data Privacy")
        
    return inferred

@api_bp.route("/legislation", methods=["GET"])
@async_route
async def get_legislation():
    laws = await parliament_service.get_latest_bills()
    
    # Use the RAG-lite Compliance Engine to calculate impact and matches
    compliance_report = compliance_service.assess_business_risk(company_data, laws)
    bill_matches = compliance_report.get("bill_matches", {})
    
    # Enrich laws with RAG findings
    for law in laws:
        law["rag_matches"] = bill_matches.get(law["id"], [])
        # 'impact' is already set within assess_business_risk for each law object
            
    return jsonify({"laws": laws, "compliance_summary": compliance_report})

@api_bp.route("/compliance/status", methods=["GET"])
@async_route
async def get_compliance_status():
    laws = await parliament_service.get_latest_bills()
    status = compliance_service.assess_business_risk(company_data, laws)
    return jsonify(status)

from services.agent_logic import ClientMessengerAgent

@api_bp.route('/actions', methods=['GET'])
def get_actions():
    messenger = ClientMessengerAgent()
    draft = messenger.draft_update("Arbitration Bill [HL]", "Report Stage")
    
    actions = [
        {
            "id": "deadline-1",
            "agent": "Deadline Sentinel",
            "type": "Calendar Sync",
            "description": "Critical filing deadline detected in 'Case_Notes_v2.pdf' (Due: March 28th). Sync to Outlook?",
            "timestamp": "2 mins ago",
            "status": "pending"
        },
        {
            "id": "messenger-1",
            "agent": "Client Messenger",
            "type": "Draft Email",
            "description": f"Proposed Update: {draft}",
            "timestamp": "10 mins ago",
            "status": "pending"
        },
        {
            "id": "sorter-1",
            "agent": "Case Sorter",
            "type": "Categorization",
            "description": "Identified 'Letter_to_MP.docx' as 'Legislative Correspondence'. Move to designated folder?",
            "timestamp": "15 mins ago",
            "status": "pending"
        }
    ]
    return jsonify(actions)

@api_bp.route("/notifications", methods=["GET"])
def get_notifications():
    # Fetch status to generate real-time alerts
    # In a real app, this would be a historical log
    return jsonify([
        {
            "id": 1,
            "title": "Legislative Conflict Detected",
            "message": f"New High Risk bill detected for {company_data.get('sector')} sector.",
            "timestamp": "Just now",
            "type": "risk"
        },
        {
            "id": 2,
            "title": "MP Voting Shift",
            "message": "Critical bill for your industry has moved to Second Reading.",
            "timestamp": "2h ago",
            "type": "info"
        }
    ])

@api_bp.route("/legislation/votes", methods=["GET"])
@async_route
async def get_legislation_votes():
    title = request.args.get("title")
    if not title:
        return jsonify({"error": "Title parameter required"}), 400
    votes = await parliament_service.get_bill_votes(title)
    return jsonify(votes)

@api_bp.route("/upload", methods=["POST"])
def upload_context():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400
    
    try:
        raw_text = _extract_text(file)
        inferred = _infer_business_context(raw_text)
        company_data.update(inferred)
        company_data["raw_context_length"] = len(raw_text)
        
        return jsonify({
            "message": "Business context inferred successfully",
            "inferred_profile": inferred
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route("/members", methods=["GET"])
@async_route
async def get_members():
    members = await parliament_service.get_members()
    return jsonify(members)

@api_bp.route("/company", methods=["GET", "POST"])
def manage_company():
    if request.method == "POST":
        data = request.json
        company_data.update(data)
        return jsonify({"message": "Profile updated", "profile": company_data})
    return jsonify(company_data)

@api_bp.route("/chat", methods=["POST"])
@async_route
async def ai_chat():
    user_query = request.json.get("query")
    return jsonify({
        "response": f"Based on your inferred {company_data['sector']} profile, I've analyzed '{user_query}'. You have {len(company_data.get('key_policies', []))} key policies relevant to this query.",
        "context_used": company_data
    })
