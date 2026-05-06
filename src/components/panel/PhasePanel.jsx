import { useTradeFlow } from '../../context/TradeFlowContext';
import { phases } from '../../data/phases-data';
import PhaseProgress from './PhaseProgress';
import PhaseHeader from './PhaseHeader';
import PhaseDescription from './PhaseDescription';
import ActionList from './ActionList';

export default function PhasePanel() {
  const { state } = useTradeFlow();
  const phase = phases[state.phaseIndex];

  return (
    <div className="bg-rams-card rounded-rams shadow-rams-lg border-l-[3px] border-l-flame overflow-hidden">
      <div className="p-5">
        <div className="mb-4">
          <PhaseProgress currentPhase={state.phaseIndex} />
        </div>
        <PhaseHeader id={phase.id} title={phase.title} tTag={phase.tTag} />
        <PhaseDescription description={phase.desc} />
        <ActionList actions={phase.actions} />
      </div>
    </div>
  );
}
