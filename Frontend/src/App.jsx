import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";

function TypingText({ text }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    if (!text) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 12);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span>
      {displayed}
      {!done && <span className="cursor-blink">▍</span>}
    </span>
  );
}

const SUGGESTIONS = [
  "What is HTML?",
  "Explain CSS Grid",
  "What is React?",
  "How does JavaScript work?",
  "What is a REST API?",
];

function App() {
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]); // [{question, answer}]
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatHistory, loading]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleAsk = async (questionOverride) => {
    const q = (questionOverride ?? query).trim();
    if (!q) return;

    setLoading(true);
    setQuery("");

    try {
      const response = await axios.post("http://localhost:8000/ask", {
        question: q,
      });
      setChatHistory((prev) => [...prev, { question: q, answer: response.data.answer }]);
      setActiveIndex(chatHistory.length); // will be the new last item
    } catch (error) {
      console.error(error);
      setChatHistory((prev) => [
        ...prev,
        { question: q, answer: "⚠️ Server error. Please try again." },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAsk();
  };

  const handleChipClick = (text) => {
    setQuery(text);
    inputRef.current?.focus();
  };

  const handleSidebarItemClick = (index) => {
    setActiveIndex(index);
    // Scroll to message
    const el = document.getElementById(`msg-${index}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleClearHistory = () => {
    setChatHistory([]);
    setActiveIndex(null);
  };

  const filteredHistory = chatHistory
    .map((item, i) => ({ ...item, index: i }))
    .filter((item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const isFirstLoad = chatHistory.length === 0 && !loading;

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      {/* Background */}
      <div className="bg-layer">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="grid-overlay" />
      </div>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-header">
          {sidebarOpen && (
            <div className="sidebar-title-row">
              <span className="sidebar-title">History</span>
              <button
                className="icon-btn danger-btn"
                onClick={handleClearHistory}
                title="Clear all history"
              >
                🗑
              </button>
            </div>
          )}
          <button
            className="icon-btn toggle-btn"
            onClick={() => setSidebarOpen((v) => !v)}
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
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
              {filteredHistory.length === 0 ? (
                <div className="sidebar-empty">
                  <span>No questions yet</span>
                </div>
              ) : (
                filteredHistory.map((item) => (
                  <button
                    key={item.index}
                    className={`sidebar-item ${activeIndex === item.index ? "active" : ""}`}
                    onClick={() => handleSidebarItemClick(item.index)}
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

      {/* Main */}
      <main className="main">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <div className="logo-wrap">
              <div className="logo-ring" />
              <span className="logo-icon">✦</span>
            </div>
            <div className="title-block">
              <h1 className="title">RAG AI Assistant</h1>
              {/* <span className="subtitle">Powered by Sigma Web Dev Course</span> */}
            </div>
          </div>
          <div className="topbar-right">
            <div className="status-pill">
              <span className="status-dot" />
              Live
            </div>
            <button
              className="theme-toggle"
              onClick={() => setDarkMode((v) => !v)}
              title="Toggle theme"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </header>

        <div className="divider" />

        {/* Chat area */}
        <div className="chat-box" ref={chatRef}>
          {isFirstLoad && (
            <div className="empty-state">
              <div className="empty-icon">◈</div>
              <p className="empty-label">Ask anything about the course…</p>
              <div className="hint-chips">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    className="chip"
                    onClick={() => handleChipClick(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {chatHistory.map((item, i) => (
            <div key={i} id={`msg-${i}`} className="message-pair">
              {/* User */}
              <div className="message user">
                <div className="message-avatar user-avatar">U</div>
                <div className="message-body user-body">{item.question}</div>
              </div>
              {/* AI */}
              <div className="message ai">
                <div className="message-avatar ai-avatar">✦</div>
                <div className="message-body ai-body">
                  {i === chatHistory.length - 1 && !loading ? (
                    <TypingText text={item.answer} />
                  ) : (
                    item.answer
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="loading">
              <div className="thinking-dots">
                <span /><span /><span />
              </div>
              <span className="thinking-label">Thinking…</span>
            </div>
          )}
        </div>

        {/* Input */}
        <div className={`input-area ${focused ? "focused" : ""}`}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask about the Sigma Web Dev Course..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          <button
            onClick={() => handleAsk()}
            className={loading ? "btn-loading" : ""}
            disabled={loading}
          >
            {loading ? (
              <span className="btn-spinner" />
            ) : (
              <>
                <span className="btn-text">Ask</span>
                <span className="btn-arrow">→</span>
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
