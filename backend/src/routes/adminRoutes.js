const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/test",
  authenticateToken,
  requireRole("ADMIN"),
  (req, res) => {
    res.json({
      message: "Admin access granted"
    });
  }
);

module.exports = router;