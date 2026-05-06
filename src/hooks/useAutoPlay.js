import { useEffect, useRef } from 'react';
import { phases } from '../data/phases-data';
import { CONFIG } from '../utils/constants';

export function useAutoPlay(state, dispatch) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!state.playing) return;

    if (state.phaseIndex >= phases.length - 1) {
      dispatch({ type: 'PAUSE' });
      return;
    }

    const phase = phases[state.phaseIndex];
    const actionCount = phase?.actions?.length || 1;
    const minInterval = actionCount * CONFIG.actionDuration + CONFIG.scheduleBuffer;
    const interval = Math.max(minInterval, CONFIG.scheduleBase) / state.speed;

    timerRef.current = setTimeout(() => {
      dispatch({ type: 'NEXT_PHASE' });
    }, interval);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [state.playing, state.phaseIndex, state.speed, dispatch]);
}
