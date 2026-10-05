const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Streetlight",
        "Water Leak",
        "Pothole",
        "Garbage",
        "Electrical",
        "Other",
      ],
    },
    upvotes: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: [
        "Reported",
        "Verified",
        "Assigned",
        "In Progress",
        "Resolved",
      ],
      default: "Reported",
    },

    location: {
      apartment: {
        type: String,
        required: true,
        trim: true,
      },

      block: {
        type: String,
        required: true,
        trim: true,
      },

      floor: {
        type: Number,
        required: true,
        min: 0,
      },

      roomNumber: {
        type: String,
        required: true,
        trim: true,
      },
    },

    image: {
      type: String,
      default: "",
    },

    upvotes: {
      type: Number,
      default: 0,
    },

    comments: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Issue", issueSchema);