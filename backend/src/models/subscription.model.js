const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    apiId: { type: String, required: true, trim: true }, // store apiId like "hip-orders"

   //  denormalized snapshot (copied from Api at request time)
apiName: { type: String, required: true, trim: true },
apiVersion: { type: String, required: true, trim: true },
environment: { type: String, required: true, trim: true },


    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    reason: { type: String, default: "", trim: true },

    status: {
      type: String,
      enum: ["PENDING", "ACTIVE", "REJECTED", "CANCELLED"],
      default: "PENDING",
    },

    decisionBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    decisionAt: { type: Date },
    decisionReason: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

// prevent duplicate active/pending subscription for same user+api
subscriptionSchema.index({ apiId: 1, requestedBy: 1 }, { unique: true });

module.exports = mongoose.model("Subscription", subscriptionSchema);
