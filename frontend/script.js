// --- Global Game State & Elements ---
// Note: These variables are global and will be shared across HTML pages.
// Their state will reset upon navigating to a new HTML page.
// If persistence across pages is needed (e.g., carrying score to another game),
// localStorage or a backend database would be necessary.

// Base URL for your backend API
const API_BASE_URL = 'http://127.0.0.1:5000/api/questions'; // Adjust if your Flask app runs on a different port/host

// Common helper for message display
function showMessage(messageAreaId, message, isCorrect) {
    const messageArea = document.getElementById(messageAreaId);
    if (messageArea) { // Check if element exists before manipulating
        messageArea.textContent = message;
        messageArea.classList.remove('hidden', 'correct', 'incorrect', 'show');
        if (isCorrect) {
            messageArea.classList.add('correct');
        } else {
            messageArea.classList.add('incorrect');
        }
        messageArea.classList.add('show');

        setTimeout(() => {
            messageArea.classList.remove('show');
            setTimeout(() => {
                messageArea.classList.add('hidden');
            }, 500);
        }, 1500);
    }
}

// --- Guess the Picture Game Logic ---
let picScore = 0;
let picQuestionIndex = 0;
let picQuestions = []; // Will be fetched from backend
// DOM elements for Guess the Picture (will be null if not on this page)
const picScoreDisplay = document.getElementById('pic-score');
const picQuestionCountDisplay = document.getElementById('pic-question-count');
const picQuestionImage = document.getElementById('pic-question-image');
const picAnswerInput = document.getElementById('pic-answer-input');
const picSubmitBtn = document.getElementById('pic-submit-btn');
const picMessageArea = document.getElementById('pic-message-area');

