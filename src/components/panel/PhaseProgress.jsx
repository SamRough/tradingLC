import { phases } from '../../data/phases-data';

export default function PhaseProgress({ currentPhase }) {
  return (
    <div className="flex items-center gap-1" aria-hidden="true">
      {phases.map((p, i) => (
        <div
          key={p.id}
          className={`
            w-1.5 h-1.5 rounded-full transition-all duration-300
            ${i < currentPhase ? 'bg-emerald-300' : ''}
            ${i === currentPhase ? 'bg-flame w-3' : ''}
            ${i > currentPhase ? 'bg-black/10' : ''}
          `}
        />
      ))}
    </div>
  );
}
