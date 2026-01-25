import React, { useState } from 'react';
import { Play, Flame, Star } from 'lucide-react';

const GameCard = ({ 
  game, 
  variant = 'default', 
  onClick, 
  disabled = false,
  showStats = false,
  isLoading = false
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (isLoading) {
    return (
      <div className={`game-card animate-pulse ${variant === 'compact' ? 'flex items-center gap-3 p-3' : 'rounded-xl overflow-hidden w-full'}`}>
        {variant === 'compact' ? (
          <>
            <div className="game-card-image bg-gray-700 w-12 h-12 rounded-lg flex-shrink-0"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
          </>
        ) : (
          <>
            <div className="relative w-full pt-[75%] bg-gray-700"></div>
            <div className="p-2 bg-[#1a1b26] border-t border-white/5">
               <div className="h-3 bg-gray-700 rounded w-3/4"></div>
            </div>
          </>
        )}
      </div>
    );
  }

  if (!game) return null;

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
      className={`${getVariantClasses()} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95 cursor-pointer'} group transition-all duration-300 flex flex-col relative overflow-hidden rounded-2xl bg-[#1a1b26] w-full`}
    >
      <div className="relative w-full pt-[75%] bg-gray-800">
        <div className="absolute inset-0 w-full h-full">
          {game.image ? (
            <>
              <img
                src={game.image}
                alt={game.name}
                className={`w-full h-full object-cover transition-all duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => {
                  setImageLoaded(true);
                }}
                onError={(e) => {
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
            <div className="flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 h-full w-full">
              <span className="text-4xl">{game.icon || '🎮'}</span>
            </div>
          )}
          
          {/* Play Icon Overlay on Hover */}
          {!disabled && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 shadow-lg shadow-emerald-500/30">
                <Play size={20} fill="currentColor" className="ml-1" />
              </div>
            </div>
          )}

          {getStatusBadge()}
        </div>
      </div>

      <div className="w-full p-2 text-left border-t border-white/5 bg-[#1a1b26]">
        <div className="text-[11px] leading-tight font-medium text-gray-300 truncate">{game.name}</div>
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
    <div className="grid-auto">
      {games.map((game) => (
        <GameCard
          key={game.id || game.game_id}
          game={game}
          variant={variant}
          onClick={onGameClick}
        />
      ))}
    </div>
  );
};

export default GameCard;
