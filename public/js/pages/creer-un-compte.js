document.getElementById('form-creer-un-compte').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Retrieve form data
    const nom = document.getElementById('nom').value;
    const prenom = document.getElementById('prenom').value;
    const courriel = document.getElementById('courriel').value;
    const mot_de_passe = document.getElementById('mot_de_passe').value;

    // Send form data to the server
    try {
        const response = await fetch('/api/utilisateur', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nom, prenom, courriel, mot_de_passe })
        })
        if (response.ok) {
            location.href = '/connexion';
        } else {
            const errorData = await response.json();
            alert(`Erreur: ${errorData.error}`);
           
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Erreur lors de la création du compte');
    }
   
    
});