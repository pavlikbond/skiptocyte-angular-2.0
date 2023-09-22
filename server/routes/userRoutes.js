const express = require("express");
const admin = require("firebase-admin"); // Import Firebase Admin from server.ts

// Create a router instance instead of a new express app
const router = express.Router();

// Define a route to fetch a user by user ID
router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  console.log(userId);
  try {
    const userDoc = await admin
      .firestore()
      .collection("users")
      .doc(userId)
      .get();
    if (!userDoc.exists) {
      res.status(404).json({ error: "User not found" });
    } else {
      const userData = userDoc.data();
      res.json(userData);
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
