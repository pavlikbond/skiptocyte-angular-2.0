import { Component, OnInit } from '@angular/core';
import { PresetService } from 'src/app/services/preset.service';
@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss'],
})
export class SettingsDialogComponent {
  index: number = this.presetService.currentTrack;
  displayTrack: String = this.presetService.trackList[this.index].name;

  constructor(private presetService: PresetService) {}

  getTracks() {
    return this.presetService.trackList;
  }

  nextTrack() {
    let tracks = this.presetService.trackList;
    this.index = ++this.index % tracks.length;
    this.presetService.currentTrack = this.index;
    this.displayTrack = tracks[this.index].name;
    this.presetService.playDing();
  }

  previousTrack() {
    let tracks = this.presetService.trackList;
    this.index = --this.index < 0 ? tracks.length - 1 : this.index;
    this.presetService.currentTrack = this.index;
    this.displayTrack = tracks[this.index].name;
    this.presetService.playDing();
  }

  playDing() {
    this.presetService.playDing();
  }
}
