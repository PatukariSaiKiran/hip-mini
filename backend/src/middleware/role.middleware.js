module.exports = function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    // auth.middleware must already have set req.user
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    next();
  };
};
