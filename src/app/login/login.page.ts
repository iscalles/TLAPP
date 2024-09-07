import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  login:any={
    Email:"",
    Password:""
  }
  field:string="";
  constructor(public toastController: ToastController, private router:Router, private loadingCtrl: LoadingController) {}
  ngOnInit() {}
  ingresar(){
    this.mostrarCarga();
    if(this.validateModel(this.login)){
      if(this.validateLongEmail(this.login.Email)){
        if(this.validateLongPass(this.login.Password)){
          this.mostrarCarga;
          this.presentToast("Bienvenido "+this.login.Email);
          let navigationExtras:NavigationExtras={
            state:{user:this.login.Email}
          }
          this.router.navigate(['home'],navigationExtras);
          
        }else{
          this.presentToast("La contraseña debe ser de largo 4 y solo numerica");
          this.login.Password="";
        }
      }else{
        this.presentToast("El largo del Email debe de ser entre 3 y 8 caracteres");
        this.login.Email="";
      }
    }else{
      this.presentToast("Falta: "+this.field);
    }
  }
  validateModel(model:any){
    for(var [key,value] of Object.entries(model)){
      if(value==""){
        this.field=key;
        return false;
      }
    }
    return true;
  }
  validateLongEmail(dato:String){
    if(dato.length>=3 && dato.length<=100 && dato.includes('@')){
      return true;
    }
    return false;
  }
  validateLongPass(dato:string){
    if(dato.length==4 && Number.isInteger(Number(dato))){
      return true;
    }
    return false;
  }
  async presentToast(message:string, duration?:number){
    const toast = await this.toastController.create({
      message:message,
      duration:duration?duration:2000
    });
    toast.present();
  }
  async mostrarCarga(){
    const carga = await this.loadingCtrl.create({
      message: 'Calmao...',
      duration: 1000,
    });
    carga.present();
  }
}