async function fetchPicQuestions() {
    try {
        const response = await fetch(`${API_BASE_URL}/picture`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        picQuestions = await response.json();
        if (picQuestions.length === 0) {
            showMessage('pic-message-area', 'No picture questions loaded from backend.', false);
        } else {
            loadNextPicQuestion();
        }
    } catch (error) {
        console.error("Error fetching picture questions:", error);
        showMessage('pic-message-area', 'Failed to load questions. Is backend running?', false);
    }
}

function loadNextPicQuestion() {
    if (picQuestionIndex < picQuestions.length) {
        const currentQuestion = picQuestions[picQuestionIndex];
        if (picQuestionImage) picQuestionImage.src = currentQuestion.src; // Check if element exists
        if (picQuestionImage) picQuestionImage.onerror = () => {
            picQuestionImage.src = `https://placehold.co/400x300/cccccc/333333?text=Image+Failed+to+Load`;
            showMessage('pic-message-area', 'Image failed to load. Please try again.', false);
        };
        if (picAnswerInput) picAnswerInput.value = '';
        if (picAnswerInput) picAnswerInput.focus();
        if (picScoreDisplay) picScoreDisplay.textContent = picScore;
        if (picQuestionCountDisplay) picQuestionCountDisplay.textContent = picQuestionIndex + 1;
        if (picMessageArea) picMessageArea.classList.add('hidden');
        if (picAnswerInput) picAnswerInput.disabled = false;
        if (picSubmitBtn) picSubmitBtn.disabled = false;
    } else {
        endPicGame();
    }
}

function handlePicSubmit() {
    if (!picAnswerInput || !picSubmitBtn) return; // Exit if elements are not on page
    picAnswerInput.disabled = true;
    picSubmitBtn.disabled = true;

    const userAnswer = picAnswerInput.value.trim().toLowerCase();
    const correctAnswer = picQuestions[picQuestionIndex].answer.toLowerCase();

    if (userAnswer === correctAnswer) {
        picScore += 10;
        showMessage('pic-message-area', 'Correct! 🎉', true);
    } else {
        picScore = Math.max(0, picScore - 5);
        showMessage('pic-message-area', `Wrong! It was "${correctAnswer.toUpperCase()}".`, false);
    }
    if (picScoreDisplay) picScoreDisplay.textContent = picScore;

    picQuestionIndex++;
    setTimeout(loadNextPicQuestion, 2000);
}

function endPicGame() {
    if (picQuestionImage) {
        picQuestionImage.src = "https://placehold.co/400x300/6A5ACD/4169E1?text=Game+Over!"; // Slate Blue for game over
        picQuestionImage.alt = "Game Over";
        picQuestionImage.style.backgroundColor = '#6A5ACD';
        picQuestionImage.style.border = '5px solid #4169E1';
    }

    if (picAnswerInput) picAnswerInput.classList.add('hidden');
    if (picSubmitBtn) picSubmitBtn.classList.add('hidden');
    const scoreBoard = document.querySelector('#guess-picture-game .score-board');
    if (scoreBoard) scoreBoard.classList.add('hidden');

    if (picMessageArea) {
        picMessageArea.classList.remove('hidden', 'correct', 'incorrect');
        picMessageArea.classList.add('bg-blue-100', 'text-blue-800', 'show');
        picMessageArea.textContent = `Game Over! Your final score: ${picScore}.`;
    }
}

// Function to be called from guess_picture_game.html
function initGuessPictureGame() {
    picScore = 0;
    picQuestionIndex = 0;
    if (picAnswerInput) picAnswerInput.classList.remove('hidden');
    if (picSubmitBtn) picSubmitBtn.classList.remove('hidden');
    const scoreBoard = document.querySelector('#guess-picture-game .score-board');
    if (scoreBoard) scoreBoard.classList.remove('hidden');
    fetchPicQuestions(); // Fetch questions from backend
}


// --- Guess the Word Game Logic ---
let wordScore = 0;
let wordQuestionIndex = 0;
let wordQuestions = []; // Will be fetched from backend
// DOM elements for Guess the Word
const wordScoreDisplay = document.getElementById('word-score');
const wordQuestionCountDisplay = document.getElementById('word-question-count');
const wordHintDisplay = document.getElementById('word-hint-display');
const wordAnswerInput = document.getElementById('word-answer-input');
const wordSubmitBtn = document.getElementById('word-submit-btn');
const wordMessageArea = document.getElementById('word-message-area');

async function fetchWordQuestions() {
    try {
        const response = await fetch(`${API_BASE_URL}/word`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        wordQuestions = await response.json();
        if (wordQuestions.length === 0) {
            showMessage('word-message-area', 'No word questions loaded from backend.', false);
        } else {
            loadNextWordQuestion();
        }
    } catch (error) {
        console.error("Error fetching word questions:", error);
        showMessage('word-message-area', 'Failed to load questions. Is backend running?', false);
    }
}

function loadNextWordQuestion() {
    if (wordQuestionIndex < wordQuestions.length) {
        const currentQuestion = wordQuestions[wordQuestionIndex];
        if (wordHintDisplay) wordHintDisplay.textContent = currentQuestion.hint;
        if (wordAnswerInput) wordAnswerInput.value = '';
        if (wordAnswerInput) wordAnswerInput.focus();
        if (wordScoreDisplay) wordScoreDisplay.textContent = wordScore;
        if (wordQuestionCountDisplay) wordQuestionCountDisplay.textContent = wordQuestionIndex + 1;
        if (wordMessageArea) wordMessageArea.classList.add('hidden');
        if (wordAnswerInput) wordAnswerInput.disabled = false;
        if (wordSubmitBtn) wordSubmitBtn.disabled = false;
    } else {
        endWordGame();
    }
}

function handleWordSubmit() {
    if (!wordAnswerInput || !wordSubmitBtn) return; // Exit if elements are not on page
    wordAnswerInput.disabled = true;
    wordSubmitBtn.disabled = true;

    const userAnswer = wordAnswerInput.value.trim().toLowerCase();
    const correctAnswer = wordQuestions[wordQuestionIndex].answer.toLowerCase();

    if (userAnswer === correctAnswer) {
        wordScore += 10;
        showMessage('word-message-area', 'Correct! 🎉', true);
    } else {
        wordScore = Math.max(0, wordScore - 5);
        showMessage('word-message-area', `Wrong! The word was "${correctAnswer.toUpperCase()}".`, false);
    }
    if (wordScoreDisplay) wordScoreDisplay.textContent = wordScore;

    wordQuestionIndex++;
    setTimeout(loadNextWordQuestion, 2000);
}

function endWordGame() {
    if (wordHintDisplay) {
        wordHintDisplay.textContent = "Game Over!";
        wordHintDisplay.style.color = '#DC143C'; // Crimson Red for game over
    }
    if (wordAnswerInput) wordAnswerInput.classList.add('hidden');
    if (wordSubmitBtn) wordSubmitBtn.classList.add('hidden');
    const scoreBoard = document.querySelector('#guess-word-game .score-board');
    if (scoreBoard) scoreBoard.classList.add('hidden');

    if (wordMessageArea) {
        wordMessageArea.classList.remove('hidden', 'correct', 'incorrect');
        wordMessageArea.classList.add('bg-blue-100', 'text-blue-800', 'show');
        wordMessageArea.textContent = `Game Over! Your final score: ${wordScore}.`;
    }
}

// Function to be called from guess_word_game.html
function initGuessWordGame() {
    wordScore = 0;
    wordQuestionIndex = 0;
    if (wordHintDisplay) wordHintDisplay.style.color = '#3b82f6'; // Reset hint color
    if (wordAnswerInput) wordAnswerInput.classList.remove('hidden');
    if (wordSubmitBtn) wordSubmitBtn.classList.remove('hidden');
    const scoreBoard = document.querySelector('#guess-word-game .score-board');
    if (scoreBoard) scoreBoard.classList.remove('hidden');
    fetchWordQuestions(); // Fetch questions from backend
}


// --- Math Challenge Game Logic ---
let mathScore = 0;
let mathLevel = 1;
// DOM elements for Math Challenge
const mathScoreDisplay = document.getElementById('math-score');
const mathLevelDisplay = document.getElementById('math-level');
const mathQuestionDisplay = document.getElementById('math-question-display');
const mathAnswerInput = document.getElementById('math-answer-input');
const mathSubmitBtn = document.getElementById('math-submit-btn');
const mathMessageArea = document.getElementById('math-message-area');
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
        showMessage('math-message-area', 'Failed to connect to math backend. Is backend running?', false);
    }
}


