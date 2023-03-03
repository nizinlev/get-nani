import { Store } from '@ngxs/store';
import { DataService } from 'src/app/serveices/data.service';
import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { tap } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-work-list',
  templateUrl: './work-list.component.html',
  styleUrls: ['./work-list.component.scss']
})
export class WorkListComponent implements OnInit {
  allOffers$: Observable<any> | undefined;
  currentUser$?: Observable<User>;
  newOfferList:any=[];
  isLoading:boolean=false;


  constructor(private ds: DataService, private store:Store ,private _snackBar: MatSnackBar) {
    this.currentUser$ = this.store.select(state=>state.current.user);
 

  }

  ngOnInit() {
    this.isLoading=true;
    this.currentUser$?.subscribe(x=>{
      this.allOffers$=this.ds.getAllOffers(String(x.id))
      this.isLoading=false;
    })
    this.allOffers$?.subscribe(x=>{
      this.newOfferList=x;
      this.isLoading=false;
      return x
    })
  }

  acceptOffer(offer: any,i:any) {
    this._snackBar.open(`send message to ${offer.user.username} (${offer.user.phone_num})`, 'Dismiss',{
      duration: 3*1000
    });
  }

  deleteOffer(offer: any,i:any):void {
    console.log(offer)
    this.newOfferList.splice(i,1)
  }

  convertObjTooltip(obj: any) {
    let results: any[] = [];
    Object.keys(obj).reduce((sum, key) => {
      if((key == 'username') || key == 'email'){
        sum.push(`${key}: ${obj[key]}`);
        return sum;
      }
      if(key == 'phone_num'){
        sum.push(`phone: ${obj[key]}`);
        return sum;
      }
      return sum;
    }, results);
    return results.join('\n');
}
}
