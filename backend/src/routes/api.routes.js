const router = require("express").Router();

const auth = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const {
  createApi,
  listApis,
  getApiByApiId,
  updateApiByApiId,
  deleteApiByApiId,
} = require("../controllers/api.controller");

// Create API (ADMIN)
router.post("/", auth, authorizeRoles("ADMIN"), createApi);

// List APIs (ADMIN sees all, USER sees ACTIVE only)
router.get("/", auth, listApis);

// Details
router.get("/:apiId", auth, getApiByApiId);

// Edit (ADMIN)
router.patch("/:apiId", auth, authorizeRoles("ADMIN"), updateApiByApiId);

// Soft delete (ADMIN)
router.delete("/:apiId", auth, authorizeRoles("ADMIN"), deleteApiByApiId);

module.exports = router;
