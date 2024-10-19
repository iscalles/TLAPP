import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViajeListPage } from './viaje-list.page';

const routes: Routes = [
  {
    path: '',
    component: ViajeListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViajeListPageRoutingModule {}
