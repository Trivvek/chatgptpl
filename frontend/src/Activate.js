import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Activate = () => {
    const { token } = useParams();
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const activateAccount = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/activate/${token}`);
                setMessage(response.data.message || "Konto zostało aktywowane!");
                setMessageType('success');

                if (response.data.token) {
                    localStorage.setItem('authToken', response.data.token);
                    setTimeout(() => navigate('/chats'), 2000);
                } else {
                    setTimeout(() => navigate('/login'), 2000);
                }
            } catch (error) {
                console.error("Błąd podczas aktywacji:", error);
                setMessage(error.response?.data?.message || "Wystąpił błąd podczas aktywacji konta.");
                setMessageType('error');
                setTimeout(() => navigate('/login'), 3000);
            }
        };

        activateAccount();
    }, [token, navigate]);

    return (
        <div className="activation-container">
            <div className="activation-card">
                <h1 className="activation-title">Aktywacja konta</h1>
                <p className={`activation-message ${messageType === 'error' ? 'auth-message error' : ''}`}>
                    {message}
                </p>
                <p className="activation-redirect">
                    Przekierowanie nastąpi automatycznie...
                </p>
            </div>
        </div>
    );
};

export default Activate;