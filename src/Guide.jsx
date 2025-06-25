import React, { useState } from 'react';



const Guide = () => {
  const [question, setQuestion] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);




  const askAI = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: 'POST',
        headers: {
          'Authorization': "Bearer ${process.env.REACT_APP_OPENAI_API_KEY} ",
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct",
          messages: [{ role: "user", content: question }]
        })
      });
      const data = await res.json();
      setReply(data.choices[0].message.content);
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







// 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
