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

@Component({
  selector: 'app-add-proveedor',
  templateUrl: './add-proveedor.component.html',
  styleUrls: ['./add-proveedor.component.css']
})
export class AddProveedorComponent implements OnInit {


  BodegaInfo
  movimiento
  usuariosesion

  constructor(public dialogbox: MatDialogRef<AddProveedorComponent>,
    public service: ProveedoresService, private snackBar: MatSnackBar,
    private usuarioService: UsuariosServieService,
    private datePipe: DatePipe,
    private eventosService: EventosService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    ) { }

  ngOnInit() {
    this.usuariosesion = JSON.parse(localStorage.getItem('ProlappSession'));
    this.BodegaInfo = this.data;
    this.movimiento = this.BodegaInfo.movimiento
    this.resetForm();
  }


  resetForm(form?: NgForm) {
    if (form != null)
      form.resetForm();

    this.service.formData = {
      IdProveedor: 0,
      Nombre: '',
      RFC: '',
      RazonSocial: '',
      Calle: '',
      Colonia: '',
      CP: '',
      Ciudad: '',
      Estado: '',
      NumeroInterior: '',
      NumeroExterior: '',
      ClaveProveedor: '',
      Estatus: '',
      LimiteCredito: '',
      DiasCredito: '',
      MetodoPago: '',
      UsoCFDI: ''
    }
  }

  onClose() {
    this.dialogbox.close();
    this.service.filter('Register click');
  }

  onSubmit(form: NgForm) {
    // console.log(form.value);
    this.service.addProveedor(form.value).subscribe(res => {
      this.resetForm(form);
      // this.snackBar.open(res.toString(), '', {
      //   duration: 5000,
      //   verticalPosition: 'top'
      // });
      this.movimientos(this.movimiento)
      Swal.fire({
        icon: 'success',
        title: 'Proveedor Agregado'
      })
    }
    );
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
