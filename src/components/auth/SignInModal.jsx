import { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { toast } from 'sonner';

const TelegramIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M9.04 15.34 8.8 19.2c.36 0 .52-.16.7-.35l1.68-1.6 3.48 2.55c.64.35 1.1.17 1.28-.59l2.32-10.86c.21-.96-.35-1.33-.98-1.1L3.9 9.5c-.94.37-.93.9-.16 1.14l3.22 1.01 7.47-4.7c.35-.21.67-.1.41.11"
      fill="currentColor"
    />
  </svg>
);

const SignInModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { loginWithEmail } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await loginWithEmail({ email, password });
      if (result?.success) {
        toast.success('Signed in successfully.');
        onClose();
      } else {
        toast.error(result?.error || 'Sign in failed. Please check your credentials.');
      }
    } catch (error) {
      toast.error(error?.message || 'Sign in failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal-overlay fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center px-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="modal max-w-sm w-full max-h-[85vh] overflow-y-auto rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] shadow-[0_0_40px_rgba(0,0,0,0.6)] px-6 py-6 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative top glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-50" />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-white text-xl tracking-tight">Welcome Back</h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Sign in to access your wallet
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/5"
          >
            <X className="w-4 h-4 text-[var(--text-secondary)]" />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-secondary)] ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--gold)] transition-colors">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-[var(--bg-card)] border border-[var(--border)] pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]/20 transition-all placeholder:text-white/20"
                placeholder="name@example.com"
                autoComplete="email"
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center justify-between ml-1">
              <label className="text-xs font-medium text-[var(--text-secondary)]">Password</label>
              <button
                type="button"
                className="text-xs text-[var(--gold)] hover:text-[var(--gold-light)] hover:underline cursor-pointer transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--gold)] transition-colors">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-[var(--bg-card)] border border-[var(--border)] pl-10 pr-10 py-3 text-sm text-white outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]/20 transition-all placeholder:text-white/20"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white cursor-pointer transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !email || !password}
            className={`w-full mt-2 rounded-xl text-sm font-bold py-3.5 transition-all cursor-pointer shadow-lg ${
              isSubmitting || !email || !password
                ? 'bg-white/5 text-gray-500 border border-[var(--border)] cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-[var(--emerald-medium)] to-[var(--emerald-light)] hover:from-[var(--emerald-medium)] hover:to-[#14b8a6] text-white shadow-emerald-900/20 active:scale-[0.98]'
            }`}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="py-3">
            <div className="flex items-center gap-3 text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-medium">
              <div className="flex-1 h-px bg-[var(--border)]" />
              <span>Or continue with</span>
              <div className="flex-1 h-px bg-[var(--border)]" />
            </div>
            <div className="mt-4">
              <button 
                type="button"
                className="w-full rounded-xl bg-[#2AABEE]/10 border border-[#2AABEE]/20 hover:bg-[#2AABEE]/20 text-[#2AABEE] py-3 flex items-center justify-center gap-2 transition-all cursor-pointer group"
              >
                <div className="w-6 h-6 rounded-full bg-[#2AABEE] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TelegramIcon className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-semibold">Telegram</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInModal;
