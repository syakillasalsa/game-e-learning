// --- Global Game State & Elements ---
// Note: These variables are global and will be shared across HTML pages.
// Their state will reset upon navigating to a new HTML page.
// If persistence across pages is needed (e.g., carrying score to another game),
// localStorage or a backend database would be necessary.

// Base URL for your backend API
const API_BASE_URL = "http://127.0.0.1:5000/api/questions"; // Adjust if your Flask app runs on a different port/host

// Common helper for message display
function showMessage(messageAreaId, message, isCorrect) {
  const messageArea = document.getElementById(messageAreaId);
  if (messageArea) {
    // Check if element exists before manipulating
    messageArea.textContent = message;
    messageArea.classList.remove("hidden", "correct", "incorrect", "show");
    if (isCorrect) {
      messageArea.classList.add("correct");
    } else {
      messageArea.classList.add("incorrect");
    }
    messageArea.classList.add("show");

    setTimeout(() => {
      messageArea.classList.remove("show");
      setTimeout(() => {
        messageArea.classList.add("hidden");
      }, 500);
    }, 1500);
  }
}

// Common timer and scoring system
let gameTimer = 60; // 60 seconds initial time
let timerInterval = null;
let gameStats = {
  correctAnswers: 0,
  incorrectAnswers: 0,
  finalScore: 0
};

