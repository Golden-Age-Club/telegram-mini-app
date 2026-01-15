import { useEffect, useState } from 'react';
import {
  Zap,
  Crown,
  Diamond,
  Star,
  Sparkles,
  Trophy,
  Shield,
  ArrowDownCircle,
  ArrowUpCircle,
  Users,
  Download,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  HelpCircle,
  Globe,
  Lock
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const tg = window.Telegram?.WebApp;
  const [showFallbackButton, setShowFallbackButton] = useState(false);
  const navigate = useNavigate();

  const banners = [
    '/assets/banner-actThroughtDZ.webp',
    '/assets/banner-yessc2.webp',
    '/assets/banner-yessc2 (1).webp',
  ];

  useEffect(() => {
    // Check if we're in Telegram environment
    const isInTelegram = tg && tg.initData && tg.initData.length > 0;
    
    if (isInTelegram) {
      tg.setHeaderColor('#000000');
      tg.setBackgroundColor('#000000');
      tg.expand?.();
      tg.ready?.();

      tg.MainButton?.setText('👑 Enter Golden Age Cash 👑');
      tg.MainButton?.show();
      tg.MainButton?.onClick(() => navigate('/home'));
      setShowFallbackButton(false);
    } else {
      // Not in Telegram, show fallback button
      setShowFallbackButton(true);
    }


    return () => {
      if (isInTelegram) {
        tg?.MainButton?.hide();
        tg?.MainButton?.offClick();
      }
    };
  }, [tg, navigate]);


  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gradient-primary relative overflow-hidden">
      {/* Background Elements - Subtle */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-emerald-500 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-amber-500 blur-3xl"></div>
      </div>

      {/* Banner Slider - Under Navbar (rectangular banners) */}
      <div className="w-full max-w-4xl px-2 sm:px-4 mt-4 mb-8 relative z-10">
        <div className="relative rounded-2xl overflow-hidden border border-gold/30 bg-black/40 backdrop-blur-sm">
          <div className="relative ">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              loop
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              className="w-full h-full"
            >
              {banners.map((src, idx) => (
                <SwiperSlide key={src}>
                  <img
                    src={src}
                    alt={`Golden Age banner ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl px-2 sm:px-4 mb-6 relative z-10">
        <div className="grid grid-cols-5 gap-2">
          <button className="flex flex-col items-center justify-center rounded-2xl bg-[var(--bg-card)]/95 border border-[var(--border)] px-2 py-2 text-[11px] font-medium text-gray-200 hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors cursor-pointer">
            <ArrowDownCircle className="w-5 h-5 mb-1 text-emerald-400" strokeWidth={2.3} />
            <span className="truncate">Deposit</span>
          </button>
          <button className="flex flex-col items-center justify-center rounded-2xl bg-[var(--bg-card)]/95 border border-[var(--border)] px-2 py-2 text-[11px] font-medium text-gray-200 hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors cursor-pointer">
            <ArrowUpCircle className="w-5 h-5 mb-1 text-emerald-400" strokeWidth={2.3} />
            <span className="truncate">Withdraw</span>
          </button>
          <button className="flex flex-col items-center justify-center rounded-2xl bg-[var(--bg-card)]/95 border border-[var(--border)] px-2 py-2 text-[11px] font-medium text-gray-200 hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors cursor-pointer">
            <Users className="w-5 h-5 mb-1 text-emerald-400" strokeWidth={2.3} />
            <span className="truncate">Invite</span>
          </button>
          <button className="flex flex-col items-center justify-center rounded-2xl bg-[var(--bg-card)]/95 border border-[var(--border)] px-2 py-2 text-[11px] font-medium text-gray-200 hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors cursor-pointer">
            <Download className="w-5 h-5 mb-1 text-emerald-400" strokeWidth={2.3} />
            <span className="truncate">Download</span>
          </button>
          <button className="flex flex-col items-center justify-center rounded-2xl bg-[var(--bg-card)]/95 border border-[var(--border)] px-2 py-2 text-[11px] font-medium text-gray-200 hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors cursor-pointer">
            <MessageCircle className="w-5 h-5 mb-1 text-emerald-400" strokeWidth={2.3} />
            <span className="truncate">Live Support</span>
          </button>
        </div>
      </div>

      <div className="w-full max-w-4xl px-2 sm:px-4 mb-6 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate('/game?provider=pg')}
            className="flex items-center gap-2 text-sm font-semibold text-white cursor-pointer"
          >
            <span>PG soft</span>
            <ChevronRight className="w-4 h-4 text-emerald-400" />
          </button>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center text-gray-300 hover:border-[var(--gold)] hover:text-[var(--gold)] cursor-pointer pg-soft-prev">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center text-gray-300 hover:border-[var(--gold)] hover:text-[var(--gold)] cursor-pointer pg-soft-next">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: '.pg-soft-prev',
            nextEl: '.pg-soft-next'
          }}
          slidesPerView={3.2}
          spaceBetween={8}
        >
          {Array.from({ length: 30 }).map((_, idx) => (
            <SwiperSlide key={`pg-${idx}`}>
              <div className="rounded-2xl overflow-hidden border border-[var(--border)] bg-black/40">
                <img
                  src="/assets/ztb-pg4.webp"
                  alt={`PG soft slot ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="w-full max-w-4xl px-2 sm:px-4 mb-8 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate('/game?provider=egt')}
            className="flex items-center gap-2 text-sm font-semibold text-white cursor-pointer"
          >
            <span>EGT soft</span>
            <ChevronRight className="w-4 h-4 text-emerald-400" />
          </button>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center text-gray-300 hover:border-[var(--gold)] hover:text-[var(--gold)] cursor-pointer egt-soft-prev">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center text-gray-300 hover:border-[var(--gold)] hover:text-[var(--gold)] cursor-pointer egt-soft-next">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: '.egt-soft-prev',
            nextEl: '.egt-soft-next'
          }}
          slidesPerView={3.2}
          spaceBetween={8}
        >
          {Array.from({ length: 30 }).map((_, idx) => (
            <SwiperSlide key={`egt-${idx}`}>
              <div className="rounded-2xl overflow-hidden border border-[var(--border)] bg-black/40">
                <img
                  src="/assets/ztb-pg4.webp"
                  alt={`EGT soft slot ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Live Winners Section */}
      <div className="w-full max-w-4xl px-2 sm:px-4 mb-8 relative z-10">
        <div className="rounded-2xl border border-[var(--border)] bg-black/40 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-gold" />
            <h3 className="text-lg font-bold text-white">Live Winners</h3>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse ml-auto"></div>
          </div>
          <Swiper
            direction={'vertical'}
            modules={[Autoplay]}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            slidesPerView={3}
            loop
            className="h-32"
            allowTouchMove={false}
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <SwiperSlide key={i}>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-gray-300">
                      <Users size={12} />
                    </div>
                    <span className="text-sm text-gray-300">User****{Math.floor(Math.random() * 90 + 10)}</span>
                  </div>
                  <div className="text-emerald-400 font-mono font-bold text-sm">
                    +${(Math.random() * 1000 + 50).toFixed(2)}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Jackpot Section */}
      <div className="w-full max-w-4xl px-2 sm:px-4 mb-8 relative z-10">
        <div className="relative rounded-2xl overflow-hidden border border-gold/50 bg-gradient-to-r from-amber-900/40 to-black p-6 text-center shadow-[0_0_30px_rgba(255,215,0,0.1)]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50"></div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Crown className="w-4 h-4 text-gold animate-bounce" />
            <h3 className="text-gold text-sm font-bold uppercase tracking-widest">Progressive Jackpot</h3>
            <Crown className="w-4 h-4 text-gold animate-bounce" />
          </div>
          <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-700 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] font-mono tracking-tighter">
            $1,245,892.54
          </div>
          <p className="text-xs text-yellow-200/60 mt-2 flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Updating in real-time
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="w-full max-w-4xl px-2 sm:px-4 mb-8 relative z-10">
        <h3 className="text-lg font-bold text-white mb-4 pl-2 flex items-center gap-2">
          <Star className="w-5 h-5 text-gold" />
          Why Choose Us
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-[var(--border)] bg-black/40 p-4 flex flex-col gap-2 hover:border-emerald-500/50 transition-colors">
            <Zap className="w-8 h-8 text-emerald-500 mb-1" />
            <h4 className="text-sm font-bold text-white">Instant Withdrawals</h4>
            <p className="text-xs text-gray-400">Get your winnings in seconds</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-black/40 p-4 flex flex-col gap-2 hover:border-emerald-500/50 transition-colors">
            <Lock className="w-8 h-8 text-emerald-500 mb-1" />
            <h4 className="text-sm font-bold text-white">Secure Gaming</h4>
            <p className="text-xs text-gray-400">Encrypted & protected data</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-black/40 p-4 flex flex-col gap-2 hover:border-emerald-500/50 transition-colors">
            <MessageCircle className="w-8 h-8 text-emerald-500 mb-1" />
            <h4 className="text-sm font-bold text-white">24/7 Support</h4>
            <p className="text-xs text-gray-400">Always here to help you</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-black/40 p-4 flex flex-col gap-2 hover:border-emerald-500/50 transition-colors">
            <Diamond className="w-8 h-8 text-emerald-500 mb-1" />
            <h4 className="text-sm font-bold text-white">VIP Rewards</h4>
            <p className="text-xs text-gray-400">Exclusive bonuses for loyal players</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="w-full max-w-4xl px-2 sm:px-4 mb-12 relative z-10">
        <h3 className="text-lg font-bold text-white mb-4 pl-2 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-gold" />
          Frequently Asked Questions
        </h3>
        <div className="space-y-3">
          <div className="rounded-xl border border-[var(--border)] bg-black/40 p-4">
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-500" />
              How do I deposit?
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">Click the "Deposit" button and choose your preferred payment method. Transfers are instant.</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-black/40 p-4">
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              Is it safe?
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">Yes, we use bank-grade encryption to ensure your data and funds are always secure.</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-black/40 p-4">
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-500" />
              How to withdraw?
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">Go to Wallet &gt; Withdraw. Requests are processed automatically 24/7.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-4xl px-4 py-8 relative z-10 border-t border-white/5 mt-4 pb-24">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2 text-gold font-bold text-xl">
            <Crown className="w-6 h-6" />
            <span>GOLDEN AGE</span>
          </div>
          <div className="flex gap-4 text-xs text-gray-400">
            <span className="cursor-pointer hover:text-white transition-colors">Terms</span>
            <span className="cursor-pointer hover:text-white transition-colors">Privacy</span>
            <span className="cursor-pointer hover:text-white transition-colors">Fair Play</span>
          </div>
          <div className="flex gap-4 mt-2">
            <div className="w-8 h-5 rounded bg-white/10 flex items-center justify-center">
              <span className="text-[8px] text-gray-400 font-bold">VISA</span>
            </div>
            <div className="w-8 h-5 rounded bg-white/10 flex items-center justify-center">
              <span className="text-[8px] text-gray-400 font-bold">MC</span>
            </div>
            <div className="w-8 h-5 rounded bg-white/10 flex items-center justify-center">
              <span className="text-[8px] text-gray-400 font-bold">USDT</span>
            </div>
          </div>
          <p className="text-[10px] text-gray-600 mt-2">
            © 2024 Golden Age Casino. All rights reserved.<br/>
            Gambling involves risk. Please play responsibly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
