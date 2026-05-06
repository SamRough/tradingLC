import { motion } from 'framer-motion';

const entityVariants = {
  idle: {
    scale: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
  active: {
    scale: 1.02,
    borderColor: 'rgba(232,101,26,0.4)',
    boxShadow: '0 0 20px rgba(232,101,26,0.08)',
    transition: { duration: 0.3 },
  },
  sending: {
    scale: [1.02, 1.12, 1.02],
    borderColor: '#3B82F6',
    boxShadow: [
      '0 0 0px rgba(59,130,246,0)',
      '0 0 16px rgba(59,130,246,0.5)',
      '0 0 0px rgba(59,130,246,0)',
    ],
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  receiving: {
    scale: [1.02, 1.18, 0.96, 1.02],
    borderColor: '#E8651A',
    boxShadow: [
      '0 0 0px rgba(232,101,26,0)',
      '0 0 20px rgba(232,101,26,0.3)',
      '0 0 0px rgba(232,101,26,0)',
    ],
    transition: { duration: 0.7, ease: 'easeOut' },
  },
};

export default function Entity({ entityKey, config, isActive, isSending, isReceiving, registerRef }) {
  const variant = isSending ? 'sending'
    : isReceiving ? 'receiving'
    : isActive ? 'active'
    : 'idle';

  const isCenter = config.side === 'center';

  const card = (
    <div className={`
      flex flex-col items-center gap-0.5 px-3 py-2 rounded-rams
      bg-rams-card border
      min-w-[72px] sm:min-w-[80px] md:min-w-[90px]
      shadow-rams
    `}>
      <span className="text-base sm:text-lg" aria-hidden="true">{config.icon}</span>
      <span className="text-[10px] sm:text-xs font-medium text-ink leading-tight text-center">
        {config.name}
      </span>
      <span className="text-[9px] sm:text-[10px] text-ink-muted leading-tight text-center">
        {config.role}
      </span>
    </div>
  );

  // Center entities: wrapper for position, motion.div for animation
  if (isCenter) {
    return (
      <div ref={registerRef} className={`absolute ${config.positionClass}`}>
        <motion.div
          animate={variant}
          variants={entityVariants}
          className="inline-block"
        >
          {card}
        </motion.div>
      </div>
    );
  }

  // Left/right entities: motion.div handles both position and animation
  return (
    <motion.div
      ref={registerRef}
      className={`absolute ${config.positionClass}`}
      animate={variant}
      variants={entityVariants}
    >
      {card}
    </motion.div>
  );
}
