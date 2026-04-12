const SUGGESTIONS = [
  "What is HTML?",
  "Explain CSS Grid",
  "What is React?",
  "How does JavaScript work?",
  "What is a REST API?",
];

export default function EmptyState({ onChipClick }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">◈</div>
      <p className="empty-label">Ask anything about the course…</p>
      <div className="hint-chips">
        {SUGGESTIONS.map((s) => (
          <button key={s} className="chip" onClick={() => onChipClick(s)}>{s}</button>
        ))}
      </div>
    </div>
  );
}