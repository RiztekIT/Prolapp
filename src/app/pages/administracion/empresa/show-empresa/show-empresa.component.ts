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


@Component({
  selector: 'app-show-empresa',
  templateUrl: './show-empresa.component.html',
  styleUrls: ['./show-empresa.component.css']
})
export class ShowEmpresaComponent implements OnInit {
  
  fotoSubir: string;
  empresaFoto: any;

  // listData: MatTableDataSource<any>;
  // displayedColumns: string [] = [ 'Razon Social', 'RFC', 'Calle', 'Numero Interior', 'Numero Exterior', 'Codigo Postal', 
  // 'Colonia', 'Ciudad', 'Estado', 'Pais', 'Regimen', 'Options'];
  // @ViewChild(MatSort, null) sort : MatSort;
  // @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(public dialogbox: MatDialogRef<ShowEmpresaComponent>, public service:EmpresaService, private dialog: MatDialog, private snackBar: MatSnackBar, private sanitizer: DomSanitizer, private http: HttpClient ) {
    this.Iniciar();

    this.service.listen().subscribe((m:any) =>{

      this.refreshEmpresaList();
      
      this.refreshEmpresaFoto();
    });

   }

  ngOnInit() {
    this.refreshEmpresaList();
    this.refreshEmpresaFoto();
  }

  Iniciar(){
    this.service.formData = {
      IdEmpresa: 0,
      RazonSocial: '',
      RFC: '',
      Calle: '',
      NumeroInterior: 0,
      NumeroExterior: 0,
      CP: 0,
      Colonia: '',
      Ciudad: '',
      Estado: '',
      Pais: '',
      Regimen: '',
    }
  }

  refreshEmpresaList(){

    this.service.getEmpresaList().subscribe(data =>{
      //console.log(data[0]);
      this.service.formData = data[0];
      // this.listData = new MatTableDataSource(data);
      // this.listData.sort = this.sort;
      // this.listData.paginator = this.paginator;
      // this.listData.paginator._intl.itemsPerPageLabel = 'Empresas por Pagina';
    })
  }

  refreshEmpresaFoto(foto?: string){
    //console.log(this.service.getEmpresaFoto());
    this.service.getEmpresaFoto().subscribe(data => {
      console.log(data);
      
     let objectURL = data[0].Foto;
     // let objectURL = foto;

         this.empresaFoto = this.sanitizer.bypassSecurityTrustUrl(objectURL);


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
    console.log(this.service.formData);

    this.service.updateEmpresaFoto(this.service.formData).subscribe(resp =>{
      console.log(resp)
        Swal.fire({
        icon: 'success',
        title: ' Foto de Empresa Actualizada'
      })
      this.refreshEmpresaFoto();

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

  onEdit(empresa: Empresa){
    
    this.service.formData = empresa;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true; 
    dialogConfig.width = "70%";
    this.dialog.open(EditEmpresaComponent, dialogConfig);
  }

  onSubmit(form: NgForm) {
    
    this.service.updateEmpresa(form.value).subscribe(res => {
      console.log(res);
      
      Swal.fire({
        icon: 'success',
        title: 'Empresa Actualizada'
      })
    });
  }



    
  

}
