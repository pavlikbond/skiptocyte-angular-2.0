import admin from 'firebase-admin';
import dotenv from 'dotenv';
const env = dotenv.config();
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://skiptocyte.firebaseio.com',
});

const main = async () => {
  var currentDate = new Date();
  var daysAgo = 30;

  // Convert days to milliseconds (1 day = 24 hours = 24 * 60 * 60 * 1000 milliseconds)
  var millisecondsAgo = daysAgo * 24 * 60 * 60 * 1000;
  millisecondsAgo -= 1000 * 60;
  // Subtract the milliseconds from the current date
  currentDate.setTime(currentDate.getTime() - millisecondsAgo);
  const stripeId = 'test@test.com';
  const user = await admin
    .firestore()
    .collection('users')
    .where('email', '==', stripeId)
    .limit(1)
    .get();

  if (user.empty) return console.log('no user found');
  const userDoc = user.docs[0];
  userDoc.ref
    .update({
      'subscription.status': 'trialing',
      'subscription.trialStart': currentDate.getTime(),
      'subscription.trialed': true,
      'subscription.subId': null,
    })
    .then(() => {
      console.log('Subscription status updated successfully.');
    })
    .catch((error) => {
      console.error('Error updating subscription status:', error);
    });

  //console.log();
};

main();
