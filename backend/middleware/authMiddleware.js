const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log('Auth Header:', authHeader); 

    const token = authHeader?.split(' ')[1];
    console.log('Extracted Token:', token); 

    if (!token) {
        return res.status(401).json({ message: "Brak lub niepoprawny token dostępu." });
    }

    try {
        const user = jwt.verify(token, 'secretKey');
        console.log('Decoded User:', user); 
        req.user = user;
        next();
    } catch (error) {
        console.error('Token verification error:', error); 
        return res.status(403).json({ message: "Nieprawidłowy token." });
    }
};

module.exports = authenticateToken;