import { MatSnackBarModule } from '@angular/material/snack-bar';
import { environment } from '../environments/environment';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DifferentialComponent } from './differential/differential.component';
import { ContactComponent } from './contact/contact.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { HomePageComponent } from './home-page/home-page.component';
import { HttpClientModule } from '@angular/common/http';
import { NumpadComponent } from './differential/numpad/numpad.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { TableComponent } from './differential/table/table.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SettingsDialogComponent } from './differential/table/settings-dialog/settings-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { PrintDialogComponent } from './differential/numpad/print-dialog/print-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { AngularFireModule } from '@angular/fire/compat';
import { MatCardModule } from '@angular/material/card';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';
import { RowComponent } from './differential/table/row/row.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SharedModule } from './shared/shared.module';
import {
  AngularFireAuthModule,
  USE_EMULATOR as USE_AUTH_EMULATOR,
} from '@angular/fire/compat/auth';
import {
  AngularFirestoreModule,
  USE_EMULATOR as USE_FIRESTORE_EMULATOR,
  SETTINGS as USE_FIRESTORE_SETTINGS,
} from '@angular/fire/compat/firestore';
import {
  AngularFireFunctionsModule,
  USE_EMULATOR as USE_FUNCTIONS_EMULATOR,
} from '@angular/fire/compat/functions';

import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { DeleteDialogComponent } from './account-settings/delete-dialog/delete-dialog.component';
import { ErrorComponent } from './error/error.component';
import { NewPresetComponent } from './differential/table/new-preset/new-preset.component';
import { KeypadComponent } from './differential/numpad/keypad/keypad.component';
import { KeyboardComponent } from './differential/numpad/keyboard/keyboard.component';
import { UnitsDropdownComponent } from './differential/numpad/units-dropdown/units-dropdown.component';
import { PricingV2Component } from './pricing-v2/pricing-v2.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { PrintableLayoutComponent } from './printable-layout/printable-layout.component';
import { PrintableComponent } from './printable/printable.component';
@NgModule({
  declarations: [
    AppComponent,
    DifferentialComponent,
    ContactComponent,
    HomePageComponent,
    NumpadComponent,
    TableComponent,
    SettingsDialogComponent,
    MainNavComponent,
    PrintDialogComponent,
    AccountSettingsComponent,
    DeleteDialogComponent,
    ErrorComponent,
    RowComponent,
    NewPresetComponent,
    KeypadComponent,
    KeyboardComponent,
    UnitsDropdownComponent,
    PricingV2Component,
    SignupComponent,
    LoginComponent,
    AppLayoutComponent,
    PrintableLayoutComponent,
    PrintableComponent,
  ],
  entryComponents: [SettingsDialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTabsModule,
    FormsModule,
    HttpClientModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    DragDropModule,
    MatCheckboxModule,
    MatTooltipModule,
    OverlayPanelModule,
    InputNumberModule,
    InputTextModule,
    MatDialogModule,
    MatToolbarModule,
    MatButtonModule,
    LayoutModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatListModule,
    MatInputModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireAnalyticsModule,
    MatMenuModule,
    MatCardModule,
    MatSnackBarModule,
    MatButtonToggleModule,
    SharedModule,
  ],
  providers: [
    // {
    //   provide: USE_FIRESTORE_SETTINGS,
    //   useValue: { experimentalForceLongPolling: true, merge: true },
    // },
    {
      provide: USE_AUTH_EMULATOR,
      useValue: environment.useEmulators
        ? ['http://localhost:9099']
        : undefined,
    },
    {
      provide: USE_FIRESTORE_EMULATOR,
      useValue: environment.useEmulators
        ? ['http://localhost:8080']
        : undefined,
    },
    // {
    //   provide: USE_FUNCTIONS_EMULATOR,
    //   useValue: environment.useEmulators ? ['localhost', 5001] : undefined,
    // },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
