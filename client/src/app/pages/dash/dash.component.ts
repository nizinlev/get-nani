import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { MatDatetimepickerModule } from '@mat-datetimepicker/core';
import { MatDatetimepickerMode } from '@mat-datetimepicker/core';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss'],
})

export class DashComponent implements OnInit {
  selectedDate: Date | null = null;
  selectedTime: Date | null = null;
  datetime = new FormControl();
  newtime:any;
  rex = new FormControl();
  
  constructor() { }

  ngOnInit(): void {
  }

}
