import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('loading');
    const [error, setError] = useState(null);
    const sessionId = searchParams.get('session_id');
    const processingRef = useRef(false);

    useEffect(() => {
        const updateTokens = async () => {
            if (!sessionId || processingRef.current) return;
            
            processingRef.current = true;

            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch('http://localhost:5000/api/stripe/add-tokens', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ sessionId })
                });

                const data = await response.json();

                if (response.ok) {
                    setStatus('success');
                } else {
                    setError(data.error || 'Wystąpił nieznany błąd');
                    setStatus('error');
                }
            } catch (error) {
                console.error('Payment processing error:', error);
                setError('Wystąpił błąd podczas połączenia z serwerem');
                setStatus('error');
            } finally {
                processingRef.current = false;
            }
        };

        updateTokens();
    }, [sessionId]);

    if (status === 'loading') {
        return (
            <div className="text-center p-8">
                <div className="text-xl">Przetwarzanie płatności...</div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="text-center p-8">
                <h1 className="text-2xl font-bold mb-4">Wystąpił błąd</h1>
                <p className="text-red-500 mb-4">{error}</p>
                <Link 
                    to="/tokens" 
                    className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Powrót do sklepu
                </Link>
            </div>
        );
    }

    return (
        <div className="text-center p-8">
            <h1 className="text-2xl font-bold mb-4">Płatność zakończona pomyślnie!</h1>
            <p className="mb-6">Tokeny zostały dodane do Twojego konta.</p>
            <Link 
                to="/chats" 
                className="inline-block px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
                Powrót do chatowania
            </Link>
        </div>
    );
};

export default PaymentSuccess;