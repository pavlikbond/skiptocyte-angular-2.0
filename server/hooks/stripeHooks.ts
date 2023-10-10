import Stripe from 'stripe';
//grab the email from clerk session
import express from 'express';
import admin from 'firebase-admin';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-08-16',
});

// This is your Stripe CLI webhook secret for testing your endpoint locally.

router.post(
  '/',
  express.raw({ type: 'application/json' }),
  async (request, response) => {
    console.log('webhook activated');
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const sig = request.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      console.log('Error with Stripe signing', err.message);
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'customer.created':
        console.log('event', event);
        try {
          const db = admin.firestore();
          const customer = event.data?.object || {};
          const customerEmail = customer.email;
          const customerId = customer.id;
          const { uid } = await admin.auth().getUserByEmail(customerEmail);
          const userRef = db.collection('users').doc(uid);
          await userRef.update({ stripeId: customerId, email: customerEmail });

          console.log('Document successfully updated!');
          response.status(200).json({ received: true });
        } catch (error) {
          console.error('Error:', error);
          response.status(500).json({ error: 'Internal server error' });
        }
        break;
      case 'customer.subscription.created':
        console.log('event', event);
        try {
          const customerSubscriptionCreated = event.data.object;
          console.log(
            'customerSubscriptionCreated',
            customerSubscriptionCreated
          );
          let priceId = customerSubscriptionCreated.items.data[0].price.id;
          // let pricings = await Pricing.find({});
          //let plan = pricings.find((pricing) => pricing.priceId === priceId)?.name || "Free";
          // await User.findOneAndUpdate({ stripeId: customerSubscriptionCreated.customer }, { plan: plan }).then((user) => {
          //   console.log("user", user);
          // });
        } catch (error) {
          console.log(error);
        }
        response.status(200).json({ received: true });
        break;
      case 'customer.subscription.deleted':
        try {
          const customerSubscriptionDeleted = event.data.object;
          // console.log(
          //   'customerSubscriptionDeleted',
          //   customerSubscriptionDeleted
          // );
          console.log(customerSubscriptionDeleted.items.data[0]);

          //let priceId = customerSubscriptionDeleted.items.data[0].price.id;
          // let pricing = await Pricing.findOne({ name: "main" });
          // let plan = pricing.tier2.priceId === priceId ? "Basic" : pricing.tier3.priceId === priceId ? "Pro" : "Free";
          // await User.findOneAndUpdate({ stripeId: customerSubscriptionDeleted.customer }, { plan: "Free" }).then(
          //   (user) => {
          //     console.log("user", user);
          //   }
          // );
        } catch (error) {
          console.log(error);
        }
        response.status(200).json({ received: true });

        // Then define and call a function to handle the event customer.subscription.deleted
        break;
      case 'customer.subscription.paused':
        const customerSubscriptionPaused = event.data.object;
        // Then define and call a function to handle the event customer.subscription.paused
        break;
      case 'customer.subscription.resumed':
        const customerSubscriptionResumed = event.data.object;
        // Then define and call a function to handle the event customer.subscription.resumed
        break;
      case 'invoice.paid':
        try {
          console.log('event', event);
          const invoicePaid = event.data.object;
          console.log('invoicePaid', invoicePaid);
          const stripeId = invoicePaid.customer;
          //find the customer in firebase
          let userQuerySnapshot = await admin
            .firestore()
            .collection('users')
            .where('stripeId', '==', stripeId)
            .limit(1)
            .get();

          if (userQuerySnapshot.empty) {
            //try to look up the firestore user by email
            let email = invoicePaid.customer_email;
            try {
              userQuerySnapshot = await admin
                .firestore()
                .collection('users')
                .where('email', '==', email)
                .limit(1)
                .get();
            } catch (error) {
              return response
                .status(500)
                .json({ error: 'Internal server error' });
            }
            if (userQuerySnapshot.empty) {
              console.log('No matching documents.');
              return response
                .status(500)
                .json({ error: 'Internal server error' });
            }
          }

          const userDoc = userQuerySnapshot.docs[0];
          await userDoc.ref.update({
            'subscription.status': 'active',
            'subscription.subId': invoicePaid.subscription,
            'subscription.start': Date.now(),
          });
          console.log('Subscription status updated successfully.');
        } catch (error) {
          console.error('Error updating subscription status:', error);
          return response.status(500).json({ error: 'Internal server error' });
        }
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

export default router;
