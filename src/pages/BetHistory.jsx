import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ArrowDownCircle, ArrowUpCircle, RefreshCcw, Clock, Trophy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import api from '../api/axios';
import { format } from 'date-fns';

const BetHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/wallet/transactions?limit=50');
      // API returns { user_id: "...", transactions: [...] }
      const txs = response?.transactions || [];
      setTransactions(txs);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'deposit': return <ArrowDownCircle className="w-5 h-5 text-emerald-500" />;
      case 'withdrawal': return <ArrowUpCircle className="w-5 h-5 text-red-500" />;
      case 'game_win': return <Trophy className="w-5 h-5 text-[var(--gold)]" />;
      case 'game_bet': return <RefreshCcw className="w-5 h-5 text-blue-400" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getLabel = (type) => {
    switch (type) {
      case 'deposit': return 'Deposit';
      case 'withdrawal': return 'Withdraw';
      case 'game_win': return 'Bills';
      case 'game_bet': return 'Bills';
      case 'game_refund': return 'Bills';
      default: return type?.replace('_', ' ') || 'Transaction';
    }
  };

  const getAmountColor = (type) => {
    switch (type) {
      case 'deposit':
      case 'game_win':
      case 'game_refund':
        return 'text-emerald-400';
      case 'withdrawal':
      case 'game_bet':
        return 'text-white';
      default:
        return 'text-gray-400';
    }
  };

  const getAmountPrefix = (type) => {
    switch (type) {
      case 'deposit':
      case 'game_win':
      case 'game_refund':
        return '+';
      case 'withdrawal':
      case 'game_bet':
        return '-';
      default:
        return '';
    }
  };

  return (
    <div className="page min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="px-4 h-14 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center active:scale-95 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-lg font-bold text-white">Bills History</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Loading history...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
              <Clock className="w-8 h-8 text-gray-600" />
            </div>
            <div>
              <p className="text-white font-medium">No history yet</p>
              <p className="text-sm text-gray-500 mt-1">Your transactions will appear here</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx._id || tx.transaction_id}
                className="bg-[#111] rounded-xl p-4 border border-white/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    {getIcon(tx.type)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white capitalize">
                      {getLabel(tx.type)}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {tx.created_at ? format(new Date(tx.created_at), 'MMM d, yyyy HH:mm') : 'Unknown Date'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-mono font-bold ${getAmountColor(tx.type)}`}>
                    {getAmountPrefix(tx.type)}${Number(tx.amount).toFixed(2)}
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase">
                    {tx.status || 'Completed'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BetHistory;
