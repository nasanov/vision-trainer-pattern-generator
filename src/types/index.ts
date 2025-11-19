export type Letter = {
  id: number;
  char: string;
  x: number;
  y: number;
  fontSize: number;
};

export type PageSettings = {
  bgColor: string;
  textColor: string;
  fontFamily: string;
};

export type Preset = {
  name: string;
  isBuiltIn: boolean;
  letters: Letter[];
  pageSettings: PageSettings;
  orientation?: 'landscape' | 'portrait';
  createdAt: string;
  gridLayout?: {
    rows: number;
    cols: number;
  };
};

export type FontFamilyOption = {
  value: string;
  label: string;
};