function generateMathQuestion() {
    let num1, num2, operator, answer;
    const maxNum = mathLevel * 10 + 5;
    const minNum = mathLevel > 1 ? 5 : 1;

    num1 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    num2 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;

    if (Math.random() < 0.5) { // Addition
        operator = '+';
        answer = num1 + num2;
    } else { // Subtraction
        operator = '-';
        if (num1 < num2) { // Ensure positive result
            [num1, num2] = [num2, num1];
        }
        answer = num1 - num2;
    }

    return {
        question: `${num1} ${operator} ${num2} = ?`,
        answer: answer
    };
}

function loadNextMathQuestion() {
    currentMathQuestion = generateMathQuestion();
    if (mathQuestionDisplay) mathQuestionDisplay.textContent = currentMathQuestion.question;
    if (mathAnswerInput) mathAnswerInput.value = '';
    if (mathAnswerInput) mathAnswerInput.focus();
    if (mathScoreDisplay) mathScoreDisplay.textContent = mathScore;
    if (mathLevelDisplay) mathLevelDisplay.textContent = mathLevel;
    if (mathMessageArea) mathMessageArea.classList.add('hidden');
    if (mathAnswerInput) mathAnswerInput.disabled = false;
    if (mathSubmitBtn) mathSubmitBtn.disabled = false;
}

