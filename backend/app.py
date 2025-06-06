from flask import Flask, jsonify
from flask_cors import CORS
import random
import sys # Import sys module to print errors
import os # Import os module

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# --- Game Data (normally stored in a database) ---
# Picture Game Questions
PIC_QUESTIONS = [
    {"src": "https://placehold.co/400x300/A8D9FF/3182CE?text=Cute+Cat", "answer": "cat"},
    {"src": "https://placehold.co/400x300/FFC1D8/FF69B4?text=Happy+Dog", "answer": "dog"},
    {"src": "https://placehold.co/400x300/E6FFE6/3CB371?text=Red+Apple", "answer": "apple"},
    {"src": "https://placehold.co/400x300/ADD8E6/4682B4?text=Big+Tree", "answer": "tree"},
    {"src": "https://placehold.co/400x300/FFD700/FFA500?text=Shiny+Car", "answer": "car"},
    {"src": "https://placehold.co/400x300/FFFACD/FFB6C1?text=Warm+House", "answer": "house"},
    {"src": "https://placehold.co/400x300/B0E0E6/6A5ACD?text=Singing+Bird", "answer": "bird"},
    {"src": "https://placehold.co/400x300/FAD0E0/DB7093?text=Yellow+Banana", "answer": "banana"},
    {"src": "https://placehold.co/400x300/C1FFFF/40E0D0?text=Blue+Book", "answer": "book"},
    {"src": "https://placehold.co/400x300/FFB6C1/FF69B4?text=Fast+Bike", "answer": "bike"},
    {"src": "https://placehold.co/400x300/98FB98/32CD32?text=Green+Frog", "answer": "frog"},
    {"src": "https://placehold.co/400x300/87CEEB/4169E1?text=Big+Fish", "answer": "fish"},
    {"src": "https://placehold.co/400x300/FFEFD5/FF8C00?text=Happy+Sun", "answer": "sun"},
    {"src": "https://placehold.co/400x300/E6E6FA/9370DB?text=Purple+Flower", "answer": "flower"},
    {"src": "https://placehold.co/400x300/FFFACD/DAA520?text=Yellow+Star", "answer": "star"},
]

# Word Game Questions
WORD_QUESTIONS = [
    {"hint": "A large, yellow fruit that monkeys love to eat.", "answer": "banana"},
    {"hint": "It has four legs and barks.", "answer": "dog"},
    {"hint": "You use this to read stories and learn new things.", "answer": "book"},
    {"hint": "It flies in the sky and has feathers.", "answer": "bird"},
    {"hint": "You drive this on roads. It has four wheels.", "answer": "car"},
    {"hint": "This sweet, red fruit grows on trees.", "answer": "apple"},
    {"hint": "It has a trunk and green leaves, providing shade.", "answer": "tree"},
    {"hint": "A friendly animal that meows and loves to nap.", "answer": "cat"},
    {"hint": "A structure where people live.", "answer": "house"},
    {"hint": "You pedal this to ride. It has two wheels.", "answer": "bike"},
    {"hint": "A small, green amphibian that jumps.", "answer": "frog"},
    {"hint": "It swims in water and has fins.", "answer": "fish"},
    {"hint": "A bright, warm star that lights up our day.", "answer": "sun"},
    {"hint": "It's beautiful, colorful, and smells nice. Often found in gardens.", "answer": "flower"},
    {"hint": "A shining object in the night sky, often twinkle.", "answer": "star"},
]

# Quiz Game Questions
QUIZ_QUESTIONS = [
    {
        "question": "What animal says 'moo'?",
        "options": ["Dog", "Cat", "Cow", "Duck"],
        "correctAnswerIndex": 2 # Cow
    },
    {
        "question": "What color is the sky on a sunny day?",
        "options": ["Green", "Blue", "Yellow", "Red"],
        "correctAnswerIndex": 1 # Blue
    },
    {
        "question": "How many legs does a dog have?",
        "options": ["Two", "Four", "Six", "Eight"],
        "correctAnswerIndex": 1 # Four
    },
    {
        "question": "Which fruit is yellow and long?",
        "options": ["Apple", "Orange", "Banana", "Grape"],
        "correctAnswerIndex": 2 # Banana
    },
    {
        "question": "What do you wear on your feet?",
        "options": ["Gloves", "Hat", "Shoes", "Scarf"],
        "correctAnswerIndex": 2 # Shoes
    }
]

# --- API Endpoints ---

@app.route('/')
def home():
    return "Backend is running! Access API endpoints like /api/questions/picture"

@app.route('/api/questions/picture', methods=['GET'])
def get_picture_questions():
    """Returns a shuffled list of picture questions."""
    shuffled_questions = random.sample(PIC_QUESTIONS, len(PIC_QUESTIONS)) # Shuffle all
    return jsonify(shuffled_questions)

@app.route('/api/questions/word', methods=['GET'])
def get_word_questions():
    """Returns a shuffled list of word questions."""
    shuffled_questions = random.sample(WORD_QUESTIONS, len(WORD_QUESTIONS))
    return jsonify(shuffled_questions)

@app.route('/api/questions/quiz', methods=['GET'])
def get_quiz_questions():
    """Returns a shuffled list of quiz questions."""
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
