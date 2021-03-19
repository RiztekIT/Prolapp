import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ClientesService } from 'src/app/services/catalogos/clientes.service';
import { Observable } from 'rxjs';
import { Cliente } from 'src/app/Models/catalogos/clientes-model';
import { startWith, map } from 'rxjs/operators';
import { MatDialog, MatDialogConfig, MatSnackBar, MatDivider, MAT_DATE_LOCALE } from '@angular/material';
import {ThemePalette} from '@angular/material/core';
import { OrdenCargaService } from '../../../services/almacen/orden-carga/orden-carga.service';
import { ProveedoresService } from '../../../services/catalogos/proveedores.service';
import { Proveedor } from '../../../Models/catalogos/proveedores-model';
import { OrdenDescargaService } from '../../../services/almacen/orden-descarga/orden-descarga.service';
import { Producto } from '../../../Models/catalogos/productos-model';
import { ProductosService } from '../../../services/catalogos/productos.service';
import { ShowreporteAlmacenComponent } from './showreporte-almacen/showreporte-almacen.component';
import { EnviarfacturaService } from 'src/app/services/facturacioncxc/enviarfactura.service';


@Component({
  selector: 'app-reportesalmacen',
  templateUrl: './reportesalmacen.component.html',
  styleUrls: ['./reportesalmacen.component.css']
})

export class ReportesalmacenComponent implements OnInit {

  constructor(public serviceCliente: ClientesService, 
    public proveedorService: ProveedoresService, 
    public productoService: ProductosService, 
    private dialog: MatDialog, 
    public ocService: OrdenCargaService, 
    public odService: OrdenDescargaService, 
    public enviarfact: EnviarfacturaService,) { }

  ngOnInit() {
    this.obtenerClientes();
    this.obtenerProveedores();
    this.obtenerProductos();
     }

     //Fechas de reportes a ser filtradas
   fechaInicialOrdenCarga: Date;
   fechaFinalOrdenCarga: Date;

   fechaInicialOrdenDescarga: Date;
   fechaFinalOrdenDescarga: Date;

   fechaInicialTraspaso: Date;
   fechaFinalTraspaso: Date;
 
 
 //Variable para Filtrar por fechas / clientes  OrdenCarga
 color: ThemePalette = 'accent';
 checkedFechasOrdenCarga = false;
 disabledFechasOrdenCarga = false;

 checkedClientesOrdenCarga = true;

 checkedEstatusOrdenCarga = false;
 disabledEstatusOrdenCarga = true;
 
 //Variable para Filtrar por fechas / clientes  Traspaso
   checkedFechasTraspaso = false;
   disabledFechasTraspaso = false;

   checkedEstatusTraspaso = false;
   disabledEstatusTraspaso = true;

 //Variable para Filtrar por fechas / provedores  OrdenDescarga
   checkedFechasOrdenDescarga = false;
   disabledFechasOrdenDescarga = false;
   checkedProveedorOrdenDescarga = true;
   checkedEstatusOrdenDescarga = false;
   disabledEstatusOrdenDescarga = true;

  //  Variable para Filtrar por Producto / bodega Inventario
   checkedProductosInventario = true;

   checkedBodegaInventario = false;
   disabledBodegaInventario = true;

  checkedLotesInventario = true;
 
 
   //variable estatus de Orden Carga (creada, preparada, cargada, envidada, transito, terminada)
   estatusOrdenCarga: string;
   
   //variable estatus del Traspaso (creada, preparada, cargada, envidada, transito, terminada)
   estatusTraspaso: string;

   //variable estatus de la Orden Descarga (creda, proceso, descargada, transito,)
   estatusOrdenDescarga: string;

   //variable bodega

   bodegaInventario: string;
 

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

   //variables dropdown productos Inventario
   myControlInventario = new FormControl();
   filteredOptionsInventario: Observable<any[]>
   optionsInventario: Producto[] = [];
   InventarioProductoNombre: any;
   InventarioClaveProducto: string;
   InventarioLoteProducto: string;

   bodegaOrigen: string = 'PasoTx'
   bodegaDestino: string = 'Chihuahua'
 
 
   //Lista de Estatus Orden Carga / Traspaso
   public listEstatusOrdenCarga: Array<Object> = [
     { tipo: 'Creada' },
     { tipo: 'Preparada' },
     { tipo: 'Cargada' },
     { tipo: 'Enviada' },
     { tipo: 'Transito' },
     { tipo: 'Terminada' }
   ];
 
