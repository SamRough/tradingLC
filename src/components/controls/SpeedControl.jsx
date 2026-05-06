import { useTradeFlow } from '../../context/TradeFlowContext';

export default function SpeedControl() {
  const { state, dispatch } = useTradeFlow();

  return (
    <div className="flex items-center gap-1 bg-rams-muted rounded-md p-0.5">
      {[1, 2].map((s) => (
        <button
          key={s}
          onClick={() => dispatch({ type: 'SET_SPEED', speed: s })}
          className={`
            px-2 py-1 text-[11px] font-mono font-semibold rounded
            transition-colors duration-150
            ${state.speed === s
              ? 'bg-rams-card text-flame shadow-sm'
              : 'text-ink-muted hover:text-ink'
            }
          `}
        >
          {s}x
        </button>
      ))}
    </div>
  );
}
