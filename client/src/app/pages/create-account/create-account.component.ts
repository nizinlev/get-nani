import { AuthServiceService } from './../../serveices/auth.service.service';
import { NavigationServiceService } from './../../serveices/navigation.service.service';
import { User } from './../../models/user.model';
import { Person } from './../../models/person.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/serveices/data.service';
import { Router } from '@angular/router';
import {
  combineLatest,
  defaultIfEmpty,
  filter,
  map,
  Observable,
  startWith,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { SuccessDialogComponent } from 'src/app/dialogs/success-dialog/success-dialog.component';
import { ErrorDialogComponent } from 'src/app/dialogs/error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
})
export class CreateAccountComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  naniFormGroup: FormGroup;
  parentFormGroup: FormGroup;

  get firstName() {
    return this.firstFormGroup.get('firstName');
  }
  get lastName() {
    return this.firstFormGroup.get('lastName');
  }
  get gender() {
    return this.firstFormGroup.get('gender');
  }
  get id() {
    return this.firstFormGroup.get('id');
  }
  get username() {
    return this.secondFormGroup.get('username');
  }
  get password() {
    return this.secondFormGroup.get('password');
  }
  get confirmPassword() {
    return this.secondFormGroup.get('confirmPassword');
  }
  get phoneNumber() {
    return this.secondFormGroup.get('phoneNumber');
  }
  get email() {
    return this.secondFormGroup.get('email');
  }
  get role() {
    return this.secondFormGroup.get('role');
  }
  get age() {
    return this.naniFormGroup.get('age');
  }
  get expNani() {
    return this.naniFormGroup.get('experienceYears');
  }
  get placeNani() {
    return this.naniFormGroup.get('residence');
  }
  get childName() {
    return this.parentFormGroup.get('childName');
  }
  get childAge() {
    return this.parentFormGroup.get('childAge');
  }
  get placePare() {
    return this.parentFormGroup.get('childResidence');
  }
  get childGender() {
    return this.parentFormGroup.get('childGender');
  }

  genders = ['male', 'female'];
  roles = ['nani', 'parent'];
  allCities$: Observable<citiesFormat[]>;
  filterCities$: Observable<string[]> | undefined;
  filter$: Observable<string> | undefined;
  filterCitiesParent$: Observable<string[]> | undefined;
  filterParent$: Observable<string> | undefined;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private ds: DataService,
    private authServe: AuthServiceService,
    private router: Router,
    private navServe: NavigationServiceService
  ) {
    this.firstFormGroup = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      id: [
        '',
        [
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(9),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      gender: ['', [Validators.required]],
    });
    this.secondFormGroup = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
        phoneNumber: [
          '',
          [Validators.required, Validators.pattern('^[0-9]{10}$')],
        ],
        email: ['', [Validators.required, Validators.email]],
        role: ['', [Validators.required]],
      },
      { validator: this.checkPasswords }
    );
    this.naniFormGroup = this.fb.group({
      age: ['', [Validators.required]],
      residence: ['', [Validators.required]],
      experienceYears: ['', [Validators.required]],
      about: [''],
    });
    this.parentFormGroup = this.fb.group({
      childName: ['', [Validators.required, Validators.minLength(3)]],
      childAge: ['', [Validators.required]],
      childResidence: ['', [Validators.required]],
      childGender: ['', [Validators.required]],
    });

    this.allCities$ = this.ds.getCities();
    this.filter$ = this.placeNani?.valueChanges;
    this.filterCities$ = this.filter$?.pipe(
      withLatestFrom(this.allCities$),
      map(([strFil, cities]) =>
        cities
          .filter((city) => city.hebrewName.includes(strFil))
          .map((city) => city.hebrewName)
      )
    );
    this.filterParent$ = this.placePare?.valueChanges;
    this.filterCitiesParent$ = this.filterParent$?.pipe(
      withLatestFrom(this.allCities$),
      map(([strFil, cities]) =>
        cities
          .filter((city) => city.hebrewName.includes(strFil))
          .map((city) => city.hebrewName)
      )
    );
  }

  ngOnInit() {
    this.allCities$.subscribe((x) => {
      console.log(x);
    });
  }

  back() {
    this.navServe.logout();
  }

  onSubmit(personForm: Person, userForm: User, roleForm: any) {
    [userForm, roleForm] = this.addIdToForm(personForm.id, userForm, roleForm);
    let typeForm= this.role?.value =='parent' ? this.parentFormGroup : this.naniFormGroup;
    if(this.firstFormGroup.valid && this.secondFormGroup.valid && typeForm.valid){
      this.authServe.addUser(personForm, userForm, roleForm).subscribe((res) => {
        if ((res as { [key: string]: any })['success']) {
          const dialogRef = this.dialog.open(SuccessDialogComponent, {
            data: { massage: `User- ${userForm.username}, is created` },
          });
          dialogRef.afterClosed().subscribe((res: any) => {
            this.router.navigate(['/login']);
          });
        } else {
          const dialogError = this.dialog.open(ErrorDialogComponent, {
            data: { massage: 'Username or password exist - try other username' },
          });
          dialogError.afterClosed().subscribe((res: any) => {
            console.log(res);
          });
        }
      });
    }
    else{
      const dialogError = this.dialog.open(ErrorDialogComponent, {
        data: { massage: 'Invalid forms - check it out' },
      });
      dialogError.afterClosed().subscribe((res: any) => {
        console.log(res);
      });
    }
  }

  addIdToForm(id: number, form: User, roleForm: any) {
    form.id = id;
    roleForm.id = id;
    return [form, roleForm];
  }

  checkPasswords(group: FormGroup) {
    let pass = group.controls['password'].value;
    let confirmPass = group.controls['confirmPassword'].value;

    if (pass !== confirmPass) {
      group.controls['confirmPassword'].setErrors({ notSame: true });
      return { notSame: true };
    }
    return null;
  }
}

export interface citiesFormat {
  hebrewName: string;
  englishName: string;
}
