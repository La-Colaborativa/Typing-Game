// JAVASCRIPT: The Logic

<<<<<<< Updated upstream
import {
  words,
  phrases,
  sentences,
  week_1_curriculum_words,
  week_1_curriculum_random,
  week_2_curriculum_words,
  week_2_curriculum_random,
  week_3_curriculum_words,
  week_3_curriculum_random,
  week_4_curriculum_words,
  week_4_curriculum_random,
  week_5_curriculum_words,
  week_5_curriculum_random,
  week_6_curriculum_words,
  week_6_curriculum_random,
  week_7_curriculum_words,
  week_7_curriculum_random,
  week_8_curriculum_words,
  week_8_curriculum_random,
} from "./word-banks.js";
import { settings_config_defaults } from "./settings_file.js";

const settings = { ...settings_config_defaults };
=======
// 1. The Word Banks (Single word, short phrase, or full sentences.)

import { words, phrases, sentences } from './word-banks.js';

// 2a. Settings Variables
let settings_color_current = true;     // DEFAULT:  true | Shows the current character being underlined and colored in blue.
let settings_disable_score = false;    // DEFAULT: false | Disables score component from being present on the bottom of input (hidden, still tracks).
let settings_reset_score = true;       // DEFAULT:  true | Restart button resetting the score.
let settings_skip_repeats = true;      // DEFAULT: false | Stops from potentially getting the same prompt (generates another one instead).
let settings_store_skips = 10;         // DEFAULT:    10 | How many items are in the list before they can reappear.
let settings_end_incomplete = false;   // DEFAULT: false | If the user is at the end of the text limit but incorrect characters exist, move on (-1 point).
let settings_reset_repeats = false;    // DEFAULT: false | If reset button is hit, it will not clear the repeat_list entries.
let settings_disappear_text = false;   // DEFAULT: false | Hides the character after being completed with no error.

let repeat_list = [];
window.repeat_list = repeat_list; // For DevTools Console testing in the browser. Use "repeat_list" in the console. 
let length_of_word_bank = words.length + phrases.length + sentences.length;

// 2a. Select Settings Elements
document.getElementById("input-store-skips-value").placeholder = settings_store_skips;
document.getElementById("input-store-skips-value").max = length_of_word_bank; // Limit can not be higher than the actual word-bank itself. doesn't make sense...

const storeSkipsDisplay = document.getElementById("settings-store-skips");
const storeSkipsInput = document.getElementById("input-store-skips-value");
const storeSkipsForm = document.getElementById("store-skips-form");

function renderStoreSkips() {
  storeSkipsDisplay.textContent = settings_store_skips;
  storeSkipsInput.value = settings_store_skips; // show current in input
}

storeSkipsForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Validate input.
  const next = Number.parseInt(storeSkipsInput.value, 10);

  if (Number.isNaN(next) || next < 1) {
    // If you want, show a message instead of alert
    alert("Please enter a whole number 1 or higher.");
    storeSkipsInput.value = settings_store_skips;
    return;
  }

  // Update local setting
  settings_store_skips = next;

  // Immediately enforce it on the current repeat_list so behavior matches new setting
  if (settings_skip_repeats && repeat_list.length > settings_store_skips) {
    repeat_list.splice(0, repeat_list.length - settings_store_skips);
  }

  // Update UI
  renderStoreSkips();
});

// 2b. Connecting Elements 
const elementHighlight = document.getElementById("checkbox-settings-highlight");
const elementDisableScore = document.getElementById("checkbox-settings-disable-score");
const elementResetScore = document.getElementById("checkbox-settings-reset-score");
const elementSkipRepeats = document.getElementById("checkbox-settings-skip-repeats");
const elementEndIncomplete = document.getElementById("checkbox-settings-end-incomplete");
const elementResetRepeats = document.getElementById("checkbox-settings-reset-repeats");
const elementDisappearText = document.getElementById("checkbox-settings-disappear-text");

