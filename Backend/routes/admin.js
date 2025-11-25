const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/admin");

const router = express.Router();

// -------- Admin Route Example --------
// Get all users (Admin only)
router.get("/users", auth, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Get my role (just to test)
router.get("/check", auth, (req, res) => {
  res.json({ role: req.user.role });
});

module.exports = router;
