export const getGrammaticalAnalysisPrompt = (
  initialData: string,
  currentLanguage: string,
  targetLanguage: string,
): string => {
  const currentLanguageUppercased = currentLanguage.toUpperCase();
  const targetLanguageUppercased = targetLanguage.toUpperCase();
  return `initial data: ${initialData}
task: make a detailed explanation of each sentence of the provided text in terms of grammar rules
task language: ${targetLanguageUppercased}
response language: ${currentLanguageUppercased}
format: JSON with following structure - array of objects with properties "sentence", "translation", "mistakes", "correctedSentence". Value of "mistakes" is array of objects with properties "type" (string, type of grammar mistake, language of value - ${currentLanguageUppercased}), "mistake" (string, explanation of mistake and guide how to resolve it, language of value - ${currentLanguageUppercased}). If there are no mistakes, value of "mistakes" must be an empty array.`;
};

export const getGrammaticalEstimationPrompt = (
  initialData: string,
  currentLanguage: string,
): string => {
  const currentLanguageUppercased = currentLanguage.toUpperCase();
  return `initial data: ${initialData}
task: estimate grammar level of provided text on a scale from 0 to 100
task language: ${currentLanguageUppercased}
format: JSON with property "estimation" (number, grammar level assessment on a scale from 0 to 100).`;
};

export const getDictionaryCreationPrompt = (
  initialData: string,
  currentLanguage: string,
  targetLanguage: string,
): string => {
  const currentLanguageUppercased = currentLanguage.toUpperCase();
  const targetLanguageUppercased = targetLanguage.toUpperCase();
  return `initial data: ${initialData}
task: make ${targetLanguageUppercased}-${currentLanguageUppercased} dictionary for initial data
format: JSON with following structure - array of objects with properties "word", "pronunciation", "translate". "pronunciation" should contain explanation for ${currentLanguageUppercased} language natives how to pronounce word in ${targetLanguageUppercased} language using ${currentLanguageUppercased} alphabet
`;
};
