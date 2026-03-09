const Subscription = require("../models/subscription.model");
const Api = require("../models/api.model");

function toInt(v, fb) {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? fb : n;
}

// SUBSCRIPTIONS APPROVALS


// GET /approvals/subscriptions?status=ALL&page=1&limit=10&search=&env=
exports.listSubscriptionApprovals = async (req, res) => {
  try {
    const page = Math.max(1, toInt(req.query.page, 1));
    const limit = Math.min(50, Math.max(1, toInt(req.query.limit, 10)));
    const skip = (page - 1) * limit;

    const status = (req.query.status || "PENDING").trim();
    const search = (req.query.search || "").trim();
    const env = (req.query.env || "").trim();

    const filter = {};

    // status=ALL => no filter
    if (status !== "ALL" && ["PENDING", "ACTIVE", "REJECTED", "CANCELLED"].includes(status)) {
      filter.status = status;
    }

    if (env && ["DEV", "TEST", "PROD"].includes(env)) {
      filter.environment = env;
    }

    if (search) {
      const rx = new RegExp(search, "i");
      filter.$or = [{ apiId: rx }, { apiName: rx }];
    }

    const [items, total] = await Promise.all([
      Subscription.find(filter)
        .populate("requestedBy", "name email role")
        .populate("decisionBy", "name email role")
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
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PATCH /approvals/subscriptions/:id/approve
exports.approveSubscription = async (req, res) => {
  try {
    const sub = await Subscription.findById(req.params.id);
    if (!sub) return res.status(404).json({ message: "Subscription not found" });

    if (sub.status !== "PENDING") {
      return res.status(400).json({ message: "Only PENDING can be approved" });
    }

    sub.status = "ACTIVE";
    sub.decisionBy = req.user.userId;
    sub.decisionAt = new Date();
    sub.decisionReason = req.body?.decisionReason || "";

    await sub.save();

    res.json({ message: "Subscription approved", subscription: sub });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PATCH /approvals/subscriptions/:id/reject
exports.rejectSubscription = async (req, res) => {
  try {
    const sub = await Subscription.findById(req.params.id);
    if (!sub) return res.status(404).json({ message: "Subscription not found" });

    if (sub.status !== "PENDING") {
      return res.status(400).json({ message: "Only PENDING can be rejected" });
    }

    sub.status = "REJECTED";
    sub.decisionBy = req.user.userId;
    sub.decisionAt = new Date();
    sub.decisionReason = req.body?.decisionReason || "Rejected by admin";

    await sub.save();

    res.json({ message: "Subscription rejected", subscription: sub });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =========================
// API APPROVALS
// =========================

// GET /approvals/apis?status=ALL&page=1&limit=10&search=&env=
exports.listApiApprovals = async (req, res) => {
  try {
    const page = Math.max(1, toInt(req.query.page, 1));
    const limit = Math.min(50, Math.max(1, toInt(req.query.limit, 10)));
    const skip = (page - 1) * limit;

    const status = (req.query.status || "DRAFT").trim();
    const search = (req.query.search || "").trim();
    const env = (req.query.env || "").trim();

    const filter = {};

    // status=ALL => no filter
    if (status !== "ALL" && ["DRAFT", "ACTIVE", "REJECTED", "DELETED"].includes(status)) {
      filter.status = status;
    }

    if (env && ["DEV", "TEST", "PROD"].includes(env)) {
      filter.environment = env;
    }

    if (search) {
      const rx = new RegExp(search, "i");
      filter.$or = [{ apiId: rx }, { name: rx }, { summaryId: rx }];
    }

    const [items, total] = await Promise.all([
      Api.find(filter)
        .populate("createdBy", "name email role")
        .populate("updatedBy", "name email role")
        .populate("decisionBy", "name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Api.countDocuments(filter),
    ]);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      items,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PATCH /approvals/apis/:apiId/approve
exports.approveApi = async (req, res) => {
  try {
    const api = await Api.findOne({ apiId: req.params.apiId });
    if (!api) return res.status(404).json({ message: "API not found" });

    if (api.status !== "DRAFT") {
      return res.status(400).json({ message: "Only DRAFT APIs can be approved" });
    }

    api.status = "ACTIVE";
    api.updatedBy = req.user.userId;

    // governance tracking
    api.decisionBy = req.user.userId;
    api.decisionAt = new Date();
    api.decisionReason = req.body?.decisionReason || "";

    await api.save();

    res.json({ message: "API approved (ACTIVE)", api });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PATCH /approvals/apis/:apiId/reject
exports.rejectApi = async (req, res) => {
  try {
    const api = await Api.findOne({ apiId: req.params.apiId });
    if (!api) return res.status(404).json({ message: "API not found" });

    if (api.status !== "DRAFT") {
      return res.status(400).json({ message: "Only DRAFT APIs can be rejected" });
    }

    api.status = "REJECTED";
    api.updatedBy = req.user.userId;

    //  governance tracking
    api.decisionBy = req.user.userId;
    api.decisionAt = new Date();
    api.decisionReason = req.body?.decisionReason || "Rejected by admin";

    await api.save();

    res.json({ message: "API rejected", api });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
