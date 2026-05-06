import { motion } from 'framer-motion';

const glowColors = {
  stock:  'drop-shadow(0 0 12px rgba(139, 92, 246, 0.7))',
  money:  'drop-shadow(0 0 12px rgba(16, 185, 129, 0.7))',
  order:  'drop-shadow(0 0 12px rgba(245, 158, 11, 0.7))',
  default: 'drop-shadow(0 0 12px rgba(232, 101, 26, 0.7))',
};

export default function FlyingEmoji({ flow, onComplete }) {
  if (!flow) return null;

  const { key, emoji, label, fromPos, toPos, flowType, duration } = flow;
  const durSec = duration / 1000;

  return (
    <motion.div
      key={key}
      className="absolute left-0 top-0 z-[100] pointer-events-none"
      initial={{ x: fromPos.x, y: fromPos.y, scale: 0.3, opacity: 0 }}
      animate={{ x: toPos.x, y: toPos.y, scale: 1, opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      transition={{
        x: { duration: durSec, ease: 'linear' },
        y: { duration: durSec, ease: 'linear' },
        scale: { duration: 0.3, ease: 'easeOut' },
        opacity: { duration: 0.3 },
      }}
      onAnimationComplete={onComplete}
    >
      <div
        className="flex flex-col items-center"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <span
          className="text-xl sm:text-2xl leading-none"
          style={{ filter: glowColors[flowType] || glowColors.default }}
        >
          {emoji}
        </span>
        {label && (
          <span className="text-[9px] font-mono font-semibold bg-flame text-white px-1.5 py-0.5 rounded whitespace-nowrap mt-1">
            {label}
          </span>
        )}
      </div>
    </motion.div>
  );
}
