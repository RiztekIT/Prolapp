import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialogConfig, MatDialog } from '@angular/material';
import { EventosService } from 'src/app/services/eventos/eventos.service';
import Swal from 'sweetalert2';
import { Cliente, PosserviceService } from '../../posservice.service';
import { PosaddeditclientesComponent } from './posaddeditclientes/posaddeditclientes.component';


import { ConnectionHubServiceService } from './../../../../services/shared/ConnectionHub/connection-hub-service.service';


let origen: { origen: string, titulo: string }[] = [
  {"origen": "POS", "titulo": 'Cliente'}
]


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

  constructor(public posSVC: PosserviceService, private dialog: MatDialog,
    private eventosService:EventosService,
    private ConnectionHubService: ConnectionHubServiceService,) { }

  ngOnInit() {
    this.ConnectionHubService.ConnectionHub(origen[0]);
    this.refreshTabla()
  }

  applyFilter(filtervalue: string){  
    this.listData.filter= filtervalue.trim().toLocaleLowerCase();

    this.ConnectionHubService.listenPOSCliente().subscribe((m:any)=>{
      this.refreshTabla();
      });
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

  onEdit(cliente){

    console.log(cliente);
    this.posSVC.clientesForm = cliente;
    this.posSVC.addeditclientes = 'Editar';

    this.eventosService.movimientos('POS Editar Cliente')
const dialogConfig = new MatDialogConfig();
dialogConfig.disableClose = false;
dialogConfig.autoFocus = true;
dialogConfig.width="70%";
this.dialog.open(PosaddeditclientesComponent, dialogConfig);

  }

  onDelete(row){

    console.log(row);
    Swal.fire({
      title: '¿Seguro de Borrar el Cliente?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        let consulta2 = {
          'consulta':"delete from cliente where idcliente="+row.idCLiente
        };
        
        
        console.log(consulta2);
        this.posSVC.generarConsulta(consulta2).subscribe(res => {
          this.refreshTabla();
          this.ConnectionHubService.on(origen[0]);
          
          this.eventosService.movimientos('POS Cliente Borrado')
          Swal.fire({
            title: 'Borrado',
            icon: 'success',
            timer: 1000,
            showCancelButton: false,
            showConfirmButton: false
        });
        this.refreshTabla();
          });
      }
    })

  }

  onAdd(){

    this.posSVC.clientesForm = new Cliente();
    this.posSVC.addeditclientes = 'Agregar';

    this.eventosService.movimientos('POS Agregar Cliente')
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
