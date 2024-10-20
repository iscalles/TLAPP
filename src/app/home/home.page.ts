import { Component } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';

declare var google: any;

interface Marker{
  title: string;
  latitude: string;
  longitude: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  map:any;

  @ViewChild('map', {read: ElementRef, static: false}) mapRef!:ElementRef;

  infoWindows: any = [];
  markers: Marker[] = [
    {
      title: "Casa Isabel",
      latitude: "-33.1495845",
      longitude: "-71.5699625"
    },
    {
      title: "Casa Isabel",
      latitude: "-33.1495845",
      longitude: "-71.5699625"
    }
  ];

  constructor() {};
  ngAfterViewInit(){
    this.geolocationNative();
  }
  async geolocationNative(){
    try{
      const position = await Geolocation.getCurrentPosition();
      console.log('Latitude: ',position.coords.latitude);
      console.log('Longitude: ', position.coords.longitude);
    } catch (error){
      console.error('Error getting location', error);
    }
  }

  ionViewDidEnter(){
    this.showMap();
  }

  async addMarkersToMap(markers: Marker[]){
    const{ AdvancedMarkerElement } = await google.maps.importLibrary('marker');
    for (let marker of markers){
      const position = new google.maps.LatLng(marker.latitude, marker.longitude);
      const mapMarker = new AdvancedMarkerElement({
        position: position,
        title: marker.title,
        map: this.map
      });
      this.addInfoWindowToMarker(mapMarker, marker.title, position);
    }
  }
  async addInfoWindowToMarker(marker: any, title: string, position: any){
    const { InfoWindow } = await google.maps.importLibrary("core");
    console.log(typeof InfoWindow);
    let infoWindowContent = '<div id="content">'+
                              '<h2>' + title + '</h2>'+
                              '<p>Latitude: ' + position.lat() + '</p>' + 
                              '<p>Longitude: ' + position.lng() + '</p>' +
                            '</div>';
    let infoWindow = InfoWindow({
      content: infoWindowContent
    });                         
    marker.addListener('click', () =>{
      this.closeAllInfoWindows();
      infoWindow.open(this.map, marker);
    });
    this.infoWindows.push(infoWindow);
  }
  closeAllInfoWindows() {
    for(let window of this.infoWindows){
      window.close();
    }
  }
  async showMap(){
    const { Map } = await google.maps.importLibrary("maps");

    const location = new google.maps.LatLng(-33.1495845, -71.5699625);
    const options = {
      center: location,
      zoom: 15,
      disableDefaultUI: true,
      mapId: 'a2cb7aa4a486d560'
    }
    this.map = new Map(this.mapRef.nativeElement, options);
    this.addMarkersToMap(this.markers);
  }
}
