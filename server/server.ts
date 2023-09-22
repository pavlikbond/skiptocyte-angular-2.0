const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const serviceAccount = require('./serviceAccountKey.json'); // Access to Firebase
const env = require('dotenv').config();
const app = express();

// Import userRoutes module
const userRoutes = require('./routes/userRoutes');

app.use(cors());

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://skiptocyte.firebaseio.com',
});

// Use the userRoutes router for the '/user' endpoint
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
