
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");
const issueRoutes = require("./routes/issueRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));

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
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
