export default function TopBar({ darkMode, setDarkMode }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="logo-wrap">
          <div className="logo-ring" />
          <span className="logo-icon">✦</span>
        </div>
        <div className="title-block">
          <h1 className="title">RAG AI Assistant</h1>
        </div>
      </div>
      <div className="topbar-right">
        <div className="status-pill">
          <span className="status-dot" />
          Live
        </div>
        <button className="theme-toggle" onClick={() => setDarkMode((v) => !v)}>
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
}