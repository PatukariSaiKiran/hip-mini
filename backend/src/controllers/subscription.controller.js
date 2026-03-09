const Subscription = require("../models/subscription.model");
const Api = require("../models/api.model");

function toInt(v, fb) {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? fb : n;
}

//  POST /subscriptions (USER creates request)
exports.createSubscription = async (req, res) => {
  try {
    const { apiId, reason } = req.body || {};

    if (!apiId) return res.status(400).json({ message: "apiId is required" });

    // Only allow subscription to ACTIVE APIs (HIP behavior)
    const api = await Api.findOne({ apiId: apiId.trim(), status: "ACTIVE" });
    if (!api) {
      return res.status(400).json({ message: "API not found or not ACTIVE" });
    }

    const doc = await Subscription.create({
        apiId: api.apiId,                 // keep business id
        apiName: api.name,                // copy from Api
        apiVersion: api.version || "v1",  // copy from Api
        environment: api.environment,     // copy from Api
      
      requestedBy: req.user.userId,
      reason: reason || "",
      status: "PENDING",
    });

    return res.status(201).json({ message: "Subscription requested (PENDING)", subscription: doc });
  } catch (err) {
    // duplicate request
    if (err.code === 11000) {
      return res.status(409).json({ message: "Subscription already exists for this API" });
    }
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /subscriptions
// USER -> only their subscriptions
// ADMIN -> all subscriptions
exports.listSubscriptions = async (req, res) => {
    try {
      const page = Math.max(1, toInt(req.query.page, 1));
      const limit = Math.min(50, Math.max(1, toInt(req.query.limit, 10)));
      const skip = (page - 1) * limit;
  
      const status = (req.query.status || "").trim();
      const search = (req.query.search || "").trim();
      const env = (req.query.env || "").trim(); // from header env dropdown
  
      const filter = {};
  
      // role logic: USER sees only their subs
      if (req.user.role !== "ADMIN") {
        filter.requestedBy = req.user.userId;
      }
  
      // status filter
      if (status && ["PENDING", "ACTIVE", "REJECTED", "CANCELLED"].includes(status)) {
        filter.status = status;
      }
  
      // env filter (since we stored it in subscription denormalized)
      if (env && ["DEV", "TEST", "PROD"].includes(env)) {
        filter.environment = env;
      }
  
      // search across apiId + apiName
      if (search) {
        const rx = new RegExp(search, "i");
        filter.$or = [{ apiId: rx }, { apiName: rx }];
      }
  
      const [items, total] = await Promise.all([
        Subscription.find(filter)
          .populate("requestedBy", "name email role")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Subscription.countDocuments(filter),
      ]);
  
      res.json({
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        items,
      });
    } catch (err) {
      return res.status(500).json({ message: "Server error", error: err.message });
    }
  };
  

//  PATCH /subscriptions/:id/cancel (USER cancels only their PENDING)
exports.cancelSubscription = async (req, res) => {
  try {
    const sub = await Subscription.findById(req.params.id);
    if (!sub) return res.status(404).json({ message: "Subscription not found" });

    // only owner can cancel (unless admin - but keep simple)
    if (req.user.role !== "ADMIN" && String(sub.requestedBy) !== String(req.user.userId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (sub.status !== "PENDING") {
      return res.status(400).json({ message: "Only PENDING subscriptions can be cancelled" });
    }

    sub.status = "CANCELLED";
    await sub.save();

    res.json({ message: "Subscription cancelled", subscription: sub });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
