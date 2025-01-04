import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage("Hasła nie są takie same!");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/register', { name, email, password });
            setMessage(response.data.message || "Zarejestrowano pomyślnie! Sprawdź swój e-mail, aby aktywować konto.");
        } catch (error) {
            console.error("Błąd podczas rejestracji:", error);
            setMessage(error.response?.data.message || "Wystąpił błąd podczas rejestracji.");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ margin: "20px" }}>
            <h2>Rejestracja</h2>
            <div>
                <label>
                    Imię:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>
            </div>
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
            <div>
                <label>
                    Potwierdź hasło:
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </label>
            </div>
            <button type="submit">Zarejestruj się</button>
            {message && <p>{message}</p>}
            <p>Masz już konto? <Link to="/login">Zaloguj się</Link></p>
        </form>
    );
};

export default Register;