function handleMathSubmit() {
    if (!mathAnswerInput || !mathSubmitBtn) return; // Exit if elements are not on page
    mathAnswerInput.disabled = true;
    mathSubmitBtn.disabled = true;

    const userAnswer = parseInt(mathAnswerInput.value);

    if (isNaN(userAnswer)) {
        showMessage('math-message-area', 'Please enter a valid number!', false);
        if (mathAnswerInput) mathAnswerInput.disabled = false;
        if (mathSubmitBtn) mathSubmitBtn.disabled = false;
        return;
    }

    if (userAnswer === currentMathQuestion.answer) {
        mathScore += 10;
        showMessage('math-message-area', 'Correct! 🎉', true);

        if (mathScore % 50 === 0 && mathScore !== 0) {
            mathLevel++;
            showMessage('math-message-area', 'Level Up! Difficulty increased!', true);
        }
    } else {
        mathScore = Math.max(0, mathScore - 5);
        showMessage('math-message-area', `Wrong! The correct answer was ${currentMathQuestion.answer}.`, false);
    }
    if (mathScoreDisplay) mathScoreDisplay.textContent = mathScore;

    setTimeout(loadNextMathQuestion, 2000);
}

// Function to be called from math_challenge_game.html
function initMathGame() {
    mathScore = 0;
    mathLevel = 1;
    if (mathAnswerInput) mathAnswerInput.classList.remove('hidden');
    if (mathSubmitBtn) mathSubmitBtn.classList.remove('hidden');
    const scoreBoard = document.querySelector('#math-challenge-game .score-board');
    if (scoreBoard) scoreBoard.classList.remove('hidden');
    checkMathBackendStatus(); // Check backend status then load first question
}


// --- Fun Quiz! Game Logic ---
let quizScore = 0;
let quizQuestionIndex = 0;
let quizQuestions = []; // Will be fetched from backend
let selectedQuizOption = null; // To track selected answer
// DOM elements for Fun Quiz
const quizScoreDisplay = document.getElementById('quiz-score');
const quizQuestionCountDisplay = document.getElementById('quiz-question-count');
const quizQuestionDisplay = document.getElementById('quiz-question-display');
const quizOptionsContainer = document.getElementById('quiz-options-container');
const quizSubmitBtn = document.getElementById('quiz-submit-btn');
const quizMessageArea = document.getElementById('quiz-message-area');

async function fetchQuizQuestions() {
    try {
        const response = await fetch(`${API_BASE_URL}/quiz`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        quizQuestions = await response.json();
        if (quizQuestions.length === 0) {
            showMessage('quiz-message-area', 'No quiz questions loaded from backend.', false);
        } else {
            loadNextQuizQuestion();
        }
    } catch (error) {
        console.error("Error fetching quiz questions:", error);
        showMessage('quiz-message-area', 'Failed to load questions. Is backend running?', false);
    }
}

function loadNextQuizQuestion() {
    if (quizQuestionIndex < quizQuestions.length) {
        const currentQuizQuestion = quizQuestions[quizQuestionIndex];
        if (quizQuestionDisplay) quizQuestionDisplay.textContent = currentQuizQuestion.question;
        if (quizOptionsContainer) quizOptionsContainer.innerHTML = ''; // Clear previous options
        selectedQuizOption = null; // Reset selection

        if (quizOptionsContainer) {
            currentQuizQuestion.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.textContent = option;
                button.classList.add('quiz-option-btn');
                button.addEventListener('click', () => selectQuizOption(button, index));
                quizOptionsContainer.appendChild(button);
            });
        }

        if (quizScoreDisplay) quizScoreDisplay.textContent = quizScore;
        if (quizQuestionCountDisplay) quizQuestionCountDisplay.textContent = quizQuestionIndex + 1;
        if (quizMessageArea) quizMessageArea.classList.add('hidden');
        if (quizSubmitBtn) quizSubmitBtn.disabled = true; // Disable submit until an option is selected
    } else {
        endFunQuizGame();
    }
}

