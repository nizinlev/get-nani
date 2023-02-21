import { SetEmptyPerson } from './../actions/person.action';
import { SetEmptyUser } from './../actions/user.action';
import { SetType, SetEmptyType } from './../actions/nani.action';
import { CurrentState } from './../states/current.state';
import { Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SetCurrentUser } from '../actions/user.action';
import { SetPerson } from '../actions/person.action';
import { Person } from '../models/person.model';
import { User } from '../models/user.model';
// import { Store } from '@ngrx/store';
// import { AppState } from '../store/app.state';
// import { SetCurrentUser, SetPerson, SetRole } from '../store/auth/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  localStoreData: any;
  nameLocal: string | undefined;
  isLogin: boolean | undefined;

  private readonly BASE_URL = 'http://localhost:5000';
  public REST_API_ADD_USER = '/user/add_user';
  public REST_API_LOGIN = '/user/login';

  constructor(private http: HttpClient, private store: Store) {
    // this.localStoreData = localStorage.getItem('user');
    // this.nameLocal = this.localStoreData ? JSON.parse(this.localStoreData).username : null;
  }

  async login(
    username: string,
    password: string
  ): Promise<{ success: boolean; error?: any }> {
    try {
      const data = await this.http
        .post<any>(this.BASE_URL + this.REST_API_LOGIN, { username, password })
        .toPromise();
      if (!data) {
        this.isLogin = false;
        return { success: false };
      }
      const { user, person, role } = data;
      this.store.dispatch(new SetType(role));
      this.store.dispatch(new SetCurrentUser(user));
      this.store.dispatch(new SetPerson(person));
      localStorage.setItem('user', JSON.stringify(user, role, person));
      await new Promise((resolve, reject) => {
        this.store
          .select((state) => state.current.user)
          .subscribe((currentUser) => {
            if (currentUser === user) {
              resolve(undefined);
            }
          });
      });
      this.isLogin = true;
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      this.isLogin = false;
      return { success: false, error };
    }
  }

  async authLoginData(): Promise<boolean> {
    this.localStoreData = localStorage.getItem('user');
    this.nameLocal = this.localStoreData
      ? JSON.parse(this.localStoreData).username
      : null;
    if (!!this.nameLocal) {
      let pass = this.localStoreData
        ? JSON.parse(this.localStoreData).password
        : null;
      try {
        const res = await this.login(this.nameLocal, pass);
        if (res.success) {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        console.log(err);
        return false;
      }
    } else {
      return false;
    }
  }

  async logout() {
    try {
      this.store.dispatch(new SetEmptyUser());
      this.store.dispatch(new SetEmptyPerson());
      this.store.dispatch(new SetEmptyType());
      localStorage.removeItem('user');
      await new Promise((resolve, reject) => {
        this.store
          .select((state) => state.current)
          .subscribe((data) => {
            if (
              data.user == null &&
              data.personDetails == null &&
              data.type == null
            ) {
              resolve(null);
            }
          });
      });
      return { success: true };
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  addUser(personDet: Person, userDet: User, roleDet: any) {
    return this.http.post(this.BASE_URL + this.REST_API_ADD_USER, {
      personDet,
      userDet,
      roleDet,
    });
  }
}
