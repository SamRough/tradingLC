import { useEffect } from 'react';
import { TradeFlowProvider, useTradeFlow } from './context/TradeFlowContext';
import Header from './components/Header';
import MainLayout from './components/MainLayout';

function KeyboardHandler() {
  const { dispatch } = useTradeFlow();

  useEffect(() => {
    const handler = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        dispatch({ type: 'TOGGLE_PLAY' });
      } else if (e.code === 'ArrowRight') {
        dispatch({ type: 'NEXT_PHASE' });
      } else if (e.code === 'ArrowLeft') {
        dispatch({ type: 'PREV_PHASE' });
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [dispatch]);

  return null;
}

export default function App() {
  return (
    <TradeFlowProvider>
      <KeyboardHandler />
      <Header />
      <MainLayout />
    </TradeFlowProvider>
  );
}
