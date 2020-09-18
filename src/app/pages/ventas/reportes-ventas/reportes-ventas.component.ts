import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ClientesService } from 'src/app/services/catalogos/clientes.service';
import { Observable } from 'rxjs';
import { Cliente } from 'src/app/Models/catalogos/clientes-model';
import { startWith, map } from 'rxjs/operators';
import { MatDialog, MatDialogConfig, MatSnackBar, MatDivider, MAT_DATE_LOCALE } from '@angular/material';
import { PedidoService } from '../../../services/pedidos/pedido.service';
import { VentasCotizacionService } from '../../../services/ventas/ventas-cotizacion.service';
import {ThemePalette} from '@angular/material/core';
import { ShowreporteVentasComponent } from './showreporte-ventas/showreporte-ventas.component';

declare function btn_table();


@Component({
  selector: 'app-reportes-ventas',
  templateUrl: './reportes-ventas.component.html',
  styleUrls: ['./reportes-ventas.component.css']
})
export class ReportesVentasComponent implements OnInit {


  constructor(public serviceCliente: ClientesService, private dialog: MatDialog, pedidoService: PedidoService, cotizacionService:VentasCotizacionService) { }

  ngOnInit() {
 this.obtenerClientes();
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
    dialogConfig.width = "50%";
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
    this.dialog.open( ShowreporteVentasComponent, dialogConfig);

  }
}
