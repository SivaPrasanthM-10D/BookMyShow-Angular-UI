import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-welcome-dialog',
  templateUrl: './welcome-dialog.component.html',
  styleUrls: ['./welcome-dialog.component.css']
})
export class WelcomeDialogComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<WelcomeDialogComponent>) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.dialogRef.close();
    }, 5000); // Auto-close after 5 seconds
  }

  onGetStarted(): void {
    this.dialogRef.close();
  }
}
