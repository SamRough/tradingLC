import { useTradeFlow } from '../../context/TradeFlowContext';
import { phases } from '../../data/phases-data';

export default function Timeline() {
  const { state, dispatch } = useTradeFlow();

  return (
    <div className="flex items-center gap-0 flex-1 justify-center overflow-x-auto py-1">
      {phases.map((p, i) => (
        <div key={p.id} className="flex items-center">
          <button
            role="button"
            tabIndex={0}
            aria-label={`第 ${i + 1} 阶段: ${p.title}`}
            onClick={() => dispatch({ type: 'GO_TO_PHASE', index: i })}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                dispatch({ type: 'GO_TO_PHASE', index: i });
              }
            }}
            className={`
              w-6 h-6 rounded-full flex items-center justify-center
              text-xs font-mono font-semibold shrink-0
              transition-all duration-200
              ${i < state.phaseIndex
                ? 'bg-emerald-100 text-emerald-700'
                : i === state.phaseIndex
                  ? 'bg-flame text-white shadow-flame'
                  : 'bg-rams-muted text-ink-muted hover:bg-rams-hover'
              }
            `}
          >
            {p.id}
          </button>
          {i < phases.length - 1 && (
            <div
              aria-hidden="true"
              className={`w-4 sm:w-6 h-px shrink-0 ${
                i < state.phaseIndex ? 'bg-emerald-200' : 'bg-black/10'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
