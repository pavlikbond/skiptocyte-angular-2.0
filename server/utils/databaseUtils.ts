import admin from 'firebase-admin';

export async function updateSubscriptionStatus(data) {
  const { userId, status } = data;
  //check if userId and status exist
  if (!userId) throw new Error('Missing userId');
  if (!status) throw new Error('Missing status');
  const db = admin.firestore();
  try {
    // Reference to the user document
    const userRef = db.collection('users').doc(userId);

    // Update the user's subscription status
    await userRef.update({
      'subscription.status': status,
    });

    console.log(`User ${userId} subscription status updated to ${status}`);
  } catch (error) {
    console.error('Error updating user subscription status:', error);
    throw error; // You can handle the error as needed in your routes
  }
}
