import type { Letter } from '../types';
import { getPageDimensions, type Orientation } from '../utils/constants';

// 5x5 pixel art patterns for each character
const PATTERNS: Record<string, number[][]> = {
  H: [
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
  ],
  E: [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
  ],
  L: [
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 1],
  ],
  O: [
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  W: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 0, 1, 1],
  ],
  R: [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 0],
    [1, 0, 1],
    [1, 0, 1],
  ],
  D: [
    [1, 1, 0],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 0],
  ],
  '!': [
    [1],
    [1],
    [1],
    [0],
    [1],
  ],
  ' ': [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ],
};

export const generateHelloWorldLetters = (orientation: Orientation = 'landscape'): Letter[] => {
  const { centerX, centerY } = getPageDimensions(orientation);
  const letters: Letter[] = [];

  const cellSize = 8; // mm per pixel
  const fontSize = 10; // pt
  const charSpacing = 1; // extra spacing between characters in cells
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let idCounter = 0;

  const generateWord = (text: string, yPosition: number) => {
    // Build the pattern for this word
    const wordPattern: number[][] = [[], [], [], [], []];

    for (const char of text) {
      const pattern = PATTERNS[char] || PATTERNS[' '];

      // Add pattern to word pattern
      for (let row = 0; row < 5; row++) {
        wordPattern[row].push(...pattern[row]);
        // Add spacing between characters
        if (char !== ' ') {
          wordPattern[row].push(...Array(charSpacing).fill(0));
        }
      }
    }

    // Calculate dimensions for this word
    const wordWidth = wordPattern[0].length * cellSize;
    const wordHeight = 5 * cellSize;
    const startX = centerX - (wordWidth / 2);

    // Generate letters from pattern
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < wordPattern[row].length; col++) {
        if (wordPattern[row][col] === 1) {
          const randomChar = alphabet[Math.floor(Math.random() * alphabet.length)];
          letters.push({
            id: idCounter++,
            char: randomChar,
            x: startX + (col * cellSize),
            y: yPosition + (row * cellSize),
            fontSize: fontSize,
          });
        }
      }
    }
  };

  // Position HELLO at top (moved higher)
  const topY = centerY / 2 - 20; // 20mm higher
  generateWord('HELLO', topY);

  // Position WORLD at bottom (moved higher)
  const bottomY = centerY + (centerY / 2) - 20; // 20mm higher
  generateWord('WORLD', bottomY);

  return letters;
};
