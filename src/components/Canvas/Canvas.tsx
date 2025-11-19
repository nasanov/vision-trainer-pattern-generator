import type { Letter as LetterType, PageSettings } from '../../types';
import { getPageDimensions, type Orientation } from '../../utils/constants';
import { GridLines } from './GridLines';
import { FixationPoint } from './FixationPoint';
import { Letter } from './Letter';

type CanvasProps = {
  paperRef: React.RefObject<HTMLDivElement | null>;
  pageSettings: PageSettings;
  showGrid: boolean;
  showFixation: boolean;
  letters: LetterType[];
  selectedId: number | null;
  isDragging: boolean;
  onLetterMouseDown: (e: React.MouseEvent, id: number, x: number, y: number) => void;
  orientation?: Orientation;
};

export const Canvas = ({
  paperRef,
  pageSettings,
  showGrid,
  showFixation,
  letters,
  selectedId,
  isDragging,
  onLetterMouseDown,
  orientation = 'landscape',
}: CanvasProps) => {
  const { width, height, centerX, centerY } = getPageDimensions(orientation);

  return (
    <div
      ref={paperRef}
      className="shadow-2xl relative transition-transform origin-top shrink-0 m-auto"
      style={{
        width: `${width}mm`,
        height: `${height}mm`,
        backgroundColor: pageSettings.bgColor,
        fontFamily: pageSettings.fontFamily,
        color: pageSettings.textColor,
      }}
    >
      {showGrid && <GridLines color={pageSettings.textColor} />}
      {showFixation && <FixationPoint color={pageSettings.textColor} centerX={centerX} centerY={centerY} />}

      {letters.map((letter) => (
        <Letter
          key={letter.id}
          letter={letter}
          isSelected={letter.id === selectedId}
          isDragging={isDragging}
          textColor={pageSettings.textColor}
          onMouseDown={(e) => onLetterMouseDown(e, letter.id, letter.x, letter.y)}
        />
      ))}
    </div>
  );
};
