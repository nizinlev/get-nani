import { AuthServiceService } from './../../serveices/auth.service.service';
import { DataService } from './../../serveices/data.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup,  NgForm,  FormControl,  FormBuilder,  Validators,} from '@angular/forms';
import { Store } from '@ngxs/store';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/models/user.model';
import { Observable } from 'rxjs';
import { SetPerson } from 'src/app/actions/person.action';

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
  currentUser$: Observable<User>;

  constructor(
    private store: Store,
    private http: HttpClient,
    private fb: FormBuilder,
    private ds: DataService,
    private authServe: AuthServiceService
  ) {
    this.loginForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      pass: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.currentUser$ = this.store.select((state) => state.current.user);
  }

  ngOnInit() {}

  onSubmit(dataForm: any) {
    this.clearErrors();
    let fail = this.ifEmptyFields(dataForm);
    if (fail) {
      let valid = this.validDetails(dataForm);
      if (valid) {
        this.verifyUser(dataForm);
      } else {
        this.showErr = true;
      }
    } else {
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
    this.authServe.login(dataForm.name, dataForm.pass)
      .then()
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        // TODO: navigate
        this.currentUser$.subscribe((x) => {
          alert(x.username);
        });
      });
  }

  clearErrors() {
    this.errMsg = 'check your details again';
    this.showErr = false;
  }
}
