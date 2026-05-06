import { createContext, useContext, useReducer, useRef } from 'react';
import { tradeFlowReducer, initialState } from '../hooks/useTradeFlowReducer';
import { useEntityRefs } from '../hooks/useEntityRefs';
import { useFlowSequence } from '../hooks/useFlowSequence';
import { useAutoPlay } from '../hooks/useAutoPlay';

const TradeFlowContext = createContext(null);

export function TradeFlowProvider({ children }) {
  const [state, dispatch] = useReducer(tradeFlowReducer, initialState);
  const { entityRefs, register } = useEntityRefs();
  const sceneRef = useRef(null);
  const data = useFlowSequence(state, entityRefs, sceneRef);
  useAutoPlay(state, dispatch, data.flowsComplete);

  const value = {
    state,
    dispatch,
    entityRefs,
    sceneRef,
    register,
    ...data,
  };

  return (
    <TradeFlowContext.Provider value={value}>
      {children}
    </TradeFlowContext.Provider>
  );
}

export function useTradeFlow() {
  const ctx = useContext(TradeFlowContext);
  if (!ctx) throw new Error('useTradeFlow must be used within TradeFlowProvider');
  return ctx;
}
