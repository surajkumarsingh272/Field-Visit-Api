require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const db = require("./db");
const upload = require("./middlewares/upload");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 3000;


app.post("/visits", upload.single("image"), async (req, res) => {
  try {
    const {
      farmerName,
      village,
      cropType,
      notes,
      latitude,
      longitude,
      visitDate
    } = req.body;

    if (!farmerName || !village || !cropType || !visitDate) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const id = uuidv4();
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

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

    res.status(201).json({ message: "Visit uploaded successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


app.get("/visits", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM visits ORDER BY visit_date DESC"
    );


    const result = rows.map(row => ({...row,image_url: row.image_path? `${req.protocol}://${req.get("host")}${row.image_path}`: null
    }));

    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});