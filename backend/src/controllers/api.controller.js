const Api = require("../models/api.model");

function toInt(v, fb) {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? fb : n;
}

//  POST /apis (ADMIN) -> creates DRAFT
exports.createApi = async (req, res) => {
  try {
    const {
      name,
      summaryId,
      version,
      description,
      basePath,
      tags,
      environment,
      metadata = {},
    } = req.body || {};

    if (!name || !summaryId || !environment) {
      return res.status(400).json({
        message: "name, summaryId, environment are required",
      });
    }
    const apiId = crypto.randomUUID()
    const doc = await Api.create({
      apiId,
      name: name.trim(),
      summaryId: summaryId.trim(),
      version: (version || "v1").trim(),
      description: description || "",
      basePath: basePath || "",
      tags: Array.isArray(tags) ? tags : [],
      environment: environment.trim(), // DEV/TEST/PROD
      metadata,
      status: "DRAFT",
      createdBy: req.user.userId,
      updatedBy: req.user.userId,
    });

    res.status(201).json({ message: "API created (DRAFT)", api: doc });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "apiId already exists" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//  GET /apis (ADMIN sees all, USER sees ACTIVE only)
// Supports: page, limit, search, status, env
exports.listApis = async (req, res) => {
  try {
    const page = Math.max(1, toInt(req.query.page, 1));
    const limit = Math.min(50, Math.max(1, toInt(req.query.limit, 10)));
    const skip = (page - 1) * limit;

    const search = (req.query.search || "").trim();
    const status = (req.query.status || "").trim();
    const env = (req.query.env || "").trim(); // global header can send ?env=DEV

    const filter = {};

    // USER should see only ACTIVE APIs
    if (req.user.role !== "ADMIN") {
      filter.status = "ACTIVE";
    } else {
      // ADMIN can filter by status if passed
      if (status && ["DRAFT", "ACTIVE", "REJECTED", "DELETED"].includes(status)) {
        filter.status = status;
      }
    }

    // env filter (optional)
    if (env && ["DEV", "TEST", "PROD"].includes(env)) {
      filter.environment = env;
    }

    // search across apiId, name, summaryId
    if (search) {
      const rx = new RegExp(search, "i");
      filter.$or = [{ apiId: rx }, { name: rx }, { summaryId: rx }];
    }

    const [items, total] = await Promise.all([
      Api.find(filter)
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

// ✅ GET /apis/:apiId
exports.getApiByApiId = async (req, res) => {
  try {
    const api = await Api.findOne({ apiId: req.params.apiId });
    if (!api) return res.status(404).json({ message: "API not found" });

    // USER can view only ACTIVE
    if (req.user.role !== "ADMIN" && api.status !== "ACTIVE") {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json({ api });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ PATCH /apis/:apiId (ADMIN)
// only editable fields
exports.updateApiByApiId = async (req, res) => {
  try {
    const api = await Api.findOne({ apiId: req.params.apiId });
    if (!api) return res.status(404).json({ message: "API not found" });

    // if DELETED do not allow editing
    if (api.status === "DELETED") {
      return res.status(400).json({ message: "Cannot edit a DELETED API" });
    }

    const allowed = ["name", "summaryId", "version", "description", "basePath", "tags", "environment", "metadata"];
    for (const key of allowed) {
      if (req.body[key] !== undefined) api[key] = req.body[key];
    }

    api.updatedBy = req.user.userId;

    await api.save();
    res.json({ message: "API updated", api });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ DELETE /apis/:apiId (ADMIN) -> soft delete
exports.deleteApiByApiId = async (req, res) => {
  try {
    const api = await Api.findOne({ apiId: req.params.apiId });
    if (!api) return res.status(404).json({ message: "API not found" });

    api.status = "DELETED";
    api.updatedBy = req.user.userId;
    await api.save();

    res.json({ message: "API deleted (soft)", api });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
