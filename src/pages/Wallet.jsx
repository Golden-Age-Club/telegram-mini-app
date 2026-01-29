import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Copy,
  Check,
  Clock,
  Wallet as WalletIcon,
  ArrowDownCircle,
  ArrowUpCircle,
  History,
  Shield,
  Zap,
  ChevronRight,
  AlertCircle,
  QrCode
} from 'lucide-react';
import { useApi } from '../contexts/ApiContext.jsx';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext.jsx';
import walletApi from '../api/wallet';

const Wallet = () => {
  const tg = window.Telegram?.WebApp;
  const location = useLocation();
  const navigate = useNavigate();
  const { createWithdrawal } = useApi();
  const { isAuthenticated, user } = useAuth();

  const isDepositRoute = location.pathname.endsWith('/wallet/deposit') || location.pathname.endsWith('/wallet');
  const isWithdrawRoute = location.pathname.endsWith('/wallet/withdraw');

  const [activeTab, setActiveTab] = useState(isWithdrawRoute ? 'withdraw' : 'deposit');
  const [depositStep, setDepositStep] = useState('form');
  const [amount, setAmount] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('trc20');
  const [copied, setCopied] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Withdraw state
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Deposit API state
  const [isCreatingDeposit, setIsCreatingDeposit] = useState(false);
  const [depositData, setDepositData] = useState(null);

  const networks = [
    { id: 'trc20', name: 'USDT.TRC20', label: 'TRC20', fee: '1.00 USDT' },
    { id: 'erc20', name: 'USDT.ERC20', label: 'ERC20', fee: '5.00 USDT' },
    { id: 'bep20', name: 'USDT.BEP20', label: 'BEP20', fee: '0.80 USDT' }
  ];

  const mockAddresses = {
    trc20: 'T9yD14Nj9j7xAB4dbGeiX9h8zzCyrXYZ',
    erc20: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    bep20: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
  };

  const address = mockAddresses[selectedNetwork];
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${address}&bgcolor=ffffff&color=000000&margin=0`;

  useEffect(() => {
    if (tg) {
      tg.setHeaderColor('#000000');
      tg.setBackgroundColor('#000000');
    }
  }, [tg]);

  useEffect(() => {
    if (isAuthenticated) {
      loadTransactions();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isWithdrawRoute) {
      setActiveTab('withdraw');
    } else if (isDepositRoute && activeTab !== 'history') {
      setActiveTab('deposit');
    }
  }, [isDepositRoute, isWithdrawRoute]);

  const loadTransactions = async () => {
    try {
      setIsLoadingHistory(true);
      if (walletApi?.getTransactions) {
        const response = await walletApi.getTransactions(1, 20);
        // Handle different response structures based on api/wallet.js check
        const txList = response.transactions || response.data?.transactions || [];
        setTransactions(txList);
      }
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.notificationOccurred('success');
    }
    toast.success('Address copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'deposit') {
      navigate('/wallet/deposit');
      setDepositStep('form');
      setDepositData(null);
    } else if (tab === 'withdraw') {
      navigate('/wallet/withdraw');
    } else {
      // history tab - stay on wallet base or specific history route if we had one
      navigate('/wallet');
    }
  };

  const handleCreateDeposit = async () => {
    if (!isValidAmount || isCreatingDeposit) return;

    setIsCreatingDeposit(true);
    try {
      const networkCode = networks.find(n => n.id === selectedNetwork)?.name || 'USDT.TRC20';
      const result = await walletApi.createDeposit(parsedAmount, networkCode);

      if (result) {
        setDepositData(result);
        setDepositStep('details');
        toast.success('Deposit order created!');
      }
    } catch (err) {
      console.error('Deposit error:', err);
      // Show backend error detail if available, otherwise fallback to message
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to create deposit order';
      toast.error(errorMessage);
    } finally {
      setIsCreatingDeposit(false);
    }
  };

  const parsedAmount = Number(amount);
  const isValidAmount = !Number.isNaN(parsedAmount) && parsedAmount > 0;

  const withdrawParsedAmount = Number(withdrawAmount);
  const isValidWithdrawAmount = !Number.isNaN(withdrawParsedAmount) && withdrawParsedAmount > 0;
  const isValidWithdrawAddress = withdrawAddress.trim().length > 0;

  const handleWithdraw = async () => {
    if (!isValidWithdrawAmount || !isValidWithdrawAddress || isWithdrawing) return;

    setIsWithdrawing(true);
    try {
      const result = await createWithdrawal(withdrawParsedAmount, withdrawAddress.trim());
      if (result?.success) {
        toast.success('Withdrawal request submitted successfully.');
        setWithdrawAmount('');
        setWithdrawAddress('');
        loadTransactions();
      } else {
        toast.error(result?.error || 'Withdrawal failed. Please try again.');
      }
    } catch (err) {
      toast.error('Withdrawal failed. Please try again.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  // Helper to open auth modals
  const setModal = (type) => {
    const params = new URLSearchParams(location.search);
    params.set('modal', type);
    navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
  };

  // ---------------- RENDER HELPERS ----------------

  const renderDeposit = () => {
    if (depositStep === 'details' && isValidAmount) {
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <button
            onClick={() => setDepositStep('form')}
            className="flex items-center text-sm text-[var(--text-muted)] hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
            Edit Amount
          </button>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 flex flex-col items-center text-center space-y-6">
              <div className="space-y-1">
                <p className="text-[var(--text-muted)] text-sm uppercase tracking-wide">Send Exact Amount</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-black text-white tracking-tight">{parsedAmount.toLocaleString()}</span>
                  <span className="text-xl font-bold text-emerald-500">USDT</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-gray-300">Network: {networks.find((n) => n.id === selectedNetwork)?.label}</span>
                </div>
              </div>

              <div className="relative group p-4 bg-white rounded-2xl shadow-inner">
                <img
                  src={qrCodeUrl}
                  alt="Deposit QR Code"
                  className="w-48 h-48 object-contain mix-blend-multiply"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-2xl backdrop-blur-sm">
                  <QrCode className="w-12 h-12 text-white" />
                </div>
              </div>

              <div className="w-full space-y-3">
                <div className="text-left">
                  <p className="text-xs text-[var(--text-muted)] mb-1.5 ml-1">Deposit Address</p>
                  <button
                    onClick={handleCopy}
                    className="w-full flex items-center justify-between bg-white/5 border border-white/10 hover:border-[var(--gold)]/50 p-4 rounded-xl group active:scale-[0.98] transition-all"
                  >
                    <span className="text-xs font-mono text-gray-300 truncate mr-2">
                      {depositData?.payment_address || address}
                    </span>
                    <div
                      className={`p-2 rounded-lg transition-colors ${copied
                        ? 'bg-emerald-500/20 text-emerald-500'
                        : 'bg-white/5 text-gray-400 group-hover:text-white'
                        }`}
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </div>
                  </button>
                </div>

              </div>

              <div className="flex gap-3 items-start p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-left">
                <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-500/90 leading-relaxed">
                  Send only <strong>USDT ({networks.find((n) => n.id === selectedNetwork)?.label})</strong> to this address.
                  Sending other assets will result in permanent loss.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-[var(--text-muted)] ml-1">Select Network</label>
          <div className="grid grid-cols-1 gap-2">
            {networks.map((net) => (
              <button
                key={net.id}
                onClick={() => setSelectedNetwork(net.id)}
                className={`relative flex items-center justify-between p-4 rounded-xl border transition-all ${selectedNetwork === net.id
                  ? 'bg-[var(--gold)]/10 border-[var(--gold)] shadow-[0_0_15px_rgba(255,215,0,0.1)]'
                  : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedNetwork === net.id ? 'border-[var(--gold)]' : 'border-gray-500'}`}>
                    {selectedNetwork === net.id && <div className="w-2 h-2 rounded-full bg-[var(--gold)]" />}
                  </div>
                  <div className="text-left">
                    <span className={`block text-sm font-bold ${selectedNetwork === net.id ? 'text-[var(--gold)]' : 'text-white'}`}>{net.name}</span>
                    <span className="text-xs text-gray-500">Fee: ~{net.fee}</span>
                  </div>
                </div>
                {selectedNetwork === net.id && <Check className="w-5 h-5 text-[var(--gold)]" />}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-[var(--text-muted)] ml-1">Deposit Amount</label>
          <div className="relative group">
            <input
              type="number"
              value={amount}
              placeholder="0.00"
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-3xl font-bold text-white placeholder-white/10 focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]/50 transition-all"
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
              <span className="text-lg font-bold text-[var(--text-muted)]">USDT</span>
            </div>
          </div>
          <div className="flex justify-between px-1">
            <span className="text-xs text-gray-500">Min. Deposit: 10 USDT</span>
            <span className="text-xs text-gray-500">Instant Arrival</span>
          </div>
        </div>

        <button
          onClick={handleCreateDeposit}
          disabled={!isValidAmount || isCreatingDeposit}
          className={`w-full py-4 rounded-xl font-bold text-lg uppercase tracking-wide shadow-lg transform transition-all ${isValidAmount && !isCreatingDeposit
            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/20 active:scale-[0.98]'
            : 'bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed'
            }`}
        >
          {isCreatingDeposit ? 'Creating Order...' : 'Proceed to Pay'}
        </button>
      </div>
    );
  };

  const renderWithdraw = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10 flex gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
        <p className="text-xs text-yellow-200/80 leading-relaxed">
          Ensure you enter the correct <strong>TRC20</strong> address. Withdrawals to other networks cannot be recovered.
        </p>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-[var(--text-muted)] ml-1">Amount to Withdraw</label>
        <div className="relative">
          <input
            type="number"
            value={withdrawAmount}
            placeholder="0.00"
            onChange={(e) => setWithdrawAmount(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-3xl font-bold text-white placeholder-white/10 focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]/50 transition-all"
          />
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
            <span className="text-lg font-bold text-[var(--text-muted)]">USDT</span>
          </div>
        </div>
        <div className="flex justify-between px-1">
          <span className="text-xs text-gray-500">Available: {user?.balance?.toLocaleString() || '0'} USDT</span>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-[var(--text-muted)] ml-1">Wallet Address (TRC20)</label>
        <div className="relative">
          <input
            type="text"
            value={withdrawAddress}
            placeholder="Paste your TRC20 address"
            onChange={(e) => setWithdrawAddress(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]/50 transition-all"
          />
          <WalletIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
        </div>
      </div>

      <button
        onClick={handleWithdraw}
        disabled={!isValidWithdrawAmount || !isValidWithdrawAddress || isWithdrawing}
        className={`w-full py-4 rounded-xl font-bold text-lg uppercase tracking-wide shadow-lg transform transition-all ${isValidWithdrawAmount && isValidWithdrawAddress && !isWithdrawing
          ? 'bg-gradient-to-r from-[var(--gold)] to-amber-600 text-black shadow-[0_0_20px_rgba(255,215,0,0.2)] active:scale-[0.98]'
          : 'bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed'
          }`}
      >
        {isWithdrawing ? 'Processing...' : 'Withdraw Funds'}
      </button>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {isLoadingHistory ? (
        <div className="flex flex-col items-center justify-center py-12 text-[var(--text-muted)]">
          <div className="w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm">Loading transactions...</p>
        </div>
      ) : transactions.length > 0 ? (
        <div className="space-y-3">
          {transactions.map((tx, idx) => (
            <div key={tx.id || idx} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'deposit' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'
                  }`}>
                  {tx.type === 'deposit' ? <ArrowDownCircle size={20} /> : <ArrowUpCircle size={20} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-white capitalize">{tx.type}</p>
                  <p className="text-xs text-[var(--text-muted)]">{new Date(tx.created_at || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${tx.type === 'deposit' ? 'text-emerald-400' : 'text-white'}`}>
                  {tx.type === 'deposit' ? '+' : '-'}{Number(tx.amount).toLocaleString()} USDT
                </p>
                <p className={`text-xs capitalize ${tx.status === 'completed' ? 'text-emerald-500' :
                  tx.status === 'pending' ? 'text-yellow-500' : 'text-red-500'
                  }`}>{tx.status}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-[var(--text-muted)]">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <History className="w-8 h-8 opacity-50" />
          </div>
          <p className="text-sm">No transactions yet</p>
        </div>
      )}
    </div>
  );

  // ---------------- MAIN RENDER ----------------

  if (!isAuthenticated) {
    return (
      <div className="page min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 space-y-8 text-center relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[var(--gold)]/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 space-y-6 max-w-md w-full">
          {/* Icon */}
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-700 p-[1px] shadow-[0_0_40px_rgba(16,185,129,0.3)]">
            <div className="w-full h-full rounded-[23px] bg-black flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.2),transparent)]" />
              <WalletIcon className="w-10 h-10 text-emerald-500 relative z-10" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Secure <span className="text-emerald-500">Wallet</span>
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Instant USDT deposits and withdrawals. Your funds are protected by industry-leading security protocols.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 gap-3 py-4">
            {[
              { icon: Zap, label: 'Instant Deposit' },
              { icon: Shield, label: 'Secure Storage' },
              { icon: ArrowUpCircle, label: 'Fast Withdraw' },
              { icon: History, label: 'Detailed History' }
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
                <feature.icon className="w-5 h-5 text-emerald-500" />
                <span className="text-xs font-medium text-gray-300">{feature.label}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => setModal('sign-in')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-95 transition-all"
            >
              Login to Access Wallet
            </button>
            <p className="text-xs text-[var(--text-muted)]">
              Don't have an account? <button onClick={() => setModal('sign-up')} className="text-emerald-500 hover:underline">Sign up</button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page pb-24 min-h-screen bg-black relative">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-20 left-0 w-72 h-72 bg-emerald-900/20 rounded-full blur-[100px]" />
        <div className="absolute top-40 right-0 w-72 h-72 bg-[var(--gold)]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 p-4 space-y-6 max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="font-bold text-white text-xl">My Wallet</span>
          <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
            <History className="w-5 h-5 text-gray-400" onClick={() => handleTabChange('history')} />
          </button>
        </div>

        {/* Balance Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/10 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-[var(--gold)]/5 rounded-full blur-[60px] -ml-10 -mb-10" />

          <div className="relative p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Total Balance</p>
                <h2 className="text-4xl font-black text-white tracking-tight">
                  ${user?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                </h2>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <WalletIcon className="w-5 h-5 text-[var(--gold)]" />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleTabChange('deposit')}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-900/20 hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowDownCircle size={16} /> Deposit
              </button>
              <button
                onClick={() => handleTabChange('withdraw')}
                className="flex-1 py-2.5 rounded-xl bg-white/10 text-white text-sm font-bold border border-white/10 hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowUpCircle size={16} /> Withdraw
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
          {[
            { id: 'deposit', label: 'Deposit' },
            { id: 'withdraw', label: 'Withdraw' },
            { id: 'history', label: 'History' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === tab.id
                ? 'bg-[var(--gold)] text-black shadow-lg shadow-yellow-900/20'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="min-h-[300px]">
          {activeTab === 'deposit' && renderDeposit()}
          {activeTab === 'withdraw' && renderWithdraw()}
          {activeTab === 'history' && renderHistory()}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
