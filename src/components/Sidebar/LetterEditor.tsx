import { Move, Type } from 'lucide-react';
import type { Letter } from '../../types';

type LetterEditorProps = {
  selectedLetter: Letter | undefined;
  onUpdateLetter: (id: number, field: keyof Letter, value: string | number) => void;
};

export const LetterEditor = ({ selectedLetter, onUpdateLetter }: LetterEditorProps) => {
  return (
    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
      <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Move size={18} className="text-blue-600" />
        Editor
      </h2>

      {selectedLetter ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Selected ID: {selectedLetter.id + 1}
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Character
            </label>
            <input
              type="text"
              maxLength={1}
              value={selectedLetter.char}
              onChange={(e) =>
                onUpdateLetter(selectedLetter.id, 'char', e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md text-center font-bold text-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                X (mm)
              </label>
              <input
                type="number"
                value={selectedLetter.x}
                onChange={(e) =>
                  onUpdateLetter(selectedLetter.id, 'x', Number(e.target.value))
                }
                className="w-full p-2 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Y (mm)
              </label>
              <input
                type="number"
                value={selectedLetter.y}
                onChange={(e) =>
                  onUpdateLetter(selectedLetter.id, 'y', Number(e.target.value))
                }
                className="w-full p-2 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Font Size (pt)
            </label>
            <div className="flex items-center gap-2">
              <Type size={16} className="text-gray-400" />
              <input
                type="range"
                min="8"
                max="120"
                value={selectedLetter.fontSize}
                onChange={(e) =>
                  onUpdateLetter(selectedLetter.id, 'fontSize', Number(e.target.value))
                }
                className="flex-1"
              />
              <span className="text-sm font-mono w-8">{selectedLetter.fontSize}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400 text-sm">
          Click on a letter to edit its properties
        </div>
      )}
    </div>
  );
};
