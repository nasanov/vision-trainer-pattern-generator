import type { Letter as LetterType } from '../../types';

type LetterProps = {
  letter: LetterType;
  isSelected: boolean;
  isDragging: boolean;
  textColor: string;
  onMouseDown: (e: React.MouseEvent) => void;
};

export const Letter = ({
  letter,
  isSelected,
  isDragging,
  textColor,
  onMouseDown,
}: LetterProps) => {
  return (
    <div
      onMouseDown={onMouseDown}
      style={{
        position: 'absolute',
        left: `${letter.x}mm`,
        top: `${letter.y}mm`,
        fontSize: `${letter.fontSize}pt`,
        transform: 'translate(-50%, -50%)',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        zIndex: isSelected ? 50 : 1,
        fontWeight: 'bold',
        color: isSelected ? '#2563eb' : textColor,
      }}
      className="flex items-center justify-center transition-colors"
    >
      {isSelected && (
        <div className="absolute inset-0 border-2 border-dashed border-blue-400 rounded-full opacity-50 no-print pointer-events-none w-full h-full scale-150"></div>
      )}
      {letter.char}
    </div>
  );
};
