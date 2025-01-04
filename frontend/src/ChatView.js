import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getChatDetails, sendMessage } from './chatApi';

const ChatView = () => {
    const { chatId } = useParams();
    const [chat, setChat] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [tokensLeft, setTokensLeft] = useState(null);

    useEffect(() => {
        const fetchChatDetails = async () => {
            try {
                setLoading(true);
                const data = await getChatDetails(chatId);
                setChat(data);
                setError('');
            } catch (err) {
                console.error("Błąd:", err);
                setError('Nie udało się załadować szczegółów czatu.');
            } finally {
                setLoading(false);
            }
        };

        if (chatId) {
            fetchChatDetails();
        }
    }, [chatId]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const message = { content: newMessage, role: 'user' };
            const response = await sendMessage(chatId, message);
            setChat(response);
            setTokensLeft(response.tokensLeft);
            setNewMessage('');
            setError('');
        } catch (err) {
            if (err.response?.status === 400 && err.response?.data?.message === "Brak dostępnych tokenów") {
                setError('Brak dostępnych tokenów. Doładuj swoje konto.');
            } else {
                setError('Nie udało się wysłać wiadomości.');
            }
        }
    };

    return (
        <div style={{ flex: 1, padding: '20px' }}>
            <h2>Szczegóły czatu</h2>
            {tokensLeft !== null && (
                <div style={{ marginBottom: '10px' }}>
                    Pozostałe tokeny: {tokensLeft}
                </div>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px', minHeight: '300px' }}>
                {chat && chat.messages && chat.messages.length > 0 ? (
                    chat.messages.map((msg, index) => (
                        <div key={index} style={{
                            marginBottom: '10px',
                            padding: '8px',
                            backgroundColor: msg.role === 'user' ? '#e3f2fd' : '#f5f5f5',
                            borderRadius: '5px'
                        }}>
                            <strong>{msg.role === 'user' ? 'Ty' : 'Asystent'}:</strong> {msg.content}
                        </div>
                    ))
                ) : (
                    <p>Rozpocznij nową konwersację...</p>
                )}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Wpisz wiadomość..."
                    style={{ flex: 1, padding: '8px' }}
                />
                <button 
                    onClick={handleSendMessage}
                    style={{ padding: '8px 16px' }}
                >
                    Wyślij
                </button>
            </div>
        </div>
    );
};

export default ChatView;