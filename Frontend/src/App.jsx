import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/Topbar";
import EmptyState from "./components/EmptyState";
import MessagePair from "./components/MessagePair";
import InputBar from "./components/InputBar";

function App() {
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
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
      const response = await axios.post("http://localhost:8000/ask", { question: q });
      setChatHistory((prev) => [...prev, { question: q, answer: response.data.answer }]);
      setActiveIndex(chatHistory.length);
    } catch {
      setChatHistory((prev) => [...prev, { question: q, answer: "⚠️ Server error. Please try again." }]);
    }
    setLoading(false);
  };

  const handleChipClick = (text) => { setQuery(text); inputRef.current?.focus(); };
  const handleSidebarItemClick = (index) => {
    setActiveIndex(index);
    document.getElementById(`msg-${index}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <div className="bg-layer">
        <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
        <div className="grid-overlay" />
      </div>

      <Sidebar
        chatHistory={chatHistory}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeIndex={activeIndex}
        onItemClick={handleSidebarItemClick}
        onClear={() => { setChatHistory([]); setActiveIndex(null); }}
      />

      <main className="main">
        <TopBar darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="divider" />

        <div className="chat-box" ref={chatRef}>
          {chatHistory.length === 0 && !loading && <EmptyState onChipClick={handleChipClick} />}
          {chatHistory.map((item, i) => (
            <MessagePair
              key={i}
              item={item}
              index={i}
              isLatest={i === chatHistory.length - 1}
              loading={loading}
            />
          ))}
          {loading && (
            <div className="loading">
              <div className="thinking-dots"><span /><span /><span /></div>
              <span className="thinking-label">Thinking…</span>
            </div>
          )}
        </div>

        <InputBar
          query={query}
          setQuery={setQuery}
          onAsk={handleAsk}
          loading={loading}
          inputRef={inputRef}
          focused={focused}
          setFocused={setFocused}
        />
      </main>
    </div>
  );
}

export default App;