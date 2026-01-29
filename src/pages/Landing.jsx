import { useEffect, useState, useRef } from 'react';
import {
  Zap,
  Trophy,
  Shield,
  ArrowDownCircle,
  ArrowUpCircle,
  Users,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Globe,
  Gift
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../contexts/ApiContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
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

const GAME_TYPES = {
  1: 'Slot',
  2: 'Live Casino',
  3: 'Sport Book',
  4: 'Virtual Sport',
  5: 'Lottery',
  6: 'Qipai',
  7: 'P2P',
  8: 'Fishing',
  9: 'Cock Fighting',
  10: 'Bonus',
  11: 'Esport',
  12: 'Poker',
  13: 'Other'
};

const Landing = () => {
  const tg = window.Telegram?.WebApp;
  const [showFallbackButton, setShowFallbackButton] = useState(false);
  const navigate = useNavigate();
  const { pgOptions, pgGames, isLoading, launchGame, loadMoreGames, liveTransactions } = useApi();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all_bets');
  
  const filteredTransactions = liveTransactions.filter(t => {
      if (activeTab === 'my_bets') return t.user_id === user?._id;
      if (activeTab === 'all_wins') return t.type === 'win';
      return true;
  });

  const providerSwipersRef = useRef({});

  const handleGameClick = (game) => {
    navigate(`/slots/${game.id}`, { state: { game } });
  };

  const banners = [
    '/assets/banner-actThroughtDZ.webp',
    '/assets/banner-yessc2.webp',
    '/assets/banner-yessc2 (1).webp',
  ];

  useEffect(() => {
    // Check if we're in Telegram environment
    const isInTelegram = tg && tg.initData && tg.initData.length > 0;
    
    if (isInTelegram) {
      tg.setHeaderColor('#000000');
      tg.setBackgroundColor('#000000');
      tg.expand?.();
      tg.ready?.();

      tg.MainButton?.setText('👑 Enter Golden Age Cash 👑');
      tg.MainButton?.show();
      tg.MainButton?.onClick(() => navigate('/home'));
      setShowFallbackButton(false);
    } else {
      // Not in Telegram, show fallback button
      setShowFallbackButton(true);
    }


    return () => {
      if (isInTelegram) {
        tg?.MainButton?.hide();
        tg?.MainButton?.offClick();
      }
    };
  }, [tg, navigate]);


  return (
    <div className="min-h-screen flex flex-col items-center bg-[#1a1c20] relative overflow-x-hidden pb-24 pt-6">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-emerald-900/30 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-[var(--gold)]/15 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
      </div>

      {/* Banner Slider */}
      <div className="w-full max-w-md px-4 mt-2 mb-6 relative z-10">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 aspect-video">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectFade]}
            effect="fade"
            loop
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ 
                clickable: true,
                bulletActiveClass: 'swiper-pagination-bullet-active !bg-[var(--gold)] !w-6 !rounded-full',
                bulletClass: 'swiper-pagination-bullet !bg-white/50 !w-1.5 !h-1.5 !opacity-100 transition-all duration-300'
            }}
            className="w-full h-full"
          >
            {banners.map((src, idx) => (
              <SwiperSlide key={src}>
                <div className="relative w-full h-full flex items-center justify-center bg-gray-900">
                    {/* Blurred Background for Ambiance */}
                    <div className="absolute inset-0 overflow-hidden">
                        <img
                            src={src}
                            alt=""
                            className="w-full h-full object-cover blur-2xl opacity-40 scale-110"
                        />
                    </div>
                    
                    {/* Main Image - Contained to fit perfectly */}
                    <img
                        src={src}
                        alt={`Golden Age banner ${idx + 1}`}
                        className="relative w-full h-full object-contain z-10"
                    />
                    
                    {/* Subtle Overlay for Depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-20" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Quick Actions - Glassmorphism */}
      <div className="w-full max-w-md px-4 mb-8 relative z-10">
        <div className="grid grid-cols-4 gap-3">
            {[
                { icon: ArrowDownCircle, label: 'Deposit', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                { icon: ArrowUpCircle, label: 'Withdraw', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
                { icon: Users, label: 'Invite', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                { icon: MessageCircle, label: 'Support', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
            ].map((action, i) => (
                <button 
                    key={i} 
                    className="flex flex-col items-center gap-2 group"
                    onClick={() => {
                        if (action.label === 'Deposit') navigate('/wallet/deposit');
                        else if (action.label === 'Withdraw') navigate('/wallet/withdraw');
                        else if (action.label === 'Invite') navigate('/profile'); // Placeholder
                    }}
                >
                    <div className={`w-14 h-14 rounded-2xl ${action.bg} ${action.border} border flex items-center justify-center backdrop-blur-sm shadow-lg transition-transform duration-300 group-hover:scale-105 group-active:scale-95`}>
                        <action.icon className={`w-6 h-6 ${action.color}`} strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-medium text-gray-400 group-hover:text-white transition-colors">{action.label}</span>
                </button>
            ))}
        </div>
      </div>

      {/* Jackpot Ticker */}
      <div className="w-full max-w-md px-4 mb-8 relative z-10">
        <div className="relative rounded-2xl overflow-hidden border border-[var(--gold)]/30 bg-gradient-to-r from-gray-900 to-black p-0.5">
            <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-10 mix-blend-overlay"></div>
            <div className="bg-[#0f0f0f] rounded-[14px] p-4 flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--gold)]/10 rounded-full blur-2xl -mr-10 -mt-10 animate-pulse"></div>
                
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--gold)]/10 flex items-center justify-center border border-[var(--gold)]/20">
                        <Trophy className="w-5 h-5 text-[var(--gold)]" />
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-[var(--gold)] uppercase tracking-wider mb-0.5">Progressive Jackpot</div>
                        <div className="text-xl font-black text-white tracking-tight tabular-nums">
                            $1,245,892.<span className="text-[var(--gold)]">54</span>
                        </div>
                    </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500" />
            </div>
        </div>
      </div>

      {/* Game Categories */}
      <div className="w-full max-w-md space-y-8 pb-8">
      {(() => {
        const gamesArray =
          pgGames && Array.isArray(pgGames)
            ? pgGames
            : pgGames && Array.isArray(pgGames.games)
            ? pgGames.games
            : [];

        if (isLoading) {
          return Array.from({ length: 2 }).map((_, i) => (
            <div key={`loading-type-${i}`} className="px-4">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 w-32 bg-white/10 rounded animate-pulse" />
                <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
                    <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 3 }).map((_, j) => (
                  <GameCard key={j} isLoading={true} />
                ))}
              </div>
            </div>
          ));
        }

        if (!gamesArray.length) return null;

        // Group games by type
        const gamesByType = {};
        gamesArray.forEach((game) => {
          const type = game.game_type;
          if (type && GAME_TYPES[type]) {
            if (!gamesByType[type]) {
              gamesByType[type] = [];
            }
            gamesByType[type].push(game);
          }
        });

        return Object.entries(GAME_TYPES).map(([typeId, typeName]) => {
          const typeGames = gamesByType[typeId] || [];
          if (typeGames.length === 0) return null;

          const pages = [];
          for (let i = 0; i < typeGames.length; i += 9) {
            pages.push(typeGames.slice(i, i + 9));
          }
          const hasPages = pages.length > 0;

          return (
            <div key={typeId} className="relative z-10 border-t border-white/5 pt-6 first:border-0 first:pt-0">
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
                      onClick={() => providerSwipersRef.current[typeId]?.slidePrev()}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer active:scale-90"
                      onClick={() => {
                        providerSwipersRef.current[typeId]?.slideNext();
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
                      providerSwipersRef.current[typeId] = swiperInstance;
                    }}
                    className="!overflow-visible"
                  >
                    {hasPages ? (
                      pages.map((pageGames, pageIndex) => (
                        <SwiperSlide key={`type-${typeId}-page-${pageIndex}`}>
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
                          {Array.from({ length: 3 }).map((_, idx) => (
                            <GameCard key={idx} isLoading={true} />
                          ))}
                        </div>
                      </SwiperSlide>
                    )}
                  </Swiper>
              </div>
            </div>
          );
        });
      })()}
      </div>

      {/* Live Transactions Table */}
      <div className="w-full max-w-md px-4 mb-8 relative z-10">
        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-900/10 to-black p-4 backdrop-blur-sm relative overflow-hidden min-h-[300px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <div className="p-1.5 rounded-lg bg-emerald-500/20">
                <Trophy className="w-4 h-4 text-emerald-500" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Live Transactions</h3>
            <div className="ml-auto flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-emerald-500">LIVE</span>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex p-1 bg-black/40 rounded-lg mb-4 relative z-10">
              {['all_bets', 'my_bets', 'all_wins'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wide rounded-md transition-all ${
                        activeTab === tab 
                        ? 'bg-[var(--gold)] text-black shadow-lg' 
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                      {tab.replace('_', ' ')}
                  </button>
              ))}
          </div>

          <div className="relative z-10 overflow-hidden rounded-lg border border-white/5 bg-black/20">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-[10px] text-gray-400 uppercase tracking-wider">
                  <th className="px-3 py-2 font-medium">Game</th>
                  <th className="px-3 py-2 font-medium">User</th>
                  <th className="px-3 py-2 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-3 py-8 text-center text-xs text-gray-500">
                      No live transactions yet...
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx, i) => (
                    <tr key={i} className="text-xs hover:bg-white/5 transition-colors animate-fade-in">
                      <td className="px-3 py-2 text-gray-300 truncate max-w-[100px]">
                        {tx.game_id || 'Game'}
                      </td>
                      <td className="px-3 py-2 text-gray-400 truncate max-w-[80px]">
                        {tx.username}
                      </td>
                      <td className={`px-3 py-2 text-right font-mono font-bold ${
                        tx.type === 'win' ? 'text-emerald-400' : 
                        tx.type === 'bet' ? 'text-red-400' :
                        tx.type === 'refund' ? 'text-yellow-400' :
                        'text-gray-300'
                      }`}>
                        {tx.type === 'win' ? '+' : 
                         tx.type === 'bet' ? '-' : 
                         tx.type === 'refund' ? '↺' : ''}${Number(tx.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recommended Games */}
      <div className="w-full max-w-md px-4 mb-8 relative z-10">
         <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 rounded-full bg-[var(--gold)]"></div>
            <h3 className="text-lg font-bold text-white tracking-tight">Recommended For You</h3>
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
                    return <div className="col-span-3 text-center text-gray-500 text-xs py-4">No recommendations available</div>;
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

      {/* Providers Carousel */}
      {pgOptions && pgOptions.providers && pgOptions.providers.length > 0 && (
          <div className="w-full max-w-md px-4 mb-10 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-[var(--gold)]" />
                Premium Providers
              </h3>
            </div>
            
            {(() => {
              const providers = [...pgOptions.providers]
                  .filter((p) => {
                    const isActive = p.is_active === 1 || p.is_active === '1';
                    const isExcluded = ['egt', 'pgsoft', 'ferhub_pgsoft', 'ferhub_egt'].some(ex => 
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
                  
              return (
                <Swiper
                  modules={[Autoplay]}
                  slidesPerView={3.5}
                  spaceBetween={2}
                  autoplay={{ delay: 3000, disableOnInteraction: false }}
                  loop
                >
                  {providers.map((provider) => (
                    <SwiperSlide key={provider.id}>
                      <div className="aspect-[3/2] rounded-xl bg-white/5 border border-white/5 overflow-hidden hover:border-[var(--gold)]/30 transition-all grayscale hover:grayscale-0 relative group">
                        {provider.logo_b ? (
                          <img
                            src={provider.logo_b}
                            alt={provider.title || provider.code}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                             <div className="w-full h-full flex items-center justify-center p-2">
                                <span className="text-xs font-bold text-gray-400">{provider.title}</span>
                             </div>
                        )}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              );
            })()}
          </div>
      )}

      {/* Why Choose Us - Grid */}
      <div className="w-full max-w-md px-4 mb-12 relative z-10">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 ml-1">Why Golden Age?</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Zap, title: 'Instant Withdrawals', desc: 'Get paid in seconds', color: 'text-yellow-400' },
            { icon: Shield, title: 'Bank-Grade Security', desc: 'Encrypted & protected', color: 'text-emerald-400' },
            { icon: MessageCircle, title: '24/7 Live Support', desc: 'Always here to help', color: 'text-blue-400' },
            { icon: Gift, title: 'VIP Rewards', desc: 'Exclusive daily bonuses', color: 'text-purple-400' }
          ].map((item, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <item.icon className={`w-6 h-6 ${item.color} mb-3`} />
                <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                <p className="text-[11px] text-gray-400 leading-tight">{item.desc}</p>
              </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Landing;
