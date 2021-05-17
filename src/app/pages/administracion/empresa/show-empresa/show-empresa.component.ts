import { Component, OnInit, ViewChild } from '@angular/core';

import xml2js from 'xml2js';

import { processors } from 'xml2js'

import {MatTableDataSource, MatSort, MatPaginator, MatDialogRef} from '@angular/material';

import { Empresa } from '../../../../Models/Empresas/empresa-model';

import { EmpresaService } from '../../../../services/empresas/empresa.service';

import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';

import { EditEmpresaComponent } from '../edit-empresa/edit-empresa.component';

import Swal from 'sweetalert2';

import { NgForm } from '@angular/forms';

import { DomSanitizer } from '@angular/platform-browser';

import { HttpClient } from '@angular/common/http';

import { DatePipe } from '@angular/common';

import { Evento } from 'src/app/Models/eventos/evento-model';

import { EventosService } from 'src/app/services/eventos/eventos.service';

import { ConnectionHubServiceService } from 'src/app/services/shared/ConnectionHub/connection-hub-service.service';

let origen: { origen: string, titulo: string }[] = [
  {"origen": "Administracion", "titulo": 'Empresa'}
]


@Component({
  selector: 'app-show-empresa',
  templateUrl: './show-empresa.component.html',
  styleUrls: ['./show-empresa.component.css']
})
export class ShowEmpresaComponent implements OnInit {
  
  fotoSubir: string;
  empresaFoto: any;
  arrfoto: Array<any> = [];

  modulo: string = 'Editar Empresa'

  // listData: MatTableDataSource<any>;
  // displayedColumns: string [] = [ 'Razon Social', 'RFC', 'Calle', 'Numero Interior', 'Numero Exterior', 'Codigo Postal', 
  // 'Colonia', 'Ciudad', 'Estado', 'Pais', 'Regimen', 'Options'];
  // @ViewChild(MatSort, null) sort : MatSort;
  // @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(public dialogbox: MatDialogRef<ShowEmpresaComponent>, public service:EmpresaService, private dialog: MatDialog, private snackBar: MatSnackBar, private sanitizer: DomSanitizer, private http: HttpClient,
    private datePipe:DatePipe,
    private eventosService:EventosService, 
    private ConnectionHubService: ConnectionHubServiceService,) {
    // this.Iniciar();

    this.service.listen().subscribe((m:any) =>{

      // this.refreshEmpresaList();
      
      this.refreshEmpresaFoto();
    });

   }

  ngOnInit() {
    this.ConnectionHubService.ConnectionHub(origen[0]);
    // this.refreshEmpresaList();
    this.refreshEmpresaFoto();
  }

  // Iniciar(){
  //   this.service.formData = {
  //     IdEmpresa: 0,
  //     RazonSocial: '',
  //     RFC: '',
  //     Calle: '',
  //     NumeroInterior: 0,
  //     NumeroExterior: 0,
  //     CP: 0,
  //     Colonia: '',
  //     Ciudad: '',
  //     Estado: '',
  //     Pais: '',
  //     Regimen: '',
  //   }
  // }

  // refreshEmpresaList(){

  //   this.service.getEmpresaList().subscribe(data =>{
  //     //console.log(data[0]);
  //     // this.service.formData = data[0];
  //     // this.listData = new MatTableDataSource(data);
  //     // this.listData.sort = this.sort;
  //     // this.listData.paginator = this.paginator;
  //     // this.listData.paginator._intl.itemsPerPageLabel = 'Empresas por Pagina';
  //   })
  // }

  refreshEmpresaFoto(foto?: string){
    //console.log(this.service.getEmpresaFoto());
    this.service.getEmpresaFoto().subscribe(data => {
      console.log(data);
    })
    
  }

  seleccionImagen(event){

    console.log(event.src)

  
    if(!event){
      this.fotoSubir = null;
      return; 
    }
    // console.log(event)
    // console.log(event.target.value)
    // console.log(encodeURI(event.target.value));

    this.fotoSubir = event.src;

    this.refreshEmpresaFoto(this.fotoSubir);

  }
  onClose() {
    this.dialogbox.close();
    this.service.filter('Register click');
  }


  cambiarImagen(){


    // console.log(this.fotoSubir);
    this.service.formData.Foto = this.fotoSubir
    console.log(this.fotoSubir);
    console.log(this.service.formData);

    let FotoFinal = {
      "IdEmpresa": this.service.formData.IdEmpresa,
      "Foto": this.fotoSubir
    }

    this.service.updateEmpresaFoto(FotoFinal).subscribe(resp =>{
      console.log(resp)
      this.ConnectionHubService.on(origen[0])
        Swal.fire({
        icon: 'success',
        title: ' Foto de Empresa Actualizada'
      })  

    })

      // this.fotoSubir = event.target.value;
    //  console.log(this.fotoSubir)

    // this.service.subirArchivo(this.fotoSubir)
    // .subscribe(data =>{

    //   console.log(data)
    //   Swal.fire({
    //     icon: 'success',
    //     title: ' Foto de Empresa Actualizada'
    //   })
    // })

  }

  onSubmit(form: NgForm) {
    
    this.service.updateEmpresa(form.value).subscribe(res => {
      
      this.ConnectionHubService.on(origen[0])
      console.log(res);
this.movimientos(this.modulo)    
      
      Swal.fire({
        icon: 'success',
        title: 'Empresa Actualizada'
      })
    });
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
      console.log('%c%s', 'color: #8c0038', movimiento);
      this.eventosService.addEvento(evento).subscribe(respuesta =>{
        console.log(respuesta);
      })      
    }
}
    
  

}