elementHighlight.checked = settings_color_current;
elementDisableScore.checked = settings_disable_score;
elementResetScore.checked = settings_reset_score;
elementSkipRepeats.checked = settings_skip_repeats;
elementEndIncomplete.checked = settings_end_incomplete;
elementResetRepeats.checked = settings_reset_repeats;
elementDisappearText.checked = settings_disappear_text;

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

// 2b. Select Browser Elements
const wordDisplayElement = document.getElementById("word-display");
const inputElement = document.getElementById("input-field");
const scoreElement = document.getElementById("score");
var modal = document.getElementById("settingsModal");
var settingsButton = document.getElementById("Settings");
var restartButton = document.getElementById("Restart");
>>>>>>> Stashed changes

let currentWord = null;
let score = 0;
let repeat_list = [];
window.repeat_list = repeat_list; // DevTools

<<<<<<< Updated upstream
// 1. DOM HELPERS
const $ = (id) => document.getElementById(id);

const elements = {
  wordDisplay: $("word-display"),
  input: $("input-field"),
  score: $("score"),
  scoreBoard: $("score-board"),

  modal: $("settingsModal"),
  settingsButton: $("Settings"),
  restartButton: $("Restart"),
  closeSpan: document.getElementsByClassName("close")[0],

  leftHandOverlays: $("left-hand-overlays"),
  rightHandOverlays: $("right-hand-overlays"),

  storeSkipsDisplay: $("settings-store-skips"),
  storeSkipsInput: $("input-store-skips-value"),
  storeSkipsForm: $("store-skips-form"),

  keyButtons: document.querySelectorAll(".keyboard .key")
};

// 2. SETTINGS STATE
const weeklyCurriculumMap = {
  use_week_1_words: week_1_curriculum_words,
  use_week_1_random: week_1_curriculum_random,
  use_week_2_words: week_2_curriculum_words,
  use_week_2_random: week_2_curriculum_random,
  use_week_3_words: week_3_curriculum_words,
  use_week_3_random: week_3_curriculum_random,
  use_week_4_words: week_4_curriculum_words,
  use_week_4_random: week_4_curriculum_random,
  use_week_5_words: week_5_curriculum_words,
  use_week_5_random: week_5_curriculum_random,
  use_week_6_words: week_6_curriculum_words,
  use_week_6_random: week_6_curriculum_random,
  use_week_7_words: week_7_curriculum_words,
  use_week_7_random: week_7_curriculum_random,
  use_week_8_words: week_8_curriculum_words,
  use_week_8_random: week_8_curriculum_random,
};

const checkboxMap = {
  color_current: $("checkbox-settings-highlight"),
  disable_score: $("checkbox-settings-disable-score"),
  reset_score: $("checkbox-settings-reset-score"),
  skip_repeats: $("checkbox-settings-skip-repeats"),
  end_incomplete: $("checkbox-settings-end-incomplete"),
  reset_repeats: $("checkbox-settings-reset-repeats"),
  disappear_text: $("checkbox-settings-disappear-text"),

  use_week_1_words: $("checkbox-settings-week-1-words"),
  use_week_1_random: $("checkbox-settings-week-1-random"),
  use_week_2_words: $("checkbox-settings-week-2-words"),
  use_week_2_random: $("checkbox-settings-week-2-random"),
  use_week_3_words: $("checkbox-settings-week-3-words"),
  use_week_3_random: $("checkbox-settings-week-3-random"),
  use_week_4_words: $("checkbox-settings-week-4-words"),
  use_week_4_random: $("checkbox-settings-week-4-random"),
  use_week_5_words: $("checkbox-settings-week-5-words"),
  use_week_5_random: $("checkbox-settings-week-5-random"),
  use_week_6_words: $("checkbox-settings-week-6-words"),
  use_week_6_random: $("checkbox-settings-week-6-random"),
  use_week_7_words: $("checkbox-settings-week-7-words"),
  use_week_7_random: $("checkbox-settings-week-7-random"),
  use_week_8_words: $("checkbox-settings-week-8-words"),
  use_week_8_random: $("checkbox-settings-week-8-random"),
};

