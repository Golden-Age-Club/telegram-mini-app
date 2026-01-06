import { useState } from 'react';
import { Home, Gamepad2, Wallet, User, Globe, Bell, Shield, MessageCircle, FileText, LogOut, ChevronRight, Crown, Target, Trophy, TrendingUp, X, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ProfilePage = ({ user, onNavigate, onLogout }) => {
  const { t, changeLanguage, currentLanguage, languages } = useLanguage();
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const stats = [
    { icon: Target, label: 'Total Bets', value: '1,247', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { icon: Trophy, label: 'Total Wins', value: '892', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { icon: TrendingUp, label: 'Win Rate', value: '71.5%', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { icon: Crown, label: 'Best Win', value: '$4,800', color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  const menuItems = [
    { icon: Globe, label: t('language'), value: languages.find(l => l.code === currentLanguage)?.name, action: () => setShowLanguageModal(true) },
    { icon: Bell, label: 'Notifications', value: 'Enabled' },
    { icon: Shield, label: 'Security', value: '2FA On' },
    { icon: MessageCircle, label: 'Support', value: '24/7' },
    { icon: FileText, label: 'Terms & Privacy' },
  ];

  return (
    <div className="min-h-screen bg-[--bg-base] text-white pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-[--border] px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">{t('myProfile')}</h1>
          <div className="flex items-center gap-2 bg-[--bg-card] border border-[--border] rounded-full px-3 py-1.5">
            <span className="text-xs text-amber-500 font-semibold">$</span>
            <span className="text-sm font-semibold">{user?.balance?.toLocaleString() || '2,368.50'}</span>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Profile Card */}
        <div className="card p-6 bg-gradient-to-br from-purple-500/20 via-[--bg-card] to-[--bg-card] border-purple-500/20">
          <div className="flex items-center gap-4 mb-6">
            <img 
              src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=john'} 
              alt="Profile"
              className="w-16 h-16 rounded-2xl bg-[--bg-elevated]"
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold">{user?.name || 'John Doe'}</h2>
              <p className="text-[--text-secondary]">@{user?.username || 'johndoe'}</p>
              <p className="text-xs text-[--text-muted]">ID: {user?.id || '123456789'}</p>
            </div>
          </div>

          {/* VIP Progress */}
          <div className="bg-[--bg-elevated] rounded-xl p-4 border border-[--border]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500" />
                <span className="font-semibold">VIP Level 3</span>
              </div>
              <span className="text-xs text-[--text-muted]">65%</span>
            </div>
            <div className="h-2 bg-[--bg-base] rounded-full overflow-hidden mb-2">
              <div className="h-full w-[65%] bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" />
            </div>
            <p className="text-xs text-[--text-muted]">$1,200 more to VIP Level 4</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, i) => (
            <div key={i} className="card p-4 text-center">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-xs text-[--text-muted]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Menu */}
        <div className="card divide-y divide-[--border]">
          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={item.action}
              className="w-full p-4 flex items-center gap-4 hover:bg-[--bg-elevated] transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[--bg-elevated] flex items-center justify-center">
                <item.icon className="w-5 h-5 text-[--text-secondary]" />
              </div>
              <span className="flex-1 text-left font-medium">{item.label}</span>
              {item.value && <span className="text-sm text-[--text-muted]">{item.value}</span>}
              <ChevronRight className="w-5 h-5 text-[--text-muted]" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full btn py-4 bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20"
        >
          <LogOut className="w-5 h-5" />
          {t('logout')}
        </button>
      </main>

      {/* Language Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowLanguageModal(false)}>
          <div 
            className="w-full max-w-lg bg-[--bg-card] border-t border-[--border] rounded-t-3xl animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-[--border] flex items-center justify-between">
              <h3 className="font-semibold">{t('language')}</h3>
              <button 
                onClick={() => setShowLanguageModal(false)}
                className="w-8 h-8 rounded-lg bg-[--bg-elevated] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    changeLanguage(lang.code);
                    setShowLanguageModal(false);
                  }}
                  className={`w-full p-4 flex items-center gap-4 hover:bg-[--bg-elevated] transition-colors ${
                    currentLanguage === lang.code ? 'bg-[--bg-elevated]' : ''
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="flex-1 text-left font-medium">{lang.name}</span>
                  {currentLanguage === lang.code && (
                    <Check className="w-5 h-5 text-amber-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav currentPage="profile" onNavigate={onNavigate} />
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

export default ProfilePage;
