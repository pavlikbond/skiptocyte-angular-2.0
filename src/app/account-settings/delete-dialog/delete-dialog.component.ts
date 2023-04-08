import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  getAuth,
  deleteUser,
  reauthenticateWithCredential,
} from 'firebase/auth';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
})
export class DeleteDialogComponent implements OnInit {
  showConfirmation: boolean = true;
  needsLogin: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onDeleteAccount() {
    const auth = getAuth();
    const user = auth.currentUser;
    console.log(user);

    deleteUser(user)
      .then(() => {
        console.log('user deleted');
        this.showConfirmation = false;
      })
      .catch((error) => {
        console.log(error);
        this.needsLogin = true;
      });
  }

  afterDelete() {
    this.router.navigateByUrl('/');
  }
}
