import { Component, OnInit } from '@angular/core';

import { MatDialogRef, MatSnackBar } from '@angular/material';

import { UsuariosServieService } from '../../../../../services/catalogos/usuarios-servie.service';

import { NgForm } from '@angular/forms';

import Swal from 'sweetalert2';

//evento
import {Inject} from '@angular/core';

import {MAT_DIALOG_DATA } from "@angular/material";

import { EventosService } from '../../../../../services/eventos/eventos.service';

import { Evento } from 'src/app/Models/eventos/evento-model';

import { DatePipe } from '@angular/common';

import { ConnectionHubServiceService } from 'src/app/services/shared/ConnectionHub/connection-hub-service.service';

let origen: { origen: string, titulo: string }[] = [
  {"origen": "Administracion", "titulo": 'Usuario'}
]

@Component({
  selector: 'app-add-usuario',
  templateUrl: './add-usuario.component.html',
  styleUrls: ['./add-usuario.component.css']
})
export class AddUsuarioComponent implements OnInit {

  
  BodegaInfo
  movimiento
  usuariosesion

  constructor(  public dialogbox: MatDialogRef<AddUsuarioComponent>,
    public service: UsuariosServieService, 
    private datePipe: DatePipe,
    private eventosService: EventosService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ConnectionHubService: ConnectionHubServiceService,) { }

  ngOnInit() { 
    this.ConnectionHubService.ConnectionHub(origen[0]);
    this.usuariosesion = JSON.parse(localStorage.getItem('ProlappSession'));
    this.BodegaInfo = this.data;
    this.movimiento = this.BodegaInfo.movimiento
    this.resetForm();
  }

  resetForm(form?: NgForm) {
    if (form != null)
   form.resetForm();

    this.service.formData = {
      IdUsuario: 0,
      Nombre: '',
      NombreUsuario: '',
      ApellidoPaterno: '',
      ApellidoMaterno: '',
      Correo: '',
      Telefono: '',
      Contra: '',
      FechaUltimoAcceso: '2016/09/14',
      Dispositivo:'',
    }
  }

onClose(){
  this.dialogbox.close();
  this.service.filter('Register click');
}

onSubmit(form: NgForm) {
  // console.log(form.value);
  this.service.addUsuario(form.value).subscribe( res =>
    {
      console.log(res);
      // this.resetForm(form);
      // this.snackBar.open(res.toString(),'',{
      //   duration: 5000,
      //   verticalPosition: 'top'
      // });
      
      this.movimientos(this.movimiento)
      this.ConnectionHubService.on(origen[0])
      Swal.fire({
        icon: 'success',
        title: 'Usuario Agregado'
      })
    }
    );
}


movimientos(movimiento){
  // let event = new Array<Evento>();
  let u = this.usuariosesion.user
  let fecha = new Date();
  
  let evento = new Evento();
  this.service.getUsuarioNombreU(u).subscribe(res => {
  let idU=res[0].IdUsuario

  evento.IdUsuario = idU
  evento.Autorizacion = '0'
  evento.Fecha = this.datePipe.transform(fecha, 'yyyy-MM-dd, h:mm:ss a');
  evento.Movimiento = movimiento
  
  console.log(evento);
  this.eventosService.addEvento(evento).subscribe(respuesta =>{
    console.log(respuesta);
  })
  })
}

}
