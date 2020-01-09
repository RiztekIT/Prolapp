import { Component, OnInit, ViewChild } from '@angular/core';

import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import { Empresa } from '../../../../Models/Empresas/empresa-model';
import { EmpresaService } from '../../../../services/empresas/empresa.service';

import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { EditEmpresaComponent } from '../edit-empresa/edit-empresa.component';

import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-show-empresa',
  templateUrl: './show-empresa.component.html',
  styleUrls: ['./show-empresa.component.css']
})
export class ShowEmpresaComponent implements OnInit {

  // listData: MatTableDataSource<any>;
  // displayedColumns: string [] = [ 'Razon Social', 'RFC', 'Calle', 'Numero Interior', 'Numero Exterior', 'Codigo Postal', 
  // 'Colonia', 'Ciudad', 'Estado', 'Pais', 'Regimen', 'Options'];
  // @ViewChild(MatSort, null) sort : MatSort;
  // @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private service:EmpresaService, private dialog: MatDialog, private snackBar: MatSnackBar) {
    this.Iniciar();

    this.service.listen().subscribe((m:any) =>{

      this.refreshEmpresaList();
    });

   }

  ngOnInit() {
    this.refreshEmpresaList();
  }

  Iniciar(){
    this.service.formData = {
      IdEmpresa: 0,
      RazonSocial: '',
      RFC: '',
      Calle: '',
      NumeroInterior: '',
      NumeroExterior: '',
      CP: '',
      Colonia: '',
      Ciudad: '',
      Estado: '',
      Pais: '',
      Regimen: '',
    }
  }

  refreshEmpresaList(){

    this.service.getEmpresaList().subscribe(data =>{
      // console.log(data[0]);
      this.service.formData = data[0];
      // this.listData = new MatTableDataSource(data);
      // this.listData.sort = this.sort;
      // this.listData.paginator = this.paginator;
      // this.listData.paginator._intl.itemsPerPageLabel = 'Empresas por Pagina';
    })
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
      // this.snackBar.open(res.toString(), '', {
      //   duration: 5000,
      //   verticalPosition: 'top'
      // });
      Swal.fire({
        icon: 'success',
        title: 'Proveedor Actualizado'
      })
    });
  }
  

}
