from flask import Flask, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


@app.route('api/health', methods=['GET'])
def health_check():
    """Return a simple health check response."""
    return jsonify({
        "status": "ok",
        "message": "Recipe API is running"
    })

if __name__ == '__main__':
    print("Starting Recipe Kitchen API...")
    print("Server running on http://localhost:5000")
    app.run(debug=True, port=5000)

