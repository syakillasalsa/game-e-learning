from flask import Flask, jsonify
from flask_cors import CORS
import random
import sys # Import sys module to print errors
import os # Import os module
import json # Import json module

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# Function to load questions from a JSON file
def load_questions_from_json(filepath):
    try:
        with open(filepath, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: Question file not found at {filepath}", file=sys.stderr)
        return []
    except json.JSONDecodeError:
        print(f"Error: Could not decode JSON from {filepath}", file=sys.stderr)
        return []
    except Exception as e:
        print(f"An unexpected error occurred loading {filepath}: {e}", file=sys.stderr)
        return []

# --- Load Game Data ---
# Use paths relative to the current file (app.py)
data_dir = os.path.join(os.path.dirname(__file__), 'data')
PIC_QUESTIONS = load_questions_from_json(os.path.join(data_dir, 'picture_questions.json'))
WORD_QUESTIONS = load_questions_from_json(os.path.join(data_dir, 'word_questions.json'))
QUIZ_QUESTIONS = load_questions_from_json(os.path.join(data_dir, 'quiz_questions.json'))

# --- API Endpoints ---

@app.route('/')
def home():
    return "Backend is running! Access API endpoints like /api/questions/picture"

@app.route('/api/questions/picture', methods=['GET'])
def get_picture_questions():
    """Returns a shuffled list of picture questions."""
    # Ensure PIC_QUESTIONS is not empty before shuffling
    if not PIC_QUESTIONS:
        return jsonify([]), 404 # Return empty list and 404 if no questions loaded
    shuffled_questions = random.sample(PIC_QUESTIONS, len(PIC_QUESTIONS)) # Shuffle all
    return jsonify(shuffled_questions)

@app.route('/api/questions/word', methods=['GET'])
def get_word_questions():
    """Returns a shuffled list of word questions."""
    # Ensure WORD_QUESTIONS is not empty before shuffling
    if not WORD_QUESTIONS:
         return jsonify([]), 404 # Return empty list and 404 if no questions loaded
    shuffled_questions = random.sample(WORD_QUESTIONS, len(WORD_QUESTIONS))
    return jsonify(shuffled_questions)

@app.route('/api/questions/quiz', methods=['GET'])
def get_quiz_questions():
    """Returns a shuffled list of quiz questions."""
    # Ensure QUIZ_QUESTIONS is not empty before shuffling
    if not QUIZ_QUESTIONS:
         return jsonify([]), 404 # Return empty list and 404 if no questions loaded
    shuffled_questions = random.sample(QUIZ_QUESTIONS, len(QUIZ_QUESTIONS))
    return jsonify(shuffled_questions)

@app.route('/api/questions/math', methods=['GET'])
def get_math_questions():
    """
    Generates a simple set of math questions (not predefined).
    In a real app, you might generate these on the fly or fetch from DB.
    For this example, we'll return a fixed set of difficulty levels.
    """
    # For a real math game, you'd generate questions dynamically on the frontend based on level.
    # Here, we'll just return a placeholder for the frontend to know it's ready.
    return jsonify({"status": "ready", "message": "Math questions are generated on frontend based on level."})


if __name__ == '__main__':
    # Define the port, allowing it to be overridden by an environment variable
    port = int(os.environ.get('PORT', 5000))

    print(f"Attempting to start Flask app on port {port}...") # Added print statement

    try:
        # Run the Flask app on default host and port 5000
        # debug=True allows for auto-reloading on code changes and provides a debugger
        # host='0.0.0.0' binds to all available network interfaces
        app.run(debug=True, host='0.0.0.0', port=port)
    except Exception as e:
        print(f"Error starting Flask app: {e}", file=sys.stderr)
        # Check if the error is due to port in use
        if "Address already in use" in str(e):
            print(f"Port {port} is already in use. Please close the application using this port or choose a different port.", file=sys.stderr)
            print("You can try changing the port by setting the environment variable PORT, e.g., 'set PORT=5001' before running 'python app.py'", file=sys.stderr)
        sys.exit(1) # Exit with an error code