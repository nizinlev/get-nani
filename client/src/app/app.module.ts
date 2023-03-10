import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { CreateAccountComponent } from './pages/create-account/create-account.component';
import { NgxsModule } from '@ngxs/store';
import { CurrentState } from './states/current.state';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCommonModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from './display/sidebar/sidebar.component';
import { HeadbarComponent } from './display/headbar/headbar.component';
import { AddRatingComponent } from './pages/add-rating/add-rating.component';
import { HistoryComponent } from './pages/history/history.component';
import { AddOfferComponent } from './pages/add-offer/add-offer.component';
import { WorkListComponent } from './pages/work-list/work-list.component';
import { DashComponent } from './pages/dash/dash.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatNativeDatetimeModule } from '@mat-datetimepicker/core';
import { ObserversModule } from '@angular/cdk/observers';
import {NgxMatTimepickerModule} from 'ngx-mat-timepicker'; 
import { GoogleMapsModule } from '@angular/google-maps';
import { SpinnerComponent } from './display/spinner/spinner.component';
import { SuccessDialogComponent } from './dialogs/success-dialog/success-dialog.component';
import { ErrorDialogComponent } from './dialogs/error-dialog/error-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CreateAccountComponent,
    HeadbarComponent,
    SidebarComponent,
    AddRatingComponent,
    HistoryComponent,
    AddOfferComponent,
    WorkListComponent,
    DashComponent,
    SpinnerComponent,
    SuccessDialogComponent,
    ErrorDialogComponent,
  ],
  entryComponents:[
    SuccessDialogComponent,
    ErrorDialogComponent,
],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxsModule.forRoot([CurrentState]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    FormsModule,
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    NgbModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatNativeDatetimeModule,
    ObserversModule,
    NgxMatTimepickerModule,
    GoogleMapsModule,
  ],
  providers: [
    MatCommonModule,
    CommonModule,
    // { provide: MAT_DATETIME_FORMATS, useValue: MAT_MOMENT_DATETIME_FORMATS },
    // { provide: DatetimeAdapter, useClass: MomentDatetimeAdapter }
    // FormsModule,
    // {provide: MomentDatetimeAdapter}
    // MatDatepickerModule,
    // MatNativeDateModule,
    // MatMomentDateModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
