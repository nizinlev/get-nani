import { Router } from '@angular/router';
import { AuthServiceService } from './../../serveices/auth.service.service';
import { NavigationServiceService } from './../../serveices/navigation.service.service';
import { map, Observable } from 'rxjs';
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
  localStoreData: any;
  nameLocal: string | null;
  rateLocal: number | undefined;
  rateString: string = '';
  isActive: boolean = true;
  showText = window.innerWidth >= 400;

  constructor(
    private router: Router,
    private store: Store,
    private nav: NavigationServiceService,
    private auth: AuthServiceService
  ) {
    this.currentUser$ = this.store.select((state) => state.current);
    this.username$ = this.store.select((state) => state.current.user.username);
    this.localStoreData = localStorage.getItem('user');
    this.nameLocal = this.localStoreData? JSON.parse(this.localStoreData).username: null;

  }

  ngOnInit() {
    this.currentUser$.subscribe(x=>{
      this.rateLocal=Number(this.showRate(x.type.rating)) 
      this.rateString = this.showRate(x.type.rating);
    });
    window.addEventListener('resize', () => {
      this.showText = window.innerWidth >= 400;
    });
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
    this.nav.logout();
  }

  showRate(rate:string): string {
    if(rate=='6'){
      return '--'
    }
    else if((rate>='0') && (rate<'6')){
      return String(Number(rate).toFixed(1))
    }
    return '++'
  }
}
