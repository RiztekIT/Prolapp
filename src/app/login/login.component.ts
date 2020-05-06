import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Form, NgForm } from '@angular/forms';
import { Usuario } from '../Models/catalogos/usuarios-model';
import { UsuariosServieService } from '../services/catalogos/usuarios-servie.service';
import { MatSnackBar } from '@angular/material';
import { StorageServiceService } from '../services/shared/storage-service.service';
import { Session } from '../Models/session-model';



declare function init_plugins();

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public router: Router, public service: UsuariosServieService, private snackBar: MatSnackBar, private storageServce: StorageServiceService) { }

  token;

  ngOnInit() {

    init_plugins();
    this.resetForm();

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
    FechaUltimoAcceso: ''
      }
    }

    

    this.service.getLogin(form.value).subscribe(data => {
     
     console.log(data);
     session.user = form.value.NombreUsuario;
     session.token = data.toString();
     if (data!='Error') {
      this.storageServce.setCurrentSession(session)
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
    FechaUltimoAcceso: '2019-12-19'
   }

  }

}
