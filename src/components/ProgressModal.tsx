type ProgressModalProps = {
  isOpen: boolean;
  current: number;
  total: number;
};

export const ProgressModal = ({ isOpen, current, total }: ProgressModalProps) => {
  if (!isOpen) return null;

  const percentage = Math.round((current / total) * 100);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Generating PDF</h3>
        <p className="text-sm text-gray-600 mb-4">
          Please wait while we generate your vision training patterns...
        </p>

        <div className="mb-2">
          <div className="flex justify-between text-sm text-gray-700 mb-1">
            <span>Page {current} of {total}</span>
            <span>{percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300 ease-out rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-4 text-center">
          This may take a few moments depending on the number of pages
        </p>
      </div>
    </div>
  );
};
