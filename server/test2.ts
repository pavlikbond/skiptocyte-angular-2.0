import admin from 'firebase-admin';
import dotenv from 'dotenv';
const env = dotenv.config();
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://skiptocyte.firebaseio.com',
});

const main = async () => {
  const db = admin.firestore();
  const systemCollection = db.collection('features');

  // Sample data for features
  const featuresData = [
    { feature: 'Secure Account', free: true, premium: true, order: 1 },
    {
      feature: 'Mobile/Tablet compatible',
      free: true,
      premium: true,
      order: 2,
    },
    { feature: 'Unlimited Presets', free: true, premium: true, order: 3 },
    {
      feature: 'Customize notification sounds',
      free: false,
      premium: true,
      order: 4,
    },
    { feature: 'Customizable report', free: false, premium: true, order: 5 },
  ];

  for (const feature of featuresData) {
    // Check if a document with the same feature name exists
    const querySnapshot = await systemCollection
      .where('feature', '==', feature.feature)
      .get();

    if (querySnapshot.empty) {
      // No document with the same feature name exists, so add a new document
      systemCollection
        .add(feature)
        .then((docRef) => {
          console.log('Document written with ID: ', docRef.id);
        })
        .catch((error) => {
          console.error('Error adding document: ', error);
        });
    } else {
      // A document with the same feature name already exists, so skip adding it.
      console.log(`Document with feature "${feature.feature}" already exists.`);
    }
  }
};

const main2 = async () => {
  const db = admin.firestore();
  const systemCollection = db.collection('products');

  let product = {
    productId: 'test',
    name: 'Premium',
    price: 4.99,
  };

  // No document with the same feature name exists, so add a new document
  systemCollection
    .add(product)
    .then((docRef) => {
      console.log('Document written with ID: ', docRef.id);
    })
    .catch((error) => {
      console.error('Error adding document: ', error);
    });
};

main();
