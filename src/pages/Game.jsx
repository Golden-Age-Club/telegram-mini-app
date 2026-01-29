import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, Loader2, X, Check, ChevronDown } from 'lucide-react';
import { useApi } from '../contexts/ApiContext.jsx';
import { toast } from 'sonner';
import GameCard from '../components/GameCard';

const providerPriority = (provider) => {
  const code = provider?.code || '';
  const title = (provider?.title || '').toLowerCase();
  const uniq = (provider?.uniq_name || '').toLowerCase();
  if (
    code === 'FERHUB_PGSOFT' ||
    title.includes('pgsoft') ||
    uniq.includes('pgsoft')
  ) {
    return 0;
  }
  if (
    code === 'FERHUB_EGT' ||
    title.includes('egt') ||
    uniq.includes('egt')
  ) {
    return 1;
  }
  return 2;
};

const Game = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { pgGames, pgOptions, isLoading, launchGame, pagination, loadMoreGames, resetGames } = useApi();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [activeProvider, setActiveProvider] = useState(searchParams.get('provider') || 'all');
  const [launchingGameId, setLaunchingGameId] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const filterRef = useRef(null);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync state with URL params
  useEffect(() => {
    const provider = searchParams.get('provider') || 'all';
    const search = searchParams.get('search') || '';
    setActiveProvider(provider);
    setSearchQuery(search);
    
    // Trigger fetch
    resetGames(12, provider, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Debounce search input to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentSearch = searchParams.get('search') || '';
      if (searchQuery !== currentSearch) {
        const params = new URLSearchParams(searchParams);
        if (searchQuery) params.set('search', searchQuery);
        else params.delete('search');
        setSearchParams(params);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, searchParams, setSearchParams]);

  const handleProviderSelect = (provider) => {
    setActiveProvider(provider);
    setIsFilterOpen(false);
    
    const params = new URLSearchParams(searchParams);
    if (provider && provider !== 'all') params.set('provider', provider);
    else params.delete('provider');
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setActiveProvider('all');
    setSearchParams({});
  };

  // Normalize games data
  const games = useMemo(() => {
    if (!pgGames) return [];
    if (Array.isArray(pgGames)) return pgGames;
    if (Array.isArray(pgGames.games)) return pgGames.games;
    return [];
  }, [pgGames]);

  // Extract unique providers
  const providers = useMemo(() => {
    if (pgOptions?.providers) {
      const sortedProviders = [...pgOptions.providers]
        .filter((p) => {
            const isActive = p.is_active === 1 || p.is_active === '1';
            const isExcluded = [ 'pgsoft', 'ferhub_pgsoft', 'ferhub_egt'].some(ex => 
                (p.code || '').toLowerCase().includes(ex) || 
                (p.title || '').toLowerCase().includes(ex) || 
                (p.uniq_name || '').toLowerCase().includes(ex)
            );
            return isActive && !isExcluded;
        })
        .sort((a, b) => {
          const pa = providerPriority(a);
          const pb = providerPriority(b);
          if (pa !== pb) return pa - pb;
          return Number(a.sorder ?? 0) - Number(b.sorder ?? 0);
        });

      const titles = sortedProviders.map(p => p.title).filter(Boolean);
      return ['all', ...Array.from(new Set(titles))];
    }

    // Fallback if options not loaded yet
    return ['all'];
  }, [pgOptions]);

  const handleGameClick = async (game) => {
    if (launchingGameId) return;
    
    setLaunchingGameId(game.id);
    try {
      navigate('/slots/' + game.id, { state: { game } });
    } finally {
      setLaunchingGameId(null);
    }
  };

  const handleLoadMore = async () => {
    if (isLoadingMore || !pagination || pagination.page >= pagination.totalPages) return;
    setIsLoadingMore(true);
    try {
      await loadMoreGames(activeProvider, searchQuery);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-80px)] bg-[#1a1c20]">
      {/* Search & Filter Bar */}
      <div className="sticky top-0 z-30 bg-[#1a1c20]/95 backdrop-blur-md border-b border-white/5 py-3 px-4">
        <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className={`flex-1 relative transition-all duration-300 ${isSearchFocused ? 'scale-[1.02]' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className={`h-4 w-4 transition-colors ${isSearchFocused ? 'text-[var(--gold)]' : 'text-gray-500'}`} />
                </div>
                <input
                    type="text"
                    placeholder="Search games..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="w-full pl-10 pr-10 py-2.5 bg-black/20 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[var(--gold)]/50 focus:bg-black/40 transition-all"
                />
                {searchQuery && (
                    <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 cursor-pointer flex items-center text-gray-500 hover:text-white"
                    >
                    <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Filter Dropdown */}
            <div className="relative" ref={filterRef}>
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`
                        py-2.5 cursor-pointer px-4 flex items-center justify-between gap-2 rounded-xl border transition-all duration-200 min-w-[140px]
                        ${isFilterOpen || activeProvider !== 'all'
                            ? 'bg-[var(--gold)] text-black border-[var(--gold)] shadow-[0_0_15px_rgba(255,215,0,0.3)]'
                            : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                        }
                    `}
                >
                    <span className="text-sm font-medium truncate">
                        {activeProvider === 'all' ? 'All Providers' : activeProvider}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isFilterOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 max-h-[60vh] overflow-y-auto rounded-xl bg-[#1a1c20] border border-white/10 shadow-2xl shadow-black z-50 animate-in fade-in slide-in-from-top-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        <div className="p-2 space-y-1">
                            <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Providers</div>
                            {providers.map((provider) => (
                                <button
                                    key={provider}
                                    onClick={() => handleProviderSelect(provider)}
                                    className={`
                                        w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors
                                        ${activeProvider === provider
                                            ? 'bg-[var(--gold)]/10 text-[var(--gold)]'
                                            : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                        }
                                    `}
                                >
                                    <span className="truncate">{provider === 'all' ? 'All Providers' : provider}</span>
                                    {activeProvider === provider && <Check className="w-4 h-4" />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
        
        {/* Active Filter Badge */}
        {activeProvider !== 'all' && (
             <div className="mt-3 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                <span className="text-xs text-gray-500">Filtered by:</span>
                <button 
                    onClick={() => handleProviderSelect('all')}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--gold)]/10 border border-[var(--gold)]/20 text-[10px] font-bold text-[var(--gold)] hover:bg-[var(--gold)]/20 transition-colors"
                >
                    {activeProvider}
                    <X className="w-3 h-3" />
                </button>
            </div>
        )}
      </div>

      {/* Game Grid */}
      <div className="flex-1 p-4">
        {isLoading ? (
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <GameCard key={i} isLoading={true} />
            ))}
          </div>
        ) : games.length > 0 ? (
          <div className="grid grid-cols-3 gap-3 pb-20">
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onClick={handleGameClick}
              />
            ))}
            {pagination && pagination.page < pagination.totalPages && (
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className={`col-span-3 mt-6 w-full px-4 py-3 cursor-pointer rounded-2xl border border-white/10 bg-gradient-to-r from-white/5 to-white/0 text-white text-xs font-semibold tracking-wide uppercase flex items-center justify-center gap-2 transition-all ${
                  isLoadingMore
                    ? 'opacity-70 cursor-wait'
                    : 'hover:border-[var(--gold)] hover:from-[var(--gold)]/10 hover:to-white/5 hover:shadow-[0_0_20px_rgba(255,215,0,0.25)]'
                }`}
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[var(--gold)]" />
                    <span>Loading more games...</span>
                  </>
                ) : (
                  <>
                    <Loader2 className="w-4 h-4 text-[var(--gold)]" />
                    <span>Load more games</span>
                  </>
                )}
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No games found</h3>
            <p className="text-sm text-gray-500 max-w-[200px]">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <button 
              onClick={handleClearFilters}
              className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
