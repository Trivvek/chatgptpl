import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChats, createChat } from './chatApi';

const ChatList = () => {
    const [chats, setChats] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const data = await getChats();
                setChats(data);
            } catch (err) {
                setError('Nie udało się załadować listy czatów.');
            }
        };
        fetchChats();
    }, []);

    const handleCreateChat = async () => {
        try {
            const newChat = await createChat();
            if (newChat && newChat.id) {
                navigate(`/chats/${newChat.id}`);
            } else {
                setError('Otrzymano nieprawidłową odpowiedź z serwera.');
            }
        } catch (err) {
            console.error('Szczegóły błędu:', err);
            setError(err.message || 'Nie udało się utworzyć nowego czatu.');
        }
    };

    return (
        <div style={{ padding: '20px', width: '250px', borderRight: '1px solid #ccc' }}>
            <h2>Twoje czaty</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button onClick={handleCreateChat} style={{ marginBottom: '10px' }}>
                Nowy czat
            </button>
            <ul>
                {chats.map((chat) => (
                    <li key={chat.id} onClick={() => navigate(`/chats/${chat.id}`)} style={{ cursor: 'pointer' }}>
                        {chat.name || `Czat ${chat.id}`}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatList;