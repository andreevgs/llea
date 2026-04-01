export const highlightQuotedText = (text: string): string => {
  return text
    .replace(/'([^']+)'/g, "<code>$1</code>")
    .replace(/"([^"]+)"/g, "<code>$1</code>");
};
