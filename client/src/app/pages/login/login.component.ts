import { SetParent } from './../../actions/parent.action';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngxs/store';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

userTest = {
    id: '222222222',
    username: 'test',
    password: '111',
    phone_num: '055555555',
    email: 'test@test'
}
hide:boolean=true
  constructor( private store:Store,private http: HttpClient) { }

  ngOnInit(): void {
  }

  submitForm(formValue: any) {
    formValue.rating=0;
    this.store.dispatch(new SetParent(formValue));
  }

  saveData() {
    // this.http.get('http://localhost:5000/login',{}).subscribe(res=>{
    //   console.log('success')
    // })
  
    this.http.post('http://localhost:5000/login', this.userTest).subscribe(response => {
      console.log('Data saved successfully');
    });
  }
  

}
