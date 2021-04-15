import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import {ThemePalette} from '@angular/material/core';
import { MatDialog, MatDialogConfig, MatSnackBar, MatDivider, MAT_DATE_LOCALE, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ClientesService } from 'src/app/services/catalogos/clientes.service';
import { Cliente } from 'src/app/Models/catalogos/clientes-model';
import { PedidoService } from '../../../services/pedidos/pedido.service';
import { VentasCotizacionService } from '../../../services/ventas/ventas-cotizacion.service';
import { ShowreporteVentasComponent } from './showreporte-ventas/showreporte-ventas.component';
import { EnviarfacturaService } from '../../../services/facturacioncxc/enviarfactura.service';
import { facturaMasterDetalle } from 'src/app/Models/facturacioncxc/facturamasterdetalle';
import { FacturaService } from 'src/app/services/facturacioncxc/factura.service';
import Swal from 'sweetalert2';
import { trigger, state, style, transition, animate } from '@angular/animations';

declare function btn_table();


@Component({
  selector: 'app-reportes-ventas',
  templateUrl: './reportes-ventas.component.html',
  styleUrls: ['./reportes-ventas.component.css'],
  animations: [
    /* Trigger para tabla con detalles, cambio de estado colapsado y expandido y sus estilis */
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0px', visibility: 'hidden'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ReportesVentasComponent implements OnInit {

  listDetalleData;
  displayedColumns : string [] = ['Folio', 'Nombre', 'FechaDeExpedicion', 'Cantidad', 'Total', 'Estado'];
  displayedColumnsVersion : string [] = ['ClaveProducto'];
  listData: MatTableDataSource<any>;
  MasterDetalle = new Array<facturaMasterDetalle>();
  expandedElement: any;
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  constructor(public serviceCliente: ClientesService, private dialog: MatDialog, pedidoService: PedidoService, cotizacionService:VentasCotizacionService,
    private EnviarfacturaService: EnviarfacturaService, private facturaSVC:FacturaService) { }

  ngOnInit() {
 this.obtenerClientes();
 this.refreshFacturaList();
  }

   //Fechas de reportes a ser filtradas
   fechaInicialCotizacion: Date;
   fechaFinalCotizacion: Date;

   fechaInicialPedido: Date;
   fechaFinalPedido: Date;
 
 
 //Variable para Filtrar por fechas / clientes  COTIZACION
 color: ThemePalette = 'accent';
 checkedFechasCotizacion = false;
 disabledFechasCotizacion = false;
 checkedClientesCotizacion = true;
 checkedEstatusCotizacion = false;
 disabledEstatusCotizacion = true;
 
 //Variable para Filtrar por fechas / clientes  PEDIDOS
   checkedFechasPedido = false;
   disabledFechasPedido = false;
   checkedClientesPedido = true;
   checkedEstatusPedido = false;
   disabledEstatusPedido = true;
 
 
   //variable estatus de la Cotizacion (guardada, cerrada, duplicada, Prospecto Pendiente)
   estatusCotizacion: string;
   
   //variable estatus de la Cotizacion (guardada, cerrada)
   estatusPedido: string;
 

   //variables dropdown clientes Cotizacion
   myControlCotizacion = new FormControl();
   filteredOptionsCotizacion: Observable<any[]>
   optionsCotizacion: Cliente[] = [];
   CotizacionClienteNombre: any;
   CotizacionIdCliente: number;

   //variables dropdown clientes pedido
   myControlPedido = new FormControl();
   filteredOptionsPedido: Observable<any[]>
   optionsPedido: Cliente[] = [];
   PedidoClienteNombre: any;
   PedidoIdCliente: number;
 
 
   //Lista de Estatus Pedido
   public listEstatusPedido: Array<Object> = [
     { tipo: 'Guardada' },
     { tipo: 'Cerrada' },
   ];
 
   //Lista de Estatus Cotizacion
   public listEstatusCotizacion: Array<Object> = [
     { tipo: 'Guardada' },
     { tipo: 'Cerrada' },
     { tipo: 'Duplicada' },
     { tipo: 'Prospecto Pendiente' }
   ];

     obtenerClientes(){
       this.serviceCliente.getClientesListIDN().subscribe(data=>{
         console.log(data);
         for (let i = 0; i < data.length; i++) {
           let client = data[i];
           this.optionsCotizacion.push(client)
           this.optionsPedido.push(client)
           this.filteredOptionsCotizacion = this.myControlCotizacion.valueChanges
             .pipe(
               startWith(''),
               map(value => this._filterCotizacion(value))
             );
           this.filteredOptionsPedido = this.myControlPedido.valueChanges
             .pipe(
               startWith(''),
               map(value => this._filterPedido(value))
             );
         }
       })
     }
   
     _filterCotizacion(value: any): any {
       const filterValue = value.toString().toLowerCase();
      return this.optionsCotizacion.filter(option =>
        option.Nombre.toLowerCase().includes(filterValue) ||
        option.IdClientes.toString().includes(filterValue));
    }
     _filterPedido(value: any): any {
       const filterValue = value.toString().toLowerCase();
      return this.optionsCotizacion.filter(option =>
        option.Nombre.toLowerCase().includes(filterValue) ||
        option.IdClientes.toString().includes(filterValue));
    }

    //Al filtrar por fecha
    onChangePorFechaCotizacion(){
      if(this.checkedFechasCotizacion == true){
        this.checkedFechasCotizacion = false;
      }else{
        this.checkedFechasCotizacion = true;
      }
        }
    onChangePorFechaPedido(){
      if(this.checkedFechasPedido == true){
        this.checkedFechasPedido = false;
      }else{
        this.checkedFechasPedido = true;
      }
        }
  

        onSelectionChangeCotizacion(cliente: Cliente, event: any) {
          console.log(cliente);
        this.CotizacionClienteNombre = cliente.Nombre;
      }
        onSelectionChangePedido(cliente: Cliente, event: any) {
          console.log(cliente);
        this.PedidoClienteNombre = cliente.Nombre;
      }

      //Al filtrar cliente
      onChangeTodosClientesCotizacion(){
        if(this.checkedClientesCotizacion == true){
          this.checkedClientesCotizacion = false;
        }else{
          this.checkedClientesCotizacion = true;
        }
      }
      onChangeTodosClientesPedido(){
        if(this.checkedClientesPedido == true){
          this.checkedClientesPedido = false;
        }else{
          this.checkedClientesPedido = true;
        }
      }

      //cuando se filtarara por estatus Cotizacion
  onChangeEstatusCotizacion(){
    if(this.checkedEstatusCotizacion == true){
      this.checkedEstatusCotizacion = false;
    }else{
      this.checkedEstatusCotizacion = true;
    }
  }
//cuando se selecciona un estatus Cotizacion
  changeEstatusCotizacion(event){
    console.log(event);
    this.estatusCotizacion = event.target.selectedOptions[0].text;
  }
      //cuando se filtarara por estatus Pedido
  onChangeEstatusPedido(){
    if(this.checkedEstatusPedido == true){
      this.checkedEstatusPedido = false;
    }else{
      this.checkedEstatusPedido = true;
    }
  }
//cuando se selecciona un estatus pedido
  changeEstatusPedido(event){
    console.log(event);
    this.estatusPedido = event.target.selectedOptions[0].text;
  }

  abrirReporte(moneda: string, modulo: string){

    console.log(modulo);

    //Variables generales
    let filtrarFecha: boolean;
    let fechaStart = new Date();
    let fechaEnd = new Date();

    let estatus: boolean = false;
    let tipoEstatus: string = '';

    let unCliente: boolean = false;
    let IdCliente: number;

if(modulo == 'Cotizacion'){
IdCliente = this.CotizacionIdCliente;
  if(this.checkedFechasCotizacion == true){
    // console.log('SE FILTRA POR FECHA');
      fechaStart = this.fechaInicialCotizacion;
      fechaEnd = this.fechaFinalCotizacion;
      filtrarFecha = true;
  }else{
    filtrarFecha = false;
  }
  if(this.checkedClientesCotizacion == false){
    // console.log(this.checkedProveedores);
    // console.log('SE FILTRA POR PROVEEDORES');
      unCliente = true;
  }
  if(this.checkedEstatusCotizacion == true){
    estatus = true;
    tipoEstatus = this.estatusCotizacion; 
  }

}else if ('Pedido'){
  IdCliente = this.PedidoIdCliente;
  if(this.checkedFechasCotizacion == true){
    // console.log('SE FILTRA POR FECHA');
      fechaStart = this.fechaInicialCotizacion;
      fechaEnd = this.fechaFinalCotizacion;
      filtrarFecha = true;
  }else{
    filtrarFecha = false;
  }
  if(this.checkedClientesCotizacion == false){
    // console.log(this.checkedProveedores);
    // console.log('SE FILTRA POR PROVEEDORES');
      unCliente = true;
  }
  if(this.checkedEstatusCotizacion == true){
    estatus = true;
    tipoEstatus = this.estatusCotizacion; 
  }
}
    
// console.log('TipoReporte', tipoReporte);
// console.log('UnProveedor?', unProveedor);
// console.log('MONEDA:', moneda);
// console.log('IDPROVE', this.IdProveedor);
// console.log('FiltrarFEcha?', this.checked);
// console.log('FiltrarEstatus', estatus);
// console.log('TipoEstatus', tipoEstatus);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    dialogConfig.data = {
      modulo: modulo,
      unsolocliente: unCliente,
      moneda: moneda,
      idCliente: IdCliente,
      filtradoFecha: filtrarFecha,
      fechaInicial: fechaStart,
      fechaFinal: fechaEnd,
      estatus: estatus,
      tipoEstatus: tipoEstatus
      
    }
if (modulo == 'Cotizacion' && moneda == 'ALL') {
  this.EnviarfacturaService.titulo = 'Reporte Cotizacion'
}
else if(modulo == 'Cotizacion' && moneda == 'MXN'){
  this.EnviarfacturaService.titulo = 'Reporte Cotizacion MXN'
}
else if(modulo == 'Cotizacion' && moneda == 'DLLS'){
  this.EnviarfacturaService.titulo = 'Reporte Cotizacion DLLS'
}
else if(modulo == 'Pedido' && moneda == 'ALL'){
  this.EnviarfacturaService.titulo = 'Reporte Pedido'
}
else if(modulo == 'Pedido' && moneda == 'DLLS'){
  this.EnviarfacturaService.titulo = 'Reporte Pedido DLLS'
}
else if(modulo == 'Pedido' && moneda == 'MXN'){
  this.EnviarfacturaService.titulo = 'Reporte Pedido MXN'
}


    this.dialog.open( ShowreporteVentasComponent, dialogConfig);

  }



  refreshFacturaList(){
    
this.listData = new MatTableDataSource();
this.facturaSVC.master = [];

    /* this.facturaSVC.deleteFacturaCreada().subscribe(data=>{ */
      /* console.log(data); */
      
      Swal.showLoading();

  
    this.facturaSVC.getFacturasListCLienteProd().subscribe(data => {
console.log(data)
      for (let i = 0; i <= data.length-1; i++){
        this.facturaSVC.master[i] = data[i]
        this.facturaSVC.master[i].detalle = [];
        if (data[i].IdCliente != 0){
          
          this.facturaSVC.getDetallesFacturaListProd(data[i].Id).subscribe(res => {
            this.facturaSVC.master[i].detalle.pop();
            let kgTotales = 0;
            for (let l = 0; l <=res.length-1; l++){
               kgTotales = +res[l].Cantidad + +kgTotales
               this.facturaSVC.master[i].KGTOTALES = kgTotales;
              this.facturaSVC.master[i].detalle.push(res[l]);
            }
            
            this.listData = new MatTableDataSource(this.facturaSVC.master);
            this.listData.sort = this.sort;    
            this.listData.paginator = this.paginator;
            this.listData.paginator._intl.itemsPerPageLabel = 'Facturas por Pagina';
            Swal.close();
          })

        }}
        
        // console.log(this.listData);
      });
    /* }) */
  }

  applyFilter(filtervalue: string){  
    console.log(this.listData);
    
    this.listData.filterPredicate = (data, filter: string) => {
      if (data.Nombre){
        return data.Folio.toString().toLowerCase().includes(filter) || data.Nombre.toLowerCase().includes(filter);
      } else{
        return data.Folio.toString().toLowerCase().includes(filter);
      }
    };
    this.listData.filter= filtervalue.trim().toLocaleLowerCase();
  }

}
