import { useState, useEffect } from 'react';
import { Globe, Bell, Shield, MessageCircle, ChevronRight, Crown, Trophy, Target, X, Check, Sparkles, Star, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Profile = ({ user, navigate }) => {
  const tg = window.Telegram?.WebApp;
  const { t, changeLanguage, currentLanguage, languages } = useLanguage();
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // Set dark header in Telegram
  useEffect(() => {
    if (tg) {
      tg.setHeaderColor('#0a0a0f');
      tg.setBackgroundColor('#0a0a0f');
    }
  }, [tg]);

  const stats = [
    { icon: Target, label: 'Total Bets', value: '1,247', color: 'from-blue-500/20 to-blue-600/20' },
    { icon: Trophy, label: 'Wins', value: '892', color: 'from-emerald-500/20 to-emerald-600/20' },
    { icon: Star, label: 'Best Win', value: '$4,800', color: 'from-purple-500/20 to-purple-600/20' },
  ];

  const menuItems = [
    { 
      icon: Globe, 
      label: t('language'), 
      value: languages.find(l => l.code === currentLanguage)?.name,
      action: () => setShowLanguageModal(true),
      color: 'from-blue-500/20 to-blue-600/20',
      iconColor: 'text-blue-400'
    },
    { icon: Bell, label: 'Notifications', value: 'On', color: 'from-amber-500/20 to-amber-600/20', iconColor: 'text-[var(--gold)]' },
    { icon: Shield, label: 'Security', value: '2FA Active', color: 'from-emerald-500/20 to-emerald-600/20', iconColor: 'text-emerald-400' },
    { icon: MessageCircle, label: 'VIP Support', value: '24/7', color: 'from-purple-500/20 to-purple-600/20', iconColor: 'text-purple-400' },
  ];

  return (
    <div className="page">
      {/* Profile Header */}
      <div className="px-4 pt-4 pb-6">
        <div className="card card-gold p-6 relative overflow-hidden">
          {/* Shimmer effect */}
          <div className="absolute inset-0 animate-shimmer pointer-events-none" />
          
          <div className="relative">
            <div className="flex items-center gap-4 mb-5">
              <div className="relative">
                <img 
                  src={user?.avatar} 
                  alt="Profile"
                  className="w-20 h-20 rounded-2xl bg-[var(--bg-elevated)] border-2 border-[var(--gold)]"
                />
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--gold-light)] to-[var(--gold-dark)] flex items-center justify-center shadow-lg shadow-[var(--gold-glow)]">
                  <Crown className="w-4 h-4 text-black" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">{user?.name || 'Player'}</h2>
                <p className="text-sm text-[var(--text-muted)]">@{user?.username}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Zap className="w-3 h-3 text-[var(--gold)]" />
                  <span className="text-xs font-bold text-[var(--gold)]">VIP MEMBER</span>
                </div>
              </div>
            </div>

            {/* VIP Progress */}
            <div className="bg-[var(--bg-primary)] rounded-xl p-4 border border-[var(--border-gold)]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-[var(--gold)]" />
                  <span className="font-bold text-white">VIP Level 3</span>
                </div>
                <span className="text-sm font-bold text-[var(--gold)]">65%</span>
              </div>
              <div className="h-3 bg-black/40 rounded-full overflow-hidden border border-[var(--border)]">
                <div className="h-full w-[65%] bg-gradient-to-r from-[var(--gold-dark)] via-[var(--gold)] to-[var(--gold-light)] rounded-full animate-pulse-gold" />
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-2">350 XP to Level 4 • Unlock exclusive rewards</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 pb-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-[var(--gold)]" />
          <h2 className="text-sm font-bold text-[var(--gold)] uppercase tracking-wider">Your Stats</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, i) => (
            <div key={i} className="card p-4 text-center">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-2 border border-white/5`}>
                <stat.icon className="w-5 h-5 text-[var(--gold)]" />
              </div>
              <p className="font-black text-lg text-white">{stat.value}</p>
              <p className="text-xs text-[var(--text-muted)]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div className="px-4 pb-8">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-[var(--gold)]" />
          <h2 className="text-sm font-bold text-[var(--gold)] uppercase tracking-wider">Settings</h2>
        </div>
        <div className="card divide-y divide-white/5">
          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                tg?.HapticFeedback?.selectionChanged();
                item.action?.();
              }}
              className="w-full p-4 flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center border border-white/5`}>
                <item.icon className={`w-5 h-5 ${item.iconColor}`} />
              </div>
              <span className="flex-1 text-left font-bold text-white">{item.label}</span>
              {item.value && (
                <span className="text-sm text-[var(--gold)] font-semibold">{item.value}</span>
              )}
              <ChevronRight className="w-5 h-5 text-[var(--gold)]" />
            </button>
          ))}
        </div>
      </div>

      {/* Language Modal */}
      {showLanguageModal && (
        <div className="modal-overlay" onClick={() => setShowLanguageModal(false)}>
          <div className="modal max-h-[70vh]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-[var(--gold)]" />
                <h3 className="font-bold text-white">{t('language')}</h3>
              </div>
              <button 
                onClick={() => setShowLanguageModal(false)}
                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="space-y-1 overflow-y-auto">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    tg?.HapticFeedback?.selectionChanged();
                    changeLanguage(lang.code);
                    setShowLanguageModal(false);
                  }}
                  className={`w-full p-3 flex items-center gap-3 rounded-xl transition-colors border ${
                    currentLanguage === lang.code 
                      ? 'bg-[var(--gold)]/10 border-[var(--border-gold)]' 
                      : 'border-transparent hover:bg-white/5'
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="flex-1 text-left text-white font-medium">{lang.name}</span>
                  {currentLanguage === lang.code && (
                    <Check className="w-5 h-5 text-[var(--gold)]" />
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
