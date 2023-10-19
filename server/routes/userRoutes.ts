import express from 'express';
import admin from 'firebase-admin'; // Import Firebase Admin from server.ts
import { updateSubscriptionStatus } from '../utils/databaseUtils'; // Import the updateSubscriptionStatus function from databaseUtils.ts
// Create a router instance instead of a new express app
const router = express.Router();
//router which updates the user's trial status
router.put('/trial', async (req, res) => {
  console.log('trying to update trial status');

  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });
  //verify that user exists
  const user = await admin.auth().getUser(userId);
  if (!user) return res.status(404).send('User not found');

  try {
    console.log('userID', userId);
    const userDoc = await admin.firestore().collection('users').doc(userId);
    //get the data from the user's document and make sure they are not already trialing
    const userData = await userDoc.get();
    const data = userData.data();
    //if user has already tried the trail, they can't do it again
    if (data.subscription?.trialed) {
      let message = 'User has already trialed';
      console.log(message);
      return res.status(409).json({ message: message });
    }
    //throw new Error('User has not trialed yet');
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

router.put('/updateSubscriptionStatus', async (req, res) => {
  updateSubscriptionStatus(req.body)
    .then(() => {
      res.status(200).send({ message: 'Subscription status updated' });
    })
    .catch((error) => {
      console.error('Error updating subscription status:', error);
      res.status(500).send(error.message);
    });
});

export default router;
