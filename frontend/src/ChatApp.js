import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
    getChats, 
    createChat, 
    getChatDetails, 
    sendMessage 
} from './chatApi';

const ChatApp = () => {
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [newChatMessage, setNewChatMessage] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [tokensLeft, setTokensLeft] = useState(null);

    useEffect(() => {
      const fetchTokens = async () => {
        try {
          const token = localStorage.getItem('authToken');
          console.log('Zalogowany token:', token);
      
          if (!token) {
            console.error('Brak tokena autoryzacyjnego');
            return;
          }
      
          const response = await axios.get('http://localhost:5000/api/tokens', {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
      
          console.log('Odpowiedź serwera:', response.data);
          setTokensLeft(response.data.tokensLeft);
        } catch (error) {
          console.error('Błąd ładowania tokenów', error);
          console.log('Szczegóły błędu:', error.response?.data);
          console.log('Status błędu:', error.response?.status);
        }
      };

      const fetchChats = async () => {
        try {
          const chatsData = await getChats();
          setChats(chatsData);
        } catch (error) {
          console.error('Błąd ładowania czatów', error);
        }
      };

      fetchChats();
      fetchTokens();
      
      const tokenInterval = setInterval(fetchTokens, 60000);
      return () => clearInterval(tokenInterval);
    }, []);
  
    const handleCreateChat = async () => {
      if (!newChatMessage.trim()) return;
  
      try {
        const newChat = await createChat();
        const updatedChat = await sendMessage(newChat.id, {
          content: newChatMessage,
          role: 'user'
        });
        
        setCurrentChat(updatedChat);
        const updatedChats = await getChats();
        setChats(updatedChats);
        setNewChatMessage('');
      } catch (error) {
        console.error('Błąd tworzenia czatu', error);
      }
    };
  
    const handleSendMessage = async () => {
      if (!newMessage.trim() || !currentChat) return;
  
      try {
        const response = await sendMessage(currentChat.id, {
          content: newMessage,
          role: 'user'
        });
  
        setCurrentChat(response);
        setNewMessage('');
      } catch (error) {
        console.error('Błąd wysyłania wiadomości', error);
      }
    };
  
    const selectChat = async (chatId) => {
      try {
        const chatDetails = await getChatDetails(chatId);
        setCurrentChat(chatDetails);
      } catch (error) {
        console.error('Błąd ładowania szczegółów czatu', error);
      }
    };
  
    return (
      <div className="chat-container">
        <div className="sidebar">
          <div className="sidebar-header">
            polskiChatGPT<span className="tag-close">&lt;/&gt;</span>
          </div>
          <div className="last-queries-section">
            <div className="last-queries-title">Ostatnie zapytania</div>
            {chats.map(chat => (
              <div 
                key={chat.id} 
                onClick={() => selectChat(chat.id)}
                className="chat-list-item"
              >
                {chat.title}
              </div>
            ))}
          </div>

          <button className="new-chat-button" onClick={() => setCurrentChat(null)}>
            <span className="plus-icon">+</span>
            <span>Nowy czat</span>
          </button>

          {tokensLeft !== null && (
            <div className="tokens-display">
              Pozostałe tokeny: {tokensLeft}
              <Link to="/tokens" className="buy-tokens-link">Kup więcej</Link>
            </div>
          )}
        </div>
  
        <div className="chat-main">
          {!currentChat ? (
            <div className="welcome-bubble">
              <div className="help-text">W czym mogę pomóc?</div>
              <textarea 
                value={newChatMessage}
                onChange={(e) => setNewChatMessage(e.target.value)}
                placeholder="Napisz swoją pierwszą wiadomość..."
                rows="4"
              />
              <button onClick={handleCreateChat}>
                Rozpocznij czat
              </button>
            </div>
          ) : (
            <div className="chat-window">
              <div className="messages">
                {currentChat.messages?.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`message ${msg.role}`}
                  >
                    {msg.content}
                  </div>
                ))}
              </div>
              <div className="message-input">
                <input 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Wpisz wiadomość..."
                />
                <button onClick={handleSendMessage}>Wyślij</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default ChatApp;