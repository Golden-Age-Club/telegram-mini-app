import { useState, useEffect } from 'react';
import { Globe, Bell, Shield, MessageCircle, ChevronRight, Crown, Trophy, Target, X, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Profile = ({ user, navigate }) => {
  const tg = window.Telegram?.WebApp;
  const { t, changeLanguage, currentLanguage, languages } = useLanguage();
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  useEffect(() => {
    if (tg) {
      tg.setHeaderColor('#0f1923');
      tg.setBackgroundColor('#0f1923');
    }
  }, [tg]);

  const stats = [
    { icon: Target, label: 'Bets', value: '1,247' },
    { icon: Trophy, label: 'Wins', value: '892' },
    { icon: Crown, label: 'Best', value: '$4,800' },
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
    <div className="page">
      {/* Header */}
      <div className="header-bar">
        <div className="w-5" />
        <span className="font-bold text-white">Profile</span>
        <div className="balance-chip">
          <div className="coin-icon">$</div>
          <span className="text-[var(--gold)]">{user?.balance?.toLocaleString() || '2,368.50'}</span>
        </div>
      </div>

      {/* Profile Card */}
      <div className="p-4">
        <div className="card p-4">
          <div className="flex items-center gap-4 mb-4">
            <img 
              src={user?.avatar} 
              alt="Profile"
              className="w-16 h-16 rounded-2xl bg-[var(--bg-elevated)]"
            />
            <div>
              <h2 className="text-xl font-bold text-white">{user?.name || 'Player'}</h2>
              <p className="text-sm text-[var(--text-muted)]">@{user?.username}</p>
            </div>
          </div>

          {/* VIP Progress */}
          <div className="bg-[var(--bg-elevated)] rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-[var(--gold)]" />
                <span className="font-semibold text-white text-sm">VIP Level 3</span>
              </div>
              <span className="text-xs text-[var(--text-muted)]">65%</span>
            </div>
            <div className="h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden">
              <div className="h-full w-[65%] bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, i) => (
            <div key={i} className="card p-3 text-center">
              <stat.icon className="w-5 h-5 text-[var(--gold)] mx-auto mb-1" />
              <p className="font-bold text-white">{stat.value}</p>
              <p className="text-xs text-[var(--text-muted)]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div className="px-4 pb-8">
        <div className="rounded-2xl overflow-hidden">
          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                tg?.HapticFeedback?.selectionChanged();
                item.action?.();
              }}
              className="menu-item w-full"
              style={{
                borderRadius: i === 0 ? '16px 16px 0 0' : i === menuItems.length - 1 ? '0 0 16px 16px' : '0'
              }}
            >
              <div className="menu-icon">
                <item.icon className="w-5 h-5 text-[var(--text-secondary)]" />
              </div>
              <span className="flex-1 text-left font-semibold text-white">{item.label}</span>
              {item.value && (
                <span className="text-sm text-[var(--text-muted)]">{item.value}</span>
              )}
              <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
            </button>
          ))}
        </div>
      </div>

      {/* Language Modal */}
      {showLanguageModal && (
        <div className="modal-overlay" onClick={() => setShowLanguageModal(false)}>
          <div className="modal max-h-[70vh]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">{t('language')}</h3>
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
                  className={`w-full p-3 flex items-center gap-3 rounded-xl transition-colors ${
                    currentLanguage === lang.code 
                      ? 'bg-[var(--bg-elevated)]' 
                      : 'hover:bg-[var(--bg-card)]'
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="flex-1 text-left text-white">{lang.name}</span>
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
