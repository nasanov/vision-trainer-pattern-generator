import { useState, useRef } from 'react';
import type { PageSettings } from './types';
import { generateGridLetters } from './generators/gridGenerator';
import { useLetters } from './hooks/useLetters';
import { usePresets } from './hooks/usePresets';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar/Sidebar';
import { PreviewArea } from './components/PreviewArea';
import { ProgressModal } from './components/ProgressModal';
import { A4_WIDTH_MM, DEFAULT_PAGE_SETTINGS } from './utils/constants';
import { generateMultiPagePDF } from './utils/pdfGenerator';

export default function App() {
  const paperRef = useRef<HTMLDivElement>(null);

  // Page settings state
  const [pageSettings, setPageSettings] = useState<PageSettings>(DEFAULT_PAGE_SETTINGS);
  const [showGrid, setShowGrid] = useState(true);
  const [showFixation, setShowFixation] = useState(false);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [allowDuplicates, setAllowDuplicates] = useState(true);

  // PDF generation state
  const [numCopies, setNumCopies] = useState(1);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfProgress, setPdfProgress] = useState({ current: 0, total: 0 });

  // Custom hooks
  const { letters, setLetters, selectedId, setSelectedId, updateLetter, regenerate, selectedLetter } =
    useLetters(generateGridLetters);

  const {
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
  } = usePresets();

  const { isDragging, handleMouseDown, handleMouseMove, handleMouseUp } = useDragAndDrop(
    paperRef,
    updateLetter,
    selectedId,
    setSelectedId
  );

  // Handlers
  const handlePrint = () => {
    window.print();
  };

  const updatePageSetting = (key: keyof PageSettings, value: string) => {
    setPageSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegeneratePattern = () => {
    regenerate(includeNumbers, allowDuplicates);
  };

  const handleLoadPreset = (preset: typeof presets[0]) => {
    loadPreset(preset, setLetters, setPageSettings, setSelectedId);
  };

  const handleSavePreset = () => {
    savePreset(letters, pageSettings);
  };

  const handleDownloadPDF = async () => {
    if (numCopies < 1 || numCopies > 30) {
      alert('Please enter a number between 1 and 30 pages.');
      return;
    }

    setIsGeneratingPDF(true);
    setPdfProgress({ current: 0, total: numCopies });

    try {
      await generateMultiPagePDF({
        numPages: numCopies,
        pageSettings,
        letters,
        showFixation,
        includeNumbers,
        allowDuplicates,
        onProgress: (current, total) => {
          setPdfProgress({ current, total });
        },
      });
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
      setPdfProgress({ current: 0, total: 0 });
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-100 flex flex-col"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Header
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
        onRegeneratePattern={handleRegeneratePattern}
        onPrint={handlePrint}
        numCopies={numCopies}
        onNumCopiesChange={setNumCopies}
        onDownloadPDF={handleDownloadPDF}
        isGeneratingPDF={isGeneratingPDF}
      />

      <main className="flex-1 flex overflow-hidden">
        <Sidebar
          pageSettings={pageSettings}
          onUpdatePageSetting={updatePageSetting}
          showFixation={showFixation}
          onToggleFixation={setShowFixation}
          includeNumbers={includeNumbers}
          onToggleNumbers={setIncludeNumbers}
          allowDuplicates={allowDuplicates}
          onToggleDuplicates={setAllowDuplicates}
          presets={presets}
          onLoadPreset={handleLoadPreset}
          isSaving={isSaving}
          onStartSaving={() => setIsSaving(true)}
          onCancelSaving={() => {
            setIsSaving(false);
            setNewPresetName('');
            setSaveError('');
          }}
          newPresetName={newPresetName}
          onNameChange={setNewPresetName}
          saveError={saveError}
          onSavePreset={handleSavePreset}
          onDeletePreset={deletePreset}
          onClearError={() => setSaveError('')}
          selectedLetter={selectedLetter}
          onUpdateLetter={updateLetter}
        />

        <PreviewArea
          paperRef={paperRef}
          pageSettings={pageSettings}
          showGrid={showGrid}
          showFixation={showFixation}
          letters={letters}
          selectedId={selectedId}
          isDragging={isDragging}
          onLetterMouseDown={handleMouseDown}
        />
      </main>

      <ProgressModal
        isOpen={isGeneratingPDF}
        current={pdfProgress.current}
        total={pdfProgress.total}
      />

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
