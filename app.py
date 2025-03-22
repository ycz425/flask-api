from flask import Flask, request, jsonify
from chatbot import vectorize_and_store, get_response

app = Flask(__name__)

FILE_TYPES = [
    "application/pdf",  # PDF
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",  # PPTX
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",  # DOCX
]


@app.route("/")
def root():
    return jsonify({
        "message": "Welcome to the Course Dash API."
    })


@app.route("/upload", methods=["POST"])
def upload_file():
    """Handles user file uploads."""
    file = request.files.get("file")
    # course = request.json.get("course")  # could be form or json dependng on how frontend sends request
    # TODO: add other useful file metadata

    if not file:
        return jsonify({"error": "No file provided"}), 400

    if file.content_type not in FILE_TYPES:
        return jsonify({"error": "Unsupported file type"}), 400

    # Process the file and store in ChromaDB (for chatbot)
    vectorize_and_store(file)

    # TODO: insert to database


    return jsonify({"message": "File uploaded & processed successfully."})


@app.route("/chat", methods=["POST"])
def generate_response():
    """Generate a response to user queries."""
    query = request.json.get("query")

    if not query:
        return jsonify({"error": "No query provided"}), 400
    
    response = get_response(query)
    
    return jsonify({'response': response})
    

if __name__ == '__main__':
    app.run(debug=True)
