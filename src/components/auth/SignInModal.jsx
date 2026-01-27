import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';

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
  const { loginWithEmail } = useAuth();
  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await loginWithEmail({ email, password });
      if (result?.success) {
        if (toast) {
          toast.success('Signed in successfully.');
        }
        onClose();
      } else if (toast) {
        toast.error(result?.error || 'Sign in failed. Please check your credentials.');
      }
    } catch (error) {
      if (toast) {
        toast.error(error?.message || 'Sign in failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal-overlay fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-[110] bg-black/70 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="modal max-w-sm w-full max-h-[80vh] overflow-y-auto rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] shadow-xl shadow-black/40 px-4 py-5 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-bold text-white text-lg leading-tight">Sign in</h3>
            <p className="text-[11px] text-[var(--text-muted)] mt-1">
              Continue with your existing account to access your wallet.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/15 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <form className="space-y-3 mt-2" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--text-muted)]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-[var(--bg-card)] border border-[var(--border)] px-3 py-2.5 text-sm text-white outline-none focus:border-[var(--gold)] focus:bg-[var(--bg-elevated)] transition-colors"
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--text-muted)]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-[var(--bg-card)] border border-[var(--border)] px-3 py-2.5 text-sm text-white outline-none focus:border-[var(--gold)] focus:bg-[var(--bg-elevated)] transition-colors"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              className="text-xs text-emerald-400 hover:text-emerald-300 cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !email || !password}
            className={`w-full mt-1 rounded-xl text-sm font-semibold py-2.5 transition-colors cursor-pointer ${
              isSubmitting || !email || !password
                ? 'bg-white/5 text-gray-500 border border-[var(--border)] cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-500'
            }`}
          >
            {isSubmitting ? 'Signing in...' : 'Proceed'}
          </button>

          <div className="pt-3">
            <div className="flex items-center gap-3 text-[11px] text-[var(--text-muted)]">
              <div className="flex-1 h-px bg-[var(--border)]" />
              <span>or</span>
              <div className="flex-1 h-px bg-[var(--border)]" />
            </div>
            <div className="flex justify-center pt-3">
              <button className="w-11 h-11 rounded-full bg-[#0088cc] text-white flex items-center justify-center hover:bg-[#0099dd] transition-colors cursor-pointer shadow-[0_0_16px_rgba(0,136,204,0.5)]">
                <TelegramIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInModal;
