import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViajeListPageRoutingModule } from './viaje-list-routing.module';

import { ViajeListPage } from './viaje-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViajeListPageRoutingModule
  ],
  declarations: [ViajeListPage]
})
export class ViajeListPageModule {}
