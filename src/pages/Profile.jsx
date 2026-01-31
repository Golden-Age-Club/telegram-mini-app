import { useState, useEffect } from 'react';
import { 
  Globe, 
  Bell, 
  Shield, 
  MessageCircle, 
  ChevronRight, 
  Crown, 
  Trophy, 
  Target, 
  X, 
  Check, 
  LogOut, 
  Wallet,
  Settings,
  User,
  History,
  CreditCard,
  Lock,
  Sparkles
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

const Profile = () => {
  const tg = window.Telegram?.WebApp;
  const navigate = useNavigate();
  const location = useLocation();
  const { t, changeLanguage, currentLanguage, languages } = useLanguage();
  const { user, logout, isAuthenticated } = useAuth();
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // Helper to open auth modals
  const setModal = (type) => {
    const params = new URLSearchParams(location.search);
    params.set('modal', type);
    navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
  };

  useEffect(() => {
    if (tg) {
      tg.setHeaderColor('#000000');
      tg.setBackgroundColor('#000000');
    }
  }, [tg]);

  // Logged Out View
  if (!isAuthenticated) {
    return (
      <div className="page min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 space-y-8 text-center relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[var(--gold)]/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 space-y-6 max-w-md w-full">
          {/* Logo/Icon */}
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-[var(--gold)] to-amber-600 p-[1px] shadow-[0_0_40px_rgba(255,215,0,0.3)]">
            <div className="w-full h-full rounded-[23px] bg-black flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.2),transparent)]" />
              <Crown className="w-12 h-12 text-[var(--gold)] relative z-10" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Golden Age <span className="text-[var(--gold)]">Club</span>
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('profile_page.subtitle')}
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 gap-3 py-4">
            {[
              { icon: Trophy, label: t('profile_page.features.vip_rewards') },
              { icon: Sparkles, label: t('profile_page.features.daily_bonus') },
              { icon: Shield, label: t('profile_page.features.secure_play') },
              { icon: MessageCircle, label: t('profile_page.features.support_247') }
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
                <feature.icon className="w-5 h-5 text-[var(--gold)]" />
                <span className="text-xs font-medium text-gray-300">{feature.label}</span>
              </div>
            ))
          }</div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => setModal('sign-up')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[var(--gold)] to-amber-500 text-black font-bold text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] hover:brightness-110 active:scale-95 transition-all"
            >
              {t('profile_page.guest.join_now')}
            </button>
            <button
              onClick={() => setModal('sign-in')}
              className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm uppercase tracking-wider hover:bg-white/10 active:scale-95 transition-all"
            >
              {t('profile_page.guest.log_in')}
            </button>
          </div>

          <div className="pt-6 border-t border-white/5">
             <button 
               onClick={() => setShowLanguageModal(true)}
               className="flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-white transition-colors"
             >
               <Globe className="w-3 h-3" />
               <span>{t('profile_page.guest.change_language')}</span>
             </button>
          </div>
        </div>
      </div>
    );
  }

  // Logged In View
  const fullName = `${user?.first_name || ''}${user?.last_name ? ` ${user.last_name}` : ''}`.trim();
  const displayName = fullName || user?.username || user?.email || 'Player';
  const secondaryIdentifier = user?.username ? `@${user.username}` : (user?.email || `ID: ${user?.telegram_id || 'Unknown'}`);

  const stats = [
    { icon: Target, label: t('profile_page.stats.total_bets'), value: user?.total_bet ? `$${user.total_bet.toFixed(2)}` : '$0.00' },
    { icon: Trophy, label: t('profile_page.stats.total_wins'), value: user?.total_won ? `$${user.total_won.toFixed(2)}` : '$0.00' },
    { icon: Crown, label: t('profile_page.stats.best_win'), value: user?.best_win ? `$${user.best_win.toFixed(2)}` : '$0.00' },
  ];

  const menuGroups = [
    {
      title: t('profile_page.menu.account'),
      items: [
        { icon: User, label: t('profile_page.menu.personal_details'), value: t('profile_page.menu.verified') },
        { icon: Wallet, label: t('wallet'), value: `$${user?.balance?.toLocaleString() || '0'}`, action: () => navigate('/wallet') },
        { icon: History, label: t('profile_page.menu.bet_history'), action: () => navigate('/bet-history') },
      ]
    },
    {
      title: t('profile_page.menu.settings'),
      items: [
        { 
          icon: Globe, 
          label: t('language'), 
          value: languages.find(l => l.code === currentLanguage)?.name,
          action: () => setShowLanguageModal(true)
        },
        { icon: Bell, label: t('profile_page.menu.notifications'), value: t('profile_page.menu.on') },
        { icon: Shield, label: t('profile_page.menu.security'), value: t('profile_page.menu.2fa') },
      ]
    },
    {
      title: t('profile_page.menu.support'),
      items: [
        { icon: MessageCircle, label: t('profile_page.menu.live_support'), value: t('profile_page.menu.online') },
        { icon: LogOut, label: t('logout'), action: logout, danger: true },
      ]
    }
  ];

  return (
    <div className="page p-4 pb-24 space-y-6 min-h-screen">
      {/* Profile Header Card */}
      <div className="relative rounded-[2rem] bg-gradient-to-br from-[#1a1a1a] via-black to-[#0d0d0d] border border-white/10 shadow-2xl overflow-hidden group">
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-20 mix-blend-overlay" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--gold)]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative p-6 space-y-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold)] to-amber-600 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative w-20 h-20 rounded-2xl bg-[#111] p-1 ring-1 ring-white/10">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 bg-[var(--gold)] text-black text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-black">
                  Lvl 3
                </div>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white truncate font-display">
                  {displayName}
                </h2>
                <Settings className="w-5 h-5 text-gray-500 hover:text-white transition-colors cursor-pointer" />
              </div>
              <p className="text-sm text-gray-400 truncate font-mono mt-0.5">
                {secondaryIdentifier}
              </p>
              
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-[65%] bg-gradient-to-r from-[var(--gold)] to-amber-500 rounded-full" />
                </div>
                <span className="text-[10px] font-bold text-[var(--gold)]">65%</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/5 flex flex-col items-center text-center hover:bg-white/10 transition-colors">
                <stat.icon className="w-4 h-4 text-[var(--gold)] mb-2" />
                <span className="text-white font-bold text-sm block">{stat.value}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wide">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wallet Quick Action */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-900/40 to-emerald-900/10 border border-emerald-500/20 p-4 flex items-center justify-between">
        <div>
          <span className="text-xs text-emerald-400 font-medium uppercase tracking-wider">{t('profile_page.total_balance')}</span>
          <div className="text-2xl font-bold text-white mt-0.5">${user?.balance?.toLocaleString() || '0.00'}</div>
        </div>
        <button 
          onClick={() => navigate('/wallet')}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-lg shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
        >
          {t('profile_page.deposit')}
        </button>
      </div>

      {/* Settings Menu */}
      <div className="space-y-6">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2">
              {group.title}
            </h3>
            <div className="rounded-2xl bg-[#0a0a0a] border border-white/5 overflow-hidden">
              {group.items.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    tg?.HapticFeedback?.selectionChanged();
                    item.action?.();
                  }}
                  className={`w-full px-4 py-4 flex items-center gap-4 hover:bg-white/5 transition-colors group border-b border-white/5 last:border-0 ${
                    item.danger ? 'hover:bg-red-500/10' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    item.danger 
                      ? 'bg-red-500/10 text-red-500 group-hover:bg-red-500/20' 
                      : 'bg-white/5 text-gray-400 group-hover:text-white group-hover:bg-white/10'
                  }`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 text-left">
                    <span className={`block text-sm font-medium ${item.danger ? 'text-red-500' : 'text-white'}`}>
                      {item.label}
                    </span>
                  </div>

                  {item.value && (
                    <span className="text-xs text-gray-500 font-medium px-2 py-1 rounded bg-white/5">
                      {item.value}
                    </span>
                  )}
                  
                  {!item.value && <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400" />}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Language Modal (Reused) */}
      {showLanguageModal && (
        <div
          className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-end justify-center"
          onClick={() => setShowLanguageModal(false)}
        >
          <div
            className="w-full max-w-sm max-h-[70vh] bg-[#111] rounded-t-3xl border-t border-white/10 shadow-2xl px-4 pt-4 pb-8"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-white text-lg">{t('language')}</h3>
                <p className="text-xs text-gray-400">Select your preferred language</p>
              </div>
              <button
                onClick={() => setShowLanguageModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="space-y-2 overflow-y-auto max-h-[50vh] pr-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    tg?.HapticFeedback?.selectionChanged();
                    changeLanguage(lang.code);
                    setShowLanguageModal(false);
                  }}
                  className={`w-full p-4 flex items-center gap-4 rounded-xl transition-all border ${
                    currentLanguage === lang.code
                      ? 'bg-[var(--gold)]/10 border-[var(--gold)]/50 shadow-[0_0_15px_rgba(255,215,0,0.1)]'
                      : 'bg-white/5 border-transparent hover:bg-white/10'
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <div className="flex-1 text-left">
                    <span className={`block text-sm ${currentLanguage === lang.code ? 'text-[var(--gold)] font-bold' : 'text-white font-medium'}`}>
                      {lang.name}
                    </span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">
                      {lang.code}
                    </span>
                  </div>
                  {currentLanguage === lang.code && (
                    <div className="w-6 h-6 rounded-full bg-[var(--gold)] flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;