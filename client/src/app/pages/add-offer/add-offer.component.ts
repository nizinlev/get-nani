import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-offer',
  templateUrl: './add-offer.component.html',
  styleUrls: ['./add-offer.component.scss']
})
export class AddOfferComponent implements OnInit {

  offerForm: FormGroup;
  currentUser$:Observable<any>;
  userLocation:string='';
  showError:boolean=false

  get startTime() {
    return this.offerForm.get('startTime');
  }
  get finishTime() {
    return this.offerForm.get('finishTime');
  }
  get payment() {
    return this.offerForm.get('payment');
  }

  constructor(private fb: FormBuilder , private store:Store) {
    this.offerForm = this.fb.group({
      startTime: ['', Validators.required],
      finishTime: ['', Validators.required],
      location: [{ value: '', disabled: true }, Validators.required],
      payment: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]]
    }, { validators: this.validateTimeRange });
    console.log(this.offerForm)
    this.currentUser$=this.store.select(state=>state.current)
   }

  ngOnInit(): void {
    this.currentUser$.subscribe(user=>{
      this.userLocation=user.type.residence
      this.offerForm.patchValue({
        location: user.type.residence
      });
    })

  }

  validateTimeRange=(group: FormGroup)=> {
    const startTime = group.get('startTime')?.value;
    const finishTime = group.get('finishTime')?.value;
    if (startTime && finishTime && new Date(startTime) > new Date(finishTime)) {
      this.showError=true;
      return { timeRangeError: true };
    }
    this.showError=false;
    return null;
  }

  getCurrentUser() {
    // return an observable that gets the current user
  }

  onSubmit() {
    if (this.offerForm.valid) {
      // submit the form data
    }
  }
}
