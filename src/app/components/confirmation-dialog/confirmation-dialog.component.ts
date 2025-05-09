import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataConfirmDialog } from '../../core/interfaces/DataConfirmDialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
  imports: [MatButton],
})
export class ConfirmationDialogComponent {
  private readonly dialogRef: MatDialogRef<ConfirmationDialogComponent> =
    inject(MatDialogRef);

  data = inject<DataConfirmDialog>(MAT_DIALOG_DATA);

  closeDialog(result: boolean = false) {
    this.dialogRef.close(result);
  }
}
