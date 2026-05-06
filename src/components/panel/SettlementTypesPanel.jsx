import { useState } from 'react';

export default function SettlementTypesPanel({ settlementInfo }) {
  const [isOpen, setIsOpen] = useState(false);
  if (!settlementInfo) return null;

  const { instructionTypes, paymentModes } = settlementInfo;

  return (
    <div className="mt-4 border border-black/8 rounded-rams overflow-hidden">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 bg-rams-surface hover:bg-rams-muted transition-colors text-left"
        aria-expanded={isOpen}
      >
        <span className="text-xs font-semibold text-ink-soft uppercase tracking-wider">
          📋 结算指令类型说明
        </span>
        <span
          className="text-ink-muted text-xs font-mono transition-transform duration-200"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ▾
        </span>
      </button>

      {isOpen && (
        <div className="px-4 py-3 space-y-4 bg-rams-card">

          <div>
            <p className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider mb-2">
              指令类型 (Instruction Types)
            </p>
            <div className="grid grid-cols-2 gap-2">
              {instructionTypes.map((type) => (
                <div
                  key={type.code}
                  className={`rounded-rams p-2.5 border text-sm ${
                    type.isCurrent
                      ? 'border-flame bg-flame/5'
                      : 'border-black/8 bg-rams-surface'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`font-mono font-bold text-xs ${
                      type.isCurrent ? 'text-flame' : 'text-ink-soft'
                    }`}>
                      {type.code}
                    </span>
                    {type.isCurrent && (
                      <span className="text-[9px] font-semibold bg-flame text-white px-1.5 py-0.5 rounded font-mono">
                        本次交易
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-medium text-ink-soft mb-0.5">{type.name}</p>
                  <p className="text-[10px] text-ink-muted leading-snug mb-1.5">{type.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {type.modes.map(mode => (
                      <span
                        key={mode}
                        className="text-[9px] font-mono font-semibold bg-black/6 text-ink-muted px-1 py-0.5 rounded"
                      >
                        {mode}
                      </span>
                    ))}
                  </div>
                  {type.hasCCP && (
                    <p className="text-[9px] text-emerald-600 mt-1 font-mono">✓ CCP保障</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider mb-2">
              付款模式 (Payment Modes)
            </p>
            <ul className="space-y-2">
              {paymentModes.map((mode) => (
                <li
                  key={mode.code}
                  className={`flex gap-2 items-start rounded-rams px-2.5 py-2 border ${
                    mode.isCurrentMode
                      ? 'border-flame/30 bg-flame/5'
                      : 'border-transparent bg-rams-surface'
                  }`}
                >
                  <span className={`font-mono font-bold text-xs shrink-0 mt-0.5 w-10 ${
                    mode.isCurrentMode ? 'text-flame' : 'text-ink-soft'
                  }`}>
                    {mode.code}
                  </span>
                  <div className="flex-1">
                    <p className="text-[11px] font-semibold text-ink-soft">
                      {mode.name}
                      <span className="font-normal text-ink-muted ml-1">({mode.fullName})</span>
                    </p>
                    <p className="text-[10px] text-ink-muted leading-snug">{mode.description}</p>
                  </div>
                  {mode.isCurrentMode && (
                    <span className="shrink-0 text-[9px] font-mono font-semibold bg-flame text-white px-1.5 py-0.5 rounded self-start">
                      本次
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

        </div>
      )}
    </div>
  );
}
