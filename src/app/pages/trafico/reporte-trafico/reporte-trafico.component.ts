import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ClientesService } from 'src/app/services/catalogos/clientes.service';
import { Observable } from 'rxjs';
import { Cliente } from 'src/app/Models/catalogos/clientes-model';
import { startWith, map } from 'rxjs/operators';
import { MatDialog, MatDialogConfig, MatSnackBar, MatDivider, MAT_DATE_LOCALE } from '@angular/material';
import { ThemePalette } from '@angular/material/core';
import { OrdenCargaService } from '../../../services/almacen/orden-carga/orden-carga.service';
import { OrdenCarga } from '../../../Models/almacen/OrdenCarga/ordencarga.model';
import { OrdenCargaTraficoService } from '../../../services/trafico/orden-carga-trafico.service';
import { ShowreporteTraficoComponent } from './showreporte-trafico/showreporte-trafico.component';
import { ShowreporteAlmacenComponent } from '../../almacen/reportesalmacen/showreporte-almacen/showreporte-almacen.component';
import { OrdenDescargaService } from 'src/app/services/almacen/orden-descarga/orden-descarga.service';
import { Proveedor } from 'src/app/Models/catalogos/proveedores-model';
import { ProveedoresService } from 'src/app/services/catalogos/proveedores.service';




@Component({
  selector: 'app-reporte-trafico',
  templateUrl: './reporte-trafico.component.html',
  styleUrls: ['./reporte-trafico.component.css']
})
export class ReporteTraficoComponent implements OnInit {

  constructor(public serviceCliente: ClientesService, public proveedorService: ProveedoresService, private dialog: MatDialog, public ocService: OrdenCargaService, public traficoService: OrdenCargaTraficoService, public odService: OrdenDescargaService) { }

  ngOnInit() {
    this.obtenerClientes();
    this.obtenerOrdenesCarga();
    this.obtenerListaFleteras();
    this.obtenerProveedores();
  }

  //Fechas de reportes a ser filtradas
  fechaInicialOrdenCarga: Date;
  fechaFinalOrdenCarga: Date;

  fechaInicialOrdenDescarga: Date;
   fechaFinalOrdenDescarga: Date;

  //Variable para Filtrar por fechas / clientes  OrdenCarga
  color: ThemePalette = 'accent';
  checkedFechasOrdenCarga = false;
  disabledFechasOrdenCarga = false;

  checkedClientesOrdenCarga = true;
  checkedEstatusOrdenCarga = false;
  disabledEstatusOrdenCarga = true;
  
   //Variable para Filtrar por fechas / provedores  OrdenDescarga
   checkedFechasOrdenDescarga = false;
   disabledFechasOrdenDescarga = false;
   checkedProveedorOrdenDescarga = true;
   checkedEstatusOrdenDescarga = false;
   disabledEstatusOrdenDescarga = true;
  
  checkedOrdenCargaTrafico = false;

  checkedEstatusTrafico = false;
  disabledEstatusTrafico = true;

  checkedFleteraTrafico = false;
  disabledFleteraTrafico = true;

  //variable estatus de Orden Carga (creada, preparada, cargada, envidada, transito, terminada)
  estatusOrdenCarga: string;

     //variable estatus de la Orden Descarga (creda, proceso, descargada, transito,)
     estatusOrdenDescarga: string;

  //variable estatus de Trafico capturada, terminada)
  estatusTrafico: string;

  //variable fletera Trafico
  fleteraTrafico: string;

  //variables dropdown clientes Orden Carga
  myControlOrdenCarga = new FormControl();
  filteredOptionsOrdenCarga: Observable<any[]>
  optionsOrdenCarga: Cliente[] = [];
  OrdenCargaClienteNombre: any;
  OrdenCargaIdCliente: number;

     //variables dropdown proveedores Orden Descarga
     myControlOrdenDescarga = new FormControl();
     filteredOptionsOrdenDescarga: Observable<any[]>
     optionsOrdenDescarga: Proveedor[] = [];
     OrdenDescargaProveedorNombre: any;
     OrdenDescargaIdProveedor: number;

  //variables dropdown Orden Carga Trafico
  myControlTrafico = new FormControl();
  filteredOptionsTrafico: Observable<any[]>
  optionsTrafico: OrdenCarga[] = [];
  traficoOC: any;
  traficoOCid: number;
  traficoOCfolio: number;

  //Lista de Estatus Orden Carga 
  public listEstatusOrdenCarga: Array<Object> = [
    { tipo: 'Creada' },
    { tipo: 'Preparada' },
    { tipo: 'Cargada' },
    { tipo: 'Enviada' },
    { tipo: 'Transito' },
    { tipo: 'Terminada' }
  ];
  //Lista de Estatus Trafico
  public listEstatusTrafico: Array<Object> = [
    { tipo: 'Capturada' },
    { tipo: 'Terminada' }
  ];

