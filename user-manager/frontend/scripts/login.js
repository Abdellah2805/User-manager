// frontend/scripts/login.js
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');

    try {
        const apiUrl = window.location.origin;
        const registerResponse = await fetch(`${apiUrl}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!registerResponse.ok && registerResponse.status !== 409) {
            const errorData = await registerResponse.json();
            messageDiv.textContent = `Erreur lors de l'inscription: ${errorData.message}`;
            messageDiv.classList.add('error');
            return;
        }

        const loginResponse = await fetch(`${apiUrl}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        // Si l'inscription échoue pour cause de doublon (statut 409),
        // on continue car l'utilisateur existe déjà.
        if (!registerResponse.ok && registerResponse.status !== 409) {
            const errorData = await registerResponse.json();
            messageDiv.textContent = `Erreur lors de l'inscription: ${errorData.message}`;
            messageDiv.classList.add('error');
            return;
        }

        // Requête vers l'API pour la connexion
        const loginResponse = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await loginResponse.json();

        if (loginResponse.ok) {
            // Stocker le token dans le localStorage pour les requêtes futures
            localStorage.setItem('token', data.token);
            // Rediriger vers la page du dashboard
            window.location.href = 'dashboard.html';
        } else {
            // Afficher le message d'erreur de l'API
            messageDiv.textContent = `Erreur: ${data.message}`;
            messageDiv.classList.add('error');
        }
    } catch (error) {
        // Gérer les erreurs de réseau ou de serveur
        messageDiv.textContent = 'Erreur de connexion. Veuillez réessayer plus tard.';
        messageDiv.classList.add('error');
        console.error('Erreur:', error);
    }
});