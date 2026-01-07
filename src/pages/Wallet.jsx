import { useState, useEffect } from 'react';
import { ArrowDownLeft, ArrowUpRight, CreditCard, Bitcoin, Building2, ChevronRight, Crown, Sparkles, Shield, Zap } from 'lucide-react';

const Wallet = ({ user, updateBalance, navigate }) => {
  const tg = window.Telegram?.WebApp;
  const [view, setView] = useState('main');
  const [selectedAmount, setSelectedAmount] = useState(null);

  const quickAmounts = [100, 500, 1000, 2000, 5000];

  // Set dark header in Telegram
  useEffect(() => {
    if (tg) {
      tg.setHeaderColor('#0a0a0f');
      tg.setBackgroundColor('#0a0a0f');
    }
  }, [tg]);

  const transactions = [
    { type: 'deposit', amount: 500, date: 'Today, 2:30 PM' },
    { type: 'win', amount: 150, date: 'Today, 11:45 AM' },
    { type: 'withdraw', amount: -200, date: 'Yesterday' },
    { type: 'deposit', amount: 1000, date: 'Jan 5' },
  ];

  // Use MainButton for deposit/withdraw confirmation
  useEffect(() => {
    if (!tg?.MainButton) return;

    if (view === 'deposit' && selectedAmount) {
      tg.MainButton.setText(`Deposit $${selectedAmount}`);
      tg.MainButton.color = '#f59e0b';
      tg.MainButton.textColor = '#000000';
      tg.MainButton.show();
      tg.MainButton.onClick(() => {
        tg.HapticFeedback?.notificationOccurred('success');
        updateBalance(selectedAmount);
        setView('main');
        setSelectedAmount(null);
      });
    } else if (view === 'withdraw' && selectedAmount) {
      tg.MainButton.setText(`Withdraw $${selectedAmount}`);
      tg.MainButton.color = '#ef4444';
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

  if (view === 'deposit') {
    return (
      <div className="page">
        <div className="px-4 pt-4 pb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center border border-emerald-500/20">
              <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">DEPOSIT</h1>
              <p className="text-sm text-[var(--text-muted)]">Add funds to your account</p>
            </div>
          </div>
        </div>

        <div className="px-4 pb-6">
          <div className="card card-gold p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-[var(--gold)]" />
              <h3 className="font-bold text-[var(--gold)] uppercase text-sm tracking-wider">Select Amount</h3>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    tg?.HapticFeedback?.selectionChanged();
                    setSelectedAmount(amount);
                  }}
                  className={`py-4 rounded-xl font-bold transition-all border ${
                    selectedAmount === amount
                      ? 'bg-gradient-to-br from-[var(--gold-light)] to-[var(--gold-dark)] text-black border-[var(--gold)] shadow-lg shadow-[var(--gold-glow)]'
                      : 'bg-[var(--bg-elevated)] text-white border-[var(--border)] hover:border-[var(--border-gold)]'
                  }`}
                >
                  ${amount.toLocaleString()}
                </button>
              ))}
            </div>

            <input
              type="number"
              placeholder="💰 Enter custom amount"
              className="input w-full"
              onChange={(e) => setSelectedAmount(Number(e.target.value) || null)}
            />
          </div>
        </div>

        <div className="px-4 pb-6">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-[var(--gold)]" />
            <h3 className="font-bold text-[var(--gold)] uppercase text-sm tracking-wider">Payment Method</h3>
          </div>
          <div className="space-y-3">
            {[
              { icon: CreditCard, name: 'Credit Card', desc: 'Instant deposit', color: 'from-blue-500/20 to-blue-600/20', iconColor: 'text-blue-400' },
              { icon: Bitcoin, name: 'Crypto', desc: 'BTC, ETH, USDT', color: 'from-amber-500/20 to-orange-600/20', iconColor: 'text-[var(--gold)]' },
              { icon: Building2, name: 'Bank Transfer', desc: '1-3 business days', color: 'from-emerald-500/20 to-emerald-600/20', iconColor: 'text-emerald-400' },
            ].map((method, i) => (
              <button key={i} className="card w-full p-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center border border-white/5`}>
                  <method.icon className={`w-6 h-6 ${method.iconColor}`} />
                </div>
                <div className="flex-1 text-left">
                  <span className="font-bold text-white block">{method.name}</span>
                  <span className="text-xs text-[var(--text-muted)]">{method.desc}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--gold)]" />
              </button>
            ))}
          </div>
        </div>

        {/* Fallback button for non-Telegram */}
        {!tg?.MainButton && selectedAmount && (
          <div className="px-4 pb-8">
            <button 
              onClick={() => {
                updateBalance(selectedAmount);
                setView('main');
                setSelectedAmount(null);
              }}
              className="btn-primary w-full py-4"
            >
              <Zap className="w-4 h-4" />
              DEPOSIT ${selectedAmount.toLocaleString()}
            </button>
          </div>
        )}
      </div>
    );
  }

  if (view === 'withdraw') {
    return (
      <div className="page">
        <div className="px-4 pt-4 pb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center border border-red-500/20">
              <ArrowUpRight className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">WITHDRAW</h1>
              <p className="text-sm text-emerald-400 font-semibold">
                Available: ${user?.balance?.toLocaleString() || '0.00'}
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 pb-6">
          <div className="card card-gold p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-[var(--gold)]" />
              <h3 className="font-bold text-[var(--gold)] uppercase text-sm tracking-wider">Select Amount</h3>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[50, 100, 250, 500, 1000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    tg?.HapticFeedback?.selectionChanged();
                    setSelectedAmount(amount);
                  }}
                  disabled={amount > (user?.balance || 0)}
                  className={`py-4 rounded-xl font-bold transition-all border ${
                    selectedAmount === amount
                      ? 'bg-gradient-to-br from-[var(--gold-light)] to-[var(--gold-dark)] text-black border-[var(--gold)] shadow-lg shadow-[var(--gold-glow)]'
                      : amount > (user?.balance || 0)
                      ? 'bg-[var(--bg-elevated)] opacity-30 text-white border-[var(--border)]'
                      : 'bg-[var(--bg-elevated)] text-white border-[var(--border)] hover:border-[var(--border-gold)]'
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>

            <input
              type="number"
              placeholder="💸 Enter custom amount"
              className="input w-full"
              max={user?.balance || 0}
              onChange={(e) => setSelectedAmount(Math.min(Number(e.target.value) || 0, user?.balance || 0))}
            />
            <p className="text-xs text-[var(--text-muted)] mt-3 flex items-center gap-2">
              <Shield className="w-3 h-3" />
              Min: $50 • Max: $10,000/day • Secure withdrawal
            </p>
          </div>
        </div>

        {/* Fallback button for non-Telegram */}
        {!tg?.MainButton && selectedAmount && (
          <div className="px-4 pb-8">
            <button 
              onClick={() => {
                updateBalance(-selectedAmount);
                setView('main');
                setSelectedAmount(null);
              }}
              className="w-full py-4 rounded-xl font-bold uppercase tracking-wider bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/30"
            >
              WITHDRAW ${selectedAmount.toLocaleString()}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="page">
      {/* Balance Card */}
      <div className="px-4 pt-4 pb-6">
        <div className="card card-gold p-6 relative overflow-hidden">
          {/* Shimmer effect */}
          <div className="absolute inset-0 animate-shimmer pointer-events-none" />
          
          <div className="relative">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-[var(--gold)]" />
              <span className="text-sm font-bold text-[var(--gold)] uppercase tracking-wider">VIP Wallet</span>
            </div>
            
            <p className="text-sm text-[var(--text-muted)] text-center mb-1">Total Balance</p>
            <p className="text-5xl font-black text-center mb-6 text-gold">${user?.balance?.toLocaleString() || '0.00'}</p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  tg?.HapticFeedback?.impactOccurred('light');
                  setView('deposit');
                }}
                className="btn-primary flex-1 py-4"
              >
                <Zap className="w-4 h-4" />
                DEPOSIT
              </button>
              <button 
                onClick={() => {
                  tg?.HapticFeedback?.impactOccurred('light');
                  setView('withdraw');
                }}
                className="btn-secondary flex-1 py-4"
              >
                WITHDRAW
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 pb-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Deposited', value: '$5,200', color: 'text-emerald-400' },
            { label: 'Withdrawn', value: '$2,800', color: 'text-red-400' },
            { label: 'Bonus', value: '$450', color: 'text-[var(--gold)]' },
          ].map((stat, i) => (
            <div key={i} className="card p-3 text-center">
              <p className={`font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-[var(--text-muted)]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div className="px-4 pb-8">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-[var(--gold)]" />
          <h2 className="text-sm font-bold text-[var(--gold)] uppercase tracking-wider">
            Recent Transactions
          </h2>
        </div>
        <div className="card divide-y divide-white/5">
          {transactions.map((tx, i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                tx.type === 'deposit' ? 'bg-emerald-500/10 border-emerald-500/20' :
                tx.type === 'win' ? 'bg-[var(--gold)]/10 border-[var(--border-gold)]' : 'bg-red-500/10 border-red-500/20'
              }`}>
                {tx.type === 'deposit' ? <ArrowDownLeft className="w-5 h-5 text-emerald-400" /> :
                 tx.type === 'win' ? <span className="text-xl">🏆</span> : <ArrowUpRight className="w-5 h-5 text-red-400" />}
              </div>
              <div className="flex-1">
                <p className="font-bold capitalize text-white">{tx.type}</p>
                <p className="text-xs text-[var(--text-muted)]">{tx.date}</p>
              </div>
              <p className={`font-black text-lg ${tx.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
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
