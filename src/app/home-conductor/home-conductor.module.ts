import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomeConductorPage } from './home-conductor.page';
import { InicioConductorComponent } from './inicio-conductor/inicio-conductor.component';
import { ViajesConductorComponent } from './viajes-conductor/viajes-conductor.component';
import { PerfilConductorComponent } from './perfil-conductor/perfil-conductor.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [
    HomeConductorPage,
    InicioConductorComponent,
    ViajesConductorComponent,
    PerfilConductorComponent
  ]
})
export class HomeConductorPageModule {}
