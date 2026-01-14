import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Play } from 'lucide-react';
import Layout from '../components/Layout';

const Game = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pg');

  const tabs = [
    { id: 'pg', label: 'Pg soft', active: true },
    { id: 'egt', label: 'EGT soft', active: true },
    { id: 'pragmatic', label: 'Pragmatic', active: false },
    { id: 'hacksaw', label: 'Hacksaw', active: false },
  ];

  // Mock data for games (20 items)
  const games = Array.from({ length: 20 }).map((_, i) => ({
    id: i + 1,
    title: `${activeTab === 'pg' ? 'Fortune' : 'Burning'} Game ${i + 1}`,
    provider: activeTab === 'pg' ? 'PG Soft' : 'EGT',
  }));

  return (

      <div className="flex flex-col h-full min-h-[calc(100vh-140px)]">
        {/* Tabs Header */}
        <div className="sticky top-0 z-30 bg-[var(--bg-elevated)]/95 backdrop-blur-md border-b border-white/5 px-4 py-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => tab.active && setActiveTab(tab.id)}
                disabled={!tab.active}
                className={`
                  flex-1 min-w-[100px] py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-200 whitespace-nowrap border
                  ${activeTab === tab.id 
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20 border-amber-400/50' 
                    : tab.active
                      ? 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border-white/5'
                      : 'bg-black/20 text-gray-600 cursor-not-allowed border-transparent'
                  }
                `}
              >
                <span className="flex items-center justify-center gap-2">
                  {tab.label}
                  {!tab.active && <Lock size={12} />}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Game Grid */}
        <div className="flex-1 p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {games.map((game) => (
              <div 
                key={game.id}
                className="aspect-[3/4] rounded-xl overflow-hidden relative group cursor-pointer border border-white/5 bg-white/5 shadow-lg shadow-black/20"
              >
                {/* Placeholder Image / Gradient */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ 
                    backgroundImage: `linear-gradient(135deg, ${activeTab === 'pg' ? '#059669, #064e3b' : '#d97706, #78350f'})`
                  }}
                >
                  {/* Decorative Pattern */}
                  <div className="absolute inset-0 opacity-20" 
                       style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                  </div>
                  
                  {/* Game Icon Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                     <span className="text-4xl font-black text-white/20 select-none">
                       {game.id}
                     </span>
                  </div>
                </div>

                {/* Overlay content */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white font-bold text-sm truncate leading-tight mb-0.5">
                      {game.title}
                    </h3>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                      {game.provider}
                    </p>
                  </div>
                </div>

                {/* Active State Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40 backdrop-blur-[2px]">
                  <div className="bg-emerald-500 text-white rounded-full p-3 shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <Play size={20} fill="currentColor" />
                  </div>
                </div>
                
                {/* Hot/New Badge (Random) */}
                {Math.random() > 0.7 && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white shadow-sm">
                    HOT
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

  );
};

export default Game;
