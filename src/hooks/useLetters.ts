import { useState } from 'react';
import type { Letter } from '../types';
import { regeneratePattern } from '../utils/characterPool';

export const useLetters = (initialGenerator: () => Letter[]) => {
  const [letters, setLetters] = useState<Letter[]>(initialGenerator);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const updateLetter = (id: number, field: keyof Letter, value: string | number) => {
    setLetters((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  const regenerate = (includeNumbers: boolean, allowDuplicates: boolean) => {
    const regenerated = regeneratePattern(letters, includeNumbers, allowDuplicates);

    if (regenerated === null) {
      alert(
        `Cannot generate ${letters.length} unique characters. Pool only has ${
          includeNumbers ? 36 : 26
        } characters. Please enable "Allow Duplicates" or "Include Numbers".`
      );
      return;
    }

    setLetters(regenerated);
    setSelectedId(null);
  };

  const selectedLetter = letters.find((l) => l.id === selectedId);

  return {
    letters,
    setLetters,
    selectedId,
    setSelectedId,
    updateLetter,
    regenerate,
    selectedLetter,
  };
};
