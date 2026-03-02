const router = require("express").Router();

const auth = require("../middleware/auth.middleware");
const User = require("../models/user.model"); // adjust path if your model name is different
const authorizeRoles = require("../middleware/role.middleware");
// ✅ GET /users/me (protected)
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// ✅ Example: ADMIN only route (to test roles)
router.get("/", auth, authorizeRoles("ADMIN"), async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.json({ users });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
module.exports = router;
