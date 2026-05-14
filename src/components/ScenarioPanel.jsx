export default function ScenarioPanel({ rainedOutTuesday, onToggleRainout }) {
  return (
    <div className={`scenario ${rainedOutTuesday ? 'active' : ''}`}>
      <div className="scenario-label">Scenario</div>
      <button
        type="button"
        className={`scenario-btn ${rainedOutTuesday ? 'active' : ''}`}
        onClick={onToggleRainout}
        aria-pressed={rainedOutTuesday}
      >
        {rainedOutTuesday ? '🌧 Tuesday rained out — restore' : '🌧 Rain out Tuesday'}
      </button>
      {rainedOutTuesday && (
        <div className="scenario-detail">
          Tuesday's work redistributed across Wed/Thu/Fri.
        </div>
      )}
    </div>
  );
}
