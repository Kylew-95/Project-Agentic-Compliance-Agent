from flask import Flask, jsonify
from flask_cors import CORS
from api.routes import api_bp

app = Flask(__name__)
# Enable CORS for all routes under /api/ for any origin during development
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Register the modular API routes
app.register_blueprint(api_bp, url_prefix="/api")

@app.route("/")
def read_root():
    return jsonify({"status": "Agentic Compliance Flask API is running (Modular Mode)"})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=True)
