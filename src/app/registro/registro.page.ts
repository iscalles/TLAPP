import { Component } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  data = {
    id: '',
    name: '',
    email: '',
    password: '',
    rut: '',
    rol: ''
  };

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router,
    private userService: UserService // Inyectar el servicio de usuarios
  ) {}


  mostrar() {
    if (this.data.name !== '' && this.data.email !== '') {
      this.presentAlert('Usuario', `Su nombre es ${this.data.name} y su email es ${this.data.email}`);
    } else {
      this.presentToast('No hay nada que mostrar');
    }
  }

  async presentAlert(titulo: string, message: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentToast(message: string, duration: number = 2000) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: 'bottom'
    });
    toast.present();
  }

  registrar() {
    // Generar un ID único para el nuevo usuario
    this.data.id = Math.random().toString(36).substr(2, 9);

    // Lógica para registrar al usuario en la base de datos JSON
    this.userService.crearUsuario(this.data).subscribe(
      response => {
        this.presentToast('Usuario registrado exitosamente');
        // Redirigir al usuario a la página de inicio de sesión
        this.router.navigate(['/login']);
      },
      error => {
        this.presentToast('Error al registrar el usuario');
        console.error('Error al registrar el usuario:', error);
      }
    );
  }

  volverAlLogin() {
    this.router.navigate(['/login']);
  }
}
