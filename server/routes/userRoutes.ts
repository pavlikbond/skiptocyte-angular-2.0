import express from 'express';
import admin from 'firebase-admin'; // Import Firebase Admin from server.ts

// Create a router instance instead of a new express app
const router = express.Router();

// Define a route to fetch a user by user ID
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;
  console.log(userId);
  try {
    const userDoc = await admin
      .firestore()
      .collection('users')
      .doc(userId)
      .get();
    if (!userDoc.exists) {
      res.status(404).json({ error: 'User not found' });
    } else {
      const userData = userDoc.data();
      res.json(userData);
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//router which updates the user's trial status
router.put('/', async (req, res) => {
  console.log('trying to update trial status');

  const { userId } = req.body;
  //verify that user exists
  const user = await admin.auth().getUser(userId);
  if (!user) return res.status(404).send('User not found');

  try {
    const userDoc = await admin.firestore().collection('users').doc(userId);
    //get the data from the user's document and make sure they are not already trialing
    const userData = await userDoc.get();
    const data = userData.data();
    //if user has already tried the trail, they can't do it again
    if (data.subscription?.trialed) {
      let message = 'User has already trialed';
      console.log(message);
      return res.status(200).json({ message: message });
    }

    await userDoc.update({
      subscription: {
        status: 'trialing',
        trialed: true,
        trialStart: Date.now(),
        subId: null,
      },
    });
    let message = 'User trial status updated';
    console.log(message);
    return res.status(200).json({ message: message });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
