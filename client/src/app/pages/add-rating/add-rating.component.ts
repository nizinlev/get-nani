import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { DataService } from './../../serveices/data.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom, Observable, of } from 'rxjs';
import {
  flatMap,
  map,
  startWith,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { ErrorDialogComponent } from 'src/app/dialogs/error-dialog/error-dialog.component';
import { SuccessDialogComponent } from 'src/app/dialogs/success-dialog/success-dialog.component';

@Component({
  selector: 'app-add-rating',
  templateUrl: './add-rating.component.html',
  styleUrls: ['./add-rating.component.scss'],
})
export class AddRatingComponent implements OnInit {
  rateForm: FormGroup;
  allUsersInType$: Observable<any>;
  filter$?: Observable<string>;
  currentUser$?: Observable<User>;
  myRating = 5;
  toggleType: any;
  filterTypes: any;
  dialog: any;

  get description() {
    return this.rateForm.get('description');
  }
  get rating() {
    return this.rateForm.get('rating');
  }
  get employerName() {
    return this.rateForm.get('employerName');
  }

  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private store: Store,
    private router: Router
  ) {
    this.rateForm = this.fb.group({
      employerName: ['', Validators.required],
      rating: [this.myRating, [Validators.required, Validators.max(5)]],
      description: ['', Validators.required],
    });
    this.currentUser$ = this.store.select((state) => state.current.user);
    this.toggleType = localStorage.getItem('user');
    this.toggleType = JSON.parse(this.toggleType).role;
    this.allUsersInType$ =
      this.toggleType.role === 'parent'
        ? this.ds.getNanis()
        : this.ds.getParens();
    this.filter$ = this.employerName?.valueChanges;
  }

  ngOnInit(): void {
    this.filter$?.subscribe((filter) => {
      this.currentUser$?.subscribe((user) => {
        this.toggleType = user;
        this.allUsersInType$ =
          this.toggleType.role === 'parent'
            ? this.ds.getNanis()
            : this.ds.getParens();
        this.allUsersInType$.subscribe((userT) => {
          let x = userT.filter((user: any) => user.username.includes(filter));
          this.filterTypes = x;
        });
      });
    });
  }

  async onSubmit() {
    if (this.rateForm.valid) {
      let fail = await this.checkDetails();
      if (fail) {
        const dialogError = this.dialog.open(ErrorDialogComponent, {
          data: { massage: "Name didn't exist" },
        });
        dialogError.afterClosed().subscribe();
      }
      const now = new Date();
      this.currentUser$
        ?.pipe(
          flatMap((user) => {
            const currentId = user.id;
            const formValue = {
              ...this.rateForm.value,
              byWho: currentId,
              date: now,
            };
            return this.ds.add_rating(formValue);
          })
        )
        .subscribe((res: any) => {
          if (res['success']) {
            const dialogRef = this.dialog.open(SuccessDialogComponent, {
              data: { massage: 'Your rating saved' },
            });
            dialogRef.afterClosed().subscribe((res:any) => {
              this.router.navigate([[{ outlets: { secondary: 'home' } }]]);
            });
          } else {
            const dialogError = this.dialog.open(ErrorDialogComponent, {
              data: { massage: 'Something get wrong - try again' },
            });
            dialogError.afterClosed().subscribe();
          }
        });
    } else {
      this.rateForm.markAllAsTouched();
    }
  }
  async checkDetails() {
    const users = await this.allUsersInType$.toPromise();
    let employerExist = users.some(
      (x: any) => x.username == this.rateForm.get('employerName')?.value
    );
    if (
      this.employerName?.value == '' ||
      this.rating?.value == '' ||
      this.description?.value == ''
    ) {
      return true;
    } else if (!employerExist) {
      return true;
    } else {
      return false;
    }
  }
}
