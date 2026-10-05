const express = require("express");
const router = express.Router();

const Issue = require("../models/Issue");

// CREATE ISSUE
router.post("/", async (req, res) => {
    try {
        const issue = new Issue(req.body);

        const savedIssue = await issue.save();

        res.status(201).json({
            success: true,
            message: "Issue reported successfully",
            issue: savedIssue
        });

    } catch (error) {
        console.error("Create issue error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to report issue",
            error: error.message
        });
    }
});

// GET ALL ISSUES
router.get("/", async (req, res) => {
    try {
        const issues = await Issue.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            issues: issues
        });

    } catch (error) {
        console.error("Get issues error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch issues",
            error: error.message
        });
    }
});
/* UPVOTE AN ISSUE */
router.patch("/:id/upvote", async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    issue.upvotes = (issue.upvotes || 0) + 1;
    await issue.save();

    return res.status(200).json({
      success: true,
      issue,
    });
  } catch (error) {
    console.error("Upvote error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
module.exports = router;