export default function InputBar({ query, setQuery, onAsk, loading, inputRef, focused, setFocused }) {
  return (
    <div className={`input-area ${focused ? "focused" : ""}`}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Ask about the Sigma Web Dev Course..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onAsk()}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <button
  onMouseDown={(e) => e.preventDefault()}
  onClick={() => onAsk()}   // ← wrap in arrow function so no args are passed
  className={loading ? "btn-loading" : ""}
  disabled={loading}
>
        {loading ? <span className="btn-spinner" /> : <><span className="btn-text">Ask</span><span className="btn-arrow">→</span></>}
      </button>
    </div>
  );
}