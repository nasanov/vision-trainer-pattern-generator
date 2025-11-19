# Vision Trainer Pattern Generator

A web-based application for generating customizable letter patterns for vision training exercises. Built with React 19 and Vite, this tool allows you to create, customize, and print A4 landscape patterns with various configuration options.

![Application Screenshot](./docs/images/app-screenshot.png)
*Main application interface - [Image to be added]*

## Features

### Pattern Generation
- **Random Letter Grid**: Generate random letter patterns across an A4 landscape page
- **Customizable Grid Layout**: Adjust rows and columns to control letter density
- **Number Inclusion**: Option to include numbers (0-9) alongside letters
- **Duplicate Control**: Choose whether to allow duplicate characters in the pattern
- **Instant Regeneration**: Quickly generate new patterns with a single click

![Pattern Examples](./docs/images/pattern-examples.png)
*Different pattern configurations - [Image to be added]*

### Visual Customization
- **Adjustable Font Size**: Control the size of letters from 12pt to 72pt
- **Font Family Selection**: Choose from multiple font families for optimal readability
- **Color Options**: Customize letter colors with a color picker
- **Grid Toggle**: Show/hide alignment grid for precise positioning
- **Center Fixation Point**: Optional fixation point for focused vision exercises

![Customization Options](./docs/images/customization-panel.png)
*Sidebar customization controls - [Image to be added]*

### Interactive Editing
- **Drag and Drop**: Click and drag individual letters to reposition them
- **Real-time Preview**: See changes instantly as you adjust settings
- **Individual Letter Editing**: Modify specific letters' properties (font, size, color)

![Drag and Drop Demo](./docs/images/drag-drop-demo.gif)
*Interactive letter positioning - [Image to be added]*

### Preset Management
- **Save Presets**: Store your favorite configurations for quick access
- **Load Presets**: Instantly apply saved settings
- **Delete Presets**: Remove presets you no longer need
- **Local Storage**: All presets are saved locally in your browser

![Preset Manager](./docs/images/preset-manager.png)
*Preset management interface - [Image to be added]*

### PDF Export & Printing
- **Multi-Page PDF Generation**: Export 1-30 pages of randomly generated patterns in a single PDF
- **Progress Tracking**: Real-time progress bar showing generation status
- **Batch Generation**: Each page contains a unique random pattern based on your settings
- **Smart Export**: Grid lines excluded, fixation point included (if enabled)
- **Automatic Naming**: PDFs are named with page count and date (e.g., `vision-trainer-patterns_5pages_2025-11-19.pdf`)
- **Optimized for A4 Landscape**: All outputs designed for standard A4 paper
- **One-Click Print**: Built-in print functionality for current pattern
- **Exact Color Reproduction**: Colors preserved in both PDF and print output

![PDF Export](./docs/images/pdf-export.png)
*PDF export with progress indicator - [Image to be added]*

## Getting Started

### Prerequisites

- **Node.js**: Version 16 or higher
- **npm**: Version 7 or higher (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vision-trainer-pattern-generator.git
   ```

2. **Navigate to the project directory**
   ```bash
   cd vision-trainer-pattern-generator
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

### Running the Application

#### Development Mode

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

#### Production Build

Build the application for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

### Running Linter

Check code quality with ESLint:

```bash
npm run lint
```

## Usage Guide

### Basic Workflow

1. **Configure Page Settings**: Use the sidebar to adjust font size, family, color, and grid dimensions
2. **Generate Pattern**: Click the "Regenerate Pattern" button to create a new random pattern
3. **Customize Layout**: Drag individual letters to fine-tune positioning
4. **Save Preset** (Optional): Save your configuration for future use
5. **Export or Print**:
   - **PDF Export**: Set the number of copies (1-30) and click "Download PDF" to generate multiple unique patterns
   - **Print**: Click "Print Layout" or use Ctrl/Cmd + P to print the current pattern

### PDF Export Workflow

1. **Configure your pattern**: Set up all desired settings (colors, fonts, fixation point, etc.)
2. **Set number of copies**: Enter the number of pages you want (1-30) in the "Copies" input field
3. **Click "Download PDF"**: The generation process will begin
4. **Monitor progress**: A progress modal will show you the current page being generated
5. **Save your PDF**: Once complete, the PDF will automatically download to your default downloads folder

**Note**: Each page in the PDF will have the same styling but different randomly generated letter patterns.

### Keyboard Shortcuts

- **Ctrl/Cmd + P**: Print the current pattern
- **Grid Toggle**: Use the toolbar toggle to show/hide the alignment grid

### Tips for Best Results

- Start with a grid size of 10x15 for a balanced pattern
- Use larger font sizes (30pt+) for distance vision training
- Enable the fixation point for focus exercises
- Save multiple presets for different training scenarios
- Generate 5-10 PDF pages at once for a variety of training patterns
- Use "Allow Duplicates" when generating many pages to ensure variety
- Include numbers for additional complexity in vision training exercises

## Technology Stack

- **React 19.2**: Modern React with hooks
- **Vite 7.2**: Fast build tool and development server
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library
- **jsPDF**: PDF document generation
- **html2canvas**: HTML to canvas conversion for PDF export
- **ESLint**: Code quality and linting

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Top navigation bar with PDF export controls
│   ├── Sidebar/        # Settings and controls
│   ├── PreviewArea.tsx # Main pattern display
│   ├── ProgressModal.tsx # PDF generation progress indicator
│   └── Canvas/         # Canvas rendering components
├── generators/         # Pattern generation logic
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
├── utils/             # Utility functions and constants
│   ├── pdfGenerator.ts # Multi-page PDF generation logic
│   ├── characterPool.ts # Character randomization
│   └── constants.ts    # App-wide constants
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

## Browser Compatibility

- Chrome/Edge: ✅ Fully supported
- Firefox: ✅ Fully supported
- Safari: ✅ Fully supported
- Opera: ✅ Fully supported

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Support the Project

If you find this tool helpful, consider supporting its development:

<a href="https://www.buymeacoffee.com/nurs.asanov" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" >
</a>

---

Made with ❤️ for vision training enthusiasts
