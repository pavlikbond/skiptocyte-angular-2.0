var admin = require("firebase-admin");
const express = require("express");

var serviceAccount = require("./serviceAccountKey.json");
const app = express();
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://skiptocyte.firebaseio.com",
});
// Define a route to fetch a user by user ID
app.get("/api/user/:userId", async (req, res) => {
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
