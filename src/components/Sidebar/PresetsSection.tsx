import { LayoutTemplate, X } from 'lucide-react';
import type { Preset } from '../../types';

type PresetsSectionProps = {
  presets: Preset[];
  onLoadPreset: (preset: Preset) => void;
  isSaving: boolean;
  onStartSaving: () => void;
  onCancelSaving: () => void;
  newPresetName: string;
  onNameChange: (name: string) => void;
  saveError: string;
  onSavePreset: () => void;
  onDeletePreset: (name: string) => void;
  onClearError: () => void;
};

export const PresetsSection = ({
  presets,
  onLoadPreset,
  isSaving,
  onStartSaving,
  onCancelSaving,
  newPresetName,
  onNameChange,
  saveError,
  onSavePreset,
  onDeletePreset,
  onClearError,
}: PresetsSectionProps) => {
  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
      <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
        <LayoutTemplate size={16} className="text-gray-500" />
        Presets
      </h2>

      <div className="space-y-3">
        {/* Save Current Layout Button or Input Form */}
        {!isSaving ? (
          <button
            onClick={onStartSaving}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            + Save Current Layout
          </button>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              value={newPresetName}
              onChange={(e) => {
                onNameChange(e.target.value);
                onClearError();
              }}
              placeholder="Enter preset name..."
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              autoFocus
            />
            {saveError && <p className="text-xs text-red-600">{saveError}</p>}
            <div className="flex gap-2">
              <button
                onClick={onSavePreset}
                className="flex-1 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Save
              </button>
              <button
                onClick={onCancelSaving}
                className="flex-1 px-3 py-1.5 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Preset List */}
        <div className="grid grid-cols-1 gap-2">
          {presets.map((preset) => (
            <div key={preset.name} className="relative group">
              <button
                onClick={() => onLoadPreset(preset)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:border-blue-400 hover:text-blue-600 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-2">
                  {!preset.isBuiltIn && <span>🌟</span>}
                  <span className="font-medium">{preset.name}</span>
                </div>
                {preset.isBuiltIn && preset.name === 'MacDonald 1' && (
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded group-hover:bg-blue-50 group-hover:text-blue-600">
                    X-Pattern
                  </span>
                )}
                {preset.isBuiltIn && preset.name === 'Standard Grid' && (
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded group-hover:bg-blue-50 group-hover:text-blue-600">
                    4x7
                  </span>
                )}
              </button>

              {/* Delete button - only for custom presets, shown on hover */}
              {!preset.isBuiltIn && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePreset(preset.name);
                  }}
                  className="absolute top-1/2 -translate-y-1/2 right-2 p-1.5 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Delete preset"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
