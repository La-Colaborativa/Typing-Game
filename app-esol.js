import {
  pronounsQuestions, prepositionsQuestions, demonstrativesQuestions, quantityQuestions
} from "./questions_file.js";

import {
  settings,
  updateSetting
} from "./esol_settings_file.js";

const $ = (id) => document.getElementById(id); // Removes the reptition of having to manually type out document.getElem...
const elements = {
  questionDisplay: $("question-display"),
  poolAnswersDisplay: $("pool-answer-display"),
  lightbox: $("lightbox"),
  lightboxImage: $("lightbox-image"),
  lightboxClose: $("lightbox-close"),
  submitAnswers: $("submit-answers"),
  quizResults: $("quiz-results")
};

// ----- HELPER FUNCTIONS ----- //
function openLightbox(src, alt = "") {
  elements.lightboxImage.src = src;
  elements.lightboxImage.alt = alt;
  elements.lightbox.classList.add("open");
  elements.lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  elements.lightbox.classList.remove("open");
  elements.lightbox.setAttribute("aria-hidden", "true");
  elements.lightboxImage.src = "";
  elements.lightboxImage.alt = "";
}

elements.lightboxClose.addEventListener("click", closeLightbox);

elements.lightbox.addEventListener("click", (e) => {
  if (e.target === elements.lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && elements.lightbox.classList.contains("open")) {
    closeLightbox();
  }
});

function capitalizeFirstLetter(content){ // Capitalizes all elements present. Works for arrays & strings.
  if (!content) return content;
  
  if(Array.isArray(content)){
    let newArray = [];
  content.forEach(item => {
    newArray.push(`${item.charAt(0).toUpperCase() + item.slice(1)}`)
  });
  return newArray
  } else {
    return `${content.charAt(0).toUpperCase() + content.slice(1)}`;
  }
}

function shouldCapitalizeBlank(questionText) {
  const blankIndex = questionText.indexOf("___");
  if (blankIndex === -1) return false;

  const beforeBlank = questionText.slice(0, blankIndex).trimEnd();

  // Blank is at the start
  if (beforeBlank.length === 0) return true;

  // Blank comes after sentence-ending punctuation
  const lastChar = beforeBlank.slice(-1);
  return [".", "!", "?"].includes(lastChar);
}

function numToAlph(num) {
  if (num < 1 || num > 26) {
    return "Out of range";
  }
  const asciiCode = 'a'.charCodeAt(0) + num - 1; 
  return String.fromCharCode(asciiCode);
}

function getRandomInt(min, max){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max-min + 1)) + min;
}

function ensureNoRepeatsRandomInt(trackingArray, max){ // Recursively generates a number not in trackingArray.
  const indexSlot = getRandomInt(0, max);              // ᴡᴀʀɴɪɴɢ: Infinite recursion if trackingArray has every possible value returned by getRandomInt(0, max).
  if (trackingArray.includes(indexSlot)) {
    return ensureNoRepeatsRandomInt(trackingArray, max);
  }
  return indexSlot;
}

function convertItemToStringOrArray(item) {
  if (Array.isArray(item)) return item;
  return [String(item)];
}

function getMinOneValue(value, fallback = 1) {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.max(1, Math.floor(num));
}

function syncSettingsToInputs() {
  if (pronounsEnabledEl) {
    pronounsEnabledEl.checked = settings.generateGroups.pronounsQuestions;
  }
  if (pronounsCountEl) {
    pronounsCountEl.value = settings.questionCounts.pronounsQuestions;
    pronounsCountEl.disabled = !settings.generateGroups.pronounsQuestions;
  }

  if (prepositionsEnabledEl) {
    prepositionsEnabledEl.checked = settings.generateGroups.prepositionsQuestions;
  }
  if (prepositionsCountEl) {
    prepositionsCountEl.value = settings.questionCounts.prepositionsQuestions;
    prepositionsCountEl.disabled = !settings.generateGroups.prepositionsQuestions;
  }

  if (demonstrativesEnabledEl) {
    demonstrativesEnabledEl.checked = settings.generateGroups.demonstrativesQuestions;
  }
  if (demonstrativesCountEl) {
    demonstrativesCountEl.value = settings.questionCounts.demonstrativesQuestions;
    demonstrativesCountEl.disabled = !settings.generateGroups.demonstrativesQuestions;
  }

  if (quantityEnabledEl) {
    quantityEnabledEl.checked = settings.generateGroups.quantityQuestions;
  }
  if (quantityCountEl) {
    quantityCountEl.value = settings.questionCounts.quantityQuestions;
    quantityCountEl.disabled = !settings.generateGroups.quantityQuestions;
  }
}

function normalizeAnswer(answer) {
  return String(answer).trim().toLowerCase();
}

