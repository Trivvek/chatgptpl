import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Link } from 'react-router-dom';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const TokenPurchase = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const tokenPackages = [
        { id: 'basic', tokens: 50, price: 4.99 },
        { id: 'standard', tokens: 110, price: 9.99 },
    ];

    const handlePurchase = async (packageId) => {
        try {
            setLoading(true);
            setError(null);
            
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Nie jesteś zalogowany');
            }
            
            const response = await fetch('http://localhost:5000/api/stripe/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ packageId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Błąd podczas tworzenia sesji');
            }

            const session = await response.json();
            
            const stripe = await stripePromise;
            const result = await stripe.redirectToCheckout({
                sessionId: session.id
            });

            if (result.error) {
                throw new Error(result.error.message);
            }

        } catch (error) {
            console.error('Błąd podczas inicjowania płatności:', error);
            setError(error.message || 'Wystąpił błąd podczas przetwarzania płatności.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="token-container">
            <div className="token-header">
                <h1>Kup tokeny</h1>
                <Link to="/chats" className="back-to-chat">
                    ← Powrót do czatu
                </Link>
            </div>
            
            {error && (
                <div className="auth-message error">{error}</div>
            )}
            
            <div className="token-grid">
                {tokenPackages.map((pkg) => (
                    <div key={pkg.id} className="token-package">
                        <h2>{pkg.tokens} tokenów</h2>
                        <p className="price">{pkg.price.toFixed(2)} zł</p>
                        <button
                            onClick={() => handlePurchase(pkg.id)}
                            disabled={loading}
                            className="token-buy-button"
                        >
                            {loading ? 'Przetwarzanie...' : 'Kup teraz'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TokenPurchase;