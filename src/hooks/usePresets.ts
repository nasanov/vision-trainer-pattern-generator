import { useState } from 'react';
import type { Preset, Letter, PageSettings } from '../types';
import { loadPresetsFromStorage, savePresetsToStorage } from '../utils/storage';
import { generateGridLetters } from '../generators/gridGenerator';
import { generateMacDonaldLetters } from '../generators/macDonaldGenerator';
import { generateHelloWorldLetters } from '../generators/helloWorldGenerator';
import { DEFAULT_PAGE_SETTINGS } from '../utils/constants';

const getBuiltInPresets = (): Preset[] => [
  {
    name: 'McDonald Form Chart',
    isBuiltIn: true,
    letters: [
      { id: 0, char: 'N', x: 69.2, y: 57, fontSize: 100 },
      { id: 1, char: 'L', x: 84.4, y: 80.5, fontSize: 66 },
      { id: 2, char: 'V', x: 96.7, y: 69, fontSize: 52 },
      { id: 3, char: 'Z', x: 111.6, y: 78.7, fontSize: 48 },
      { id: 4, char: 'K', x: 123.3, y: 89.2, fontSize: 40 },
      { id: 5, char: 'T', x: 132.4, y: 85.5, fontSize: 25 },
      { id: 6, char: 'Y', x: 227.1, y: 57.4, fontSize: 100 },
      { id: 7, char: 'N', x: 213.6, y: 81, fontSize: 66 },
      { id: 8, char: 'T', x: 198.5, y: 69.2, fontSize: 52 },
      { id: 9, char: 'K', x: 185.7, y: 78.1, fontSize: 48 },
      { id: 10, char: 'M', x: 173.4, y: 89.4, fontSize: 40 },
      { id: 11, char: 'A', x: 162.5, y: 85.7, fontSize: 25 },
      { id: 12, char: 'U', x: 68.2, y: 155.4, fontSize: 100 },
      { id: 13, char: 'T', x: 83.9, y: 132.4, fontSize: 66 },
      { id: 14, char: 'Y', x: 97.5, y: 143.9, fontSize: 52 },
      { id: 15, char: 'A', x: 114.8, y: 134.5, fontSize: 48 },
      { id: 16, char: 'F', x: 122.8, y: 122, fontSize: 40 },
      { id: 17, char: 'S', x: 132.8, y: 126.1, fontSize: 25 },
      { id: 18, char: 'K', x: 228.2, y: 156.2, fontSize: 100 },
      { id: 19, char: 'A', x: 213.6, y: 132.2, fontSize: 66 },
      { id: 20, char: 'X', x: 199.2, y: 143.9, fontSize: 52 },
      { id: 21, char: 'E', x: 185.4, y: 134.6, fontSize: 48 },
      { id: 22, char: 'N', x: 172.4, y: 122.2, fontSize: 40 },
      { id: 23, char: 'P', x: 161.9, y: 125.9, fontSize: 25 },
      { id: 24, char: 'L', x: 141.5, y: 98, fontSize: 16 },
      { id: 25, char: 'H', x: 155.5, y: 98, fontSize: 16 },
      { id: 26, char: 'Y', x: 141.5, y: 113.3, fontSize: 16 },
      { id: 27, char: 'E', x: 155.2, y: 113.1, fontSize: 16 },
    ],
    pageSettings: { ...DEFAULT_PAGE_SETTINGS },
    orientation: 'landscape',
    createdAt: new Date().toISOString(),
    gridLayout: { rows: 4, cols: 7 },
  },
  {
    name: 'Standard Grid',
    isBuiltIn: true,
    letters: generateGridLetters(4, 7, 'landscape'),
    pageSettings: { ...DEFAULT_PAGE_SETTINGS },
    orientation: 'landscape',
    createdAt: new Date().toISOString(),
    gridLayout: { rows: 4, cols: 7 },
  },
  {
    name: 'Hello World !!!',
    isBuiltIn: true,
    letters: generateHelloWorldLetters('landscape'),
    pageSettings: { ...DEFAULT_PAGE_SETTINGS },
    orientation: 'landscape',
    createdAt: new Date().toISOString(),
  },
];

export const usePresets = () => {
  const [presets, setPresets] = useState<Preset[]>(() => {
    const builtInPresets = getBuiltInPresets();
    const storedPresets = loadPresetsFromStorage();

    if (!storedPresets || storedPresets.length === 0) {
      savePresetsToStorage(builtInPresets);
      return builtInPresets;
    }

    // Merge: keep built-in presets up to date, plus user's custom presets
    const userPresets = storedPresets.filter(p => !p.isBuiltIn);
    const mergedPresets = [...builtInPresets, ...userPresets];
    savePresetsToStorage(mergedPresets);
    return mergedPresets;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [saveError, setSaveError] = useState('');

  const savePreset = (
    letters: Letter[],
    pageSettings: PageSettings,
    orientation?: 'landscape' | 'portrait',
    gridLayout?: { rows: number; cols: number }
  ) => {
    const trimmedName = newPresetName.trim();

    if (!trimmedName) {
      setSaveError('Preset name cannot be empty');
      return;
    }

    const duplicate = presets.find(
      (p) => p.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (duplicate) {
      setSaveError('A preset with this name already exists');
      return;
    }

    const newPreset: Preset = {
      name: trimmedName,
      isBuiltIn: false,
      letters: [...letters],
      pageSettings: { ...pageSettings },
      orientation: orientation || 'landscape',
      createdAt: new Date().toISOString(),
      ...(gridLayout && { gridLayout }),
    };

    const updatedPresets = [...presets, newPreset];
    setPresets(updatedPresets);
    savePresetsToStorage(updatedPresets);

    setIsSaving(false);
    setNewPresetName('');
    setSaveError('');
  };

  const deletePreset = (presetName: string) => {
    const updatedPresets = presets.filter((p) => p.name !== presetName);
    setPresets(updatedPresets);
    savePresetsToStorage(updatedPresets);
  };

  const loadPreset = (
    preset: Preset,
    setLetters: (letters: Letter[]) => void,
    setPageSettings: (settings: PageSettings) => void,
    setSelectedId: (id: number | null) => void,
    setOrientation?: (orientation: 'landscape' | 'portrait') => void,
    setGridRows?: (rows: number) => void,
    setGridCols?: (cols: number) => void
  ) => {
    setLetters(preset.letters);
    setPageSettings(preset.pageSettings);
    setSelectedId(null);
    if (setOrientation) {
      setOrientation(preset.orientation || 'landscape');
    }
    // Update grid dimensions if available, otherwise keep current values
    if (setGridRows && setGridCols) {
      if (preset.gridLayout) {
        setGridRows(preset.gridLayout.rows);
        setGridCols(preset.gridLayout.cols);
      }
      // Note: We don't clear grid dimensions for custom layouts
      // This allows users to still use grid controls after loading a custom preset
    }
  };

  return {
    presets,
    isSaving,
    setIsSaving,
    newPresetName,
    setNewPresetName,
    saveError,
    setSaveError,
    savePreset,
    deletePreset,
    loadPreset,
  };
};
