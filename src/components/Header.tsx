import { Printer, Grid, RotateCcw, ScanEye, Download, RotateCw } from 'lucide-react';
import type { Orientation } from '../utils/constants';

type HeaderProps = {
	showGrid: boolean;
	onToggleGrid: () => void;
	onRegeneratePattern: () => void;
	onPrint: () => void;
	numCopies: number;
	onNumCopiesChange: (value: number) => void;
	onDownloadPDF: () => void;
	isGeneratingPDF: boolean;
	totalLetters?: number;
	gridRows?: number;
	gridCols?: number;
	orientation?: Orientation;
	onOrientationChange?: (orientation: Orientation) => void;
	isCustomLayout?: boolean;
};

export const Header = ({
	showGrid,
	onToggleGrid,
	onRegeneratePattern,
	onPrint,
	numCopies,
	onNumCopiesChange,
	onDownloadPDF,
	isGeneratingPDF,
	totalLetters = 28,
	gridRows = 4,
	gridCols = 7,
	orientation = 'landscape',
	onOrientationChange,
	isCustomLayout = false,
}: HeaderProps) => {
	return (
		<header className="bg-white shadow-sm p-4 flex justify-between items-center no-print z-10">
			<div className="flex items-center gap-2">
				<div className="bg-blue-600 text-white p-2 rounded-lg">
					<ScanEye size={24} />
				</div>
				<div>
					<h1 className="font-bold text-xl text-gray-800">Vision Trainer Pattern Generator</h1>
					<p className="text-sm text-gray-500">
						A4 {orientation === 'landscape' ? 'Landscape' : 'Portrait'} •{' '}
						{isCustomLayout ? 'Custom Layout' : `${gridRows}×${gridCols} Grid`} • {totalLetters} Letters
					</p>
				</div>
			</div>

			<div className="flex gap-3 items-center">
				<button
					onClick={onToggleGrid}
					className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
						showGrid ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'
					}`}
				>
					<Grid size={18} />
					{showGrid ? 'Hide Grid' : 'Show Grid'}
				</button>

				{onOrientationChange && (
					<button
						onClick={() => onOrientationChange(orientation === 'landscape' ? 'portrait' : 'landscape')}
						className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
						title={`Switch to ${orientation === 'landscape' ? 'Portrait' : 'Landscape'}`}
					>
						<RotateCw size={18} />
						{orientation === 'landscape' ? 'Portrait' : 'Landscape'}
					</button>
				)}

				<div className="flex items-center gap-2 bg-gray-50 rounded-md px-3 py-2">
					<label htmlFor="numCopies" className="text-sm text-gray-600 font-medium">
						Copies:
					</label>
					<input
						id="numCopies"
						type="number"
						min="1"
						max="30"
						value={numCopies}
						onChange={e => onNumCopiesChange(Math.min(30, Math.max(1, parseInt(e.target.value) || 1)))}
						className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
						disabled={isGeneratingPDF}
					/>
				</div>

				<button
					onClick={onDownloadPDF}
					className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 shadow-sm transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
					disabled={isGeneratingPDF}
				>
					<Download size={18} />
					{isGeneratingPDF ? 'Generating...' : 'Download PDF'}
				</button>
				<button
					onClick={onRegeneratePattern}
					className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 shadow-sm transition-colors font-medium"
					disabled={isGeneratingPDF}
				>
					<RotateCcw size={18} />
					Regenerate Pattern
				</button>

				<button
					onClick={onPrint}
					className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm transition-colors font-medium"
					disabled={isGeneratingPDF}
				>
					<Printer size={18} />
					Print Layout
				</button>
			</div>
		</header>
	);
};
