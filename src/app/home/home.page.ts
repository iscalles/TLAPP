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
  niveles:any[]=[
    {id:1,nivel:"Basica incompleta"},
    {id:2,nivel:"Basica completa"},
    {id:3,nivel:"Media incompleta"},
    {id:4,nivel:"Media completa"},
    {id:5,nivel:"Superior incompleta"},
    {id:6,nivel:"Superior completa"}
  ]
  data:any={
    nombre:"",
    apellido:"",
    educacion:"",
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
