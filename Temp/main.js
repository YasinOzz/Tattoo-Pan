"use strict";

const token =
  "IGQWRPS1RBdWVCNU5HT0kyYmx4bXV6U2xMeXYxYkZAlVXRUTFdOSE5mM3pDenI5R2VxTHhoRGtUSnhlNWwxOWpILWU2OTExWndtVENRems2QS1kLUpCOU5ZARzBwOVJtaVdGTzNNMVh5cm80b2k5Wk9oODBwaE9vWUUZD";
const userId = "17841415972245589";
let nextPageUrl = `https://graph.instagram.com/${userId}/media?fields=id,media_type,media_url,permalink,media_product_type&access_token=${token}&limit=10`;

async function refreshAccessToken() {
  const refreshUrl = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`;

  try {
    const response = await fetch(refreshUrl);
    const data = await response.json();

    if (data.access_token) {
      console.log("Access Token erfolgreich verlängert:", data.access_token);

      // Aktualisiere den Token in der Variable
      nextPageUrl = `https://graph.instagram.com/${userId}/media?fields=id,media_type,media_url,permalink,media_product_type&access_token=${data.access_token}&limit=10`;
    } else if (data.error) {
      console.error("Fehler beim Verlängern des Access Tokens:", data.error.message);
    }
  } catch (error) {
    console.error("Fehler beim Abrufen des neuen Tokens:", error);
  }
}

async function fetchInstagramPhotos() {
  const loadMoreButton = document.getElementById("load-btn");
  loadMoreButton.classList.add("loading");

  try {
    const response = await fetch(nextPageUrl);
    const data = await response.json();

    if (data.error) {
      console.error("API-Fehler:", data.error.message);
      return;
    }

    const container = document.getElementById("instagram-feed");
    const postsHTML = data.data
      .filter(
        (post) =>
          post.media_type === "IMAGE" ||
          post.media_type === "CAROUSEL_ALBUM" ||
          (post.media_type === "VIDEO" && post.media_product_type === "REELS")
      )
      .map((post) => {
        const caption = post.caption || "Instagram post";

        if (post.media_type === "VIDEO" && post.media_product_type === "REELS") {
          return `
            <a href="${post.permalink}" target="_blank">
              <video id="instagram-video" src="${post.media_url}" alt="${caption}" controls muted loop></video>
            </a>
          `;
        }
        return `
          <a href="${post.permalink}" target="_blank">
            <img id="instagram-img" src="${post.media_url}" alt="${caption}" />
          </a>
        `;
      })
      .join("");

    container.innerHTML += postsHTML;

    nextPageUrl = data.paging.next || null;
    if (!nextPageUrl) {
      loadMoreButton.disabled = true;
      loadMoreButton.textContent = "Keine weiteren Bilder";
      setTimeout(() => (loadMoreButton.style.display = "none"), 3000);
    }
  } catch (error) {
    console.error("Fehler beim Laden der Instagram-Bilder:", error);
  } finally {
    loadMoreButton.classList.remove("loading");
  }
}

// Token automatisch verlängern
refreshAccessToken();

// Daten abrufen
fetchInstagramPhotos();

// Load more event
document.getElementById("load-btn").addEventListener("click", fetchInstagramPhotos);

async function fetchGoogleReviews() {
  try {
    const response = await fetch("http://localhost:3001/api/reviews");

    if (!response.ok) {
      throw new Error(`HTTP-Error: ${response.status}`);
    }

    const reviews = await response.json();

    if (Array.isArray(reviews)) {
      return reviews;
    } else {
      console.error("Die erhaltenen Daten sind kein Array:", reviews);
      return [];
    }
  } catch (error) {
    console.error("Fehler beim Laden der Google-Bewertungen:", error);
    return [];
  }
}

// Funktion zur Erstellung der Sternebewertung
function createStars(rating) {
  let stars = "";
  for (let i = 0; i < 5; i++) {
    stars += i < Math.round(rating) ? "★" : "☆";
  }
  return stars;
}

// Funktion zum Anzeigen der Bewertungen
async function displayReviews() {
  const reviews = await fetchGoogleReviews();
  const container = document.getElementById("review-container");

  if (reviews.length === 0) {
    container.innerHTML = "<p>Keine Bewertungen verfügbar.</p>";
    return;
  }

  reviews.forEach((review) => {
    const profilePhoto = review.profile_photo_url || "default-profile.png";
    const authorName = review.author_name || "Anonym";
    const truncatedText = review.text
      ? review.text.length > 132
        ? `${review.text.slice(0, 132)}...`
        : review.text
      : "Keine Bewertungstexte verfügbar.";
    const readMoreLink =
      review.text && review.text.length > 132 && review.author_url
        ? `<a href="${review.author_url}" target="_blank" class="read-more">Read more</a>`
        : "";

    const reviewCard = document.createElement("div");
    reviewCard.classList.add("review-card");

    reviewCard.innerHTML = `
      <img src="${profilePhoto}" alt="${authorName}" class="profile-pic">
      <h3>${authorName}</h3>
      <p class="stars">${createStars(review.rating)}</p>
      <p>${truncatedText}</p>
      ${readMoreLink}
    `;

    container.appendChild(reviewCard);
  });
}

// Starte das Anzeigen der Bewertungen
displayReviews();

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

window.initMap = initMap;

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
