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

  addMarkersToMap(markers: Marker[]){
    for (let marker of markers){
      let position = new google.maps.LatLng(marker.latitude, marker.longitude);
      let mapMarker = new google.maps.Marker({
        position: position,
        title: marker.title,
        latitude: marker.latitude,
        longitude: marker.longitude
      });
      mapMarker.setMap(this.map);
      this.addInfoWindowToMarker(mapMarker);
    }
  }
  addInfoWindowToMarker(marker: any){
    let infoWindowContent = '<div id="content">'+
                              '<h2 id="firstHeading" class="firstHeading">' + marker.getTitle() + '</h2>'+
                              '<p>Latitude: ' + marker.getPosition()?.lat() + '</p>' + 
                              '<p>Longitude: ' + marker.getPosition()?.lng() + '</p>' +
                            '</div>';
    let infoWindow = new google.maps.infoWindow({
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
    const { Marker } = await google.maps.importLibrary("marker");

    const location = new google.maps.LatLng(-33.1495845, -71.5699625);
    const options = {
      center: location,
      zoom: 15,
      disableDefaultUI: true
    }
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
    this.addMarkersToMap(this.markers);
  }
}
