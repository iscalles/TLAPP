import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router'; 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  usuario: String;
  niveles:any[]=[
    {id:1,nivel:"Basica incompleta"},
    {id:2,nivel:"Basica completa"},
    {id:3,nivel:"Media incompleta"},
    {id:4,nivel:"Media completa"},
    {id:5,nivel:"Superior incompleta"},
    {id:6,nivel:"Superior completa"}
  ]
  data:any={
    nombre:"",
    apellido:"",
    educacion:"",
    nacimiento:""
  };
  constructor(public alertController: AlertController, private activeRoute: ActivatedRoute, private router: Router) {
    this.activeRoute.queryParams.subscribe(params =>{
      if(this.router.getCurrentNavigation().extras.state){
        this.usuario=this.router.getCurrentNavigation().extras.state.user;
      }
    });
  }

}
