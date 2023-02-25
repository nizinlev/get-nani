import { Router } from '@angular/router';
import { DataService } from './../../serveices/data.service';
import { Store } from '@ngxs/store';
import { first, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-offer',
  templateUrl: './add-offer.component.html',
  styleUrls: ['./add-offer.component.scss'],
})
export class AddOfferComponent implements OnInit {
  offerForm: FormGroup;
  currentUser$: Observable<any>;
  currentType$: Observable<any>;
  userLocation: string = '';
  showError: boolean = false;

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
    this.currentType$.subscribe(type => {
      this.userLocation = type.residence;
      this.offerForm.patchValue({
        location: type.residence,
      });
    });
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
  };

  onSubmit() {
    if (this.offerForm.valid) {
      this.currentUser$.pipe(first()).subscribe((user) => {
        let data = {
          time_start: this.startTime?.value,
          time_finish: this.finishTime?.value,
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
}
