const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const approvals = require("../controllers/approval.controller");

//  Subscriptions approvals
router.get("/subscriptions", auth, authorizeRoles("ADMIN"), approvals.listSubscriptionApprovals);
router.patch("/subscriptions/:id/approve", auth, authorizeRoles("ADMIN"), approvals.approveSubscription);
router.patch("/subscriptions/:id/reject", auth, authorizeRoles("ADMIN"), approvals.rejectSubscription);

// API approvals
router.get("/apis", auth, authorizeRoles("ADMIN"), approvals.listApiApprovals);
router.patch("/apis/:apiId/approve", auth, authorizeRoles("ADMIN"), approvals.approveApi);
router.patch("/apis/:apiId/reject", auth, authorizeRoles("ADMIN"), approvals.rejectApi);

module.exports = router;
