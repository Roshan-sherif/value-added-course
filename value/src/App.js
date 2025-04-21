import React, { useState, useEffect, useRef } from 'react';
import { FiMoreVertical, FiSearch, FiPaperclip, FiMic, FiSmile } from 'react-icons/fi';
import { IoCheckmarkDone } from 'react-icons/io5';
import './App.css';

const App = () => {
  const [activeChat, setActiveChat] = useState(0);
  const [message, setMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Predefined chat data
  const [chats, setChats] = useState([
    {
      id: 0,
      name: 'AI Assistant',
      avatar: 'https://ui-avatars.com/api/?name=AI+Assistant&background=random',
      lastMessage: 'How can I help you today?',
      time: 'Just now',
      unread: 0,
      messages: [
        { id: 1, text: 'Hello! I am your AI assistant. How can I help you today?', sender: 'ai', time: '10:00 AM', status: 'read' },
      ],
    },
    {
      id: 1,
      name: 'Tech Support',
      avatar: 'https://ui-avatars.com/api/?name=Tech+Support&background=random',
      lastMessage: 'We can help with technical issues',
      time: '2 hours ago',
      unread: 3,
      messages: [
        { id: 1, text: 'Welcome to Tech Support!', sender: 'ai', time: '9:00 AM', status: 'read' },
        { id: 2, text: 'How can we assist you today?', sender: 'ai', time: '9:00 AM', status: 'read' },
      ],
    },
    {
      id: 2,
      name: 'Travel Guide',
      avatar: 'https://ui-avatars.com/api/?name=Travel+Guide&background=random',
      lastMessage: 'I can suggest beautiful destinations',
      time: 'Yesterday',
      unread: 0,
      messages: [
        { id: 1, text: 'Hello traveler! Ready to explore?', sender: 'ai', time: 'Yesterday', status: 'read' },
      ],
    },
  ]);

  // Predefined responses
  const aiResponses = {
    greetings: ["Hello there!", "Hi! How can I assist you?", "Greetings! What can I do for you today?"],
    help: ["I can answer questions, provide information, or just chat.", "My purpose is to assist you with various topics.", "I'm here to help with whatever you need."],
    thanks: ["You're welcome!", "Happy to help!", "My pleasure!", "Anytime!"],
    default: ["I'm not sure I understand. Could you rephrase that?", "Interesting point. Could you tell me more?", "I'm still learning. Can you ask me something else?"],
    tech: ["Have you tried turning it off and on again?", "Make sure all cables are properly connected.", "Check for software updates that might fix the issue."],
    travel: ["Paris is beautiful this time of year!", "Have you considered visiting Japan for a unique experience?", "Bali offers amazing beaches and culture."],
  };

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats, activeChat]);

  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: chats[activeChat].messages.length + 1,
      text: message,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    // Update the active chat with the new message
    const updatedChats = [...chats];
    updatedChats[activeChat].messages = [...updatedChats[activeChat].messages, newMessage];
    updatedChats[activeChat].lastMessage = message;
    updatedChats[activeChat].time = 'Just now';
    setChats(updatedChats);
    setMessage('');
    setTyping(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      generateAIResponse(message);
      setTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  // Generate an AI response based on user input
  const generateAIResponse = (userMessage) => {
    let responseText = '';
    const lowerCaseMessage = userMessage.toLowerCase();

    if (lowerCaseMessage.includes('hi') || lowerCaseMessage.includes('hello')) {
      responseText = aiResponses.greetings[Math.floor(Math.random() * aiResponses.greetings.length)];
    } else if (lowerCaseMessage.includes('thank')) {
      responseText = aiResponses.thanks[Math.floor(Math.random() * aiResponses.thanks.length)];
    } else if (lowerCaseMessage.includes('help') || lowerCaseMessage.includes('what can you do')) {
      responseText = aiResponses.help[Math.floor(Math.random() * aiResponses.help.length)];
    } else if (lowerCaseMessage.includes('tech') || lowerCaseMessage.includes('computer') || lowerCaseMessage.includes('issue')) {
      responseText = aiResponses.tech[Math.floor(Math.random() * aiResponses.tech.length)];
    } else if (lowerCaseMessage.includes('travel') || lowerCaseMessage.includes('vacation') || lowerCaseMessage.includes('visit')) {
      responseText = aiResponses.travel[Math.floor(Math.random() * aiResponses.travel.length)];
    } else {
      responseText = aiResponses.default[Math.floor(Math.random() * aiResponses.default.length)];
    }

    const aiMessage = {
      id: chats[activeChat].messages.length + 1,
      text: responseText,
      sender: 'ai',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'read'
    };

    const updatedChats = [...chats];
    updatedChats[activeChat].messages = [...updatedChats[activeChat].messages, aiMessage];
    updatedChats[activeChat].lastMessage = responseText;
    updatedChats[activeChat].time = 'Just now';
    setChats(updatedChats);
  };

  // Handle chat selection
  const handleChatSelect = (index) => {
    setActiveChat(index);
    // Mark messages as read
    const updatedChats = [...chats];
    updatedChats[index].unread = 0;
    setChats(updatedChats);
  };

  return (
    <div className="app">
      <div className="chat-container">
        {/* Left sidebar - Chat list */}
        <div className="chat-list">
          <div className="chat-list-header">
            <div className="profile-pic">
              <img src="https://ui-avatars.com/api/?name=User&background=random" alt="User" />
            </div>
            <div className="actions">
              <FiMoreVertical className="icon" />
            </div>
          </div>
          
          <div className="search-bar">
            <div className="search-container">
              <FiSearch className="search-icon" />
              <input type="text" placeholder="Search or start new chat" />
            </div>
          </div>
          
          <div className="chat-items">
            {chats.map((chat, index) => (
              <div 
                key={chat.id} 
                className={`chat-item ${activeChat === index ? 'active' : ''}`}
                onClick={() => handleChatSelect(index)}
              >
                <div className="chat-item-avatar">
                  <img src={chat.avatar} alt={chat.name} />
                </div>
                <div className="chat-item-content">
                  <div className="chat-item-header">
                    <span className="chat-item-name">{chat.name}</span>
                    <span className="chat-item-time">{chat.time}</span>
                  </div>
                  <div className="chat-item-message">
                    <p>{chat.lastMessage}</p>
                    {chat.unread > 0 && <span className="unread-count">{chat.unread}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right side - Chat area */}
        <div className="chat-area">
          {chats.length > 0 && (
            <>
              <div className="chat-header">
                <div className="chat-header-info">
                  <div className="chat-header-avatar">
                    <img src={chats[activeChat].avatar} alt={chats[activeChat].name} />
                  </div>
                  <div className="chat-header-details">
                    <h3>{chats[activeChat].name}</h3>
                    <p>{typing ? 'typing...' : 'online'}</p>
                  </div>
                </div>
                <div className="chat-header-actions">
                  <FiSearch className="icon" />
                  <FiMoreVertical className="icon" />
                </div>
              </div>
              
              <div className="chat-messages">
                {chats[activeChat].messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`message ${msg.sender === 'user' ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      <p>{msg.text}</p>
                      <div className="message-info">
                        <span className="message-time">{msg.time}</span>
                        {msg.sender === 'user' && (
                          <span className="message-status">
                            <IoCheckmarkDone className={`icon ${msg.status}`} />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="message received">
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <form className="chat-input" onSubmit={handleSendMessage}>
                <div className="input-actions">
                  <FiSmile className="icon" />
                  <FiPaperclip className="icon" />
                </div>
                <input
                  type="text"
                  placeholder="Type a message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  ref={inputRef}
                />
                <button type="submit" className="send-button">
                  {message.trim() ? 'Send' : <FiMic className="icon" />}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;