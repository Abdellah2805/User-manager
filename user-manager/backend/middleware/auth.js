// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_super_secret_key';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token invalide ou expiré.' });
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;