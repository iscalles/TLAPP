import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthguardService } from './authguard.service';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
    // ,
    // canActivate:[AuthguardService],
    // data:{ role: 'Pasajero'}
  },
  {
    path: 'home-conductor',
    loadChildren: () => import('./home-conductor/home-conductor.module').then( m => m.HomeConductorPageModule)
    // ,
    // canActivate:[AuthguardService],
    // data:{ role: 'Conductor'}
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'backup',
    loadChildren: () => import('./backup/backup.module').then( m => m.BackupPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: '**',//<--- NOTFOUND TIENE QUE IR AL FINAL DEL ARREGLO
    loadChildren: () => import('./not-found/not-found.module').then( m => m.NotFoundPageModule)
  },
  
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }