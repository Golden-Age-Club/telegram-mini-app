import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
    ArrowDownCircle,
    ArrowUpCircle,
    Gamepad2,
    Trophy,
    RefreshCcw,
    Settings,
    ChevronRight,
    ArrowLeft,
    Filter,
    ExternalLink,
    Calendar,
    Search,
    X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import walletApi from '../api/wallet';
import { toast } from 'sonner';

const Activity = () => {
    const navigate = useNavigate();
    const { tab } = useParams();
    const { t } = useLanguage();
    const { isAuthenticated } = useAuth();

    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [expandedTxId, setExpandedTxId] = useState(null);

    // Pagination state
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalTransactions, setTotalTransactions] = useState(0);

    // Date Filter state
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const activeTab = tab || 'all';

    const tabs = [
        { id: 'all', label: t('transactions.tabs.all', 'All') },
        { id: 'deposit', label: t('transactions.tabs.deposit', 'Deposits') },
        { id: 'withdraw', label: t('transactions.tabs.withdraw', 'Withdraws') },
        { id: 'bills', label: t('transactions.tabs.bills', 'Bills') }
    ];

    const loadTransactions = useCallback(async (pageNum = 1, shouldAppend = false) => {
        try {
            setIsLoading(true);

            // Map tab to backend type
            let typeParam = activeTab === 'all' ? null : activeTab;

            const response = await walletApi.getTransactions(
                pageNum,
                20,
                typeParam,
                startDate || null,
                endDate || null
            );

            const newTx = response.transactions || response.data?.transactions || [];
            const pagination = response.pagination || response.data?.pagination || {};

            if (shouldAppend) {
                setTransactions(prev => [...prev, ...newTx]);
            } else {
                setTransactions(newTx);
            }

            setTotalTransactions(pagination.total || 0);
            setHasMore(pageNum < (pagination.pages || 1));
            setPage(pageNum);

        } catch (error) {
            console.error('Failed to load transactions:', error);
            toast.error(t('transactions.error_load', 'Failed to load transactions'));
        } finally {
            setIsLoading(false);
            setIsInitialLoad(false);
        }
    }, [activeTab, startDate, endDate, t]);

    useEffect(() => {
        if (isAuthenticated) {
            setPage(1);
            loadTransactions(1, false);
        }
    }, [isAuthenticated, activeTab, startDate, endDate, loadTransactions]);

    const handleLoadMore = () => {
        if (!isLoading && hasMore) {
            loadTransactions(page + 1, true);
        }
    };

    const clearFilters = () => {
        setStartDate('');
        setEndDate('');
        setIsFilterOpen(false);
    };

    const getTransactionIcon = (type) => {
        switch (type) {
            case 'deposit': return <ArrowDownCircle size={20} />;
            case 'withdrawal': return <ArrowUpCircle size={20} />;
            case 'game_bet': return <Gamepad2 size={20} />;
            case 'game_win': return <Trophy size={20} />;
            case 'game_refund': return <RefreshCcw size={20} />;
            case 'adjustment': return <Settings size={20} />;
            default: return <ArrowDownCircle size={20} />;
        }
    };

    const getTransactionColor = (type) => {
        switch (type) {
            case 'deposit': return 'bg-emerald-500/20 text-emerald-500';
            case 'withdrawal': return 'bg-amber-500/20 text-amber-500';
            case 'game_bet':
            case 'game_win':
            case 'game_refund': return 'bg-purple-500/20 text-purple-500';
            case 'adjustment': return 'bg-gray-500/20 text-gray-500';
            default: return 'bg-gray-500/20 text-gray-500';
        }
    };

    const getTransactionLabel = (type, amount) => {
        if (type === 'game_win' && amount === 0) return 'Loss';
        const labels = {
            deposit: 'Deposit',
            withdrawal: 'Withdraw',
            game_bet: 'Bills',
            game_win: 'Bills',
            game_refund: 'Bills',
            adjustment: 'Adjustment'
        };
        return labels[type] || type;
    };

    if (!isAuthenticated) {
        navigate('/wallet');
        return null;
    }

    return (
        <div className="page pb-24 min-h-screen bg-black relative">
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
                        <span className="font-bold text-xl">{t('transactions.title', 'Transactions')}</span>
                    </button>

                    {activeTab === 'bills' && (
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`p-2 rounded-xl transition-all ${isFilterOpen || startDate || endDate ? 'bg-[var(--gold)] text-black' : 'bg-white/5 text-gray-400'}`}
                        >
                            <Calendar size={20} />
                        </button>
                    )}
                </div>

                {/* Date Filter Panel */}
                {activeTab === 'bills' && isFilterOpen && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4 animate-in slide-in-from-top-4 duration-300">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase text-gray-500 ml-1">Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--gold)]"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase text-gray-500 ml-1">End Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--gold)]"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={clearFilters}
                                className="flex-1 py-2 rounded-xl bg-white/5 text-xs text-gray-400 font-bold"
                            >
                                Clear
                            </button>
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="flex-1 py-2 rounded-xl bg-[var(--gold)] text-xs text-black font-bold"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                )}

                {/* Filter Tabs */}
                <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm sticky top-4 z-50">
                    {tabs.map((tItem) => (
                        <Link
                            key={tItem.id}
                            to={`/transactions/${tItem.id}`}
                            className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-center transition-all duration-300 ${activeTab === tItem.id
                                ? 'bg-[var(--gold)] text-black shadow-lg shadow-yellow-900/20'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {tItem.label}
                        </Link>
                    ))}
                </div>

                {/* Transactions List */}
                <div className="space-y-3">
                    {isInitialLoad ? (
                        <div className="flex flex-col items-center justify-center py-12 text-[var(--text-muted)]">
                            <div className="w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-sm">Fetching your history...</p>
                        </div>
                    ) : transactions.length > 0 ? (
                        <>
                            {transactions.map((tx, idx) => {
                                const isExpanded = expandedTxId === (tx._id || tx.id || idx);
                                const txId = tx._id || tx.id || `tx-${idx}`;

                                return (
                                    <div key={txId} className="rounded-xl bg-white/5 border border-white/5 overflow-hidden transition-all">
                                        <div
                                            onClick={() => setExpandedTxId(isExpanded ? null : txId)}
                                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTransactionColor(tx.type)}`}>
                                                    {getTransactionIcon(tx.type)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white">{getTransactionLabel(tx.type, tx.amount)}</p>
                                                    <p className="text-[10px] text-[var(--text-muted)]">
                                                        {new Date(tx.created_at || Date.now()).toLocaleDateString()} • {new Date(tx.created_at || Date.now()).toLocaleTimeString([], { hour: '2-2-digit', minute: '2-2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    <p className={`font-bold text-sm ${tx.type === 'deposit' || tx.type === 'game_win' ? 'text-emerald-400' : 'text-white'}`}>
                                                        {(tx.type === 'deposit' || tx.type === 'game_win' || tx.type === 'game_refund') ? '+' : '-'}{Number(tx.amount).toLocaleString()} USDT
                                                    </p>
                                                    <p className={`text-[10px] capitalize leading-none mt-1 ${tx.status === 'completed' ? 'text-emerald-500' :
                                                        (tx.status === 'awaiting_deposit' || tx.status === 'pending') ? 'text-yellow-500' :
                                                            (tx.status === 'awaiting_approval' || tx.status === 'processing') ? 'text-blue-500' :
                                                                tx.status === 'expired' ? 'text-gray-500' : 'text-red-500'
                                                        }`}>
                                                        {tx.status === 'awaiting_deposit' ? 'Awaiting Deposit' :
                                                            tx.status === 'awaiting_approval' ? 'Awaiting Approval' :
                                                                t(`transaction_status.${tx.status}`, tx.status)}
                                                    </p>
                                                </div>
                                                <ChevronRight className={`w-4 h-4 text-gray-600 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div className="px-4 pb-4 pt-2 border-t border-white/5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <div className="grid grid-cols-2 gap-3 text-[10px]">
                                                    <div>
                                                        <p className="text-[var(--text-muted)] mb-0.5">Reference</p>
                                                        <p className="text-white font-mono truncate">{txId}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[var(--text-muted)] mb-0.5">Network</p>
                                                        <p className="text-white">{tx.network || 'USDT'}</p>
                                                    </div>
                                                    {tx.txid && (
                                                        <div className="col-span-2">
                                                            <p className="text-[var(--text-muted)] mb-0.5">Blockchain Hash</p>
                                                            <div className="flex items-center justify-between gap-2 overflow-hidden bg-white/5 p-1.5 rounded-lg">
                                                                <p className="text-[var(--gold)] font-mono truncate text-[9px]">{tx.txid}</p>
                                                                <a
                                                                    href={
                                                                        tx.network === 'TRC20' ? `https://tronscan.org/#/transaction/${tx.txid}` :
                                                                            tx.network === 'ERC20' ? `https://etherscan.io/tx/${tx.txid}` :
                                                                                tx.network === 'BEP20' ? `https://bscscan.com/tx/${tx.txid}` :
                                                                                    `https://etherscan.io/tx/${tx.txid}`
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-[var(--gold)] flex items-center gap-1 flex-shrink-0"
                                                                >
                                                                    <ExternalLink size={10} />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {tx.game_name && (
                                                        <div>
                                                            <p className="text-[var(--text-muted)] mb-0.5">Source</p>
                                                            <p className="text-white ">{tx.game_name}</p>
                                                        </div>
                                                    )}
                                                    {tx.fee > 0 && (
                                                        <div>
                                                            <p className="text-[var(--text-muted)] mb-0.5">Network Fee</p>
                                                            <p className="text-red-400 ">{tx.fee} USDT</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {hasMore && (
                                <button
                                    onClick={handleLoadMore}
                                    disabled={isLoading}
                                    className="w-full py-3 rounded-2xl bg-white/5 border border-white/5 text-gray-400 font-bold text-xs hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {isLoading ? 'Loading...' : `Load More Transactions (${totalTransactions - transactions.length} remaining)`}
                                </button>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-[var(--text-muted)]">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                <Filter size={32} className="opacity-20" />
                            </div>
                            <p className="text-sm">No activity records found</p>
                            {(startDate || endDate) && (
                                <button onClick={clearFilters} className="mt-4 text-[var(--gold)] text-xs font-bold underline">
                                    Clear date filters
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Activity;
