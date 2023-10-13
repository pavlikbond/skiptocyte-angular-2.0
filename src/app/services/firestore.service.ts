import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Preset } from 'src/app/models/preset.model';
import { convertPresetsForDb } from '../models/preset-utils';
import { SnackbarService } from './snackbar.service';
@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(
    private db: AngularFirestore,
    private snackBar: SnackbarService
  ) {}

  async updatePresets(presets: Preset[], uid: string) {
    let dbPresets = convertPresetsForDb(presets);

    try {
      await this.db.doc(`users/${uid}`).set(dbPresets, { merge: true });
      console.log('Document successfully set or updated.');
      this.snackBar.openSnackBar('Presets saved successfully');
    } catch (error) {
      console.error('Error setting or updating document:', error);
      this.snackBar.openSnackBar('Error saving presets');
    }
  }

  async updateLocalStorage(presets: Preset[]) {
    let dbPresets = convertPresetsForDb(presets);
    localStorage.setItem('presets', JSON.stringify(dbPresets));
    this.snackBar.openSnackBar('Presets saved successfully');
  }
}