function loadSettings() {
  Object.assign(settings, settings_config_defaults);
}

function syncSettingsToUI() {
  Object.entries(checkboxMap).forEach(([key, element]) => {
    element.checked = !!settings[key];
  });

  elements.storeSkipsInput.placeholder = settings.store_skips;
  renderStoreSkips();
  updateScoreboardVisibility();
}

function bindSettingsEvents() {
  Object.entries(checkboxMap).forEach(([key, element]) => {
    element.addEventListener("change", () => {
      settings[key] = element.checked;
      handleSettingChange(key);
    });
  });

  elements.storeSkipsForm.addEventListener("submit", handleStoreSkipsSubmit);
}

function handleSettingChange(key) {
  switch (key) {
    case "color_current":
    case "use_week_1_words":
    case "use_week_1_random":
    case "use_week_2_words":
    case "use_week_2_random":
    case "use_week_3_words":
    case "use_week_3_random":
    case "use_week_4_words":
    case "use_week_4_random":
    case "use_week_5_words":
    case "use_week_5_random":
    case "use_week_6_words":
    case "use_week_6_random":
    case "use_week_7_words":
    case "use_week_7_random":
    case "use_week_8_words":
    case "use_week_8_random":
      showNewWord();
      break;

    case "disable_score":
      updateScoreboardVisibility();
      break;
  }
}

function updateScoreboardVisibility() {
  elements.scoreBoard.classList.toggle("hidden", settings.disable_score);
}

function renderStoreSkips() {
  elements.storeSkipsDisplay.textContent = settings.store_skips;
  elements.storeSkipsInput.value = settings.store_skips;
}

function handleStoreSkipsSubmit(e) { // Deals with potential store skips option issue.
  e.preventDefault();

  const userNumber = Number.parseInt(elements.storeSkipsInput.value, 10);

  if (Number.isNaN(userNumber) || userNumber < 1) {
    alert("Please enter a whole number 1 or higher.");
    elements.storeSkipsInput.value = settings.store_skips;
    return;
  }

  settings.store_skips = userNumber;
  trimRepeatList();
  renderStoreSkips();
}

// 3. MODAL / BUTTONS
function bindUIEvents() {
  elements.settingsButton.onclick = () => { // Opens settings.
    elements.modal.style.display = "block";
  };

  elements.closeSpan.onclick = () => { // Closing settings.
    elements.modal.style.display = "none";
  };

  window.onclick = (event) => { // Click outside of modal, closes.
    if (event.target === elements.modal) {
      elements.modal.style.display = "none";
    }
  };

  elements.restartButton.onclick = restartGame;
  elements.input.addEventListener("input", processInput);
}

function restartGame() { // Restart was hit. Resets options if active.
  if (settings.reset_score) {
    score = 0;
    updateScore();
  }

  if (settings.reset_repeats) {
    repeat_list.length = 0;
  }

  elements.input.focus(); // Focus on input element (input box).
  initRound();
}

// 4. HAND / KEYBOARD
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

const keyFingerMap = { // Map keys to finger highlights.
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

  SPACE: { left: "thumb", right: "thumb" }
};

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
  renderHandOverlays(elements.leftHandOverlays, "left", leftFingers);
  renderHandOverlays(elements.rightHandOverlays, "right", rightFingers);
}

function getFingerHintsForChar(char) {
  const result = { left: new Set(), right: new Set() };
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
  } else if (shiftMap[char]) {
    needsShift = true;
    baseKey = shiftMap[char];
  }

  baseKey = baseKey.toUpperCase();
  const fingerInfo = keyFingerMap[baseKey];
  if (!fingerInfo) return result;

  if (fingerInfo.left) result.left.add(fingerInfo.left);
  if (fingerInfo.right) result.right.add(fingerInfo.right);
  if (needsShift) result.left.add("pinky");

  return result;
}

