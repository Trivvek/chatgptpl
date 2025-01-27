const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const authenticateToken = require('../middleware/authMiddleware');
const db = require('../config/db');

const tokenPackages = {
    basic: { tokens: 50, price: 500 },
    standard: { tokens: 150, price: 1200 },
    premium: { tokens: 500, price: 3500 }
};

router.post('/stripe/create-checkout-session', authenticateToken, async (req, res) => {
    try {
        const { packageId } = req.body;
        const package = tokenPackages[packageId];

        if (!package) {
            return res.status(400).json({ error: 'Nieprawidłowy pakiet.' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'pln',
                    product_data: {
                        name: `${package.tokens} tokenów`,
                    },
                    unit_amount: package.price,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/tokens`,
            metadata: {
                userId: req.user.id,
                tokens: package.tokens.toString()
            },
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Błąd podczas tworzenia sesji:', error);
        res.status(500).json({ error: 'Wystąpił błąd podczas przetwarzania płatności.' });
    }
});

router.post('/stripe/add-tokens', authenticateToken, async (req, res) => {
    const connection = await db.getConnection();
    
    try {
        const { sessionId } = req.body;
        
        if (!sessionId) {
            return res.status(400).json({
                error: 'Brak identyfikatora sesji'
            });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        if (session.payment_status !== 'paid') {
            return res.status(400).json({
                error: 'Płatność nie została zakończona',
                status: session.payment_status
            });
        }

        const tokens = parseInt(session.metadata.tokens);
        
        const [existingPayments] = await connection.query(
            'SELECT * FROM payment_history WHERE payment_id = ?',
            [sessionId]
        );
        
        if (existingPayments && existingPayments.length > 0) {
            return res.status(200).json({
                success: true,
                message: 'Płatność została już przetworzona',
                tokensAdded: tokens
            });
        }

        await connection.beginTransaction();

        try {
            await connection.query(
                'UPDATE users SET tokens = tokens + ? WHERE id = ?',
                [tokens, req.user.id]
            );

            await connection.query(
                'INSERT INTO payment_history (payment_id, user_id, tokens_added) VALUES (?, ?, ?)',
                [sessionId, req.user.id, tokens]
            );

            await connection.commit();

            res.json({
                success: true,
                message: 'Tokeny zostały dodane do konta',
                tokensAdded: tokens
            });
        } catch (error) {
            await connection.rollback();
            throw error;
        }

    } catch (error) {
        console.error('Payment processing error:', error);
        res.status(500).json({
            error: 'Błąd serwera',
            message: error.message
        });
    } finally {
        if (connection) {
            await connection.release();
        }
    }
});

module.exports = router;