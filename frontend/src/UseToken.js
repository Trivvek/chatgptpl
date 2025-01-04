import React, { useState } from 'react';
import axios from 'axios';

const API_URL = '/api/chats';

export const getChats = async () => {
    const response = await axios.get(API_URL, { withCredentials: true });
    return response.data;
};

export const getChatDetails = async (chatId) => {
    const response = await axios.get(`${API_URL}/${chatId}`, { withCredentials: true });
    return response.data;
};

export const createChat = async () => {
    const response = await axios.post(API_URL, {}, { withCredentials: true });
    return response.data;
};

export const sendMessage = async (chatId, message) => {
    const response = await axios.post(`${API_URL}/${chatId}/messages`, message, { withCredentials: true });
    return response.data;
};

const UseToken = () => {
    const [response, setResponse] = useState('');
    const [tokensLeft, setTokensLeft] = useState(null);
    const [message, setMessage] = useState('');

    const handleAskQuestion = async () => {
        const question = prompt("Zadaj pytanie do ChatGPT:"); 
        if (!question) return;

        try {
            const token = localStorage.getItem('authToken'); 
            if (!token) {
                setMessage("Użytkownik nie jest zalogowany.");
                return;
            }

            const headers = { Authorization: `Bearer ${token}` };

            const res = await axios.post(
                'http://localhost:5000/api/ask',
                { question },
                { headers }
            );

            setResponse(res.data.response); 
            setTokensLeft(res.data.tokensLeft); 
        } catch (error) {
            console.error("Błąd zapytania:", error);
            setMessage(error.response?.data?.message || "Wystąpił błąd.");
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Twój Polski ChatGPT</h1>
            <button onClick={handleAskQuestion} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                Zadaj pytanie
            </button>
            {response && (
                <div>
                    <h2>Odpowiedź:</h2>
                    <p>{response}</p>
                </div>
            )}
            {tokensLeft !== null && (
                <div>
                    <h3>Pozostałe tokeny: {tokensLeft}</h3>
                </div>
            )}
            {message && <p style={{ color: 'red' }}>{message}</p>}
        </div>
    );
};

export default UseToken;