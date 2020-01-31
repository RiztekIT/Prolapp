import { Component, OnInit, ViewChild } from '@angular/core';

import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { AddVendedorComponent } from '../add-vendedor/add-vendedor.component';
import { EditVendedorComponent } from '../edit-vendedor/edit-vendedor.component';
import Swal from 'sweetalert2';
import { ClientesService } from '../../../../../services/catalogos/clientes.service';
import { Vendedor } from '../../../../../Models/catalogos/vendedores.model';

@Component({
  selector: 'app-show-vendedor',
  templateUrl: './show-vendedor.component.html',
  styleUrls: ['./show-vendedor.component.css']
})
export class ShowVendedorComponent implements OnInit {

  listData: MatTableDataSource<any>;
  displayedColumns: string [] = ['IdVendedor', 'Nombre', 'Options'];

  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private service: ClientesService, private dialog: MatDialog, private snackBar: MatSnackBar,) { 

    this.service.listen().subscribe((m:any)=>{
      this.refreshVendedorList();
    });
  }

  ngOnInit() {
    this.refreshVendedorList();
  }

  refreshVendedorList() {

    this.service.getVendedoresList().subscribe(data => {
      console.log(data);
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Vendedores por Pagina';
    //console.log(this.listData);
    });

  }


  onDelete( id:number){
    //console.log(id);
    Swal.fire({
      title: '¿Seguro de Borrar el Vendedor?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.service.deleteVendedor(id).subscribe(res => {
          this.refreshVendedorList();
          Swal.fire({
            title: 'Borrado',
            icon: 'success',
            timer: 1000,
            showCancelButton: false,
            showConfirmButton: false
        });
          });
      }
    })

  }

  onEdit(vendedor: Vendedor){
    // console.log(usuario);
    this.service.formDataV = vendedor;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width="70%";
        this.dialog.open(EditVendedorComponent, dialogConfig);
      }
    
      applyFilter(filtervalue: string){  
        this.listData.filter= filtervalue.trim().toLocaleLowerCase();
    
      }



}
