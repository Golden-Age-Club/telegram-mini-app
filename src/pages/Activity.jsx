import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowDownCircle,
    ArrowUpCircle,
    Gamepad2,
    Trophy,
    RefreshCcw,
    Settings,
    ChevronRight,
    ArrowLeft,
    Filter
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import walletApi from '../api/wallet';

const Activity = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { isAuthenticated, user } = useAuth();

    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [expandedTxId, setExpandedTxId] = useState(null);

    const filters = [
        { id: 'all', label: 'All Activity' },
        { id: 'financial', label: 'Financial' },
        { id: 'gaming', label: 'Gaming' }
    ];

    useEffect(() => {
        if (isAuthenticated) {
            loadAllTransactions();
        }
    }, [isAuthenticated, activeFilter]);

    const loadAllTransactions = async () => {
        try {
            setIsLoading(true);
            if (walletApi?.getTransactions) {
                // Determine type filter based on active filter
                let typeFilter = null;
                if (activeFilter === 'financial') {
                    // This will need backend support to filter multiple types
                    // For now, we'll filter client-side
                } else if (activeFilter === 'gaming') {
                    typeFilter = 'game';
                }

                const response = await walletApi.getTransactions(1, 50, typeFilter);
                let txList = response.transactions || response.data?.transactions || [];

                // Client-side filtering if needed
                if (activeFilter === 'financial') {
                    txList = txList.filter(tx =>
                        tx.type === 'deposit' ||
                        tx.type === 'withdrawal' ||
                        tx.type === 'adjustment'
                    );
                }

                setTransactions(txList);
            }
        } catch (error) {
            console.error('Failed to load transactions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getTransactionIcon = (type) => {
        switch (type) {
            case 'deposit':
                return <ArrowDownCircle size={20} />;
            case 'withdrawal':
                return <ArrowUpCircle size={20} />;
            case 'game_bet':
                return <Gamepad2 size={20} />;
            case 'game_win':
                return <Trophy size={20} />;
            case 'game_refund':
                return <RefreshCcw size={20} />;
            case 'adjustment':
                return <Settings size={20} />;
            default:
                return <ArrowDownCircle size={20} />;
        }
    };

    const getTransactionColor = (type) => {
        switch (type) {
            case 'deposit':
                return 'bg-emerald-500/20 text-emerald-500';
            case 'withdrawal':
                return 'bg-amber-500/20 text-amber-500';
            case 'game_bet':
                return 'bg-red-500/20 text-red-500';
            case 'game_win':
                return 'bg-purple-500/20 text-purple-500';
            case 'game_refund':
                return 'bg-blue-500/20 text-blue-500';
            case 'adjustment':
                return 'bg-gray-500/20 text-gray-500';
            default:
                return 'bg-gray-500/20 text-gray-500';
        }
    };

    const getTransactionLabel = (type) => {
        const labels = {
            deposit: 'Deposit',
            withdrawal: 'Withdrawal',
            game_bet: 'Game Bet',
            game_win: 'Game Win',
            game_refund: 'Refund',
            adjustment: 'Adjustment'
        };
        return labels[type] || type;
    };

    const getAmountDisplay = (tx) => {
        const isPositive = tx.type === 'deposit' || tx.type === 'game_win' || tx.type === 'game_refund';
        const prefix = isPositive ? '+' : '-';
        const colorClass = isPositive ? 'text-emerald-400' : 'text-white';

        return (
            <p className={`font-bold ${colorClass}`}>
                {prefix}{Number(tx.amount).toLocaleString()} USDT
            </p>
        );
    };

    if (!isAuthenticated) {
        navigate('/wallet');
        return null;
    }

    return (
        <div className="page pb-24 min-h-screen bg-black relative">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute -top-20 left-0 w-72 h-72 bg-purple-900/20 rounded-full blur-[100px]" />
                <div className="absolute top-40 right-0 w-72 h-72 bg-[var(--gold)]/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 p-4 space-y-6 max-w-lg mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate('/wallet')}
                        className="flex items-center gap-2 text-white hover:text-[var(--gold)] transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-bold text-xl">All Activity</span>
                    </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                    {filters.map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => setActiveFilter(filter.id)}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeFilter === filter.id
                                    ? 'bg-[var(--gold)] text-black shadow-lg shadow-yellow-900/20'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                {/* Transactions List */}
                <div className="space-y-3">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-[var(--text-muted)]">
                            <div className="w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-sm">Loading activity...</p>
                        </div>
                    ) : transactions.length > 0 ? (
                        transactions.map((tx, idx) => {
                            const isExpanded = expandedTxId === (tx._id || tx.id || idx);
                            const txId = tx._id || tx.id || `tx-${idx}`;

                            return (
                                <div
                                    key={txId}
                                    className="rounded-xl bg-white/5 border border-white/5 overflow-hidden transition-all"
                                >
                                    {/* Main Transaction Row */}
                                    <div
                                        onClick={() => setExpandedTxId(isExpanded ? null : txId)}
                                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTransactionColor(tx.type)}`}>
                                                {getTransactionIcon(tx.type)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white">{getTransactionLabel(tx.type)}</p>
                                                <p className="text-xs text-[var(--text-muted)]">
                                                    {new Date(tx.created_at || Date.now()).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                {getAmountDisplay(tx)}
                                                <p className={`text-xs capitalize ${tx.status === 'completed' ? 'text-emerald-500' :
                                                        tx.status === 'pending' ? 'text-yellow-500' :
                                                            tx.status === 'processing' ? 'text-blue-500' :
                                                                tx.status === 'expired' ? 'text-gray-500' : 'text-red-500'
                                                    }`}>
                                                    {t(`transaction_status.${tx.status}`, tx.status)}
                                                </p>
                                            </div>
                                            <ChevronRight
                                                className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                            />
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <div className="px-4 pb-4 pt-2 border-t border-white/5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="grid grid-cols-2 gap-3 text-xs">
                                                <div>
                                                    <p className="text-[var(--text-muted)] mb-1">Transaction ID</p>
                                                    <p className="text-white font-mono text-[10px] break-all">{txId}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[var(--text-muted)] mb-1">Date & Time</p>
                                                    <p className="text-white">{new Date(tx.created_at || Date.now()).toLocaleString()}</p>
                                                </div>
                                                {tx.merchant_order_id && (
                                                    <div>
                                                        <p className="text-[var(--text-muted)] mb-1">Order ID</p>
                                                        <p className="text-white font-mono text-[10px]">{tx.merchant_order_id}</p>
                                                    </div>
                                                )}
                                                {tx.currency && (
                                                    <div>
                                                        <p className="text-[var(--text-muted)] mb-1">Currency</p>
                                                        <p className="text-white">{tx.currency.split('.')[0]}</p>
                                                    </div>
                                                )}
                                                {tx.game_name && (
                                                    <div>
                                                        <p className="text-[var(--text-muted)] mb-1">Game</p>
                                                        <p className="text-white">{tx.game_name}</p>
                                                    </div>
                                                )}
                                                {tx.wallet_address && (
                                                    <div className="col-span-2">
                                                        <p className="text-[var(--text-muted)] mb-1">Wallet Address</p>
                                                        <p className="text-white font-mono text-[10px] break-all">{tx.wallet_address}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-[var(--text-muted)]">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                <Filter className="w-8 h-8 opacity-50" />
                            </div>
                            <p className="text-sm">No activity found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Activity;
