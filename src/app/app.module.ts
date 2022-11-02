import { PresetService } from 'src/app/services/preset.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DifferentialComponent } from './differential/differential.component';
import { DilutionComponent } from './dilution/dilution.component';
import { ContactComponent } from './contact/contact.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { HomePageComponent } from './home-page/home-page.component';
import { HttpClientModule } from '@angular/common/http';
import { NumpadComponent } from './differential/numpad/numpad.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { TableComponent } from './differential/table/table.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
import { NgxPrintModule } from 'ngx-print';

@NgModule({
  declarations: [
    AppComponent,
    DifferentialComponent,
    DilutionComponent,
    ContactComponent,
    HomePageComponent,
    NumpadComponent,
    TableComponent,
    SettingsDialogComponent,
    MainNavComponent,
    PrintDialogComponent,
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
    MatSidenavModule,
    MatListModule,
    MatInputModule,
    NgxPrintModule,
  ],
  providers: [PresetService],
  bootstrap: [AppComponent],
})
export class AppModule {}
