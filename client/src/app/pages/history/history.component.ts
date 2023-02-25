import { Store } from '@ngxs/store';
import { DataService } from 'src/app/serveices/data.service';
import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  allOffers$: Observable<any> | undefined;
  currentUser$?: Observable<User>;
  newHistoryList:any=[];

  constructor(private ds: DataService, private store:Store ) {
    this.currentUser$ = this.store.select(state=>state.current.user)

   }

  ngOnInit() {
    this.currentUser$?.subscribe(x=>{
      this.allOffers$=this.ds.getAllHistory(String(x.id))
    })
    this.allOffers$?.subscribe(x=>{
      this.newHistoryList=x;
      return x
    })
  }


  deleteHistory(offer: any,i:any):void {
    console.log(offer)
    this.newHistoryList.splice(i,1)
  }
}
