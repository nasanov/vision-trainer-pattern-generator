import type { Letter } from '../types';
import { CENTER_X, CENTER_Y } from '../utils/constants';

export const generateMacDonaldLetters = (): Letter[] => {
  const letters: Letter[] = [];
  let idCounter = 0;

  // Helper to mirror coordinates for the 4 quadrants
  const addDiagonal = (chars: string[], qx: number, qy: number) => {
    const steps = [
      { dX: 110, dY: 75, size: 90 }, // Outer-most
      { dX: 85, dY: 55, size: 65 },
      { dX: 65, dY: 40, size: 48 },
      { dX: 48, dY: 28, size: 36 },
      { dX: 35, dY: 18, size: 24 },
      { dX: 24, dY: 10, size: 16 }, // Inner-most of diagonal
    ];

    chars.forEach((char, index) => {
      if (index < steps.length) {
        letters.push({
          id: idCounter++,
          char: char,
          x: CENTER_X + steps[index].dX * qx,
          y: CENTER_Y + steps[index].dY * qy,
          fontSize: steps[index].size,
        });
      }
    });
  };

  addDiagonal(['N', 'L', 'V', 'Z', 'K', 'T'], -1, -1);
  addDiagonal(['Y', 'N', 'T', 'K', 'M', 'A'], 1, -1);
  addDiagonal(['U', 'T', 'Y', 'A', 'F', 'S'], -1, 1);
  addDiagonal(['K', 'A', 'X', 'E', 'N', 'P'], 1, 1);

  const centerOffset = 7;
  const centerSize = 14;

  const centerChars = [
    { char: 'L', x: -1, y: -1 },
    { char: 'H', x: 1, y: -1 },
    { char: 'Y', x: -1, y: 1 },
    { char: 'E', x: 1, y: 1 },
  ];

  centerChars.forEach((c) => {
    letters.push({
      id: idCounter++,
      char: c.char,
      x: CENTER_X + centerOffset * c.x,
      y: CENTER_Y + centerOffset * c.y,
      fontSize: centerSize,
    });
  });

  return letters;
};
