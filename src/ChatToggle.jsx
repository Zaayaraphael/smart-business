import { useState } from 'react';
import { MessageCircle, Mic, MicOff, Send, X } from 'lucide-react';
import './chatToggle.css';

const ChatToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I’m Rexis, your business mentor. What are you working on today?' },
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [inputMode, setInputMode] = useState('text');
  const [error, setError] = useState('');

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Voice input is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    setIsListening(true);
    setError('');
    recognition.onresult = (event) => {
      setInput(event.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => {
      setIsListening(false);
      setError('Could not hear that. Please try again or type your question.');
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const sendMessages = async (event) => {
    event.preventDefault();
    if (!input.trim() || isLoading) return;

    const updatedMessages = [...messages, { role: 'user', text: input.trim() }];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/.netlify/functions/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((message) => ({
            role: message.role === 'bot' ? 'assistant' : 'user',
            content: message.text,
          })),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.result) throw new Error(data.error || 'The assistant could not respond.');
      setMessages((current) => [...current, { role: 'bot', text: data.result }]);
    } catch (requestError) {
      setError(requestError.message || 'Could not contact the assistant. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-widget">
      {isOpen && (
        <section className="chat-box" aria-label="Business mentor chat">
          <header className="chat-header">
            <span className="chat-avatar"><SparkleIcon /></span>
            <div className="chat-header-copy"><strong>Rexis</strong><span>Your business mentor</span></div>
            <span className="chat-online-dot" aria-label="Available" />
            <button type="button" className="chat-close" onClick={() => setIsOpen(false)} aria-label="Close chat"><X size={18} /></button>
          </header>
          <div className="chat-messages" aria-live="polite">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`chat-message ${message.role}`}>{message.text}</div>
            ))}
            {isLoading && <div className="chat-thinking"><span /> Rexis is thinking…</div>}
          </div>
          {error && <p className="chat-error" role="status">{error}</p>}
          <div className="chat-mode">
            <span>Input mode</span>
            <button type="button" aria-pressed={inputMode === 'voice'} onClick={() => setInputMode(inputMode === 'text' ? 'voice' : 'text')}>
              {inputMode === 'voice' ? <><Mic size={14} /> Voice</> : 'Text'}
            </button>
          </div>
          {inputMode === 'text' ? (
            <form className="chat-input" onSubmit={sendMessages}>
              <input aria-label="Message Rexis" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask a business question…" />
              <button type="submit" disabled={!input.trim() || isLoading} aria-label="Send message"><Send size={17} /></button>
            </form>
          ) : (
            <div className="chat-voice"><button type="button" className="mic-button" onClick={startListening} disabled={isListening}>{isListening ? <MicOff size={17} /> : <Mic size={17} />}{isListening ? 'Listening…' : 'Tap to talk'}</button>{input && <button type="button" className="voice-send" onClick={(event) => sendMessages(event)} disabled={isLoading}>Send message</button>}</div>
          )}
        </section>
      )}
      <button type="button" className={`chat-icon${isOpen ? ' chat-icon-open' : ''}`} onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? 'Close business mentor chat' : 'Open business mentor chat'} aria-expanded={isOpen}>
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
};

function SparkleIcon() {
  return <span aria-hidden="true">✦</span>;
}

export default ChatToggle;
