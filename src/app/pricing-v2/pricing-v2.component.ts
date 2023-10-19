import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FirestoreService } from '../services/firestore.service';
import { Feature } from '../models/feature.model';
@Component({
  selector: 'app-pricing-v2',
  templateUrl: './pricing-v2.component.html',
})
export class PricingV2Component implements OnInit {
  freeFeatures: Feature[];
  premiumFeatures: Feature[];
  constructor(
    public userService: UserService,
    public fireStore: FirestoreService
  ) {
    this.fireStore.features.subscribe((features) => {
      this.freeFeatures = features.filter((feature) => feature.free);
      this.premiumFeatures = features.filter((feature) => feature.premium);
    });
  }
  ngOnInit(): void {
    this.fireStore.getFeatures();
    this.fireStore.getProduct();
  }
}
