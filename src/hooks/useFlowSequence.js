import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { phases } from '../data/phases-data';
import { CONFIG } from '../utils/constants';
import { getEntityCenter } from '../utils/positions';

export function useFlowSequence(state, entityRefs, sceneRef) {
  const [sendingEntity, setSendingEntity] = useState(null);
  const [receivingEntity, setReceivingEntity] = useState(null);
  const [currentFlow, setCurrentFlow] = useState(null);
  const [connectionLine, setConnectionLine] = useState(null);
  const [flowsComplete, setFlowsComplete] = useState(true);
  const [flowStepIndex, setFlowStepIndex] = useState(-1);

  const timerIds = useRef(new Set());
  const positionsRef = useRef({});
  const phaseRef = useRef(state.phaseIndex);
  const completeGuardRef = useRef(false);

  const safeTimeout = useCallback((fn, delay) => {
    const id = setTimeout(() => {
      timerIds.current.delete(id);
      fn();
    }, delay);
    timerIds.current.add(id);
    return id;
  }, []);

  const clearAllTimers = useCallback(() => {
    timerIds.current.forEach(clearTimeout);
    timerIds.current.clear();
  }, []);

  // Measure positions on phase change
  useLayoutEffect(() => {
    if (!sceneRef.current) return;
    const sceneRect = sceneRef.current.getBoundingClientRect();
    positionsRef.current = {};
    for (const [key, el] of Object.entries(entityRefs.current)) {
      if (el) {
        positionsRef.current[key] = getEntityCenter(el, sceneRect);
      }
    }
  }, [state.phaseIndex, sceneRef, entityRefs]);

  // Run flow sequence on phase change
  useEffect(() => {
    phaseRef.current = state.phaseIndex;
    clearAllTimers();
    setCurrentFlow(null);
    setSendingEntity(null);
    setReceivingEntity(null);
    setConnectionLine(null);
    setFlowStepIndex(-1);

    // Skip animation before user interacts (mirrors original init calling updatePhase(false))
    if (!state.hasStarted) {
      setFlowsComplete(true);
      return;
    }

    setFlowsComplete(false);

    const phase = phases[state.phaseIndex];
    if (!phase || !phase.flows || phase.flows.length === 0) {
      setFlowsComplete(true);
      return;
    }

    const flows = phase.flows;
    const actionDuration = CONFIG.actionDuration / state.speed;
    const flowCount = flows.length || 1;
    const baseDuration = (actionDuration * (phase.actions?.length || 1)) / flowCount;

    // Self-loop flows (from === to) get a longer minimum duration so they're visible to the eye
    const flowDurations = flows.map(flow =>
      flow.from === flow.to
        ? Math.max(baseDuration, CONFIG.selfLoopMinDuration / state.speed)
        : baseDuration
    );

    let cumulativeDelay = 0;
    flows.forEach((flow, index) => {
      const flowDuration = flowDurations[index];
      safeTimeout(() => {
        if (phaseRef.current !== state.phaseIndex) return;

        const fromPos = positionsRef.current[flow.from];
        const toPos = positionsRef.current[flow.to];
        if (!fromPos || !toPos) return;

        completeGuardRef.current = false;
        setSendingEntity(flow.from);
        setFlowStepIndex(index);

        const flowType = getFlowType(flow.emoji);

        safeTimeout(() => {
          if (phaseRef.current !== state.phaseIndex) return;
          setCurrentFlow({
            key: `${state.phaseIndex}-${index}`,
            emoji: flow.emoji,
            label: flow.label || '',
            fromPos,
            toPos,
            flowType,
            duration: flowDuration,
            isSelfLoop: flow.from === flow.to,
          });
          setConnectionLine({ fromPos, toPos, flowType });
        }, 100);
      }, cumulativeDelay);
      cumulativeDelay += flowDuration;
    });

    return () => {
      clearAllTimers();
    };
  }, [state.phaseIndex, state.speed, state.playing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearAllTimers();
  }, []);

  const onEmojiComplete = useCallback(() => {
    if (completeGuardRef.current) return;
    completeGuardRef.current = true;
    const toKey = phases[state.phaseIndex]?.flows?.[flowStepIndex]?.to;
    setSendingEntity(null);
    setCurrentFlow(null);
    setConnectionLine(null);

    if (toKey) {
      setReceivingEntity(toKey);
      safeTimeout(() => {
        setReceivingEntity(null);
      }, CONFIG.pulseInDuration);
    }

    // Check if this was the last flow
    const phase = phases[state.phaseIndex];
    if (phase && flowStepIndex >= phase.flows.length - 1) {
      safeTimeout(() => {
        setFlowsComplete(true);
      }, CONFIG.flowFinishDelay + CONFIG.emojiFadeDuration);
    }
  }, [state.phaseIndex, flowStepIndex]);

  return {
    sendingEntity,
    receivingEntity,
    currentFlow,
    connectionLine,
    flowsComplete,
    onEmojiComplete,
  };
}

function getFlowType(emoji) {
  if (emoji === '📈' || emoji === '📋' || emoji === '📉' || emoji === '📊') return 'stock';
  if (emoji === '💰' || emoji === '💳') return 'money';
  if (emoji === '📄' || emoji === '📤') return 'order';
  return 'default';
}
