document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Empêche le rechargement de la page

        // Récupération des valeurs des champs du formulaire
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Affichage des valeurs dans la console
        console.log('Nom:', name);
        console.log('Email:', email);
        console.log('Message:', message);

        // Simulation d'un message de confirmation
        alert('Votre message a été envoyé avec succès !');

        // Réinitialisation du formulaire
        contactForm.reset();
    });
});