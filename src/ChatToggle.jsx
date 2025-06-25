import React, { useState } from 'react';
import './chatToggle.css';
import { MessageCircle, Mic, MicOff, UserMinus } from 'lucide-react';


const ChatToggle = () => {
    const [ isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState ([
        {
            role: 'bot',
            text: "🖐 Hi, I'm Rexis, your business mentor, what's your name and what kind of business do you run?"
        }
    ]);

    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [inputMode, setInputMode] = useState('text');

const startListening = () => {
    const speechRcognition = window.speechRecognition || window.webkitspeechRecognition;

    if(!speechRcognition) {
        alert("Speech recognition not supported on this browser.");
        return;
    }

    const recognition = new 
speechRcognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setIsListening(true);

    recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
    };

    recognition.onerorr = (e) => {
        console.error("speech recognition error", e.error);
        setIsListening(false);
    };
};



    const sendMessages = async () => {
       if (!input.trim()) return;

       const userMessage = { role: 'user', text: input };
       setMessages((prev) => [...prev, userMessage]);
       setInput('');
       const updatedMessages = [...messages, userMessage];

       const newMessages = [... messages,
        {role: 'user', text: input}
       ];
       setInput('');
       setIsLoading(true);

       

       const response = await
       fetch("/.netlify/functions/openai", {
        method: "post",
        headers: {
            authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            "content-type": "application/json",
        },

        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: updatedMessages.map(msg => ({
                'user' : 'assistant',
                content: msg.text
            }))
        })

       });


       const data = await response.json();
       const reply = 
       data.choices[0].message.content;
       setMessages([...newMessages, {
        role: 'bot', text: reply
       }]); 
      /*
       catch (error) {
        console.error("Error fetching response", error);
       }
*/
       setIsLoading(false);
    };




    return(
        <>
        
        <div className='chat-toggle'>
            
            <button className='chat-icon' onClick={() => setIsOpen(!isOpen)}>
                <MessageCircle  size={28} />
            </button>
            
        </div>
        {isOpen && (
            <div className='chat-box'>
                <div className='chat-messages'>
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`chat-message ${msg.role}`}>
                            {msg.text} 
                        </div>
                    )
                    
                )}
                { isLoading && <div className='loading-spinner'>⌛ Rexis is thinking...</div>}

                </div>
                {/* Toggle between text and voice */}

                <div className='toggle-mode'>
                    <label>
                        <input type="checkbox" checked={inputMode === 'voice'}
                        onChange={() => 
                            setInputMode((prev) => 
                            (prev === 'text' ? 'voice': 'text'))}
                        />
                        {inputMode=== 'voice' ? '🎤 voice mode' : '📖 text mode'}
                    </label>
                </div>

                {/* input area here */}
                <div className='chat-input'>
                    {inputMode === 'text' ? (
                        <>
                        <input value={input} onChange={(e) =>
                        setInput(e.target.value) }
                        placeholder='Type here...' 
                        />
                        <button onClick={sendMessages}>
                            Send
                        </button>
                        </>

                        
                    ) : (
                        <button onClick={startListening} className='mic-button'>
                            {isListening ? <MicOff size={24}/> : <Mic size={24} />}

                            {isListening ? 'Listening...' : 'Start Talking'}

                        </button>
                    )}

                </div>


            </div>
        )}

        </>
    );
};
export default ChatToggle