// JAVASCRIPT: The Logic

// 1. The Word Bank

/*! We can split these into chunks based off of settings:
  ! Option for random sentences (multiple words from word bank combined)
  ! or preset sentences.
  !*/
const words = [
  "javascript",
  "function",
  "variable",
  "syntax",
  "browser",
  "developer",
  "coding",
  "algorithm",
  "interface",
  "keyboard",
  "monitor",
  "database",
  "python",
  "application",
  "network",
  "test",
  "method",
  "artificial",
  "synthetic",
  "data scientist",
  "software",
  "software engineer",
  "dynamic",
  "packet",
  "internet",
  "development",
  "debugging",
  "debug",
  "c##",
  "linux",
  "windows",
  "mac",
  "unix",
  "operating system",
  "super long text that might not fit the screen",
  // "incredibly long text that we might have to decrease the size of the font in order to fix the positioning of it.",
  // "incredibly long text that we might have to decrease the size of the font in order to fix the positioning of it. incredibly long text that we might have to decrease the size of the font in order to fix the positioning of it. incredibly long text that we might have to decrease the size of the font in order to fix the positioning of it.",
  
];
// 2a. Settings Variables
let settings_disableScore = false;  // Disable Score: <bool>
let settings_restartZerosScore = true;  // Hitting Restart sets score to zero.

// 2a. Select Settings Elements
document.getElementById("settings-disable-score").innerHTML = settings_disableScore;
document.getElementById("settings-resest-score").innerHTML = settings_restartZerosScore;

const getScoreboard = document.getElementById('score-board');
if(settings_disableScore){
  getScoreboard.classList.add('hidden');
} else {
  getScoreboard.classList.remove('hidden');
}

// 2b. Select Elements
const wordDisplayElement = document.getElementById("word-display");
const inputElement = document.getElementById("input-field");
const scoreElement = document.getElementById("score");

// Settings Elements
var modal = document.getElementById("settingsModal");
var settingsButton = document.getElementById("Settings");
var restartButton = document.getElementById("Restart")

let currentWord = null;
let score = 0;

// 3. Initialize Game
inputElement.addEventListener("input", processInput);  // Moved outside so it doesn't keep creating new input listeners when restart is hit.
function init() {
  showNewWord();
  // Listen for every keystroke
}

// 4. Pick and Display a Random Word
function showNewWord() {
  const randomIndex = Math.floor(Math.random() * words.length);
  currentWord = words[randomIndex];

  wordDisplayElement.innerHTML = "";

  const parts = currentWord.split(" ");

  parts.forEach((word, wordIndex) => {
    const wordSpan = document.createElement("span");
    wordSpan.className = "word";

    word.split("").forEach((ch) => {
      const charSpan = document.createElement("span");
      charSpan.innerText = ch;

      // Store real character to compare
      charSpan.dataset.char = ch;

      wordSpan.appendChild(charSpan);
    });

    wordDisplayElement.appendChild(wordSpan);

    // Add a space between words (except last word)
    if (wordIndex < parts.length - 1) {
      const spaceSpan = document.createElement("span");
      spaceSpan.className = "space";

      // In word-display, show a space being present but store normal space for logic
      spaceSpan.innerText = "\u00A0";
      spaceSpan.dataset.char = " ";

      wordDisplayElement.appendChild(spaceSpan);
    }
  });

  inputElement.value = "";
}

// 5. Compare Input to Target
function processInput() {
  const arrayQuote = wordDisplayElement.querySelectorAll("[data-char]");
  const arrayValue = inputElement.value.split("");

  let correctSoFar = true;

  // Loop through each character span in the displayed word
  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index];

    if (character == null) {
      // Character hasn't been typed yet
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      correctSoFar = false;
    } else if (character === characterSpan.dataset.char) {
      // Correct character
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
    } else {
      // Incorrect character
      characterSpan.classList.remove("correct");
      characterSpan.classList.add("incorrect");
      correctSoFar = false;
    }
  });

  // Check if the word is fully complete and correct
  if (correctSoFar && arrayValue.length === currentWord.length) {
    score++;
    scoreElement.innerText = score;
    showNewWord();
  }
}

// Get the element that closes the modal.
var closeSpan = document.getElementsByClassName("close")[0];

// Open settings modal.
settingsButton.onclick = function() {
  modal.style.display = "block";
}

// Close settings modal.
closeSpan.onclick = function() {
  modal.style.display = "none";
}

// If clicking outside of modal, close modal.
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Restart button checks if settings is enabled to disable/enable score reset.
restartButton.onclick = function(){
  if (settings_restartZerosScore){
    score = 0;
    scoreElement.innerText = score;
  }
  init();
}

// Start the game
init();
