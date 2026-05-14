const SPEEDS = [0.5, 1, 2, 4];

export default function PlaybackControls({
  isPlaying,
  progress,
  speed,
  onPlayPause,
  onReset,
  onSpeedChange,
}) {
  return (
    <div className="playback">
      <div className="playback-row">
        <button
          type="button"
          className="playback-btn primary"
          onClick={onPlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        <button
          type="button"
          className="playback-btn"
          onClick={onReset}
          aria-label="Reset"
        >
          ⟲ Reset
        </button>
      </div>

      <div className="playback-progress">
        <div
          className="playback-progress-fill"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>

      <div className="playback-row playback-speeds">
        <span className="playback-speed-label">Speed</span>
        {SPEEDS.map((s) => (
          <button
            key={s}
            type="button"
            className={`speed-btn ${speed === s ? 'active' : ''}`}
            onClick={() => onSpeedChange(s)}
          >
            {s}×
          </button>
        ))}
      </div>
    </div>
  );
}
