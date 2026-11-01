const express = require("express");
const Resident = require("../models/Resident");
const {
  verifyToken,
  verifyAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();

// ADD RESIDENT TO OFFICIAL LIST
router.post(
  "/residents",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      society,
      block,
      flatNumber,
    } = req.body;

    if (!name || !email || !society || !block || !flatNumber) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required resident details",
      });
    }

    const existingResident = await Resident.findOne({
      email: email.trim().toLowerCase(),
      society: society.trim(),
      block: block.trim(),
      flatNumber: flatNumber.trim(),
    });

    if (existingResident) {
      return res.status(409).json({
        success: false,
        message: "Resident already exists in the official list",
      });
    }

    const resident = await Resident.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone,
      society: society.trim(),
      block: block.trim(),
      flatNumber: flatNumber.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Resident added to official list",
      resident,
    });
  } catch (error) {
    console.error("Add resident error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not add resident",
    });
  }
});
// GET ALL OFFICIAL RESIDENTS
router.get("/residents", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const residents = await Resident.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: residents.length,
      residents,
    });
  } catch (error) {
    console.error("Fetch residents error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not fetch residents",
    });
  }
});
// DELETE RESIDENT FROM OFFICIAL LIST
router.delete("/residents/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const resident = await Resident.findByIdAndDelete(req.params.id);

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: "Resident not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resident removed from official list",
    });
  } catch (error) {
    console.error("Delete resident error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not remove resident",
    });
  }
});
module.exports = router;