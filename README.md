# 🎮 Learning Fun Games! ✨

A collection of educational web games designed to make learning fun and interactive. Challenge yourself with timed gameplay, score tracking, and comprehensive performance summaries!

## 🎯 Featured Games

### 🎨 Guess the Picture!
Look at images and guess what they are! Test your observation skills and vocabulary.

### 📖 Guess the Word!
Use clever hints to figure out mystery words! Perfect for expanding your vocabulary.

### 🔢 Math Challenge!
Solve math problems and level up! Challenge your calculation skills with increasing difficulty.

### 💡 Fun Quiz!
Answer multiple choice questions! Test your general knowledge across various topics.

## ⭐ New Features

### ⏱️ Timer System
- **60 seconds** to complete each game
- **-5 seconds** for each incorrect answer (no time penalty for correct answers)
- Game ends when timer reaches zero
- Visual timer warnings when time is running low

### 🏆 Enhanced Scoring
- **+5 points** for correct answers (no score penalty for incorrect answers)
- Real-time score tracking
- Performance-based rewards in Math Challenge (level up every 25 points)

### 📊 Game Summary
After each game, view your complete performance:
- Final score
- Number of correct answers
- Number of incorrect answers
- Time remaining
- Options to play again or return to menu

### 🎨 Improved UI/UX
- Prominent game titles with gradient animations
- Timer display with color warnings (green > orange > red)
- Enhanced "Back to Menu" button with modern design
- Loading states for submit buttons
- Improved input focus states and hover effects
- Enhanced visual feedback and smooth transitions
- Responsive design for all devices
- Accessibility improvements (high contrast support, reduced motion)

## 🚀 Getting Started

### Prerequisites
- Python 3.7+ (for backend)
- Modern web browser
- Internet connection (for external fonts and placeholder images)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd game-e-learning/backend
   ```

2. Install required packages:
   ```bash
   pip3 install -r requirements.txt
   ```

3. Start the Flask server:
   ```bash
   python3 app.py
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd game-e-learning/frontend
   ```

2. Open `index.html` in your web browser, or serve it using a local server:
   ```bash
   # Using Python's built-in server
   python3 -m http.server 8000
   ```

   Then visit `http://localhost:8000`

## 🎮 How to Play

1. **Choose a Game**: Select from four exciting games on the main menu
2. **Beat the Clock**: You have 60 seconds to answer as many questions as possible
3. **Score Points**: Earn +5 points for correct answers, but be careful - wrong answers cost you 5 seconds!
4. **View Results**: Check your performance summary at the end of each game
5. **Challenge Yourself**: Try to beat your previous scores and answer more questions correctly!

### 🎯 Game Mechanics
- **Correct Answer**: +5 points, no time penalty
- **Incorrect Answer**: -5 seconds from timer, no score penalty
- **Timer Warnings**: 
  - Normal (>20s): Blue timer
  - Warning (11-20s): Orange timer with pulse animation
  - Danger (≤10s): Red timer with urgent animation

## 🛠️ Technical Details

### Frontend Technologies
- **HTML5** - Structure and semantics
- **CSS3** - Styling with gradients, animations, and responsive design
- **JavaScript (ES6+)** - Game logic, timers, and API interactions
- **Tailwind CSS** - Utility-first CSS framework

### Backend Technologies
- **Flask** - Python web framework
- **Flask-CORS** - Cross-origin resource sharing
- **JSON** - Data storage for questions

### Project Structure
```
game-e-learning/
├── frontend/
│   ├── index.html              # Main menu
│   ├── guess_picture_game.html # Picture guessing game
│   ├── guess_word_game.html    # Word guessing game
│   ├── math_challenge_game.html # Math challenge game
│   ├── fun_quiz_game.html      # Quiz game
│   ├── script.js               # Game logic and interactions
│   └── style.css               # Styling and animations
├── backend/
│   ├── app.py                  # Flask server
│   ├── requirements.txt        # Python dependencies
│   └── data/
│       ├── picture_questions.json
│       ├── word_questions.json
│       └── quiz_questions.json
└── README.md
```

## 🎨 Customization

### Adding New Questions
Edit the JSON files in `backend/data/`:
- `picture_questions.json` - Add new image URLs and answers
- `word_questions.json` - Add new hints and answers
- `quiz_questions.json` - Add new questions with multiple choice options

### Styling
Modify `frontend/style.css` to change:
- Color schemes
- Animations
- Layout and spacing
- Typography

### Game Logic
Update `frontend/script.js` to adjust:
- Timer duration
- Scoring system
- Difficulty progression
- Game mechanics

## 🔧 Configuration

### Timer Settings
In `script.js`, modify these variables:
```javascript
let gameTimer = 60; // Initial time in seconds
adjustTimer(-5);    // Time penalty for incorrect answers only
```

### Scoring System
```javascript
picScore += 5;      // Points for correct answers
// No score penalty for incorrect answers
```

## 🌟 Features in Detail

### Timer Warnings
- **Blue**: Timer > 20 seconds (normal state)
- **Orange**: Timer 11-20 seconds (warning with pulse animation)
- **Red**: Timer ≤ 10 seconds (danger with urgent animation)

### Responsive Design
- **Desktop**: 2-column grid layout
- **Mobile**: Single-column stacked layout
- **Tablets**: Optimized for touch interactions

### Accessibility
- High contrast colors with high contrast mode support
- Large, readable fonts with improved typography
- Keyboard navigation support (Enter key for submissions)
- Clear visual feedback and loading states
- Reduced motion support for users with motion sensitivity
- Proper focus management and outline styles

## 🐛 Troubleshooting

### Backend Issues
- **Port already in use**: Change the port in `app.py` or stop other Flask apps
- **Module not found**: Ensure all requirements are installed with `pip3 install -r requirements.txt`
- **CORS errors**: Check that Flask-CORS is properly installed

### Frontend Issues
- **Images not loading**: Check internet connection for placeholder images
- **API errors**: Ensure backend is running on the correct port
- **Layout issues**: Clear browser cache and check CSS file loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🎉 Have Fun!

Enjoy learning and challenging yourself with these educational games! Try to beat your high scores and improve your knowledge across different subjects.