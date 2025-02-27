
document.addEventListener('DOMContentLoaded', () => {
    const supprimerBtns = document.querySelectorAll('.supprimer-btn');

    supprimerBtns.forEach(btn => {
        btn.addEventListener('click', (event) => {
            event.preventDefault();
            const confirmed = confirm('Are you sure you want to delete this book?');
            if (confirmed) {
                // Perform the delete action here
                console.log('Book deleted');
            }
        });
    });
});

alert('module-livre-a-laune+++');
