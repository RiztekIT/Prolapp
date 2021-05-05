import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { BodegasService } from '../../../../../services/catalogos/bodegas.service';
import { Bodega } from '../../../../../Models/catalogos/bodegas-model';
import { Form, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';


import { DatePipe } from '@angular/common';
import { UsuariosServieService } from '../../../../../services/catalogos/usuarios-servie.service';
import { EventosService } from '../../../../../services/eventos/eventos.service';
import { Evento } from '../../../../../Models/eventos/evento-model';

import { ConnectionHubServiceService } from '../../../../../services/shared/ConnectionHub/connection-hub-service.service';


let origen: { origen: string, titulo: string }[] = [
  {"origen": "Administracion", "titulo": 'Bodega'}
]
let origenNotificacion =[] = [
  {
  "IdNotificacion": 0,
  "Folio": 0,
  "IdUsuario": '',
  "Usuario": '',
  "Mensaje": '',
  "ModuloOrigen": '',
  "FechaEnvio": '',
  "origen": "Administracion", 
  "titulo": 'Bodega',
  "datosExtra": '',
  },
]

@Component({
  selector: 'app-aebodega',
  templateUrl: './aebodega.component.html',
  styleUrls: ['./aebodega.component.css']
})
export class AEBodegaComponent implements OnInit {

  BodegaInfo;
  tipoAE;
  tipo;
  movimiento;
  usuariosesion;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public BodegaService: BodegasService,
    public dialogbox: MatDialogRef<AEBodegaComponent>,
    private usuarioService: UsuariosServieService,
    private datePipe: DatePipe,
    private eventosService: EventosService,
    private ConnectionHubService: ConnectionHubServiceService,
    ) { }

  ngOnInit() {
    
    this.ConnectionHubService.ConnectionHub(origen[0]);
    this.usuariosesion = JSON.parse(localStorage.getItem('ProlappSession'));
    this.BodegaInfo = this.data;
    this.tipoAE = this.BodegaInfo.tipo
    this.movimiento = this.BodegaInfo.movimiento

    this.tipo = this.tipoAE;

    console.log(this.BodegaInfo.data);
    console.log('this.tipoAE: ', this.tipoAE);

    this.IdentificartipoModal(this.BodegaInfo.data, this.tipoAE)
  }

  IdentificartipoModal(bodegaInfo: Bodega, tipoAE: string){

if(tipoAE == 'Editar'){

  this.ModalEdit(bodegaInfo);
}
// en este caso no se requirio el identificar agregar ya que debe estar los campos en blancos y 
// no requiere alguna funcion en especifico


  }

  ModalEdit(bodegainfo: Bodega){
    console.log(bodegainfo);
    this.BodegaService.formData = bodegainfo
  }




  BotonAE(){
    if (this.tipoAE == 'Editar') {
      console.log('this.BodegaService.formData: ', this.BodegaService.formData);
      this.BodegaService.editBodega(this.BodegaService.formData).subscribe(res=> {
        this.ConnectionHubService.on(origen[0])
        console.log(res);

        this.movimientos(this.movimiento)

      })
      Swal.fire({
        title: 'Bodega Actualizada',
        icon: 'success',
        timer: 1000
      })
      
    } else {
      console.log('this.BodegaService.formData: ', this.BodegaService.formData);
      this.BodegaService.formData.IdBodega = 0;
      this.BodegaService.addBodega(this.BodegaService.formData).subscribe(res=> {
        
        let datosExtra = this.BodegaService.formData.Nombre
        this.ConnectionHubService.generarNotificacion(origenNotificacion[0], datosExtra)
        this.ConnectionHubService.on(origen[0])
        console.log(res);

        this.movimientos(this.movimiento)
      })
      
      Swal.fire({
        title: 'Bodega Agregada',
        icon: 'success',
        timer: 1000
      })
    }
    
    this.BodegaService.filter('Register click');
    this.resetForm()
    this.onClose();
  }

  resetForm(form?: NgForm) {
    if (form != null)
   form.resetForm();
   this.BodegaService.formData  = {
     IdBodega: 0,
     Nombre: '',
     Direccion: '',
     Origen: ''
   }

  }

  onClose() {
    this.dialogbox.close();
    this.resetForm()
    
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
