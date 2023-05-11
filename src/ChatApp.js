import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./ChatApp.css";

function ChatApp() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    // setChat([...chat, { message, sender: 'user' }]);
    // setMessage('');
    const response = await axios.post('http://127.0.0.1:8000/api/', { message });
    console.log(response)
    setChat([...chat, { message, sender: 'user' }, { message: response.data.response, sender: 'bot' }]);
    setMessage('');
    setTimeout(()=>{var chatm = document.getElementById("chatm");
    chatm.scrollTop = chatm.scrollHeight;}, 200);
    
  };

  const handleChange = (e) => {
    if (e.key === "Enter") {
      sendMessage(e);
    }
  };

  useEffect(()=>{
    async function fetchMyAPI() {
      console.log('i fire once');
      const response = await axios.post('http://127.0.0.1:8000/api/', { "message":"empty" });
      console.log(response)
      setChat([...chat, { message: response.data.response, sender: 'bot' }]);
      setMessage('');
    }

    fetchMyAPI()
   
}, []);

  return (
    <div className="chat-container">
        <div className="chat-banner">sat bot</div>
      <div className="chat-messages" id="chatm">
        {chat.map((item, index) => (
          <div key={index} className={`chat-message ${item.sender === 'user' ? 'chat-message-user' : ''}`}>
            {item.sender === 'user' && (
              <div className="chat-message-bubble  you">
                <b>You:</b> {item.message}
              </div>
            )}
            {item.sender === 'bot' && (
              <div className="chat-message-bubble">
                <b>SAT:</b> {item.message}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => handleChange(e)}
        />
        <button onClick={sendMessage}>ارسال پیام</button>
      </div>
    </div>
  );
}

export default ChatApp;
