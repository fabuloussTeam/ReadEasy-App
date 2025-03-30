document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.querySelector(".search-btn");
  const searchInput = document.querySelector(".search-input");
  const navbarToggler = document.querySelector(".navbar-toggler");
  const navbarNav = document.querySelector("#navbarNav");

  searchBtn.addEventListener("click", () => {
    searchInput.classList.toggle("active");
    searchInput.focus();
  });

  navbarToggler.addEventListener("click", () => {
    navbarNav.classList.toggle("show");
  });

  // hide nabbar when clicking outside of it
  document.addEventListener("click", (event) => {
    if (navbarNav.contains(event.target)  && navbarToggler.contains(event.target)) {
      navbarNav.classList.remove("show");
    }
  });

});

