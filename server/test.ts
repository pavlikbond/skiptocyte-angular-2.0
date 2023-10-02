import admin from 'firebase-admin';
import dotenv from 'dotenv';
const env = dotenv.config();
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://skiptocyte.firebaseio.com',
});

const main = async () => {
  const stripeId = 'cus_OjcaPkCh1kFHlf';
  const user = await admin
    .firestore()
    .collection('users')
    .where('stripeId', '==', stripeId)
    .limit(1)
    .get();

  if (user.empty) return console.log('no user found');
  const userDoc = user.docs[0];
  userDoc.ref
    .update({
      'subscription.status': 'bippityboppity',
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
