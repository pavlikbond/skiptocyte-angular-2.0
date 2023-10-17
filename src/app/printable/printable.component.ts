import { Preset } from '../models/preset.model';
import { PresetService } from '../services/preset.service';
import { SettingsService } from './../services/settings.service';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-printable',
  templateUrl: './printable.component.html',
})
export class PrintableComponent implements OnInit, OnDestroy {
  @Input() preview: boolean = false;
  thClass = 'border-2 border-slate-400';
  tdClass = 'border-2 border-slate-400';
  settings: any;
  preset: Preset;
  selectedUnits;
  WbcCount: number = 0;
  constructor(
    private settingsService: SettingsService,
    private presetService: PresetService
  ) {}

  ngOnDestroy(): void {
    //clear session storage
    sessionStorage.removeItem('currentPreset');
    sessionStorage.removeItem('printSettings');
    sessionStorage.removeItem('selectedUnits');
  }
  ngOnInit(): void {
    if (this.preview) {
      console.log('preview');

      this.settings = this.settingsService.printSettings;
      this.preset = this.presetService.currentPreset;
      this.selectedUnits = this.presetService.selectedUnit;
      this.WbcCount = this.presetService.WbcCount;
    } else {
      console.log('print');
      //get preset from session storage and save it to this.preset
      this.preset =
        JSON.parse(sessionStorage.getItem('currentPreset')) ||
        this.presetService.currentPreset;
      //get printSettings from session storage and save it to settings
      this.settings =
        JSON.parse(sessionStorage.getItem('printSettings')) ||
        this.settingsService.printSettings;
      //get selectedUnits from session storage and save it to selectedUnits
      this.selectedUnits =
        JSON.parse(sessionStorage.getItem('selectedUnits')) || '10^3/µL';
      //get wbcCount from session storage
      this.WbcCount = JSON.parse(sessionStorage.getItem('WbcCount')) || 0;
    }
    //print screen
    if (!this.preview) {
      window.print();
    }
  }

  formattedUnit(clean: boolean = true) {
    let unit = this.selectedUnits;

    // Use a regular expression to match the exponent part and replace it with <sup> tags
    unit = unit.replace(/\^(\d+)/g, '<sup>$1</sup>');

    return clean ? `x${unit}` : ` ( ${unit} )`;
  }
}
