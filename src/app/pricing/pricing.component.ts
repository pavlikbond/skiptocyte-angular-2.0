import { UserService } from '../services/user.service';
import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { first, map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
interface Item {
  name: string;
}

@Component({
  selector: 'app-tools',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss'],
})
export class PricingComponent implements OnInit {
  features = [
    { feature: 'Secure Account', free: true, paid: true },
    { feature: 'Mobile/Tablet compatible', free: true, paid: true },
    { feature: 'Unlimited Presets', free: true, paid: true },
    { feature: 'Customize notication sounds', free: false, paid: true },
    { feature: 'Additional settings', free: false, paid: true },
    { feature: 'Customize report', free: false, paid: true },
    { feature: 'Support further development', free: false, paid: true },
  ];

  constructor(
    public user: UserService,
    private db: AngularFirestore,
    private fns: AngularFireFunctions
  ) {}
  isLoading: boolean = false;
  ngOnInit(): void {}

  async sendToCheckout() {
    this.isLoading = true;
    await this.user.uid$
      .pipe(
        map((uid) => {
          // had to update firebase.firestore() to firebase.default.firestore() (from stripe firebase extension docs)
          return this.db
            .collection('users')
            .doc(uid)
            .collection('checkout_sessions')
            .add({
              price: 'price_1MK3flE0Hmbzt22hwJvInqE5', // todo price Id from your products price in the Stripe Dashboard
              success_url: window.location.href, // return user to this screen on successful purchase
              cancel_url: window.location.href, // return user to this screen on failed purchase
            })
            .then((docRef) => {
              // Wait for the checkoutSession to get attached by the extension
              docRef.onSnapshot(async (snap) => {
                const { error, sessionId } = snap.data();
                if (error) {
                  // Show an error to your customer and inspect
                  // your Cloud Function logs in the Firebase console.
                  alert(`An error occurred: ${error.message}`);
                  this.isLoading = false;
                }

                if (sessionId) {
                  // We have a session, let's redirect to Checkout
                  // Init Stripe
                  const stripe = await loadStripe(
                    'pk_test_51MJiPgE0Hmbzt22hbamIjCLtIpOjlMwoqPU2XKNeQAxS01vfGyI1zbyntave4ZS2oI9Z2yxfkoB8r48b7g2McyFA00yTjCZqRk' // todo enter your public stripe key here
                  );
                  console.log(`redirecting`);
                  await stripe.redirectToCheckout({ sessionId });
                  this.isLoading = false;
                }
              });
            });
        }),
        first() // prevent any memory leaks
      )
      .toPromise();
  }
  async sendToCustomerPortal() {
    this.isLoading = true;
    const callable = this.fns.httpsCallable(
      'ext-firestore-stripe-payments-createPortalLink'
    );
    callable({
      returnUrl: window.location.origin,
    }).subscribe((data) => {
      window.location.assign(data.url);
      this.isLoading = false;
    });
  }

  startTrial() {
    let trial = {
      status: 'trialing',
      startDate: new Date(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
    };
    this.db.collection(`users/${this.user.uid}/subscriptions`).add(trial);
  }
}
