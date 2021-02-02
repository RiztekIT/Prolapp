import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialogConfig, MatDialog } from '@angular/material';
import Swal from 'sweetalert2';
import { Cliente, PosserviceService } from '../../posservice.service';
import { PosaddeditclientesComponent } from './posaddeditclientes/posaddeditclientes.component';

@Component({
  selector: 'app-poscatclientes',
  templateUrl: './poscatclientes.component.html',
  styleUrls: ['./poscatclientes.component.css']
})
export class PoscatclientesComponent implements OnInit {

  listData: MatTableDataSource<any>;
  displayedColumns : string [] = [ 'ClaveCliente', 'Nombre', 'RFC', 'RazonSocial' ,'Options'];
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(public posSVC: PosserviceService, private dialog: MatDialog) { }

  ngOnInit() {
    this.refreshTabla()
  }

  applyFilter(filtervalue: string){  
    this.listData.filter= filtervalue.trim().toLocaleLowerCase();

  }

  refreshTabla(){
    let consulta = {
      'consulta':"select * from cliente"
    };
    
    
    console.log(consulta);
    Swal.showLoading();
    console.log('entro');
    this.posSVC.generarConsulta(consulta).subscribe((data:any)=>{
      Swal.close();
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Clientes por Pagina';
    console.log(this.listData);
    })
  }

  onEdit(row){

  }

  onDelete(row){

  }

  onAdd(){

    this.posSVC.clientesForm = new Cliente();
    this.posSVC.addeditclientes = 'Agregar';

const dialogConfig = new MatDialogConfig();
dialogConfig.disableClose = false;
dialogConfig.autoFocus = true;
dialogConfig.width="70%";
let dlg = this.dialog.open(PosaddeditclientesComponent, dialogConfig);
dlg.afterClosed().subscribe(resp=>{
  this.refreshTabla();
})

  }

}
