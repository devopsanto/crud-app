const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "database-1.c9cm4o24iz64.ap-south-1.rds.amazonaws.com",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "918122756068",
  database: process.env.DB_NAME || "database-1",
});

// Connect DB
db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
    process.exit(1);
  }
  console.log("✅ MySQL Connected...");
});

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Create table
app.get("/createTable", (req, res) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    )
  `;

  db.query(sql, (err) => {
    if (err) {
      console.error("❌ Table create error:", err.message);
      return res.status(500).send("Error creating table");
    }
    res.send("✅ Items table created (or already exists).");
  });
});

// Insert item
app.post("/addItem", (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).send("❌ Name is required");
  }

  const sql = "INSERT INTO items (name) VALUES (?)";

  db.query(sql, [name], (err) => {
    if (err) {
      console.error("❌ Insert error:", err.message);
      return res.status(500).send("Error adding item");
    }
    res.send("✅ Item added successfully");
  });
});

// Get all items
app.get("/getItems", (req, res) => {
  const s
