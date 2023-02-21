import { Store } from '@ngxs/store';
import { DataService } from './../../serveices/data.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
// import { NgxStarRatingModule } from 'ngx-star-rating';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map, startWith, withLatestFrom } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-add-rating',
  templateUrl: './add-rating.component.html',
  styleUrls: ['./add-rating.component.scss'],
})
export class AddRatingComponent implements OnInit {
  rateForm: FormGroup;
  allParents$: Observable<any>;
  filter$: Observable<string> | undefined;
  filterParent$: Observable<string> | undefined;
  currentUser$: Observable<User>;
  myRating = 0;

  get description() {return this.rateForm.get('description')}
  // get rating() {return this.rateForm.get('rating')}
  get employerName() {return this.rateForm.get('employerName ')}

  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private store: Store
  ) {
    this.allParents$ = this.ds.gatParens();
    this.rateForm = this.fb.group({
      employerName: ['', Validators.required],
      // rating: [null, Validators.required],
      description: ['', Validators.required],
    });
    this.filter$ = this.rateForm.get('employerName')?.valueChanges;
    this.filterParent$ = this.filter$?.pipe(
      withLatestFrom(this.allParents$),
      map(([strFil, parents]) =>
        parents.filter((parent: any) => parent.includes(strFil))
      )
    );
    this.currentUser$ = this.store.select((state) => state.current.user);
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.rateForm.valid) {
      const now = new Date();
      let currentId;
      this.currentUser$.subscribe((user) => {
        currentId = user.id;
      });
      const formValue = { ...this.rateForm.value, byWho: currentId, date: now };
      console.log(formValue); // Do something with the form value
    } else {
      this.rateForm.markAllAsTouched();
    }
  }
}

// // This is just an example of how you might populate the employerName field with a list of options.
// // Replace this with your own data.
// this.allParents$ = this.fb.array([
//   { name: 'Parent 1' },
//   { name: 'Parent 2' },
//   { name: 'Parent 3' },
//   { name: 'Parent 4' },
//   { name: 'Parent 5' }
// ]).valueChanges.pipe(
//   startWith([]),
//   map(parents => parents.filter(p => p.name.toLowerCase().includes(this.rateForm.get('employerName').value.toLowerCase())))
// );