function startTimer(timerDisplayId, onTimeUp) {
  const timerDisplay = document.getElementById(timerDisplayId);
  if (!timerDisplay) return;
  
  timerInterval = setInterval(() => {
    gameTimer--;
    timerDisplay.textContent = gameTimer;
    
    // Get the parent timer item for class management
    const timerItem = timerDisplay.closest('.timer-item');
    
    // Change color and add warning classes based on time remaining
    if (gameTimer <= 10) {
      if (timerItem) {
        timerItem.classList.remove('warning');
        timerItem.classList.add('danger');
      }
    } else if (gameTimer <= 20) {
      if (timerItem) {
        timerItem.classList.remove('danger');
        timerItem.classList.add('warning');
      }
    } else {
      if (timerItem) {
        timerItem.classList.remove('warning', 'danger');
      }
    }
    
    if (gameTimer <= 0) {
      clearInterval(timerInterval);
      onTimeUp();
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function adjustTimer(seconds) {
  gameTimer = Math.max(0, gameTimer + seconds);
  
  // Update timer display immediately
  const timerDisplays = ['pic-timer', 'word-timer', 'math-timer', 'quiz-timer'];
  timerDisplays.forEach(id => {
    const display = document.getElementById(id);
    if (display) {
      display.textContent = gameTimer;
      
      // Update warning classes
      const timerItem = display.closest('.timer-item');
      if (timerItem) {
        timerItem.classList.remove('warning', 'danger');
        if (gameTimer <= 10) {
          timerItem.classList.add('danger');
        } else if (gameTimer <= 20) {
          timerItem.classList.add('warning');
        }
      }
    }
  });
  
  if (gameTimer <= 0 && timerInterval) {
    clearInterval(timerInterval);
  }
}

function adjustScore(points) {
  return Math.max(0, points);
}

function resetGameStats() {
  gameTimer = 60;
  gameStats.correctAnswers = 0;
  gameStats.incorrectAnswers = 0;
  gameStats.finalScore = 0;
  stopTimer();
  
  // Reset timer warning classes
  const timerItems = document.querySelectorAll('.timer-item');
  timerItems.forEach(item => {
    item.classList.remove('warning', 'danger');
  });
}

function showGameSummary(summaryAreaId, gameTitle) {
  const summaryArea = document.getElementById(summaryAreaId);
  if (!summaryArea) return;
  
  summaryArea.innerHTML = `
    <div class="game-summary">
      <h2 class="summary-title">${gameTitle} - Game Complete! 🎉</h2>
      <div class="summary-stats">
        <div class="stat-item">
          <span class="stat-label">Final Score</span>
          <span class="stat-value">${gameStats.finalScore}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Correct Answers</span>
          <span class="stat-value correct">${gameStats.correctAnswers}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Incorrect Answers</span>
          <span class="stat-value incorrect">${gameStats.incorrectAnswers}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Time Remaining</span>
          <span class="stat-value">${gameTimer}s</span>
        </div>
      </div>
      <button class="play-again-btn" onclick="location.reload()">Play Again</button>
      <button class="menu-btn" onclick="window.location.href='index.html'">Back to Menu</button>
    </div>
  `;
  summaryArea.classList.remove("hidden");
  summaryArea.classList.add("show");
}

// --- Guess the Picture Game Logic ---
let picScore = 0;
let picQuestionIndex = 0;
let picQuestions = []; // Will be fetched from backend
// DOM elements for Guess the Picture (will be null if not on this page)
const picScoreDisplay = document.getElementById("pic-score");
const picQuestionCountDisplay = document.getElementById("pic-question-count");
const picTimerDisplay = document.getElementById("pic-timer");
const picQuestionImage = document.getElementById("pic-question-image");
const picAnswerInput = document.getElementById("pic-answer-input");
const picSubmitBtn = document.getElementById("pic-submit-btn");
const picMessageArea = document.getElementById("pic-message-area");
const picSummaryArea = document.getElementById("pic-summary-area");

function loadNextPicQuestion() {
  if (picQuestionIndex < picQuestions.length && gameTimer > 0) {
    const currentQuestion = picQuestions[picQuestionIndex];
    if (picQuestionImage) {
      // Normalize extension to .jpeg if needed
      let imgSrc = currentQuestion.src.split("/").pop();
      if (imgSrc.endsWith(".jpeg")) {
        imgSrc = imgSrc.replace(".jpeg", ".jpeg");
      }
      picQuestionImage.src = "/images/" + imgSrc;
    }

    if (picQuestionImage)
      picQuestionImage.onerror = () => {
        picQuestionImage.src =
          "https://placehold.co/400x300/cccccc/333333?text=Image+Failed+to+Load";
        showMessage(
          "pic-message-area",
          "Image failed to load. Please try again.",
          false,
        );
      };

    if (picAnswerInput) picAnswerInput.value = "";
    if (picAnswerInput) picAnswerInput.focus();
    if (picScoreDisplay) picScoreDisplay.textContent = picScore;
    if (picQuestionCountDisplay)
      picQuestionCountDisplay.textContent = picQuestionIndex + 1;
    if (picMessageArea) picMessageArea.classList.add("hidden");
    if (picAnswerInput) picAnswerInput.disabled = false;
    if (picSubmitBtn) picSubmitBtn.disabled = false;
  } else {
    endPicGame();
  }
}


function handlePicSubmit() {
  if (!picAnswerInput || !picSubmitBtn) return; // Exit if elements are not on page
  
  // Add loading state
  picSubmitBtn.classList.add('loading');
  picAnswerInput.disabled = true;
  picSubmitBtn.disabled = true;

  const userAnswer = picAnswerInput.value.trim().toLowerCase();
  const correctAnswer = picQuestions[picQuestionIndex].answer.toLowerCase();

  // More flexible answer checking
  const exactMatch = userAnswer === correctAnswer;
  const userInCorrect = userAnswer.length >= 3 && correctAnswer.includes(userAnswer);
  const correctInUser = correctAnswer.length >= 3 && userAnswer.includes(correctAnswer);
  const pluralMatch = userAnswer.replace(/s$/, '') === correctAnswer.replace(/s$/, '');
  const isCorrect = exactMatch || userInCorrect || correctInUser || pluralMatch;
  
  if (isCorrect) {
    picScore += 5;
    gameStats.correctAnswers++;
    showMessage("pic-message-area", "Correct! 🎉 (+5 points)", true);
  } else {
    gameStats.incorrectAnswers++;
    adjustTimer(-5); // Decrease timer by 5 seconds for incorrect answer
    showMessage(
      "pic-message-area",
      `Wrong! It was "${correctAnswer.toUpperCase()}". (-5s)`,
      false,
    );
  }
  
  gameStats.finalScore = picScore;
  if (picScoreDisplay) picScoreDisplay.textContent = picScore;
  if (picTimerDisplay) picTimerDisplay.textContent = gameTimer;

  // Remove loading state
  setTimeout(() => {
    if (picSubmitBtn) picSubmitBtn.classList.remove('loading');
  }, 500);
  
  // Move to next question only after showing message
  setTimeout(() => {
    picQuestionIndex++;
    if (gameTimer <= 0) {
      endPicGame();
    } else {
      loadNextPicQuestion();
    }
  }, 2000);
}

function endPicGame() {
  stopTimer();
  gameStats.finalScore = picScore;
  
  if (picQuestionImage) picQuestionImage.classList.add("hidden");
  if (picAnswerInput) picAnswerInput.classList.add("hidden");
  if (picSubmitBtn) picSubmitBtn.classList.add("hidden");
  if (picMessageArea) picMessageArea.classList.add("hidden");
  const scoreBoard = document.querySelector("#guess-picture-game .score-board");
  if (scoreBoard) scoreBoard.classList.add("hidden");

  showGameSummary("pic-summary-area", "Guess the Picture");
}

function initGuessPictureGame() {
  resetGameStats();
  picScore = 0;
  picQuestionIndex = 0;
  if (picAnswerInput) picAnswerInput.classList.remove("hidden");
  if (picSubmitBtn) picSubmitBtn.classList.remove("hidden");
  if (picQuestionImage) picQuestionImage.classList.remove("hidden");
  if (picSummaryArea) picSummaryArea.classList.add("hidden");
  const scoreBoard = document.querySelector("#guess-picture-game .score-board");
  if (scoreBoard) scoreBoard.classList.remove("hidden");
  
  // Add Enter key listener
  if (picAnswerInput) {
    picAnswerInput.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        handlePicSubmit();
      }
    });
  }
  
  startTimer("pic-timer", endPicGame);
  fetchPicQuestions(); // Fetch questions from backend
}

// Add fetchPicQuestions function to fetch picture questions from backend API
async function fetchPicQuestions() {
  try {
    const response = await fetch(`${API_BASE_URL}/picture`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    picQuestions = await response.json();
    if (picQuestions.length === 0) {
      showMessage("pic-message-area", "No picture questions loaded from backend.", false);
    } else {
      loadNextPicQuestion();
    }
  } catch (error) {
    console.error("Error fetching picture questions:", error);
    showMessage("pic-message-area", "Failed to load picture questions. Is backend running?", false);
  }
}

// --- Guess the Word Game Logic ---
let wordScore = 0;
let wordQuestionIndex = 0;
let wordQuestions = []; // Will be fetched from backend
// DOM elements for Guess the Word
const wordScoreDisplay = document.getElementById("word-score");
const wordQuestionCountDisplay = document.getElementById("word-question-count");
const wordTimerDisplay = document.getElementById("word-timer");
const wordHintDisplay = document.getElementById("word-hint-display");
const wordAnswerInput = document.getElementById("word-answer-input");
const wordSubmitBtn = document.getElementById("word-submit-btn");
const wordMessageArea = document.getElementById("word-message-area");
const wordSummaryArea = document.getElementById("word-summary-area");

async function fetchWordQuestions() {
  try {
    const response = await fetch(`${API_BASE_URL}/word`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    wordQuestions = await response.json();
    if (wordQuestions.length === 0) {
      showMessage(
        "word-message-area",
        "No word questions loaded from backend.",
        false,
      );
    } else {
      loadNextWordQuestion();
    }
  } catch (error) {
    console.error("Error fetching word questions:", error);
    showMessage(
      "word-message-area",
      "Failed to load questions. Is backend running?",
      false,
    );
  }
}

function loadNextWordQuestion() {
  if (wordQuestionIndex < wordQuestions.length && gameTimer > 0) {
    const currentQuestion = wordQuestions[wordQuestionIndex];
    if (wordHintDisplay) wordHintDisplay.textContent = currentQuestion.hint;
    if (wordAnswerInput) wordAnswerInput.value = "";
    if (wordAnswerInput) wordAnswerInput.focus();
    if (wordScoreDisplay) wordScoreDisplay.textContent = wordScore;
    if (wordQuestionCountDisplay)
      wordQuestionCountDisplay.textContent = wordQuestionIndex + 1;
    if (wordMessageArea) wordMessageArea.classList.add("hidden");
    if (wordAnswerInput) wordAnswerInput.disabled = false;
    if (wordSubmitBtn) wordSubmitBtn.disabled = false;
  } else {
    endWordGame();
  }
}

function handleWordSubmit() {
  if (!wordAnswerInput || !wordSubmitBtn) return; // Exit if elements are not on page
  
  // Add loading state
  wordSubmitBtn.classList.add('loading');
  wordAnswerInput.disabled = true;
  wordSubmitBtn.disabled = true;

  const userAnswer = wordAnswerInput.value.trim().toLowerCase();
  const correctAnswer = wordQuestions[wordQuestionIndex].answer.toLowerCase();

  // More flexible answer checking
  const exactMatch = userAnswer === correctAnswer;
  const userInCorrect = userAnswer.length >= 3 && correctAnswer.includes(userAnswer);
  const correctInUser = correctAnswer.length >= 3 && userAnswer.includes(correctAnswer);
  const pluralMatch = userAnswer.replace(/s$/, '') === correctAnswer.replace(/s$/, '');
  const isCorrect = exactMatch || userInCorrect || correctInUser || pluralMatch;
  
  if (isCorrect) {
    wordScore += 5;
    gameStats.correctAnswers++;
    showMessage("word-message-area", "Correct! 🎉 (+5 points)", true);
  } else {
    gameStats.incorrectAnswers++;
    adjustTimer(-5);
    showMessage(
      "word-message-area",
      `Wrong! It was "${correctAnswer.toUpperCase()}". (-5s)`,
      false,
    );
  }
  
  gameStats.finalScore = wordScore;
  if (wordScoreDisplay) wordScoreDisplay.textContent = wordScore;
  if (wordTimerDisplay) wordTimerDisplay.textContent = gameTimer;

  // Remove loading state
  setTimeout(() => {
    if (wordSubmitBtn) wordSubmitBtn.classList.remove('loading');
  }, 500);
  
  // Move to next question only after showing message
  setTimeout(() => {
    wordQuestionIndex++;
    if (gameTimer <= 0) {
      endWordGame();
    } else {
      loadNextWordQuestion();
    }
  }, 2000);
}

function endWordGame() {
  stopTimer();
  gameStats.finalScore = wordScore;
  
  if (wordHintDisplay) wordHintDisplay.classList.add("hidden");
  if (wordAnswerInput) wordAnswerInput.classList.add("hidden");
  if (wordSubmitBtn) wordSubmitBtn.classList.add("hidden");
  if (wordMessageArea) wordMessageArea.classList.add("hidden");
  const scoreBoard = document.querySelector("#guess-word-game .score-board");
  if (scoreBoard) scoreBoard.classList.add("hidden");

  showGameSummary("word-summary-area", "Guess the Word");
}

// Function to be called from guess_word_game.html
function initGuessWordGame() {
  resetGameStats();
  wordScore = 0;
  wordQuestionIndex = 0;
  if (wordAnswerInput) wordAnswerInput.classList.remove("hidden");
  if (wordSubmitBtn) wordSubmitBtn.classList.remove("hidden");
  if (wordHintDisplay) wordHintDisplay.classList.remove("hidden");
  if (wordSummaryArea) wordSummaryArea.classList.add("hidden");
  const scoreBoard = document.querySelector("#guess-word-game .score-board");
  if (scoreBoard) scoreBoard.classList.remove("hidden");
  
  // Add Enter key listener
  if (wordAnswerInput) {
    wordAnswerInput.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        handleWordSubmit();
      }
    });
  }
  
  startTimer("word-timer", endWordGame);
  fetchWordQuestions(); // Fetch questions from backend
}

