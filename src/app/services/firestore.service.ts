import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Preset } from 'src/app/models/preset.model';
import { convertPresetsForDb } from '../models/preset-utils';
import { SnackbarService } from './snackbar.service';
import { Feature } from '../models/feature.model';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  features: BehaviorSubject<Feature[]> = new BehaviorSubject([
    { feature: 'Secure Account', free: true, premium: true },
    { feature: 'Mobile/Tablet compatible', free: true, premium: true },
    { feature: 'Unlimited Presets', free: true, premium: true },
    { feature: 'Customize notification sounds', free: false, premium: true },
    { feature: 'Customizable report', free: false, premium: true },
  ]);

  product: any = {
    name: 'Premium Plan',
    price: 4.99,
  };

  constructor(
    private db: AngularFirestore,
    private snackBar: SnackbarService
  ) {}
  getFeatures() {
    this.db
      .collection<Feature>('features')
      .get()
      .subscribe((querySnapshot) => {
        let features = querySnapshot.docs.map((doc) => doc.data() as Feature);
        //order features by feature.order
        features.sort((a, b) => a.order - b.order);
        this.features.next(features);
      });
  }

  getProduct() {
    //get product from 'products' db where name === 'premium'
    this.db
      .collection('products')
      .get()
      .subscribe((querySnapshot) => {
        let products = querySnapshot.docs.map((doc) => doc.data());
        this.product = products.find(
          (product: any) => product.name === 'Premium Plan'
        );
        console.log(this.product);
      });
  }
  async updatePresets(presets: Preset[], uid: string) {
    let dbPresets = convertPresetsForDb(presets);

    try {
      await this.db
        .doc(`users/${uid}`)
        .set({ presets: dbPresets }, { merge: true });
      console.log('Document successfully set or updated.');
      this.snackBar.openSnackBar('Presets saved successfully');
    } catch (error) {
      console.error('Error setting or updating document:', error);
      this.snackBar.openSnackBar('Error saving presets');
    }
  }

  async updateLocalStorage(presets: Preset[]) {
    let dbPresets = convertPresetsForDb(presets);
    localStorage.setItem('presets', JSON.stringify(dbPresets));
    this.snackBar.openSnackBar('Presets saved successfully');
  }
}
