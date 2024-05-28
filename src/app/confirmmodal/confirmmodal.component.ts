import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
interface ConfirmReplaceDialogData {
  message: string;
  confirmText: string;
  cancelText: string;
}
@Component({
  selector: 'app-confirmmodal',
  templateUrl: './confirmmodal.component.html',
  styleUrl: './confirmmodal.component.css'
})
export class ConfirmmodalComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmmodalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmReplaceDialogData,
  ) {}

  onConfirm() {
    // Fermer la boîte de dialogue et renvoyer `true`
    this.dialogRef.close(true);
  }

  onCancel() {
    // Fermer la boîte de dialogue et renvoyer `false`
    this.dialogRef.close(false);
  }
}