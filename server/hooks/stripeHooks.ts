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

    console.log('event', event);
    // Handle the event
    switch (event.type) {
      case 'customer.created':
        try {
          const db = admin.firestore();
          const customer = event.data?.object || {};
          const customerEmail = customer.email || 'test7@test.com';
          const customerId = customer.id;
          const { uid } = await admin.auth().getUserByEmail(customerEmail);
          const userRef = db.collection('users').doc(uid);
          await userRef.update({ stripeId: customerId, email: customerEmail });

          console.log('Document successfully updated!');
          return response.status(200).json({ received: true });
        } catch (error) {
          console.error('Error:', error);
          return response.status(500).json({ error: 'Internal server error' });
        }
        break;
      case 'customer.deleted':
        const customerDeleted = event.data.object;
        // Then define and call a function to handle the event customer.deleted
        break;
      case 'customer.updated':
        // Then define and call a function to handle the event customer.updated

        break;
      case 'customer.subscription.created':
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
          console.log(
            'customerSubscriptionDeleted',
            customerSubscriptionDeleted
          );
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
      case 'customer.subscription.updated':
        try {
          const customerSubscriptionUpdated = event.data.object;
          console.log(
            'customerSubscriptionUpdated',
            customerSubscriptionUpdated
          );
          let priceId = customerSubscriptionUpdated.items.data[0].price.id;
          // let pricings = await Pricing.find({});
          // let plan = pricings.find((pricing) => pricing.priceId === priceId)?.name || "Free";
          // await User.findOneAndUpdate({ stripeId: customerSubscriptionUpdated.customer }, { plan: plan }).then((user) => {
          //   console.log("user", user);
          // });
        } catch (error) {
          console.log(error);
        }
        response.status(200).json({ received: true });
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

export default router;
