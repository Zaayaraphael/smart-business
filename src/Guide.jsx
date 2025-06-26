import React, { useState } from 'react';



const Guide = () => {
  const [question, setQuestion] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);




  const askAI = async () => {
    setLoading(true);
    try {
      const response = await fetch("/.netlify/functions/openai", {
        method: "POST",
        headers: {
          
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: question})
      });
      const data = await res.json();
      setReply(data.result);
    } catch {
      setReply('Chat failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h2>MY START UP GUIDE</h2>
      <textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask AI about starting a business..." />
      <button onClick={askAI} disabled={loading}>{loading ? 'Asking...' : 'Ask AI'}</button>
      {reply && <div className="ai-reply"><h4>AI Response:</h4><p>{reply}</p></div>}
    </div>
  );
};

export default Guide;

