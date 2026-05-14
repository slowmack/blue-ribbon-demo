export default function CrewSidebar({ crews }) {
  return (
    <aside className="sidebar">
      <h1>Blue Ribbon Demo</h1>
      <p className="subtitle">Route optimization simulator · Northwest Arkansas</p>

      <h2>Crews ({crews.length})</h2>
      {crews.map((crew) => (
        <div key={crew.id} className="crew-card">
          <div className="crew-header">
            <span className="crew-name">{crew.name}</span>
            <span className="crew-swatch" style={{ background: crew.color }} />
          </div>
          <div className="crew-meta">
            <span>{crew.size} crew</span>
            <span>{crew.speed.toFixed(2)}× speed</span>
            <span>{crew.capacity}/day</span>
          </div>
          <div className="crew-meta" style={{ marginTop: 4, color: '#6b7280', fontSize: 11 }}>
            {crew.notes}
          </div>
        </div>
      ))}
    </aside>
  );
}
