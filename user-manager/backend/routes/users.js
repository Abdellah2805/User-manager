// backend/routes/users.js
const express = require('express');
const authenticateToken = require('../middleware/auth');
const users = require('../data/users'); // 🎯 Vérifie que le chemin est correct.

const router = express.Router();

router.get('/users', authenticateToken, (req, res) => {
  const usersList = users.map(user => ({ id: user.id, email: user.email }));
  res.status(200).json(usersList);
});

router.delete('/users/:id', authenticateToken, (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(user => user.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'Utilisateur non trouvé.' });
  }

  users.splice(userIndex, 1);
  res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
});

module.exports = router;