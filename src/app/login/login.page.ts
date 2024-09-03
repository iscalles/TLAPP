import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  login:any={
    Usuario:"",
    Password:""
  }
  field:string="";
  constructor(public toastController: ToastController, private router:Router) {}
  ngOnInit() {}
  ingresar(){
    if(this.validateModel(this.login)){
      if(this.validateLongUsuario(this.login.Usuario)){
        if(this.validateLongPass(this.login.Password)){
          this.presentToast("Bienvenido "+this.login.Usuario);
          let navigationExtras:NavigationExtras={
            state:{user:this.login.Usuario}
          }
          this.router.navigate(['home'],navigationExtras);
        }else{
          this.presentToast("La contraseña debe ser de largo 4 y solo numerica");
          this.login.Password="";
        }
      }else{
        this.presentToast("El largo del Usuario debe de ser entre 3 y 8 caracteres");
        this.login.Usuario="";
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
  validateLongUsuario(dato:String){
    if(dato.length>=3 && dato.length<=8){
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

}
