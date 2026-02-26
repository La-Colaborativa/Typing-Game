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
  "super long text that might not fit the screen",
  "incredibly long text that we might have to decrease the size of the font in order to fix the positioning of it."
];

// 2. Select Elements
const wordDisplayElement = document.getElementById("word-display");
const inputElement = document.getElementById("input-field");
const scoreElement = document.getElementById("score");
// Settings Elements
var modal = document.getElementById("settingsModal");
var settingsButton = document.getElementById("Settings");

let currentWord = null;
let score = 0;

// 3. Initialize Game
function init() {
  showNewWord();
  // Listen for every keystroke
  inputElement.addEventListener("input", processInput);
}

// 4. Pick and Display a Random Word
function showNewWord() {
  // Pick random word
  const randomIndex = Math.floor(Math.random() * words.length);
  currentWord = words[randomIndex];

  // Clear the display
  wordDisplayElement.innerHTML = "";

  // Split word into individual spans for character styling ("cat" into 'c', 'a', 't'.)
  currentWord.split("").forEach((character) => {
    const charSpan = document.createElement("span");
    charSpan.innerText = character;
    wordDisplayElement.appendChild(charSpan);
  });

  // Clear input box
  inputElement.value = "";
}

// 5. Compare Input to Target
function processInput() {
  const arrayQuote = wordDisplayElement.querySelectorAll("span");
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
    } else if (character === characterSpan.innerText) {
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

// Get the element that closes the modal ("x")
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

// Start the game
init();
