import {
  ArrowDownCircle,
  ArrowUpCircle,
  Users,
  MessageCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext.jsx';

const QuickActions = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-md px-4 mb-8 relative z-10">
      <div className="grid grid-cols-4 gap-3">
          {[
              { icon: ArrowDownCircle, id: 'deposit', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
              { icon: ArrowUpCircle, id: 'withdraw', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
              { icon: Users, id: 'invite', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
              { icon: MessageCircle, id: 'support', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
          ].map((action, i) => (
              <button 
                  key={i} 
                  className="flex flex-col items-center gap-2 group"
                  onClick={() => {
                      if (action.id === 'deposit') navigate('/wallet/deposit');
                      else if (action.id === 'withdraw') navigate('/wallet/withdraw');
                      else if (action.id === 'invite') navigate('/profile'); // Placeholder
                  }}
              >
                  <div className={`w-14 h-14 rounded-2xl ${action.bg} ${action.border} border flex items-center justify-center backdrop-blur-sm shadow-lg transition-transform duration-300 group-hover:scale-105 group-active:scale-95`}>
                      <action.icon className={`w-6 h-6 ${action.color}`} strokeWidth={2.5} />
                  </div>
                  <span className="text-[11px] font-medium text-gray-400 group-hover:text-white transition-colors">
                      {t(`landing.quick_actions.${action.id}`)}
                  </span>
              </button>
          ))}
      </div>
    </div>
  );
};

export default QuickActions;
