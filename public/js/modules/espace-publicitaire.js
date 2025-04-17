document.addEventListener("DOMContentLoaded", () => {
    const joinButton = document.getElementById("joinButton");

    if (joinButton) {
        joinButton.addEventListener("click", () => {
            alert("Bientôt disponible");
        });
    }
});