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
        <div className="auth-container">
  <form onSubmit={handleSubmit} className="auth-form">
    <h2>Logowanie</h2>
    <div className="form-group">
      <label>E-mail:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
    </div>
    <div className="form-group">
      <label>Hasło:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </div>
    <button type="submit" className="auth-button">Zaloguj się</button>
    {message && <p className="auth-message">{message}</p>}
    <p className="auth-message">
      Nie masz konta? <Link to="/register" className="auth-link">Zarejestruj się</Link>
    </p>
  </form>
</div>
    );
};

export default Login;