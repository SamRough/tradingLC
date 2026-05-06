import CircleScene from './CircleScene';

export default function SceneCard() {
  return (
    <div className="bg-rams-card rounded-rams shadow-rams-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-black/5">
        <h2 className="text-base font-semibold text-ink tracking-wide">
          交易流程可视化
        </h2>
        <p className="text-xs text-ink-muted mt-0.5">
          T+2 结算周期 · 12 个关键阶段
        </p>
      </div>
      {/* Scene */}
      <div className="p-4">
        <CircleScene />
      </div>
    </div>
  );
}
