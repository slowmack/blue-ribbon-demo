import ModeToggle from './ModeToggle.jsx';
import StatsPanel from './StatsPanel.jsx';
import DayPicker from './DayPicker.jsx';
import PlaybackControls from './PlaybackControls.jsx';

function formatMiles(n) {
  return `${Math.round(n)} mi`;
}

export default function CrewSidebar({
  crews,
  enabledCrewIds,
  onToggleCrew,
  mode,
  onModeChange,
  routes,
  weekSchedule,
  selectedDay,
  onSelectDay,
  isPlaying,
  progress,
  speed,
  onPlayPause,
  onReset,
  onSpeedChange,
  randomStats,
  optimizedStats,
  periodLabel,
}) {
  const routeByCrew = new Map();
  if (routes) {
    for (const r of routes) routeByCrew.set(r.crewId, r);
  }

  const dayPickerVisible = mode !== 'setup';
  const playbackVisible = mode !== 'setup' && selectedDay !== null;
  const enabledCount = enabledCrewIds.size;
  const isOnlyEnabled = (crewId) =>
    enabledCount === 1 && enabledCrewIds.has(crewId);

  return (
    <aside className="sidebar">
      <h1>Blue Ribbon Demo</h1>
      <p className="subtitle">Route optimization simulator · Northwest Arkansas</p>

      <ModeToggle mode={mode} onChange={onModeChange} />

      {mode !== 'setup' && (
        <StatsPanel
          mode={mode}
          randomStats={randomStats}
          optimizedStats={optimizedStats}
          periodLabel={periodLabel}
        />
      )}

      {dayPickerVisible && (
        <DayPicker selectedDay={selectedDay} onChange={onSelectDay} />
      )}

      {playbackVisible && (
        <PlaybackControls
          isPlaying={isPlaying}
          progress={progress}
          speed={speed}
          onPlayPause={onPlayPause}
          onReset={onReset}
          onSpeedChange={onSpeedChange}
        />
      )}

      <h2>
        Crews ({enabledCount}/{crews.length})
      </h2>
      {crews.map((crew) => {
        const enabled = enabledCrewIds.has(crew.id);
        const cantDisable = isOnlyEnabled(crew.id);
        const route = routeByCrew.get(crew.id);
        return (
          <button
            key={crew.id}
            type="button"
            className={`crew-card ${enabled ? '' : 'disabled'}`}
            onClick={() => onToggleCrew(crew.id)}
            aria-pressed={enabled}
            title={
              cantDisable
                ? 'At least one crew must remain enabled'
                : enabled ? 'Click to take this crew off the schedule' : 'Click to add this crew back to the schedule'
            }
          >
            <div className="crew-header">
              <span className="crew-name">{crew.name}</span>
              <span
                className={`crew-swatch ${enabled ? '' : 'off'}`}
                style={enabled ? { background: crew.color } : { borderColor: crew.color }}
              />
            </div>
            <div className="crew-meta">
              <span>{crew.size} crew</span>
              <span>{crew.speed.toFixed(2)}× speed</span>
              <span>{crew.capacity}/day</span>
            </div>
            {enabled && route && (
              <div className="crew-meta" style={{ marginTop: 6 }}>
                <span><strong>{route.stops.length}</strong> stops</span>
                <span><strong>{formatMiles(route.miles)}</strong></span>
                <span><strong>{route.hours.toFixed(1)}h</strong></span>
              </div>
            )}
            {!enabled && (
              <div className="crew-meta crew-off-label">Off — work redistributed</div>
            )}
            <div className="crew-notes">{crew.notes}</div>
          </button>
        );
      })}
    </aside>
  );
}
