const router = require("express").Router();

const auth = require("../middleware/auth.middleware");

const {
  createSubscription,
  listSubscriptions,
  cancelSubscription,
} = require("../controllers/subscription.controller");

// USER + ADMIN can call (role logic is handled in controller for list)
router.post("/", auth, createSubscription);
router.get("/", auth, listSubscriptions);
router.patch("/:id/cancel", auth, cancelSubscription);

module.exports = router;
