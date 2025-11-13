const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client"))); // Serves your frontend files

// Path to data file
const dataFilePath = path.join(__dirname, "../data/data.json");

// Helper function to read and write data
function readData() {
  if (!fs.existsSync(dataFilePath)) return [];
  const file = fs.readFileSync(dataFilePath);
  return JSON.parse(file);
}

function writeData(newData) {
  fs.writeFileSync(dataFilePath, JSON.stringify(newData, null, 2));
}

// Route to handle form submissions
app.post("/api/submit", (req, res) => {
  const data = req.body;

  if (!data.teamNumber || !data.matchNumber || !data.score) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const currentData = readData();
  currentData.push({
    ...data,
    timestamp: new Date().toISOString(),
  });
  writeData(currentData);

  console.log("✅ Data received:", data);
  res.json({ message: "Data successfully saved!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
