import { Component, OnInit } from '@angular/core';
import { GuardService } from '../../guard.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil-home',
  templateUrl: './perfil-home.component.html',
  styleUrls: ['./perfil-home.component.scss'],
})
export class PerfilHomeComponent  implements OnInit {
  user: any = {};
  editMode: boolean = false;
  apiUrl = 'https://52980e9d-49e6-4de5-959e-64957ef06805-00-2e5umcjokfs6r.picard.replit.dev/users'; // URL de la API
  
  httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };

  constructor(private guardService: GuardService, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    const userId = this.guardService.getUserId(); // Obtener el userId del servicio
    if (userId) {
      this.http.get(`${this.apiUrl}/${userId}`).subscribe(
        (userData: any) => {
          this.user = userData; // Asignar los datos del usuario al objeto user
        },
        (error) => {
          console.error('Error al cargar el perfil del usuario:', error);
        }
      );
    } else {
      console.error('No se encontró un ID de usuario autenticado.');
    }
  }

  enableEditMode() {
    this.editMode = true; // Habilitar el modo edición
  }

  saveProfileChanges() {
    this.http.put(`${this.apiUrl}/${this.user.id}`, this.user).subscribe(
      (response) => {
        console.log('Perfil actualizado correctamente:', response);
        this.editMode = false; // Deshabilitar el modo edición después de guardar
      },
      (error) => {
        console.error('Error al actualizar el perfil:', error);
      }
    );
  }

  logout() {
    this.guardService.removeToken(); // Elimina el token de autenticación y otros datos
    this.router.navigate(['/login']); // Redirecciona al login
  }
}
