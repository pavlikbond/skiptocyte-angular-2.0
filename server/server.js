const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const { connect } = require("@planetscale/database");
const serviceAccount = require("./serviceAccountKey.json"); //access to firebase
const env = require("dotenv").config();
const app = express();
app.use(cors());

const connection = connect({
  host: process.env["DATABASE_URL"],
  username: process.env["DATABASE_USERNAME"],
  password: process.env["DATABASE_PASSWORD"],
});

// Initialize Firebase
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
