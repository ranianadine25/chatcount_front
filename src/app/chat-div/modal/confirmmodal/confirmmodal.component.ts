import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmmodal',
  templateUrl: './confirmmodal.component.html',
  styleUrl: './confirmmodal.component.css'
})
export class ConfirmmodalComponentj {
  file: File;
  existingFecId: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmmodalComponentj>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.file = data.file;
    this.existingFecId = data.existingFecId;
  }

  confirmReplace() {
    this.dialogRef.close(true);
  }

  cancelReplace() {
    this.dialogRef.close(false);
  }
}
