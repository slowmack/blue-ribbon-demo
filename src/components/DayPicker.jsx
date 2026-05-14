import { DAY_LABELS } from '../lib/schedule.js';

export default function DayPicker({ selectedDay, onChange }) {
  return (
    <div className="day-picker">
      <button
        type="button"
        className={`day-btn ${selectedDay === null ? 'active' : ''}`}
        onClick={() => onChange(null)}
        title="Show the full weekly route for every crew"
      >
        Week
      </button>
      {DAY_LABELS.map((label, i) => (
        <button
          key={label}
          type="button"
          className={`day-btn ${selectedDay === i ? 'active' : ''}`}
          onClick={() => onChange(i)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
