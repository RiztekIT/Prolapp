import { Component, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource, MatPaginator, MatTable, MatDialog, MatSnackBar, MatDialogConfig} from '@angular/material';
import {MatSort} from '@angular/material/sort';
import { trigger, state, transition, animate, style } from '@angular/animations';
import Swal from 'sweetalert2';
import { Empresa } from 'src/app/Models/Empresas/empresa-model';
import { EmpresaService } from 'src/app/services/empresas/empresa.service';
import { DomSanitizer } from '@angular/platform-browser';

import { AddEmpresaComponent } from './add-empresa/add-empresa.component';
import { ShowEmpresaComponent } from './show-empresa/show-empresa.component';


@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})
export class EmpresaComponent implements OnInit {

  empresaFoto: any;
  arrfoto: Array<any> = [];

  constructor(public router: Router, private dialog: MatDialog, public service: EmpresaService, private _formBuilder: FormBuilder, private sanitizer: DomSanitizer ) { 

    this.service.listen().subscribe((m:any)=>{
      this.refreshEmpresaList();
    });

  }

  ngOnInit() {
    this.refreshEmpresaList();
    this.refreshEmpresaFoto();
  }

  listData: MatTableDataSource<any>;
  displayedColumns: string [] = ['Imagen', 'RazonSocial' ,'RFC', 'Calle', 'NumeroInterior', 'NumeroExterior', 'CP', 'Colonia', 'Ciudad', 'Estado', 'Pais', 'Regimen', 'Options'];

  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  refreshEmpresaList(){

    this.service.getEmpresaList().subscribe(data =>{
      //console.log(data[0]);
      this.service.formData = data[0];
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Empresas por Pagina';
    })
  }

  refreshEmpresaFoto(foto?: string){
    console.log(this.service.getEmpresaFoto());


    // this.service.getEmpresaFoto().subscribe(data => {
    //   console.log(data);
      
    //  let objectURL = data[0].Foto;
    //  // let objectURL = foto;

    //      this.empresaFoto = this.sanitizer.bypassSecurityTrustUrl(objectURL);


    // })


    this.service.getEmpresaFoto().subscribe(data => {

      console.log(data);
      
      console.log(data.length);
      for (let i = 0; i <= data.length -1 ; i++){

        console.log(data[i].Foto);

        
        let objectURL = data[i].Foto;

         this.arrfoto[i] = this.sanitizer.bypassSecurityTrustUrl(objectURL);

      }
    })
  }


  onDelete( id:number ){

    Swal.fire({
      title: '¿Seguro que quiere eliminar la empresa?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result)=>{
      if (result.value) {
        // this.service.deleteEmpresa(id).subscribe(res => {
        //   this.refreshEmpresaList();
        //   Swal.fire({
        //     title: ' Empresa Eliminada',
        //     icon: 'success',
        //     timer: 1000,
        //     showCancelButton: false,
        //     showConfirmButton: false
        // });
        //   });
      }
    })
  }

  onAdd(){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    this.dialog.open(AddEmpresaComponent, dialogConfig);

  }

  onEdit(empresa: Empresa){
    // console.log(usuario);
    this.service.formData = empresa;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width="70%";
        this.dialog.open(ShowEmpresaComponent, dialogConfig);
      }
    
      applyFilter(filtervalue: string){  
        this.listData.filter= filtervalue.trim().toLocaleLowerCase();
    
      }
}