function selectQuizOption(button, index) {
    // Remove 'selected' class from all buttons
    if (quizOptionsContainer) {
        Array.from(quizOptionsContainer.children).forEach(btn => {
            btn.classList.remove('selected');
        });
    }
    // Add 'selected' class to the clicked button
    if (button) button.classList.add('selected');
    selectedQuizOption = index;
    if (quizSubmitBtn) quizSubmitBtn.disabled = false; // Enable submit button
}

function handleQuizSubmit() {
    if (selectedQuizOption === null) {
        showMessage('quiz-message-area', 'Please select an answer!', false);
        return;
    }
    if (!quizSubmitBtn || !quizOptionsContainer) return; // Exit if elements are not on page

    quizSubmitBtn.disabled = true; // Disable submit button immediately
    Array.from(quizOptionsContainer.children).forEach(btn => btn.disabled = true); // Disable option buttons

    const correctAnswerIndex = quizQuestions[quizQuestionIndex].correctAnswerIndex;

    if (selectedQuizOption === correctAnswerIndex) {
        quizScore += 10;
        showMessage('quiz-message-area', 'Correct! 🎉', true);
    } else {
        quizScore = Math.max(0, quizScore - 5);
        showMessage('quiz-message-area', `Wrong! The answer was "${quizQuestions[quizQuestionIndex].options[correctAnswerIndex]}".`, false);
    }
    if (quizScoreDisplay) quizScoreDisplay.textContent = quizScore;

    quizQuestionIndex++;
    setTimeout(loadNextQuizQuestion, 2000); // Load next question after message
}

function endFunQuizGame() {
    if (quizQuestionDisplay) quizQuestionDisplay.textContent = "Quiz Complete!";
    if (quizOptionsContainer) quizOptionsContainer.innerHTML = ''; // Clear options
    if (quizSubmitBtn) quizSubmitBtn.classList.add('hidden');
    const scoreBoard = document.querySelector('#fun-quiz-game .score-board');
    if (scoreBoard) scoreBoard.classList.add('hidden');

    if (quizMessageArea) {
        quizMessageArea.classList.remove('hidden', 'correct', 'incorrect');
        quizMessageArea.classList.add('bg-blue-100', 'text-blue-800', 'show');
        quizMessageArea.textContent = `Quiz Over! Your final score: ${quizScore}.`;
    }
}

// Function to be called from fun_quiz_game.html
function initFunQuizGame() {
    quizScore = 0;
    quizQuestionIndex = 0;
    if (quizOptionsContainer) quizOptionsContainer.innerHTML = ''; // Clear options from previous games
    if (quizSubmitBtn) quizSubmitBtn.classList.remove('hidden');
    const scoreBoard = document.querySelector('#fun-quiz-game .score-board');
    if (scoreBoard) scoreBoard.classList.remove('hidden');
    fetchQuizQuestions(); // Fetch questions from backend
}

// --- Event Listeners ---
// Add event listeners only if the elements exist on the current page.
// This is important because script.js is loaded on ALL game pages.
if (picSubmitBtn) {
    picSubmitBtn.addEventListener('click', handlePicSubmit);
}
if (picAnswerInput) {
    picAnswerInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') { handlePicSubmit(); }
    });
}

if (wordSubmitBtn) {
    wordSubmitBtn.addEventListener('click', handleWordSubmit);
}
if (wordAnswerInput) {
    wordAnswerInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') { handleWordSubmit(); }
    });
}

if (mathSubmitBtn) {
    mathSubmitBtn.addEventListener('click', handleMathSubmit);
}
if (mathAnswerInput) {
    mathAnswerInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') { handleMathSubmit(); }
    });
}

if (quizSubmitBtn) {
    quizSubmitBtn.addEventListener('click', handleQuizSubmit);
}
