
const express = require("express");
const router = express.Router();

const Issue = require("../models/Issue");
const { auth, adminOnly } = require("../middleware/auth");
const upload = require("../middleware/upload");

// ==================================
// CREATE ISSUE WITH IMAGE
// ==================================
router.post("/", auth, (req, res, next) => {
  upload.single("image")(req, res, async (error) => {
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    console.log("Uploaded file:", req.file);
console.log("Form data:", req.body);

    try {
      const {
        title,
        description,
        category,
        location,
      } = req.body;

      const issue = new Issue({
        title,
        description,
        category,
        location: {
          apartment: location?.apartment,
          block: location?.block,
          floor: location?.floor,
          roomNumber: location?.roomNumber,
        },
        image: req.file
          ? `/uploads/${req.file.filename}`
          : "",
      });

      const savedIssue = await issue.save();

      res.status(201).json({
        success: true,
        message: "Issue reported successfully",
        issue: savedIssue,
      });
    } catch (error) {
      console.error("Create issue error:", error);

      res.status(400).json({
        success: false,
        message: "Failed to report issue",
        error: error.message,
      });
    }
  });
});

// ==================================
// GET ALL ISSUES
// ==================================
router.get("/", async (req, res) => {
  try {
    const issues = await Issue.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      issues,
    });
  } catch (error) {
    console.error("Get issues error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch issues",
    });
  }
});

// ==================================
// UPVOTE ISSUE - ONE VOTE PER USER
// ==================================
router.patch("/:id/upvote", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const updatedIssue = await Issue.findOneAndUpdate(
      {
        _id: req.params.id,
        upvotedBy: { $ne: userId },
      },
      {
        $addToSet: { upvotedBy: userId },
        $inc: { upvotes: 1 },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedIssue) {
      const issueExists = await Issue.exists({
        _id: req.params.id,
      });

      if (!issueExists) {
        return res.status(404).json({
          success: false,
          message: "Issue not found",
        });
      }

      return res.status(409).json({
        success: false,
        message: "You have already upvoted this issue",
      });
    }

    res.status(200).json({
      success: true,
      message: "Upvote successful",
      issue: updatedIssue,
    });
  } catch (error) {
    console.error("Upvote error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to upvote issue",
    });
  }
});

// ==================================
// UPDATE STATUS - ADMIN ONLY
// ==================================
router.patch("/:id/status", auth, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Reported",
      "Verified",
      "Assigned",
      "In Progress",
      "Resolved",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Issue status updated successfully",
      issue,
    });
  } catch (error) {
    console.error("Update status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update issue status",
    });
  }
});

module.exports = router;