    //Lista de Estatus Orden Descarga
    public listEstatusOrdenDescarga: Array<Object> = [
      { tipo: 'Creada' },
      { tipo: 'Proceso' },
      { tipo: 'Transito' },
      { tipo: 'Descargada' }
    ];
 
  public listFleterasTrafico = new Array<Object>();

  obtenerListaFleteras(){
    this.traficoService.getDepDropDownValues().subscribe(data=>{
      console.log(data);
      this.listFleterasTrafico = data;
    })
  }

  obtenerClientes() {
    this.serviceCliente.getClientesListIDN().subscribe(data => {
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        let client = data[i];
        this.optionsOrdenCarga.push(client)
        this.filteredOptionsOrdenCarga = this.myControlOrdenCarga.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filterOrdenCarga(value))
          );
      }
    })
  }

  _filterOrdenCarga(value: any): any {
    const filterValue = value.toString().toLowerCase();
    return this.optionsOrdenCarga.filter(option =>
      option.Nombre.toLowerCase().includes(filterValue) ||
      option.IdClientes.toString().includes(filterValue));
  }

  obtenerProveedores(){
    this.proveedorService.getProveedoresList().subscribe(data=>{
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        let proveedor = data[i];
        this.optionsOrdenDescarga.push(proveedor)
        this.filteredOptionsOrdenDescarga = this.myControlOrdenDescarga.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filterOrdenDescarga(value))
          );
      }
    })
  }

  _filterOrdenDescarga(value: any): any {
    const filterValue = value.toString().toLowerCase();
   return this.optionsOrdenDescarga.filter(option =>
     option.Nombre.toLowerCase().includes(filterValue) ||
     option.IdProveedor.toString().includes(filterValue));
 }

  obtenerOrdenesCarga() {
    this.ocService.getOrdenCargaList().subscribe(data => {
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        let oc = data[i];
        this.optionsTrafico.push(oc)
        this.filteredOptionsTrafico = this.myControlTrafico.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filterTrafico(value))
          );
      }
    })
  }

  _filterTrafico(value: any): any {
    const filterValue = value.toString().toLowerCase();
    return this.optionsTrafico.filter(option =>
      option.Cliente.toLowerCase().includes(filterValue) ||
      option.Folio.toString().includes(filterValue));
  }

  //Al filtrar por fecha Orden Carga
  onChangePorFechaOrdenCarga() {
    if (this.checkedFechasOrdenCarga == true) {
      this.checkedFechasOrdenCarga = false;
    } else {
      this.checkedFechasOrdenCarga = true;
    }
  }

  onChangePorFechaOrdenDescarga(){
    if(this.checkedFechasOrdenDescarga == true){
      this.checkedFechasOrdenDescarga = false;
    }else{
      this.checkedFechasOrdenDescarga = true;
    }
      }

  //^ al seleccionar un cliente
  onSelectionChangeOrdenCarga(cliente: Cliente, event: any) {
    console.log(cliente);
    this.OrdenCargaClienteNombre = cliente.Nombre;
  }
  onSelectionChangeOrdenDescarga(cliente: Cliente, event: any) {
    console.log(cliente);
  this.OrdenDescargaProveedorNombre = cliente.Nombre;
}
  //Al filtrar cliente picarle al boton
  onChangeTodosClientesOrdenCarga() {
    if (this.checkedClientesOrdenCarga == true) {
      this.checkedClientesOrdenCarga = false;
    } else {
      this.checkedClientesOrdenCarga = true;
    }
  }

    //cuando se filtarara por estatus Orden Carga
    onChangeEstatusOrdenCarga() {
      if (this.checkedEstatusOrdenCarga == true) {
        this.checkedEstatusOrdenCarga = false;
      } else {
        this.checkedEstatusOrdenCarga = true;
      }
    }
  
    //cuando se selecciona un estatus OrdenCarga
    changeEstatusOrdenCarga(event) {
      console.log(event);
      this.estatusOrdenCarga = event.target.selectedOptions[0].text;
    }

    onChangeTodosProveedorOrdenDescarga(){
      if(this.checkedProveedorOrdenDescarga == true){
        this.checkedProveedorOrdenDescarga = false;
      }else{
        this.checkedProveedorOrdenDescarga = true;
      }
    }
  onSelectionChangeTrafico(oc: OrdenCarga, event: any) {
    console.log(oc);
    this.traficoOC = oc.Cliente;
    this.traficoOCid = +oc.IdOrdenCarga;
    this.traficoOCfolio = +oc.Folio;
  }

  //Al filtrar Orden Carga trafico
  onChangeTodasOrdenCargaTrafico() {
    if (this.checkedOrdenCargaTrafico == true) {
      this.checkedOrdenCargaTrafico = false;
    } else {
      this.checkedOrdenCargaTrafico = true;
    }
  }

        //cuando se filtarara por estatus Orden Descarga
        onChangeEstatusOrdenDescarga(){
          if(this.checkedEstatusOrdenDescarga == true){
            this.checkedEstatusOrdenDescarga = false;
          }else{
            this.checkedEstatusOrdenDescarga = true;
          }
        }
  //cuando se selecciona un estatus orden Descarga
  changeEstatusOrdenDescarga(event){
    console.log(event);
    this.estatusOrdenDescarga = event.target.selectedOptions[0].text;
  }
  //cuando se filtarara por estatus Trafico
  onChangeEstatusTrafico() {
    if (this.checkedEstatusTrafico == true) {
      this.checkedEstatusTrafico = false;
    } else {
      this.checkedEstatusTrafico = true;
    }
  }

  //cuando se selecciona un estatus OrdenCarga
  changeEstatusTrafico(event) {
    console.log(event);
    this.estatusTrafico = event.target.selectedOptions[0].text;
  }

  //cuando se filtarara por Fletera Trafico
  onChangeFleteraTrafico() {
    if (this.checkedFleteraTrafico == true) {
      this.checkedFleteraTrafico = false;
    } else {
      this.checkedFleteraTrafico = true;
    }
  }

  //cuando se selecciona una Fletera OrdenCarga
  changeFleteraTrafico(event) {
    console.log(event);
    this.fleteraTrafico = event.target.selectedOptions[0].text;
  }



  abrirReporte(modulo) {


    console.log(modulo);

    //Variables generales
    let filtrarFecha: boolean;
    let fechaStart = new Date();
    let fechaEnd = new Date();

    let filtrarOrdenCarga: boolean;

    let estatusBodega: boolean = false;
    let tipoEstatusBodega: string = '';

    let fleteraBoolean: boolean = false;
    let fletera: string = '';

    let unClienteProveedor: boolean = false;
    let IdClienteProveedor: number;

    let ClaveProducto: string = '';

    if (modulo == 'OrdenCarga') {
      IdClienteProveedor = this.OrdenCargaIdCliente;
      if (this.checkedFechasOrdenCarga == true) {
        // console.log('SE FILTRA POR FECHA');
        fechaStart = this.fechaInicialOrdenCarga;
        fechaEnd = this.fechaFinalOrdenCarga;
        filtrarFecha = true;
      } else {
        filtrarFecha = false;
      }
      if (this.checkedClientesOrdenCarga == false) {
        // console.log(this.checkedProveedores);
        // console.log('SE FILTRA POR PROVEEDORES');
        unClienteProveedor = true;
      }
      if (this.checkedEstatusOrdenCarga == true) {
        estatusBodega = true;
        tipoEstatusBodega = this.estatusOrdenDescarga; 
      }

    }else if(modulo == 'Trafico'){
      if(this.checkedOrdenCargaTrafico == true){
        filtrarOrdenCarga = true;
        IdClienteProveedor = this.traficoOCid;        
      }else{
        filtrarOrdenCarga = false;
      }
      if(this.checkedEstatusTrafico == true){
        estatusBodega = true;
tipoEstatusBodega = this.estatusTrafico;
      }
      if(this.checkedFleteraTrafico == true){
      fleteraBoolean = true;
      fletera = this.fleteraTrafico;
      }
    }else if (modulo ==  'OrdenDescarga'){
      IdClienteProveedor = this.OrdenDescargaIdProveedor;
      if(this.checkedFechasOrdenDescarga == true){
        // console.log('SE FILTRA POR FECHA');
          fechaStart = this.fechaInicialOrdenDescarga;
          fechaEnd = this.fechaFinalOrdenDescarga;
          filtrarFecha = true;
      }else{
        filtrarFecha = false;
      }
      if(this.checkedProveedorOrdenDescarga == false){
        // console.log(this.checkedProveedores);
        // console.log('SE FILTRA POR PROVEEDORES');
          unClienteProveedor = true;
      }
      if(this.checkedEstatusOrdenDescarga == true){
        estatusBodega = true;
        tipoEstatusBodega = this.estatusOrdenDescarga; 
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
    dialogConfig.width = "80%";
    dialogConfig.data = {
      modulo: modulo,
      unsolocliente: unClienteProveedor,
      idClienteProveedor: IdClienteProveedor,
      claveProduto: ClaveProducto,
      filtradoFecha: filtrarFecha,
      fechaInicial: fechaStart,
      fechaFinal: fechaEnd,
      estatus: estatusBodega,
      tipoEstatus: tipoEstatusBodega,
      filtrarOrdenCarga: filtrarOrdenCarga,
      filtrarFletera: fleteraBoolean,
      fletera: fletera

    }
    if(modulo == 'OrdenCarga' || modulo == 'OrdenDescarga'){
      this.dialog.open( ShowreporteAlmacenComponent, dialogConfig);
    }else if(modulo == 'Trafico'){
      this.dialog.open( ShowreporteTraficoComponent, dialogConfig);
    }


  }


}
