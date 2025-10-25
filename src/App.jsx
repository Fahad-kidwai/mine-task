import { useState, useEffect } from 'react';

const GRID_SIZE = 5;
const TOTAL_TILES = GRID_SIZE * GRID_SIZE;

const IMAGES = {
  background: 'https://hash.game/modules/games2/assets/bg-mines-dark-b7d1571a.png',
  boxBg1: 'https://hash.game/modules/games2/assets/box-bg1-dark-baa28890.png',
  boxBg2: 'https://hash.game/modules/games2/assets/box-bg2-dark-e53f83c0.png',
  gem: 'https://hash.game/modules/games2/assets/gems-873c019a.png',
  mine: 'https://hash.game/modules/games2/assets/mines-1-0c3e7e76.png',
};

function App() {
  const [minesCount, setMinesCount] = useState(4);
  const [betAmount, setBetAmount] = useState(0);
  const [gameState, setGameState] = useState('idle'); // idle, playing, won, lost
  const [tiles, setTiles] = useState([]);
  const [revealedTiles, setRevealedTiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tab, setTab] = useState('manual');

  // Initialize tiles
  const initializeGame = () => {
    const newTiles = Array(TOTAL_TILES).fill(null).map((_, index) => ({
      index,
      hasMine: false,
      revealed: false,
    }));
    setTiles(newTiles);
    setRevealedTiles([]);
    setGameState('idle');
    setShowModal(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  // Place mines randomly
  const placeMines = () => {
    const newTiles = Array(TOTAL_TILES).fill(null).map((_, index) => ({
      index,
      hasMine: false,
      revealed: false,
    }));

    const minePositions = new Set();
    while (minePositions.size < minesCount) {
      const randomIndex = Math.floor(Math.random() * TOTAL_TILES);
      minePositions.add(randomIndex);
    }

    minePositions.forEach(index => {
      newTiles[index].hasMine = true;
    });

    return newTiles;
  };

  // Handle bet button click
  const handleBet = () => {
      const newTiles = placeMines();
      setTiles(newTiles);
      setRevealedTiles([]);
      setGameState('playing');
      setShowModal(false);
  };

  // Handle tile click
  const handleTileClick = (index) => {
    if (gameState !== 'playing' || revealedTiles.includes(index)) {
      return;
    }

    const clickedTile = tiles[index];
    const newRevealedTiles = [...revealedTiles, index];
    setRevealedTiles(newRevealedTiles);

    if (clickedTile.hasMine) {
      // Hit a mine - game over
      setGameState('lost');
      setShowModal(true);
      // Reveal all tiles
      setTimeout(() => {
        setRevealedTiles(tiles.map(t => t.index));
      }, 500);
    } else {
      // Safe tile - check if won
      const totalSafeTiles = TOTAL_TILES - minesCount;
      if (newRevealedTiles.length === totalSafeTiles) {
        setGameState('won');
        setShowModal(true);
        // Reveal all tiles
        setTimeout(() => {
          setRevealedTiles(tiles.map(t => t.index));
        }, 500);
      }
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gray-[#232626]"
    >
      <div className="container mx-auto flex items-start justify-center relative z-10 max-w-7xl">
        {/* Unified Container */}
        <div className="flex flex-col lg:flex-row rounded-xl overflow-hidden border-2 border-gray-700 shadow-2xl">
          {/* Left Panel - Controls */}
          <div className="bg-[#323738] p-6 w-full lg:w-96 flex flex-col">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setTab('manual')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                tab === 'manual'
                  ? 'bg-transparent text-white border-b-2 border-green-primary'
                  : 'bg-transparent text-gray-400 hover:text-white'
              }`}
            >
              Manual
            </button>
            <button
              onClick={() => setTab('auto')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                tab === 'auto'
                  ? 'bg-transparent text-white border-b-2 border-green-primary'
                  : 'bg-transparent text-gray-400 hover:text-white'
              }`}
            >
              Auto
            </button>
          </div>

          {/* Amount Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <label className="text-gray-300 font-medium">Amount</label>
              <div className="w-4 h-4 border-2 border-gray-400 rounded-full flex items-center justify-center cursor-help">
                <span className="text-gray-400 text-xs">i</span>
              </div>
            </div>
            
            <div className="flex gap-2 mb-3">
              <div className="flex-1 flex items-center bg-[#252836] rounded-lg px-3 py-3 border border-gray-700">
                <img 
                  src="https://flagcdn.com/w20/in.png" 
                  alt="INR" 
                  className="w-6 h-4 mr-2"
                />
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  className="bg-transparent text-white text-lg font-semibold outline-none w-full"
                  placeholder="0"
                />
              </div>
              <button 
                className="bg-[#252836] px-4 py-2 rounded-lg text-white hover:bg-[#2d3142] transition border border-gray-700"
              >
                1/2
              </button>
              <button 
                className="bg-[#252836] px-4 py-2 rounded-lg text-white hover:bg-[#2d3142] transition border border-gray-700"
              >
                2×
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <button
                className="bg-[#252836] py-2 rounded-lg text-gray-300 hover:bg-[#2d3142] transition border border-gray-700"
              >
                10
              </button>
              <button
                className="bg-[#252836] py-2 rounded-lg text-gray-300 hover:bg-[#2d3142] transition border border-gray-700"
              >
                100
              </button>
              <button
                className="bg-[#252836] py-2 rounded-lg text-gray-300 hover:bg-[#2d3142] transition border border-gray-700"
              >
                1.0k
              </button>
              <button
                className="bg-[#252836] py-2 rounded-lg text-gray-300 hover:bg-[#2d3142] transition border border-gray-700"
              >
                10.0k
              </button>
            </div>
          </div>

          {/* Mines Slider */}
          <div className="mb-6">
            <label className="text-gray-300 font-medium mb-3 block">Mines</label>
            <div className="relative">
              <input
                type="range"
                min="1"
                max="24"
                value={minesCount}
                onChange={(e) => setMinesCount(Number(e.target.value))}
                disabled={gameState === 'playing'}
                className="w-full"
                style={{
                  background: `linear-gradient(to right, #00e701 0%, #00e701 ${((minesCount - 1) / 23) * 100}%, #2d3142 ${((minesCount - 1) / 23) * 100}%, #2d3142 100%)`
                }}
              />
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>{minesCount}</span>
                <span>24</span>
              </div>
            </div>
          </div>

          {/* Bet Button */}
          <button
            onClick={gameState === 'idle' ? handleBet : initializeGame}
            disabled={gameState === 'playing' && revealedTiles.length === 0}
            className="w-full bg-green-primary hover:bg-green-glow text-black font-bold py-4 rounded-lg transition-all glow-green disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {gameState === 'playing' ? 'Cash Out' : 'Bet'}
          </button>

          {/* Demo Mode Message */}
          {betAmount === 0 && (
            <div className="mt-4 bg-[#252836] border border-gray-700 rounded-lg p-3 flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-gray-400 text-xs">i</span>
              </div>
              <span className="text-gray-400 text-sm">
                Betting with 0 will enter demo mode.
              </span>
            </div>
          )}
          </div>

          {/* Right Panel - Game Grid */}
          <div 
            className="flex-1 flex flex-col items-center justify-center border-l-[1px] border-gray-700 relative p-8 min-h-full lg:min-w-[700px]"
            style={{
              backgroundImage: `url(${IMAGES.background})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Decorative background overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 pointer-events-none" />
          
          {/* Top Info Section */}
          <div className="w-full mb-6 flex justify-start gap-4 relative z-10">
            <div className="bg-[#1e2230] rounded-lg px-6 py-2 border border-gray-800">
              <span className="text-gray-400 text-sm">0x</span>
            </div>
            <div className="bg-[#1e2230] rounded-lg px-6 py-2 border border-gray-800">
              <span className="text-gray-400 text-sm">0x</span>
            </div>
          </div>

          {/* Game Grid */}
          <div className="relative z-10">
            {/* Decorative Images */}
            <img 
              src={IMAGES.boxBg1} 
              alt="" 
              className="absolute -left-8 -top-14 w-32 h-32 object-contain pointer-events-none opacity-70 z-20"
            />
            <img 
              src={IMAGES.boxBg2} 
              alt="" 
              className="absolute -right-8 -top-14 w-32 h-32 object-contain pointer-events-none opacity-70 z-20"
            />
            
            <div className="grid grid-cols-5 gap-3 p-6 bg-[#1e2230]/50 rounded-xl border border-gray-800 backdrop-blur-sm">
              {tiles.map((tile, index) => (
                <Tile
                  key={index}
                  tile={tile}
                  revealed={revealedTiles.includes(index)}
                  onClick={() => handleTileClick(index)}
                  gameState={gameState}
                />
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal
          gameState={gameState}
          onClose={initializeGame}
        />
      )}
    </div>
  );
}

// Tile Component
function Tile({ tile, revealed, onClick, gameState }) {
  const isClickable = gameState === 'playing' && !revealed;

  return (
    <button
      onClick={onClick}
      disabled={!isClickable}
      className={`
        w-16 h-16 md:w-20 md:h-20 rounded-lg transition-all duration-300
        ${revealed ? 'tile-flip' : ''}
        ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
        ${!revealed ? 'bg-[#3a4456] hover:bg-[#4a5466] shadow-lg' : ''}
        ${revealed && tile.hasMine ? 'bg-[#2d3142]' : ''}
        ${revealed && !tile.hasMine ? 'bg-gradient-to-br from-purple-500 to-purple-700 shadow-purple-500/50' : ''}
        border-2 border-gray-700/50
      `}
    >
      {revealed && (
        <div className="w-full h-full flex items-center justify-center">
          {tile.hasMine ? (
            <img 
              src={IMAGES.mine} 
              alt="Mine" 
              className="w-12 h-12 md:w-16 md:h-16 object-contain animate-pulse"
            />
          ) : (
            <img 
              src={IMAGES.gem} 
              alt="Gem" 
              className="w-10 h-10 md:w-14 md:h-14 object-contain"
            />
          )}
        </div>
      )}
    </button>
  );
}

// Modal Component
function Modal({ gameState, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1e2230]/60 rounded-2xl p-8 max-w-md w-full border-2 border-gray-700 shadow-2xl modal-enter">
        <div className="text-center">
          {gameState === 'won' ? (
            <>
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-4xl font-bold text-green-primary mb-4">You Won!</h2>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">💥</div>
              <h2 className="text-4xl font-bold text-red-500 mb-4">You Lost!</h2>
            </>
          )}
          
          <button
            onClick={onClose}
            className="w-full bg-green-primary hover:bg-green-glow text-black font-bold py-4 rounded-lg transition-all glow-green"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

