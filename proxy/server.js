const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
  }),
);

app.get("/api/stations", async (req, res) => {
  try {
    const response = await fetch(
      "https://www.ncei.noaa.gov/cdo-web/api/v2/stations",
      {
        headers: {
          token: process.env.NOAA_API_TOKEN,
        },
      },
    );

    if (!response.ok) {
      return res.status(response.status).json({
        message: "NOAA API request failed",
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
