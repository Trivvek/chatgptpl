import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); 
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setMessage('Wszystkie pola są wymagane');
            setMessageType('error');
            return false;
        }

        if (formData.password.length < 6) {
            setMessage('Hasło musi mieć co najmniej 6 znaków');
            setMessageType('error');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setMessage('Hasła nie są takie same');
            setMessageType('error');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setMessage('Podaj prawidłowy adres email');
            setMessageType('error');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            setMessage('Rejestracja udana! Sprawdź swoją skrzynkę email, aby aktywować konto.');
            setMessageType('success');
            
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Wystąpił błąd podczas rejestracji';
            setMessage(errorMessage);
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Rejestracja</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Imię:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Wpisz swoje imię"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">E-mail:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Wpisz swój email"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Hasło:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Minimum 6 znaków"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Potwierdź hasło:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Powtórz hasło"
                            disabled={isLoading}
                        />
                    </div>

                    {message && (
                        <div className={`auth-message ${messageType}`}>
                            {message}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="auth-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Przetwarzanie...' : 'Zarejestruj się'}
                    </button>

                    <div className="auth-message">
                        Masz już konto? <Link to="/login" className="auth-link">Zaloguj się</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;