import { Observable } from 'rxjs';
import { DataService } from 'src/app/serveices/data.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss'],
})
export class DashComponent implements OnInit {
  center: google.maps.LatLngLiteral = {
    lat: 32.440595,
    lng: 35.512499,
  };
  optionMap: google.maps.MapOptions = {
    controlSize: 25,
    maxZoom: 15,
    minZoom: 8,
  };
  markers: any[] = [];
  zoom = 10;
  display: any;
  infoName:string=''
  infoPhone:string=''
  infoEmail:string=''
  infoStart:string=''
  infoEnd:string=''

  offersWithLongLat$: Observable<any>;
  localStoreData: any;

  constructor(private ds: DataService) {
    this.localStoreData = localStorage.getItem('user');
    let id = JSON.parse(this.localStoreData).id;
    this.offersWithLongLat$ = this.ds.getAllOffersWithLatLong(id);
  }
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap | undefined;
  @ViewChild(MapInfoWindow, { static: false }) infoWindow:
    | MapInfoWindow
    | undefined;
  infoContent = '';

  ngOnInit() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });
    console.log(this.markers);
    this.offersWithLongLat$.subscribe((offers) => {
      let duplicatePlaces: string[] = [];
      offers.map((offer: any) => {
        if (duplicatePlaces.includes(offer.location)) {
          this.addRandomMarker(offer);
        } else {
          duplicatePlaces.push(offer.location);
          this.addMarker(offer);
        }
      });
      console.log(duplicatePlaces);
      console.log(this.markers);
    });
  }

  addRandomMarker(offer: any) {
    this.markers.push({
      position: {
        lat: offer.lat +((Math.random()-0.5)*2 /100),
        lng: offer.long+ ((Math.random()-0.5)*2 /100),
      },
      label: {
        color: 'blue',
        text:  offer.user.username,
      },
      title: offer.user.username,
      info: {
        name:offer.user.username,
        phone: offer.user.phone_num,
        email: offer.user.email,
        start: this.formatDate(offer.time_start),
        end:  this.formatDate(offer.time_finish)
    
      },
      options: { animation: google.maps.Animation.DROP },
    });
  }


  addMarker(offer: any) {
    this.markers.push({
      position: {
        lat: offer.lat,
        lng: offer.long,
      },
      label: {
        color: 'white',
        text:  offer.user.username,
      },
      title: offer.user.username,
      info: {
        name:offer.user.username,
        phone: offer.user.phone_num,
        email: offer.user.email,
        start: this.formatDate(offer.time_start),
        end:  this.formatDate(offer.time_finish)
    
      },
      options: { animation: google.maps.Animation.DROP },
    });
  }

  moveMap(event: google.maps.MapMouseEvent) {
    console.log(event);
    if (event.latLng != null) this.center = event.latLng.toJSON();
  }
  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }

  openInfo(marker: any, content: any) {
    this.infoName= content.name;
    this.infoPhone = content.phone
    this.infoEmail = content.email
    this.infoStart = content.start
    this.infoEnd = content.end
    this.infoWindow?.open(marker);
  }
  formatDate(date: string) {
    const timeString = new Date(date).toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const dateString = new Date(date).toLocaleDateString('he-IL', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
    return `${timeString}, ${dateString}`;
  }
  click(event: google.maps.MapMouseEvent) {
    // console.log(event);
  }
  logCenter() {
    // console.log(JSON.stringify(this.map?.getBounds()))
  }
}