import { SettingsService } from './../../../services/settings.service';
import { Component, OnDestroy } from '@angular/core';
@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss'],
})
export class SettingsDialogComponent implements OnDestroy {
  //service is just straight up injected in and handles everything
  constructor(public settings: SettingsService) {}
  ngOnDestroy(): void {
    this.settings.saveTableSettings();
  }
}
