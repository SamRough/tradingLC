import { motion, AnimatePresence } from 'framer-motion';

const lineColors = {
  stock: '#8B5CF6',
  money: '#10B981',
  order: '#F59E0B',
  default: '#E8651A',
};

export default function ConnectionLine({ data }) {
  return (
    <AnimatePresence>
      {data && (
        <motion.line
          x1={data.fromPos.x}
          y1={data.fromPos.y}
          x2={data.toPos.x}
          y2={data.toPos.y}
          stroke={lineColors[data.flowType] || lineColors.default}
          strokeWidth={2}
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </AnimatePresence>
  );
}
