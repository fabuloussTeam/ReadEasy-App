// Récupérer les éléments du formulaire
const form = document.querySelector('.user-profile-form');

// Récupérer les champs du formulaire
const idUtilisateurInput = document.getElementById('id_utilisateur');
const firstNameInput = document.getElementById('first-name');
const lastNameInput = document.getElementById('last-name');
const emailInput = document.getElementById('email');
const accesSelect = document.getElementById('acces');

// Préparer les données utilisateur
function prepareDonneeUtilisateur() {
    const id_utilisateur = idUtilisateurInput.value;
    const nom = firstNameInput.value;
    const prenom = lastNameInput.value;
    const courriel = emailInput.value;
    const acces = accesSelect.value;

    return {
        id_utilisateur: id_utilisateur,
        nom: nom,
        prenom: prenom,
        courriel: courriel,
        acces: acces
    };
}

document.addEventListener('DOMContentLoaded', function () {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Préparer les données
        const data = prepareDonneeUtilisateur();
        const id_utilisateur = parseInt(data.id_utilisateur);
        const acces =  parseInt(data.acces);

        try {
            const response = await fetch(`/api/utilisateur/${id_utilisateur}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                     id_utilisateur,
                     acces,
                })
            });

            // Vérifier la réponse du serveur
            if (response.ok) {
                alert('Profil mis à jour avec succès.');
             location.reload(); // Recharger la page pour afficher les nouvelles données
            } else {
                const errorData = await response.json();
                alert(`Erreur: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur est survenue lors de la mise à jour du profil.');
        }
    });
});