export const countLetters = (text: string): number =>
  text.replace(/[^\p{L}\p{N}]/gu, "").length;

export const countWords = (text: string): number =>
  text.trim() ? text.trim().split(/\s+/).length : 0;

export const countSentences = (text: string): number =>
  text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
