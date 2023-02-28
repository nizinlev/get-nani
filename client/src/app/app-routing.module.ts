import { AddOfferComponent } from './pages/add-offer/add-offer.component';
import { AddRatingComponent } from './pages/add-rating/add-rating.component';
import { HistoryComponent } from './pages/history/history.component';
import { WorkListComponent } from './pages/work-list/work-list.component';
import { DashComponent } from './pages/dash/dash.component';
import { LoginGuardGuard } from './guards/login-guard.guard';
import { SidebarComponent } from './display/sidebar/sidebar.component';
import { HeadbarComponent } from './display/headbar/headbar.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateAccountComponent } from './pages/create-account/create-account.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  {path: '' , redirectTo: 'login', pathMatch: 'full'},
  {path: 'login' , component: LoginComponent},
  {path: 'signup' , component: CreateAccountComponent},
  {path: 'dash' , component: HeadbarComponent , canActivate: [LoginGuardGuard],
   children:[
    {path: '' , redirectTo: 'add-offer', pathMatch: 'full',outlet: 'secondary'},
    {path: 'home' , component: DashComponent, outlet: 'secondary'},
    {path: 'list' , component: WorkListComponent, outlet: 'secondary', pathMatch: 'full'},
    {path: 'history' , component: HistoryComponent, outlet: 'secondary', pathMatch: 'full'},
    {path: 'add-rating' , component: AddRatingComponent, outlet: 'secondary', pathMatch: 'full'},
    {path: 'add-offer' , component: AddOfferComponent, outlet: 'secondary', pathMatch: 'full'},

  ]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
