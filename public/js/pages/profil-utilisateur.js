document.addEventListener("DOMContentLoaded", () => {
  const menuItems = document.querySelectorAll(".sidebar .menu li");
  const sections = document.querySelectorAll(".profile-container-right > div");
  const boutonsDelete = document.querySelectorAll(".supprimer-btn");

  menuItems[0].classList.add("active");
  sections.forEach((section) => {
    if (section.classList.contains("profile-content")) {
      section.style.display = "block"; // Change to "block" to show
    } else {
      section.style.display = "none"; // Change to "none" to hide
    }
  });

  menuItems.forEach((item) => {
    // console.log(item.classList);

    item.addEventListener("click", () => {
      // Remove active class from all menu items
      menuItems.forEach((menuItem) => menuItem.classList.remove("active"));
      // Hide all sections
      sections.forEach((section) => {
        section.style.display = "none";
      }); // Change to "none" to hide

      // Add active class to the clicked menu item
      item.classList.add("active");

      // Show the corresponding section based on the clicked menu item
      if (
        sections[0].classList.contains("profile-content") ==
        item.classList.contains("profile-content")
      ) {
        sections[0].style.display = "block";
        sections[1].style.display = "none";
        sections[2].style.display = "none";
        sections[3].style.display = "none"; 
        sections[4].style.display = "none"; 
        sections[5].style.display = "none";
      }

      if (
        sections[1].classList.contains("mes-publications") ==
        item.classList.contains("mes-publications")
      ) {
        sections[1].style.display = "block";
        sections[0].style.display = "none";
        sections[2].style.display = "none";
        sections[3].style.display = "none"; 
        sections[4].style.display = "none"; 
        sections[5].style.display = "none";

      }

      if (
        sections[2].classList.contains("mes-reservations-paiement") ==
        item.classList.contains("mes-reservations-paiement")
      ) {
        sections[0].style.display = "none";
        sections[1].style.display = "none";
        sections[2].style.display = "block";
        sections[3].style.display = "none"; 
        sections[4].style.display = "none"; 
        sections[5].style.display = "none";

      }
      
      if (
        sections[3].classList.contains("statistiques") ==
        item.classList.contains("statistiques")
      ) {
        sections[3].style.display = "block"; 
        sections[2].style.display = "none"; 
        sections[1].style.display = "none"; 
        sections[0].style.display = "none";
        sections[4].style.display = "none"; 
        sections[5].style.display = "none";

      }
 
       
      if (
        sections[4].classList.contains("mots-de-passe") ==
        item.classList.contains("mots-de-passe")
      ) {
        sections[5].style.display = "none";
        sections[4].style.display = "block"; 
        sections[3].style.display = "none"; 
        sections[2].style.display = "none"; 
        sections[1].style.display = "none";
        sections[0].style.display = "none";
      }

      if (
        sections[5].classList.contains("param-admin") ==
        item.classList.contains("param-admin")
      ) {
        sections[5].style.display = "block"; 
        sections[4].style.display = "none"; 
        sections[3].style.display = "none"; 
        sections[2].style.display = "none"; 
        sections[1].style.display = "none";
        sections[0].style.display = "none";
      }
      
    });
  });

  // Initialize the first section as visible
  const firstSection = sections[0];
  if (firstSection) {
    firstSection.style.display = "block"; // Change to "block" to show
  }

  /**
   * 
   *  supprimer un livre:  <!-- Mes publications section -->
   */
  async function deleteLivreServeur(event) {
    // Bouton 
    const bouton = event.currentTarget;
    event.preventDefault();

    // Préparer les données
    const id_livre = parseInt(bouton.dataset.id);

    console.log({ id_livre });
    
    try {
      // Envoyer les données au serveur
      const response = await fetch(`/api/livre/${id_livre}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      // Redirection à la page d'accueil si tout a bien fonctionné
      if (response.ok) {
        console.log("Book deleted");
        bouton.closest(".publication-item").remove();
      } else {
        const errorData = await response.json();
        console.error(`Failed to delete book: ${errorData.error}`);
        alert(`Erreur: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Une erreur est survenue lors de la suppression du livre.");
    }
  }

  for (let bouton of boutonsDelete) {
      bouton.addEventListener('click', deleteLivreServeur);
  }

  /** 
   * Suppression d'un utilisateur
   * <!-- Paramètres administratifs section -->
   */

  
  async function deleteUserServeur(event) {
    // Bouton 
    const bouton = event.currentTarget;
    event.preventDefault();

    // Préparer les données
    const id_user = parseInt(bouton.dataset.id);

    console.log({ id_user });
    
    try {
      // Envoyer les données au serveur
      const response = await fetch(`/api/utilisateur/${id_user}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      // Redirection à la page d'accueil si tout a bien fonctionné
      if (response.ok) {
        console.log("User deleted");
        bouton.closest(".user-item").remove();
      } else {
        const errorData = await response.json();
        console.error(`Failed to delete user: ${errorData.error}`);
        alert(`Erreur: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Une erreur est survenue lors de la suppression de l'utilisateur.");
    }
  }
  for (let bouton of boutonsDelete) {
      bouton.addEventListener('click', deleteUserServeur);
  }


});

