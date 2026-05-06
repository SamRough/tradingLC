export const initialState = {
  phaseIndex: 0,
  playing: false,
  speed: 2,
};

export function tradeFlowReducer(state, action) {
  switch (action.type) {
    case 'NEXT_PHASE':
      return { ...state, phaseIndex: Math.min(state.phaseIndex + 1, 11) };
    case 'PREV_PHASE':
      return { ...state, phaseIndex: Math.max(state.phaseIndex - 1, 0) };
    case 'GO_TO_PHASE':
      return { ...state, phaseIndex: Math.max(0, Math.min(action.index, 11)) };
    case 'PLAY':
      return { ...state, playing: true };
    case 'PAUSE':
      return { ...state, playing: false };
    case 'TOGGLE_PLAY':
      return { ...state, playing: !state.playing };
    case 'SET_SPEED':
      return { ...state, speed: action.speed };
    case 'RESET':
      return { ...state, phaseIndex: 0, playing: false };
    default:
      return state;
  }
}
