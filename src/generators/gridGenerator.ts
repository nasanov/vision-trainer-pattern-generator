import type { Letter } from '../types';
import { A4_WIDTH_MM, A4_HEIGHT_MM } from '../utils/constants';

export const generateGridLetters = (rows: number = 4, cols: number = 7): Letter[] => {
  const letters: Letter[] = [];
  const marginX = 20;
  const marginY = 20;
  const stepX = cols > 1 ? (A4_WIDTH_MM - marginX * 2) / (cols - 1) : 0;
  const stepY = rows > 1 ? (A4_HEIGHT_MM - marginY * 2) / (rows - 1) : 0;

  let count = 0;
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      letters.push({
        id: count,
        char: alphabet[count % alphabet.length] || 'A',
        x: marginX + c * stepX,
        y: marginY + r * stepY,
        fontSize: 12,
      });
      count++;
    }
  }
  return letters;
};
