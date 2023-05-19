import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./ChatApp.css";

function ChatApp() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [end, setEnd] = useState('');
  const [buttons, setButtons] = useState([]);
  const [protocol, setProtocol] = useState([]);
  const [title, setTitle] = useState('');

  const isProtocol = (res)=> {
    if (res.response === "لطفا تمرین زیر رو انجام بده."){
      return true;
      
    }
    return false;
  }

  const createProtoclText = (title, details) => {
    let string = "";
    string += title + '\n\n';
    for (let i = 0; i < details.length; i+=1){
      string += `✅ ${details[i]}\n\n`;
    }
    return string;
  }

  const manageProtocol = (status, details) => {
    let title = details.response.title
    setTitle(title)
    details = details.response.details;
    setProtocol(details);
    let text = createProtoclText(title, details);
    setChat([...chat, { message: status, sender: 'bot' }, { message: text, sender: 'protocol' }])
  }

  const scrollDown = () => {
    setTimeout(()=>{var chatm = document.getElementById("chatm");
    chatm.scrollTop = chatm.scrollHeight;}, 200);
  }

  const sendMessage = async () => {
    if (message.length > 0){
      const response = await axios.post('http://127.0.0.1:8000/api/', { message });
      isProtocol(response.data.response) ? manageProtocol(response.data.response.response, response.data) : 
        setChat([...chat, { message, sender: 'user' }, { message: response.data.response, sender: 'bot' }]);
      setMessage('');
      setEnd(response.data);
      setButtons(response.data.buttons);
      scrollDown();
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
    setChat([{ message: response.data.response, sender: 'bot' }]);
    setMessage('');
    setButtons(response.data.buttons);
  }

  const setShortcut = async (m) => {
    const response = await axios.post('http://127.0.0.1:8000/api/', { "message": m });
      isProtocol(response.data.response) ? manageProtocol(response.data.response.response, response.data) : 
        setChat([...chat, { message: m, sender: 'user'  }, { message: response.data.response, sender: 'bot' }]); 
    setMessage('');
    setEnd(response.data.status);
    setButtons(response.data.buttons);
    scrollDown();
  }

  useEffect(()=>{
    async function fetchMyAPI() {
      const response = await axios.post('http://127.0.0.1:8000/api/', { "message":"empty" });
      console.log(response)
      setChat([...chat, { message: response.data.response, sender: 'bot' }]);
      setMessage('');
      setButtons(response.data.buttons);
    }

    fetchMyAPI();
   
}, []);


  return (
    <div className="chat-container">
        <div className="chat-banner">sat bot</div>
      <div className="chat-messages" id="chatm">
        {chat.map((item, index) => (
          <div key={index} className={`chat-message ${item.sender === 'user' ? 'chat-message-user' : ''}`}>
            {item.sender === 'user' && (
              <div className="chat-message-bubble  you">
                 {item.message}
              </div>
            )}
            {item.sender === 'bot' && (
              <div className="chat-message-bubble bot">
                <b></b> {item.message}
              </div>
            )}

            {
              item.sender === 'protocol' && (
                <div className="chat-message-bubble bot">
                  <b>{title}</b> {item.message.replace(`${title}`, "")}
              </div>
              )
            }
            
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