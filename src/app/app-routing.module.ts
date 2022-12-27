import { HomePageComponent } from './home-page/home-page.component';
import { ToolsComponent } from './tools/tools.component';
import { ContactComponent } from './contact/contact.component';
import { DifferentialComponent } from './differential/differential.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

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
  {
    path: 'tools',
    component: ToolsComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), BrowserModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
