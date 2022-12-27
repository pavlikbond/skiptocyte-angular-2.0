import * as functions from 'firebase-functions';
import { db } from './init';
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

exports.addIdToFirestore = functions.auth.user().onCreate((user) => {
  let uid = user.uid;
  db.doc(`users/${uid}`).set({});
});
