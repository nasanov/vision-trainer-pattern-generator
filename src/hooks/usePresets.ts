import { useState } from 'react';
import type { Preset, Letter, PageSettings } from '../types';
import { loadPresetsFromStorage, savePresetsToStorage } from '../utils/storage';
import { generateGridLetters } from '../generators/gridGenerator';
import { generateMacDonaldLetters } from '../generators/macDonaldGenerator';
import { generateHelloWorldLetters } from '../generators/helloWorldGenerator';
import { DEFAULT_PAGE_SETTINGS } from '../utils/constants';

const getBuiltInPresets = (): Preset[] => [
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
    name: 'MacDonald 1',
    isBuiltIn: true,
    letters: generateMacDonaldLetters('landscape'),
    pageSettings: { ...DEFAULT_PAGE_SETTINGS },
    orientation: 'landscape',
    createdAt: new Date().toISOString(),
    gridLayout: { rows: 4, cols: 7 },
  },
  {
    name: 'MacDonald',
    isBuiltIn: true,
    letters: [
      { id: 0, char: 'N', x: 35.8, y: 35.8, fontSize: 120 },
      { id: 1, char: 'L', x: 50.8, y: 64.6, fontSize: 90 },
      { id: 2, char: 'V', x: 69, y: 47.5, fontSize: 80 },
      { id: 3, char: 'Z', x: 88.3, y: 64.6, fontSize: 76 },
      { id: 4, char: 'K', x: 109.3, y: 79.9, fontSize: 64 },
      { id: 5, char: 'T', x: 128.7, y: 75.4, fontSize: 52 },
      { id: 6, char: 'Y', x: 259.6, y: 35.8, fontSize: 120 },
      { id: 7, char: 'N', x: 245.9, y: 63.5, fontSize: 90 },
      { id: 8, char: 'T', x: 225.7, y: 48.1, fontSize: 80 },
      { id: 9, char: 'K', x: 208.7, y: 65.4, fontSize: 76 },
      { id: 10, char: 'M', x: 188, y: 79.9, fontSize: 64 },
      { id: 11, char: 'A', x: 168.6, y: 74.9, fontSize: 52 },
      { id: 12, char: 'U', x: 36.1, y: 174.4, fontSize: 120 },
      { id: 13, char: 'T', x: 51.1, y: 146, fontSize: 90 },
      { id: 14, char: 'Y', x: 68.4, y: 161.7, fontSize: 80 },
      { id: 15, char: 'A', x: 88.1, y: 135.1, fontSize: 76 },
      { id: 16, char: 'F', x: 109, y: 120.1, fontSize: 64 },
      { id: 17, char: 'S', x: 128.8, y: 124.8, fontSize: 52 },
      { id: 18, char: 'K', x: 258.7, y: 175.3, fontSize: 120 },
      { id: 19, char: 'A', x: 247, y: 146.7, fontSize: 90 },
      { id: 20, char: 'X', x: 224.9, y: 161.7, fontSize: 80 },
      { id: 21, char: 'E', x: 208.7, y: 135.1, fontSize: 76 },
      { id: 22, char: 'N', x: 187.7, y: 119.8, fontSize: 64 },
      { id: 23, char: 'P', x: 168.3, y: 125.1, fontSize: 52 },
      { id: 24, char: 'L', x: 141.5, y: 98, fontSize: 20 },
      { id: 25, char: 'H', x: 155.5, y: 98, fontSize: 20 },
      { id: 26, char: 'Y', x: 141.5, y: 112, fontSize: 21 },
      { id: 27, char: 'E', x: 155.5, y: 112, fontSize: 20 },
    ],
    pageSettings: { ...DEFAULT_PAGE_SETTINGS },
    orientation: 'landscape',
    createdAt: new Date().toISOString(),
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
