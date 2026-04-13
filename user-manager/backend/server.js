const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = parseInt(process.env.PORT) || 3000;
console.log('Port utilisé:', PORT);

console.log('Démarrage du serveur...');

app.use(express.json());
app.use(cors());

// Servir les fichiers statiques depuis le dossier public
app.use(express.static(path.join(__dirname, 'public')));

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');

app.use('/api', authRoutes);
app.use('/api', usersRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/dashboard.html'));
});

app.get('/health', (req, res) => {
  console.log('Healthcheck appelé - répondant OK');
  res.status(200).send('OK');
});

// Démarrage du serveur
const server = app.listen(PORT, () => {
  console.log(`Serveur démarré avec succès sur le port ${PORT}`);
});

server.on('error', (err) => {
  console.error('Erreur du serveur:', err);
});