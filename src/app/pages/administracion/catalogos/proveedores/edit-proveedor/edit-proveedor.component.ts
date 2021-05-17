import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { ProveedoresService } from '../../../../../services/catalogos/proveedores.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';


//evento
import {Inject} from '@angular/core';

import {MAT_DIALOG_DATA } from "@angular/material";

import { UsuariosServieService } from '../../../../../services/catalogos/usuarios-servie.service';

import { EventosService } from '../../../../../services/eventos/eventos.service';

import { Evento } from 'src/app/Models/eventos/evento-model';

import { DatePipe } from '@angular/common';



import { ConnectionHubServiceService } from 'src/app/services/shared/ConnectionHub/connection-hub-service.service';

let origen: { origen: string, titulo: string }[] = [
  {"origen": "Administracion", "titulo": 'Proveedor'}
]

@Component({
  selector: 'app-edit-proveedor',
  templateUrl: './edit-proveedor.component.html',
  styleUrls: ['./edit-proveedor.component.css']
})
export class EditProveedorComponent implements OnInit {
  
  BodegaInfo
  movimiento
  usuariosesion

  tipoSelect;

  public listTipos: Array<any> = [
    { tipo: 'Materia Prima Nacional' },
    { tipo: 'Materia Prima Extranjero' },    
    { tipo: 'Gastos y Servicios' },    
  ];

  constructor(public dialogbox: MatDialogRef<EditProveedorComponent>,
    public service: ProveedoresService, private snackBar: MatSnackBar,
    private usuarioService: UsuariosServieService,
    private datePipe: DatePipe,
    private eventosService: EventosService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ConnectionHubService: ConnectionHubServiceService, ) {
      
     }

  ngOnInit() {
    this.ConnectionHubService.ConnectionHub(origen[0]);
    this.usuariosesion = JSON.parse(localStorage.getItem('ProlappSession'));
    this.BodegaInfo = this.data;
    this.movimiento = this.BodegaInfo.movimiento
    this.tipoSelect = this.data.tipo
  }

  onClose() {
    this.dialogbox.close();
    this.service.filter('Register click');
  }

  onSubmit(form: NgForm) {
    console.log(form);
    this.service.updateProveedor(form.value).subscribe(res => {

      let query = "update tipoproveedor set tipo= '"+this.tipoSelect+"' where idproveedor= "+form.value.IdProveedor+""
      
      this.service.generarConsulta(query).subscribe(data=>{

        this.ConnectionHubService.on(origen[0])
        this.movimientos(this.movimiento)
        Swal.fire({
          icon: 'success',
          title: 'Proveedor Actualizado'
        })
      })
      
    });
  }
 movimientos(movimiento){
    // let event = new Array<Evento>();
    let u = this.usuariosesion.user
    let fecha = new Date();
    
    let evento = new Evento();
    this.usuarioService.getUsuarioNombreU(u).subscribe(res => {
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
