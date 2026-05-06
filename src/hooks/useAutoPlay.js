import { useEffect, useRef } from 'react';
import { phases } from '../data/phases-data';
import { CONFIG } from '../utils/constants';

export function useAutoPlay(state, dispatch, flowsComplete) {
  const timerRef = useRef(null);
  const pauseRequestedRef = useRef(false);

  useEffect(() => {
    if (!state.playing) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    if (state.phaseIndex >= phases.length - 1) {
      dispatch({ type: 'PAUSE' });
      return;
    }

    if (!flowsComplete) return;

    const nextPhase = phases[state.phaseIndex + 1];
    const actionCount = nextPhase?.actions?.length || 1;
    const minInterval = actionCount * CONFIG.actionDuration + CONFIG.scheduleBuffer;
    const interval = Math.max(minInterval, CONFIG.scheduleBase) / state.speed;

    timerRef.current = setTimeout(() => {
      dispatch({ type: 'NEXT_PHASE' });
    }, interval);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [state.playing, state.phaseIndex, state.speed, flowsComplete, dispatch]);
}
