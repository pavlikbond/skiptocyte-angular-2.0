const express = require("express");
const cors = require("cors");
const { connect } = require("@planetscale/database");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes"); // Import userRoutes module

const app = express();
app.use(cors());

const connection = connect({
  host: process.env.DATABASE_URL,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
});

// Use the userRoutes for the "/api/user" route
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
