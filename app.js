// JAVASCRIPT: The Logic

// 1. The Word Banks (Single word, short phrase, or full sentences.)

import { words, phrases, sentences } from './word-banks.js';

// 2a. Settings Variables
let settings_color_current = true;     // DEFAULT:  true | Shows the current character being underlined and colored in blue.
let settings_disableScore = false;     // DEFAULT: false | Disables score component from being present on the bottom of input (hidden, still tracks).
let settings_reset_score = true;       // DEFAULT:  true | Restart button resetting the score.
let settings_skip_repeats = true;      // DEFAULT: false | Stops from potentially getting the same prompt (generates another one instead).
let settings_store_skips = 10;         // DEFAULT:    10 | How many items are in the list before they can reappear.
let settings_end_incomplete = false;   // DEFAULT: false | If the user is at the end of the word limit but incorrect characters exist, move on.

let repeat_list = [];
window.repeat_list = repeat_list; // For DevTools Console testing in the browser. Use "repeat_list" in the console. 

// 2a. Select Settings Elements
document.getElementById("settings-disable-score").innerHTML = settings_disableScore;
document.getElementById("settings-reset-score").innerHTML = settings_reset_score;
document.getElementById("settings-highlight-current").innerHTML = settings_color_current;
document.getElementById("settings-skip-repeats").innerHTML = settings_skip_repeats;
document.getElementById("settings-store-skips").innerHTML = settings_store_skips;
document.getElementById("settings-end-incomplete").innerHTML = settings_end_incomplete;

const getScoreboard = document.getElementById('score-board');
if(settings_disableScore){
  getScoreboard.classList.add('hidden');
} else {
  getScoreboard.classList.remove('hidden');
}

// 2b. Select Browser Elements
const wordDisplayElement = document.getElementById("word-display");
const inputElement = document.getElementById("input-field");
const scoreElement = document.getElementById("score");
var modal = document.getElementById("settingsModal");
var settingsButton = document.getElementById("Settings");
var restartButton = document.getElementById("Restart");

let currentWord = null;
let score = 0;

// 3. Initialize Game
inputElement.addEventListener("input", processInput);  // Moved outside so it doesn't keep creating new input listeners when restart is hit (overflow).



function init() {
  showNewWord();
}

// 4. Pick and Display a Random Word
function showNewWord() {
  // Picks randomly between words, phrases, or sentences.
  let textGenerator = Math.floor(Math.random() * 3);
  
  if(textGenerator == 0){
    const randomIndex = Math.floor(Math.random() * words.length);
    currentWord = words[randomIndex];
  } else if (textGenerator == 1) {
    const randomIndex = Math.floor(Math.random() * phrases.length);
    currentWord = phrases[randomIndex];
  } else {
    const randomIndex = Math.floor(Math.random() * sentences.length);
    currentWord = sentences[randomIndex];
  }

  if (repeat_list.includes(currentWord)){
    showNewWord();
  }
  // Update the input-field to limit the length to the currentWord
    document.getElementById("input-field").maxLength = currentWord.length;

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

    if(settings_color_current){ // Highlight first char when setting is on.
    const chars = wordDisplayElement.querySelectorAll("[data-char]");
    
    if (chars.length > 0) chars[0].classList.add("highlight");
    }

  });

  inputElement.value = "";
  return currentWord;
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
  if (!correctSoFar && settings_end_incomplete &&arrayValue.length === currentWord.length) {
    if (score > 0){
      score--;
    }

    scoreElement.innerText = score;
    repeat_list.push(currentWord);

    // Store word for skipping setting
    if(settings_skip_repeats){
      if(settings_skip_repeats && repeat_list.length > settings_store_skips){
        repeat_list.splice(0, repeat_list.length - settings_store_skips); // Targets last
      }
    }
    showNewWord();
  }
  if (correctSoFar && arrayValue.length === currentWord.length) {
    score++;
    scoreElement.innerText = score;
    repeat_list.push(currentWord);

    if(settings_skip_repeats){
      if(settings_skip_repeats && repeat_list.length > settings_store_skips){
        repeat_list.splice(0, repeat_list.length - settings_store_skips); // Targets last
      }
    }
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
  if (settings_reset_score){
    score = 0;
    scoreElement.innerText = score;
  }
  init();
}

// Start the game
init();
