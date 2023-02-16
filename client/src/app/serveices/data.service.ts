import { User } from './../models/user.model';
import { Person } from './../models/person.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  constructor(private http: HttpClient) {  }

  // loginCheck(name:string,pass:string){
  //   return this.http.post(this.REST_API_LOGIN_USER, {name, pass})
  // }


}