function updateHandHints() {
  const expectedChar = getExpectedChar();

  if (expectedChar === undefined) {
    setHandImages([], []);
    return;
  }

  const fingers = getFingerHintsForChar(expectedChar);
  setHandImages([...fingers.left], [...fingers.right]);
}

function clearKeyHover() {
  elements.keyButtons.forEach((btn) => btn.classList.remove("key--hover"));
}

function hoverKey(keyValue) {
  document
    .querySelectorAll(`.key[data-key="${CSS.escape(keyValue)}"]`)
    .forEach((el) => el.classList.add("key--hover"));
}

function updateKeyHover() {
  clearKeyHover();
  updateHandHints();

  const expectedChar = getExpectedChar();
  if (expectedChar === undefined) return;

  if (expectedChar === " ") {
    hoverKey("space");
    return;
  }

  if (expectedChar >= "A" && expectedChar <= "Z") { // Shift keys for alphabet, rest are special keys.
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


// 5. WORD GEN / DISPLAY
function getSelectedSourceList() {
  const selected = Object.entries(weeklyCurriculumMap)
    .filter(([settingKey]) => settings[settingKey])
    .flatMap(([, curriculum]) => curriculum);

  return selected.length > 0
    ? selected
    : [...words, ...phrases, ...sentences]; // Defaults to these if no weekly content selected.
}

function getAvailablePool() {
  const sourceList = getSelectedSourceList();

  if (!settings.skip_repeats) return sourceList;

  let pool = sourceList.filter((item) => !repeat_list.includes(item)); // Remove items in sourceList from repeat_list.

  if (pool.length === 0) { // If all items filtered out, clear repeat_List.
    repeat_list.length = 0;
    pool = sourceList;
  }

  return pool;
}

function pickRandomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function buildWordDisplay(targetText) { // Creates spans for word display.
  const fragment = document.createDocumentFragment();
  const parts = targetText.split(" ");

  parts.forEach((word, wordIndex) => {
    const wordSpan = document.createElement("span");
    wordSpan.className = "word";

    word.split("").forEach((ch) => {
      const charSpan = document.createElement("span");
      charSpan.innerText = ch;
      charSpan.dataset.char = ch;
      wordSpan.appendChild(charSpan);
    });

    fragment.appendChild(wordSpan);

    if (wordIndex < parts.length - 1) { // Word has finished, add space unless last word.
      const spaceSpan = document.createElement("span");
      spaceSpan.className = "space";
      spaceSpan.innerText = "\u00A0";
      spaceSpan.dataset.char = " ";
      fragment.appendChild(spaceSpan);
    }
  });

  elements.wordDisplay.innerHTML = "";
  elements.wordDisplay.appendChild(fragment);
}

function highlightCurrentChar(index = 0) {
  if (!settings.color_current) return;

  const chars = elements.wordDisplay.querySelectorAll("[data-char]");
  chars.forEach((span) => span.classList.remove("highlight"));

  if (index < chars.length) {
    chars[index].classList.add("highlight");
  }
}

function showNewWord() {
  const pool = getAvailablePool();
  currentWord = pickRandomItem(pool);

  elements.input.maxLength = currentWord.length;
  elements.storeSkipsInput.max = pool.length - 1;

  buildWordDisplay(currentWord);
  elements.input.value = "";

  highlightCurrentChar(0);
  updateKeyHover();

  return currentWord;
}

// 6. INPUT / ROUND LOGIC
function getExpectedChar() {
  if (!currentWord) return undefined;
  return currentWord[elements.input.value.length];
}

function getQuoteSpans() {
  return elements.wordDisplay.querySelectorAll("[data-char]");
}

function scrollCurrentCharIntoView(spans, index) {
  if (index >= spans.length) return;

  spans[index].scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "nearest"
  });
}

