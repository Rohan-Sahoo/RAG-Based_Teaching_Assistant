export default function Sidebar({ chatHistory, sidebarOpen, setSidebarOpen, searchTerm, setSearchTerm, activeIndex, onItemClick, onClear }) {
  const filtered = chatHistory
    .map((item, i) => ({ ...item, index: i }))
    .filter((item) => item.question.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
      <div className="sidebar-header">
        {sidebarOpen && (
          <div className="sidebar-title-row">
            <span className="sidebar-title">History</span>
            <button className="icon-btn danger-btn" onClick={onClear} title="Clear all history">🗑</button>
          </div>
        )}
        <button className="icon-btn toggle-btn" onClick={() => setSidebarOpen((v) => !v)}>
          {sidebarOpen ? "◀" : "▶"}
        </button>
      </div>

      {sidebarOpen && (
        <>
          <div className="sidebar-search">
            <input
              type="text"
              placeholder="Search history…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="sidebar-search-input"
            />
          </div>
          <div className="sidebar-list">
            {filtered.length === 0 ? (
              <div className="sidebar-empty"><span>No questions yet</span></div>
            ) : (
              filtered.map((item) => (
                <button
                  key={item.index}
                  className={`sidebar-item ${activeIndex === item.index ? "active" : ""}`}
                  onClick={() => onItemClick(item.index)}
                >
                  <span className="sidebar-item-icon">◈</span>
                  <span className="sidebar-item-text">{item.question}</span>
                </button>
              ))
            )}
          </div>
          <div className="sidebar-footer">
            <div className="sidebar-stats">
              <span>{chatHistory.length} question{chatHistory.length !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}