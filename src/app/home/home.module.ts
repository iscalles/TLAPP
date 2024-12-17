import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';
import { InicioHomeComponent } from './inicio-home/inicio-home.component';
import { ViajesHomeComponent } from './viajes-home/viajes-home.component';
import { PerfilHomeComponent } from './perfil-home/perfil-home.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [
    HomePage,
    InicioHomeComponent,
    ViajesHomeComponent,
    PerfilHomeComponent
  ]
})
export class HomePageModule {}
