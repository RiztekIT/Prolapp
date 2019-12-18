import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Form, NgForm } from '@angular/forms';
import { Usuario } from '../Models/catalogos/usuarios-model';
import { UsuariosServieService } from '../services/catalogos/usuarios-servie.service';



declare function init_plugins();

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public router: Router, public service: UsuariosServieService) { }

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

    this.service.getLogin(form.value).subscribe(data => {
     this.resetForm(form);
     console.log(data);
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
