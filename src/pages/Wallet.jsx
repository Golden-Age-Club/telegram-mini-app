import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, History, Gift, CreditCard, Bitcoin, Building2 } from 'lucide-react';
import Layout from '../components/Layout';

const Wallet = ({ user, updateBalance, navigate }) => {
  const tg = window.Telegram?.WebApp;
  const [view, setView] = useState('main');
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [isInTelegram, setIsInTelegram] = useState(false);

  const quickAmounts = [100, 500, 1000, 2000, 5000];

  useEffect(() => {
    // Check if we're in Telegram environment
    const inTelegram = tg && tg.initData && tg.initData.length > 0;
    setIsInTelegram(inTelegram);
    
    if (inTelegram) {
      tg.setHeaderColor('#000000');
      tg.setBackgroundColor('#000000');
    }
  }, [tg]);

  useEffect(() => {
    if (!isInTelegram || !tg?.MainButton) return;

    if (view === 'deposit' && selectedAmount) {
      tg.MainButton.setText(`Deposit $${selectedAmount}`);
      tg.MainButton.color = '#4caf50';
      tg.MainButton.textColor = '#ffffff';
      tg.MainButton.show();
      tg.MainButton.onClick(() => {
        tg.HapticFeedback?.notificationOccurred('success');
        updateBalance(selectedAmount);
        setView('main');
        setSelectedAmount(null);
      });
    } else if (view === 'withdraw' && selectedAmount) {
      tg.MainButton.setText(`Withdraw $${selectedAmount}`);
      tg.MainButton.color = '#ff6b35';
      tg.MainButton.textColor = '#ffffff';
      tg.MainButton.show();
      tg.MainButton.onClick(() => {
        tg.HapticFeedback?.notificationOccurred('success');
        updateBalance(-selectedAmount);
        setView('main');
        setSelectedAmount(null);
      });
    } else {
      tg.MainButton.hide();
    }

    return () => {
      tg.MainButton.offClick();
    };
  }, [view, selectedAmount, tg, updateBalance, isInTelegram]);

  const transactions = [
    { type: 'deposit', amount: 500, date: 'Today, 2:30 PM' },
    { type: 'win', amount: 150, date: 'Today, 11:45 AM' },
    { type: 'withdraw', amount: -200, date: 'Yesterday' },
  ];

  if (view === 'deposit' || view === 'withdraw') {
    const isDeposit = view === 'deposit';
    return (
      <div className="page">
        {/* Header */}
        <div className="header-bar">
          <button 
            onClick={() => setView('main')}
            className="flex items-center gap-1 text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-bold text-white">{isDeposit ? 'Deposit' : 'Withdraw'}</span>
          <div className="w-5" />
        </div>

        {/* Amount Selection */}
        <div className="p-4">
          <div className="card p-4">
            <p className="text-sm text-[var(--text-muted)] mb-3">Select Amount</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {(isDeposit ? quickAmounts : [50, 100, 250, 500, 1000]).map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    tg?.HapticFeedback?.selectionChanged();
                    setSelectedAmount(amount);
                  }}
                  disabled={!isDeposit && amount > (user?.balance || 0)}
                  className={`py-3 rounded-xl font-bold text-sm transition-all ${
                    selectedAmount === amount
                      ? isDeposit 
                        ? 'bg-[#4caf50] text-white' 
                        : 'bg-[#ff6b35] text-white'
                      : !isDeposit && amount > (user?.balance || 0)
                      ? 'bg-[var(--bg-elevated)] opacity-30 text-white'
                      : 'bg-[var(--bg-elevated)] text-white'
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>

            <input
              type="number"
              placeholder="Enter custom amount"
              className="input"
              onChange={(e) => {
                const val = Number(e.target.value) || 0;
                setSelectedAmount(isDeposit ? val : Math.min(val, user?.balance || 0));
              }}
            />
          </div>
        </div>

        {/* Payment Methods (Deposit only) */}
        {isDeposit && (
          <div className="p-4 pt-0">
            <p className="text-sm text-[var(--text-muted)] mb-3">Payment Method</p>
            <div className="space-y-2">
              {[
                { icon: CreditCard, name: 'Credit Card', desc: 'Instant' },
                { icon: Bitcoin, name: 'Crypto', desc: 'BTC, ETH, USDT' },
                { icon: Building2, name: 'Bank Transfer', desc: '1-3 days' },
              ].map((method, i) => (
                <button key={i} className="menu-item w-full rounded-xl">
                  <div className="menu-icon">
                    <method.icon className="w-5 h-5 text-[var(--text-secondary)]" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-white text-sm">{method.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{method.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Fallback button */}
        {!isInTelegram && selectedAmount && (
          <div className="p-4">
            <button 
              onClick={() => {
                updateBalance(isDeposit ? selectedAmount : -selectedAmount);
                setView('main');
                setSelectedAmount(null);
              }}
              className={`w-full py-4 rounded-xl font-bold ${
                isDeposit 
                  ? 'bg-[#4caf50] text-white' 
                  : 'bg-[#ff6b35] text-white'
              }`}
            >
              {isDeposit ? 'Deposit' : 'Withdraw'} ${selectedAmount}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <Layout title="Wallet" user={user} navigate={navigate} currentScreen="wallet">
      <div className="page p-4 space-y-6">
      {/* Header */}
      <div className="header-bar">
        <button 
          onClick={() => navigate('home')}
          className="w-8 h-8 rounded-full bg-[#0088cc] flex items-center justify-center flex-shrink-0"
        >
          <span className="text-white text-sm">✈</span>
        </button>
        <span className="font-bold text-white truncate flex-1 min-w-0 text-center">My Wallet</span>
        <div className="balance-chip flex-shrink-0">
          <div className="coin-icon">$</div>
          <span className="text-[var(--gold)] truncate">{user?.balance?.toLocaleString() || '2,368.50'}</span>
        </div>
      </div>

      {/* Balance Card - Premium Casino Style */}
      <div className="p-4">
        <div className="wallet-card">
          <div className="casino-ornament mb-6"></div>
          <p className="wallet-balance-label">USDT Balance</p>
          <p className="wallet-balance">{user?.balance?.toLocaleString() || '2,368.50'}</p>
          
          <div className="flex gap-2 sm:gap-4 mt-8">
            <button 
              onClick={() => {
                tg?.HapticFeedback?.impactOccurred('light');
                setView('deposit');
              }}
              className="btn btn-success flex-1 btn-lg font-bold relative overflow-hidden group min-w-0"
            >
              <span className="relative z-10 flex items-center justify-center gap-1 sm:gap-2 truncate">
                <span className="flex-shrink-0">💰</span>
                <span className="truncate">Deposit</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
            <button 
              onClick={() => {
                tg?.HapticFeedback?.impactOccurred('light');
                setView('withdraw');
              }}
              className="btn btn-secondary flex-1 btn-lg font-bold border-2 border-orange-500/30 hover:border-orange-500/60 hover:bg-orange-500/10 min-w-0"
            >
              <span className="flex items-center justify-center gap-1 sm:gap-2 truncate">
                <span className="flex-shrink-0">💸</span>
                <span className="truncate">Withdraw</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Items - Premium Casino Style */}
      <div className="px-4">
        <button className="menu-item w-full rounded-t-2xl group">
          <div className="menu-icon group-hover:scale-110 transition-transform duration-300">
            <History className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-emerald-400 transition-colors duration-300" />
          </div>
          <span className="flex-1 text-left font-semibold text-white group-hover:text-emerald-400 transition-colors duration-300">Transaction History</span>
          <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-300" />
        </button>
        <button className="menu-item w-full rounded-b-2xl group">
          <div className="menu-icon group-hover:scale-110 transition-transform duration-300">
            <Gift className="w-5 h-5 text-[var(--gold)] group-hover:scale-110 transition-transform duration-300" />
          </div>
          <span className="flex-1 text-left font-semibold text-white group-hover:text-gold transition-colors duration-300">My Bonuses</span>
          <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-gold group-hover:translate-x-1 transition-all duration-300" />
        </button>
      </div>

      {/* Recent Transactions - Premium Casino Style */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-[var(--text-muted)] uppercase tracking-wider font-semibold">Recent Activity</p>
          <button className="text-xs text-gold hover:text-gold-light transition-colors font-medium">
            View All →
          </button>
        </div>
        <div className="card">
          <div className="space-y-3">
            {transactions.map((tx, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-gold/20 transition-all duration-300 group">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${
                  tx.type === 'deposit' ? 'bg-green-500/20 border-green-500/30 group-hover:border-green-500/60' :
                  tx.type === 'win' ? 'bg-amber-500/20 border-amber-500/30 group-hover:border-amber-500/60' : 
                  'bg-red-500/20 border-red-500/30 group-hover:border-red-500/60'
                }`}>
                  <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                    {tx.type === 'deposit' ? '💵' : tx.type === 'win' ? '🏆' : '💸'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm capitalize tracking-tight">{tx.type}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{tx.date}</p>
                </div>
                <p className={`font-bold text-lg tracking-tight ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default Wallet;
