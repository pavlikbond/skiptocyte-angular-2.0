import { HomePageComponent } from './home-page/home-page.component';
import { DilutionComponent } from './dilution/dilution.component';
import { ContactComponent } from './contact/contact.component';
import { DifferentialComponent } from './differential/differential.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  {
    path:'differential',
    component: DifferentialComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'dilution',
    component: DilutionComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), BrowserModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
