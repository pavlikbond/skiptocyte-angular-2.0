import { DilutionComponent } from './dilution/dilution.component';
import { ContactComponent } from './contact/contact.component';
import { DifferentialComponent } from './differential/differential.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AppComponent
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
