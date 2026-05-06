const legendItems = [
  { emoji: '📄', label: '订单' },
  { emoji: '📈', label: '证券' },
  { emoji: '💰', label: '资金' },
  { emoji: '✅', label: '确认' },
  { emoji: '📋', label: '结算' },
  { emoji: '🔔', label: '通知' },
  { emoji: '🎉', label: '完成' },
];

export default function Legend() {
  return (
    <div className="bg-rams-card rounded-rams shadow-rams p-4">
      <h4 className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">
        图例
      </h4>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className="text-sm" aria-hidden="true">{item.emoji}</span>
            <span className="text-xs font-mono text-ink-soft">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
