import ModeToggle from './ModeToggle.jsx';
import StatsPanel from './StatsPanel.jsx';
import DayPicker from './DayPicker.jsx';
import PlaybackControls from './PlaybackControls.jsx';
import ScenarioPanel from './ScenarioPanel.jsx';

function formatMiles(n) {
  return `${Math.round(n)} mi`;
}

export default function CrewSidebar({
  crews,
  visibleCrewIds,
  onToggleCrew,
  onShowAll,
  onShowOnly,
  onOpenProfile,
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
  rainedOutTuesday,
  onToggleRainout,
}) {
  const routeByCrew = new Map();
  if (routes) {
    for (const r of routes) routeByCrew.set(r.crewId, r);
  }

  const dayPickerVisible = mode !== 'setup';
  const playbackVisible = mode !== 'setup' && selectedDay !== null;
  const visibleCount = visibleCrewIds.size;
  const allVisible = visibleCount === crews.length;

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
        <ScenarioPanel
          rainedOutTuesday={rainedOutTuesday}
          onToggleRainout={onToggleRainout}
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

      <div className="crews-header">
        <h2>
          Crews ({visibleCount}/{crews.length} shown)
        </h2>
        {!allVisible && (
          <button
            type="button"
            className="crews-link"
            onClick={onShowAll}
            title="Show every crew on the map"
          >
            Show all
          </button>
        )}
      </div>

      {crews.map((crew) => {
        const visible = visibleCrewIds.has(crew.id);
        const route = routeByCrew.get(crew.id);
        const isSetup = mode === 'setup';
        const cardAction = isSetup
          ? () => onOpenProfile(crew.id)
          : () => onToggleCrew(crew.id);
        const cardTitle = isSetup
          ? `Click to view ${crew.name} profile`
          : visible ? 'Hide this crew on the map' : 'Show this crew on the map';
        return (
          <div
            key={crew.id}
            className={`crew-card ${visible ? '' : 'hidden'}`}
          >
            <button
              type="button"
              className="crew-card-toggle"
              onClick={cardAction}
              aria-pressed={isSetup ? undefined : visible}
              title={cardTitle}
            >
              <div className="crew-header">
                <span className="crew-name">{crew.name}</span>
                <span
                  className={`crew-swatch ${visible ? '' : 'off'}`}
                  style={visible ? { background: crew.color } : { borderColor: crew.color }}
                />
              </div>
              <div className="crew-meta">
                <span>{crew.size} crew</span>
                <span>{crew.speed.toFixed(2)}× speed</span>
                <span>{crew.capacity}/day</span>
              </div>
              {route && (
                <div className="crew-meta" style={{ marginTop: 6 }}>
                  <span><strong>{route.stops.length}</strong> stops</span>
                  <span><strong>{formatMiles(route.miles)}</strong></span>
                  <span><strong>{route.hours.toFixed(1)}h</strong></span>
                </div>
              )}
              <div className="crew-notes">{crew.notes}</div>
            </button>
            <button
              type="button"
              className="crew-only"
              onClick={() => onShowOnly(crew.id)}
              title={`Show only ${crew.name} on the map`}
            >
              Only
            </button>
          </div>
        );
      })}
    </aside>
  );
}
