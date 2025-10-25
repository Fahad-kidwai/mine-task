# Mines Game

A React-based implementation of the Mines game with a beautiful, modern UI using TailwindCSS.

## Features

- 🎮 5x5 grid with customizable mine count (1-24)
- 💎 Beautiful gem and mine animations
- 🎯 Demo mode for practice (bet with 0)
- 🏆 Win/Loss detection with modal popups
- 📱 Responsive design
- ✨ Smooth animations and transitions

## Game Rules

1. Select the number of mines (1-24) using the slider
2. Set your bet amount (or leave it at 0 for demo mode)
3. Click the "Bet" button to start the game
4. Click on tiles to reveal them:
   - 💎 Gem = Safe tile, keep playing
   - 💣 Mine = Game over, you lose
5. Win by revealing all safe tiles without hitting a mine

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Technologies Used

- ⚛️ React 18
- 🎨 TailwindCSS
- ⚡ Vite
- 🎭 CSS Animations

## Game Assets

All game assets are loaded from external URLs:
- Background image
- Decorative images
- Gem sprite
- Mine sprite

## Project Structure

```
mines-game/
├── src/
│   ├── App.jsx          # Main game component
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles and animations
├── index.html           # HTML template
├── package.json         # Dependencies
├── tailwind.config.js   # TailwindCSS configuration
├── vite.config.js       # Vite configuration
└── README.md           # This file
```

## License

MIT

