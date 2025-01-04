import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Activate = () => {
    const { token } = useParams(); 
    const [message, setMessage] = useState('');
    const [activationLink, setActivationLink] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const activateAccount = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/activate/${token}`);
                setMessage(response.data.message || "Konto zostało aktywowane!");
                setActivationLink(`http://localhost:5000/api/activate/${token}`);
            } catch (error) {
                console.error("Błąd aktywacji konta:", error);
                setMessage("Wystąpił błąd podczas aktywacji konta.");
            }
        };

        activateAccount();

        const timer = setTimeout(() => {
            navigate('/login'); 
        }, 3000);

        return () => clearTimeout(timer); 
    }, [token, navigate]);

    return (
        <div>
            <h1>Aktywacja konta</h1>
            <p>{message}</p>
            {activationLink && (
                <p>
                    Możesz kliknąć tutaj, aby aktywować konto:{" "}
                    <a href={activationLink}>{activationLink}</a>
                </p>
            )}
        </div>
    );
};

export default Activate;