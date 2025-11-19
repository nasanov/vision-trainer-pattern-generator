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
  gridRows: number;
  onGridRowsChange: (rows: number) => void;
  gridCols: number;
  onGridColsChange: (cols: number) => void;
  onApplyGridSize: () => void;
  totalLetters: number;
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
  gridRows,
  onGridRowsChange,
  gridCols,
  onGridColsChange,
  onApplyGridSize,
  totalLetters,
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

        {/* Grid Layout */}
        <div className="mt-4 pt-3 border-t border-gray-300">
          <label className="block text-xs font-medium text-gray-500 mb-2">
            Grid Layout
          </label>
          <div className="grid grid-cols-2 gap-3 mb-2">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Rows</label>
              <input
                type="number"
                min="1"
                max="20"
                value={gridRows === 0 ? '' : gridRows}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '') {
                    onGridRowsChange(0);
                  } else {
                    const num = parseInt(val);
                    onGridRowsChange(Math.min(20, Math.max(1, num || 0)));
                  }
                }}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Columns</label>
              <input
                type="number"
                min="1"
                max="30"
                value={gridCols === 0 ? '' : gridCols}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '') {
                    onGridColsChange(0);
                  } else {
                    const num = parseInt(val);
                    onGridColsChange(Math.min(30, Math.max(1, num || 0)));
                  }
                }}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">
              Total: <strong>{gridRows > 0 && gridCols > 0 ? gridRows * gridCols : '—'}</strong> letters
            </span>
            <span className="text-xs text-gray-400">
              Current: {totalLetters}
            </span>
          </div>
          <button
            onClick={onApplyGridSize}
            disabled={gridRows < 1 || gridCols < 1 || gridRows > 20 || gridCols > 30}
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply Grid Size
          </button>
        </div>
      </div>
    </div>
  );
};
