// frontend/scripts/dashboard.js
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const usersTableBody = document.getElementById('usersTableBody');
    const messageDiv = document.getElementById('message');
    const logoutBtn = document.getElementById('logoutBtn');

    // Rediriger si aucun token n'est trouvé
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Fonction pour récupérer les utilisateurs depuis JSONPlaceholder
    const fetchUsers = async () => {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users');

            if (response.ok) {
                const users = await response.json();
                displayUsers(users);
            } else {
                messageDiv.textContent = `Erreur: Impossible de charger les utilisateurs de l'API externe.`;
                messageDiv.classList.add('error');
            }
        } catch (error) {
            messageDiv.textContent = 'Erreur de connexion à l\'API externe.';
            messageDiv.classList.add('error');
            console.error('Erreur:', error);
        }
    };

    // frontend/scripts/dashboard.js

const displayUsers = (users) => {
    usersTableBody.innerHTML = '';
    users.forEach((user) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="user-info-cell">
                    <i class="fa-solid fa-user-circle"></i>
                    <div>
                        <strong>${user.name}</strong>
                        <small>${user.email}</small>
                    </div>
                </div>
            </td>
            <td>
                <span class="badge badge-user">Utilisateur</span>
            </td>
            <td>
                <div class="user-info-cell">
                    <i class="fa-regular fa-calendar-alt"></i>
                    <small>15/01/2024</small> </div>
            </td>
            <td>
                <div class="user-info-cell">
                    <i class="fa-solid fa-clock"></i>
                    <small>20/01/2024</small> </div>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="delete-btn" data-id="${user.id}">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </td>
        `;
        usersTableBody.appendChild(row);
    });
};

    // Gérer la déconnexion
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });

    // Appeler la fonction pour charger les utilisateurs au démarrage
    fetchUsers();
});
usersTableBody.addEventListener('click', async (e) => {
    if (e.target.closest('.delete-btn')) {
        const deleteBtn = e.target.closest('.delete-btn');
        const userId = deleteBtn.getAttribute('data-id');
        const isConfirmed = confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?');

        if (isConfirmed) {
            try {
                
                const row = deleteBtn.closest('tr');
                if (row) {
                    row.remove();
                    messageDiv.textContent = 'Utilisateur supprimé avec succès (simulé).';
                    messageDiv.classList.remove('error');
                    messageDiv.style.color = '#27ae60'; 
                    messageDiv.style.backgroundColor = '#27ae6022'; 
                }
            } catch (error) {
                messageDiv.textContent = 'Erreur lors de la suppression.';
                messageDiv.classList.add('error');
                console.error('Erreur:', error);
            }
        }
    }
});