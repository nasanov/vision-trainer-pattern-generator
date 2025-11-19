import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { Letter, PageSettings } from '../types';
import { regeneratePattern } from './characterPool';
import { A4_WIDTH_MM, A4_HEIGHT_MM, CENTER_X, CENTER_Y } from './constants';

type PDFGeneratorOptions = {
  numPages: number;
  pageSettings: PageSettings;
  letters: Letter[];
  showFixation: boolean;
  includeNumbers: boolean;
  allowDuplicates: boolean;
  onProgress?: (current: number, total: number) => void;
};

const createCanvasElement = (
  letters: Letter[],
  pageSettings: PageSettings,
  showFixation: boolean
): HTMLDivElement => {
  const canvas = document.createElement('div');
  canvas.style.width = `${A4_WIDTH_MM}mm`;
  canvas.style.height = `${A4_HEIGHT_MM}mm`;
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
    fixation.style.left = `${CENTER_X}mm`;
    fixation.style.top = `${CENTER_Y}mm`;
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
    onProgress,
  } = options;

  // Create PDF in landscape mode
  const pdf = new jsPDF({
    orientation: 'landscape',
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
        showFixation
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

      pdf.addImage(imgData, 'PNG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM);
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
