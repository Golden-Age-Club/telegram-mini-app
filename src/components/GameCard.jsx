import React from 'react';
import { Play } from 'lucide-react';

const GameCard = ({ 
  game, 
  variant = 'default', 
  onClick, 
  disabled = false,
  showStats = false 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const getVariantClasses = () => {
    switch (variant) {
      case 'featured':
        return 'game-card-featured';
      case 'compact':
        return 'game-card-compact';
      default:
        return 'game-card-clean';
    }
  };

  const getStatusBadge = () => {
    if (game.isHot) {
      return (
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-red-600 to-red-500 rounded-full text-xs font-medium z-10">
          <Flame size={12} />
          <span>HOT</span>
        </div>
      );
    }
    
    if (game.isNew) {
      return (
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-full text-xs font-medium z-10">
          <Star size={12} />
          <span>NEW</span>
        </div>
      );
    }
    
    if (game.isLive) {
      return (
        <div className="absolute top-2 right-2 live-indicator z-10">
          <div className="live-dot"></div>
          <span>LIVE</span>
        </div>
      );
    }
    
    return null;
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={() => !disabled && onClick?.(game)}
        disabled={disabled}
        className={`${getVariantClasses()} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center gap-3 p-3">
          <div className="game-card-image w-12 h-12 rounded-lg flex-shrink-0 overflow-hidden relative">
            {game.image ? (
              <img
                src={game.image}
                alt={game.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 ${game.image ? 'hidden' : 'flex'}`}
            >
              <span className="text-lg">{game.icon}</span>
            </div>
          </div>
          <div className="flex-1 text-left">
            <div className="game-card-title text-sm">{game.name}</div>
            <div className="game-card-subtitle text-xs">{game.provider || game.subtitle}</div>
          </div>
          <Play size={16} className="text-gray-400 flex-shrink-0" />
        </div>
      </button>
    );
  }

  // Clean image-only design
  return (
    <button
      onClick={() => !disabled && onClick?.(game)}
      disabled={disabled}
      className={`${getVariantClasses()} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} transition-all duration-300 relative overflow-hidden rounded-2xl`}
    >
      <div className="game-card-image-clean relative w-full">
        {game.image ? (
          <>
            <img
              src={game.image}
              alt={game.name}
              className={`w-full h-full object-cover transition-all duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => {
                console.log(`✅ Successfully loaded image for ${game.name}`);
                setImageLoaded(true);
              }}
              onError={(e) => {
                console.log(`❌ Failed to load image for ${game.name}:`, game.image);
                e.target.style.display = 'none';
                setImageLoaded(true);
              }}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="loading-spinner"></div>
              </div>
            )}
            {/* Fallback to icon if image fails to load */}
            {imageLoaded && !game.image && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <span className="text-4xl">{game.icon || '🎮'}</span>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 h-full aspect-[4/3]">
            <span className="text-4xl">{game.icon || '🎮'}</span>
          </div>
        )}
        
        {getStatusBadge()}
      </div>
    </button>
  );
};

// Game Grid Component
export const GameGrid = ({ games, variant = 'default', onGameClick, loading = false }) => {
  if (loading) {
    return (
      <div className="grid-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="game-card animate-pulse">
            <div className="game-card-image bg-gray-700"></div>
            <div className="game-card-content">
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-2/3 mb-3"></div>
              <div className="h-8 bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div 
      className="group rounded-2xl overflow-hidden border border-[var(--border)] bg-black/40 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-[4/5] w-full">
        <img
          src={image}
          alt={alt || name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex flex-col items-center gap-1">
            <Play className="w-8 h-8 text-emerald-400" />
            <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-200">
              Play now
            </span>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 rounded-2xl  opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="px-2 py-1">
        <span className="block text-[10px] font-semibold text-white truncate">
          {name}
        </span>
      </div>
    </div>
  );
};

export default GameCard;
