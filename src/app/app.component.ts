import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { SettingsService } from './services/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(
    private primengConfig: PrimeNGConfig,
    private settingsService: SettingsService
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.settingsService.preloadSounds();
  }
}
