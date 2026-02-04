const Preloader = () => {
  return (
    <div className="app bg-gradient-primary flex flex-col pt-16 pb-20 min-h-screen w-full max-w-[480px] mx-auto relative border-x border-[var(--border)] overflow-hidden">
      
      {/* Navbar Skeleton */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-16 bg-[var(--bg-elevated)]/95 backdrop-blur-md z-50 flex items-center justify-between px-4 border-b border-[var(--border)]">
        {/* Left: Menu/Logo placeholder */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--border)] animate-pulse"></div>
          <div className="w-24 h-5 rounded bg-[var(--border)] animate-pulse"></div>
        </div>
        {/* Right: Wallet/Profile placeholder */}
        <div className="flex items-center gap-2">
           <div className="w-20 h-8 rounded-full bg-[var(--border)] animate-pulse"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full px-4 py-4 space-y-6">
        
        {/* Hero Banner Skeleton */}
        <div className="w-full aspect-[2/1] rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] relative overflow-hidden">
           <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
        </div>

        {/* Quick Actions / Filters Skeleton */}
        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-24 h-9 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] flex-shrink-0 animate-pulse"></div>
          ))}
        </div>

        {/* Section Title */}
        <div className="flex justify-between items-center mt-2">
            <div className="w-32 h-6 rounded bg-[var(--border)] animate-pulse"></div>
            <div className="w-16 h-4 rounded bg-[var(--border)] animate-pulse"></div>
        </div>

        {/* Game Grid Skeleton */}
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-[3/4] rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-2 flex flex-col gap-2 relative overflow-hidden">
              <div className="w-full flex-1 rounded-lg bg-black/20 animate-pulse"></div>
              <div className="w-2/3 h-3 rounded bg-[var(--border)] animate-pulse"></div>
              <div className="w-1/2 h-3 rounded bg-[var(--border)] animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation Skeleton */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40 border-t border-[var(--border)] bg-[var(--bg-elevated)]/95 backdrop-blur-md">
        <div className="flex max-w-md mx-auto px-2 py-1.5 gap-1">
           {[1, 2, 3, 4].map((i) => (
             <div key={i} className="flex-1 h-[50px] flex flex-col items-center justify-center gap-1">
                <div className="w-5 h-5 rounded bg-[var(--border)] animate-pulse"></div>
                <div className="w-10 h-3 rounded bg-[var(--border)] animate-pulse"></div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Preloader;
