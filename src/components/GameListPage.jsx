import { useState } from 'react';
import { ArrowLeft, Search, Flame, Sparkles, Gift, Star, Home, Gamepad2, Wallet, User, Play, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const GameListPage = ({ user, onNavigate }) => {
  const { t } = useLanguage();
  const [activeProvider, setActiveProvider] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const providers = [
    { id: 'all', name: 'All' },
    { id: 'pg', name: 'PG Soft' },
    { id: 'egt', name: 'EGT' },
    { id: 'pragmatic', name: 'Pragmatic' },
  ];

  const filters = [
    { id: 'all', name: 'All', icon: Gamepad2 },
    { id: 'hot', name: t('highWins'), icon: Flame },
    { id: 'new', name: t('newGames'), icon: Sparkles },
    { id: 'bonus', name: t('buyFree'), icon: Gift },
    { id: 'favorites', name: t('favorites'), icon: Star },
  ];

  const allGames = [
    { name: 'Fortune Tiger', provider: 'pg', players: '2.1k', hot: true, new: false, bonus: true, gradient: 'from-orange-500 to-red-600' },
    { name: 'Wild Bounty', provider: 'pg', players: '1.8k', hot: false, new: true, bonus: false, gradient: 'from-amber-500 to-orange-600' },
    { name: 'Mahjong Ways', provider: 'pg', players: '1.5k', hot: true, new: false, bonus: true, gradient: 'from-emerald-500 to-teal-600' },
    { name: 'Sweet Bonanza', provider: 'pragmatic', players: '980', hot: true, new: false, bonus: true, gradient: 'from-pink-500 to-rose-600' },
    { name: 'Burning Hot', provider: 'egt', players: '750', hot: true, new: false, bonus: false, gradient: 'from-red-500 to-orange-600' },
    { name: 'Shining Crown', provider: 'egt', players: '650', hot: false, new: false, bonus: false, gradient: 'from-amber-400 to-yellow-500' },
    { name: 'Lucky Neko', provider: 'pg', players: '1.2k', hot: false, new: true, bonus: true, gradient: 'from-pink-400 to-purple-500' },
    { name: 'Gates of Olympus', provider: 'pragmatic', players: '890', hot: true, new: false, bonus: true, gradient: 'from-blue-500 to-indigo-600' },
  ];

  const filteredGames = allGames.filter(game => {
    const matchesProvider = activeProvider === 'all' || game.provider === activeProvider;
    const matchesFilter = activeFilter === 'all' || 
      (activeFilter === 'hot' && game.hot) ||
      (activeFilter === 'new' && game.new) ||
      (activeFilter === 'bonus' && game.bonus);
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProvider && matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[--bg-base] text-white pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-[--border] px-4 py-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate('home')}
              className="w-10 h-10 rounded-xl bg-[--bg-elevated] border border-[--border] flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold">{t('gameList')}</h1>
          </div>
          
          <div className="flex items-center gap-2 bg-[--bg-card] border border-[--border] rounded-full px-3 py-1.5">
            <span className="text-xs text-amber-500 font-semibold">$</span>
            <span className="text-sm font-semibold">{user?.balance?.toLocaleString() || '2,368.50'}</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[--text-muted]" />
          <input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
      </header>

      <main className="px-4 py-4 space-y-4">
        {/* Provider Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
          {providers.map((provider) => (
            <button
              key={provider.id}
              onClick={() => setActiveProvider(provider.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeProvider === provider.id
                  ? 'bg-amber-500 text-black'
                  : 'bg-[--bg-card] border border-[--border] text-[--text-secondary]'
              }`}
            >
              {provider.name}
            </button>
          ))}
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === filter.id
                  ? 'bg-[--bg-elevated] border border-amber-500/50 text-amber-500'
                  : 'bg-[--bg-card] border border-[--border] text-[--text-secondary]'
              }`}
            >
              <filter.icon className="w-4 h-4" />
              {filter.name}
            </button>
          ))}
        </div>

        {/* Games List */}
        <div className="space-y-3 stagger-children">
          {filteredGames.map((game, index) => (
            <button
              key={index}
              onClick={() => onNavigate('gameView', { game: game.name })}
              className="w-full card p-4 flex items-center gap-4 hover:border-[--border-hover] transition-all active:scale-[0.99]"
            >
              {/* Game Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.gradient} flex items-center justify-center flex-shrink-0`}>
                <Gamepad2 className="w-8 h-8 text-white/80" />
              </div>

              {/* Game Info */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold truncate">{game.name}</h3>
                  {game.hot && <span className="badge badge-hot">HOT</span>}
                  {game.new && <span className="badge badge-new">NEW</span>}
                </div>
                <div className="flex items-center gap-3 text-sm text-[--text-muted]">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {game.players}
                  </span>
                  {game.bonus && (
                    <span className="text-amber-500 flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5" />
                      Buy Free
                    </span>
                  )}
                </div>
              </div>

              {/* Play Button */}
              <div className="w-12 h-12 rounded-xl bg-[--bg-elevated] border border-[--border] flex items-center justify-center flex-shrink-0 hover:bg-amber-500 hover:border-amber-500 hover:text-black transition-all">
                <Play className="w-5 h-5" />
              </div>
            </button>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <Gamepad2 className="w-12 h-12 text-[--text-muted] mx-auto mb-4" />
            <p className="text-[--text-secondary]">No games found</p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav currentPage="games" onNavigate={onNavigate} />
    </div>
  );
};

const BottomNav = ({ currentPage, onNavigate }) => {
  const { t } = useLanguage();
  
  const navItems = [
    { id: 'home', icon: Home, label: t('home') },
    { id: 'games', icon: Gamepad2, label: t('games') },
    { id: 'wallet', icon: Wallet, label: t('wallet') },
    { id: 'profile', icon: User, label: t('profile') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2">
      <div className="glass border border-[--border] rounded-2xl p-2 flex justify-around items-center shadow-lg">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                isActive 
                  ? 'bg-amber-500 text-black' 
                  : 'text-[--text-muted] hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default GameListPage;
