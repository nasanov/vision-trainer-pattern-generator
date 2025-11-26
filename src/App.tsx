import { useState, useRef } from 'react';
import { Analytics } from '@vercel/analytics';
import type { PageSettings } from './types';
import { generateGridLetters } from './generators/gridGenerator';
import { useLetters } from './hooks/useLetters';
import { usePresets } from './hooks/usePresets';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar/Sidebar';
import { PreviewArea } from './components/PreviewArea';
import { DEFAULT_PAGE_SETTINGS, type Orientation } from './utils/constants';

export default function App() {
	const paperRef = useRef<HTMLDivElement>(null);

	// Page settings state
	const [pageSettings, setPageSettings] = useState<PageSettings>(DEFAULT_PAGE_SETTINGS);
	const [showGrid, setShowGrid] = useState(true);
	const [showFixation, setShowFixation] = useState(false);
	const [includeNumbers, setIncludeNumbers] = useState(false);
	const [allowDuplicates, setAllowDuplicates] = useState(true);

	// Grid dimensions state
	const [gridRows, setGridRows] = useState(4);
	const [gridCols, setGridCols] = useState(7);
	const [orientation, setOrientation] = useState<Orientation>('landscape');
	const [isCustomLayout, setIsCustomLayout] = useState(false);

	// Multi-page print state
	const [numCopies, setNumCopies] = useState(1);
	const [printPages, setPrintPages] = useState<Array<typeof letters>>([]);

	// Custom hooks
	const { letters, setLetters, selectedId, setSelectedId, updateLetter, regenerate, resizeGrid, selectedLetter } =
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

	// Helper function to generate unique letters while maintaining positions
	const generateUniqueLetters = (templateLetters: typeof letters) => {
		const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const numbers = '0123456789';
		const availableChars = includeNumbers ? alphabet + numbers : alphabet;

		return templateLetters.map((letter, index) => {
			let newChar: string;
			if (allowDuplicates) {
				// Randomly pick any character
				newChar = availableChars[Math.floor(Math.random() * availableChars.length)];
			} else {
				// Pick unique character (avoid duplicates within this page)
				const usedChars = new Set(templateLetters.slice(0, index).map(l => l.char));
				const available = availableChars.split('').filter(c => !usedChars.has(c));
				if (available.length === 0) {
					// Fallback if we run out of unique characters
					newChar = availableChars[Math.floor(Math.random() * availableChars.length)];
				} else {
					newChar = available[Math.floor(Math.random() * available.length)];
				}
			}

			return {
				...letter,
				char: newChar,
			};
		});
	};

	// Handlers
	const handlePrint = () => {
		if (numCopies < 1 || numCopies > 30) {
			alert('Please enter a number between 1 and 30 pages.');
			return;
		}

		// If only 1 copy, just print normally
		if (numCopies === 1) {
			setPrintPages([]);
			setTimeout(() => window.print(), 50);
			return;
		}

		// For multiple copies, generate all unique pages (excluding the visible page)
		const pages: Array<typeof letters> = [];

		// Generate unique pages with same positions but different letters
		// Start from 1 because page 0 is the currently visible canvas
		for (let i = 1; i < numCopies; i++) {
			const newLetters = generateUniqueLetters(letters);
			pages.push(newLetters);
		}

		setPrintPages(pages);

		// Wait for DOM to update, then print
		setTimeout(() => {
			window.print();
			// Clear print pages after print dialog closes
			setTimeout(() => setPrintPages([]), 100);
		}, 100);
	};

	const updatePageSetting = (key: keyof PageSettings, value: string) => {
		setPageSettings(prev => ({ ...prev, [key]: value }));
	};

	const handleRegeneratePattern = () => {
		regenerate(includeNumbers, allowDuplicates);
	};

	const handleLoadPreset = (preset: (typeof presets)[0]) => {
		loadPreset(preset, setLetters, setPageSettings, setSelectedId, setOrientation, setGridRows, setGridCols);
		setIsCustomLayout(!preset.gridLayout);
	};

	const handleSavePreset = () => {
		// Only include grid layout if both dimensions are set
		const gridLayout = gridRows && gridCols ? { rows: gridRows, cols: gridCols } : undefined;
		savePreset(letters, pageSettings, orientation, gridLayout);
	};

	const handleApplyGridSize = () => {
		resizeGrid(gridRows, gridCols, includeNumbers, allowDuplicates, orientation);
		setIsCustomLayout(false);
	};

	const handleOrientationChange = (newOrientation: Orientation) => {
		setOrientation(newOrientation);
		resizeGrid(gridRows, gridCols, includeNumbers, allowDuplicates, newOrientation);
		setIsCustomLayout(false);
	};


	return (
		<>
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
					totalLetters={letters.length}
					gridRows={gridRows}
					gridCols={gridCols}
					orientation={orientation}
					onOrientationChange={handleOrientationChange}
					isCustomLayout={isCustomLayout}
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
						gridRows={gridRows}
						onGridRowsChange={setGridRows}
						gridCols={gridCols}
						onGridColsChange={setGridCols}
						onApplyGridSize={handleApplyGridSize}
						totalLetters={letters.length}
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
						orientation={orientation}
					/>
				</main>

				{/* Additional pages for multi-page printing */}
				{printPages.length > 0 && (
					<div className="print-only">
						{printPages.map((pageLetters, index) => (
							<div key={index} className="print-page" style={{ pageBreakAfter: 'always' }}>
								<div
									style={{
										width: `${orientation === 'landscape' ? 297 : 210}mm`,
										height: `${orientation === 'landscape' ? 210 : 297}mm`,
										backgroundColor: pageSettings.bgColor,
										fontFamily: pageSettings.fontFamily,
										color: pageSettings.textColor,
										position: 'relative',
									}}
								>
									{showFixation && (
										<div
											style={{
												position: 'absolute',
												left: '50%',
												top: '50%',
												transform: 'translate(-50%, -50%)',
												width: '4mm',
												height: '4mm',
												borderRadius: '50%',
												backgroundColor: pageSettings.textColor,
											}}
										/>
									)}
									{pageLetters.map(letter => (
										<div
											key={letter.id}
											style={{
												position: 'absolute',
												left: `${letter.x}mm`,
												top: `${letter.y}mm`,
												fontSize: `${letter.fontSize}pt`,
												fontFamily: pageSettings.fontFamily,
												color: pageSettings.textColor,
												userSelect: 'none',
												transform: 'translate(-50%, -50%)',
												fontWeight: 'bold',
											}}
										>
											{letter.char}
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				)}

				{/* Global Styles for Print */}
				<style>{`
        .print-only {
          display: none;
        }

        @media print {
          @page {
            size: ${orientation};
            margin: 0;
          }
          body {
            background: white;
            margin: 0;
            padding: 0;
            overflow: visible !important;
          }
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          .print-page {
            page-break-after: always;
            page-break-inside: avoid;
            margin: 0;
            padding: 0;
          }
          .print-page:last-child {
            page-break-after: auto;
          }
          main {
            display: block;
            overflow: visible;
            background: white;
            page-break-after: ${printPages.length > 0 ? 'always' : 'auto'};
          }
          div[class*="flex-1"] {
            overflow: visible !important;
            background: white !important;
            padding: 0 !important;
            display: block !important;
          }
          div[ref="paperRef"],
          div[style*="width:"],
          div[style*="height:"] {
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
			<Analytics />
		</>
	);
}