function updateCharacterStates(spans, inputChars) {
  let correctSoFar = true;

  spans.forEach((span, index) => {
    const typedChar = inputChars[index];

    if (typedChar == null) { // Not typed.
      span.classList.remove("correct", "incorrect", "hidden");
      correctSoFar = false;
      return;
    }

    if (typedChar === span.dataset.char) { // Correct.
      span.classList.remove("incorrect");
      span.classList.add("correct");

      if (settings.disappear_text) {
        span.classList.add("hidden");
      }
      return;
    }

    span.classList.remove("correct");
    span.classList.add("incorrect"); // Otherwise, incorrect.

    if (settings.disappear_text) { // Disappearing Setting.
      span.classList.remove("hidden");
    }

    correctSoFar = false;
  });

  return correctSoFar;
}

function trimRepeatList() {
  if (settings.skip_repeats && repeat_list.length > settings.store_skips) {
    repeat_list.splice(0, repeat_list.length - settings.store_skips); // Remove first index of list if store skips is exceeded.
  }
}

function completeRound({ correct }) {
  if (correct) {
    score++;
  } else if (score > 0) {
    score--;
  }

  updateScore();
  repeat_list.push(currentWord);
  trimRepeatList();
  showNewWord();
}

function updateScore() {
  elements.score.innerText = score;
}

function processInput() {
  const quoteSpans = getQuoteSpans();
  const inputChars = elements.input.value.split("");
  const currentCharIndex = inputChars.length;

  updateKeyHover();
  highlightCurrentChar(currentCharIndex);

  if (settings.color_current && currentCharIndex < quoteSpans.length) {
    scrollCurrentCharIntoView(quoteSpans, currentCharIndex); // Auto-scrolls.
  }

  const correctSoFar = updateCharacterStates(quoteSpans, inputChars);
  const isComplete = inputChars.length === currentWord.length;

  if (!isComplete) return;

  if (correctSoFar) {
    completeRound({ correct: true });
    return;
  }

  if (settings.end_incomplete) {
    completeRound({ correct: false });
  }
}

=======
// Get the element that closes the modal.
var closeSpan = document.getElementsByClassName("close")[0];
>>>>>>> Stashed changes

// 7. INITIALIZE
function initRound() {
  renderStoreSkips();
  showNewWord();
}

function init() {
  loadSettings();
  syncSettingsToUI();
  bindSettingsEvents();
  bindUIEvents();
  updateScore();
  initRound();
}

<<<<<<< Updated upstream
init();
=======
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
  if(settings_reset_repeats){
    repeat_list.length = 0;
  }
  inputElement.focus();
  init();
}

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

function clearKeyHover() {
  keyButtons.forEach(btn => btn.classList.remove("key--hover"));
}

function hoverKey(keyValue) {
  document
    .querySelectorAll(`.key[data-key="${CSS.escape(keyValue)}"]`)
    .forEach(el => el.classList.add("key--hover"));
}

// 4. Initialize Game
inputElement.addEventListener("input", processInput);  // Moved outside so it doesn't keep creating new input listeners when restart is hit (overflow).

function init() {
  renderStoreSkips();
  showNewWord();
}

