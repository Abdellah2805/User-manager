const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
// Une "base de données" en mémoire pour cet exemple
let users = [];

// Clé secrète pour les tokens JWT (doit être stockée de manière sécurisée en production)
const JWT_SECRET = 'your_super_secret_key';

// Route pour l'inscription d'un utilisateur
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Validation simple
  if (!email || !password) {
    return res.status(400).json({ message: 'Veuillez fournir un email et un mot de passe.' });
  }

  // Vérifier si l'utilisateur existe déjà
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ message: 'Cet email est déjà enregistré.' });
  }

  try {
    // Hacher le mot de passe avant de le stocker
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: users.length + 1, email, password: hashedPassword };
    users.push(newUser);

    // Envoi de la réponse
    res.status(201).json({ message: 'Utilisateur enregistré avec succès.', user: { id: newUser.id, email: newUser.email } });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'utilisateur.', error: error.message });
  }
});

// Route pour la connexion d'un utilisateur
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Veuillez fournir un email et un mot de passe.' });
  }

  // Rechercher l'utilisateur dans notre "base de données"
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Identifiants invalides.' });
  }

  try {
    // Comparer le mot de passe fourni avec le mot de passe haché
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }

    // Générer un token JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    // Envoi du token au client
    res.status(200).json({ message: 'Connexion réussie.', token });
  } catch (error) {
    res.status(500).json({ message: 'Erreur de serveur.', error: error.message });
  }
});

module.exports = router;
module.exports.users = users;