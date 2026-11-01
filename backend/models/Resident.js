const mongoose = require("mongoose");

const residentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    society: {
      type: String,
      required: true,
      trim: true,
    },

    block: {
      type: String,
      required: true,
      trim: true,
    },

    flatNumber: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

residentSchema.index(
  { email: 1, society: 1, block: 1, flatNumber: 1 },
  { unique: true }
);

module.exports = mongoose.model("Resident", residentSchema);