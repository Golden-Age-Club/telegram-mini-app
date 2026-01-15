import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Copy, Check, Clock } from 'lucide-react';
import { useApi } from '../contexts/ApiContext';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';

const Wallet = () => {
  const tg = window.Telegram?.WebApp;
  const location = useLocation();
  const navigate = useNavigate();
  const { createWithdrawal } = useApi();
  const toast = useToast();
  const { isAuthenticated } = useAuth();

  const isDepositRoute = location.pathname.endsWith('/wallet/deposit') || location.pathname.endsWith('/wallet');
  const isWithdrawRoute = location.pathname.endsWith('/wallet/withdraw');

  const [activeTab, setActiveTab] = useState(isWithdrawRoute ? 'withdraw' : 'deposit');
  const [depositStep, setDepositStep] = useState('form');
  const [amount, setAmount] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('trc20');
  const [copied, setCopied] = useState(false);

  const networks = [
    { id: 'trc20', name: 'USDT.TRC20', label: 'TRC20' },
    { id: 'erc20', name: 'USDT.ERC20', label: 'ERC20' },
    { id: 'bep20', name: 'USDT.BEP20', label: 'BEP20' }
  ];

  const mockAddresses = {
    trc20: 'T9yD14Nj9j7xAB4dbGeiX9h8zzCyrXYZ',
    erc20: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    bep20: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
  };

  const address = mockAddresses[selectedNetwork];
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${address}&bgcolor=000000&color=ffffff&margin=10`;

  useEffect(() => {
    if (!tg) return;
    tg.setHeaderColor('#000000');
    tg.setBackgroundColor('#000000');
  }, [tg]);

  const loadTransactions = async () => {
    try {
      if (walletApi?.fetchTransactions) {
        const response = await walletApi.fetchTransactions(1, 10);
        setTransactions(response.transactions || []);
      }
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
  };

  const handleDeposit = async () => {
    if (!selectedAmount || !walletApi?.createDeposit) return;
    
    try {
      setIsLoading(true);
      const response = await walletApi.createDeposit(selectedAmount, selectedCurrency);
      
      setDepositOrder(response);
      setView('deposit-success');
      
      // Refresh transactions
      loadTransactions();
    } catch (error) {
      console.error('Deposit failed:', error);
      tg?.showAlert?.(`Deposit failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawal = async () => {
    if (!selectedAmount || !walletAddress || !walletApi?.createWithdrawal) return;
    
    try {
      setIsLoading(true);
      const response = await walletApi.createWithdrawal(selectedAmount, walletAddress, selectedCurrency);
      
      setView('main');
      setSelectedAmount(null);
      setWalletAddress('');
      
      tg?.showAlert?.('Withdrawal request submitted successfully!');
      
      // Refresh transactions and balance
      loadTransactions();
      if (walletApi.refreshWallet) {
        walletApi.refreshWallet();
      }
    } catch (error) {
      console.error('Withdrawal failed:', error);
      tg?.showAlert?.(`Withdrawal failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    tg?.showAlert?.('Copied to clipboard!');
  };

  useEffect(() => {
    if (isWithdrawRoute) {
      setActiveTab('withdraw');
    } else if (isDepositRoute) {
      setActiveTab('deposit');
    }
  }, [isDepositRoute, isWithdrawRoute]);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    tg?.HapticFeedback?.notificationOccurred('success');
    setTimeout(() => setCopied(false), 2000);
  };

  const parsedAmount = Number(amount);
  const isValidAmount = !Number.isNaN(parsedAmount) && parsedAmount > 0;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'deposit') {
      navigate('/wallet/deposit');
      setDepositStep('form');
    } else if (tab === 'withdraw') {
      navigate('/wallet/withdraw');
    }
  };

  const handleProceed = () => {
    if (!isValidAmount) return;
    setDepositStep('details');
  };

  const handleBackToForm = () => {
    setDepositStep('form');
  };

  const renderDepositForm = () => (
    <div className="space-y-6">
      <div className="card p-0 space-y-4">
        <p className="text-sm text-[var(--text-muted)] font-medium uppercase tracking-wide">
          Network
        </p>
        <select
          value={selectedNetwork}
          onChange={(e) => setSelectedNetwork(e.target.value)}
          className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
        >
          {networks.map((net) => (
            <option key={net.id} value={net.id}>
              {net.name}
            </option>
          ))}
        </select>
      </div>

      <div className="card p-0 space-y-4">
        <p className="text-sm text-[var(--text-muted)] font-medium uppercase tracking-wide">
          Amount (USDT)
        </p>

        <div className="relative">
          <input
            type="number"
            value={amount}
            placeholder="0.00"
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-2xl font-bold text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors"
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.01"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--text-muted)]">
            USDT
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleProceed}
        disabled={!isValidAmount}
        className={`w-full py-2 rounded-xl font-bold text-lg shadow-lg transform active:scale-95 transition-all ${
          isValidAmount
            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/20'
            : 'bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed'
        }`}
      >
        Proceed
      </button>
    </div>
  );

  const renderDepositDetails = () => (
    <div className="space-y-6">
      <button
        type="button"
        onClick={handleBackToForm}
        className="text-sm text-[var(--text-muted)] hover:text-white transition-colors"
      >
        ← Edit amount or network
      </button>

      <div className="card p-6 flex flex-col items-center text-center space-y-6">
        <div className="space-y-1">
          <p className="text-gray-400 text-sm">Send exactly</p>
          <p className="text-3xl font-black text-white tracking-tight">
            {parsedAmount.toLocaleString()} <span className="text-emerald-500">USDT</span>
          </p>
          <p className="text-xs text-gray-400">
            Network: {networks.find((n) => n.id === selectedNetwork)?.name}
          </p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
          <div className="relative bg-white p-3 rounded-xl">
            <img
              src={qrCodeUrl}
              alt="Deposit QR Code"
              className="w-48 h-48 object-contain"
            />
          </div>
        </div>

        <div className="w-full space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Deposit Address ({networks.find((n) => n.id === selectedNetwork)?.label})
          </p>
          <button
            type="button"
            onClick={handleCopy}
            className="w-full flex items-center justify-between bg-black/30 border border-white/10 p-3 rounded-xl group active:scale-95 transition-all"
          >
            <span className="text-xs font-mono text-gray-300 truncate mr-2">
              {address}
            </span>
            <div
              className={`p-2 rounded-lg ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-500'
                  : 'bg-white/5 text-gray-400 group-hover:text-white'
              }`}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </div>
          </button>
        </div>

        <div className="text-xs text-yellow-500/80 bg-yellow-500/10 px-4 py-2 rounded-lg">
          Only send USDT ({networks.find((n) => n.id === selectedNetwork)?.label}) to this address.
          Sending other assets may result in permanent loss.
        </div>
      </div>
    </div>
  );

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

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
      } else {
        toast.error(result?.error || 'Withdrawal failed. Please try again.');
      }
    } catch (err) {
      toast.error('Withdrawal failed. Please try again.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const renderWithdraw = () => (
    <div className="space-y-6">
      <div className="card p-0 space-y-4">
        <p className="text-sm text-[var(--text-muted)] font-medium uppercase tracking-wide">
          Amount (USDT)
        </p>
        <div className="relative">
          <input
            type="number"
            value={withdrawAmount}
            placeholder="0.00"
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-2xl font-bold text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors"
            onChange={(e) => setWithdrawAmount(e.target.value)}
            min="0"
            step="0.01"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--text-muted)]">
            USDT
          </span>
        </div>
      </div>

      <div className="card p-0 space-y-4">
        <p className="text-sm text-[var(--text-muted)] font-medium uppercase tracking-wide">
          USDT Wallet Address (TRC20)
        </p>
        <input
          type="text"
          value={withdrawAddress}
          placeholder="Enter your USDT wallet address"
          className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors"
          onChange={(e) => setWithdrawAddress(e.target.value)}
        />
      </div>

      <button
        type="button"
        onClick={handleWithdraw}
        disabled={!isValidWithdrawAmount || !isValidWithdrawAddress || isWithdrawing}
        className={`w-full py-2 rounded-xl font-bold text-lg shadow-lg transform active:scale-95 transition-all ${
          isValidWithdrawAmount && isValidWithdrawAddress && !isWithdrawing
            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/20'
            : 'bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed'
        }`}
      >
        {isWithdrawing ? 'Processing...' : 'Withdraw'}
      </button>
    </div>
  );

  const renderContent = () => {
    if (activeTab === 'withdraw') {
      return renderWithdraw();
    }
    if (depositStep === 'details' && isValidAmount) {
      return renderDepositDetails();
    }
    return renderDepositForm();
  };

  if (!isAuthenticated) {
    return (
      <div className="page pb-24 p-4 space-y-6">
        <div className="header-bar">
          <span className="font-bold text-white text-lg">Wallet</span>
        </div>
        <div className="card p-4 bg-black/40 border border-yellow-500/40 rounded-2xl text-center space-y-2">
          <p className="text-sm text-yellow-400 font-semibold">
            Please log in to access your wallet.
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Sign in to view your USDT balance, deposit, and withdraw funds.
          </p>
        </div>
      </div>
    );
  }

  // Main Wallet View
  return (
    <div className="page pb-24 p-4 space-y-6">
      <div className="header-bar">
        <span className="font-bold text-white text-lg">Wallet</span>
      </div>

      <div className="flex gap-2 bg-black/40 border border-white/10 rounded-2xl p-1">
        <button
          type="button"
          onClick={() => handleTabChange('deposit')}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'deposit'
              ? 'bg-white text-black'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Deposit
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('withdraw')}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'withdraw'
              ? 'bg-white text-black'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Withdraw
        </button>
      </div>

      {renderContent()}
    </div>
  );
};

export default Wallet;