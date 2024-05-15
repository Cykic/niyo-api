export const prettify = (phrase: string) => {
  return phrase.replace(/_/g, ' ');
};

export function ucfirst(phrase: string) {
  const firstLetter = phrase.substring(0, 1);
  return firstLetter.toUpperCase() + phrase.substring(1);
}
