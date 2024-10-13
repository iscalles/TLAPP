import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-backup',
  templateUrl: './backup.page.html',
  styleUrls: ['./backup.page.scss'],
})
export class BackupPage implements OnInit {
  backup:any={
    Email:""
  }
  field:string="";

  constructor(public toastController: ToastController, private router:Router) {}
  ngOnInit() {}

  recuperar(){
    if(this.validateModel(this.backup)){
      if(this.validateLongEmail(this.backup.Email)){
        this.presentToast("Se ha enviado un correo de recuperación a "+this.backup.Email);
        this.router.navigate(['login']);
      }else{
        this.presentToast("El largo del Email debe de ser entre 3 y 100 caracteres");
        this.backup.Email="";
      }
    }else{
      this.presentToast("Por favor ingresar un correo válido")
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
  async presentToast(message:string, duration?:number){
    const toast = await this.toastController.create({
      message:message,
      duration:duration?duration:2000
    });
    toast.present();
  }

}
