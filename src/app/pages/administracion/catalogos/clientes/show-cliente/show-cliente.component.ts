import { Component, OnInit, ViewChild } from '@angular/core';

import {MatTableDataSource, MatSort} from '@angular/material';
import { Cliente } from '../../../../../Models/catalogos/clientes-model';
import { ClientesService } from '../../../../../services/catalogos/clientes.service';

import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { AddClienteComponent } from '../add-cliente/add-cliente.component';
import { EditClienteComponent } from '../edit-cliente/edit-cliente.component';


@Component({
  selector: 'app-show-cliente',
  templateUrl: './show-cliente.component.html',
  styles: []
})
export class ShowClienteComponent implements OnInit {

  listData: MatTableDataSource<any>;
  displayedColumns : string [] = [ 'Nombre', 'RFC', 'RazonSocial', 'Calle', 'Colonia', 'CP', 'Ciudad', 'Estado',  'NumeroExterior','ClaveProveedor', 'Estatus', 'Options'];
  @ViewChild(MatSort, null) sort : MatSort;

  constructor(private service:ClientesService, private dialog: MatDialog, private snackBar: MatSnackBar) {

    this.service.listen().subscribe((m:any)=>{
      console.log(m);
      this.refreshClientesList();
      });

   }

  ngOnInit() {
    this.refreshClientesList();
  }

  refreshClientesList() {

    this.service.getClientesList().subscribe(data => {
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
    //console.log(this.listData);
    });

  }

  onDelete( id:number){
    //console.log(id);
    if ( confirm('Are you sure to delete?')) {
      this.service.deleteCliente(id).subscribe(res => {
      this.refreshClientesList();
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
    this.dialog.open(AddClienteComponent, dialogConfig);

  }

  onEdit(cliente: Cliente){
// console.log(usuario);
this.service.formData = cliente;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    this.dialog.open(EditClienteComponent, dialogConfig);
  }

  applyFilter(filtervalue: string){  
    this.listData.filter= filtervalue.trim().toLocaleLowerCase();

  }
}
