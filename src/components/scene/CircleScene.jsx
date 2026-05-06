import { AnimatePresence } from 'framer-motion';
import { useTradeFlow } from '../../context/TradeFlowContext';
import { phases } from '../../data/phases-data';
import { ENTITY_CONFIG } from '../../utils/constants';
import Entity from './Entity';
import ConnectionLine from './ConnectionLine';
import FlyingEmoji from './FlyingEmoji';

export default function CircleScene() {
  const {
    state,
    sceneRef,
    register,
    currentFlow,
    connectionLine,
    onEmojiComplete,
    sendingEntity,
    receivingEntity,
  } = useTradeFlow();

  const phase = phases[state.phaseIndex];
  const activeEntities = phase?.active || [];

  return (
    <div
      ref={sceneRef}
      className="relative w-full bg-rams-muted/40 rounded-rams overflow-hidden h-[360px] sm:h-[420px] lg:h-[560px]"
      role="img" aria-label="香港股票交易各参与方流程可视化"
    >
      {/* SVG Connection Lines */}
      <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" aria-hidden="true">
        <ConnectionLine data={connectionLine} />
      </svg>

      {/* Flying Emojis */}
      <AnimatePresence>
        {currentFlow && (
          <FlyingEmoji flow={currentFlow} onComplete={onEmojiComplete} />
        )}
      </AnimatePresence>

      {/* Entities */}
      {Object.entries(ENTITY_CONFIG).map(([key, config]) => (
        <Entity
          key={key}
          entityKey={key}
          config={config}
          isActive={activeEntities.includes(key)}
          isSending={sendingEntity === key}
          isReceiving={receivingEntity === key}
          registerRef={register(key)}
        />
      ))}
    </div>
  );
}
