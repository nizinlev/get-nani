import { Observable } from 'rxjs';
import { DataService } from 'src/app/serveices/data.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss'],
})
export class DashComponent implements OnInit {
  display: any;
  center: google.maps.LatLngLiteral = {
    lat: 32.440595,
    lng: 35.512499,
  };
  zoom = 10;
  optionMap: google.maps.MapOptions = {
    controlSize: 25,
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 15,
    minZoom: 8,
  };
  widthS: number = window.screen.width*0.6;
  heightS: number = window.screen.height*0.6;
  markers:any=[];
  // offersWithLongLat$:Observable<any>;
  localStoreData: any;



  @ViewChild('mapElement') mapElement: any;

  constructor(private ds:DataService) {
    this.widthS= window.screen.width*0.6;
    this.heightS = window.screen.height*0.6;
    this.localStoreData =  localStorage.getItem('user');
    let id= JSON.parse(this.localStoreData).id
    // this.offersWithLongLat$=this.ds.getAllOffersWithLatLong(id)
  }

  ngOnInit(): void {
    this.ds.testfunc().subscribe(x=>{
      console.log(x)
    })
  }

  
  addMarker() {
    this.markers.push({
      position: {
        lat: this.center.lat + ((Math.random() - 0.5) * 2) / 10,
        lng: this.center.lng + ((Math.random() - 0.5) * 2) / 10,
      },
      label: {
        color: 'red',
        text: 'Im markers' + (this.markers.length + 1),
      },
      title: 'Im screen size' + this.widthS,
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

}
