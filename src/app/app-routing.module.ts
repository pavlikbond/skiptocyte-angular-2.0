import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PricingComponent } from './pricing/pricing.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ContactComponent } from './contact/contact.component';
import { DifferentialComponent } from './differential/differential.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ErrorComponent } from './error/error.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'differential',
    component: DifferentialComponent,
  },
  {
    path: 'contact',
    component: ContactComponent,
  },
  // {
  //   path: 'pricing',
  //   component: PricingComponent,
  // },
  {
    path: 'login',
    component: LoginComponent,
  },
  // {
  //   path: 'account',
  //   component: AccountSettingsComponent,
  // },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: '**',
    component: ErrorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), BrowserModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
