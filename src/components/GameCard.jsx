import { useState } from 'react';
import { Play, Star, Flame, Users, Clock } from 'lucide-react';

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
        return 'card-featured';
      case 'compact':
        return 'game-card-compact';
      default:
        return 'game-card';
    }
  };

  const getStatusBadge = () => {
    if (game.isHot) {
      return (
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-red-600 to-red-500 rounded-full text-xs font-medium">
          <Flame size={12} />
          <span>HOT</span>
        </div>
      );
    }
    
    if (game.isNew) {
      return (
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-full text-xs font-medium">
          <Star size={12} />
          <span>NEW</span>
        </div>
      );
    }
    
    if (game.isLive) {
      return (
        <div className="absolute top-2 right-2 live-indicator">
          <div className="live-dot"></div>
          <span>LIVE</span>
        </div>
      );
    }
    
    return null;
  };

  const getGameStats = () => {
    if (!showStats || !game.stats) return null;
    
    return (
      <div className="flex items-center justify-between text-xs text-gray-400 mt-2 pt-2 border-t border-white/10">
        {game.stats.players && (
          <div className="flex items-center gap-1">
            <Users size={12} />
            <span>{game.stats.players}</span>
          </div>
        )}
        {game.stats.lastWin && (
          <div className="flex items-center gap-1">
            <span className="text-emerald-400">💰 ${game.stats.lastWin}</span>
          </div>
        )}
        {game.stats.avgTime && (
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{game.stats.avgTime}</span>
          </div>
        )}
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={() => !disabled && onClick?.(game)}
        disabled={disabled}
        className={`${getVariantClasses()} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center gap-3 p-3">
          <div className="game-card-image w-12 h-12 rounded-lg flex-shrink-0">
            {game.icon && <span className="text-lg">{game.icon}</span>}
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

  return (
    <div className={`${getVariantClasses()} ${disabled ? 'opacity-50' : ''}`}>
      <div className="game-card-image relative">
        {game.image ? (
          <>
            <img
              src={game.image}
              alt={game.name}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="loading-spinner"></div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-content-center">
            <span className="text-4xl">{game.icon || '🎮'}</span>
          </div>
        )}
        
        {getStatusBadge()}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-2 left-2 right-2">
            <button
              onClick={() => !disabled && onClick?.(game)}
              disabled={disabled}
              className="btn btn-primary btn-sm w-full"
            >
              <Play size={14} />
              Play Now
            </button>
          </div>
        </div>
      </div>
      
      <div className="game-card-content">
        <h3 className="game-card-title">{game.name}</h3>
        {game.subtitle && (
          <p className="game-card-subtitle">{game.subtitle}</p>
        )}
        {game.provider && (
          <div className="text-xs text-gray-500 mb-2">by {game.provider}</div>
        )}
        
        {getGameStats()}
        
        {variant !== 'featured' && (
          <button
            onClick={() => !disabled && onClick?.(game)}
            disabled={disabled}
            className="btn btn-secondary btn-sm w-full mt-3"
          >
            <Play size={14} />
            {disabled ? 'Coming Soon' : 'Play'}
          </button>
        )}
      </div>
    </div>
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
    <div className={variant === 'compact' ? 'space-y-2' : 'grid-auto'}>
      {games.map((game) => (
        <GameCard
          key={game.id}
          game={game}
          variant={variant}
          onClick={onGameClick}
          showStats={variant === 'default'}
        />
      ))}
    </div>
  );
};

export default GameCard;