import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatTooltip } from '@angular/material';
import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { Cliente } from '../../../Models/catalogos/clientes-model';
import { ClientesService } from '../../../services/catalogos/clientes.service';
import { AddExpedienteComponent } from './add-expediente/add-expediente.component';

@Component({
  selector: 'app-expediente',
  templateUrl: './expediente.component.html',
  styleUrls: ['./expediente.component.css']
})
export class ExpedienteComponent implements OnInit {


  constructor(private service:ClientesService, private dialog: MatDialog) {

  }

  ngOnInit() {
    this.refreshClientesList();
  }

  displayedColumns : string [] = [ 'ClaveCliente', 'Nombre', 'RFC', 'RazonSocial', 'Contacto', 'Telefono', 'Correo' ,'Options'];
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  listData: MatTableDataSource<any>;


  
  refreshClientesList() {

    this.service.getClientesContactoList().subscribe(data => {
      // console.log(data);
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Clientes por Pagina';
      // console.log(this.listData);

  });
}

addDocumento(cliente?: Cliente){
 this.service.objetoCliente = new Cliente();
  if(cliente){
  this.service.objetoCliente = cliente;
  }
  const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    this.dialog.open(AddExpedienteComponent, dialogConfig);
}
  
  applyFilter(filtervalue: string){  
    this.listData.filter= filtervalue.trim().toLocaleLowerCase();

  }

}
