export default function Header() {
  return (
    <header className="border-b border-black/5 bg-rams-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-[1380px] mx-auto px-5 py-3 flex items-center justify-between">
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-rams bg-flame text-white flex items-center justify-center text-xs font-bold font-mono">
            HK
          </div>
          <div>
            <h1 className="text-sm font-semibold text-ink tracking-wide">
              香港股票交易流程
            </h1>
            <p className="text-[10px] text-ink-muted font-mono">
              Hong Kong Stock Trading Flow
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2" role="status">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[10px] font-mono font-semibold text-ink-muted uppercase tracking-wider">
            SYSTEM READY
          </span>
        </div>
      </div>
    </header>
  );
}
