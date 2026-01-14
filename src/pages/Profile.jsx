import { useState, useEffect } from 'react';
import { Globe, Bell, Shield, MessageCircle, ChevronRight, Crown, Trophy, Target, X, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const tg = window.Telegram?.WebApp;
  const { t, changeLanguage, currentLanguage, languages } = useLanguage();
  const { user } = useAuth();
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  useEffect(() => {
    if (tg) {
      tg.setHeaderColor('#000000');
      tg.setBackgroundColor('#000000');
    }
  }, [tg]);

  const stats = [
    { icon: Target, label: 'Bets', value: '1,247' },
    { icon: Trophy, label: 'Wins', value: '892' },
    { icon: Crown, label: 'Best Win', value: '$4,800' },
  ];

  const menuItems = [
    { 
      icon: Globe, 
      label: t('language'), 
      value: languages.find(l => l.code === currentLanguage)?.name,
      action: () => setShowLanguageModal(true)
    },
    { icon: Bell, label: 'Notifications', value: 'On' },
    { icon: Shield, label: 'Security', value: '2FA' },
    { icon: MessageCircle, label: 'Support', value: '24/7' },
  ];

  return (
    <div className="page p-4 space-y-6">
      <div className="p-1">
        <div className="relative rounded-3xl bg-gradient-to-br from-emerald-500/20 via-black/80 to-purple-700/30 border border-white/10 shadow-xl overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2),_transparent_55%)]" />
          <div className="relative p-5 space-y-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center overflow-hidden border border-white/20 shadow-lg">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl">👤</span>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white truncate">
                  {user?.name || 'Player'}
                </h2>
                <p className="text-sm text-[var(--text-muted)] truncate">
                  @{user?.username || 'guest'}
                </p>
                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-black/40 border border-emerald-500/40 px-3 py-1">
                  <Crown className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <span className="text-xs font-semibold text-[var(--gold)]">
                    VIP Level 3
                  </span>
                  <span className="text-[10px] text-emerald-300/80">
                    65% to next level
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-black/40 rounded-2xl border border-white/10 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                  Progress
                </span>
                <span className="text-xs text-[var(--text-muted)]">65% complete</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full w-[65%] bg-gradient-to-r from-[var(--gold)] via-amber-400 to-orange-500 rounded-full" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="card p-3 text-center bg-black/40 border border-white/10 rounded-2xl"
                >
                  <div className="w-9 h-9 mx-auto mb-1.5 rounded-xl bg-[var(--bg-elevated)] flex items-center justify-center border border-[var(--gold)]/40">
                    <stat.icon className="w-4 h-4 text-[var(--gold)]" />
                  </div>
                  <p className="font-bold text-white text-sm">{stat.value}</p>
                  <p className="text-[11px] text-[var(--text-muted)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-1 pb-8">
        <div className="rounded-2xl bg-black/40 border border-white/10 overflow-hidden">
          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                tg?.HapticFeedback?.selectionChanged();
                item.action?.();
              }}
              className="menu-item w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors"
            >
              <div className="menu-icon rounded-xl bg-white/5 border border-white/10">
                <item.icon className="w-5 h-5 text-[var(--text-secondary)]" />
              </div>
              <div className="flex-1 text-left">
                <span className="block font-semibold text-white text-sm">
                  {item.label}
                </span>
                {item.value && (
                  <span className="text-[11px] text-[var(--text-muted)]">
                    {item.value}
                  </span>
                )}
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
            </button>
          ))}
        </div>
      </div>

      {showLanguageModal && (
        <div
          className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-end justify-center"
          onClick={() => setShowLanguageModal(false)}
        >
          <div
            className="w-full max-w-sm max-h-[70vh] bg-[var(--bg-elevated)] rounded-t-3xl border border-white/10 shadow-2xl px-4 pt-4 pb-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-white text-base">{t('language')}</h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Choose the language for your Golden Age experience
                </p>
              </div>
              <button
                onClick={() => setShowLanguageModal(false)}
                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="space-y-1 overflow-y-auto max-h-[50vh]">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    tg?.HapticFeedback?.selectionChanged();
                    changeLanguage(lang.code);
                    setShowLanguageModal(false);
                  }}
                  className={`w-full p-3 flex items-center gap-3 rounded-xl transition-colors transition-transform ${
                    currentLanguage === lang.code
                      ? 'bg-[var(--bg-elevated)] border border-[var(--gold)]/40 shadow-inner'
                      : 'hover:bg-[var(--bg-card)] hover:scale-[1.01]'
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <div className="flex-1 text-left">
                    <span className="block text-white text-sm">
                      {lang.name}
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)] uppercase">
                      {lang.code}
                    </span>
                  </div>
                  {currentLanguage === lang.code && (
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-[var(--gold)] font-semibold">
                        Current
                      </span>
                      <Check className="w-4 h-4 text-[var(--gold)]" />
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
