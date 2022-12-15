import { Component, OnInit } from '@angular/core';
import { PresetService } from 'src/app/services/preset.service';
@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss'],
})
export class SettingsDialogComponent {
  allSoundSettings = {
    trackList: [
      { name: 'Sound 1', filePath: '../assets/Beep_1.wav' },
      { name: 'Sound 2', filePath: '../assets/Beep_2.mp3' },
      { name: 'Sound 3', filePath: '../assets/Beep_3.mp3' },
    ],
    trackIndexes: { max: 0, change: 1 },
    soundSettings: {
      playMaxCount: true,
      playCountChange: false,
    },
  };
  tableSettings = {
    playMaxCount: this.presetService.soundSettings.playMaxCount,
    playCountChange: this.presetService.soundSettings.playCountChange,
  };
  constructor(private presetService: PresetService) {}

  getTracks() {
    return this.presetService.trackList;
  }

  getTrack(type: string) {
    if (type === 'max') {
      return this.presetService.getDisplayTrack(
        this.presetService.currentTrackMax
      );
    } else {
      return this.presetService.getDisplayTrack(
        this.presetService.currentTrackChange
      );
    }
  }

  nextTrack(index: number) {
    this.presetService.nextTrack(index);
    this.presetService.playDing(index);
  }

  previousTrack(index: number) {
    this.presetService.previousTrack(index);
    this.presetService.playDing(index);
  }

  playDing(index: number) {
    this.presetService.playDing(index);
  }

  onClickCheckbox() {
    setTimeout(() => {
      this.presetService.soundSettings = { ...this.tableSettings };
    });
  }
}
