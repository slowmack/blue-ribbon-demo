function formatMiles(n) {
  return `${Math.round(n).toLocaleString()} mi`;
}

function formatHours(n) {
  return `${n.toFixed(1)} h`;
}

function deltaPct(before, after) {
  if (before === 0) return 0;
  return ((before - after) / before) * 100;
}

export default function StatsPanel({ randomStats, optimizedStats, mode, periodLabel = 'weekly' }) {
  const showingOptimized = mode === 'optimized';
  const active = showingOptimized ? optimizedStats : randomStats;
  const milesDelta = deltaPct(randomStats.totalMiles, optimizedStats.totalMiles);
  const hoursDelta = deltaPct(randomStats.totalHours, optimizedStats.totalHours);

  return (
    <div className="stats-panel">
      <div className="stats-headline">
        <div className="stats-headline-value">
          {formatMiles(active.totalMiles)}
        </div>
        <div className="stats-headline-label">
          {showingOptimized ? 'Optimized' : 'Unoptimized'} · {periodLabel} miles
        </div>
        <div className={`stats-delta ${milesDelta > 0 ? 'good' : 'bad'}`}>
          {milesDelta > 0 ? '↓' : '↑'} {Math.abs(milesDelta).toFixed(0)}% vs {showingOptimized ? 'unoptimized' : 'optimized'}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stats-cell">
          <div className="stats-cell-label">Total hours</div>
          <div className="stats-cell-value">{formatHours(active.totalHours)}</div>
          <div className="stats-cell-sub">
            {hoursDelta > 0 ? '↓' : '↑'} {Math.abs(hoursDelta).toFixed(0)}%
          </div>
        </div>
        <div className="stats-cell">
          <div className="stats-cell-label">Avg route</div>
          <div className="stats-cell-value">{formatMiles(active.avg)}</div>
        </div>
        <div className="stats-cell">
          <div className="stats-cell-label">Longest route</div>
          <div className="stats-cell-value">{formatMiles(active.longest)}</div>
        </div>
      </div>
    </div>
  );
}
