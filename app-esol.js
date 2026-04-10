import {
  pronounsQuestions, prepositionsQuestions, demonstrativesQuestions, quantityQuestions, bestFitQuestions, typeQuestions
} from "./questions_file.js";

import {
  settings,
  updateSetting
} from "./esol_settings_file.js";

window.quizSubmissionData = []; // Submission for quiz to Formspree.

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
function openLightbox(src, alt = "") { // Open the interacted with image, enlarge in the middle of the screen.
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

function numToAlph(num) { // Converts index num to letter.
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

function ensureNoRepeatsRandomInt(trackingArray, max) {
  const available = [];
  for (let i = 0; i <= max; i++) {
    if (!trackingArray.includes(i)) available.push(i);
  }

  if (available.length === 0) {
    throw new Error("No more unique values available.");
  }

  return available[getRandomInt(0, available.length - 1)];
}

function convertItemToStringOrArray(item) {
  if (Array.isArray(item)) return item;
  return [String(item)];
}

function syncSettingsToInputs() {
  if (pronounsEnabledEl) {
    pronounsEnabledEl.checked = settings.generateGroups.pronounsQuestions;
  }
  if (pronounsCountEl) {
    pronounsCountEl.value = settings.questionCounts.pronounsQuestions;
    pronounsCountEl.disabled = !settings.generateGroups.pronounsQuestions;
  }
// ----------------------- //

  if (prepositionsEnabledEl) {
    prepositionsEnabledEl.checked = settings.generateGroups.prepositionsQuestions;
  }
  if (prepositionsCountEl) {
    prepositionsCountEl.value = settings.questionCounts.prepositionsQuestions;
    prepositionsCountEl.disabled = !settings.generateGroups.prepositionsQuestions;
  }
// ----------------------- //

  if (demonstrativesEnabledEl) {
    demonstrativesEnabledEl.checked = settings.generateGroups.demonstrativesQuestions;
  }
  if (demonstrativesCountEl) {
    demonstrativesCountEl.value = settings.questionCounts.demonstrativesQuestions;
    demonstrativesCountEl.disabled = !settings.generateGroups.demonstrativesQuestions;
  }
// ----------------------- //

  if (quantityEnabledEl) {
    quantityEnabledEl.checked = settings.generateGroups.quantityQuestions;
  }
  if (quantityCountEl) {
    quantityCountEl.value = settings.questionCounts.quantityQuestions;
    quantityCountEl.disabled = !settings.generateGroups.quantityQuestions;
  }
// ----------------------- //

  if (bestFitEnabledEl) {
    bestFitEnabledEl.checked = settings.generateGroups.bestFitQuestions;
  }
  if (bestFitCountEl) {
    bestFitCountEl.value = settings.questionCounts.bestFitQuestions;
    bestFitCountEl.disabled = !settings.generateGroups.bestFitQuestions;
  }
  // ----------------------- //

  if (typeQuestionsEnabledEl) {
  typeQuestionsEnabledEl.checked = settings.generateGroups.typeQuestions;
  }
  if (typeQuestionsCountEl) {
    typeQuestionsCountEl.value = settings.questionCounts.typeQuestions;
    typeQuestionsCountEl.disabled = !settings.generateGroups.typeQuestions;
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

function getQuestionMeta(questionRow) {
  return questionRow[4] || {};
}

function getAnswerMode(questionRow) {
  return getQuestionMeta(questionRow).answerMode || "text-mc";
}

function normalizeOption(option) { // Converts to a simple object, making it predicable for later uses.
  if (typeof option === "object" && option !== null) {
    return {
      type: option.type || "text",
      value: String(option.value ?? "").trim(),
      src: option.src || "",
      alt: option.alt || String(option.value ?? "")
    };
  }

  return { // 'default' if metadata doesn't exist. keeps structure consistent.
    type: "text",
    value: String(option).trim(),
    src: "",
    alt: String(option)
  };
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

    const questionNumber = startIndex + i - 1; // Question counter, starts at 1.
    const questionRow = arrayBank[indexRowForBank];
    const questionText = questionRow[0];
    const imageLocation = questionRow[3];
    const meta = getQuestionMeta(questionRow); // metadata for object, defaults to {}.
    const answerMode = getAnswerMode(questionRow); // mode to use, defaults to "text-mc" (text multiple choice).

    let correctAnswers = convertItemToStringOrArray(questionRow[1]);
    const normalizedCorrectOptions = correctAnswers.map(normalizeOption);

    let incorrectAnswers = (questionRow[2] || []) // falls back to empty array if questionRow[2] doesn't exist doesn't exist.
      .flat(1)
      .filter(item => { // normalize (lower case, make to a predictable object), filter out answers from all possible answers.
        const normalizedItem = normalizeOption(item).value.toLowerCase();
        return !normalizedCorrectOptions.some(correct => correct.value.toLowerCase() === normalizedItem);
      });

    const indexForAnswer = getRandomInt(1, Math.max(1, answersToGenerate));
    const isCapitalized = shouldCapitalizeBlank(questionText);

    const questionEl = document.createElement("div");
    questionEl.className = "question-block";
    questionEl.dataset.correct = JSON.stringify(correctAnswers);
    questionEl.dataset.answerMode = answerMode;
    questionEl.dataset.questionNumber = questionNumber;

    if (imageLocation) { // add light box click to open if image exists.
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

    if (answerMode === "text-input") {
      const inputWrap = document.createElement("div");
      inputWrap.className = "text-input-answer-wrap";

      const input = document.createElement("input");
      input.type = "text";
      
      input.className = "text-input-answer";
      input.placeholder = meta.placeholder || "Type your answer..."; // Use the placeholder in the questions_file, defaults to OR option.

      inputWrap.appendChild(input);
      questionEl.appendChild(inputWrap);
    } else {
      const answersEl = document.createElement("ul");
      answersEl.className = answerMode === "image-mc" ? "answers-list image-answers-list" : "answers-list"; // CSS class determination (mode).

      for (let j = 1; j <= answersToGenerate; j++) {
        const li = document.createElement("li");
        let answerOption;

        if (j !== indexForAnswer) { // incorrect answer index.
          const randomIndex = ensureNoRepeatsRandomInt(trackIncorrectRepeats, incorrectAnswers.length - 1);
          trackIncorrectRepeats.push(randomIndex);
          answerOption = normalizeOption(incorrectAnswers[randomIndex]);
        } else { // correct answer index.
          const pickRandomFromPool = getRandomInt(0, normalizedCorrectOptions.length - 1);
          answerOption = normalizedCorrectOptions[pickRandomFromPool];
        }

        let displayValue = answerOption.value;
        if (isCapitalized && answerOption.type === "text") {
          displayValue = capitalizeFirstLetter(displayValue);
        }
        //! ᴡᴀʀɴɪɴɢ: A lot of this is messy element stuff and could probably be made into separate functions but I was having dev issues so I just
        //! threw them all together to test quickly.
        const label = document.createElement("label");
        label.className = answerMode === "image-mc" ? "answer-option image-answer-option" : "answer-option"; // Mode determination for display.

        const input = document.createElement("input");
        input.type = "radio";
        input.name = `question-${questionNumber}`;   // group radios by question.
        input.value = answerOption.value;

        label.appendChild(input);

        if (answerMode === "image-mc") {
          const img = document.createElement("img");
          img.src = answerOption.src;
          img.alt = answerOption.alt || answerOption.value;
          img.className = "answer-image";

          img.addEventListener("click", (e) => {
            if (e.target === img) {
              openLightbox(img.src, img.alt);
            }
          });

          const caption = document.createElement("span");
          caption.textContent = `${numToAlph(j)}.`;

          label.appendChild(caption);
          label.appendChild(img);
        } else {
          const span = document.createElement("span");
          span.textContent = `${numToAlph(j)}. ${displayValue}`;
          label.appendChild(span);
        }

        li.appendChild(label);
        answersEl.appendChild(li);
      }

      questionEl.appendChild(answersEl);
    }

    const feedbackEl = document.createElement("div");
    feedbackEl.className = "question-feedback"; // Informs the user if right or wrong, real answer provided.
    questionEl.appendChild(feedbackEl);

    elements.questionDisplay.appendChild(questionEl);
  }

  return startIndex + questionsToGenerate;
}

function checkAnswers() {
  const questionBlocks = document.querySelectorAll(".question-block");
  let score = 0;
  const submissionData = [];

  questionBlocks.forEach(block => {
    const correctAnswers = JSON.parse(block.dataset.correct);
    const normalizedCorrectAnswers = correctAnswers.map(answer =>
      normalizeAnswer(typeof answer === "object" ? answer.value : answer)
    );

    const answerMode = block.dataset.answerMode || "text-mc";
    const feedbackEl = block.querySelector(".question-feedback");
    const questionText = block.querySelector("p strong")?.textContent || "Question";

    block.classList.remove("correct", "incorrect", "unanswered");

    let userAnswer = "";
    let isAnswered = false;
    let isCorrect = false;

    if (answerMode === "text-input") {
      const input = block.querySelector('input[type="text"]');

      if (!input || !input.value.trim()) {
        block.classList.add("unanswered");
        feedbackEl.textContent = "No answer entered. Type an answer and re-submit.";

        submissionData.push({
          question: questionText,
          studentAnswer: "(blank)",
          correctAnswer: correctAnswers.map(answer =>
            typeof answer === "object" && answer !== null ? answer.value : answer
          ).join(" / "),
          isCorrect: false
        });
        return;
      }

      userAnswer = input.value.trim();
      isAnswered = true;
    } else {
      const selected = block.querySelector('input[type="radio"]:checked');

      if (!selected) {
        block.classList.add("unanswered");
        feedbackEl.textContent = "No answer selected. Select an answer and re-submit.";

        submissionData.push({
          question: questionText,
          studentAnswer: "(no selection)",
          correctAnswer: correctAnswers.map(answer =>
            typeof answer === "object" && answer !== null ? answer.value : answer
          ).join(" / "),
          isCorrect: false
        });
        return;
      }

      userAnswer = selected.value.trim();
      isAnswered = true;
    }

    isCorrect = normalizedCorrectAnswers.includes(normalizeAnswer(userAnswer));

    const displayCorrectAnswers = correctAnswers.map(answer => {
      if (typeof answer === "object" && answer !== null) {
        return answer.value;
      }
      return answer;
    });

    if (isCorrect) {
      score++;
      block.classList.add("correct");
      feedbackEl.textContent = "Correct!";
    } else {
      block.classList.add("incorrect");
      feedbackEl.textContent = `Incorrect. Correct answer: ${displayCorrectAnswers.join(" / ")}`;
    }

    submissionData.push({
      question: questionText,
      studentAnswer: isAnswered ? userAnswer : "(blank)",
      correctAnswer: displayCorrectAnswers.join(" / "),
      isCorrect
    });
  });

  window.quizSubmissionData = submissionData;
  elements.quizResults.textContent = `You got ${score} out of ${questionBlocks.length} correct.`;
}

window.checkAnswers = checkAnswers;

elements.submitAnswers.addEventListener("click", checkAnswers);

const pronounsCountEl = $("input-settings-personal-pronouns");
const pronounsEnabledEl = $("checkbox-settings-personal-pronouns");

const prepositionsCountEl = $("input-settings-prepositions");
const prepositionsEnabledEl = $("checkbox-settings-prepositions");

const demonstrativesCountEl = $("input-settings-demonstratives");
const demonstrativesEnabledEl = $("checkbox-settings-demonstratives");

const quantityCountEl = $("input-settings-quantity");
const quantityEnabledEl = $("checkbox-settings-quantity");

const bestFitCountEl = $("input-settings-bestFit");
const bestFitEnabledEl = $("checkbox-settings-bestFit");

const typeQuestionsCountEl = $("input-settings-typeQuestions");
const typeQuestionsEnabledEl = $("checkbox-settings-typeQuestions");

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

if (typeQuestionsCountEl) {
  typeQuestionsCountEl.max = typeQuestions.length;

  typeQuestionsCountEl.addEventListener("input", (e) => {
    const value = clampQuestionCount(
      e.target.value,
      typeQuestions.length,
      settings.questionCounts.typeQuestions
    );

    e.target.value = value;
    updateSetting(["questionCounts", "typeQuestions"], value);
    renderQuiz();
  });
}

if (typeQuestionsEnabledEl) {
  typeQuestionsEnabledEl.addEventListener("change", (e) => {
    updateSetting(["generateGroups", "typeQuestions"], e.target.checked);
    syncSettingsToInputs();
    renderQuiz();
  });
}

if (bestFitCountEl) {
  bestFitCountEl.max = bestFitQuestions.length;

  bestFitCountEl.addEventListener("input", (e) => {
    const value = clampQuestionCount(
      e.target.value,
      bestFitQuestions.length,
      settings.questionCounts.bestFitQuestions
    );

    e.target.value = value;
    updateSetting(["questionCounts", "bestFitQuestions"], value);
    renderQuiz();
  });
}

if (bestFitEnabledEl) {
  bestFitEnabledEl.addEventListener("change", (e) => {
    updateSetting(["generateGroups", "bestFitQuestions"], e.target.checked);
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
  elements.quizResults.textContent = "Complete quiz for grade."; // will get replaced later on w/ "correct/all".

  let questionCounter = 1;
  // generates the following if enabled...
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

  if (settings.generateGroups.bestFitQuestions) {
    questionCounter = generateProblems(
      bestFitQuestions,
      settings.questionCounts.bestFitQuestions,
      settings.answersPerQuestion,
      questionCounter
    );
  }

  if (settings.generateGroups.typeQuestions) {
    questionCounter = generateProblems(
      typeQuestions,
      settings.questionCounts.typeQuestions,
      settings.answersPerQuestion,
      questionCounter
    );
  }
}

function main(){
  syncSettingsToInputs();
  renderQuiz();
}

// ----- Initialize ----- //
main();