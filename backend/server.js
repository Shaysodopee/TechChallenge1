const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 8080;

// Enable CORS
app.use(cors());

// Response handler
const responseHandler = (req, res) => {
  res.json({
    message: "SUCCESS",
    guid: crypto.randomUUID()
  });
};

// Routes
app.get("/", responseHandler);
app.get("/health", responseHandler);

app.use("/api", responseHandler);

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
});