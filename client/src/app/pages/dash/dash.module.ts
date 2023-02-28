import { NgModule } from '@angular/core';
import { MatCommonModule } from '@angular/material/core';
import { DatetimeAdapter, MAT_DATETIME_FORMATS ,MatDatetimepickerModule  } from '@mat-datetimepicker/core';
import { MomentDatetimeAdapter } from '@mat-datetimepicker/moment';
import { DashComponent } from './dash.component';


export const MY_DATETIME_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
    timeInput: 'hh:mm:ss a',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    timeInput: 'hh:mm:ss a',
    dateTimeInput: 'YYYY-MM-DD hh:mm:ss a',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
    popupHeaderDateLabel: 'ddd, DD MMM',
    popupHeaderTimeLabel: 'hh:mm:ss a',
  }
};


@NgModule({
  declarations:[],
  imports:[
    MatCommonModule,
    MatDatetimepickerModule,
    MatDatetimepickerModule,
  ],
  providers: [
    { provide: MAT_DATETIME_FORMATS, useValue: MY_DATETIME_FORMATS },
    { provide: DatetimeAdapter, useClass: MomentDatetimeAdapter }
  ],
})
export class DashModule { }
