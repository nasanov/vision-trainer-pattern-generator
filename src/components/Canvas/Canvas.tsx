import type { Letter as LetterType, PageSettings } from '../../types';
import { A4_WIDTH_MM, A4_HEIGHT_MM } from '../../utils/constants';
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
}: CanvasProps) => {
  return (
    <div
      ref={paperRef}
      className="shadow-2xl relative transition-transform origin-top shrink-0 m-auto"
      style={{
        width: `${A4_WIDTH_MM}mm`,
        height: `${A4_HEIGHT_MM}mm`,
        backgroundColor: pageSettings.bgColor,
        fontFamily: pageSettings.fontFamily,
        color: pageSettings.textColor,
      }}
    >
      {showGrid && <GridLines color={pageSettings.textColor} />}
      {showFixation && <FixationPoint color={pageSettings.textColor} />}

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
