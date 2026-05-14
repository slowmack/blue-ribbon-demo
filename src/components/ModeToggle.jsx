const MODES = [
  { id: 'setup',     label: 'Setup' },
  { id: 'random',    label: 'Unoptimized' },
  { id: 'optimized', label: 'Optimized' },
];

export default function ModeToggle({ mode, onChange }) {
  return (
    <div className="mode-toggle">
      {MODES.map((m) => (
        <button
          key={m.id}
          type="button"
          className={`mode-btn ${mode === m.id ? 'active' : ''}`}
          onClick={() => onChange(m.id)}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
