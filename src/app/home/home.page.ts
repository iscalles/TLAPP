import { Component, ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

declare var google: any; // Declarar google

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('map', { static: false }) mapElement!: ElementRef;
  map!: any; // Declarar como `any` para evitar problemas de tipo

  constructor() {}

  async ionViewDidEnter() {
    this.loadMap();
  }

  async loadMap() {
    const coordinates = await Geolocation.getCurrentPosition();
    const latLng = new google.maps.LatLng(coordinates.coords.latitude, coordinates.coords.longitude);

    const mapOptions = {
      center: latLng,
      zoom: 15,
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    new google.maps.Marker({
      position: latLng,
      map: this.map,
      title: "Estás aquí",
    });
  }
}
