import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('http://localhost:5000/api/login', { email, password });
            const { message, token } = response.data;
    
            setMessage(message);
            localStorage.setItem('authToken', token);
            
            navigate('/chats');
        } catch (error) {
            console.error("Błąd logowania:", error);
            setMessage("Nie udało się zalogować. Sprawdź dane i spróbuj ponownie.");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ margin: "20px" }}>
            <h2>Logowanie</h2>
            <div>
                <label>
                    E-mail:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
            </div>
            <div>
                <label>
                    Hasło:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
            </div>
            <button type="submit">Zaloguj się</button>
            {message && <p>{message}</p>}
            <p>Nie masz konta? <Link to="/register">Zarejestruj się</Link></p>
        </form>
    );
};

export default Login;