function clampQuestionCount(value, max, fallback = 1) {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(max, Math.max(1, Math.floor(num)));
}

// ----- MAIN FUNCTIONS ----- //
function generateProblems(arrayBank, questions = 5, answers = 4, startIndex = 1) {
  let trackRepeats = [];
  let questionsToGenerate = questions, answersToGenerate = answers;
  const listMax = arrayBank.length - 1;

  for (let i = 1; i <= questionsToGenerate; i++) {
    let trackIncorrectRepeats = [];
    const indexRowForBank = ensureNoRepeatsRandomInt(trackRepeats, listMax);
    trackRepeats.push(indexRowForBank);

    const questionNumber = startIndex + i - 1;
    const questionText = arrayBank[indexRowForBank][0];
    const imageLocation = arrayBank[indexRowForBank][3]; // Some do not have any, will act fine.
    let correctAnswers = convertItemToStringOrArray(arrayBank[indexRowForBank][1]);

    let incorrectAnswers = arrayBank[indexRowForBank][2]
      .flat(1)
      .filter(item => !correctAnswers.includes(item)); // Flattens list and filters out correct answers (so pool is only incorrect answers).

    const indexForAnswer = getRandomInt(1, answersToGenerate);
    const isCapitalized = shouldCapitalizeBlank(questionText); // Auto-capitalize if needed.

    const questionEl = document.createElement("div");
    questionEl.className = "question-block";
    questionEl.dataset.correct = JSON.stringify(correctAnswers);
    questionEl.dataset.questionNumber = questionNumber;

    // Show image above question if there is one.
    if (imageLocation) {
      const img = document.createElement("img");
      img.src = imageLocation;
      img.alt = `Image: ${questionText}`;
      img.width = 300;

      img.addEventListener("click", () => {
        openLightbox(img.src, img.alt);
      });

      questionEl.appendChild(img);
    }

    const questionTitle = document.createElement("p");
    questionTitle.innerHTML = `<strong>${questionNumber}. ${questionText}</strong>`;
    questionEl.appendChild(questionTitle);

    const answersEl = document.createElement("ul");
    answersEl.className = "answers-list";

    for (let j = 1; j <= answersToGenerate; j++) {
      const li = document.createElement("li");
      let answerText;

      if (j !== indexForAnswer) {
        const randomIndex = ensureNoRepeatsRandomInt(
          trackIncorrectRepeats,
          incorrectAnswers.length - 1
        );
        trackIncorrectRepeats.push(randomIndex);
        answerText = incorrectAnswers[randomIndex];
      } else {
        const pickRandomFromPool = getRandomInt(0, correctAnswers.length - 1);
        answerText = correctAnswers[pickRandomFromPool];
      }

      if (isCapitalized) answerText = capitalizeFirstLetter(answerText);

      const label = document.createElement("label");
      label.className = "answer-option";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `question-${questionNumber}`;
      input.value = answerText;

      const span = document.createElement("span");
      span.textContent = `${numToAlph(j)}. ${answerText}`;

      label.appendChild(input);
      label.appendChild(span);
      li.appendChild(label);
      answersEl.appendChild(li);
    }

    const feedbackEl = document.createElement("div");
    feedbackEl.className = "question-feedback";

    questionEl.appendChild(answersEl);
    questionEl.appendChild(feedbackEl);
    elements.questionDisplay.appendChild(questionEl);
  }

  return startIndex + questionsToGenerate;
}

function checkAnswers() {
  const questionBlocks = document.querySelectorAll(".question-block");
  let score = 0;

  questionBlocks.forEach(block => {
    const correctAnswers = JSON.parse(block.dataset.correct);
    const normalizedCorrectAnswers = correctAnswers.map(normalizeAnswer);
    const selected = block.querySelector('input[type="radio"]:checked');
    const feedbackEl = block.querySelector(".question-feedback");

    block.classList.remove("correct", "incorrect", "unanswered");

    if (!selected) { // Unanswered question.
      block.classList.add("unanswered");
      feedbackEl.textContent = `No answer selected. Select an answer and re-submit.`;
      return;
    }

    const selectedAnswer = normalizeAnswer(selected.value);

    if (normalizedCorrectAnswers.includes(selectedAnswer)) { // Correct or Incorrect.
      score++;
      block.classList.add("correct");
      feedbackEl.textContent = "Correct!";
    } else {
      block.classList.add("incorrect");
      feedbackEl.textContent = `Incorrect. Correct answer: ${correctAnswers.join(" / ")}`;
    }
  });
  elements.quizResults.textContent = `You got ${score} out of ${questionBlocks.length} correct.`;
}

elements.submitAnswers.addEventListener("click", checkAnswers);

const pronounsCountEl = $("input-settings-personal-pronouns");
const pronounsEnabledEl = $("checkbox-settings-personal-pronouns");

