import { Printer, Grid, RotateCcw, ScanEye } from 'lucide-react';

type HeaderProps = {
  showGrid: boolean;
  onToggleGrid: () => void;
  onRegeneratePattern: () => void;
  onPrint: () => void;
};

export const Header = ({
  showGrid,
  onToggleGrid,
  onRegeneratePattern,
  onPrint,
}: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center no-print z-10">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 text-white p-2 rounded-lg">
          <ScanEye size={24} />
        </div>
        <div>
          <h1 className="font-bold text-xl text-gray-800">Precision Layout Tool</h1>
          <p className="text-sm text-gray-500">A4 Landscape • 28 Letters</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onToggleGrid}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            showGrid ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'
          }`}
        >
          <Grid size={18} />
          {showGrid ? 'Hide Grid' : 'Show Grid'}
        </button>
        <button
          onClick={onRegeneratePattern}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 shadow-sm transition-colors font-medium"
        >
          <RotateCcw size={18} />
          Regenerate Pattern
        </button>
        <button
          onClick={onPrint}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm transition-colors font-medium"
        >
          <Printer size={18} />
          Print Layout
        </button>
      </div>
    </header>
  );
};
