import { ErrorDialogComponent } from './../../dialogs/error-dialog/error-dialog.component';
import { Router } from '@angular/router';
import { AuthServiceService } from './../../serveices/auth.service.service';
import { DataService } from './../../serveices/data.service';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  NgForm,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Store } from '@ngxs/store';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/models/user.model';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from 'src/app/dialogs/success-dialog/success-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hide: boolean = true;
  errMsg: string = 'check your details again';
  showErr: boolean = false;
  isChecked: boolean = false;
  currentUser$: Observable<User>;

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private authServe: AuthServiceService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.loginForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      pass: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.currentUser$ = this.store.select((state) => state.current.user);
  }

  ngOnInit() {
    this.__checkUserConnect();
  }

  async __checkUserConnect(): Promise<void> {
    const isLoggedIn = await this.authServe.authLoginData();
    if (isLoggedIn) {
      // Navigate to home page
      this.router.navigate(['/dash']);
    } else {
      // Navigate to dashboard page
      this.router.navigate(['/']);
    }
  }

  onSubmit(dataForm: any) {
    this.isChecked=true;
    this.clearErrors();
    let fail = this.ifEmptyFields(dataForm);
    if (fail) {
      let valid = this.validDetails(dataForm);
      if (valid) {
        this.verifyUser(dataForm);
      } else {
        this.showErr = true;
        this.isChecked=false;
      }
    } else {
      this.isChecked=false;
      this.showErr = true;
    }
  }

  ifEmptyFields(dataForm: any) {
    if (dataForm.name == '' || dataForm.pass == '') {
      return false;
    }
    return true;
  }

  validDetails(dataForm: any) {
    if (dataForm.pass.length < 5) {
      return false;
    }
    return true;
  }

  verifyUser(dataForm: any) {
    // TODO: valid in backend.
    this.authServe
      .login(dataForm.name, dataForm.pass)
      .then((res) => {
        if (res.success) {
          const dialogRef = this.dialog.open(SuccessDialogComponent, {
            data: { massage: 'You are in' },
          });
          dialogRef.afterClosed().subscribe((res) => {
            this.isChecked=false;
            this.router.navigate(['/dash']);
          });
        } else {
          const dialogError = this.dialog.open(ErrorDialogComponent, {
            data: { massage: 'Username or password wrong' },
          });
          dialogError.afterClosed().subscribe(x=>{
            this.isChecked=false;
          });
        }
      })
      .catch((err) => {
        const dialogError = this.dialog.open(ErrorDialogComponent, {
          data: { massage: 'Username or password wrong' },
        });
        dialogError.afterClosed().subscribe((res) => {
          this.isChecked=false;
          console.log(err);
        });
      });
  }

  clearErrors() {
    this.errMsg = 'check your details again';
    this.showErr = false;
  }
}
