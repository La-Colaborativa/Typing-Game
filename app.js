// JAVASCRIPT: The Logic

// 1. The Word Banks (Single word, short phrase, or full sentences).

import { words, phrases, sentences, week_1_curriculum, week_2_curriculum, week_3_curriculum, week_4_curriculum, week_5_curriculum, week_6_curriculum } from './word-banks.js';

// 2a. Settings Variables
let settings_color_current = true;     // DEFAULT:  true | Shows the current character being underlined and colored in blue.
let settings_disable_score = false;    // DEFAULT: false | Disables score component from being present on the bottom of input (hidden, still tracks).
let settings_reset_score = true;       // DEFAULT:  true | Restart button resetting the score.
let settings_skip_repeats = true;      // DEFAULT: false | Stops from potentially getting the same prompt (generates another one instead).
let settings_store_skips = 10;         // DEFAULT:    10 | How many items are in the list before they can reappear.
let settings_end_incomplete = false;   // DEFAULT: false | If the user is at the end of the text limit but incorrect characters exist, move on (-1 point).
let settings_reset_repeats = false;    // DEFAULT: false | If reset button is hit, it will not clear the repeat_list entries.
let settings_disappear_text = false;   // DEFAULT: false | Hides the character after being completed with no error.

let use_week_1 = false;   // DEFAULT: false | Week 1 Content.
let use_week_2 = false;   // DEFAULT: false | Week 2 Content.
let use_week_3 = false;   // DEFAULT: false | Week 3 Content.
let use_week_4 = false;   // DEFAULT: false | Week 4 Content.
let use_week_5 = false;   // DEFAULT: false | Week 5 Content.
let use_week_6 = false;   // DEFAULT: false | Week 6 Content.

let repeat_list = [];
window.repeat_list = repeat_list; // For DevTools Console testing in the browser. Use "repeat_list" in the console. 

// 2b. Select Settings Elements & Functions.
const elementHighlight = document.getElementById("checkbox-settings-highlight");
const elementDisableScore = document.getElementById("checkbox-settings-disable-score");
const elementResetScore = document.getElementById("checkbox-settings-reset-score");
const elementSkipRepeats = document.getElementById("checkbox-settings-skip-repeats");
const elementEndIncomplete = document.getElementById("checkbox-settings-end-incomplete");
const elementResetRepeats = document.getElementById("checkbox-settings-reset-repeats");
const elementDisappearText = document.getElementById("checkbox-settings-disappear-text");

const elementWeek1 = document.getElementById("checkbox-settings-week-1");
const elementWeek2 = document.getElementById("checkbox-settings-week-2");
const elementWeek3 = document.getElementById("checkbox-settings-week-3");
const elementWeek4 = document.getElementById("checkbox-settings-week-4");
const elementWeek5 = document.getElementById("checkbox-settings-week-5");
const elementWeek6 = document.getElementById("checkbox-settings-week-6");

const storeSkipsDisplay = document.getElementById("settings-store-skips");
document.getElementById("input-store-skips-value").placeholder = settings_store_skips; // UI temp placeholder (settings menu).
const storeSkipsInput = document.getElementById("input-store-skips-value");
const storeSkipsForm = document.getElementById("store-skips-form");

elementHighlight.checked = settings_color_current;
elementDisableScore.checked = settings_disable_score;
elementResetScore.checked = settings_reset_score;
elementSkipRepeats.checked = settings_skip_repeats;
elementEndIncomplete.checked = settings_end_incomplete;
elementResetRepeats.checked = settings_reset_repeats;
elementDisappearText.checked = settings_disappear_text;
elementWeek1.checked = use_week_1;
elementWeek2.checked = use_week_2;
elementWeek3.checked = use_week_3;
elementWeek4.checked = use_week_4;
elementWeek5.checked = use_week_5;
elementWeek6.checked = use_week_6;

function renderStoreSkips() { // Update the skips UI.
  storeSkipsDisplay.textContent = settings_store_skips;
  storeSkipsInput.value = settings_store_skips; // Show current in input (yes, read that again i am not incorrect).
}

storeSkipsForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const user_numbers = Number.parseInt(storeSkipsInput.value, 10); // Validate input.

  if (Number.isNaN(user_numbers) || user_numbers < 1) {
    alert("Please enter a whole number 1 or higher.");
    storeSkipsInput.value = settings_store_skips;
    return;
  }

  settings_store_skips = user_numbers; // Update local setting.

  if (settings_skip_repeats && repeat_list.length > settings_store_skips) { // Immediately enforce it on the current repeat_list so behavior matches new setting.
    repeat_list.splice(0, repeat_list.length - settings_store_skips);
  }
  renderStoreSkips();
});

