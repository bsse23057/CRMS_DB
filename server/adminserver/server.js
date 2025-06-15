import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//  Correct path from server/adminserver/server.js to client/
const clientPath = path.join(__dirname, "..", "..", "client");

//  DEBUG print to confirm resolved path
console.log("Client base path:", clientPath);

// Static files
app.use("/css", express.static(path.join(clientPath, "css")));
app.use("/js", express.static(path.join(clientPath, "js")));
app.use("/pages", express.static(path.join(clientPath, "pages")));

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

//  Serve Admin Dashboard Page
app.get("/admin/police-officers", (req, res) => {
  const filePath = path.join(
    clientPath,
    "pages",
    "dashboard",
    "AdminDashboard",
    "policeOfficersAdmin.html"
  );

  console.log("Serving file from:", filePath); //  Useful to debug

  res.sendFile(filePath);
});
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

// API: Get officers
app.get("/api/officers", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM police_officer");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching officers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API: Add officer
app.post("/api/officers", async (req, res) => {
  const { fullName, badgeNumber, email, phoneNumber } = req.body;

  try {
    await db.query(
      "INSERT INTO police_officer (full_name, badge_number, email, phone_number, status) VALUES ($1, $2, $3, $4, $5)",
      [fullName, badgeNumber, email, phoneNumber, "Active"]
    );
    res.status(201).json({ message: "Officer added successfully" });
  } catch (error) {
    console.error("Error inserting officer:", error);
    res.status(500).json({ error: "Failed to add officer" });
  }
});

//  Serve Police Station Admin Page
app.get("/admin/police-stations", (req, res) => {
  const filePath = path.join(
    clientPath,
    "pages",
    "dashboard",
    "AdminDashboard",
    "policeStationAdmin.html"
  );

  console.log("Serving file from:", filePath);
  res.sendFile(filePath);
});

// API: Get all police stations
app.get("/api/stations", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT ps.id, ps.name, ps.location,
              COUNT(po.id) AS officers_count
         FROM police_station ps
    LEFT JOIN police_officer po ON po.station_id = ps.id
     GROUP BY ps.id`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching stations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API: Add new station
app.post("/api/stations", async (req, res) => {
  const { name, location } = req.body;
  if (!name || !location) {
    return res.status(400).json({ error: "Missing name or location" });
  }

  try {
    await db.query(
      "INSERT INTO police_station (name, location) VALUES ($1, $2)",
      [name, location]
    );
    res.status(201).json({ message: "Station added successfully" });
  } catch (error) {
    console.error("Error inserting station:", error);
    res.status(500).json({ error: "Failed to add station" });
  }
});

// Serve Reports Admin Page
app.get("/admin/reports", (req, res) => {
  const filePath = path.join(
    clientPath,
    "pages",
    "dashboard",
    "AdminDashboard",
    "reportsAdmin.html"
  );
  console.log("Serving reports page from:", filePath);
  res.sendFile(filePath);
});

app.get("/reports", (req, res) => {
  res.sendFile(
    path.join(
      clientPath,
      "pages",
      "dashboard",
      "AdminDashboard",
      "reportsAdmin.html"
    )
  );
});

// API: Get all reports (simplified)
app.get("/api/reports", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        report_id,
        full_name,
        incident_date,
        incident_location,
        crime_type,
        station_code,
        description
      FROM report
      ORDER BY incident_date DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({
      error: "Failed to fetch reports",
      details: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(` Server running at http://localhost:${port}`);
});
