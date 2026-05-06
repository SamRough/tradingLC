export default function ActionList({ actions }) {
  if (!actions || actions.length === 0) return null;

  const hasGroups = actions.some(a => a.group);
  if (!hasGroups) {
    return (
      <ul className="space-y-2" role="list">
        {actions.map((a, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
              a.type === 'sender' ? 'bg-blue-400' : 'bg-emerald-400'
            }`} />
            <span className="text-ink-soft">{a.text}</span>
          </li>
        ))}
      </ul>
    );
  }

  const groups = { buyer: [], seller: [], all: [] };
  actions.forEach(a => {
    const g = a.group || 'all';
    if (groups[g]) groups[g].push(a);
  });

  return (
    <ul className="space-y-2" role="list">
      {groups.buyer.length > 0 && (
        <>
          <li className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider pt-2">
            买方
          </li>
          {groups.buyer.map((a, i) => (
            <li key={`b-${i}`} className="flex items-start gap-2 text-sm pl-1">
              <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                a.type === 'sender' ? 'bg-blue-400' : 'bg-emerald-400'
              }`} />
              <span className="text-ink-soft">{a.text}</span>
            </li>
          ))}
        </>
      )}
      {groups.seller.length > 0 && (
        <>
          <li className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider pt-2">
            卖方
          </li>
          {groups.seller.map((a, i) => (
            <li key={`s-${i}`} className="flex items-start gap-2 text-sm pl-1">
              <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                a.type === 'sender' ? 'bg-blue-400' : 'bg-emerald-400'
              }`} />
              <span className="text-ink-soft">{a.text}</span>
            </li>
          ))}
        </>
      )}
      {groups.all.length > 0 && (
        <>
          <li className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider pt-2">
            双方
          </li>
          {groups.all.map((a, i) => (
            <li key={`a-${i}`} className="flex items-start gap-2 text-sm pl-1">
              <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                a.type === 'sender' ? 'bg-blue-400' : 'bg-emerald-400'
              }`} />
              <span className="text-ink-soft">{a.text}</span>
            </li>
          ))}
        </>
      )}
    </ul>
  );
}
