import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
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
  constructor(public alertController: AlertController, private activeRoute: ActivatedRoute, private router: Router) {
    this.activeRoute.queryParams.subscribe(params =>{
      const navigation = this.router.getCurrentNavigation();
      if(navigation && navigation.extras && navigation.extras.state){
        this.usuario= navigation.extras.state['user'];
      }
    });
  };
  limpiar(){
    
    for(var [key,value] of Object.entries(this.data)){
      Object.defineProperty(this.data,key,{value:""})
    }
  }
  mostrar(){
    (this.data.nombre!="" && this.data.apellido!="") && this.presentAlert("Usuario","Su nombre es "+this.data.nombre+" "+this.data.apellido);
  }
  async presentAlert(titulo:string,message:string){
    const alert = await this.alertController.create({
      header: titulo,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
  
}
