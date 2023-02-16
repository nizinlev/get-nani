import { SetType } from './../actions/nani.action';
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
  providedIn: 'root'
})
export class AuthServiceService {

  private readonly BASE_URL = 'http://localhost:5000';
  public REST_API_ADD_USER = "/user/add_user"
  public REST_API_LOGIN = "/user/login"


  constructor(private http: HttpClient, private store:Store) { }

  async login(username: string, password: string): Promise<{success: boolean, error?: any}> {
    try {
      const data = await this.http.post<any>(this.BASE_URL+this.REST_API_LOGIN, { username, password }).toPromise();
      const { user, person, role } = data;
      this.store.dispatch(new SetType(role));
      this.store.dispatch(new SetCurrentUser(user));
      this.store.dispatch(new SetPerson(person));
      localStorage.setItem('user', JSON.stringify(user,role,person));
      await new Promise((resolve,reject) => {
        this.store.select(state => state.current.user)
          .subscribe(currentUser => {
            if (currentUser === user) {
              resolve(undefined);
            }
          });
      });
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error };
    }
  }
  
  addUser(personDet:Person,userDet:User, roleDet:any){
    return this.http.post(this.BASE_URL+this.REST_API_ADD_USER, {personDet,userDet,roleDet})
  }
  
}

