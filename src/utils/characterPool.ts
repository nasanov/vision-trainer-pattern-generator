import type { Letter } from '../types';

export const getCharacterPool = (includeNumbers: boolean): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  return includeNumbers ? letters + numbers : letters;
};

export const regeneratePattern = (
  currentLetters: Letter[],
  includeNumbers: boolean,
  allowDuplicates: boolean
): Letter[] | null => {
  const characterPool = getCharacterPool(includeNumbers);

  if (allowDuplicates) {
    // Simple random selection with duplicates allowed
    return currentLetters.map((letter) => {
      const randomChar = characterPool[Math.floor(Math.random() * characterPool.length)];
      return {
        ...letter,
        char: randomChar,
      };
    });
  } else {
    // No duplicates - need to ensure we have enough unique characters
    if (characterPool.length < currentLetters.length) {
      return null; // Not enough characters
    }

    // Shuffle the character pool and take first N characters
    const shuffledPool = characterPool.split('');
    for (let i = shuffledPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledPool[i], shuffledPool[j]] = [shuffledPool[j], shuffledPool[i]];
    }

    return currentLetters.map((letter, index) => {
      return {
        ...letter,
        char: shuffledPool[index],
      };
    });
  }
};
