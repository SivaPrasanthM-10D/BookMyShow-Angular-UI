import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-note-dialog',
  templateUrl: './note-dialog.component.html',
  styleUrls: ['./note-dialog.component.css']
})
export class NoteDialogComponent {
  constructor(public dialogRef: MatDialogRef<NoteDialogComponent>) {}

  onOk(): void {
    this.dialogRef.close('ok');
  }

  onCancel(): void {
    this.dialogRef.close('cancel');
  }
} 