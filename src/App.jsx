import React, { useState, useRef } from 'react';
import { Printer, Move, Type, Grid, RotateCcw, LayoutTemplate, Palette, Settings, X } from 'lucide-react';

const A4_WIDTH_MM = 297;
const A4_HEIGHT_MM = 210;
const CENTER_X = A4_WIDTH_MM / 2;
const CENTER_Y = A4_HEIGHT_MM / 2;
const STORAGE_KEY = 'visionTrainerPresets';

// --- LOCALSTORAGE HELPERS ---

const loadPresetsFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading presets:', error);
    return null;
  }
};

const savePresetsToStorage = (presets) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  } catch (error) {
    console.error('Error saving presets:', error);
  }
};

// --- GENERATORS ---

// 1. Default Grid
const generateGridLetters = () => {
  const letters = [];
  const rows = 4;
  const cols = 7;
  const marginX = 20;
  const marginY = 20;
  const stepX = (A4_WIDTH_MM - marginX * 2) / (cols - 1);
  const stepY = (A4_HEIGHT_MM - marginY * 2) / (rows - 1);

  let count = 0;
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZAB";

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (count < 28) {
        letters.push({
          id: count,
          char: alphabet[count] || 'A',
          x: marginX + c * stepX,
          y: marginY + r * stepY,
          fontSize: 12,
        });
        count++;
      }
    }
  }
  return letters;
};

// 2. MacDonald 1 Preset (X Pattern with scaling sizes)
const generateMacDonaldLetters = () => {
  const letters = [];
  let idCounter = 0;

  // Helper to mirror coordinates for the 4 quadrants
  const addDiagonal = (chars, qx, qy) => {
    const steps = [
      { dX: 110, dY: 75, size: 90 }, // Outer-most
      { dX: 85, dY: 55, size: 65 },
      { dX: 65, dY: 40, size: 48 },
      { dX: 48, dY: 28, size: 36 },
      { dX: 35, dY: 18, size: 24 },
      { dX: 24, dY: 10, size: 16 }, // Inner-most of diagonal
    ];

    chars.forEach((char, index) => {
      if (index < steps.length) {
        letters.push({
          id: idCounter++,
          char: char,
          x: CENTER_X + (steps[index].dX * qx),
          y: CENTER_Y + (steps[index].dY * qy),
          fontSize: steps[index].size
        });
      }
    });
  };

  addDiagonal(['N', 'L', 'V', 'Z', 'K', 'T'], -1, -1);
  addDiagonal(['Y', 'N', 'T', 'K', 'M', 'A'], 1, -1);
  addDiagonal(['U', 'T', 'Y', 'A', 'F', 'S'], -1, 1);
  addDiagonal(['K', 'A', 'X', 'E', 'N', 'P'], 1, 1);

  const centerOffset = 7;
  const centerSize = 14;

  const centerChars = [
    { char: 'L', x: -1, y: -1 },
    { char: 'H', x: 1, y: -1 },
    { char: 'Y', x: -1, y: 1 },
    { char: 'E', x: 1, y: 1 },
  ];

  centerChars.forEach(c => {
    letters.push({
      id: idCounter++,
      char: c.char,
      x: CENTER_X + (centerOffset * c.x),
      y: CENTER_Y + (centerOffset * c.y),
      fontSize: centerSize
    });
  });

  return letters;
};

