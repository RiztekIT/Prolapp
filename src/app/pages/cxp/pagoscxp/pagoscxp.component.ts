import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import {MatTableDataSource, MatPaginator, MatTable, MatDialog, MatSnackBar, MatDialogConfig} from '@angular/material';
import {MatSort} from '@angular/material/sort';
import { PagoscxpService } from '../../../services/cuentasxpagar/pagoscxp.service';
import { Pagos } from '../../../Models/Pagos/pagos-model';
import { PagoDocumentoComponent } from './pago-documento/pago-documento.component';


import { ConnectionHubServiceService } from './../../../services/shared/ConnectionHub/connection-hub-service.service';


let origen: { origen: string, titulo: string }[] = [
  {"origen": "Cxp", "titulo": 'Pago'}
]

@Component({
  selector: 'app-pagoscxp',
  templateUrl: './pagoscxp.component.html',
  styleUrls: ['./pagoscxp.component.css']  
})
export class PagoscxpComponent implements OnInit {

  constructor(public pagosService: PagoscxpService , private dialog: MatDialog,
    private ConnectionHubService: ConnectionHubServiceService,) {
    this.pagosService.listen().subscribe((m:any)=>{
      this.obtenerPagos();
      });
      
    this.ConnectionHubService.listenPago().subscribe((m:any)=>{
      this.obtenerPagos();
      });
   }

  ngOnInit() {
    this.obtenerPagos();
  }

  displayedColumns: string [] = ['Folio', 'TipoDocumento', 'FolioDocumento', 'Cantidad', 'CuentaOrigen', 'CuentaDestino', 'FechaPago', 'Observaciones', 'Options'];
  // Compra Administrativa
  listDataCAdministrativa: MatTableDataSource<any>;
  @ViewChild(MatSort, null) sortCAdministrativa : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginatorCAdministrativa: MatPaginator;
// Compras Materia Prima
listDataCPrima: MatTableDataSource<any>;
@ViewChild(MatSort, null) sortCPrima: MatSort;
@ViewChild(MatPaginator, {static: true}) paginatorCPrima: MatPaginator;
// Fletes
listDataFlete: MatTableDataSource<any>;
@ViewChild(MatSort, null) sortFlete: MatSort;
@ViewChild(MatPaginator, {static: true}) paginatorFlete: MatPaginator;
// Comisiones
listDataComision: MatTableDataSource<any>;
@ViewChild(MatSort, null) sortComision: MatSort;
@ViewChild(MatPaginator, {static: true}) paginatorComision: MatPaginator;
// Nominas
listDataNomina: MatTableDataSource<any>;
@ViewChild(MatSort, null) sortNomina: MatSort;
@ViewChild(MatPaginator, {static: true}) paginatorNomina: MatPaginator;

arregloTipoDocumentos = [
  {TipoDocumento: 'CAdministrativa'},
  {TipoDocumento: 'CMateriaPrima'},
  {TipoDocumento: 'Flete'},
  {TipoDocumento: 'Comision'},
  {TipoDocumento: 'Otros Servicios'},
]




