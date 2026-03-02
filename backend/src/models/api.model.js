const mongoose = require("mongoose");

const apiSchema = new mongoose.Schema(
  {
    apiId: { type: String, required: true, unique: true, trim: true }, // e.g., "hip-orders"
    name: { type: String, required: true, trim: true },
    summaryId: { type: String, required: true, trim: true }, // e.g., "ORDERS"
    version: { type: String, default: "v1", trim: true },

    description: { type: String, default: "", trim: true },
    basePath: { type: String, default: "", trim: true }, // e.g., "/orders"
    tags: { type: [String], default: [] },

    metadata: { type: Object, default: {} },

    environment: {
      type: String,
      enum: ["DEV", "TEST", "PROD"],
      default: "DEV",
    },

    status: {
      type: String,
      enum: ["DRAFT", "ACTIVE", "REJECTED", "DELETED"],
      default: "DRAFT",
    },
    decisionBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    decisionAt: { type: Date, default: null },
    decisionReason: { type: String, default: "", trim: true },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Api", apiSchema);