export default function A4Generator() {
  const [letters, setLetters] = useState(generateGridLetters());
  const [selectedId, setSelectedId] = useState(null);
  const [showGrid, setShowGrid] = useState(true);
  const [showFixation, setShowFixation] = useState(false);

  // Page Style State
  const [pageSettings, setPageSettings] = useState({
    bgColor: '#FFFFFF',
    textColor: '#000000',
    fontFamily: 'Arial, Helvetica, sans-serif'
  });

  // Presets State - Initialize from localStorage or use defaults
  const [presets, setPresets] = useState(() => {
    const storedPresets = loadPresetsFromStorage();
    if (storedPresets && storedPresets.length > 0) {
      return storedPresets;
    }
    // Initialize with built-in presets
    const builtInPresets = [
      {
        name: 'Standard Grid',
        isBuiltIn: true,
        letters: generateGridLetters(),
        pageSettings: {
          bgColor: '#FFFFFF',
          textColor: '#000000',
          fontFamily: 'Arial, Helvetica, sans-serif'
        },
        createdAt: new Date().toISOString()
      },
      {
        name: 'MacDonald 1',
        isBuiltIn: true,
        letters: generateMacDonaldLetters(),
        pageSettings: {
          bgColor: '#FFFFFF',
          textColor: '#000000',
          fontFamily: 'Arial, Helvetica, sans-serif'
        },
        createdAt: new Date().toISOString()
      }
    ];
    savePresetsToStorage(builtInPresets);
    return builtInPresets;
  });
  const [isSaving, setIsSaving] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [saveError, setSaveError] = useState('');

  const paperRef = useRef(null);

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handlePrint = () => {
    window.print();
  };

  const updateLetter = (id, field, value) => {
    setLetters(prev => prev.map(l =>
      l.id === id ? { ...l, [field]: value } : l
    ));
  };

  const updatePageSetting = (key, value) => {
    setPageSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleMouseDown = (e, id, x, y) => {
    e.stopPropagation();
    setSelectedId(id);
    setIsDragging(true);

    dragOffset.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: x,
      origY: y
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging || selectedId === null) return;

    const paperRect = paperRef.current.getBoundingClientRect();
    const pxPerMm = paperRect.width / A4_WIDTH_MM;

    const deltaX = (e.clientX - dragOffset.current.startX) / pxPerMm;
    const deltaY = (e.clientY - dragOffset.current.startY) / pxPerMm;

    const newX = Math.max(0, Math.min(A4_WIDTH_MM, dragOffset.current.origX + deltaX));
    const newY = Math.max(0, Math.min(A4_HEIGHT_MM, dragOffset.current.origY + deltaY));

    updateLetter(selectedId, 'x', Math.round(newX * 10) / 10);
    updateLetter(selectedId, 'y', Math.round(newY * 10) / 10);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const loadPreset = (preset) => {
    setLetters(preset.letters);
    setPageSettings(preset.pageSettings);
    setSelectedId(null);
  };

  const savePreset = () => {
    const trimmedName = newPresetName.trim();

    // Validate: prevent empty names
    if (!trimmedName) {
      setSaveError('Preset name cannot be empty');
      return;
    }

    // Validate: prevent duplicates (case-insensitive)
    const duplicate = presets.find(
      p => p.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (duplicate) {
      setSaveError('A preset with this name already exists');
      return;
    }

    // Create new preset
    const newPreset = {
      name: trimmedName,
      isBuiltIn: false,
      letters: [...letters], // Deep copy
      pageSettings: { ...pageSettings }, // Deep copy
      createdAt: new Date().toISOString()
    };

    const updatedPresets = [...presets, newPreset];
    setPresets(updatedPresets);
    savePresetsToStorage(updatedPresets);

    // Reset form
    setIsSaving(false);
    setNewPresetName('');
    setSaveError('');
  };

  const deletePreset = (presetName) => {
    const updatedPresets = presets.filter(p => p.name !== presetName);
    setPresets(updatedPresets);
    savePresetsToStorage(updatedPresets);
  };

  const selectedLetter = letters.find(l => l.id === selectedId);

  return (
    <div
      className="min-h-screen bg-gray-100 flex flex-col"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Header / Toolbar - Hidden on Print */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center no-print z-10">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <Printer size={24} />
          </div>
          <div>
            <h1 className="font-bold text-xl text-gray-800">Precision Layout Tool</h1>
            <p className="text-sm text-gray-500">A4 Landscape • 28 Letters</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${showGrid ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
          >
            <Grid size={18} />
            {showGrid ? 'Hide Grid' : 'Show Grid'}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm transition-colors font-medium"
          >
            <Printer size={18} />
            Print Layout
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar Controls - Hidden on Print */}
        <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto no-print p-4 flex flex-col gap-6 shadow-lg z-10">

          {/* Page Settings (New) */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
             <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
              <Settings size={16} className="text-gray-500" />
              Page Settings
            </h2>
            <div className="space-y-3">

              {/* Colors */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Background</label>
                  <div className="flex items-center gap-2 bg-white p-1 border border-gray-300 rounded-md">
                    <input
                      type="color"
                      value={pageSettings.bgColor}
                      onChange={(e) => updatePageSetting('bgColor', e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer border-none p-0"
                    />
                    <span className="text-xs font-mono text-gray-600">{pageSettings.bgColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Text Color</label>
                  <div className="flex items-center gap-2 bg-white p-1 border border-gray-300 rounded-md">
                    <input
                      type="color"
                      value={pageSettings.textColor}
                      onChange={(e) => updatePageSetting('textColor', e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer border-none p-0"
                    />
                    <span className="text-xs font-mono text-gray-600">{pageSettings.textColor}</span>
                  </div>
                </div>
              </div>

              {/* Font Family */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Font Family</label>
                <select
                  value={pageSettings.fontFamily}
                  onChange={(e) => updatePageSetting('fontFamily', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white"
                >
                  <option value="Arial, Helvetica, sans-serif">Sans Serif (Clean)</option>
                  <option value="'Times New Roman', Times, serif">Serif (Classic)</option>
                  <option value="'Courier New', Courier, monospace">Monospace (Technical)</option>
                </select>
              </div>

              {/* Center Fixation Point */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="fixation-toggle"
                  checked={showFixation}
                  onChange={(e) => setShowFixation(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="fixation-toggle" className="text-xs font-medium text-gray-500 cursor-pointer">
                  Center Fixation Point
                </label>
              </div>
            </div>
          </div>

          {/* Presets Section */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
              <LayoutTemplate size={16} className="text-gray-500" />
              Presets
            </h2>

            <div className="space-y-3">
              {/* Save Current Layout Button or Input Form */}
              {!isSaving ? (
                <button
                  onClick={() => setIsSaving(true)}
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
                      setNewPresetName(e.target.value);
                      setSaveError('');
                    }}
                    placeholder="Enter preset name..."
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    autoFocus
                  />
                  {saveError && (
                    <p className="text-xs text-red-600">{saveError}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={savePreset}
                      className="flex-1 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsSaving(false);
                        setNewPresetName('');
                        setSaveError('');
                      }}
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
                  <div
                    key={preset.name}
                    className="relative group"
                  >
                    <button
                      onClick={() => loadPreset(preset)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:border-blue-400 hover:text-blue-600 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-2">
                        {!preset.isBuiltIn && <span>🌟</span>}
                        <span className="font-medium">{preset.name}</span>
                      </div>
                      {preset.isBuiltIn && preset.name === 'MacDonald 1' && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded group-hover:bg-blue-50 group-hover:text-blue-600">X-Pattern</span>
                      )}
                      {preset.isBuiltIn && preset.name === 'Standard Grid' && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded group-hover:bg-blue-50 group-hover:text-blue-600">4x7</span>
                      )}
                    </button>

                    {/* Delete button - only for custom presets, shown on hover */}
                    {!preset.isBuiltIn && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePreset(preset.name);
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
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

          {/* Selected Letter Editor */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Move size={18} className="text-blue-600" />
              Editor
            </h2>

            {selectedLetter ? (
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Selected ID: {selectedLetter.id + 1}</span>
                 </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Character</label>
                  <input
                    type="text"
                    maxLength={1}
                    value={selectedLetter.char}
                    onChange={(e) => updateLetter(selectedLetter.id, 'char', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-center font-bold text-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">X (mm)</label>
                    <input
                      type="number"
                      value={selectedLetter.x}
                      onChange={(e) => updateLetter(selectedLetter.id, 'x', Number(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Y (mm)</label>
                    <input
                      type="number"
                      value={selectedLetter.y}
                      onChange={(e) => updateLetter(selectedLetter.id, 'y', Number(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Font Size (pt)</label>
                  <div className="flex items-center gap-2">
                    <Type size={16} className="text-gray-400" />
                    <input
                      type="range"
                      min="8"
                      max="120"
                      value={selectedLetter.fontSize}
                      onChange={(e) => updateLetter(selectedLetter.id, 'fontSize', Number(e.target.value))}
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
        </aside>

        {/* Preview Area */}
        <div className="flex-1 bg-gray-200 overflow-auto relative flex">

          {/* The A4 Paper */}
          <div
            ref={paperRef}
            className="shadow-2xl relative transition-transform origin-top shrink-0 m-auto"
            style={{
              width: `${A4_WIDTH_MM}mm`,
              height: `${A4_HEIGHT_MM}mm`,
              backgroundColor: pageSettings.bgColor,
              fontFamily: pageSettings.fontFamily,
              color: pageSettings.textColor
            }}
          >
            {/* Grid Lines (Visual helper only) */}
            {showGrid && (
              <div className="absolute inset-0 pointer-events-none opacity-10 no-print"
                   style={{
                     backgroundImage: `linear-gradient(${pageSettings.textColor} 1px, transparent 1px), linear-gradient(90deg, ${pageSettings.textColor} 1px, transparent 1px)`,
                     backgroundSize: '10mm 10mm',
                     backgroundPosition: '8.5mm 5mm'
                   }}>
                {/* Center visual guide for grid mode */}
                <div className="absolute top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 border border-red-500 rounded-full opacity-50"></div>
              </div>
            )}

            {/* Center Fixation Point */}
            {showFixation && (
              <div
                style={{
                  position: 'absolute',
                  left: `${CENTER_X}mm`,
                  top: `${CENTER_Y}mm`,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                  zIndex: 5
                }}
              >
                {/* Outer circle */}
                <div
                  style={{
                    width: '5mm',
                    height: '5mm',
                    border: `1px solid ${pageSettings.textColor}`,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {/* Inner dot */}
                  <div
                    style={{
                      width: '1mm',
                      height: '1mm',
                      backgroundColor: pageSettings.textColor,
                      borderRadius: '50%'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Render Letters */}
            {letters.map((l) => (
              <div
                key={l.id}
                onMouseDown={(e) => handleMouseDown(e, l.id, l.x, l.y)}
                style={{
                  position: 'absolute',
                  left: `${l.x}mm`,
                  top: `${l.y}mm`,
                  fontSize: `${l.fontSize}pt`,
                  transform: 'translate(-50%, -50%)',
                  cursor: isDragging ? 'grabbing' : 'grab',
                  userSelect: 'none',
                  zIndex: selectedId === l.id ? 50 : 1,
                  fontWeight: 'bold',
                  // Override global color if selected
                  color: selectedId === l.id ? '#2563eb' : pageSettings.textColor
                }}
                className={`
                  flex items-center justify-center
                  transition-colors
                `}
              >
                {/* Visual bounding box only shown when selected and not printing */}
                {selectedId === l.id && (
                  <div className="absolute inset-0 border-2 border-dashed border-blue-400 rounded-full opacity-50 no-print pointer-events-none w-full h-full scale-150"></div>
                )}
                {l.char}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Global Styles for Print */}
      <style>{`
        @media print {
          @page {
            size: landscape;
            margin: 0;
          }
          body {
            background: white;
            margin: 0;
            padding: 0;
            overflow: hidden;
          }
          .no-print {
            display: none !important;
          }
          main {
            display: block;
            overflow: visible;
            background: white;
          }
          div[class*="flex-1"] {
            overflow: visible !important;
            background: white !important;
            padding: 0 !important;
            display: block !important;
          }
          div[style*="width: ${A4_WIDTH_MM}mm"] {
            box-shadow: none !important;
            transform: none !important;
            margin: 0 !important;
            top: 0;
            left: 0;
            /* Force background print */
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}
