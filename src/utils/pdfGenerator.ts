import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { Letter, PageSettings } from '../types';
import { regeneratePattern } from './characterPool';
import { getPageDimensions, type Orientation } from './constants';

type PDFGeneratorOptions = {
  numPages: number;
  pageSettings: PageSettings;
  letters: Letter[];
  showFixation: boolean;
  includeNumbers: boolean;
  allowDuplicates: boolean;
  orientation?: Orientation;
  onProgress?: (current: number, total: number) => void;
};

const createCanvasElement = (
  letters: Letter[],
  pageSettings: PageSettings,
  showFixation: boolean,
  orientation: Orientation = 'landscape'
): HTMLDivElement => {
  const { width, height, centerX, centerY } = getPageDimensions(orientation);

  const canvas = document.createElement('div');
  canvas.style.width = `${width}mm`;
  canvas.style.height = `${height}mm`;
  canvas.style.backgroundColor = pageSettings.bgColor;
  canvas.style.fontFamily = pageSettings.fontFamily;
  canvas.style.color = pageSettings.textColor;
  canvas.style.position = 'absolute';
  canvas.style.left = '-9999px';
  canvas.style.top = '0';

  // Add fixation point if enabled
  if (showFixation) {
    const fixation = document.createElement('div');
    fixation.style.position = 'absolute';
    fixation.style.left = `${centerX}mm`;
    fixation.style.top = `${centerY}mm`;
    fixation.style.transform = 'translate(-50%, -50%)';
    fixation.style.width = '4mm';
    fixation.style.height = '4mm';
    fixation.style.borderRadius = '50%';
    fixation.style.border = `0.5mm solid ${pageSettings.textColor}`;
    fixation.style.opacity = '0.5';
    canvas.appendChild(fixation);
  }

  // Add letters
  letters.forEach((letter) => {
    const letterEl = document.createElement('div');
    letterEl.style.position = 'absolute';
    letterEl.style.left = `${letter.x}mm`;
    letterEl.style.top = `${letter.y}mm`;
    letterEl.style.fontSize = `${letter.fontSize}pt`;
    letterEl.style.fontWeight = 'bold';
    letterEl.style.transform = 'translate(-50%, -50%)';
    letterEl.style.userSelect = 'none';
    letterEl.style.cursor = 'default';
    letterEl.textContent = letter.char;
    canvas.appendChild(letterEl);
  });

  return canvas;
};

export const generateMultiPagePDF = async (
  options: PDFGeneratorOptions
): Promise<void> => {
  const {
    numPages,
    pageSettings,
    letters,
    showFixation,
    includeNumbers,
    allowDuplicates,
    orientation = 'landscape',
    onProgress,
  } = options;

  const { width, height } = getPageDimensions(orientation);

  // Create PDF with specified orientation
  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4',
  });

  try {
    for (let i = 0; i < numPages; i++) {
      // Report progress
      if (onProgress) {
        onProgress(i + 1, numPages);
      }

      // Generate new pattern for this page
      const currentLetters =
        i === 0
          ? letters
          : regeneratePattern(letters, includeNumbers, allowDuplicates) || letters;

      // Create temporary canvas element
      const canvasElement = createCanvasElement(
        currentLetters,
        pageSettings,
        showFixation,
        orientation
      );

      // Add to DOM temporarily for rendering
      document.body.appendChild(canvasElement);

      // Wait for fonts to load
      await document.fonts.ready;

      // Convert to canvas using html2canvas
      const canvas = await html2canvas(canvasElement, {
        scale: 2, // Higher quality
        backgroundColor: pageSettings.bgColor,
        logging: false,
        useCORS: true,
      });

      // Remove temporary element
      document.body.removeChild(canvasElement);

      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png');

      // Add image to PDF
      if (i > 0) {
        pdf.addPage();
      }

      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `vision-trainer-patterns_${numPages}pages_${timestamp}.pdf`;

    // Download the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
