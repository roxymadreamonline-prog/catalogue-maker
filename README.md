# Catalogue Maker

A premium Apple-style catalogue editor for Electron. Create beautiful product catalogues with live A4 preview, smart layouts, and professional export options.

## Features

- **Clean Apple-Style Interface** - Minimal, calm design inspired by Apple Keynote and Pages
- **Live A4 Preview** - See your catalogue in real-time with authentic A4 proportions
- **Smart Layout System** - Auto-adjusting columns, gaps, card sizes, and text
- **Product Cards** - Image + multiline text with full drag-and-drop support
- **Mini Thumbnails** - Add detail/preview thumbnails in the corner of cards
- **Multi-Page Support** - Create unlimited pages with independent layouts
- **Header System** - Optional headers with multiple style options (plain, top strip, soft wave)
- **File Manager** - Organize and manage your assets permanently
- **Professional Export** - PNG and PDF export with print-ready quality
- **Multiple Themes** - Default, Dark, and Glass (with blur and opacity)
- **Multilingual Support** - English and Bulgarian
- **Auto-Save** - Automatic session restoration

## Tech Stack

- **Electron** - Desktop application framework
- **Node.js** - Backend runtime
- **HTML/CSS/JavaScript** - UI and logic
- **electron-builder** - Build and packaging

## Installation

```bash
git clone https://github.com/roxymadreamonline-prog/catalogue-maker.git
cd catalogue-maker
npm install
```

## Development

```bash
npm start
```

## Building

### Windows EXE Installer
```bash
npm run dist:win
```

### Portable EXE
```bash
npm run dist:portable
```

### All Platforms
```bash
npm run dist
```

## Project Structure

```
catalogue-maker/
├── main.js                 # Electron main process
├── preload.js              # Preload script (IPC bridge)
├── src/
│   ├── index.html          # Main HTML
│   ├── styles/
│   │   ├── global.css      # Global styles
│   │   ├── layout.css      # Layout system
│   │   ├── components.css  # Component styles
│   │   └── themes.css      # Theme definitions
│   └── js/
│       ├── app.js          # Main app controller
│       ├── projects.js     # Project management
│       ├── pages.js        # Page system
│       ├── cards.js        # Card system
│       ├── headers.js      # Header system
│       ├── filemanager.js  # File manager
│       ├── preview.js      # A4 preview
│       ├── export.js       # Export system
│       └── themes.js       # Theme management
├── assets/                 # App assets
└── package.json            # Dependencies and scripts
```

## Usage

1. **Create a New Catalogue** - Start with a blank project
2. **Add Pages** - Use the page controls to add multiple pages
3. **Configure Layout** - Adjust columns, gaps, and card sizes
4. **Add Images** - Import from file manager or drag-and-drop
5. **Add Thumbnails** - Optional detail thumbnails on cards
6. **Edit Text** - Click captions to edit multiline text
7. **Set Header** - Optional header with style options
8. **Choose Theme** - Select from Default, Dark, or Glass
9. **Export** - Save as PNG or PDF

## Card System Features

### Main Image
- Supports JPG, PNG, PSD, PDF
- object-fit: cover
- Scales with card size

### Mini Thumbnail
- Optional second image in corner
- Positioned at top-right or other corners
- Scales independently
- Can be toggled on/off

### Caption Text
- Multiline support
- Click-to-edit
- Auto-fit to card width
- Center aligned

## Keyboard Shortcuts

- `Cmd/Ctrl + S` - Save project
- `Cmd/Ctrl + O` - Open project
- `Cmd/Ctrl + E` - Export
- `Cmd/Ctrl + F` - Toggle fullscreen
- `Delete` - Delete selected card
- `Cmd/Ctrl + D` - Duplicate selected card

## Design System

### Colors
- Background: `#F5F5F7`
- Panels: `#FFFFFF`
- Borders: `#E5E5EA`
- Text Primary: `#1D1D1F`
- Text Secondary: `#6E6E73`
- Accent: `#007AFF`

### Typography
- Font Family: `-apple-system, "SF Pro Display", "Segoe UI", sans-serif`
- Weights: Regular (400), Medium (500), Semibold (600)

### UI Elements
- Border Radius: 12–18px
- Soft Shadow: `0 4px 20px rgba(0,0,0,0.06)`
- Smooth Transitions: `0.2s ease-out`

## License

MIT
