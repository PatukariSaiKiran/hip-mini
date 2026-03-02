const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/users.routes");
const apiRoutes = require("./routes/api.routes");
const subscriptionRoutes = require("./routes/subscription.routes");
const approvalsRoutes = require("./routes/approvals.routes");
const app = express();

// ✅ middlewares
app.use(cors());
app.use(express.json());

// ✅ health route (test server)
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "HIP-MINI backend is running ✅" });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/apis", apiRoutes);
app.use("/subscriptions", subscriptionRoutes);
app.use("/approvals", approvalsRoutes);


module.exports = app;
