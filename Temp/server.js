const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3001;

const API_KEY = "AIzaSyCV6lBWLC0CNzxed1amshBg6C_Gp8lJ90A";
const PLACE_ID = "ChIJa2S9p-_LyhQR5-gfrizVZBU";

app.use(
  cors({
    origin: "*", // Alle Ursprünge zulassen
    methods: ["GET"], // Nur GET-Anfragen zulassen
    allowedHeaders: ["Content-Type"],
  })
);

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});

app.get("/api/reviews", async (req, res) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews&key=${API_KEY}`;
    const response = await axios.get(url);

    if (response.data.result && response.data.result.reviews) {
      res.json(response.data.result.reviews);
    } else {
      res.status(404).json({ error: "Keine Bewertungen gefunden" });
    }
  } catch (error) {
    console.error("Fehler beim Laden der Google-Bewertungen:", error);
    res.status(500).json({ error: "Fehler beim Laden der Bewertungen" });
  }
});