   //Lista de Estatus Orden Descarga
   public listEstatusOrdenDescarga: Array<Object> = [
     { tipo: 'Creada' },
     { tipo: 'Proceso' },
     { tipo: 'Transito' },
     { tipo: 'Descargada' }
   ];

   //Lista de Bodegas Inventario
   public listBodegasInventario: Array<Object> = [
     { tipo: 'PasoTx' },
     { tipo: 'Chihuahua' },
     { tipo: 'SAN DIEGO' },
     { tipo: 'Transito' }
   ];

   //Lista de Bodegas
   public listBodegas: Array<Object> = [
    { tipo: 'Chihuahua' },
    { tipo: 'PasoTx' },
    { tipo: 'SAN DIEGO' }
  ];
obtenerClientes(){
       this.serviceCliente.getClientesListIDN().subscribe(data=>{
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

    obtenerProductos(){
      this.productoService.getProductosList().subscribe(dataProd=>{
        console.log(dataProd);
        for (let i = 0; i < dataProd.length; i++) {
          let producto = dataProd[i];
          this.optionsInventario.push(producto)
          this.filteredOptionsInventario = this.myControlInventario.valueChanges
            .pipe(
              startWith(''),
              map(value => this._filterInventario(value))
            );
        }
      })
    }

    _filterInventario(value: any): any {
      const filterValue = value.toString().toLowerCase();
     return this.optionsInventario.filter(option =>
       option.Nombre.toLowerCase().includes(filterValue) ||
       option.ClaveProducto.toString().includes(filterValue));
   }

   changeBodegaOrigen(event){
    console.log(event);
    this.bodegaOrigen = event.target.selectedOptions[0].text;
  }

  changeBodegaDestino(event){
    console.log(event);
    this.bodegaDestino = event.target.selectedOptions[0].text;
  }

    //Al filtrar por fecha
    onChangePorFechaOrdenCarga(){
      if(this.checkedFechasOrdenCarga == true){
        this.checkedFechasOrdenCarga = false;
      }else{
        this.checkedFechasOrdenCarga = true;
      }
        }
    onChangePorFechaTraspaso(){
      if(this.checkedFechasTraspaso == true){
        this.checkedFechasTraspaso = false;
      }else{
        this.checkedFechasTraspaso = true;
      }
        }
    onChangePorFechaOrdenDescarga(){
      if(this.checkedFechasOrdenDescarga == true){
        this.checkedFechasOrdenDescarga = false;
      }else{
        this.checkedFechasOrdenDescarga = true;
      }
        }
  

        onSelectionChangeOrdenCarga(cliente: Cliente, event: any) {
          console.log(cliente);
        this.OrdenCargaClienteNombre = cliente.Nombre;
      }
        onSelectionChangeOrdenDescarga(cliente: Cliente, event: any) {
          console.log(cliente);
        this.OrdenDescargaProveedorNombre = cliente.Nombre;
      }
      onSelectionChangeProductoInventario(prod: Producto, event: any){
        console.log(prod);
        this.InventarioProductoNombre = prod.Nombre;
        this.InventarioClaveProducto = prod.ClaveProducto;
      }

      //Al filtrar cliente
      onChangeTodosClientesOrdenCarga(){
        if(this.checkedClientesOrdenCarga == true){
          this.checkedClientesOrdenCarga = false;
        }else{
          this.checkedClientesOrdenCarga = true;
        }
      }
      onChangeTodosProveedorOrdenDescarga(){
        if(this.checkedProveedorOrdenDescarga == true){
          this.checkedProveedorOrdenDescarga = false;
        }else{
          this.checkedProveedorOrdenDescarga = true;
        }
      }
      onChangeTodosProductosInventario(){
        if(this.checkedProductosInventario == true){
          this.checkedProductosInventario = false;
        }else{
          this.checkedProductosInventario = true;
        }
      }

      //cuando se filtarara por estatus Orden Carga
  onChangeEstatusOrdenCarga(){
    if(this.checkedEstatusOrdenCarga == true){
      this.checkedEstatusOrdenCarga = false;
    }else{
      this.checkedEstatusOrdenCarga = true;
    }
  }

      //cuando se filtarara por estatus Orden Carga TRASPASO
  onChangeEstatusTraspaso(){
    if(this.checkedEstatusTraspaso == true){
      this.checkedEstatusTraspaso = false;
    }else{
      this.checkedEstatusTraspaso = true;
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
      //cuando se filtarara por bodega Inventario
  onChangeBodegaInventario(){
    if(this.checkedBodegaInventario == true){
      this.checkedBodegaInventario = false;
    }else{
      this.checkedBodegaInventario = true;
    }
  }
      //cuando se filtarara por Lotes
  onChangeLotesInventario(){
    if(this.checkedLotesInventario == true){
      this.checkedLotesInventario = false;
    }else{
      this.checkedLotesInventario = true;
    }
  }
  //cuando se selecciona un estatus OrdenCarga
  changeEstatusOrdenCarga(event){
    console.log(event);
    this.estatusOrdenCarga = event.target.selectedOptions[0].text;
  }
  //cuando se selecciona un estatus OrdenCarga TRASPASO
  changeEstatusTraspaso(event){
    console.log(event);
    this.estatusTraspaso = event.target.selectedOptions[0].text;
  }
//cuando se selecciona un estatus orden Descarga
  changeEstatusOrdenDescarga(event){
    console.log(event);
    this.estatusOrdenDescarga = event.target.selectedOptions[0].text;
  }
//cuando se selecciona una bodega Inventario
  changeBodegaInventario(event){
    console.log(event);
    this.bodegaInventario = event.target.selectedOptions[0].text;
  }

  abrirReporte(modulo){


    console.log(modulo);

    //Variables generales
    let filtrarFecha: boolean;
    let fechaStart = new Date();
    let fechaEnd = new Date();

    let estatusBodega: boolean = false;
    let tipoEstatusBodega: string = '';

    let unClienteProveedor: boolean = false;
    let IdClienteProveedor: number;

    let ClaveProducto: string = '';

    let bodegaOrigen: string = '';
    let bodegaDestino: string = '';

if(modulo == 'OrdenCarga'){
IdClienteProveedor = this.OrdenCargaIdCliente;
  if(this.checkedFechasOrdenCarga == true){
    // console.log('SE FILTRA POR FECHA');
      fechaStart = this.fechaInicialOrdenCarga;
      fechaEnd = this.fechaFinalOrdenCarga;
      filtrarFecha = true;
  }else{
    filtrarFecha = false;
  }
  if(this.checkedClientesOrdenCarga == false){
    // console.log(this.checkedProveedores);
    // console.log('SE FILTRA POR PROVEEDORES');
      unClienteProveedor = true;
  }
  if(this.checkedEstatusOrdenCarga == true){
    estatusBodega = true;
    tipoEstatusBodega = this.estatusOrdenCarga; 
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
}else if (modulo == 'Traspaso'){
  IdClienteProveedor = 0;
  // SIEMPRE ES UN SOLO CLIENTE EN TRASPASO
        unClienteProveedor = true;
  if(this.checkedFechasTraspaso == true){
    // console.log('SE FILTRA POR FECHA');
      fechaStart = this.fechaInicialTraspaso;
      fechaEnd = this.fechaFinalTraspaso;
      filtrarFecha = true;
  }else{
    filtrarFecha = false;
  }

  if(this.checkedEstatusTraspaso == true){
    estatusBodega = true;
    tipoEstatusBodega = this.estatusTraspaso; 
  }
}else if (modulo == 'Inventario'){
  ClaveProducto = this.InventarioClaveProducto;
console.log(ClaveProducto);

    //Los inventarios no se filtran por fecha
    filtrarFecha = false;

  if(this.checkedProductosInventario == false){
    // console.log(this.checkedProveedores);
    // console.log('SE FILTRA POR PROVEEDORES');
      unClienteProveedor = true;
  }
  if(this.checkedBodegaInventario == true){
    estatusBodega = true;
    tipoEstatusBodega = this.bodegaInventario; 
  }
  if(this.checkedLotesInventario == true){
    filtrarFecha = true;
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
      bodegaOrigen: this.bodegaOrigen,
      bodegaDestino: this.bodegaDestino,
      
      
    }
    this.dialog.open( ShowreporteAlmacenComponent, dialogConfig);


  }


     
}
