import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./ChatApp.css";

function ChatApp() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [end, setEnd] = useState('');
  const [buttons, setButtons] = useState([]);

  const sendMessage = async () => {
    // setChat([...chat, { message, sender: 'user' }]);
    // setMessage('');
    if (message.length > 0){
      const response = await axios.post('http://127.0.0.1:8000/api/', { message });
      console.log(response)
      let stat = response.data.status;
      console.log(stat);
      setChat([...chat, { message, sender: 'user' }, { message: response.data.response, sender: 'bot' }]);
      setMessage('');
      setEnd(response.data.status)
      setTimeout(()=>{var chatm = document.getElementById("chatm");
      chatm.scrollTop = chatm.scrollHeight;}, 200);
      setButtons(response.data.buttons)
    }
  };


  const handleChange = (e) => {
    if (e.key === "Enter") {
      sendMessage(e);
    }
  };

  const restart = async () => {
    setChat([])
    setEnd('')
    const response = await axios.post('http://127.0.0.1:8000/api/', { "message":"restart" });
    console.log(response)
    setChat([{ message: response.data.response, sender: 'bot' }]);
    setMessage('');
    setButtons(response.data.buttons)
  }

  const setShortcut = async (m) => {
    console.log(m);
    const response = await axios.post('http://127.0.0.1:8000/api/', { "message": m });
    console.log(response)
    let stat = response.data.status;
    console.log(stat);
    setChat([...chat, { message: m, sender: 'user' }, { message: response.data.response, sender: 'bot' }]);
    setMessage('');
    setEnd(response.data.status)
    setTimeout(()=>{var chatm = document.getElementById("chatm");
    chatm.scrollTop = chatm.scrollHeight;}, 200);
    setButtons(response.data.buttons)

  }

  useEffect(()=>{
    async function fetchMyAPI() {
      console.log('i fire once');
      const response = await axios.post('http://127.0.0.1:8000/api/', { "message":"empty" });
      console.log(response)
      setChat([...chat, { message: response.data.response, sender: 'bot' }]);
      setMessage('');
      setButtons(response.data.buttons)
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
      {end === "end" && <div className="restart">
        <button onClick={restart}>شروع مجدد</button>
      </div>}

      { end !== "end" &&
      <>
      <div className='button-group'>
        {
          buttons.length ?
          buttons.map((button, button_id)=> (
            <input 
            className='short-button'
            type="button"
            value={button} 
            key={button_id} 
            onClick={(e) => setShortcut(e.target.value)}
             />
          )):
          <></>
        }
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
        </>
      }
      
    </div>
  );
}

export default ChatApp;
