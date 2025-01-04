const db = require('../config/db');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OpenAI } = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, 
});

const askGPT = async (req, res) => {
    const userId = req.user.id;
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ message: "Pytanie nie może być puste." });
    }

    try {
        const [rows] = await db.query('SELECT tokens FROM users WHERE id = ?', [userId]);
        const user = rows[0];

        if (!user || user.tokens <= 0) {
            return res.status(400).json({ message: "Brak tokenów do użycia." });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini-2024-07-18",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: question },
            ],
            max_tokens: 100,
        });

        const response = completion.choices[0]?.message?.content.trim();

        await db.query('UPDATE users SET tokens = tokens - 1 WHERE id = ?', [userId]);

        res.status(200).json({ response, tokensLeft: user.tokens - 1 });
    } catch (error) {
        console.error("Błąd podczas komunikacji z OpenAI:", error);
        res.status(500).json({ message: "Wystąpił błąd podczas przetwarzania zapytania." });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "E-mail i hasło są wymagane!" });
    }

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user) {
            return res.status(404).json({ message: "Użytkownik nie istnieje." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Nieprawidłowe hasło." });
        }

        if (!user.is_active) {
            return res.status(403).json({ message: "Konto nie zostało aktywowane." });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            'secretKey', 
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: "Zalogowano pomyślnie.", token, tokensLeft: user.tokens });
    } catch (error) {
        console.error("Błąd logowania:", error);
        res.status(500).json({ message: "Wystąpił błąd. Spróbuj ponownie później." });
    }
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Imię, hasło i e-mail są wymagane!" });
    }

    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(400).json({ message: "Użytkownik z tym e-mailem już istnieje." });
        }

        const activationToken = crypto.randomBytes(20).toString('hex');

        await db.query(
            'INSERT INTO users (name, email, password, activation_token, is_active, tokens) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, activationToken, false, 10]
        );

        const transporter = nodemailer.createTransport({
            host: 'sandbox.smtp.mailtrap.io',
            port: 2525,
            auth: {
                user: '8c00598bd425f0',
                pass: 'bb8a90972cae87'
            }
        });

        const mailOptions = {
            from: 'twoj_email@gmail.com',
            to: email,
            subject: 'Aktywacja konta',
            text: `Witaj ${name},\n\nKliknij w poniższy link, aby aktywować swoje konto:\n\nhttp://localhost:3000/activate/${activationToken}`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Rejestracja zakończona. Sprawdź e-mail, aby aktywować konto." });
    } catch (error) {
        console.error("Błąd rejestracji:", error);
        res.status(500).json({ message: "Wystąpił błąd. Spróbuj ponownie później." });
    }
};

const activateUser = async (req, res) => {
    const { token } = req.params;

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE activation_token = ?', [token]);
        const user = rows[0];
        if (!user) {
            return res.status(400).json({ message: "Nieprawidłowy token aktywacyjny." });
        }

        await db.query('UPDATE users SET is_active = ? WHERE activation_token = ?', [true, token]);

        res.status(200).json({ message: "Konto zostało aktywowane pomyślnie!" });
    } catch (error) {
        console.error("Błąd aktywacji użytkownika:", error);
        res.status(500).json({ message: "Wystąpił błąd podczas aktywacji konta. Spróbuj ponownie później." });
    }
};

const useToken = async (req, res) => {
    const userId = req.user.id; 
    
    try {
        const [rows] = await db.query('SELECT tokens FROM users WHERE id = ?', [userId]);
        const user = rows[0];
        
        if (!user || user.tokens <= 0) {
            return res.status(400).json({ message: "Brak tokenów do użycia." });
        }
        
        await db.query('UPDATE users SET tokens = tokens - 1 WHERE id = ?', [userId]);
        
        res.status(200).json({ message: "Token został użyty.", tokensLeft: user.tokens - 1 });
    } catch (error) {
        console.error("Błąd używania tokenów:", error);
        res.status(500).json({ message: "Wystąpił błąd podczas używania tokenów." });
    }
};

module.exports = { registerUser, activateUser, loginUser, useToken, askGPT };
