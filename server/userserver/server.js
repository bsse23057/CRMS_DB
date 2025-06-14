import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 5000;

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientPath = path.join(__dirname, "..", "..", "client");

console.log("Client base path:", clientPath);

// Static files
app.use("/css", express.static(path.join(clientPath, "css")));
app.use("/js", express.static(path.join(clientPath, "js")));
app.use("/pages", express.static(path.join(clientPath, "pages")));

// PostgreSQL
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "1234",
  port: 5432,
});

db.connect();

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Home page
app.get("/", (req, res) => {
  res.sendFile(
    path.join(clientPath, "pages", "dashboard", "UserDashboard", "firform.html")
  );
});

// API: Submit new FIR
app.post("/api/firs", async (req, res) => {
  const {
    fullName,
    cnic,
    phone,
    email,
    address,
    incidentDate,
    incidentTime,
    incidentLocation,
    crimeType,
    description,
    policeStation,
    witnesses,
    evidence,
    suspectInfo,
  } = req.body;

  try {
    await db.query(
      `INSERT INTO report (
        full_name, cnic, phone, email, address,
        incident_date, incident_time, incident_location,
        crime_type, description, station_code,
        witnesses, evidence, suspect_info
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
      [
        fullName,
        cnic,
        phone,
        email,
        address,
        incidentDate,
        incidentTime,
        incidentLocation,
        crimeType,
        description,
        policeStation,
        witnesses || null,
        evidence || null,
        suspectInfo || null,
      ]
    );

    res.status(201).json({ message: "FIR submitted successfully" });
  } catch (err) {
    console.error("FIR submission failed:", err);
    res.status(500).json({ error: "FIR submission failed" });
  }
});

// API: Get all FIRs
app.get("/api/firs", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM report ORDER BY report_id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching FIRs:", err);
    res.status(500).json({ error: "Failed to fetch FIRs" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
