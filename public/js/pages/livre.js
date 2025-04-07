document.addEventListener('DOMContentLoaded', () => {
    const readBookButton = document.getElementById('read-book-btn');
    if (readBookButton) {
        readBookButton.addEventListener('click', () => {
            showCenteredPrompt('Plus disponible! Telecharger directement pour lire. Merci');
        });
    }
});

function showCenteredPrompt(message) {
    // Create modal elements
    const modal = document.createElement('div');
    const modalContent = document.createElement('div');
    const closeButton = document.createElement('button');

    // Style modal
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';

    // Style modal content
    modalContent.style.backgroundColor = '#fff';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '8px';
    modalContent.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    modalContent.style.textAlign = 'center';

    // Add message
    modalContent.textContent = message;

    // Style close button
    closeButton.textContent = 'OK';
    closeButton.style.marginTop = '10px';
    closeButton.style.padding = '5px 10px';
    closeButton.style.border = 'none';
    closeButton.style.backgroundColor = '#007BFF';
    closeButton.style.color = '#fff';
    closeButton.style.borderRadius = '4px';
    closeButton.style.cursor = 'pointer';

    // Append elements
    modalContent.appendChild(closeButton);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Close modal on button click
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}
