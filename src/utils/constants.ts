import type { PageSettings, FontFamilyOption } from '../types';

// A4 Landscape dimensions
export const A4_WIDTH_MM = 297;
export const A4_HEIGHT_MM = 210;

// A4 Portrait dimensions
export const A4_PORTRAIT_WIDTH_MM = 210;
export const A4_PORTRAIT_HEIGHT_MM = 297;

export const CENTER_X = A4_WIDTH_MM / 2;
export const CENTER_Y = A4_HEIGHT_MM / 2;
export const STORAGE_KEY = 'visionTrainerPresets';

export type Orientation = 'landscape' | 'portrait';

export const getPageDimensions = (orientation: Orientation) => {
  if (orientation === 'portrait') {
    return {
      width: A4_PORTRAIT_WIDTH_MM,
      height: A4_PORTRAIT_HEIGHT_MM,
      centerX: A4_PORTRAIT_WIDTH_MM / 2,
      centerY: A4_PORTRAIT_HEIGHT_MM / 2,
    };
  }
  return {
    width: A4_WIDTH_MM,
    height: A4_HEIGHT_MM,
    centerX: A4_WIDTH_MM / 2,
    centerY: A4_HEIGHT_MM / 2,
  };
};

export const DEFAULT_PAGE_SETTINGS: PageSettings = {
  bgColor: '#FFFFFF',
  textColor: '#000000',
  fontFamily: 'Arial, Helvetica, sans-serif',
};

export const FONT_FAMILIES: FontFamilyOption[] = [
  { value: 'Arial, Helvetica, sans-serif', label: 'Sans Serif (Clean)' },
  { value: "'Times New Roman', Times, serif", label: 'Serif (Classic)' },
  { value: "'Courier New', Courier, monospace", label: 'Monospace (Technical)' },
];
