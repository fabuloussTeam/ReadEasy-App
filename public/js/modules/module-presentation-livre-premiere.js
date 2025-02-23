document.addEventListener("DOMContentLoaded", function () {
  const image = document.querySelector(".image-section img");

  image.style.transition = "transform 0.2s ease-out";

  image.addEventListener("mouseover", function () {
    image.style.transform = "scale(1.1)";
    image.style.transformOrigin = "center";
  });

  image.addEventListener("mouseout", function () {
    image.style.transform = "scale(1)";
  });
});
