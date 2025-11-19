import type { Letter, PageSettings } from '../types';
import { Canvas } from './Canvas/Canvas';

type PreviewAreaProps = {
  paperRef: React.RefObject<HTMLDivElement>;
  pageSettings: PageSettings;
  showGrid: boolean;
  showFixation: boolean;
  letters: Letter[];
  selectedId: number | null;
  isDragging: boolean;
  onLetterMouseDown: (e: React.MouseEvent, id: number, x: number, y: number) => void;
};

export const PreviewArea = ({
  paperRef,
  pageSettings,
  showGrid,
  showFixation,
  letters,
  selectedId,
  isDragging,
  onLetterMouseDown,
}: PreviewAreaProps) => {
  return (
    <div className="flex-1 bg-gray-200 overflow-auto relative flex">
      <Canvas
        paperRef={paperRef}
        pageSettings={pageSettings}
        showGrid={showGrid}
        showFixation={showFixation}
        letters={letters}
        selectedId={selectedId}
        isDragging={isDragging}
        onLetterMouseDown={onLetterMouseDown}
      />
    </div>
  );
};
