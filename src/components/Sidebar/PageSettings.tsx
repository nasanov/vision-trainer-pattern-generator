import { Settings } from 'lucide-react';
import type { PageSettings as PageSettingsType } from '../../types';
import { FONT_FAMILIES } from '../../utils/constants';

type PageSettingsProps = {
  pageSettings: PageSettingsType;
  onUpdatePageSetting: (key: keyof PageSettingsType, value: string) => void;
  showFixation: boolean;
  onToggleFixation: (checked: boolean) => void;
  includeNumbers: boolean;
  onToggleNumbers: (checked: boolean) => void;
  allowDuplicates: boolean;
  onToggleDuplicates: (checked: boolean) => void;
};

export const PageSettings = ({
  pageSettings,
  onUpdatePageSetting,
  showFixation,
  onToggleFixation,
  includeNumbers,
  onToggleNumbers,
  allowDuplicates,
  onToggleDuplicates,
}: PageSettingsProps) => {
  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
      <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
        <Settings size={16} className="text-gray-500" />
        Page Settings
      </h2>
      <div className="space-y-3">
        {/* Colors */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Background
            </label>
            <div className="flex items-center gap-2 bg-white p-1 border border-gray-300 rounded-md">
              <input
                type="color"
                value={pageSettings.bgColor}
                onChange={(e) => onUpdatePageSetting('bgColor', e.target.value)}
                className="w-6 h-6 rounded cursor-pointer border-none p-0"
              />
              <span className="text-xs font-mono text-gray-600">
                {pageSettings.bgColor}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Text Color
            </label>
            <div className="flex items-center gap-2 bg-white p-1 border border-gray-300 rounded-md">
              <input
                type="color"
                value={pageSettings.textColor}
                onChange={(e) => onUpdatePageSetting('textColor', e.target.value)}
                className="w-6 h-6 rounded cursor-pointer border-none p-0"
              />
              <span className="text-xs font-mono text-gray-600">
                {pageSettings.textColor}
              </span>
            </div>
          </div>
        </div>

        {/* Font Family */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Font Family
          </label>
          <select
            value={pageSettings.fontFamily}
            onChange={(e) => onUpdatePageSetting('fontFamily', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white"
          >
            {FONT_FAMILIES.map((font) => (
              <option key={font.value} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>
        </div>

        {/* Center Fixation Point */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="fixation-toggle"
            checked={showFixation}
            onChange={(e) => onToggleFixation(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
          />
          <label
            htmlFor="fixation-toggle"
            className="text-xs font-medium text-gray-500 cursor-pointer"
          >
            Center Fixation Point
          </label>
        </div>

        {/* Include Numbers Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="numbers-toggle"
            checked={includeNumbers}
            onChange={(e) => onToggleNumbers(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
          />
          <label
            htmlFor="numbers-toggle"
            className="text-xs font-medium text-gray-500 cursor-pointer"
          >
            Include Numbers
          </label>
        </div>

        {/* Allow Duplicates Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="duplicates-toggle"
            checked={allowDuplicates}
            onChange={(e) => onToggleDuplicates(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
          />
          <label
            htmlFor="duplicates-toggle"
            className="text-xs font-medium text-gray-500 cursor-pointer"
          >
            Allow Duplicates
          </label>
        </div>
      </div>
    </div>
  );
};
