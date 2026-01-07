import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, History, Gift, CreditCard, Bitcoin, Building2 } from 'lucide-react';

const Wallet = ({ user, updateBalance, navigate }) => {
  const tg = window.Telegram?.WebApp;
  const [view, setView] = useState('main');
  const [selectedAmount, setSelectedAmount] = useState(null);

  const quickAmounts = [100, 500, 1000, 2000, 5000];

  useEffect(() => {
    if (tg) {
      tg.setHeaderColor('#0f1923');
      tg.setBackgroundColor('#0f1923');
    }
  }, [tg]);

  useEffect(() => {
    if (!tg?.MainButton) return;

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
  }, [view, selectedAmount, tg, updateBalance]);

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
        {!tg?.MainButton && selectedAmount && (
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
    <div className="page">
      {/* Header */}
      <div className="header-bar">
        <button 
          onClick={() => navigate('home')}
          className="w-8 h-8 rounded-full bg-[#0088cc] flex items-center justify-center"
        >
          <span className="text-white text-sm">✈</span>
        </button>
        <span className="font-bold text-white">My Wallet</span>
        <div className="balance-chip">
          <div className="coin-icon">$</div>
          <span className="text-[var(--gold)]">{user?.balance?.toLocaleString() || '2,368.50'}</span>
        </div>
      </div>

      {/* Balance Card */}
      <div className="p-4">
        <div className="wallet-card">
          <p className="wallet-balance-label">USDT Balance:</p>
          <p className="wallet-balance">{user?.balance?.toLocaleString() || '2,368.50'}</p>
          
          <div className="flex gap-3 mt-6">
            <button 
              onClick={() => {
                tg?.HapticFeedback?.impactOccurred('light');
                setView('deposit');
              }}
              className="btn-primary flex-1"
            >
              Deposit
            </button>
            <button 
              onClick={() => {
                tg?.HapticFeedback?.impactOccurred('light');
                setView('withdraw');
              }}
              className="btn-secondary flex-1"
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4">
        <button className="menu-item w-full rounded-t-2xl">
          <div className="menu-icon">
            <History className="w-5 h-5 text-[var(--text-secondary)]" />
          </div>
          <span className="flex-1 text-left font-semibold text-white">Transaction History</span>
          <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
        </button>
        <button className="menu-item w-full rounded-b-2xl">
          <div className="menu-icon">
            <Gift className="w-5 h-5 text-[var(--gold)]" />
          </div>
          <span className="flex-1 text-left font-semibold text-white">My Bonuses</span>
          <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
        </button>
      </div>

      {/* Recent Transactions */}
      <div className="p-4">
        <p className="text-sm text-[var(--text-muted)] mb-3">Recent Activity</p>
        <div className="card">
          {transactions.map((tx, i) => (
            <div key={i} className="game-list-item">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                tx.type === 'deposit' ? 'bg-green-500/20' :
                tx.type === 'win' ? 'bg-amber-500/20' : 'bg-red-500/20'
              }`}>
                <span className="text-lg">
                  {tx.type === 'deposit' ? '💵' : tx.type === 'win' ? '🏆' : '💸'}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white text-sm capitalize">{tx.type}</p>
                <p className="text-xs text-[var(--text-muted)]">{tx.date}</p>
              </div>
              <p className={`font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
