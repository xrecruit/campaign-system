import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../modules/modals/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  dialogRef: MatDialogRef<any>;
  referralSuccessMessage: any;
  userName: string;
  userAvatar: string;

  constructor(
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private titleService: Title,
    private router: Router,
  ) {

  }

  openSnackBar(message: string, error: boolean, duration: number) {
    this.snackBar.open(message, "", {
      duration,
      panelClass: error ? 'snackbar-error' : 'snackbar-success'
    });
  }

  handleError(error) {
    if (error.name === 'HttpErrorResponse') {
      const errorMessage = this.getErrorMessage(error);
      this.openSnackBar(errorMessage, true, 2000);
      if (errorMessage === 'Something went wrong!! Check Console') console.error(error);
    } else {
      this.openSnackBar('Something went wrong!! Check Console', true, 2000);
      console.error(error);
    }
  }

  getErrorMessage(error) {
    return (
      (error && error.error && error.error.message) ?
        error.error.message : 'Something went wrong!! Check Console'
    );
  }

  openConfirmationBox(message) {
    return new Promise((resolve, reject) => {
      this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        minWidth: '280px',
        width: '25vw',
        maxWidth: '400px',
        autoFocus: false
      });
      this.dialogRef.componentInstance.message = message;
      this.dialogRef.afterClosed().subscribe(result => {
        this.dialogRef = null;
        if (result) {
          resolve(result);
        } else {
          resolve();
        }
      });
    });
  }

  setPageTitle(pageTitle?) {
    if (!pageTitle) {
      let root = this.router.routerState.snapshot.root;
      while (root) {
        if (root.children && root.children.length) {
          root = root.children[0];
        } else if (root.data && root.data['title']) {
          let pageTitle = root.data['title'];
          pageTitle && this.titleService.setTitle(pageTitle);
          return;
        } else {
          return;
        }
      }
    } else {
      this.titleService.setTitle(pageTitle)
    }
  }
}
