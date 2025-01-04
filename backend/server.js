require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const chatRoutes = require('./routes/chatRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true
}));

app.use(bodyParser.json());
app.use('/api', require('./routes/authRoutes'));
app.use('/api/chats', chatRoutes);
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Coś poszło nie tak' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});