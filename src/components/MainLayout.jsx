import SceneCard from './scene/SceneCard';
import ControlBar from './controls/ControlBar';
import PhasePanel from './panel/PhasePanel';
import Legend from './Legend';

export default function MainLayout() {
  return (
    <main className="max-w-[1380px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 lg:gap-6">
        {/* Left: Scene + Controls */}
        <div className="flex flex-col gap-4 order-2 lg:order-1">
          <SceneCard />
          <ControlBar />
        </div>

        {/* Right: Panel + Legend */}
        <aside className="flex flex-col gap-4 order-1 lg:order-2">
          <PhasePanel />
          <Legend />
        </aside>
      </div>
    </main>
  );
}
