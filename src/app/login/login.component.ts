import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Form, NgForm } from '@angular/forms';
import { Usuario } from '../Models/catalogos/usuarios-model';
import { UsuariosServieService } from '../services/catalogos/usuarios-servie.service';
import { MatSnackBar } from '@angular/material';
import { StorageServiceService } from '../services/shared/storage-service.service';
import { Session } from '../Models/session-model';
import { SidebarService } from '../services/shared/sidebar.service';
import { DeviceDetectorService } from 'ngx-device-detector';


declare function init_plugins();

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public router: Router, public service: UsuariosServieService, private snackBar: MatSnackBar, private storageServce: StorageServiceService, public sidebarservice: SidebarService, private deviceService: DeviceDetectorService) { }

  token;
  deviceinfo;
  dispositivo;

  ngOnInit() {

    init_plugins();
    this.resetForm();
    this.obtenerdevice();

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
    NombreUsuario: 'IvanTa',
    ApellidoPaterno: '',
    ApellidoMaterno: '',
    Correo: '',
    Telefono: '',
    Contra: 'Ivan2019',
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
      this.router.navigate(['/direccion']);
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
    if (form != null)
   form.resetForm();
   this.service.formData = {
    IdUsuario: 0,
    Nombre: '',
    NombreUsuario: 'IvanTa',
    ApellidoPaterno: '',
    ApellidoMaterno: '',
    Correo: '',
    Telefono: '',
    Contra: 'Ivan2019',
    FechaUltimoAcceso: '2019-12-19',
    Dispositivo:''
   }

  }


}
