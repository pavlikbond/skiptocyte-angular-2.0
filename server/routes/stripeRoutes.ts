import Stripe from 'stripe';
//grab the email from clerk session
const express = require('express');
const admin = require('firebase-admin'); // Import Firebase Admin from server.ts
// Create a router instance instead of a new express app
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-08-16',
});

router.post('/', async (req, res) => {
  console.log('trying to checkout');

  const { userId, cancelURL, successURL } = req.body;
  const user = await admin.auth().getUser(userId);
  if (!user) return res.status(404).send('User not found');
  const { email } = user;
  //check the user's document to see if their email is already in the database, add if not there
  const userDoc = await admin.firestore().collection('users').doc(userId);
  const userData = await userDoc.get();
  const data = userData.data();
  if (!data.email) {
    await userDoc.update({
      email: email,
    });
  }

  try {
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: 'price_1MK3flE0Hmbzt22hwJvInqE5',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successURL || 'https://skiptocyte.com/differential',
      cancel_url: cancelURL || 'https://skiptocyte.com/pricing',
      customer_email: email,
      phone_number_collection: {
        enabled: false,
      },
    });
    res.status(200).json(session);
  } catch (err) {
    console.log('error');

    res.status(err.statusCode || 500).json(err.message);
  }
});
export default router;
