const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const issueRoutes = require("./routes/issueRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
connectDB();

// Home route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "FixNest API is running 🚀"
    });
});

// Issue routes
app.use("/api/issues", issueRoutes);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});