export const settings_config_defaults = {
  questionCounts: {
    pronounsQuestions: 3,
    prepositionsQuestions: 3,
    demonstrativesQuestions: 3,
    quantityQuestions: 6
  },
  answersPerQuestion: 4,
  generateGroups: {
    pronounsQuestions: true,
    prepositionsQuestions: true,
    demonstrativesQuestions: true,
    quantityQuestions: true
  }
};

export let settings = structuredClone(settings_config_defaults);

export function updateSetting(path, value) {
  let current = settings;
  for (let i = 0; i < path.length - 1; i++) {
    current = current[path[i]];
  }
  current[path[path.length - 1]] = value;
}

export function resetSettings() {
  settings = structuredClone(settings_config_defaults);
}