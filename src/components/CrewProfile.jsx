import { useEffect } from 'react';

function StarRating({ value }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className="stars" aria-label={`${value.toFixed(2)} of 5`}>
      {'★'.repeat(full)}
      {half ? '⯨' : ''}
      {'☆'.repeat(empty)}
    </span>
  );
}

function MetricBar({ value, max, color }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="metric-bar">
      <div
        className="metric-bar-fill"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

export default function CrewProfile({ crew, people, teamStats, onClose }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!crew) return null;

  return (
    <>
      <div className="crew-profile-backdrop" onClick={onClose} />
      <aside className="crew-profile" role="dialog" aria-label={`${crew.name} profile`}>
        <header className="profile-header">
          <span className="profile-swatch" style={{ background: crew.color }} />
          <div className="profile-title">
            <div className="profile-name">{crew.name}</div>
            <div className="profile-rating">
              <StarRating value={teamStats.composite} />
              <span className="profile-rating-num">{teamStats.composite.toFixed(2)}</span>
            </div>
          </div>
          <button
            type="button"
            className="profile-close"
            onClick={onClose}
            aria-label="Close profile"
          >
            ×
          </button>
        </header>

        <section className="profile-section">
          <div className="profile-section-label">Team</div>
          <div className="profile-team-grid">
            <div className="profile-metric">
              <div className="profile-metric-label">Productivity</div>
              <div className="profile-metric-value">
                {teamStats.productivity.toFixed(2)} <span className="unit">stops/hr</span>
              </div>
              <MetricBar value={teamStats.productivity} max={6.5} color={crew.color} />
            </div>
            <div className="profile-metric">
              <div className="profile-metric-label">Quality</div>
              <div className="profile-metric-value">
                <StarRating value={teamStats.quality} />
                <span className="unit"> {teamStats.quality.toFixed(2)}</span>
              </div>
            </div>
            <div className="profile-metric">
              <div className="profile-metric-label">Attendance</div>
              <div className="profile-metric-value">
                {teamStats.attendance.toFixed(1)}<span className="unit">%</span>
              </div>
              <MetricBar value={teamStats.attendance - 85} max={15} color="#10b981" />
            </div>
            <div className="profile-metric">
              <div className="profile-metric-label">Combined tenure</div>
              <div className="profile-metric-value">
                {teamStats.totalTenure.toFixed(1)} <span className="unit">years</span>
              </div>
            </div>
          </div>
          <div className="profile-crew-meta">
            {crew.size} crew · {crew.speed.toFixed(2)}× speed · {crew.capacity}/day capacity
          </div>
          <div className="profile-crew-notes">{crew.notes}</div>
        </section>

        <section className="profile-section">
          <div className="profile-section-label">People ({people.length})</div>
          {people.map((person) => (
            <div key={person.id} className="profile-person">
              <div className="profile-person-header">
                <span className="profile-person-name">{person.fullName}</span>
                <span className="profile-person-tenure">{person.tenureYears}y</span>
              </div>
              <div className="profile-person-role">{person.role}</div>
              <div className="profile-person-stats">
                <div className="profile-person-stat">
                  <span className="ps-label">Productivity</span>
                  <span className="ps-value">{person.stats.productivity.toFixed(2)}/hr</span>
                  <MetricBar value={person.stats.productivity} max={6.5} color={crew.color} />
                </div>
                <div className="profile-person-stat">
                  <span className="ps-label">Quality</span>
                  <span className="ps-value">
                    <StarRating value={person.stats.quality} /> {person.stats.quality.toFixed(2)}
                  </span>
                </div>
                <div className="profile-person-stat">
                  <span className="ps-label">Attendance</span>
                  <span className="ps-value">{person.stats.attendance.toFixed(1)}%</span>
                  <MetricBar value={person.stats.attendance - 85} max={15} color="#10b981" />
                </div>
              </div>
            </div>
          ))}
        </section>
      </aside>
    </>
  );
}
