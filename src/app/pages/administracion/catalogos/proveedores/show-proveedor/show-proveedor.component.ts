import { Component, OnInit, ViewChild } from '@angular/core';

import {MatTableDataSource, MatSort} from '@angular/material';
import { Proveedor } from '../../../../../Models/catalogos/proveedores-model';
import { ProveedoresService } from '../../../../../services/catalogos/proveedores.service';

import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { AddProveedorComponent } from '../add-proveedor/add-proveedor.component';
import { EditProveedorComponent } from '../edit-proveedor/edit-proveedor.component';

@Component({
  selector: 'app-show-proveedor',
  templateUrl: './show-proveedor.component.html',
  styles: []
})
export class ShowProveedorComponent implements OnInit {

  listData: MatTableDataSource<any>;
  displayedColumns : string [] = [ 'Nombre', 'RFC', 'RazonSocial', 'Calle', 'Colonia', 'CP', 'Ciudad', 'Estado', 'NumeroExterior', 'ClaveProveedor', 'Estatus', 'Options'];
  @ViewChild(MatSort, null) sort : MatSort;

  constructor(private service:ProveedoresService, private dialog: MatDialog, private snackBar: MatSnackBar) {

    this.service.listen().subscribe((m:any)=>{
      console.log(m);
      this.refreshProveedoresList();
      });

   }

  ngOnInit() {
    this.refreshProveedoresList();
  }

  refreshProveedoresList() {

    this.service.getProveedoresList().subscribe(data => {
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
    //console.log(this.listData);
    });

  }

  onDelete( id:number){
    //console.log(id);
    if ( confirm('Are you sure to delete?')) {
      this.service.deleteProveedor(id).subscribe(res => {
      this.refreshProveedoresList();
      this.snackBar.open(res.toString(), '', {
        duration: 3000,
        verticalPosition: 'top'
      });

      });
    }

  }

  onAdd(){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    this.dialog.open(AddProveedorComponent, dialogConfig);

  }

  onEdit(proveedor: Proveedor){
// console.log(usuario);
this.service.formData = proveedor;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    this.dialog.open(EditProveedorComponent, dialogConfig);
  }

  applyFilter(filtervalue: string){  
    this.listData.filter= filtervalue.trim().toLocaleLowerCase();

  }

}
