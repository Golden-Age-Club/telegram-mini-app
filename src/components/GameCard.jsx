import React, { useState, useEffect } from 'react';
import { Play, Flame, Star, Trophy, Radio } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const toCamelCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
};

const GameCard = ({ 
  game, 
  variant = 'default', 
  onClick, 
  disabled = false,
  showStats = false,
  isLoading = false
}) => {
  const { t, currentLanguage, i18n, translateText } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [translatedName, setTranslatedName] = useState(game?.name || '');
  const [translatedProvider, setTranslatedProvider] = useState(game?.provider || game?.provider_title || '');

  useEffect(() => {
    if (!game) return;

    const translateField = async (text, setter, type) => {
      if (!text) return;

      // 1. Check if static translation exists
      const camelKey = toCamelCase(text);
      // For providers, check 'providers.Key', for games check 'Key'
      const key = type === 'provider' ? `providers.${camelKey}` : camelKey;
      
      if (i18n.exists(key)) {
        setter(t(key));
        return;
      }

      // 2. If language is English, use original
      if (currentLanguage === 'en') {
        setter(text);
        return;
      }

      // 3. Check local storage cache
      const cacheKey = `trans_${type}_${currentLanguage}_${text}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setter(cached);
        return;
      }

      // 4. Fetch dynamic translation from context API
      try {
        const data = await translateText(text, currentLanguage);
        if (data.translated) {
            setter(data.translated);
            localStorage.setItem(cacheKey, data.translated);
        }
      } catch (err) {
        console.error(`Translation fetch error for ${text}:`, err);
        setter(text); // Fallback
      }
    };

    translateField(game.name, setTranslatedName, 'game');
    translateField(game.provider || game.provider_title, setTranslatedProvider, 'provider');

  }, [game, currentLanguage, i18n, t, translateText]);

  if (isLoading) {
    return (
      <div className={`relative overflow-hidden bg-white/5 border border-white/5 ${variant === 'compact' ? 'rounded-xl p-2 flex items-center gap-3' : 'rounded-2xl aspect-[3/4]'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent shimmer" />
        {variant === 'compact' ? (
          <>
            <div className="w-12 h-12 rounded-lg bg-white/10 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-2/3 bg-white/10 rounded" />
              <div className="h-2 w-1/3 bg-white/10 rounded" />
            </div>
          </>
        ) : (
          <div className="p-3 flex flex-col justify-end h-full space-y-3">
             <div className="h-4 w-3/4 bg-white/10 rounded" />
             <div className="h-3 w-1/2 bg-white/10 rounded" />
          </div>
        )}
      </div>
    );
  }

  if (!game) return null;

  const getStatusBadge = () => {
    if (game.isHot) {
      return (
        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-red-600 to-rose-600 rounded-md text-[10px] font-bold text-white shadow-lg shadow-red-900/20 z-10 border border-white/10">
          <Flame size={10} className="fill-white" />
          <span>{t('game_card.hot')}</span>
        </div>
      );
    }
    
    if (game.isNew) {
      return (
        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-md text-[10px] font-bold text-white shadow-lg shadow-emerald-900/20 z-10 border border-white/10">
          <Star size={10} className="fill-white" />
          <span>{t('game_card.new')}</span>
        </div>
      );
    }
    
    if (game.isLive) {
      return (
        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-md text-[10px] font-bold text-white z-10 border border-red-500/50">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span>{t('game_card.live')}</span>
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
        className={`w-full group relative overflow-hidden rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300 ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.98] cursor-pointer'}`}
      >
        <div className="flex items-center gap-3 p-2">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-black/50 shrink-0 border border-white/10">
            {game.image ? (
              <img
                src={typeof game.image === 'string' ? game.image.trim() : game.image}
                alt={game.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 ${game.image ? 'hidden' : 'flex'}`}>
              <span className="text-xl">{game.icon || '🎮'}</span>
            </div>
          </div>
          
          {/* <div className="flex-1 text-left min-w-0">
            <div className="text-sm font-bold text-white truncate group-hover:text-[var(--gold)] transition-colors">
              {translatedName}
            </div>
            <div className="text-[10px] text-gray-400 truncate flex items-center gap-1">
              {(game.provider || game.provider_title) && (
                <span className="uppercase tracking-wider opacity-70">
                  {translatedProvider}
                </span>
              )}
            </div>
          </div> */}
          
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-[var(--gold)] group-hover:text-black transition-all">
            <Play size={14} fill="currentColor" />
          </div>
        </div>
      </button>
    );
  }

  // Standard Vertical Card
  return (
    <button
      onClick={() => !disabled && onClick?.(game)}
      disabled={disabled}
      className={`group relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-[#1a1b26] border border-white/5 shadow-xl transition-all duration-300 ${
        disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:border-[var(--gold)]/50 hover:shadow-[0_0_20px_rgba(255,215,0,0.15)] hover:-translate-y-1 cursor-pointer'
      }`}
    >
      {/* Image Container */}
      <div className="absolute inset-0 w-full h-full bg-gray-900">
        {game.image ? (
          <>
            <img
              src={typeof game.image === 'string' ? game.image.trim() : game.image}
              alt={game.name}
              loading="lazy"
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.style.display = 'none';
                setImageLoaded(true);
              }}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {/* Fallback Icon */}
            {imageLoaded && !game.image && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-black">
                <span className="text-4xl filter drop-shadow-lg">{game.icon || '🎰'}</span>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-800 to-black">
             <span className="text-4xl filter drop-shadow-lg">{game.icon || '🎰'}</span>
          </div>
        )}
      </div>

      {/* Gradient Overlay - Always visible at bottom for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

      {/* Hover Overlay - Darkens background slightly to make play button pop */}
      {!disabled && (
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px] flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-[var(--gold)] text-black flex items-center justify-center transform scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 shadow-[0_0_20px_rgba(255,215,0,0.4)]">
                <Play size={24} fill="currentColor" className="ml-1" />
            </div>
        </div>
      )}

      {/* Badges */}
      {getStatusBadge()}

      {/* Content Info (Bottom) */}
      <div className="absolute bottom-0 left-0 w-full p-3 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
        <div className="text-left">
            <h3 className="text-sm font-bold text-white truncate drop-shadow-md group-hover:text-[var(--gold)] transition-colors">
                {translatedName}
            </h3>
            <p className="text-[10px] text-gray-300 font-medium uppercase tracking-wider truncate opacity-80">
                {translatedProvider}
            </p>
        </div>
      </div>
    </button>
  );
};

export const GameGrid = ({ games, variant = 'default', onGameClick, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <GameCard key={i} isLoading={true} variant={variant} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3">
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
