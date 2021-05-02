import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Form, NgForm } from '@angular/forms';
import { Usuario } from '../Models/catalogos/usuarios-model';
import { UsuariosServieService } from '../services/catalogos/usuarios-servie.service';
import { MatSnackBar } from '@angular/material';
import { StorageServiceService } from '../services/shared/storage-service.service';
import { Session } from '../Models/session-model';
import { SidebarService } from '../services/shared/sidebar.service';
import { DeviceDetectorService } from 'ngx-device-detector';

import { interval } from 'rxjs';
import { ClientesService } from '../services/catalogos/clientes.service';

import { sessionCliente } from '../Models/ClienteLogin/sessionCliente-model';


declare function init_plugins();

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public router: Router, public service: UsuariosServieService,
     private snackBar: MatSnackBar, private storageServce: StorageServiceService, 
     public sidebarservice: SidebarService, private deviceService: DeviceDetectorService, 
     public clienteService: ClientesService, public siderbarservice: SidebarService) { }
numimagen = 3;
  token;
  deviceinfo;
  dispositivo;
  
  public imagesUrl: Array<object> = [
      
  {
    image:'assets/login/abarrotodo.png',
    thumbImage: 'assets/login/abarrotodo.png',
    alt: 'Abarrotodo'
},
{
  image:'assets/login/prolacto.png',
  thumbImage: 'assets/login/prolacto.png',
  alt: 'Prolacto'
},
{
  image:'assets/login/dairy.png',
  thumbImage: 'assets/login/dairy.png',
  alt: 'Dairy'
}

]

  ngOnInit() {

    init_plugins();
    this.resetForm();
    this.obtenerdevice();
    this.carruselimagenes()

  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    clearInterval(this.intervalUpdate);
  }
  private intervalUpdate: any = null;
  propiedad1 = 'block';
  propiedad2 = 'none';
  propiedad3 = 'none';

  carruselimagenes(){
    this.intervalUpdate = setInterval(function(){
      
      if (this.numimagen==1){

        this.propiedad1 = 'block'
        this.propiedad2 = 'none'
        this.propiedad3 = 'none'
      }else if(this.numimagen==2){
        this.propiedad1 = 'none'
        this.propiedad2 = 'block'
        this.propiedad3 = 'none'
      }else if(this.numimagen==3){
        this.propiedad1 = 'none'
        this.propiedad2 = 'none'
        this.propiedad3 = 'block'
        this.numimagen=0;
      }else if(this.numimagen==4){
        this.propiedad1 = 'none'
        this.propiedad2 = 'none'
        this.propiedad3 = 'none'
        this.numimagen=0;
      }
      this.numimagen = this.numimagen + 1;
      
     }.bind(this), 4000);
  }

  obtenerdevice(){
    this.deviceinfo = this.deviceService.getDeviceInfo();
  //console.clear();
console.log(this.deviceinfo);
// this.dispositivo = '||'+this.deviceinfo.browser+'||'+this.deviceinfo.browser_version+'||'+this.deviceinfo.device+'||'+this.deviceinfo.os+'||'+this.deviceinfo.os_version+'||'+this.deviceinfo.userAgent;
this.dispositivo = JSON.stringify(this.deviceinfo)
  }

  // ingresar(){
  //   // this.router.navigateByUrl('progress');    
  //   // this.router.navigate(['/dashboard']);
  //   this.router.navigate(['/direccion']);
  //   // this.http.post('#');

  // }

  autentificar(form: NgForm){
    console.log(form.value);
    let session: Session;
    console.log(this.dispositivo);
    let usuarioentrar: Usuario

    session = {
      token:'',
      user: {
        IdUsuario: 0,
    Nombre: '',
    NombreUsuario: '',
    ApellidoPaterno: '',
    ApellidoMaterno: '',
    Correo: '',
    Telefono: '',
    Contra: '',
    FechaUltimoAcceso: '',
    Dispositivo:this.dispositivo
      }
    }

    usuarioentrar = {
      IdUsuario: 0,
      Nombre: '',
      NombreUsuario: form.value.NombreUsuario,
      ApellidoPaterno: '',
      ApellidoMaterno: '',
      Correo: '',
      Telefono: '',
      Contra: form.value.Contra,
      FechaUltimoAcceso: '',
      Dispositivo: this.dispositivo,
    }



    

    this.service.getLogin(usuarioentrar).subscribe(data => {
     
     console.log(data);
     session.user = form.value.NombreUsuario;
     session.token = data.toString();
     if (data!='Error') {
      this.storageServce.setCurrentSession(session)
      this.sidebarservice.getMenu();
      
      this.router.navigate(['/inicio']);
     }
     else {
      this.snackBar.open('Usuario / Contraseña Incorrectas', '', {
        duration: 5000,
        verticalPosition: 'bottom'
      });
      this.resetForm(form);
     }
    //console.log(this.listData);
    });
    

  }

  resetForm(form?: NgForm) {
    // if (form != null)
  //  form.resetForm();
   this.service.formData = {
    IdUsuario: 0,
    Nombre: '',
    NombreUsuario: '',
    ApellidoPaterno: '',
    ApellidoMaterno: '',
    Correo: '',
    Telefono: '',
    Contra: '',
    FechaUltimoAcceso: '2019-12-19',
    Dispositivo:''
   }

  }

  // autentificarCliente(form: NgForm){
  autentificarCliente(form){
    console.log('%c⧭', 'color: #607339', form);
    // console.log(form.value);
    let sessionCliente: sessionCliente;

    sessionCliente = {
      token:'',
      user: {
        ID: 0,
        RFC: '',
        contra: '',
    
      }
    }
console.log(form.RFC);
    this.clienteService.getLogin(form).subscribe(data => {
      console.log(data);
      if (data!='Error') {
      // if(!data){

        this.clienteService.getIDCLienteRFC(form.RFC).subscribe(res => {
          
          
          console.log(res);
          sessionCliente.user.ID = res[0].IdClientes;
          sessionCliente.user.RFC = form.RFC;
          sessionCliente.token = data.toString();
            console.log(sessionCliente);
            var inicioCliente = true;
            localStorage.setItem("inicioCliente", inicioCliente.toString());
            localStorage.setItem("ClienteId", sessionCliente.user.ID.toString());
            localStorage.getItem("ClienteId")
            console.log('localStorage.getItem("ClienteId"): ', localStorage.getItem("ClienteId"));
            this.storageServce.setCurrentSessionCliente(sessionCliente);
            // variable para saber que se inicio session como cliente y no como usuario
            this.siderbarservice.getMenucliente();
            this.router.navigate(['/cliente']);
          // }
          // else {
          //   this.snackBar.open('Usuario / Contraseña Incorrectas', '', {
          //     duration: 5000,
          //     verticalPosition: 'bottom'
          //   });
          //   this.resetForm(form);
          // }
          //console.log(this.listData);
        })
      }else{
        this.snackBar.open('Usuario / Contraseña Incorrectas', '', {
          duration: 5000,
          verticalPosition: 'bottom'
          
        });
      }
      this.resetFormClientes(form);
      })
    

  }

  resetFormClientes(form?: NgForm) {
    // if (form != null)
  //  form.resetForm();
   this.clienteService.formDatalogin = {
        ID: 0,
        RFC: '',
        contra: '',
   }

  }


}
