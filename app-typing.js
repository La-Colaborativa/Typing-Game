// JAVASCRIPT: The Logic

import {
  words, phrases, sentences,
  week_1_curriculum_words, week_1_curriculum_random,
  week_2_curriculum_words, week_2_curriculum_random,
  week_3_curriculum_words, week_3_curriculum_random,
  week_4_curriculum_words, week_4_curriculum_random,
  week_5_curriculum_words, week_5_curriculum_random,
  week_6_curriculum_words, week_6_curriculum_random,
  week_7_curriculum_words, week_7_curriculum_random,
  week_8_curriculum_words, week_8_curriculum_random,
} from "./typing_word_banks.js";
import {settings_config_defaults } from "./typing_settings_file.js";

const settings = { ...settings_config_defaults };

let currentWord = null;
let score = 0;
let repeat_list = [];
window.repeat_list = repeat_list; // DevTools
let startTime = null;
let endTime = null


// 1. DOM HELPERS
const $ = (id) => document.getElementById(id); // Removes the reptition of having to manually type out document.getElem...

const elements = {
  wordDisplay: $("word-display"),
  input: $("input-field"),
  score: $("score"),
  scoreBoard: $("score-board"),
  wpmBoard: $("wpm-board"),
  secondsBoard: $("seconds-board"),
  wpmValue: $("wpm-value"),
  secondsValue: $("seconds-value"),
  
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
  use_week_1_words: week_1_curriculum_words, use_week_1_random: week_1_curriculum_random,
  use_week_2_words: week_2_curriculum_words, use_week_2_random: week_2_curriculum_random,
  use_week_3_words: week_3_curriculum_words, use_week_3_random: week_3_curriculum_random,
  use_week_4_words: week_4_curriculum_words, use_week_4_random: week_4_curriculum_random,
  use_week_5_words: week_5_curriculum_words, use_week_5_random: week_5_curriculum_random,
  use_week_6_words: week_6_curriculum_words, use_week_6_random: week_6_curriculum_random,
  use_week_7_words: week_7_curriculum_words, use_week_7_random: week_7_curriculum_random,
  use_week_8_words: week_8_curriculum_words, use_week_8_random: week_8_curriculum_random,
};

const checkboxMap = {
  color_current: $("checkbox-settings-highlight"),
  disable_score: $("checkbox-settings-disable-score"),
  reset_score: $("checkbox-settings-reset-score"),
  skip_repeats: $("checkbox-settings-skip-repeats"),
  end_incomplete: $("checkbox-settings-end-incomplete"),
  reset_repeats: $("checkbox-settings-reset-repeats"),
  disappear_text: $("checkbox-settings-disappear-text"),
  disable_wpm: $("checkbox-settings-disable-wpm"),

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
  updateWPMScoreboardVisibility();
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
    case "disable_wpm":
      updateWPMScoreboardVisibility();
      break;
  }
}

function updateScoreboardVisibility() {
  elements.scoreBoard.classList.toggle("hidden", settings.disable_score);
}

function updateWPMScoreboardVisibility() {
  elements.wpmBoard.classList.toggle("hidden", settings.disable_wpm);
  elements.secondsBoard.classList.toggle("hidden", settings.disable_wpm);
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
    elements.wpmValue.innerText = "0";
    elements.secondsValue.innerText = "00:00";
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

  if (needsShift) {
    const usesLeftHand = !!fingerInfo.left;
    const usesRightHand = !!fingerInfo.right;

    if (usesLeftHand && !usesRightHand) {
      result.right.add("pinky"); // use Right Shift
    } else {
      result.left.add("pinky"); // use Left Shift
    }
  }

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

function getShiftKeyForChar(char) {
  if (!char) return null;

  let needsShift = false;
  let baseKey = char;

  if (char >= "A" && char <= "Z") {
    needsShift = true;
  } else if (shiftMap[char]) {
    needsShift = true;
    baseKey = shiftMap[char];
  }

  if (!needsShift) return null;

  baseKey = baseKey.toUpperCase();
  const fingerInfo = keyFingerMap[baseKey];
  if (!fingerInfo) return "shift";

  return fingerInfo.left ? "shift-1" : "shift";
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

  const shiftKey = getShiftKeyForChar(expectedChar);

  if (expectedChar >= "A" && expectedChar <= "Z") {
    if (shiftKey) hoverKey(shiftKey);
    hoverKey(expectedChar);
    return;
  }

  if (shiftMap[expectedChar]) {
    if (shiftKey) hoverKey(shiftKey);
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

  if(inputChars.length > 0 && startTime === null){
    startTime = performance.now()
  }

  if (!isComplete) return;

  if (correctSoFar) {
    endTime = performance.now()
    const seconds = (endTime - startTime) / 1000;
    const seconds_time = (seconds % 60).toFixed(0); // Two different seconds to calculate WPM as accurately as possible
    const minutes = seconds / 60;                   // and to display it in time format (00m:00s).
    const wpm = (currentWord.length / 5) / minutes;

    const minutes_time = Math.floor((seconds % 3600) / 60);

    elements.wpmValue.innerText = Math.round(wpm);
    elements.secondsValue.innerText = (`${minutes_time.toString().padStart(2, '0')}:${seconds_time.toString().padStart(2, '0')}`);

    startTime = null;
    endTime = null;
    completeRound({ correct: true });
    return;
  }

  if (settings.end_incomplete) {
    startTime = null;
    endTime = null;
    completeRound({ correct: false });
  }
}


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

init();

// Sorry to whoever is managing this file in the future it is disgustinly huge.