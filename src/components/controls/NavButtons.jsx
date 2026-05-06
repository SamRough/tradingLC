import { useTradeFlow } from '../../context/TradeFlowContext';

export default function NavButtons() {
  const { state, dispatch } = useTradeFlow();

  const btnBase = `
    flex items-center justify-center w-9 h-9 rounded-rams
    transition-all duration-150
    hover:bg-rams-hover active:bg-rams-muted
    disabled:opacity-30 disabled:cursor-not-allowed
    text-ink-soft
  `;

  return (
    <div className="flex items-center gap-1">
      {/* Prev */}
      <button
        onClick={() => dispatch({ type: 'PREV_PHASE' })}
        disabled={state.phaseIndex === 0}
        aria-label="上一阶段"
        className={btnBase}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Play/Pause */}
      <button
        onClick={() => dispatch({ type: 'TOGGLE_PLAY' })}
        aria-label={state.playing ? '暂停' : '播放'}
        className={`${btnBase} ${state.playing ? 'text-flame' : ''}`}
      >
        {state.playing ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <rect x="3" y="2" width="3" height="12" rx="1"/>
            <rect x="10" y="2" width="3" height="12" rx="1"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5 2l9 6-9 6V2z"/>
          </svg>
        )}
      </button>

      {/* Next */}
      <button
        onClick={() => dispatch({ type: 'NEXT_PHASE' })}
        disabled={state.phaseIndex >= 11}
        aria-label="下一阶段"
        className={btnBase}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Reset */}
      <button
        onClick={() => dispatch({ type: 'RESET' })}
        aria-label="重置"
        className={btnBase}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M2 8a6 6 0 016-6 5.9 5.9 0 015.3 3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <path d="M14 3v3h-3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 8a6 6 0 01-6 6A5.9 5.9 0 012.7 10.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <path d="M2 13v-3h3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}
