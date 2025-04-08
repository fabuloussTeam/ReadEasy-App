document.addEventListener("DOMContentLoaded", () => {
  const menuItems = document.querySelectorAll(".sidebar .menu li");
  const sections = document.querySelectorAll(".profile-container-right > div");

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
});
