// JAVASCRIPT: The Logic

// 1. The Word Bank

/*! We can split these into chunks based off of settings:
  ! Option for random sentences (multiple words from word bank combined)
  ! or preset sentences.
  !*/

import { words, phrases } from './word-banks.js';

// 2a. Settings Variables
let settings_disableScore = false;      // DEFAULT: false | <bool> -> Disable Score
let settings_restartZerosScore = true;  // DEFAULT: true  | <bool> -> Hitting Restart sets score to zero
let settings_color_current = true;      // DEFAULT: false | <bool> -> Color the current word in blue (disabled by default because it clutters the screen).

// 2a. Select Settings Elements
document.getElementById("settings-disable-score").innerHTML = settings_disableScore;
document.getElementById("settings-resets-score").innerHTML = settings_restartZerosScore;
document.getElementById("settings-highlight-current").innerHTML = settings_color_current;

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
  let wordsOrPhraseGenerator = Math.floor(Math.random() * 2);
  
  if(wordsOrPhraseGenerator == 0){
    const randomIndex = Math.floor(Math.random() * words.length);
    currentWord = words[randomIndex];
  } else {
    const randomIndex = Math.floor(Math.random() * phrases.length);
    currentWord = phrases[randomIndex];
  }

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

    if(settings_color_current){
    // Highlight first char when setting is on.
    const chars = wordDisplayElement.querySelectorAll("[data-char]");
    
    if (chars.length > 0) chars[0].classList.add("highlight");
    }

  });

  inputElement.value = "";
}

// 5. Compare Input to Target
function processInput() {
  const arrayQuote = wordDisplayElement.querySelectorAll("[data-char]");
  const arrayValue = inputElement.value.split("");

  const currentChar = arrayValue.length;

  if (settings_color_current){
    // Remove highlight
    arrayQuote.forEach(span => span.classList.remove("highlight"));
    // Add highlight for current
    if (currentChar < arrayQuote.length){
      arrayQuote[currentChar].classList.add("highlight");
    }
  }

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
      characterSpan.classList.remove("incorrect");
      characterSpan.classList.add("correct");
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
