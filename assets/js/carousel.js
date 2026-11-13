
document.addEventListener("DOMContentLoaded", function () {

  const carousel = document.querySelector(".home-carousel");
  if (!carousel) return;

  const track = carousel.querySelector(".carousel-track");
  const images = Array.from(
    track.querySelectorAll(":scope > .carousel-image")
  );

  const prev = carousel.querySelector(".carousel-prev");
  const next = carousel.querySelector(".carousel-next");
  const dotsContainer = carousel.querySelector(".carousel-dots");

  // Require exactly four original images
  if (images.length !== 4 || !prev || !next || !dotsContainer) {
    console.error("Carousel requires four images and navigation controls.");
    return;
  }

  const count = images.length;

  let position = 1;
  let locked = false;
  let autoplay = null;

  // Clone last and first images for seamless looping
  const lastClone = images[count - 1].cloneNode(true);
  const firstClone = images[0].cloneNode(true);

  lastClone.setAttribute("aria-hidden", "true");
  firstClone.setAttribute("aria-hidden", "true");

  track.insertBefore(lastClone, images[0]);
  track.appendChild(firstClone);

  // Create navigation dots
  dotsContainer.innerHTML = "";

  images.forEach((image, index) => {

    const dot = document.createElement("button");

    dot.type = "button";
    dot.setAttribute("aria-label", "Show image pair " + (index + 1));

    dot.addEventListener("click", function () {
      if (locked) return;

      position = index + 1;
      move(true);
      restartAutoplay();
    });

    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.children);

  // Calculate the width of one image
  function slideWidth() {
    return carousel.clientWidth / 2;
  }

  // Update carousel position
  function move(animate = true) {

    track.style.transition = animate
      ? "transform 0.7s ease-in-out"
      : "none";

    track.style.transform =
      "translateX(-" + (position * slideWidth()) + "px)";

    const activeDot = (position - 1 + count) % count;

    dots.forEach(dot => dot.classList.remove("active"));
    dots[activeDot].classList.add("active");
  }

  // Next and previous movement
  function advance(direction) {

    if (locked) return;

    locked = true;
    position += direction;

    move(true);
    restartAutoplay();
  }

  next.addEventListener("click", function () {
    advance(1);
  });

  prev.addEventListener("click", function () {
    advance(-1);
  });

  // Handle seamless looping
  track.addEventListener("transitionend", function (event) {

    if (event.target !== track ||
        event.propertyName !== "transform") return;

    if (position === 0) {
      position = count;
      move(false);
    }

    if (position === count + 1) {
      position = 1;
      move(false);
    }

    locked = false;
  });

  // Automatic rotation
  function startAutoplay() {

    clearInterval(autoplay);

    autoplay = setInterval(function () {
      advance(1);
    }, 4000);
  }

  function restartAutoplay() {
    startAutoplay();
  }

  carousel.addEventListener("mouseenter", function () {
    clearInterval(autoplay);
  });

  carousel.addEventListener("mouseleave", startAutoplay);

  // Reposition when window changes size
  window.addEventListener("resize", function () {
    move(false);
  });

  // Initial display
  move(false);
  startAutoplay();

});
