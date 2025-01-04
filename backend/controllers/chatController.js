const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const createChat = async (req, res) => {
    const userId = req.user.id;

    try {
        const chatId = uuidv4();
        const title = 'Nowy czat'; 
        
        await db.query(
            'INSERT INTO chats (id, user_id, title, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
            [chatId, userId, title]
        );
        
        res.status(201).json({ 
            id: chatId,
            title: title
        });
    } catch (error) {
        console.error("Błąd tworzenia czatu:", error);
        res.status(500).json({ message: "Nie udało się utworzyć nowego czatu." });
    }
};

const getChats = async (req, res) => {
    const userId = req.user.id;

    try {
        const [chats] = await db.query(
            'SELECT id, title, created_at, updated_at FROM chats WHERE user_id = ? ORDER BY updated_at DESC',
            [userId]
        );
        res.status(200).json(chats);
    } catch (error) {
        console.error("Błąd pobierania listy czatów:", error);
        res.status(500).json({ message: "Nie udało się pobrać czatów." });
    }
};

const getChatDetails = async (req, res) => {
    const userId = req.user.id;
    const { chatId } = req.params;

    try {
        console.log('Pobieranie szczegółów czatu:', { userId, chatId });

        const [chat] = await db.query(
            'SELECT * FROM chats WHERE id = ? AND user_id = ?',
            [chatId, userId]
        );

        if (!chat || chat.length === 0) {
            return res.status(404).json({ message: "Czat nie znaleziony." });
        }

        const [messages] = await db.query(
            'SELECT role, content, created_at FROM messages WHERE chat_id = ? ORDER BY created_at ASC',
            [chatId]
        );

        res.status(200).json({
            ...chat[0],
            messages: messages || []
        });
    } catch (error) {
        console.error("Błąd pobierania szczegółów czatu:", error);
        res.status(500).json({ message: "Nie udało się pobrać szczegółów czatu." });
    }
};

const addMessage = async (req, res) => {
    const userId = req.user.id;
    const { chatId } = req.params;
    const { role, content } = req.body;

    if (!['user', 'assistant', 'system'].includes(role) || !content) {
        return res.status(400).json({ message: "Nieprawidłowe dane wejściowe." });
    }

    try {
        const [userRows] = await db.query('SELECT tokens FROM users WHERE id = ?', [userId]);
        const user = userRows[0];

        if (!user || user.tokens <= 0) {
            return res.status(400).json({ message: "Brak dostępnych tokenów." });
        }

        const [chat] = await db.query(
            'SELECT * FROM chats WHERE id = ? AND user_id = ?',
            [chatId, userId]
        );

        if (!chat.length) {
            return res.status(404).json({ message: "Czat nie znaleziony." });
        }

        await db.query(
            'INSERT INTO messages (chat_id, role, content) VALUES (?, ?, ?)',
            [chatId, role, content]
        );

        const [messages] = await db.query(
            'SELECT role, content FROM messages WHERE chat_id = ? ORDER BY created_at ASC',
            [chatId]
        );

        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini-2024-07-18",
                messages: messages.map(msg => ({
                    role: msg.role,
                    content: msg.content
                }))
            });

            const assistantResponse = completion.choices[0].message.content;

            await db.query(
                'INSERT INTO messages (chat_id, role, content) VALUES (?, ?, ?)',
                [chatId, 'assistant', assistantResponse]
            );

            await db.query('UPDATE users SET tokens = tokens - 1 WHERE id = ?', [userId]);

            await db.query(
                'UPDATE chats SET updated_at = CURRENT_TIMESTAMP WHERE id = ?', 
                [chatId]
            );

            const [updatedMessages] = await db.query(
                'SELECT role, content, created_at FROM messages WHERE chat_id = ? ORDER BY created_at ASC',
                [chatId]
            );

            res.status(201).json({
                messages: updatedMessages,
                tokensLeft: user.tokens - 1
            });

        } catch (apiError) {
            console.error("Błąd API ChatGPT:", apiError);
            res.status(500).json({ message: "Błąd podczas komunikacji z API ChatGPT." });
        }

    } catch (error) {
        console.error("Błąd dodawania wiadomości:", error);
        res.status(500).json({ message: "Nie udało się dodać wiadomości." });
    }
};

module.exports = { createChat, getChats, getChatDetails, addMessage };