// 2c. Select Browser Elements & Browser Functions.
const wordDisplayElement = document.getElementById("word-display");
const inputElement = document.getElementById("input-field");
const scoreElement = document.getElementById("score");
var modal = document.getElementById("settingsModal");
var settingsButton = document.getElementById("Settings");
var restartButton = document.getElementById("Restart");
const leftHandOverlays = document.getElementById("left-hand-overlays");
const rightHandOverlays = document.getElementById("right-hand-overlays");

const handImages = {
  left: {
    pinky: "./images/hands/left-pinky.png",
    ring: "./images/hands/left-ring.png",
    middle: "./images/hands/left-middle.png",
    index: "./images/hands/left-index.png",
    thumb: "./images/hands/left-thumb.png"
  },
  right: {
    pinky: "./images/hands/right-pinky.png",
    ring: "./images/hands/right-ring.png",
    middle: "./images/hands/right-middle.png",
    index: "./images/hands/right-index.png",
    thumb: "./images/hands/right-thumb.png"
  }
};

const keyFingerMap = {
  "`": { left: "pinky" },
  "1": { left: "pinky" },
  "2": { left: "ring" },
  "3": { left: "middle" },
  "4": { left: "index" },
  "5": { left: "index" },

  "6": { right: "index" },
  "7": { right: "index" },
  "8": { right: "middle" },
  "9": { right: "ring" },
  "0": { right: "pinky" },
  "-": { right: "pinky" },
  "=": { right: "pinky" },

  "Q": { left: "pinky" },
  "W": { left: "ring" },
  "E": { left: "middle" },
  "R": { left: "index" },
  "T": { left: "index" },

  "Y": { right: "index" },
  "U": { right: "index" },
  "I": { right: "middle" },
  "O": { right: "ring" },
  "P": { right: "pinky" },
  "[": { right: "pinky" },
  "]": { right: "pinky" },
  "\\": { right: "pinky" },

  "A": { left: "pinky" },
  "S": { left: "ring" },
  "D": { left: "middle" },
  "F": { left: "index" },
  "G": { left: "index" },

  "H": { right: "index" },
  "J": { right: "index" },
  "K": { right: "middle" },
  "L": { right: "ring" },
  ";": { right: "pinky" },
  "'": { right: "pinky" },

  "Z": { left: "pinky" },
  "X": { left: "ring" },
  "C": { left: "middle" },
  "V": { left: "index" },
  "B": { left: "index" },

  "N": { right: "index" },
  "M": { right: "index" },
  ",": { right: "middle" },
  ".": { right: "ring" },
  "/": { right: "pinky" },

  "SPACE": { left: "thumb", right: "thumb" }
};

function renderHandOverlays(container, side, fingers) {
  container.innerHTML = "";

  fingers.forEach((finger) => {
    const src = handImages[side][finger];
    if (!src) return;

    const img = document.createElement("img");
    img.className = "hand-overlay";
    img.src = src;
    img.alt = "";
    img.setAttribute("aria-hidden", "true");

    container.appendChild(img);
  });
}

function setHandImages(leftFingers = [], rightFingers = []) {
  renderHandOverlays(leftHandOverlays, "left", leftFingers);
  renderHandOverlays(rightHandOverlays, "right", rightFingers);
}

function getFingerHintsForChar(char) {
  const result = {
    left: new Set(),
    right: new Set()
  };

  if (!char) return result;

  if (char === " ") {
    result.left.add("thumb");
    result.right.add("thumb");
    return result;
  }

  let needsShift = false;
  let baseKey = char;

  if (char >= "A" && char <= "Z") {
    needsShift = true;
    baseKey = char;
  } else if (shiftMap[char]) {
    needsShift = true;
    baseKey = shiftMap[char];
  }

  baseKey = baseKey.toUpperCase();

  const fingerInfo = keyFingerMap[baseKey];
  if (!fingerInfo) return result;

  if (fingerInfo.left) result.left.add(fingerInfo.left);
  if (fingerInfo.right) result.right.add(fingerInfo.right);

  if (needsShift) {
    result.left.add("pinky");
  }

  return result;
}

function updateHandHints() {
  if (!currentWord) {
    setHandImages([], []);
    return;
  }

  const currentCharIndex = inputElement.value.length;
  const expectedChar = currentWord[currentCharIndex];

  if (expectedChar === undefined) {
    setHandImages([], []);
    return;
  }

  const fingers = getFingerHintsForChar(expectedChar);

  setHandImages(
    [...fingers.left],
    [...fingers.right]
  );
}

