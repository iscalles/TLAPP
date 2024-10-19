import { Component } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';

declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  map:any;

  @ViewChild('map', {read: ElementRef, static: false}) mapRef!:ElementRef;

  usuario:String="";
  generos:any[]=[
    {id:1,genero:"Femenino"},
    {id:2,genero:"Masculino"},
    {id:3,genero:"Prefiero no especificar"}
  ]
  data:any={
    nombre:"",
    apellido:"",
    genero:"",
    nacimiento:""
  };
  constructor(public alertController: AlertController,public toastController: ToastController, private activeRoute: ActivatedRoute, private router: Router) {
    this.activeRoute.queryParams.subscribe(params =>{
      const navigation = this.router.getCurrentNavigation();
      if(navigation && navigation.extras && navigation.extras.state){
        this.usuario= navigation.extras.state['user'];
      }
    });
  };
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

  showMap(){
    const location = new google.maps.LatLng(-33.1495845, -71.5699625);
    const options = {
      center: location,
      zoom: 15,
      disableDefaultUI: true
    }
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
  }
  limpiar(){
    for(var [key,value] of Object.entries(this.data)){
      Object.defineProperty(this.data,key,{value:""})
      this.presentToast("Campos limpiados exitosamente");

    }
  }
  mostrar(){
    if ((this.data.nombre!="" && this.data.apellido!="")){
      this.presentAlert("Usuario","Su nombre es "+this.data.nombre+" "+this.data.apellido);
    }else{
      this.presentToast("No hay nada que mostrar");
    }
  }
  async presentAlert(titulo:string,message:string){
    const alert = await this.alertController.create({
      header: titulo,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
  async presentToast(message:string, duration?:number){
    const toast = await this.toastController.create({
      message:message,
      duration:duration?duration:2000
    });
    toast.present();
  }
}
