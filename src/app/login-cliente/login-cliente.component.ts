import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Form, NgForm } from '@angular/forms';
import { Usuario } from '../Models/catalogos/usuarios-model';
import { UsuariosServieService } from '../services/catalogos/usuarios-servie.service';
import { MatSnackBar } from '@angular/material';
import { StorageServiceService } from '../services/shared/storage-service.service';
import { Session } from '../Models/session-model';
import { sessionCliente } from '../Models/ClienteLogin/sessionCliente-model';
import { ClientesService } from 'src/app/services/catalogos/clientes.service'
import { ClienteLogin } from '../Models/ClienteLogin/clienteLogin-model';
import { SidebarService } from 'src/app/services/service.index';

declare function init_plugins();

@Component({
  selector: 'app-login-cliente',
  templateUrl: './login-cliente.component.html',
  styleUrls: ['./login-cliente.component.css']
})
export class LoginClienteComponent implements OnInit {

  constructor(public router: Router, public service: ClientesService, private snackBar: MatSnackBar, private storageServce: StorageServiceService, public siderbarservice: SidebarService) { }

  token;

  ngOnInit() {

    init_plugins();
    this.resetForm();
    this.storageServce.inicioCliente = false;
  }

  // ingresar(){
  //   // this.router.navigateByUrl('progress');    
  //   // this.router.navigate(['/dashboard']);
  //   this.router.navigate(['/direccion']);
  //   // this.http.post('#');

  // }

  autentificar(form: NgForm){
    console.log(form.value);
    let sessionCliente: sessionCliente;

    sessionCliente = {
      token:'',
      user: {
        ID: 0,
        RFC: '',
        contra: '',
    
      }
    }
console.log(form.value.RFC);
    this.service.getLogin(form.value).subscribe(data => {
    this.service.getIDCLienteRFC(form.value.RFC).subscribe(res => {

     
      console.log(data);
     console.log(res);
     sessionCliente.user.ID = res[0].IdClientes;
     sessionCliente.user.RFC = form.value.RFC;
     sessionCliente.token = data.toString();
     if (data!='Error') {
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
     }
     else {
      this.snackBar.open('Usuario / Contraseña Incorrectas', '', {
        duration: 5000,
        verticalPosition: 'bottom'
      });
      this.resetForm(form);
     }
    //console.log(this.listData);
    })
    })
    

  }

  resetForm(form?: NgForm) {
    if (form != null)
   form.resetForm();
   this.service.formDatalogin = {
        ID: 0,
        RFC: '',
        contra: '',
   }

  }

  borrar(){
    localStorage.removeItem('ProlappSessionCliente');
    localStorage.removeItem('ClienteId');
    localStorage.removeItem('inicioCliente');
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
      console.log(this.numimagen);
      
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


}
