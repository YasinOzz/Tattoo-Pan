function initMap() {
  google.maps.importLibrary("maps").then(({ Map }) => {
    google.maps.importLibrary("marker").then(({ AdvancedMarkerElement }) => {
      const tattooShopLocation = { lat: 41.09407, lng: 29.09327 };

      const map = new Map(document.getElementById("map"), {
        zoom: 15,
        center: tattooShopLocation,
        mapId: "a0fc3dbf6e7a2b45",
      });

      new AdvancedMarkerElement({
        position: tattooShopLocation,
        map: map,
        title: "Tattoo Pan",
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const contactButton = document.querySelector(".contact");

  const mapContainer = document.getElementById("map-container");

  if (contactButton && mapContainer) {
    contactButton.addEventListener("click", (event) => {
      event.preventDefault();

      mapContainer.scrollIntoView({ behavior: "smooth" });
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const burgerMenu = document.querySelector(".iconamoon--menu-burger-horizontal");
  const closeMenu = document.querySelector(".icon-park-outline--close-one");
  const navLeft = document.getElementById("nav-left");
  const navRight = document.getElementById("nav-right");

  // Burger-Menü wird geklickt
  burgerMenu.addEventListener("click", function () {
    navLeft.classList.add("nav-links-visible");
    navRight.classList.add("nav-links-visible");
    closeMenu.classList.add("show-close");
    burgerMenu.style.display = "none"; // Burger verstecken
  });

  // Schließen-Menü wird geklickt
  closeMenu.addEventListener("click", function () {
    navLeft.classList.remove("nav-links-visible");
    navRight.classList.remove("nav-links-visible");
    closeMenu.classList.remove("show-close");
    burgerMenu.style.display = "block"; // Burger wieder anzeigen
  });
});
