import { useState, useEffect } from 'react';
import { ArrowLeft, Shield, Loader2, CheckCircle2 } from 'lucide-react';
import { useTelegram } from '../contexts/TelegramContext';

const LoginPage = ({ onNavigate, onLogin }) => {
  const { user: tgUser, isTelegram, hapticFeedback } = useTelegram();
  const [isLoading, setIsLoading] = useState(false);
  const [telegramUser, setTelegramUser] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    if (isTelegram && tgUser) {
      // Use real Telegram user data
      setTelegramUser({
        id: tgUser.id,
        first_name: tgUser.firstName,
        last_name: tgUser.lastName,
        username: tgUser.username,
        photo_url: tgUser.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${tgUser.id}`,
      });
    } else {
      // Mock data for browser development
      setTimeout(() => {
        setTelegramUser({
          id: 123456789,
          first_name: "John",
          last_name: "Doe",
          username: "johndoe",
          photo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=john"
        });
      }, 800);
    }
  }, [isTelegram, tgUser]);

  const handleTelegramLogin = async () => {
    setIsLoading(true);
    hapticFeedback?.('impact');
    
    // Simulate authentication steps
    for (let i = 1; i <= 3; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setLoadingStep(i);
      hapticFeedback?.('selection');
    }
    
    const userData = {
      id: telegramUser.id,
      name: `${telegramUser.first_name} ${telegramUser.last_name}`.trim(),
      username: telegramUser.username || `user${telegramUser.id}`,
      avatar: telegramUser.photo_url,
      balance: 2368.50, // This would come from your backend
      isAgent: false
    };
    
    hapticFeedback?.('notification');
    onLogin(userData);
    onNavigate('home');
  };

  const loadingSteps = [
    'Verifying identity...',
    'Securing connection...',
    'Loading account...'
  ];

  return (
    <div className="min-h-screen bg-[--bg-base] text-white flex flex-col">
      {/* Header */}
      <header className="px-4 py-4">
        <button 
          onClick={() => {
            hapticFeedback?.('impact');
            onNavigate('landing');
          }}
          className="w-10 h-10 rounded-xl bg-[--bg-card] border border-[--border] flex items-center justify-center hover:bg-[--bg-elevated] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        {!telegramUser ? (
          // Loading Telegram Data
          <div className="text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-[--bg-card] border border-[--border] flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              {isTelegram ? 'Loading Telegram Data' : 'Connecting to Telegram'}
            </h2>
            <p className="text-[--text-secondary] text-sm">Please wait...</p>
          </div>
        ) : (
          // User Loaded
          <div className="w-full max-w-sm animate-fade-in">
            {/* User Card */}
            <div className="card p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={telegramUser.photo_url} 
                  alt="Profile"
                  className="w-16 h-16 rounded-2xl bg-[--bg-elevated]"
                />
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold truncate">
                    {telegramUser.first_name} {telegramUser.last_name}
                  </h2>
                  <p className="text-[--text-secondary] text-sm">
                    {telegramUser.username ? `@${telegramUser.username}` : `ID: ${telegramUser.id}`}
                  </p>
                </div>
                <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
              </div>

              {/* Security Badge */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <Shield className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="text-sm font-medium text-emerald-500">
                    {isTelegram ? 'Telegram Verified' : 'Development Mode'}
                  </p>
                  <p className="text-xs text-[--text-muted]">
                    {isTelegram ? 'Secured by Telegram' : 'Using mock data'}
                  </p>
                </div>
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleTelegramLogin}
              disabled={isLoading}
              className={`btn w-full py-4 text-base mb-4 ${isLoading ? 'btn-secondary' : 'btn-primary'}`}
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{loadingSteps[loadingStep - 1] || 'Processing...'}</span>
                </div>
              ) : (
                'Continue with Telegram'
              )}
            </button>

            {/* Loading Progress */}
            {isLoading && (
              <div className="space-y-2 animate-fade-in">
                {loadingSteps.map((step, i) => (
                  <div 
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      loadingStep > i 
                        ? 'bg-emerald-500/10 border border-emerald-500/20' 
                        : loadingStep === i + 1
                        ? 'bg-[--bg-card] border border-[--border]'
                        : 'opacity-40'
                    }`}
                  >
                    {loadingStep > i ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : loadingStep === i + 1 ? (
                      <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-[--border]" />
                    )}
                    <span className="text-sm">{step}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Terms */}
            {!isLoading && (
              <p className="text-center text-xs text-[--text-muted] mt-6">
                By continuing, you agree to our Terms of Service
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default LoginPage;
