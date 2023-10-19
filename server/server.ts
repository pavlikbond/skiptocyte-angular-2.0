import admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';
const serviceAccount = require('./serviceAccountKey.json'); // Access to Firebase
const app = express();
import dotenv from 'dotenv';
const env = dotenv.config();

// Import userRoutes module
import userRoutes from './routes/userRoutes';
import stripeRoutes from './routes/stripeRoutes';
import stripeHooks from './hooks/stripeHooks';

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://skiptocyte.firebaseio.com',
});

app.use(cors());

// Use the userRoutes router for the '/user' endpoint
app.use('/api/stripehooks', stripeHooks);
app.use(express.json());
app.use('/api', userRoutes);
app.use('/api/checkout', stripeRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
