import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext.jsx';
import { useApi } from '../../contexts/ApiContext.jsx';
import GameCard from '../GameCard';

const RecommendedGames = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { pgGames, isLoading } = useApi();

  const handleGameClick = (game) => {
    navigate(`/slots/${game.id}`, { state: { game } });
  };

  return (
    <div className="w-full max-w-md px-4 mb-8 relative z-10">
       <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full bg-[var(--gold)]"></div>
          <h3 className="text-lg font-bold text-white tracking-tight">{t('landing.recommended.title')}</h3>
       </div>
       <div className="grid grid-cols-3 gap-3">
          {(() => {
              const games = pgGames && Array.isArray(pgGames) ? pgGames : (pgGames?.games || []);
              // Take random 3 or first 3
              const recommended = games.slice(0, 3); 
              
              if (isLoading && recommended.length === 0) {
                   return Array.from({ length: 3 }).map((_, i) => <GameCard key={i} isLoading={true} />);
              }
              
              if (recommended.length === 0) {
                  return <div className="col-span-3 text-center text-gray-500 text-xs py-4">{t('landing.recommended.empty')}</div>;
              }

              return recommended.map(game => (
                  <GameCard 
                      key={game.id || game.game_id} 
                      game={game} 
                      onClick={handleGameClick}
                  />
              ));
          })()}
       </div>
    </div>
  );
};

export default RecommendedGames;
