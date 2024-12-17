import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { GuardService } from '../guard.service';

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
  constructor(public toastController: ToastController, private router:Router, private loadingCtrl: LoadingController, private guardService:GuardService) {}
  ngOnInit() {}
  async ingresar() {
    if (!this.login.Email && !this.login.Password) {
      this.presentToast('Por favor, ingresa el email y la contraseña');
    } else if (!this.login.Email) {
      this.presentToast('Por favor, ingresa el email');
    } else if (!this.login.Password) {
      this.presentToast('Por favor, ingresa la contraseña');
    } else {
      this.guardService.login(this.login.Email, this.login.Password).subscribe(user => {
        if (user) {
          if (user.rol == 'Pasajero') {
            this.router.navigate(['/home']); 
          } else if (user.rol == 'Conductor') {
            this.router.navigate(['/home-conductor']); 
          }
        } else {
          this.presentToast('Credenciales incorrectas'); 
        }
      });
    }
  }
  registrar(){
    this.router.navigate(['registro']);
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
