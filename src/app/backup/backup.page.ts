import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-backup',
  templateUrl: './backup.page.html',
  styleUrls: ['./backup.page.scss'],
})
export class BackupPage implements OnInit {
  backup: any = {
    Email: ""
  };
  field: string = "";

  constructor(public toastController: ToastController, private router: Router) {}
  ngOnInit() {}

  recuperar() {
    if (this.validateModel(this.backup)) {
      if (this.validateLongEmail(this.backup.Email)) {
        this.presentToast("Se ha enviado un correo de recuperación");
      } else {
        this.presentToast("El correo es demasiado largo");
      }
    } else {
      this.presentToast("Por favor, complete todos los campos");
    }
  }

  volverAlLogin() {
    this.router.navigate(['/login']);
  }

  validateModel(model: any): boolean {
    // Implementa la lógica de validación del modelo
    return true;
  }

  validateLongEmail(email: string): boolean {
    // Implementa la lógica de validación del correo electrónico
    return email.length <= 50;
  }

  async presentToast(message: string, duration: number = 2000) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: 'bottom'
    });
    toast.present();
  }
}
