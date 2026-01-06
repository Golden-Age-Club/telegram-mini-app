import { useState } from 'react';
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, History, Gift, Home, Gamepad2, Wallet, User, CreditCard, Bitcoin, Building2, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const WalletPage = ({ user, onNavigate }) => {
  const { t } = useLanguage();
  const [activeView, setActiveView] = useState('main');
  const [selectedAmount, setSelectedAmount] = useState(null);

  const quickAmounts = [100, 500, 1000, 2000, 5000, 10000];

  const transactions = [
    { id: 1, type: 'deposit', amount: 500.00, date: 'Today, 2:30 PM', status: 'completed' },
    { id: 2, type: 'withdraw', amount: -200.00, date: 'Today, 12:15 PM', status: 'completed' },
    { id: 3, type: 'win', amount: 150.75, date: 'Today, 11:45 AM', status: 'completed' },
    { id: 4, type: 'bet', amount: -25.00, date: 'Today, 11:30 AM', status: 'completed' },
    { id: 5, type: 'deposit', amount: 1000.00, date: 'Yesterday', status: 'completed' },
  ];

  const bonuses = [
    { name: 'Welcome Bonus', amount: 100, progress: 65, expiry: '7 days left' },
    { name: 'Daily Cashback', amount: 25.50, progress: 100, expiry: 'Claim now' },
    { name: 'Free Spins', spins: 50, progress: 20, expiry: '3 days left' },
  ];

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit': return { icon: ArrowDownLeft, color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
      case 'withdraw': return { icon: ArrowUpRight, color: 'text-red-500', bg: 'bg-red-500/10' };
      case 'win': return { icon: Gift, color: 'text-amber-500', bg: 'bg-amber-500/10' };
      default: return { icon: Gamepad2, color: 'text-[--text-muted]', bg: 'bg-[--bg-elevated]' };
    }
  };

  if (activeView === 'deposit') {
    return (
      <div className="min-h-screen bg-[--bg-base] text-white pb-24">
        <header className="sticky top-0 z-40 glass border-b border-[--border] px-4 py-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveView('main')}
              className="w-10 h-10 rounded-xl bg-[--bg-elevated] border border-[--border] flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold">{t('deposit')}</h1>
          </div>
        </header>

        <main className="p-4 space-y-6">
          <div className="card p-5">
            <h3 className="font-semibold mb-4">Select Amount</h3>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setSelectedAmount(amount)}
                  className={`py-4 rounded-xl font-semibold transition-all ${
                    selectedAmount === amount
                      ? 'bg-amber-500 text-black'
                      : 'bg-[--bg-elevated] border border-[--border] hover:border-amber-500/50'
                  }`}
                >
                  ${amount.toLocaleString()}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <label className="text-sm text-[--text-muted] mb-2 block">Custom Amount</label>
              <input
                type="number"
                placeholder="Enter amount"
                className="input"
                onChange={(e) => setSelectedAmount(Number(e.target.value))}
              />
            </div>

            <h3 className="font-semibold mb-4">Payment Method</h3>
            <div className="space-y-3 mb-6">
              {[
                { icon: CreditCard, name: 'Credit/Debit Card', color: 'text-blue-500' },
                { icon: Bitcoin, name: 'Cryptocurrency', color: 'text-amber-500' },
                { icon: Building2, name: 'Bank Transfer', color: 'text-emerald-500' },
              ].map((method, i) => (
                <button key={i} className="w-full card p-4 flex items-center gap-4 hover:border-[--border-hover] transition-all">
                  <div className={`w-12 h-12 rounded-xl bg-[--bg-elevated] flex items-center justify-center ${method.color}`}>
                    <method.icon className="w-6 h-6" />
                  </div>
                  <span className="font-medium">{method.name}</span>
                  <ChevronRight className="w-5 h-5 text-[--text-muted] ml-auto" />
                </button>
              ))}
            </div>

            <button className="btn btn-primary w-full py-4">
              Deposit {selectedAmount ? `$${selectedAmount.toLocaleString()}` : ''}
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (activeView === 'withdraw') {
    return (
      <div className="min-h-screen bg-[--bg-base] text-white pb-24">
        <header className="sticky top-0 z-40 glass border-b border-[--border] px-4 py-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveView('main')}
              className="w-10 h-10 rounded-xl bg-[--bg-elevated] border border-[--border] flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold">{t('withdraw')}</h1>
          </div>
        </header>

        <main className="p-4 space-y-6">
          <div className="card p-5">
            <div className="text-center mb-6">
              <p className="text-sm text-[--text-muted] mb-1">Available Balance</p>
              <p className="text-4xl font-bold">${user?.balance?.toLocaleString() || '2,368.50'}</p>
            </div>

            <div className="mb-6">
              <label className="text-sm text-[--text-muted] mb-2 block">Withdraw Amount</label>
              <input type="number" placeholder="Enter amount" className="input" />
              <p className="text-xs text-[--text-muted] mt-2">Min: $50 • Max: $10,000/day</p>
            </div>

            <h3 className="font-semibold mb-4">Withdraw To</h3>
            <div className="space-y-3 mb-6">
              <button className="w-full card p-4 flex items-center justify-between hover:border-[--border-hover] transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[--bg-elevated] flex items-center justify-center">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Bank Account</p>
                    <p className="text-sm text-[--text-muted]">**** 1234</p>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </button>
            </div>

            <button className="btn w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold">
              Request Withdrawal
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[--bg-base] text-white pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-[--border] px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">{t('myWallet')}</h1>
          <div className="flex items-center gap-2 bg-[--bg-card] border border-[--border] rounded-full px-3 py-1.5">
            <span className="text-xs text-amber-500 font-semibold">$</span>
            <span className="text-sm font-semibold">{user?.balance?.toLocaleString() || '2,368.50'}</span>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Balance Card */}
        <div className="card p-6 bg-gradient-to-br from-emerald-500/20 via-[--bg-card] to-[--bg-card] border-emerald-500/20">
          <div className="text-center mb-6">
            <p className="text-sm text-[--text-secondary] mb-1">{t('usdtBalance')}</p>
            <p className="text-4xl font-bold">${user?.balance?.toLocaleString() || '2,368.50'}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setActiveView('deposit')}
              className="btn btn-primary py-4 flex-col gap-1"
            >
              <ArrowDownLeft className="w-5 h-5" />
              <span>{t('deposit')}</span>
            </button>
            <button 
              onClick={() => setActiveView('withdraw')}
              className="btn btn-secondary py-4 flex-col gap-1"
            >
              <ArrowUpRight className="w-5 h-5" />
              <span>{t('withdraw')}</span>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button className="card p-4 flex items-center gap-3 hover:border-[--border-hover] transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <History className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-left">
              <p className="font-medium">{t('transactionHistory')}</p>
              <p className="text-xs text-[--text-muted]">View all</p>
            </div>
          </button>
          <button className="card p-4 flex items-center gap-3 hover:border-[--border-hover] transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Gift className="w-6 h-6 text-amber-500" />
            </div>
            <div className="text-left">
              <p className="font-medium">{t('myBonuses')}</p>
              <p className="text-xs text-[--text-muted]">3 active</p>
            </div>
          </button>
        </div>

        {/* Recent Transactions */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Transactions</h2>
            <button className="text-sm text-amber-500 font-medium">See All</button>
          </div>
          
          <div className="card divide-y divide-[--border]">
            {transactions.slice(0, 4).map((tx) => {
              const { icon: Icon, color, bg } = getTransactionIcon(tx.type);
              return (
                <div key={tx.id} className="p-4 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium capitalize">{tx.type}</p>
                    <p className="text-xs text-[--text-muted]">{tx.date}</p>
                  </div>
                  <p className={`font-semibold ${tx.amount > 0 ? 'text-emerald-500' : 'text-[--text-secondary]'}`}>
                    {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bonuses */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Active Bonuses</h2>
          </div>
          
          <div className="space-y-3">
            {bonuses.map((bonus, i) => (
              <div key={i} className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">{bonus.name}</h3>
                  <span className={`text-xs font-medium ${bonus.progress === 100 ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {bonus.expiry}
                  </span>
                </div>
                <p className="text-xl font-bold text-amber-500 mb-3">
                  {bonus.spins ? `${bonus.spins} Free Spins` : `$${bonus.amount}`}
                </p>
                <div className="h-2 bg-[--bg-elevated] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${bonus.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNav currentPage="wallet" onNavigate={onNavigate} />
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

export default WalletPage;
