import NavButtons from './NavButtons';
import SpeedControl from './SpeedControl';
import Timeline from './Timeline';

export default function ControlBar() {
  return (
    <div className="bg-rams-card rounded-rams shadow-rams p-3 sm:p-4">
      <div className="flex items-center gap-3 flex-wrap">
        <NavButtons />
        <div className="w-px h-6 bg-black/10 hidden sm:block" />
        <SpeedControl />
        <div className="w-px h-6 bg-black/10 hidden sm:block" />
        <Timeline />
      </div>
    </div>
  );
}
