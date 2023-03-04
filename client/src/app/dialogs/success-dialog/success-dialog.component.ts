
import { Component, inject, Inject } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-success-dialog',
  templateUrl: './success-dialog.component.html',
  styleUrls: ['./success-dialog.component.scss']
})
export class SuccessDialogComponent {
  message: string='';
  progressValue = 0;
  maxValue = 100;
  duration = 500; // 3 seconds
  intervalTime = 10; 

  constructor(private dialogRef: MatDialogRef<SuccessDialogComponent>, @Inject(MAT_DIALOG_DATA) public data:any) { }

  ngOnInit() {
    // Set up the slider to automatically fill over 3 seconds
    this.dialogRef.updateSize('max-content','max-content')
    const interval = setInterval(() => {
      const increment = 150/ this.duration/2;
      this.progressValue = Math.min(this.progressValue + increment, this.maxValue);
      if (this.progressValue >= this.maxValue) {
        clearInterval(interval);
      }
    }, 1);
  
    // Automatically close the dialog after 3 seconds
    setTimeout(() => {
      this.onClose();
    }, 5000);
  }

  onClose() {
    this.dialogRef.close();
  }
}
