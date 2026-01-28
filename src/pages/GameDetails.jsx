import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Play, Globe, Loader2, Star, Share2, Info, ShieldCheck, X } from 'lucide-react';
import { useApi } from '../contexts/ApiContext.jsx';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext.jsx';

const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { pgGames, launchGame, isLoading } = useApi();
  const { isAuthenticated } = useAuth();
  const [game, setGame] = useState(location.state?.game || null);
  const [isLaunching, setIsLaunching] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    if (!game && pgGames) {
       const allGames = Array.isArray(pgGames) ? pgGames : (pgGames.games || []);
       const foundGame = allGames.find(g => g.id.toString() === id);
       if (foundGame) setGame(foundGame);
    }
  }, [id, pgGames, game]);

  const handleStartGame = async () => {
    if (!isAuthenticated) {
        const params = new URLSearchParams(location.search);
        params.set('modal', 'sign-in');
        navigate({ pathname: location.pathname, search: params.toString() }, { replace: true, state: location.state });
        return;
    }

    if (isLaunching || !game) return;
    setIsLaunching(true);
    try {
        const result = await launchGame(game.id);
        if (result?.success && result?.data?.url) {
            navigate('/start-game', { state: { url: result.data.url } });
        } else {
            toast.error(result?.error || 'Failed to launch game');
        }
    } catch (err) {
        console.error(err);
        toast.error('Error launching game');
    } finally {
        setIsLaunching(false);
    }
  };

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div className="relative">
        <div className="absolute inset-0 bg-[var(--gold)]/20 blur-xl rounded-full"></div>
        <Loader2 className="w-12 h-12 animate-spin text-[var(--gold)] relative z-10" />
      </div>
      <span className="text-[var(--gold)] font-medium tracking-wider text-sm animate-pulse">LOADING GAME...</span>
    </div>
  );

  if (!game) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Info className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Game Not Found</h2>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">The game you are looking for is currently unavailable or may have been removed.</p>
            <button 
              onClick={() => navigate('/slots')}
              className="px-8 py-3 rounded-xl bg-[var(--gold)] text-black font-bold hover:bg-yellow-400 transition-all active:scale-95 shadow-[0_4px_20px_rgba(212,175,55,0.2)]"
            >
              Return to Lobby
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[var(--gold)]/10 to-transparent opacity-30"></div>
        {game.image && (
          <img 
            src={game.image} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover opacity-10 blur-3xl scale-150"
          />
        )}
      </div>

      {/* Close Button */}
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors z-20"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Card */}
      <div className="relative w-full max-w-md bg-[#1a1c20] rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Card Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-[var(--gold)] shadow-[0_0_20px_rgba(212,175,55,0.5)]"></div>

        <div className="p-5">
          {/* Card Layout: Image Left, Info Right */}
          <div className="flex gap-4">
            {/* Left: Game Image (Portrait/Square) */}
            <div className="w-32 sm:w-40 flex-shrink-0">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-white/5 relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent z-10"></div>
                {game.image ? (
                  <img 
                    src={game.image} 
                    alt={game.name}
                    onLoad={() => setIsImageLoaded(true)}
                    className={`w-full h-full object-cover transition-all duration-700 ${isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#252830]">
                     <span className="text-4xl">🎮</span>
                  </div>
                )}
                {/* Provider Logo/Badge on Image */}
                <div className="absolute bottom-2 left-2 right-2 z-20">
                  <div className="bg-black/60 backdrop-blur-md rounded-lg px-2 py-1 flex items-center justify-center gap-1 border border-white/10">
                    <Globe className="w-3 h-3 text-[var(--gold)]" />
                    <span className="text-[10px] font-bold text-white uppercase truncate">
                      {game.provider_title || 'Premium'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Info & Stats */}
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight mb-2 line-clamp-2">
                  {game.name}
                </h1>
                
                <div className="flex flex-wrap gap-2 mb-3">
                   <div className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span className="text-[10px] font-medium text-emerald-400">Fair</span>
                   </div>
                   <div className="px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center gap-1">
                      <Star className="w-3 h-3 text-blue-400" />
                      <span className="text-[10px] font-medium text-blue-400">Popular</span>
                   </div>
                </div>

                <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                  Experience the premium gameplay of {game.name}. Win big with high multipliers and instant payouts.
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-5"></div>

          {/* Bottom Action Area */}
          <div className="space-y-3">
            <button
              onClick={handleStartGame}
              disabled={isLaunching}
              className={`
                w-full py-4 rounded-xl font-bold text-base uppercase tracking-wider
                flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer
                ${isLaunching 
                  ? 'bg-gray-700 cursor-not-allowed text-gray-400' 
                  : 'bg-[var(--gold)] text-black hover:bg-[#FFD700] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:-translate-y-0.5'
                }
              `}
            >
              {isLaunching ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Launching...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>Start Game Now</span>
                </>
              )}
            </button>
            
            <p className="text-center text-[10px] text-gray-500">
              * Official Game • Instant Withdrawals
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;
