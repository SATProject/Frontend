import React, { useState, useEffect } from 'react';
import { TypeAnimation } from 'react-type-animation';
import axios from 'axios';
import "./ChatApp.css";
import { isDisabled } from '@testing-library/user-event/dist/utils';


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

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const createProtoclText = (title, details) => {
    let string = "";
    string += title + '\n\n';
    for (let i = 0; i < details.length; i+=1){
      string += `✅ ${details[i]}\n\n`;
    }
    return string;
  }

  const controlTypingAnimation = (show) => {
    scrollDown()
    const att = document.createAttribute("style");
    const typingClass = document.getElementById("typing");
    if (show === 1) {
      att.value = "display: block";
    } else {
      att.value = "display: none";
    }
    typingClass.setAttributeNode(att);
  }

  const manageProtocol = async (message, status, details) => {
    let title = details.response.title
    setTitle(title)
    details = details.response.details;
    setProtocol(details);
    let text = createProtoclText(title, details);
    setChat([...chat, { message, sender: 'user' }])
    scrollDown();
    controlTypingAnimation(1)
    await sleep(2.5 * 1000);
    controlTypingAnimation(0);
    setChat([...chat, { message, sender: 'user' }, { message: status, sender: 'bot' }])
    scrollDown();
    controlTypingAnimation(1)
    await sleep(0.7 * 1000);
    controlTypingAnimation(0)
    scrollDown();
    setChat([...chat, { message, sender: 'user' }, { message: status, sender: 'bot' },{message: text, sender: 'protocol'}])
    
  }

  const scrollDown = () => {
    setTimeout(()=>{var chatm = document.getElementById("chatm");
    chatm.scrollTop = chatm.scrollHeight;}, 200);
  }

  const handleChange = (e) => {
    if (e.key === "Enter") {
      sendMessage(e);
    }
  };


  const messageSet = async (message) => {
    const response = await axios.post('http://127.0.0.1:8000/api/', { "message": message });
    if (message === "restart") {
        setChat([{ message: response.data.response, sender: 'bot' }]);
    } else {
      if (isProtocol(response.data.response)) {
        manageProtocol(message, response.data.response.response, response.data)
      } else {
        setChat([...chat, { message: message, sender: 'user'  }]); 
        controlTypingAnimation(1)
        await sleep(2000);
        controlTypingAnimation(0)
        setChat([...chat, { message: message, sender: 'user'  }, { message: response.data.response, sender: 'bot' }]); 

      }
      setEnd(response.data.status);
    }
    setMessage('');
    setButtons(response.data.buttons);
    scrollDown();
  }

  const restart = () => {
    setChat([])
    setEnd('')
    messageSet("restart")
  }

  const setShortcut = (message) => {
    messageSet(message);
  }

    const sendMessage = () => {
    if (message.length > 0){
      messageSet(message)
    }
  };

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
                {item.message}
                {/* <TypeAnimation
                  sequence={[
                    item.message, 
                    1000, 

                    () => {
                      scrollDown()
                    }
                  ]}
                  deletionSpeed={80}
                  wrapper="span"
                  cursor={false}
                  repeat={Infinity}
                  style={{  display: 'inline-block' }}
                /> */}
              </div>
            )}

            {
              item.sender === 'protocol' && (
                <div className="chat-message-bubble bot">
                  <b>{title}</b>
                {/* <TypeAnimation
                  sequence={[
                    title, 
                    1000,

                    () => {
                      scrollDown();
                    }
                  ]}
                  deletionSpeed={60}
                  wrapper="span"
                  cursor={false}
                  repeat={Infinity}
                  style={{  fontWeight: 'bold' }}
                /> */}
                {item.message.replace(`${title}`, "")}
              {/* <TypeAnimation
                  sequence={[
                    item.message.replace(`${title}`, ""),
                    10,

                    () => {
                      scrollDown();
                    }
                  ]}
                  deletionSpeed={90}
                  wrapper="span"
                  cursor={false}
                  repeat={Infinity}
                  style={{ display: 'inline-block' }}
                />
                 */}
              </div>
              )
            }
            
          </div>
        ))}

            {/* typing effect */}
        <div class="typing" id='typing'>
          <span></span>
          <span></span>
          <span></span>
        </div>
        
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