import type { Letter } from '../types';
import { A4_WIDTH_MM, A4_HEIGHT_MM } from '../utils/constants';

export const generateGridLetters = (): Letter[] => {
  const letters: Letter[] = [];
  const rows = 4;
  const cols = 7;
  const marginX = 20;
  const marginY = 20;
  const stepX = (A4_WIDTH_MM - marginX * 2) / (cols - 1);
  const stepY = (A4_HEIGHT_MM - marginY * 2) / (rows - 1);

  let count = 0;
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZAB';

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (count < 28) {
        letters.push({
          id: count,
          char: alphabet[count] || 'A',
          x: marginX + c * stepX,
          y: marginY + r * stepY,
          fontSize: 12,
        });
        count++;
      }
    }
  }
  return letters;
};
