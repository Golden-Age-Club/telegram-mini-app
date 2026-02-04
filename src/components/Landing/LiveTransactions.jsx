import { useState } from 'react';
import { Trophy } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext.jsx';
import { useApi } from '../../contexts/ApiContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';

const LiveTransactions = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { liveTransactions } = useApi();
  const [activeTab, setActiveTab] = useState('all_bets');

  const filteredTransactions = liveTransactions.filter(tx => {
      if (activeTab === 'my_bets') return tx.user_id === user?._id;
      if (activeTab === 'all_wins') return tx.type === 'win';
      return true;
  });

  return (
    <div className="w-full max-w-md px-4 mb-8 relative z-10">
      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-900/10 to-black p-4 backdrop-blur-sm relative overflow-hidden min-h-[300px]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        
        <div className="flex items-center gap-2 mb-4 relative z-10">
          <div className="p-1.5 rounded-lg bg-emerald-500/20">
              <Trophy className="w-4 h-4 text-emerald-500" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">{t('landing.live_transactions.title')}</h3>
          <div className="ml-auto flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-emerald-500">{t('landing.live_transactions.live_badge')}</span>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex p-1 bg-black/40 rounded-lg mb-4 relative z-10">
            {['all_bets', 'my_bets', 'all_wins'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wide rounded-md transition-all ${
                      activeTab === tab 
                      ? 'bg-[var(--gold)] text-black shadow-lg' 
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                    {t(`landing.live_transactions.tabs.${tab}`)}
                </button>
            ))}
        </div>

        <div className="relative z-10 overflow-hidden rounded-lg border border-white/5 bg-black/20">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-[10px] text-gray-400 uppercase tracking-wider">
                <th className="px-3 py-2 font-medium">{t('landing.live_transactions.table.game')}</th>
                <th className="px-3 py-2 font-medium">{t('landing.live_transactions.table.user')}</th>
                <th className="px-3 py-2 font-medium text-center">{t('landing.live_transactions.table.result')}</th>
                <th className="px-3 py-2 font-medium text-right">{t('landing.live_transactions.table.amount')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-3 py-8 text-center text-xs text-gray-500">
                    {t('landing.live_transactions.table.empty')}
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx, i) => (
                  <tr key={i} className="text-xs hover:bg-white/5 transition-colors animate-fade-in">
                    <td className="px-3 py-2 text-gray-300 truncate max-w-[100px]">
                      {tx.game_id || 'Game'}
                    </td>
                    <td className="px-3 py-2 text-gray-400 truncate max-w-[80px]">
                      {tx.username}
                    </td>
                    <td className={`px-3 py-2 text-center font-bold ${
                      tx.type === 'win' ? 'text-emerald-400' : 'text-gray-500'
                    }`}>
                      {tx.type === 'win' ? 'WIN' : 'LOSE'}
                    </td>
                    <td className={`px-3 py-2 text-right font-mono font-bold ${
                      tx.type === 'win' ? 'text-emerald-400' : 'text-gray-500'
                    }`}>
                      {tx.type === 'win' ? '+' : ''}{Number(tx.amount).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LiveTransactions;
