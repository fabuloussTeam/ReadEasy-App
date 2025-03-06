document.getElementById('connexionForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Retrieve form data
    const courriel = document.getElementById('email').value;
    const motdepasse = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    // Display form data in the console
    console.log('Courriel:', courriel);
    console.log('Mot de passe:', motdepasse);
    console.log('Remember me:', remember);

    // Send form data to the server
    try {
        const response = await fetch('/api/connexion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ courriel, motdepasse })
        });

        if (response.ok) {
            location.href = '/';
        } else {
            const message = await response.json();
            if (message.erreur === 'mauvais_courriel') {
                document.getElementById('erreur-auth').innerText = 'Un compte avec ce courriel n\'existe pas.';
            } else if (message.erreur === 'mauvais_motdepasse') {
                document.getElementById('erreur-auth').innerText = 'Le mot de passe pour ce compte n\'est pas valide.';
            }
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Erreur lors de la connexion');
    }
});