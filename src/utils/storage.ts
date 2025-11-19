import type { Preset } from '../types';
import { STORAGE_KEY } from './constants';

export const loadPresetsFromStorage = (): Preset[] | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading presets:', error);
    return null;
  }
};

export const savePresetsToStorage = (presets: Preset[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  } catch (error) {
    console.error('Error saving presets:', error);
  }
};
