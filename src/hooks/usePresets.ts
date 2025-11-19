import { useState } from 'react';
import type { Preset, Letter, PageSettings } from '../types';
import { loadPresetsFromStorage, savePresetsToStorage } from '../utils/storage';
import { generateGridLetters } from '../generators/gridGenerator';
import { generateMacDonaldLetters } from '../generators/macDonaldGenerator';
import { DEFAULT_PAGE_SETTINGS } from '../utils/constants';

const getBuiltInPresets = (): Preset[] => [
  {
    name: 'Standard Grid',
    isBuiltIn: true,
    letters: generateGridLetters(4, 7, 'landscape'),
    pageSettings: { ...DEFAULT_PAGE_SETTINGS },
    orientation: 'landscape',
    createdAt: new Date().toISOString(),
  },
  {
    name: 'MacDonald 1',
    isBuiltIn: true,
    letters: generateMacDonaldLetters('landscape'),
    pageSettings: { ...DEFAULT_PAGE_SETTINGS },
    orientation: 'landscape',
    createdAt: new Date().toISOString(),
  },
];

export const usePresets = () => {
  const [presets, setPresets] = useState<Preset[]>(() => {
    const storedPresets = loadPresetsFromStorage();
    if (storedPresets && storedPresets.length > 0) {
      return storedPresets;
    }
    const builtInPresets = getBuiltInPresets();
    savePresetsToStorage(builtInPresets);
    return builtInPresets;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [saveError, setSaveError] = useState('');

  const savePreset = (letters: Letter[], pageSettings: PageSettings, orientation?: 'landscape' | 'portrait') => {
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
    setOrientation?: (orientation: 'landscape' | 'portrait') => void
  ) => {
    setLetters(preset.letters);
    setPageSettings(preset.pageSettings);
    setSelectedId(null);
    if (setOrientation) {
      setOrientation(preset.orientation || 'landscape');
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