let currentWord = null;
let score = 0;

var closeSpan = document.getElementsByClassName("close")[0];

settingsButton.onclick = function() {
  modal.style.display = "block";
}

closeSpan.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

restartButton.onclick = function(){
  if (settings_reset_score){
    score = 0;
    scoreElement.innerText = score;
  }
  if(settings_reset_repeats){
    repeat_list.length = 0;
  }
  inputElement.focus();
  init();
}

elementHighlight.addEventListener("change", () => {
  settings_color_current = elementHighlight.checked;
  showNewWord(); // Highlight messes with rendering, so this is the easiest way without spending forever.
});
elementDisableScore.addEventListener("change", () => {
  settings_disable_score = elementDisableScore.checked;
  const getScoreboard = document.getElementById('score-board');
  getScoreboard.classList.toggle('hidden', settings_disable_score);
});
elementResetScore.addEventListener("change", () => {
  settings_reset_score = elementResetScore.checked;
});
elementSkipRepeats.addEventListener("change", () => {
  settings_skip_repeats = elementSkipRepeats.checked;
});
elementEndIncomplete.addEventListener("change", () => {
  settings_end_incomplete = elementEndIncomplete.checked;
});
elementResetRepeats.addEventListener("change", () => {
  settings_reset_repeats = elementResetRepeats.checked;
});
elementDisappearText.addEventListener("change", () => {
  settings_disappear_text = elementDisappearText.checked;
});

elementWeek1.addEventListener("change", () => {
  use_week_1 = elementWeek1.checked;
  showNewWord();
});
elementWeek2.addEventListener("change", () => {
  use_week_2 = elementWeek2.checked;
});
elementWeek3.addEventListener("change", () => {
  use_week_3 = elementWeek3.checked;
  showNewWord();
});
elementWeek4.addEventListener("change", () => {
  use_week_4 = elementWeek4.checked;
  showNewWord();
});
elementWeek5.addEventListener("change", () => {
  use_week_5 = elementWeek5.checked;
  showNewWord();
});
elementWeek6.addEventListener("change", () => {
  use_week_6 = elementWeek6.checked;
  showNewWord();
});

// 3. Keyboard helpers
const keyButtons = document.querySelectorAll(".keyboard .key");

const shiftMap = {
  "!": "1",
  "@": "2",
  "#": "3",
  "$": "4",
  "%": "5",
  "^": "6",
  "&": "7",
  "*": "8",
  "(": "9",
  ")": "0",
  "_": "-",
  "+": "=",
  "{": "[",
  "}": "]",
  ":": ";",
  '"': "'",
  "<": ",",
  ">": ".",
  "?": "/",
  "~": "`"
};

function updateKeyHover() {
  clearKeyHover();
  updateHandHints();

  if (!currentWord) return;

  const currentCharIndex = inputElement.value.length;
  const expectedChar = currentWord[currentCharIndex];

  if (expectedChar === undefined) return;

  if (expectedChar === " ") {
    hoverKey("space");
    return;
  }

  if (expectedChar >= "A" && expectedChar <= "Z") {
    hoverKey("shift");
    hoverKey(expectedChar);
    return;
  }

  if (shiftMap[expectedChar]) {
    hoverKey("shift");
    hoverKey(shiftMap[expectedChar]);
    return;
  }

  hoverKey(expectedChar.toUpperCase());
}

function clearKeyHover() {
  keyButtons.forEach(btn => btn.classList.remove("key--hover"));
}

function hoverKey(keyValue) {
  document
    .querySelectorAll(`.key[data-key="${CSS.escape(keyValue)}"]`)
    .forEach(el => el.classList.add("key--hover"));
}

// 4. Game Initializer
inputElement.addEventListener("input", processInput);

function init() {
  renderStoreSkips();
  showNewWord();
}

