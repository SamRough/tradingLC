export default function PhaseHeader({ id, title, tTag }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-rams bg-flame text-white flex items-center justify-center text-lg font-bold font-mono">
          {String(id).padStart(2, '0')}
        </div>
        <div>
          <div className="text-sm text-ink-muted font-mono">
            PHASE {id} / 12
          </div>
          <h3 className="text-lg font-semibold text-ink">
            {title}阶段
          </h3>
        </div>
      </div>
      {tTag && (
        <span className="inline-block text-[11px] font-mono font-semibold text-flame bg-flame/10 px-2 py-0.5 rounded mb-3">
          {tTag}
        </span>
      )}
    </div>
  );
}
