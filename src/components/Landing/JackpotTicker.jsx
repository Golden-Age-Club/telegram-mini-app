import { Trophy, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext.jsx';

const JackpotTicker = () => {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-md px-4 mb-8 relative z-10">
      <div className="relative rounded-2xl overflow-hidden border border-[var(--gold)]/30 bg-gradient-to-r from-gray-900 to-black p-0.5">
          <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-10 mix-blend-overlay"></div>
          <div className="bg-[#0f0f0f] rounded-[14px] p-4 flex items-center justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--gold)]/10 rounded-full blur-2xl -mr-10 -mt-10 animate-pulse"></div>
              
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--gold)]/10 flex items-center justify-center border border-[var(--gold)]/20">
                      <Trophy className="w-5 h-5 text-[var(--gold)]" />
                  </div>
                  <div>
                      <div className="text-[10px] font-bold text-[var(--gold)] uppercase tracking-wider mb-0.5">{t('landing.jackpot')}</div>
                      <div className="text-xl font-black text-white tracking-tight tabular-nums">
                          $1,245,892.<span className="text-[var(--gold)]">54</span>
                      </div>
                  </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
          </div>
      </div>
    </div>
  );
};

export default JackpotTicker;
