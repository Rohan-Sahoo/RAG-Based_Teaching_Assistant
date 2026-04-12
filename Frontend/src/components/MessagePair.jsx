import TypingText from "./TypingText";

export default function MessagePair({ item, index, isLatest, loading }) {
  return (
    <div id={`msg-${index}`} className="message-pair">
      <div className="message user">
        <div className="message-avatar user-avatar">U</div>
        <div className="message-body user-body">{item.question}</div>
      </div>
      <div className="message ai">
        <div className="message-avatar ai-avatar">✦</div>
        <div className="message-body ai-body">
          {isLatest && !loading ? <TypingText text={item.answer} /> : item.answer}
        </div>
      </div>
    </div>
  );
}