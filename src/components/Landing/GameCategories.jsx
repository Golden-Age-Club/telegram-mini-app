import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext.jsx';
import { useApi } from '../../contexts/ApiContext.jsx';
import GameCard from '../GameCard';

const GameCategories = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { pgGames, isLoading, loadMoreGames } = useApi();
  const providerSwipersRef = useRef({});

  const handleGameClick = (game) => {
    navigate(`/slots/${game.id}`, { state: { game } });
  };

  const gamesArray =
    pgGames && Array.isArray(pgGames)
      ? pgGames
      : pgGames && Array.isArray(pgGames.games)
      ? pgGames.games
      : [];

  if (isLoading) {
    return Array.from({ length: 2 }).map((_, i) => (
      <div key={`loading-type-${i}`} className="w-full max-w-md px-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-32 bg-white/10 rounded animate-pulse" />
          <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
              <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, j) => (
            <GameCard key={j} isLoading={true} />
          ))}
        </div>
      </div>
    ));
  }

  if (!gamesArray.length) return null;

  // Group games by provider_title
  const gamesByProvider = {};
  gamesArray.forEach((game) => {
    // Use provider_title for grouping, fallback to provider_code or Unknown
    const providerTitle = game.provider_title || game.provider_code || 'Unknown';
    if (providerTitle) {
      if (!gamesByProvider[providerTitle]) {
        gamesByProvider[providerTitle] = [];
      }
      gamesByProvider[providerTitle].push(game);
    }
  });

  const providerTitles = Object.keys(gamesByProvider).sort();

  return (
    <div className="w-full max-w-md space-y-8 pb-8">
      {providerTitles.map((providerTitle) => {
        const typeName = providerTitle;
        const typeGames = gamesByProvider[providerTitle] || [];

        const pages = [];
        // Display 6 games per page (3 cols x 2 rows)
        for (let i = 0; i < typeGames.length; i += 6) {
          pages.push(typeGames.slice(i, i + 6));
        }
        const hasPages = pages.length > 0;

        return (
          <div key={providerTitle} className="relative z-10 border-t border-white/5 pt-6 first:border-0 first:pt-0">
            <div className="px-4 flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                  <div className="w-1 h-5 rounded-full bg-[var(--gold)]"></div>
                  <span className="text-lg font-bold text-white tracking-tight">{typeName}</span>
                  <span className="text-xs font-medium text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{typeGames.length}</span>
              </div>
              
              {hasPages && (
                <div className="flex items-center gap-2">
                  <button
                    className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer active:scale-90"
                    onClick={() => providerSwipersRef.current[providerTitle]?.slidePrev()}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer active:scale-90"
                    onClick={() => {
                      providerSwipersRef.current[providerTitle]?.slideNext();
                      loadMoreGames();
                    }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            
            <div className="px-4">
                <Swiper
                  modules={[Navigation]}
                  slidesPerView={1}
                  spaceBetween={16}
                  onSwiper={(swiperInstance) => {
                    providerSwipersRef.current[providerTitle] = swiperInstance;
                  }}
                  className="!overflow-visible"
                >
                  {hasPages ? (
                    pages.map((pageGames, pageIndex) => (
                      <SwiperSlide key={`provider-${providerTitle}-page-${pageIndex}`}>
                        <div className="grid grid-cols-3 gap-3">
                          {pageGames.map((game) => (
                            <GameCard
                              key={game.id}
                              game={game}
                              onClick={handleGameClick}
                            />
                          ))}
                        </div>
                      </SwiperSlide>
                    ))
                  ) : (
                    <SwiperSlide>
                      <div className="grid grid-cols-3 gap-3">
                        {Array.from({ length: 6 }).map((_, idx) => (
                          <GameCard key={idx} isLoading={true} />
                        ))}
                      </div>
                    </SwiperSlide>
                  )}
                </Swiper>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GameCategories;