  obtenerPagos(){
    for (let i = 0; i <= this.arregloTipoDocumentos.length - 1; i++) {
console.log(this.arregloTipoDocumentos[i].TipoDocumento);
this.pagosService.getPagoTipo(this.arregloTipoDocumentos[i].TipoDocumento).subscribe(dataPago=>{
  console.log(dataPago);
  if(dataPago.length>0){
    this.tablaPago(this.arregloTipoDocumentos[i].TipoDocumento, dataPago);
  }
})
}
  }
//Llenar tabla en base a modulo
  tablaPago(tipoDocumento: string, data: any){
    switch (tipoDocumento) {
      case ('CAdministrativa'):
    this.listDataCAdministrativa = new MatTableDataSource(data);
  this.listDataCAdministrativa.sort = this.sortCAdministrativa;
  this.listDataCAdministrativa.paginator = this.paginatorCAdministrativa;
  this.listDataCAdministrativa.paginator._intl.itemsPerPageLabel = 'Compras por Pagina';
        break;
      case ('CMateriaPrima'):
        this.listDataCPrima = new MatTableDataSource(data);
        this.listDataCPrima.sort = this.sortCPrima;
        this.listDataCPrima.paginator = this.paginatorCPrima;
        this.listDataCPrima.paginator._intl.itemsPerPageLabel = 'Compras por Pagina';
        break;
      case ('Flete'):
        this.listDataFlete = new MatTableDataSource(data);
        this.listDataFlete.sort = this.sortFlete;
        this.listDataFlete.paginator = this.paginatorFlete;
        this.listDataFlete.paginator._intl.itemsPerPageLabel = 'Fletes por Pagina';
        break;
      case ('Comision'):
        this.listDataComision = new MatTableDataSource(data);
        this.listDataComision.sort = this.sortComision;
        this.listDataComision.paginator = this.paginatorComision;
        this.listDataComision.paginator._intl.itemsPerPageLabel = 'Comisiones por Pagina';
        break;
      /* case ('Nomina'): */
      default:
        this.listDataNomina = new MatTableDataSource(data);
        this.listDataNomina.sort = this.sortNomina;
        this.listDataNomina.paginator = this.paginatorNomina;
        this.listDataNomina.paginator._intl.itemsPerPageLabel = 'Otros Pagos por Pagina';
        break;
    }

  }

  onAccederPago(modulo:string, objetoModulo?: any, pago?:any){
    console.log('ABRIR MODAL PARA GENERAR EL PAGO');
    console.log(modulo);
    console.log(objetoModulo);
    console.log(pago);
    this.pagosService.modulo = modulo;
    this.pagosService.objetoModulo = {};
    this.pagosService.objetoPago = <Pagos>{};
    if(pago){
      console.log('SE LE PICO A EL PAGO');
      this.pagosService.objetoPago = pago;
      this.pagosService.nuevoPago = false;
      switch (modulo) {
        case ('CAdministrativa'):
          this.pagosService.getCompraFolio(pago.FolioDocumento).subscribe(resC=>{
            console.log(resC);
            this.pagosService.objetoModulo = resC[0];
            this.abrirModal();
          });
          break;
        case ('CMateriaPrima'):
          this.pagosService.getCompraFolio(pago.FolioDocumento).subscribe(resCM=>{
            console.log(resCM);
            this.pagosService.objetoModulo = resCM[0];
            this.abrirModal();
          });
          break;
        case ('Flete'):
          this.pagosService.getFacturaFleteId(pago.FolioDocumento).subscribe(resFlete=>{
            console.log(resFlete);
            this.pagosService.objetoModulo = resFlete[0];
            this.abrirModal();
          });
          break;
        case ('Comision'):
          this.pagosService.getComisionFolio(pago.FolioDocumento).subscribe(resComi=>{
            console.log(resComi);
            this.pagosService.objetoModulo = resComi[0];
            this.abrirModal();
          });  
          break;
        case ('Nomina'):
          
          break;
        default:
          break;
      }
    }else{
      console.log('SE LE PICO AL MODULO');
      this.pagosService.objetoModulo = objetoModulo;
      this.pagosService.nuevoPago = true;
      this.abrirModal();
    }    
  }

  abrirModal(){
 //abrir modal
 const dialogConfig = new MatDialogConfig();
 dialogConfig.disableClose = true;
 dialogConfig.autoFocus = true;
 dialogConfig.height = "90%";
 this.dialog.open(PagoDocumentoComponent, dialogConfig);
  }

  applyFilter(filtervalue: string,tipoDocumento: string ){  
  
    switch (tipoDocumento) {
      case ('CAdministrativa'):
        this.listDataCAdministrativa.filter= filtervalue.trim().toLocaleLowerCase();  
        break;
      case ('CMateriaPrima'):
        this.listDataCPrima.filter= filtervalue.trim().toLocaleLowerCase();  
        break;
      case ('Flete'):
        this.listDataFlete.filter= filtervalue.trim().toLocaleLowerCase();  
        break;
      case ('Comision'):
        this.listDataComision.filter= filtervalue.trim().toLocaleLowerCase();  
        break;
        default:
        this.listDataNomina.filter= filtervalue.trim().toLocaleLowerCase();  
        break;
     
    }
  }


}
