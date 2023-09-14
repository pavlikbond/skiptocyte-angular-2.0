import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PresetService } from 'src/app/services/preset.service';

@Component({
  selector: 'app-new-preset',
  templateUrl: './new-preset.component.html',
})
export class NewPresetComponent {
  @Input() op: any;
  constructor(public presetService: PresetService) {}

  onSubmit(presetForm: NgForm) {
    //if form is valid create new preset and close modal
    if (presetForm.valid) {
      let maxWBC: number = +presetForm.controls['inputMaxCount'].value || 100;
      let name = presetForm.controls['presetName'].value;
      this.presetService.createPreset(-1, name, maxWBC);
      presetForm.resetForm();
    }
  }
}
