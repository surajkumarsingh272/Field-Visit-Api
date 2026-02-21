require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const db = require("./db");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.post("/visits", async (req, res) => {
  try {
    const {
      farmerName,
      village,
      cropType,
      notes,
      imagePath,
      latitude,
      longitude,
      visitDate
    } = req.body;

    if (!farmerName || !village || !cropType || !visitDate) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const id = uuidv4();

    await db.query(
      `INSERT INTO visits 
      (id, farmer_name, village, crop_type, notes, image_path, latitude, longitude, visit_date) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        farmerName,
        village,
        cropType,
        notes || "",
        imagePath,
        latitude,
        longitude,
        visitDate
      ]
    );

    res.status(201).json({
      message: "Visit synced successfully",
      visitId: id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


app.get("/visits", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM visits ORDER BY visit_date DESC");
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});