const prepositionsCountEl = $("input-settings-prepositions");
const prepositionsEnabledEl = $("checkbox-settings-prepositions");

const demonstrativesCountEl = $("input-settings-demonstratives");
const demonstrativesEnabledEl = $("checkbox-settings-demonstratives");

const quantityCountEl = $("input-settings-quantity");
const quantityEnabledEl = $("checkbox-settings-quantity");

const restartQuestionsEl = $("restart-questions");

// ----- CHECKBOXES ----- //

if (pronounsCountEl) { // General pattern used: sets max of input box value (update the quiz material immediately).
  pronounsCountEl.max = pronounsQuestions.length;

  pronounsCountEl.addEventListener("input", (e) => {
    const value = clampQuestionCount(
      e.target.value,
      pronounsQuestions.length,
      settings.questionCounts.pronounsQuestions
    );

    e.target.value = value;
    updateSetting(["questionCounts", "pronounsQuestions"], value);
    renderQuiz();
  });
}

if (pronounsEnabledEl) { // General pattern used: enable or disable the category (update immediately).
  pronounsEnabledEl.addEventListener("change", (e) => {
    updateSetting(["generateGroups", "pronounsQuestions"], e.target.checked);
    syncSettingsToInputs();
    renderQuiz();
  });
}

if (prepositionsCountEl) {
  prepositionsCountEl.max = prepositionsQuestions.length;

  prepositionsCountEl.addEventListener("input", (e) => {
    const value = clampQuestionCount(
      e.target.value,
      prepositionsQuestions.length,
      settings.questionCounts.prepositionsQuestions
    );

    e.target.value = value;
    updateSetting(["questionCounts", "prepositionsQuestions"], value);
    renderQuiz();
  });
}

if (prepositionsEnabledEl) {
  prepositionsEnabledEl.addEventListener("change", (e) => {
    updateSetting(["generateGroups", "prepositionsQuestions"], e.target.checked);
    syncSettingsToInputs();
    renderQuiz();
  });
}

if (demonstrativesCountEl) {
  demonstrativesCountEl.max = demonstrativesQuestions.length;

  demonstrativesCountEl.addEventListener("input", (e) => {
    const value = clampQuestionCount(
      e.target.value,
      demonstrativesQuestions.length,
      settings.questionCounts.demonstrativesQuestions
    );

    e.target.value = value;
    updateSetting(["questionCounts", "demonstrativesQuestions"], value);
    renderQuiz();
  });
}

if (demonstrativesEnabledEl) {
  demonstrativesEnabledEl.addEventListener("change", (e) => {
    updateSetting(["generateGroups", "demonstrativesQuestions"], e.target.checked);
    syncSettingsToInputs();
    renderQuiz();
  });
}

if (quantityCountEl) {
  quantityCountEl.max = quantityQuestions.length;

  quantityCountEl.addEventListener("input", (e) => {
    const value = clampQuestionCount(
      e.target.value,
      quantityQuestions.length,
      settings.questionCounts.quantityQuestions
    );

    e.target.value = value;
    updateSetting(["questionCounts", "quantityQuestions"], value);
    renderQuiz();
  });
}

if (quantityEnabledEl) {
  quantityEnabledEl.addEventListener("change", (e) => {
    updateSetting(["generateGroups", "quantityQuestions"], e.target.checked);
    syncSettingsToInputs();
    renderQuiz();
  });
}

if (restartQuestionsEl) {
  restartQuestionsEl.addEventListener("click", () => {
    syncSettingsToInputs();
    renderQuiz();
  });
}

function renderQuiz() {
  elements.questionDisplay.innerHTML = "";
  elements.quizResults.textContent = "Complete quiz for grade.";

  let questionCounter = 1;

  if (settings.generateGroups.pronounsQuestions) {
    questionCounter = generateProblems(
      pronounsQuestions,
      settings.questionCounts.pronounsQuestions,
      settings.answersPerQuestion,
      questionCounter
    );
  }

  if (settings.generateGroups.prepositionsQuestions) {
    questionCounter = generateProblems(
      prepositionsQuestions,
      settings.questionCounts.prepositionsQuestions,
      settings.answersPerQuestion,
      questionCounter
    );
  }

  if (settings.generateGroups.demonstrativesQuestions) {
    questionCounter = generateProblems(
      demonstrativesQuestions,
      settings.questionCounts.demonstrativesQuestions,
      settings.answersPerQuestion,
      questionCounter
    );
  }

  if (settings.generateGroups.quantityQuestions) {
    questionCounter = generateProblems(
      quantityQuestions,
      settings.questionCounts.quantityQuestions,
      settings.answersPerQuestion,
      questionCounter
    );
  }
}

// ----- Initial ----- //
syncSettingsToInputs();
renderQuiz();