// 5. Pick and Display a Random Word
function showNewWord() {
  const maxTries = 100;
  let tries = 0;

  while (true) {
    // Picks randomly between words, phrases, or sentences.
    let textGenerator = Math.floor(Math.random() * 3);
    //textGenerator = 1; // ! DEV TEST: comment out once done.

    if (textGenerator === 0) {
      currentWord = words[Math.floor(Math.random() * words.length)];
    } else if (textGenerator === 1) {
      currentWord = phrases[Math.floor(Math.random() * phrases.length)];
    } else {
      currentWord = sentences[Math.floor(Math.random() * sentences.length)];
    }

    // Break if repeats are okay.
    if (!settings_skip_repeats) break;
    // Break if not in repeat_list array.
    if (!repeat_list.includes(currentWord)) break;

    tries++;
    if (tries >= maxTries) {
      // If no more available words (only possible if dev limits it) then clear list.
      repeat_list.length = 0;
      break;
    }
  }

// Update the input-field to limit the length to the currentWord.
  document.getElementById("input-field").maxLength = currentWord.length;

  wordDisplayElement.innerHTML = "";
  const parts = currentWord.split(" ");

  parts.forEach((word, wordIndex) => {
    const wordSpan = document.createElement("span");
    wordSpan.className = "word";

    word.split("").forEach((ch) => {
      const charSpan = document.createElement("span");
      charSpan.innerText = ch;

      // Store real character to compare.
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
  updateKeyHover();
  return currentWord;
}

function updateKeyHover() {
  clearKeyHover();

  if (!currentWord) return;

  const currentCharIndex = inputElement.value.length;
  const expectedChar = currentWord[currentCharIndex];

  if (expectedChar === undefined) return;

  // space
  if (expectedChar === " ") {
    hoverKey("space");
    return;
  }

  // uppercase letter
  if (expectedChar >= "A" && expectedChar <= "Z") {
    hoverKey("shift");
    hoverKey(expectedChar);
    return;
  }

  // shifted symbols
  if (shiftMap[expectedChar]) {
    hoverKey("shift");
    hoverKey(shiftMap[expectedChar]);
    return;
  }

  // normal lowercase / number / symbol
  hoverKey(expectedChar.toUpperCase());
}

// 6. Compare Input to Target
function processInput() {
  const arrayQuote = wordDisplayElement.querySelectorAll("[data-char]");
  const arrayValue = inputElement.value.split("");

  const currentChar = arrayValue.length;
  updateKeyHover();

  if (settings_color_current){
  // Remove highlight
  arrayQuote.forEach(span => span.classList.remove("highlight"));

  // Highlight for current char
  if (currentChar < arrayQuote.length){
    arrayQuote[currentChar].classList.add("highlight");
    // arrayQuote[currentChar].classList.add("hidden")

    // Auto-scroll so the highlighted char is visible.
    arrayQuote[currentChar].scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest"
    });
  }
}

  updateKeyHover();

// find the character the user SHOULD type next
const expectedChar = currentWord[currentChar];

  let correctSoFar = true;

  // Loop through each character span in the displayed word.
  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index];

    if (character == null) {
      // Character hasn't been typed yet.
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      characterSpan.classList.remove("hidden")
      correctSoFar = false;
    } else if (character === characterSpan.dataset.char) {
      // Correct character
      characterSpan.classList.remove("incorrect");
      characterSpan.classList.add("correct");
      
      if(settings_disappear_text){ // Disappear text setting.
        characterSpan.classList.add("hidden")
      }
    } else {
      // Incorrect character.
      characterSpan.classList.remove("correct");
      characterSpan.classList.add("incorrect");
      
      if(settings_disappear_text){
        characterSpan.classList.remove("hidden")
      }
      correctSoFar = false;
    }
  });

  // Check if the word is fully complete and correct.
  if (!correctSoFar && settings_end_incomplete && arrayValue.length === currentWord.length) {
    if (score > 0){
      score--;
    }

    scoreElement.innerText = score;
    repeat_list.push(currentWord);

    // Store word for skipping setting.
    if(settings_skip_repeats){
      if(settings_skip_repeats && repeat_list.length > settings_store_skips){
        repeat_list.splice(0, repeat_list.length - settings_store_skips); // Targets last.
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
        repeat_list.splice(0, repeat_list.length - settings_store_skips);
      }
    }
    showNewWord();
  }
}

// Start the game.
init();
>>>>>>> Stashed changes
