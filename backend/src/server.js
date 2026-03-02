require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5050;

async function startServer() {
  try {
    // 1️⃣ Connect to database first
    await connectDB();
    // 2️⃣ Start server only after DB is ready
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    // 3️⃣ If DB or server fails → stop everything
    console.error("❌ Server start failed:", err.message);
    process.exit(1);
  }
}

startServer();