// --- Math Challenge Game Logic ---
let mathScore = 0;
let mathLevel = 1;
// DOM elements for Math Challenge
const mathScoreDisplay = document.getElementById("math-score");
const mathLevelDisplay = document.getElementById("math-level");
const mathTimerDisplay = document.getElementById("math-timer");
const mathQuestionDisplay = document.getElementById("math-question-display");
const mathAnswerInput = document.getElementById("math-answer-input");
const mathSubmitBtn = document.getElementById("math-submit-btn");
const mathMessageArea = document.getElementById("math-message-area");
const mathSummaryArea = document.getElementById("math-summary-area");
let currentMathQuestion = {}; // Math questions are generated on frontend

// No explicit fetch needed for math, as questions are generated client-side.
// However, an API call could validate the "ready" status of the math questions.
async function checkMathBackendStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/math`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Math backend status:", data.message); // Just log for now
    loadNextMathQuestion(); // Proceed to load first question
  } catch (error) {
    console.error("Error checking math backend status:", error);
    showMessage(
      "math-message-area",
      "Failed to connect to math backend. Is backend running?",
      false,
    );
  }
}

function generateMathQuestion() {
  let num1, num2, operator, answer;
  
  // Increase difficulty based on level
  const baseMax = 10;
  const maxNum = mathLevel <= 3 ? baseMax * mathLevel : baseMax * mathLevel + (mathLevel - 3) * 15;
  const minNum = mathLevel > 1 ? Math.max(1, mathLevel * 2) : 1;

  num1 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
  num2 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;

  // Add more operations as level increases
  const operations = ['+', '-'];
  if (mathLevel >= 3) operations.push('*');
  if (mathLevel >= 5) operations.push('/');
  
  operator = operations[Math.floor(Math.random() * operations.length)];

  switch(operator) {
    case '+':
      answer = num1 + num2;
      break;
    case '-':
      if (num1 < num2) [num1, num2] = [num2, num1]; // Ensure positive result
      answer = num1 - num2;
      break;
    case '*':
      // Keep multiplication smaller for playability
      num1 = Math.floor(Math.random() * Math.min(12, mathLevel + 5)) + 1;
      num2 = Math.floor(Math.random() * Math.min(12, mathLevel + 5)) + 1;
      answer = num1 * num2;
      break;
    case '/':
      // Ensure clean division
      answer = Math.floor(Math.random() * Math.min(12, mathLevel + 3)) + 1;
      num2 = Math.floor(Math.random() * Math.min(10, mathLevel + 2)) + 1;
      num1 = answer * num2;
      break;
  }

  return {
    question: `${num1} ${operator} ${num2} = ?`,
    answer: answer,
  };
}

function loadNextMathQuestion() {
  currentMathQuestion = generateMathQuestion();
  if (mathQuestionDisplay)
    mathQuestionDisplay.textContent = currentMathQuestion.question;
  if (mathAnswerInput) mathAnswerInput.value = "";
  if (mathAnswerInput) mathAnswerInput.focus();
  if (mathScoreDisplay) mathScoreDisplay.textContent = mathScore;
  if (mathLevelDisplay) mathLevelDisplay.textContent = mathLevel;
  if (mathMessageArea) mathMessageArea.classList.add("hidden");
  if (mathAnswerInput) mathAnswerInput.disabled = false;
  if (mathSubmitBtn) mathSubmitBtn.disabled = false;
}

function handleMathSubmit() {
  if (!mathAnswerInput || !mathSubmitBtn) return; // Exit if elements are not on page
  
  // Add loading state
  mathSubmitBtn.classList.add('loading');
  mathAnswerInput.disabled = true;
  mathSubmitBtn.disabled = true;

  const userAnswer = parseInt(mathAnswerInput.value);

  if (isNaN(userAnswer)) {
    showMessage("math-message-area", "Please enter a valid number!", false);
    // Remove loading state and re-enable inputs for invalid input
    setTimeout(() => {
      if (mathSubmitBtn) mathSubmitBtn.classList.remove('loading');
      if (mathAnswerInput) mathAnswerInput.disabled = false;
      if (mathSubmitBtn) mathSubmitBtn.disabled = false;
    }, 1000);
    return;
  }

  if (userAnswer === currentMathQuestion.answer) {
    mathScore += 5;
    gameStats.correctAnswers++;
    showMessage("math-message-area", "Correct! 🎉 (+5 points)", true);

    if (mathScore % 25 === 0 && mathScore !== 0) {
      mathLevel++;
      showMessage("math-message-area", "Level Up! Difficulty increased!", true);
    }
  } else {
    gameStats.incorrectAnswers++;
    adjustTimer(-5);
    showMessage(
      "math-message-area",
      `Wrong! The answer was ${currentMathQuestion.answer}. (-5s)`,
      false,
    );
  }
  
  gameStats.finalScore = mathScore;
  if (mathScoreDisplay) mathScoreDisplay.textContent = mathScore;
  if (mathTimerDisplay) mathTimerDisplay.textContent = gameTimer;

  // Remove loading state
  setTimeout(() => {
    if (mathSubmitBtn) mathSubmitBtn.classList.remove('loading');
  }, 500);

  // Continue generating questions after showing message
  setTimeout(() => {
    if (gameTimer <= 0) {
      endMathGame();
    } else {
      loadNextMathQuestion();
    }
  }, 2000);
}

function endMathGame() {
  stopTimer();
  gameStats.finalScore = mathScore;
  
  if (mathQuestionDisplay) mathQuestionDisplay.classList.add("hidden");
  if (mathAnswerInput) mathAnswerInput.classList.add("hidden");
  if (mathSubmitBtn) mathSubmitBtn.classList.add("hidden");
  if (mathMessageArea) mathMessageArea.classList.add("hidden");
  const scoreBoard = document.querySelector("#math-challenge-game .score-board");
  if (scoreBoard) scoreBoard.classList.add("hidden");

  showGameSummary("math-summary-area", "Math Challenge");
}

// Function to be called from math_challenge_game.html
function initMathGame() {
  resetGameStats();
  mathScore = 0;
  mathLevel = 1;
  if (mathAnswerInput) mathAnswerInput.classList.remove("hidden");
  if (mathSubmitBtn) mathSubmitBtn.classList.remove("hidden");
  if (mathQuestionDisplay) mathQuestionDisplay.classList.remove("hidden");
  if (mathSummaryArea) mathSummaryArea.classList.add("hidden");
  const scoreBoard = document.querySelector(
    "#math-challenge-game .score-board",
  );
  if (scoreBoard) scoreBoard.classList.remove("hidden");
  
  // Add Enter key listener
  if (mathAnswerInput) {
    mathAnswerInput.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        handleMathSubmit();
      }
    });
  }
  
  startTimer("math-timer", endMathGame);
  checkMathBackendStatus(); // Check backend status then load first question
}

// --- Fun Quiz Game Logic ---
let quizScore = 0;
let quizQuestionIndex = 0;
let quizQuestions = [];
let selectedQuizOption = null;
// DOM elements for Fun Quiz
const quizScoreDisplay = document.getElementById("quiz-score");
const quizQuestionCountDisplay = document.getElementById("quiz-question-count");
const quizTimerDisplay = document.getElementById("quiz-timer");
const quizQuestionDisplay = document.getElementById("quiz-question-display");
const quizOptionsContainer = document.getElementById("quiz-options-container");
const quizSubmitBtn = document.getElementById("quiz-submit-btn");
const quizMessageArea = document.getElementById("quiz-message-area");
const quizSummaryArea = document.getElementById("quiz-summary-area");

async function fetchQuizQuestions() {
  try {
    const response = await fetch(`${API_BASE_URL}/quiz`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    quizQuestions = await response.json();
    if (quizQuestions.length === 0) {
      showMessage(
        "quiz-message-area",
        "No quiz questions loaded from backend.",
        false,
      );
    } else {
      loadNextQuizQuestion();
    }
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    showMessage(
      "quiz-message-area",
      "Failed to load questions. Is backend running?",
      false,
    );
  }
}

function loadNextQuizQuestion() {
  if (quizQuestionIndex < quizQuestions.length && gameTimer > 0) {
    const currentQuizQuestion = quizQuestions[quizQuestionIndex];
    if (quizQuestionDisplay)
      quizQuestionDisplay.textContent = currentQuizQuestion.question;
    if (quizOptionsContainer) quizOptionsContainer.innerHTML = ""; // Clear previous options
    selectedQuizOption = null; // Reset selection

    if (quizOptionsContainer) {
      currentQuizQuestion.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.classList.add("quiz-option-btn");
        button.addEventListener("click", () => selectQuizOption(button, index));
        quizOptionsContainer.appendChild(button);
      });
    }

    if (quizScoreDisplay) quizScoreDisplay.textContent = quizScore;
    if (quizQuestionCountDisplay)
      quizQuestionCountDisplay.textContent = quizQuestionIndex + 1;
    if (quizMessageArea) quizMessageArea.classList.add("hidden");
    if (quizSubmitBtn) quizSubmitBtn.disabled = true; // Disable submit until an option is selected
  } else {
    endFunQuizGame();
  }
}

function selectQuizOption(button, index) {
  // Remove 'selected' class from all buttons
  if (quizOptionsContainer) {
    Array.from(quizOptionsContainer.children).forEach((btn) => {
      btn.classList.remove("selected");
    });
  }
  // Add 'selected' class to the clicked button
  if (button) button.classList.add("selected");
  selectedQuizOption = index;
  if (quizSubmitBtn) quizSubmitBtn.disabled = false; // Enable submit button
}

function handleQuizSubmit() {
  if (selectedQuizOption === null) {
    showMessage("quiz-message-area", "Please select an answer!", false);
    return;
  }
  if (!quizSubmitBtn || !quizOptionsContainer) return; // Exit if elements are not on page

  // Add loading state
  quizSubmitBtn.classList.add('loading');
  quizSubmitBtn.disabled = true; // Disable submit button immediately
  Array.from(quizOptionsContainer.children).forEach(
    (btn) => (btn.disabled = true),
  ); // Disable option buttons

  const correctAnswerIndex =
    quizQuestions[quizQuestionIndex].correctAnswerIndex;

  if (selectedQuizOption === correctAnswerIndex) {
    quizScore += 5;
    gameStats.correctAnswers++;
    showMessage("quiz-message-area", "Correct! 🎉 (+5 points)", true);
  } else {
    gameStats.incorrectAnswers++;
    adjustTimer(-5);
    showMessage(
      "quiz-message-area",
      `Wrong! The answer was "${quizQuestions[quizQuestionIndex].options[correctAnswerIndex]}". (-5s)`,
      false,
    );
  }
  
  gameStats.finalScore = quizScore;
  if (quizScoreDisplay) quizScoreDisplay.textContent = quizScore;
  if (quizTimerDisplay) quizTimerDisplay.textContent = gameTimer;

  selectedQuizOption = null; // Reset selection
  
  // Remove loading state
  setTimeout(() => {
    if (quizSubmitBtn) quizSubmitBtn.classList.remove('loading');
  }, 500);
  
  // Move to next question only after showing message
  setTimeout(() => {
    quizQuestionIndex++;
    if (gameTimer <= 0 || quizQuestionIndex >= quizQuestions.length) {
      endFunQuizGame();
    } else {
      loadNextQuizQuestion();
    }
  }, 2000);
}

function endFunQuizGame() {
  stopTimer();
  gameStats.finalScore = quizScore;
  
  if (quizQuestionDisplay) quizQuestionDisplay.classList.add("hidden");
  if (quizOptionsContainer) quizOptionsContainer.classList.add("hidden");
  if (quizSubmitBtn) quizSubmitBtn.classList.add("hidden");
  if (quizMessageArea) quizMessageArea.classList.add("hidden");
  const scoreBoard = document.querySelector("#fun-quiz-game .score-board");
  if (scoreBoard) scoreBoard.classList.add("hidden");

  showGameSummary("quiz-summary-area", "Fun Quiz");
}

// Function to be called from fun_quiz_game.html
function initFunQuizGame() {
  resetGameStats();
  quizScore = 0;
  quizQuestionIndex = 0;
  selectedQuizOption = null;
  if (quizSubmitBtn) quizSubmitBtn.classList.remove("hidden");
  if (quizQuestionDisplay) quizQuestionDisplay.classList.remove("hidden");
  if (quizOptionsContainer) quizOptionsContainer.classList.remove("hidden");
  if (quizSummaryArea) quizSummaryArea.classList.add("hidden");
  const scoreBoard = document.querySelector("#fun-quiz-game .score-board");
  if (scoreBoard) scoreBoard.classList.remove("hidden");
  
  startTimer("quiz-timer", endFunQuizGame);
  fetchQuizQuestions(); // Fetch questions from backend
}

// --- Event Listeners ---
// Add event listeners only if the elements exist on the current page.
// This is important because script.js is loaded on ALL game pages.
if (picSubmitBtn) {
  picSubmitBtn.addEventListener("click", handlePicSubmit);
}
if (picAnswerInput) {
  picAnswerInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      handlePicSubmit();
    }
  });
}

if (wordSubmitBtn) {
  wordSubmitBtn.addEventListener("click", handleWordSubmit);
}
if (wordAnswerInput) {
  wordAnswerInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      handleWordSubmit();
    }
  });
}

if (mathSubmitBtn) {
  mathSubmitBtn.addEventListener("click", handleMathSubmit);
}
if (mathAnswerInput) {
  mathAnswerInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      handleMathSubmit();
    }
  });
}

if (quizSubmitBtn) {
  quizSubmitBtn.addEventListener("click", handleQuizSubmit);
}
