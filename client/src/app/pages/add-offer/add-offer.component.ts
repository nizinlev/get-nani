import { SetType } from './../../actions/nani.action';
import { Router } from '@angular/router';
import { DataService } from './../../serveices/data.service';
import { Store } from '@ngxs/store';
import { first, Observable } from 'rxjs';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-offer',
  templateUrl: './add-offer.component.html',
  styleUrls: ['./add-offer.component.scss'],
})
export class AddOfferComponent implements OnInit {
  @ViewChild('dateInput', { static: true })
  dateInput!: ElementRef;

  offerForm: FormGroup;
  currentUser$: Observable<any>;
  currentType$: Observable<any>;
  userLocation: string = '';
  showError: boolean = false;
  myFilter: any;
  minDate=new Date()

  get dateTime() {
    return this.offerForm.get('dateTime');
  }
  get startTime() {
    return this.offerForm.get('startTime');
  }
  get finishTime() {
    return this.offerForm.get('finishTime');
  }
  get payment() {
    return this.offerForm.get('payment');
  }

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private ds: DataService,
    private router: Router
  ) {
    this.offerForm = this.fb.group(
      {
        dateTime: ['', Validators.required],
        startTime: ['', Validators.required],
        finishTime: ['', Validators.required],
        location: [{ value: '', disabled: true }, Validators.required],
        payment: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      },
      { validators: this.validateTimeRange }
    );
    console.log(this.offerForm);
    this.currentUser$ = this.store.select((state) => state.current.user);
    this.currentType$ = this.store.select((state) => state.current.type);
  }

  ngOnInit(): void {
    this.currentType$.subscribe((type) => {
      this.userLocation = type.residence;
      this.offerForm.patchValue({
        location: type.residence,
      });
    });
  }

  onSubmit() {
    if (this.offerForm.valid) {
      const [hours, minutes] = this.startTime?.value.split(':');
    const [hoursFinish, minutesFinish] = this.finishTime?.value.split(':');
    const startDateTime=this.combineTimes(this.dateTime?.value,hours, minutes);
    const endDateTime=this.combineTimes(this.dateTime?.value,hoursFinish, minutesFinish)
    
    this.currentUser$.pipe(first()).subscribe((user) => {
      let data = {
        time_start: startDateTime,
        time_finish: endDateTime,
        location: this.userLocation,
        payment: this.payment?.value,
          id: user.id,
        };
        this.ds.addOffer(data).subscribe((res: any) => {
          if (!res['success']) {
            alert('add offer failed');
          } else {
            alert('success add offer');
            this.router.navigate([[{ outlets: { secondary: 'home' } }]]);
          }
        });
      });
    } else {
      alert('invalid Form - try again');
    }
  }

  validateTimeRange = (group: FormGroup) => {
    const startTime = group.get('startTime')?.value;
    const finishTime = group.get('finishTime')?.value;
    if (
      startTime &&
      finishTime &&
      (new Date(startTime) > new Date(finishTime) ||
        new Date(startTime) < new Date())
    ) {
      this.showError = true;
      return { timeRangeError: true };
    }
    this.showError = false;
    return null;
  }

  combineTimes(date:Date,hours:string,minutes:string){
    let newDate = new Date(date.getTime());
    newDate.setHours(Number(hours));
    newDate.setMinutes(Number(minutes));
    return newDate
  }

  minHoursStart(){
    if(this.dateTime?.value){
    let isToday= (this.dateTime?.value.getDate()==new Date().getDate())? true:false;
    if(isToday){
      let x = new Date().setHours(new Date().getHours()+1)
      let y = new Date().getMinutes()
      return String(new Date(x).getHours())+':'+String(y)
    }
    else{
      let x= '00:00'
      return x
    }}
    else{
      return '00:00'
    }
  }
}
