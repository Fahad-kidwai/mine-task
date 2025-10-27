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


function CustomSlider({ value, onChange, disabled, min, max }) {
  const [isDragging, setIsDragging] = useState(false);

  const percentage = ((value - min) / (max - min)) * 100;

  const updateValue = (clientX, trackElement) => {
    if (!trackElement || disabled) return;
    
    const rect = trackElement.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
    const newValue = Math.round((percentage / 100) * (max - min) + min);
    
    if (newValue !== value) {
      onChange(newValue);
    }
  };

  const handleMouseDown = (e) => {
    if (disabled) return;
    setIsDragging(true);
    const track = e.currentTarget.querySelector('.slider-track');
    updateValue(e.clientX, track);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const track = document.querySelector('.slider-track');
      updateValue(e.clientX, track);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, disabled, value, onChange, min, max]);

  return (
    <div 
      className={`relative w-full touch-none select-none items-center flex flex-row p-4 rounded-lg bg-[#292d2e] ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onMouseDown={handleMouseDown}
    >
      <label className="text-sm font-semibold leading-none mr-3.5 text-white sm:mr-3">
        {value}
      </label>
      <div className="relative h-2.5 w-full grow rounded-full bg-[#3a4142] slider-track cursor-pointer">
        {/* Progress fill */}
        <div 
          className="absolute h-full bg-gradient-to-r from-[#31ee88] to-[#9fe871] rounded-full pointer-events-none"
          style={{ 
            width: `${percentage}%`,
            transition: isDragging ? 'none' : 'width 75ms'
          }}
        />
        {/* Thumb */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-6 bg-white rounded-lg pointer-events-none"
          style={{
            left: `${percentage}%`,
            cursor: isDragging ? 'grabbing' : 'grab',
            transition: isDragging ? 'none' : 'left 75ms',
            backgroundImage: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAwCAYAAAACYxrZAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAHKADAAQAAAABAAAAMAAAAABgjDanAAAAjklEQVRYCe2TuwqAMAxFfeAi6v//p4OLr6QoBUmvdFM4hdCQm4T2tGkaFgQgAAEIQOCNQCsSRtNms07kRNJhwdVsi0TVbLICpUf9PNabLSVRNVS3L/VL8Ss5z91PU1qnCYOZOlRU63WOdI9EYv8noH4ic6jelzlUdNDqCDCHdbxyNnOYWeBBAAIQgMD3CdzithhMnuqNvgAAAABJRU5ErkJggg==")`,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center center',
            boxShadow: 'rgba(116, 115, 115, 0.25) 0px 0px 4px 0px',
          }}
        />
      </div>
      <label className="text-sm font-semibold leading-none text-gray-400 ml-3">
        {max}
      </label>
    </div>
  );
}

function App() {
  const [minesCount, setMinesCount] = useState(3);
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
            
            <div className="flex items-center bg-[#292d2e] rounded-lg px-3 py-1 border border-gray-700  mb-3 ">
              <img 
                src="https://flagcdn.com/w20/in.png" 
                alt="INR" 
                className="w-6 h-4 mr-2"
              />
              <input  value={betAmount} onChange={(e) => setBetAmount(Number(e.target.value))} className="bg-transparent text-white text-sm font-bold outline-none w-full" />
              
              <div className="flex items-center gap-2 ml-2">
                <button 
                  className="px-3 py-1.5 rounded bg-[#3a4142] hover:bg-[#333644] text-white text-sm font-medium transition"
                  onClick={() => setBetAmount(Math.floor(betAmount / 2))}
                >
                  1/2
                </button>
                <button 
                  className="px-3 py-1.5 rounded bg-[#3a4142] hover:bg-[#333644] text-white text-sm font-medium transition"
                  onClick={() => setBetAmount(betAmount * 2)}
                >
                  2×
                </button>
                <div className="flex flex-col gap-0.1 bg-[#3a4142] rounded-lg px-3 py-1 ">
                  <button 
                    className=" hover:bg-[#333644] rounded transition"
                    onClick={() => setBetAmount(betAmount + 1)}
                  >
                    <svg className="w-3 h-3 text-gray-400" viewBox="0 0 28 28" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button 
                    className=" hover:bg-[#333644] rounded transition"
                    onClick={() => setBetAmount(Math.max(0, betAmount - 1))}
                  >
                    <svg className="w-3 h-3 text-gray-400" viewBox="0 0 28 28" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setBetAmount(10)}
                className="bg-[#3a4142] py-2 rounded-lg text-gray-300 hover:bg-[#2d3142] transition border border-gray-700"
              >
                10
              </button>
              <button
                onClick={() => setBetAmount(100)}
                className="bg-[#3a4142] py-2 rounded-lg text-gray-300 hover:bg-[#2d3142] transition border border-gray-700"
              >
                100
              </button>
              <button
                onClick={() => setBetAmount(1000)}
                className="bg-[#3a4142] py-2 rounded-lg text-gray-300 hover:bg-[#2d3142] transition border border-gray-700"
              >
                1.0k
              </button>
              <button
                onClick={() => setBetAmount(10000)}
                className="bg-[#3a4142] py-2 rounded-lg text-gray-300 hover:bg-[#2d3142] transition border border-gray-700"
              >
                10.0k
              </button>
            </div>
          </div>

          {/* Mines Slider */}
          <div className="mb-6">
            <CustomSlider 
              value={minesCount}
              onChange={setMinesCount}
              disabled={gameState === 'playing'}
              min={0}
              max={24}
            />
          </div>

          {/* Bet Button */}
          <button
            onClick={gameState === 'idle' ? handleBet : initializeGame}
            disabled={gameState === 'playing' && revealedTiles.length === 0}
            className="w-full  bg-green-primary hover:bg-green-glow text-black font-bold py-4 rounded-lg transition-all glow-green disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {gameState === 'playing' ? 'Cash Out' : 'Bet'}
          </button>

          {/* Demo Mode Message */}
          {betAmount === 0 && (
            <div className="mt-4 bg-[#3a4142] border border-gray-700 rounded-lg p-3 flex items-center gap-2">
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
            <div className="bg-[#3a4142] rounded-lg px-6 py-2 ">
              <span className="text-gray-400 text-sm">0x</span>
            </div>
            <div className="bg-[#3a4142] rounded-lg px-6 py-2 ">
              <span className="text-gray-400 text-sm">0x</span>
            </div>
          </div>

          {/* Game Grid */}
          <div className="relative z-10">
            {/* Decorative Images */}
            <img 
              src={IMAGES.boxBg1} 
              alt="" 
              className="absolute left-2 -top-14 w-36 h-32 object-contain pointer-events-none opacity-70 z-20"
            />
            <img 
              src={IMAGES.boxBg2} 
              alt="" 
              className="absolute -right-0 -top-16 w-36 h-32 object-contain pointer-events-none opacity-70 z-20"
            />
            
            <div className="grid grid-cols-5 gap-3 p-6 bg-[#3a4142]/50 rounded-xl border border-[#3a4142] backdrop-blur-sm">
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
        ${!revealed ? 'bg-[#444c4d] hover:bg-[#545F60] shadow-lg' : ''}
        ${revealed && tile.hasMine ? 'bg-[#444C4D]' : ''}
        ${revealed && !tile.hasMine ? 'bg-gradient-to-br from-purple-500 to-purple-700 shadow-purple-500/50' : ''}
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