// 5. Pick and Display a Random Word
function showNewWord() {
  const maxTries = 200;
  let tries = 0;

  while (true) {
    const enabledWeeks = []; // Regenerate this list everytime in case the user changes it.

    if (use_week_1) enabledWeeks.push(week_1_curriculum);
    if (use_week_2) enabledWeeks.push(week_2_curriculum);
    if (use_week_3) enabledWeeks.push(week_3_curriculum);
    if (use_week_4) enabledWeeks.push(week_4_curriculum);
    if (use_week_5) enabledWeeks.push(week_5_curriculum);
    if (use_week_6) enabledWeeks.push(week_6_curriculum);

    if (enabledWeeks.length > 0) {
      const chosenWeek = enabledWeeks[Math.floor(Math.random() * enabledWeeks.length)];
      currentWord = chosenWeek[Math.floor(Math.random() * chosenWeek.length)]; // From the list selected (above), select a random entry from that list.
    } else {
      let textGenerator = Math.floor(Math.random() * 3); // Generate from words, phrases, and sentences
      if (textGenerator === 0) {
        currentWord = words[Math.floor(Math.random() * words.length)];
      } else if (textGenerator === 1) {
        currentWord = phrases[Math.floor(Math.random() * phrases.length)];
      } else {
        currentWord = sentences[Math.floor(Math.random() * sentences.length)];
      }
    }

    if (!settings_skip_repeats) break;
    if (!repeat_list.includes(currentWord)) break;

    tries++;
    if (tries >= maxTries) {
      repeat_list.length = 0;
      break;
    }
  }

  document.getElementById("input-field").maxLength = currentWord.length;
  wordDisplayElement.innerHTML = "";
  const parts = currentWord.split(" ");

  parts.forEach((word, wordIndex) => {
    const wordSpan = document.createElement("span");
    wordSpan.className = "word";

    word.split("").forEach((ch) => {
      const charSpan = document.createElement("span");
      charSpan.innerText = ch;
      charSpan.dataset.char = ch;
      wordSpan.appendChild(charSpan);
    });

    wordDisplayElement.appendChild(wordSpan);

    if (wordIndex < parts.length - 1) {
      const spaceSpan = document.createElement("span");
      spaceSpan.className = "space";
      spaceSpan.innerText = "\u00A0"; // No-break space.
      spaceSpan.dataset.char = " ";
      wordDisplayElement.appendChild(spaceSpan);
    }
  });

  if (settings_color_current) {
    const chars = wordDisplayElement.querySelectorAll("[data-char]");
    if (chars.length > 0) chars[0].classList.add("highlight");
  }

  inputElement.value = "";
  updateKeyHover();
  return currentWord;
}

// 6. Compare Input to Target
function processInput() {
  const arrayQuote = wordDisplayElement.querySelectorAll("[data-char]");
  const arrayValue = inputElement.value.split("");

  const currentChar = arrayValue.length;
  updateKeyHover();

  if (settings_color_current){
  arrayQuote.forEach(span => span.classList.remove("highlight"));

  if (currentChar < arrayQuote.length){
    arrayQuote[currentChar].classList.add("highlight");

    arrayQuote[currentChar].scrollIntoView({ // Scrolls with words on screen.
      behavior: "smooth",
      block: "center",
      inline: "nearest"
    });
  }
}

const expectedChar = currentWord[currentChar];

  let correctSoFar = true;

  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index];

    // Character hasn't been typed yet.
    if (character == null) {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      characterSpan.classList.remove("hidden")
      correctSoFar = false;
    // Correct character
    } else if (character === characterSpan.dataset.char) {
      characterSpan.classList.remove("incorrect");
      characterSpan.classList.add("correct");
      if(settings_disappear_text){
        characterSpan.classList.add("hidden")
      }
    // Incorrect character.
    } else {
      characterSpan.classList.remove("correct");
      characterSpan.classList.add("incorrect");
      if(settings_disappear_text){
        characterSpan.classList.remove("hidden")
      }
      correctSoFar = false;
    }
  });

  if (!correctSoFar && settings_end_incomplete && arrayValue.length === currentWord.length) { // If attempt is completed but incorrect (requires settings_end_incomplete being enabled).
    if (score > 0){
      score--;
    }

    scoreElement.innerText = score;
    repeat_list.push(currentWord);

    if(settings_skip_repeats){ // Store word for skipping setting.
      if(settings_skip_repeats && (repeat_list.length > settings_store_skips)){
        repeat_list.splice(0, repeat_list.length - settings_store_skips); // Targets last (first entry in list) and removes.
      }
    }
    showNewWord();
  }
  if (correctSoFar && arrayValue.length === currentWord.length) { // If attempt is completed and correct.
    score++;
    scoreElement.innerText = score;
    repeat_list.push(currentWord);

    if(settings_skip_repeats){
      if(settings_skip_repeats && repeat_list.length > settings_store_skips){
        repeat_list.splice(0, repeat_list.length - settings_store_skips);
      }
    }
    showNewWord();
  }
}

// 7. Actually starts the game.

init();
