import { HomePageComponent } from './home-page/home-page.component';
import { ContactComponent } from './contact/contact.component';
import { DifferentialComponent } from './differential/differential.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ErrorComponent } from './error/error.component';
import { PricingV2Component } from './pricing-v2/pricing-v2.component';
import { PrintableLayoutComponent } from './printable-layout/printable-layout.component';
import { AppLayoutComponent } from './app-layout/app-layout.component'; // Import the layout components
import { PrintableComponent } from './printable/printable.component';
const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent, // Use the shared layout component
    children: [
      { path: '', component: HomePageComponent },
      { path: 'differential', component: DifferentialComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'pricing', component: PricingV2Component },
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      {
        path: 'error',
        component: ErrorComponent, // Error route with access to navigation
      },
      // Other routes that should have navigation
    ],
  },
  {
    path: 'printable',
    component: PrintableLayoutComponent, // Use the printable layout component
    children: [
      { path: '', component: PrintableComponent },
      // Other routes specific to the printable layout
    ],
  },

  {
    path: '**',
    redirectTo: 'error', // Redirect to the error route for any unknown routes
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), BrowserModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
