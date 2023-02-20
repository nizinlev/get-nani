import { SidebarComponent } from './../sidebar/sidebar.component';
import { Router } from '@angular/router';
import { AuthServiceService } from './../../serveices/auth.service.service';
import { NavigationServiceService } from './../../serveices/navigation.service.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-headbar',
  templateUrl: './headbar.component.html',
  styleUrls: ['./headbar.component.scss'],
})
export class HeadbarComponent implements OnInit {
  currentUser$: Observable<any>;
  username$: Observable<string>;
  localStoreData:any;
  nameLocal:string|null;
  isActive: boolean = true;

  constructor( private router: Router, private store: Store, private nav: NavigationServiceService, private auth:AuthServiceService) {
    this.currentUser$ = this.store.select((state) => state.current);
    this.username$ = this.store.select((state)=>state.current.user.username);
    this.localStoreData=localStorage.getItem('user');
    this.nameLocal=this.localStoreData?JSON.parse(this.localStoreData).username:null;

  }

  ngOnInit() {
    this.__checkUserConnect();
  }

  async __checkUserConnect(): Promise<void> {
    const isLoggedIn = await this.auth.authLoginData();
    if (isLoggedIn) {
      this.router.navigate(['/dash']);
    } else {
      this.router.navigate(['/']);
    }
  }
  

  toggleSidebar() {
    this.isActive = !this.isActive;
  }

  logout() {
    this.auth.logout();
    this.nav.back();
  }
}
