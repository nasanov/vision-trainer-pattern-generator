import { useState, useRef } from 'react';
import type { Letter } from '../types';
import { A4_WIDTH_MM, A4_HEIGHT_MM } from '../utils/constants';

type DragOffset = {
  startX: number;
  startY: number;
  origX: number;
  origY: number;
};

export const useDragAndDrop = (
  paperRef: React.RefObject<HTMLDivElement | null>,
  updateLetter: (id: number, field: keyof Letter, value: string | number) => void,
  selectedId: number | null,
  setSelectedId: (id: number | null) => void
) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef<DragOffset>({ startX: 0, startY: 0, origX: 0, origY: 0 });

  const handleMouseDown = (e: React.MouseEvent, id: number, x: number, y: number) => {
    e.stopPropagation();
    setSelectedId(id);
    setIsDragging(true);

    dragOffset.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: x,
      origY: y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || selectedId === null || !paperRef.current) return;

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

  return {
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};
