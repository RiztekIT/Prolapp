import { Component,Inject, OnInit } from '@angular/core';
import { NgForm, FormControl } from '@angular/forms';
import { EnviarfacturaService } from 'src/app/services/facturacioncxc/enviarfactura.service';
import Swal from 'sweetalert2';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { ClientesService } from '../../../../../services/catalogos/clientes.service';

import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { format } from 'url';


import {MAT_DIALOG_DATA } from "@angular/material";
//Registro de eventos
import { DatePipe } from '@angular/common';
import { UsuariosServieService } from '../../../../../services/catalogos/usuarios-servie.service';
import { EventosService } from '../../../../../services/eventos/eventos.service';
import { Evento } from 'src/app/Models/eventos/evento-model';

@Component({
  selector: 'app-add-vendedor',
  templateUrl: './add-vendedor.component.html',
  styleUrls: ['./add-vendedor.component.css']
})
export class AddVendedorComponent implements OnInit {

  
  usuariosesion;
  movimiento;
  BodegaInfo;

  constructor(public dialogbox:MatDialogRef<AddVendedorComponent>, 
    public router: Router, 
              public service: ClientesService, 
              private snackBar: MatSnackBar, 
              private _formBuilder: FormBuilder,
    private usuarioService: UsuariosServieService,
    private datePipe: DatePipe,
    private eventosService: EventosService,
    @Inject(MAT_DIALOG_DATA) public data: any, ) { }

  ngOnInit() {
    
    this.usuariosesion = JSON.parse(localStorage.getItem('ProlappSession'));
    this.BodegaInfo = this.data;
    this.movimiento = this.BodegaInfo.movimiento
    this.resetForm();
  }

  onSubmit(form: NgForm){

    this.service.addVendedor(this.service.formDataV).subscribe(res =>{
      
      this.movimientos(this.movimiento)
      console.log(res);
      Swal.fire({
        icon: 'success',
        title: 'Vendedor Agregado',
        text: '',
        timer: 1500
      })
    })
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


  resetForm(){
    // if (form != null)
    // format.resetForm();

    this.service.formDataV = {
      IdVendedor: 0,
      Nombre: ''
    }
  }
  onClose() {
    this.dialogbox.close();
    this.service.filter('Register click');
  }
}
