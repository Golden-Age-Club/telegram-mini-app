import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const StartGame = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [gameUrl, setGameUrl] = useState('');

  useEffect(() => {
    // Get URL from navigation state
    if (location.state?.url) {
      setGameUrl(location.state.url);
    } else {
      // If no URL provided, redirect back to home
      navigate('/');
    }
  }, [location, navigate]);

  if (!gameUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header/Controls overlay - optional, can be removed if full immersion wanted */}
      <div className="absolute top-0 left-0 w-full z-10 p-2 opacity-0 hover:opacity-100 transition-opacity">
        <button 
          onClick={() => navigate('/')}
          className="bg-black/50 text-white p-2 rounded-full backdrop-blur-sm hover:bg-black/70"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>
      
      <iframe
        src={gameUrl}
        title="Game Session"
        className="w-full h-full border-0"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
};

export default StartGame;
