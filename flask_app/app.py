from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_app.chatbot import vectorize_and_store, get_response, delete_history
from flask_app.text_extraction import extract_title
import datetime

from flask_app.add_sample_users import insert_sample_users

app = Flask(__name__)
CORS(app, origins="*", methods=["GET", "POST", "OPTIONS"], allow_headers=["Content-Type", "Authorization"])


FILE_TYPES = [
    "application/pdf",  # PDF
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",  # PPTX
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",  # DOCX
]


@app.route("/")
def root():
    return jsonify({
        "message": "Welcome to the CourseDash API."
    })


@app.route("/api/upload", methods=["POST"])
def upload_file():
    """Handles user file uploads."""
    file = request.files.get("file")
    course = request.form.get("course")
    title = request.form.get("title")
    user_id = request.form.get("user_id")

    if not file:
        return jsonify({"error": "No file provided"}), 400
    
    if not course:
        return jsonify({"error": "No course provided"}), 400

    if file.content_type not in FILE_TYPES:
        return jsonify({"error": "Unsupported file type"}), 400

    # Process the file and store in ChromaDB (for chatbot)
    vectorize_and_store(file, course, title, user_id)

    return jsonify({"message": "File uploaded & processed successfully."})


@app.route("/api/lecture-title", methods=["POST"])
def get_lecture_title():
    file = request.files.get('file')

    if not file:
        return jsonify({"error": "No file provided"}), 400
    
    if file.content_type not in FILE_TYPES:
        return jsonify({"error": "Unsupported file type"}), 400

    title = extract_title(file)
    return jsonify({'title': title})


@app.route("/api/chat", methods=["POST"])
def generate_response():
    """Generate a response to user queries."""
    query = request.json.get("query")
    course = request.json.get("course")
    user_id = request.json.get("user_id")

    if not query:
        return jsonify({"error": "No query provided"}), 400
    
    response = get_response(query, course, user_id)
    
    return jsonify({'response': response})


@app.route("/api/chat", methods=["DELETE"])
def delete_chat_history():
    # Deletes the unified in-memory chat history for now.
    # In the future, chat history will be stored in the cloud.
    delete_history()


@app.route('/api/users', methods=['POST'])
def create_user():
    # Get the JSON data from request
    user_data = request.get_json()
    
    # Validate required fields
    required_fields = ['googleUid', 'email']
    for field in required_fields:
        if not user_data.get(field):
            return jsonify({
                "error": f"Missing required field: {field}"
            }), 400

    try:
        # Format the user data for MongoDB
        user_to_insert = [{
            "googleUid": user_data.get('googleUid'),
            "email": user_data.get('email'),
            "displayName": user_data.get('displayName'),
            "photoURL": user_data.get('photoURL'),
            "createdAt": datetime.datetime.now(datetime.timezone.utc),
            "lastLoginAt": datetime.datetime.now(datetime.timezone.utc)
        }]
        
        # Insert the user into MongoDB
        inserted_ids = insert_sample_users(user_to_insert, "User")
        
        if not inserted_ids:
            return jsonify({
                "error": "Failed to create user in database"
            }), 500
            
        return jsonify({
            "message": "User created successfully",
            "userId": str(inserted_ids[0])
        }), 201
            
    except Exception as e:
        return jsonify({
            "error": f"Server error: {str(e)}"
        }), 500


if __name__ == '__main__':
    app.run(debug=True)
