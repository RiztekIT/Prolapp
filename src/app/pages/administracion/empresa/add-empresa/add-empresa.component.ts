import { Component, OnInit } from '@angular/core';

import { MatDialogRef, MatSnackBar } from '@angular/material';

import { EmpresaService } from '../../../../services/empresas/empresa.service';

import Swal from 'sweetalert2';

import { NgForm, FormControl } from '@angular/forms';

import { map, startWith } from 'rxjs/operators';

import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import { DatePipe } from '@angular/common';

import { Evento } from 'src/app/Models/eventos/evento-model';

import { EventosService } from 'src/app/services/eventos/eventos.service';

import { ConnectionHubServiceService } from 'src/app/services/shared/ConnectionHub/connection-hub-service.service';

let origen: { origen: string, titulo: string }[] = [
  {"origen": "Administracion", "titulo": 'Empresa'}
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
  "titulo": 'Empresa',
  "datosExtra": '',
  },
]

@Component({
  selector: 'app-add-empresa',
  templateUrl: './add-empresa.component.html',
  styleUrls: ['./add-empresa.component.css']
})
export class AddEmpresaComponent implements OnInit {

  fotoSubir: string;
  idlast: number;

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  modulo:string = 'CrearEmpresa'


  constructor(public dialogbox: MatDialogRef<AddEmpresaComponent>, public router: Router,
    public service: EmpresaService, private snackBar: MatSnackBar, private _formBuilder: FormBuilder,
    private datePipe:DatePipe,
    private eventosService:EventosService,
    private ConnectionHubService: ConnectionHubServiceService, ) { }



  ngOnInit() {
    this.ConnectionHubService.ConnectionHub(origen[0]);
     this.resetForm();
    this.onCreate();

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }




  resetForm(form?: NgForm) {
    if (form != null)
      form.resetForm();

      // this.service.getLastEmpresa().subscribe(data =>{
      
      //   console.log(data[0].IdEmpresa);
  
      //   this.idlast = data[0].IdEmpresa;
  
      // })
      

    this.service.formData = {
        IdEmpresa:0,
        RFC:'',
        RazonSocial:'',
        Calle:'',
        NumeroInterior:0,
        NumeroExterior:0,
        CP:0,
        Colonia:'',
        Ciudad:'',
        Estado:'',
        Pais:'',
        Regimen:'',
        Foto: ''       
    }
    console.log(this.idlast);
  }


  seleccionImagen(event){

    console.log(event.src)

    this.service.getLastEmpresa().subscribe(data =>{
      
      console.log(data);

      this.idlast = data[0].IdEmpresa;

    })

    if(!event){
      this.fotoSubir = null;
      return; 
    }

    this.fotoSubir = event.src;

  }
  
  cambiarImagen(){

    console.log(this.idlast);
    // console.log(this.fotoSubir);
    this.service.formData.Foto = this.fotoSubir
   

    let FotoFinal = {
      "IdEmpresa": this.idlast,
      "Foto": this.fotoSubir
    }

    this.service.updateEmpresaFoto(FotoFinal).subscribe(resp =>{
      console.log(resp)
        Swal.fire({
        icon: 'success',
        title: ' Foto de Empresa Agregada'
      })
    })
  }

  onCreate(){
    this.service.addEmpresa(this.service.formData).subscribe(res =>{
      console.log(res);
      let datosExtra = this.service.formData.RazonSocial
      this.ConnectionHubService.generarNotificacion(origenNotificacion[0], datosExtra)
      this.ConnectionHubService.on(origen[0])
      this.movimientos(this.modulo)
         
    });
  }

  onSubmit(){
    this.service.updateEmpresa(this.service.formData).subscribe(resp =>{
      this.ConnectionHubService.on(origen[0])
      console.log(resp);
    })
  }

  onClose() {
    this.service.getLastEmpresa().subscribe(data =>{
      
      console.log(data);

      this.idlast = data[0].IdEmpresa;

      this.service.deleteEmpresa(this.idlast).subscribe(data=>{
        this.dialogbox.close();
        this.service.filter('Register click');
      })
      
    })
    
  }

  final(){
    this.dialogbox.close();
    this.service.filter('Register click');
  
  }


  
  movimientos(movimiento?){
    let userData = JSON.parse(localStorage.getItem("userAuth"))
    let idUser = userData.IdUsuario
    let evento = new Evento();
    let fecha = new Date();
    evento.IdUsuario = idUser
    evento.Autorizacion = '0'
    evento.Fecha = this.datePipe.transform(fecha, 'yyyy-MM-dd, h:mm:ss a');
    evento.Movimiento = movimiento
    console.log(evento);
    if (movimiento) {
      this.eventosService.addEvento(evento).subscribe(respuesta =>{
        console.log(respuesta);
      })      
    }
}






}
