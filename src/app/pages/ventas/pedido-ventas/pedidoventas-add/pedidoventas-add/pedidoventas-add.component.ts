import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm, FormControl } from "@angular/forms";
import { Observable } from 'rxjs';
import { Cliente } from 'src/app/Models/catalogos/clientes-model';
import { map, startWith } from 'rxjs/operators';
import { VentasPedidoService } from '../../../../../services/ventas/ventas-pedido.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from '../../../../../Models/catalogos/productos-model';
import { CurrencyPipe } from '@angular/common';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { DetallePedido } from '../../../../../Models/Pedidos/detallePedido-model';
import Swal from 'sweetalert2';
import { Usuario } from '../../../../../Models/catalogos/usuarios-model';
import { DataRowOutlet } from '@angular/cdk/table';
import { TipoCambioService } from '../../../../../services/tipo-cambio.service';
import { EnviarfacturaService } from '../../../../../services/facturacioncxc/enviarfactura.service';
import { ProductosService } from '../../../../../services/catalogos/productos.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Vendedor } from 'src/app/Models/catalogos/vendedores.model';
import { UnidadMedidaService } from 'src/app/services/unidadmedida/unidad-medida.service';
import { ClienteDireccion } from '../../../../../Models/cliente-direccion/clienteDireccion-model';


import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { ClienteDireccionService } from '../../../../../services/cliente-direccion/cliente-direccion.service';

import { ClienteDireccionComponent } from '../../../../../components/cliente-direccion/cliente-direccion.component';
import { VentasCotizacionService } from 'src/app/services/ventas/ventas-cotizacion.service';
import { AddsproductosService } from 'src/app/services/addsproductos.service';
import { ReporteEmisionComponent } from 'src/app/components/reporte-emision/reporte-emision.component';
import { MessageService } from 'src/app/services/message.service';
import { EmailgeneralComponent } from 'src/app/components/email/emailgeneral/emailgeneral.component';
import * as html2pdf from 'html2pdf.js';
import { OrdenCargaService } from '../../../../../services/almacen/orden-carga/orden-carga.service';
import { OrdenTemporalService } from 'src/app/services/almacen/orden-temporal/orden-temporal.service';
import { MercanciaComponent } from 'src/app/pages/almacen/mercancia/mercancia.component';
import { nanoid } from 'nanoid';
import * as uuid from 'uuid';
import { Location } from '@angular/common';
import { CalendarioService } from '../../../../../services/calendario/calendario.service';
import { MasterOrdenCarga } from 'src/app/Models/almacen/OrdenCarga/masterOrdenCarga-model';
import { TarimaService } from '../../../../../services/almacen/tarima/tarima.service';
import { SelectionModel } from '@angular/cdk/collections';
import { DetalleTarima } from 'src/app/Models/almacen/Tarima/detalleTarima-model';
import { OrdenTemporal } from 'src/app/Models/almacen/OrdenTemporal/ordenTemporal-model';
import { PedidoInfo } from 'src/app/Models/Pedidos/pedidoInfo-model';
//Constantes para obtener tipo de cambio
const httpOptions = {
  headers: new HttpHeaders({
    'Bmx-Token': 'd83c7088f2823be9f29cc124cf95dc37056de37c340da5477a09ca1ee91a80a6',
    //'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Headers': 'Bmx-Token, Accept, Accept-Encoding, Content-Type, Origin',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'

  })
}


@Component({
  selector: 'app-pedidoventas-add',
  templateUrl: './pedidoventas-add.component.html',
  styleUrls: ['./pedidoventas-add.component.css']
})

export class PedidoventasAddComponent implements OnInit {
  dialogbox: any;

  constructor(public router: Router, private currencyPipe: CurrencyPipe, public service: VentasPedidoService, private _formBuilder: FormBuilder,
    private serviceTipoCambio: TipoCambioService, public enviarfact: EnviarfacturaService, private serviceProducto: ProductosService, private http: HttpClient, public ServiceUnidad: UnidadMedidaService,
    public serviceDireccion: ClienteDireccionService, private dialog: MatDialog, public servicecoti: VentasCotizacionService, public addproductos: AddsproductosService, 
    public _MessageService: MessageService, public serviceordencarga: OrdenCargaService, public ordenTemporalService: OrdenTemporalService, public location: Location,
     public CalendarioService: CalendarioService, public tarimaService:TarimaService) {
    
    this.MonedaBoolean = true;


    this.serviceDireccion.listen().subscribe((m:any)=>{
      this.dropdownRefreshDirecciones(this.service.formData.IdClientes);
      });

  }


  


url;

html;
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  EstatusOC: string;

  //valores de unidad
  filteredOptionsUnidad: Observable<any[]>;
  myControlUnidad = new FormControl();
  optionsUnidad = ['Pieza'];
  um: boolean;
  ProductoSelect: string;
  MarcaSelect: string;
  OrigenSelect:string;
  clavemarca:string;
  claveorigen:string;
  clavepresentacion:string;
  PresentacionSelect: string;
  Id: number;
  clienteLogin;

  seleccionManual;



  // ** SELECCION MANUAL *** ///

  bodegaSelectSeleccion = 'Chihuahua';
  listDataSeleccion: MatTableDataSource<any>;
  listData2Seleccion: MatTableDataSource<any>;
  // @ViewChild(MatSort, null) sort: MatSort;
  // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, null) sortSeleccion: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginatorSeleccion: MatPaginator;
  selection = new SelectionModel<any>(true, []);
  displayedColumnsSeleccion: string[] = ['Bodega', 'Clave','Producto','Lote', 'Fecha Caducidad', 'Cantidad', 'Opciones'];
  // displayedColumns2: string[] = ['ClaveProducto','Producto', 'Cantidad'];
  aceptarSeleccion;
  contadorSeleccion;
  productosSeleccion = [];
  seleccionadosSeleccion = [];

  seleccionManualSeleccion;

  // ** SELECCION MANUAL *** ///


  ngOnInit() {
    console.log(this.service.formData);
    
    console.log(localStorage.getItem("inicioCliente"));
    this.clienteLogin = localStorage.getItem("inicioCliente");
    this.Inicializar();
    this.dropdownRefresh();
    this.dropdownRefreshVendedor();
    // this.dropdownRefresh2();
    this.refreshDetallesPedidoList();
    // this.IniciarTotales();
    this.tipoDeCambio();
    this.service.formProd = new Producto();
  
    this.getValidacion();

    // *** SELECCION MANUAL /// 
    // if(this.seleccionManual == true){
      this.obtenerTarimas();
      this.aceptarSeleccion=true;
    // }
    // *** SELECCION MANUAL /// 
    
    
    //^ **** PRIVILEGIOS POR USUARIO *****
    this.obtenerPrivilegios();
    //^ **** PRIVILEGIOS POR USUARIO *****



    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });




    this.um = true;

    this.filteredOptionsUnidad = this.myControlUnidad.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterUnidad(value))
      );
  }

    
    //^ **** PRIVILEGIOS POR USUARIO *****
    privilegios: any;
    privilegiosExistentes: boolean = false;
    modulo = 'Ventas';
    area = 'Orden de Venta';
  
    //^ VARIABLES DE PERMISOS
    Guardar: boolean = false;
    Cerrar: boolean = false;
    //^ VARIABLES DE PERMISOS
  
  
    obtenerPrivilegios() {
      let arrayPermisosMenu = JSON.parse(localStorage.getItem('Permisos'));
      console.log(arrayPermisosMenu);
      let arrayPrivilegios: any;
      try {
        arrayPrivilegios = arrayPermisosMenu.find(modulo => modulo.titulo == this.modulo);
        // console.log(arrayPrivilegios);
        arrayPrivilegios = arrayPrivilegios.submenu.find(area => area.titulo == this.area);
        // console.log(arrayPrivilegios);
        this.privilegios = [];
        arrayPrivilegios.privilegios.forEach(element => {
          this.privilegios.push(element.nombreProceso);
          this.verificarPrivilegio(element.nombreProceso);
        });
        // console.log(this.privilegios);
      } catch {
        console.log('Ocurrio algun problema');
      }
    }
  
    verificarPrivilegio(privilegio) {
      switch (privilegio) {
        case ('Guardar Orden de Venta'):
          this.Guardar = true;
          break;
        case ('Cerrar Orden de Venta'):
          this.Cerrar = true;
          break;
        default:
          break;
      }
    }
    //^ **** PRIVILEGIOS POR USUARIO *****


  public listUM: Array<any> = [];


  //Filter Unidad
  private _filterUnidad(value: any): any[] {
    if (typeof (value) == 'string') {
      const filterValueUnidad = value.toLowerCase();
      return this.listUM.filter(optionUnidad => optionUnidad.ClaveSAT.toString().toLowerCase().includes(filterValueUnidad) || optionUnidad.Nombre.toString().toLowerCase().includes(filterValueUnidad));
    } else if (typeof (value) == 'number') {
      const filterValueUnidad = value;
      return this.listUM.filter(optionUnidad => optionUnidad.ClaveSAT.toString().includes(filterValueUnidad) || optionUnidad.Nombre.toString().includes | (filterValueUnidad));
    }
  }




  unidadMedida() {
    if (this.um) {
      this.listUM = [];
      // this.enviarfact.unidadMedida().subscribe(data => {
      //   console.log(JSON.parse(data).data);
      //   for (let i = 0; i < JSON.parse(data).data.length; i++) {
      //     this.listUM.push(JSON.parse(data).data[i])
      //   }
      this.ServiceUnidad.GetUnidadesMedida().subscribe(data => {
        this.listUM = data;
        this.filteredOptionsUnidad = this.myControlUnidad.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filterUnidad(value))
          );
        // console.log(this.listUM);

        this.um = false;

      })

    }
  }


  Regresar() {
    localStorage.removeItem('IdPedido');
    console.log(this.clienteLogin);
    if (this.clienteLogin == 'true') {
      console.log('soy true');
      this.router.navigateByUrl('/ordendecompra');
      
    } else {
      this.router.navigateByUrl('/pedidosVentas');
    }
  }


  myControl = new FormControl();
  myControl2 = new FormControl();
  myControl3 = new FormControl();
  myControl4 = new FormControl();
  myControl5 = new FormControl();
  myControlVendedor = new FormControl();
  myControlDireccion = new FormControl();

  options: Cliente[] = [];
  options2: Producto[] = [];
  options3: any[] = []
  options4: any[] = []
  options5: any[] = []

  filteredOptions: Observable<any[]>;
  filteredOptions2: Observable<any[]>;
  filteredOptions3: Observable<any[]>;
  filteredOptions4: Observable<any[]>;
  filteredOptions5: Observable<any[]>;
  filteredOptionsVendedor: Observable<any[]>;
  filteredOptionsDireccion: Observable<any[]>;

  listClientes: Cliente[] = [];
  listProducts: Producto[] = [];
  //Lista de Vendedores
  listVendedores: Vendedor[] = [];
  //Lista Direcciones
  listDireccion: ClienteDireccion[]= [];

  //Variable Moneda
  Moneda: string;
  //Boolean Moneda
  MonedaBoolean: boolean;
  ActualizarDetallePedidoBool: boolean;

  precioUnitarioF;
  //IdPedido
  IdPedido: number;
  //cantidad Producto
  Cantidad: number;
  //Stock de Producto
  PStock: any;
  //Variable para verificar si hay valores en detalle pedido. En caso que
  //sea negativo se podra cambiar la moneda. Si es positivo la moneda no se prodra cambiar
  //hasta haber eliminado todos los detalles pedido
  valores: boolean = false;
  //Importe Producto
  importeP: number;
  importePDLLS: number;
  //Precio producto general
  ProductoPrecio: number;
  //Precio del Producto MXN y DLLS
  ProductoPrecioMXN: number;
  ProductoPrecioDLLS: number;
  //TipoCambio
  TipoCambio: any;
  //Clave Producto
  ClaveProducto: string;

  //Valores de Totales
  subtotal: any;
  iva: any;
  total: any;
  ivaDlls: any;
  subtotalDlls: any;
  totalDlls: any;
  descuentoDlls: any;
  descuento: any;
  //Stock Real al momento de editar
  StockReal: number;

  //ClavePedido
  ClaveP: string;

  //Cantidad de Producto al momento de editar (en caso de que se cambie el producto por uno nuevo)
  CantidadP: number;

  //NombreVendedor
  NombreVendedor: String;

  //Variable para checar si ya se selecciono algun Cliente
  ClienteSeleccionado: boolean;

  //Variable Booleana de si lleva Flete el pedido
  isFlete: boolean;

  //Variable Booleana de si lleva Direccion diferente a la FISCAL 
  isDireccion: boolean;

  //variable Booleana para verificar si el pedido necesita factura
  isFactura: boolean;

  //Id Direccion
  IdDireccion: number;

  //^ PedidoInfo objeto
  pedidoInfo = new PedidoInfo();

  // //////////////////////////// BEGIN OBTENER TIPO CAMBIO ////////////////////////////
  rootURL = "/SieAPIRest/service/v1/series/SF63528/datos/"
  Cdolar: String;

  // ObtenerTipoCambio(){
  //   //Obtener Tipo Cambio
  //   console.log('TIPO CAMBIO----------------');
  //   console.log(this.serviceTipoCambio.TipoCambio);
  //   this.TipoCambio = this.serviceTipoCambio.TipoCambio;
  //   console.log('TIPO CAMBIO = ' + this.TipoCambio);
  //     }

  tipoDeCambio() {
    let hora = new Date().getHours();
    let fechahoy = new Date();
    let fechaayer = new Date();


    fechaayer.setDate(fechahoy.getDate() - 1)
    let diaayer = new Date(fechaayer).getDate();
    let mesayer = new Date(fechaayer).getMonth();
    let añoayer = new Date(fechaayer).getFullYear();
    let diasemana = new Date(fechahoy).getDay();

    let i;
    if (hora > 11) {
      i = 2;
    } else {
      i = 1;
    }
    this.traerApi().subscribe(data => {
      let l;

      l = data.bmx.series[0].datos.length;
      // console.log(i);
      // console.log(l);
      // console.log(data.bmx.series[0].datos.length);
      // console.log(data.bmx.series[0].datos[l-i].dato);


      this.Cdolar = data.bmx.series[0].datos[l - i].dato;
      console.log('------CAMBIO------');
      console.log(this.Cdolar);
      this.TipoCambio = this.Cdolar;
      console.log('------CAMBIO------');
    })

  }

  traerApi(): Observable<any> {

    return this.http.get("/SieAPIRest/service/v1/series/SF63528/datos/", httpOptions)

  }




  // //////////////////////////// END OBTENER TIPO CAMBIO ////////////////////////////


  private _filter(value: any): any[] {
    // console.log(value);
    const filterValue = value.toString().toLowerCase();
    return this.options.filter(option =>
      option.Nombre.toLowerCase().includes(filterValue) ||
      option.IdClientes.toString().includes(filterValue));
  }


  private _filtermarca(value: any): any[] {
    // console.clear();
    // console.log(value);
    if (typeof (value) == 'string') {
      const filterValue2 = value.toLowerCase();
      return this.options3.filter(option => option.NombreMarca.toString().toLowerCase().includes(filterValue2));
    } 
  }
  private _filterorigen(value: any): any[] {
    // console.clear();
    // console.log(value);
    if (typeof (value) == 'string') {
      const filterValue2 = value.toLowerCase();
      return this.options4.filter(option => option.NombreOrigen.toString().toLowerCase().includes(filterValue2));
    } 
  }
  private _filterpresentacion(value: any): any[] {
    // console.clear();
    // console.log(value);
    if (typeof (value) == 'string') {
      const filterValue2 = value.toLowerCase();
      return this.options5.filter(option => option.Presentacion.toString().toLowerCase().includes(filterValue2));
    } 
  }


  dropdownRefresh() {
    this.service.getDepDropDownValues().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        let client = data[i];
        this.listClientes.push(client);
        this.options.push(client)
        this.filteredOptions = this.myControl.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(value))
          );
      }
    });

  }

  droddownMarcas(producto){
    this.options3 = [];
    this.addproductos.getMarcas(producto).subscribe((marca: any) =>{
      for (let i=0; i < marca.length; i++){
        
        this.options3.push(marca[i])
        this.filteredOptions3 = this.myControl3.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filtermarca(value))
          );
      }
      
    })
  }

  droddownOrigen(){
    this.options4 = [];
    this.addproductos.getOrigen().subscribe((origen: any) =>{
      for (let i=0; i < origen.length; i++){
        
        this.options4.push(origen[i])
        this.filteredOptions4 = this.myControl4.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filterorigen(value))
          );
      }
      
    })
  }
  droddownPresentacion(){
    this.options5 = [];
    this.addproductos.getPresentacion().subscribe((Presentacion: any) =>{
      for (let i=0; i < Presentacion.length; i++){
        
        this.options5.push(Presentacion[i])
        this.filteredOptions5 = this.myControl5.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filterpresentacion(value))
          );
      }
      
    })
  }

  private _filter2(value: any): any[] {
    // console.clear();
    // console.log(value);
    if (typeof (value) == 'string') {
      const filterValue2 = value.toLowerCase();
      return this.options2.filter(option => option.ClaveProducto.toString().toLowerCase().includes(filterValue2) || option.Nombre.toString().toLowerCase().includes(filterValue2));
    } else if (typeof (value) == 'number') {
      const filterValue2 = value.toString();
      return this.options2.filter(option => option.ClaveProducto.toString().includes(filterValue2) || option.Nombre.toString().includes(filterValue2));
    }


  }

  dropdownRefresh2() {
    this.options2 = [];
    this.service.getDepDropDownValues2().subscribe(dataP => {
      for (let i = 0; i < dataP.length; i++) {
        let product = dataP[i];
        this.listProducts.push(product);
        this.options2.push(product)
        this.filteredOptions2 = this.myControl2.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter2(value))
          );
      }
    });

  }

  //DropDown de Vendedores
  dropdownRefreshVendedor() {
    this.service.GetVendedor().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        let vendedor = data[i];
        this.listVendedores.push(vendedor);
        // this.options.push(vendedor)
        this.filteredOptionsVendedor = this.myControlVendedor.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filterVendedor(value))
          );
      }
    });

  }
  //Filtro Dropdown Vendedores
  private _filterVendedor(value: any): any[] {
    // console.log(value);
    const filterValue = value.toString().toLowerCase();
    return this.listVendedores.filter(option =>
      option.Nombre.toLowerCase().includes(filterValue) || option.IdVendedor.toString().includes(filterValue));
  }

  onSelectionChangeVendedor(options: Vendedor, event: any) {
    if (event.isUserInput) {
      this.NombreVendedor = options.Nombre;
    }
  }

  // --------------------------- SELECT DIRECCION CLIENTE || onCHANGE SELECT DIRECCION CLIENTE || Modal Direccion Cliente  --------------------------------------

//DropDown de Vendedores
dropdownRefreshDirecciones(id: number) {
  this.listDireccion = [];
  this.service.getDireccionesCliente(id).subscribe(data => {
    console.log(data);
    for (let i = 0; i < data.length; i++) {
      let direccion = data[i];
      this.listDireccion.push(direccion);
      // this.options.push(vendedor)
      this.filteredOptionsDireccion = this.myControlDireccion.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterDireccion(value))
        );
    }
  });

}
//Filtro Dropdown Vendedores
private _filterDireccion(value: any): any[] {
  // console.log(value);
  const filterValue = value.toString().toLowerCase();
  return this.listDireccion.filter(option =>
    option.Calle.toLowerCase().includes(filterValue) || option.Colonia.toString().includes(filterValue));
}

//Metodo para mostrar las Direcciones Correspondientes a ese Cliente. En dado de que sea falso, se ocultara el select y se regresara la direccion fiscal a ese cliente en especifico
changeDireccion(checkbox: any) {
  console.log(checkbox);
  //mostrar el select de direcciones
  if (checkbox == true) {
    this.isDireccion = true;
    console.log(this.service.formData.IdClientes);
    this.dropdownRefreshDirecciones(this.service.formData.IdClientes);
    //En dado que sea falso, se ocultara el select de direcciones y se regresara a la direccion Fiscal
  } else {
    this.isDireccion = false;
    this.service.GetCliente(this.service.formData.IdClientes).subscribe(data => {
      console.log(data);
      this.service.formData.Calle = data[0].Calle;
      this.service.formData.Colonia = data[0].Colonia;
      this.service.formData.CP = data[0].CP;
      this.service.formData.Ciudad = data[0].Ciudad;
      this.service.formData.Estado = data[0].Estado;
      this.service.formData.NumeroInterior = data[0].NumeroInterior;
      this.service.formData.NumeroExterior = data[0].NumeroExterior;

      this.service.formDataPedido.IdDireccion = 0;

    this.IdDireccion = +"";

      //Actualizar Pedido con la informacion de cliente seleccionada
      this.service.updateVentasPedido(this.service.formDataPedido).subscribe(res => {
        console.log(res);
      });
      


    });
  }
}

changeSeleccion(event){
  /* console.log(event); */
  this.seleccionManual = event.checked
  if(this.seleccionManual == true){
  this.pedidoInfo.SeleccionManual = 'si';
  this.service.updatePedidoInfo(this.pedidoInfo).subscribe(res=>{
    console.log(res);
    this.obtenerTarimas();
    this.aceptarSeleccion=true;
  })
  }else{
    this.pedidoInfo.SeleccionManual = 'no';
    this.service.updatePedidoInfo(this.pedidoInfo).subscribe(res=>{
      console.log(res);
    })
  }
  // if(this.seleccionManual == true){
  //   this.service.formDataPedido.LugarDeEntrega = 'si';
  //   this.service.updateVentasPedido(this.service.formDataPedido).subscribe(res => {
  //     console.log(res);
  //     this.obtenerTarimas();
  //     this.aceptarSeleccion=true;
  //   });
  // }else{
  //   this.service.formDataPedido.LugarDeEntrega = 'no';
  //   this.service.updateVentasPedido(this.service.formDataPedido).subscribe(res => {
  //     console.log(res);
  //   });
  // }
   console.log(this.seleccionManual); 

}

//Metodo que se ejecutara cuando se seleccione alguna direccion
onSelectionChangeDireccion(options: ClienteDireccion, event: any) {
  if (event.isUserInput) {
    console.log(options);
    this.service.formData.Calle = options.Calle;
    this.service.formData.Colonia = options.Colonia;
    this.service.formData.CP = options.CP;
    this.service.formData.Ciudad = options.Ciudad;
    this.service.formData.Estado = options.Estado;
    this.service.formData.NumeroInterior = options.NumeroInterior;
    this.service.formData.NumeroExterior = options.NumeroExterior;
//Agregarle la direccion seleccionada a Pedidos y actualizarlo

    this.service.formDataPedido.IdDireccion = options.IdDireccion;
      this.service.updateVentasPedido(this.service.formDataPedido).subscribe(res => {
        console.log(res);
      });

  }
}


//Metodo para verificar si lleva Direccion que NO sea la FISCAL
llevaDireccion() {
  // let direccion = this.service.formDataPedido.Flete;
  // // console.clear();
  // // console.log(flete);
  // if (flete == 'Sucursal') {
  //   this.isFlete = false;
  // } else {
  //   this.isFlete = true;
  // }
}

AbrirDireccionCliente(id: number){
console.log(id);
this.serviceDireccion.IdCliente = id;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    this.dialog.open(ClienteDireccionComponent, dialogConfig);
} 

  // --------------------------- SELECT DIRECCION CLIENTE || onCHANGE SELECT DIRECCION CLIENTE --------------------------------------
  
  //Selection change de cliente

  onSelectionChange(options: Cliente, event: any) {
    if (event.isUserInput) {
      this.service.formData = options;
      this.dropdownRefreshDirecciones(options.IdClientes);
    }
  }


  //Blur del Cliente
  onBlurCliente() {
    // console.log(this.service.formDataPedido);
    this.service.formDataPedido.IdCliente = this.service.formData.IdClientes;
    this.service.formDataPedido.Estatus = 'Guardada';
    console.log(this.service.formDataPedido);
    this.service.updateVentasPedido(this.service.formDataPedido).subscribe(res => {
      this.ClienteSeleccionado = true;
      console.log(res);
    });
  }

  ChecarClienteSeleccionado(){
    console.log(this.service.formData.IdClientes);
    if(this.service.formData.IdClientes > 0){
this.ClienteSeleccionado = true;

//Asignar la direccion al formdata
if(this.service.formDataPedido.IdDireccion > 0){
  this.service.getDireccionID(this.service.formDataPedido.IdDireccion).subscribe( data =>{
    this.service.formData.Calle = data[0].Calle;
      this.service.formData.Colonia = data[0].Colonia;
      this.service.formData.CP = data[0].CP;
      this.service.formData.Ciudad = data[0].Ciudad;
      this.service.formData.Estado = data[0].Estado;
      this.service.formData.NumeroInterior = data[0].NumeroInterior;
      this.service.formData.NumeroExterior = data[0].NumeroExterior;

this.IdDireccion = data[0].IdDireccion; 
this.isDireccion = true;
this.changeDireccion(this.isDireccion);
  });
}

    }else{
      this.ClienteSeleccionado = false;
    }
    console.log(this.ClienteSeleccionado);
  }

  onSelectionChange2(options2: Producto, event: any) {
    if (event.isUserInput) {
      this.service.formProd = options2;
      this.PStock = this.service.formProd.Stock;
      this.ProductoPrecio = +this.service.formProd.PrecioVenta;
      //asignar el valor inicial en caso de que la moneda este declarada en USD
      if (this.MonedaBoolean == false) {
        this.ProductoPrecioDLLS = (+this.service.formProd.PrecioVenta / this.TipoCambio);
      }

      this.ClaveProducto = this.service.formProd.ClaveProducto;
      this.droddownMarcas(this.service.formProd.Nombre);
      this.droddownOrigen();
      this.droddownPresentacion();

      this.OrigenSelect = 'USA'
      this.claveorigen = '1'
      this.PresentacionSelect = '25 Kg'
      console.log(+this.PStock + " STOCKKKK");
    }
  }

  onSelectionChangeMarca(options2, event: any){
    console.log(options2);
    this.clavemarca = options2.ClaveMarca
    this.MarcaSelect = options2.NombreMarca
    
    this.service.formProd.DescripcionProducto = this.ProductoSelect + ' ' + this.MarcaSelect + ' ' + this.OrigenSelect + ' ' + this.PresentacionSelect
  }
  onSelectionChangeOrigen(options2, event: any){
    console.log(options2);
    this.claveorigen = options2.ClaveOrigen;
    this.OrigenSelect = options2.NombreOrigen;
    this.service.formProd.DescripcionProducto = this.ProductoSelect + ' ' + this.MarcaSelect + ' ' + this.OrigenSelect + ' ' + this.PresentacionSelect

  }
  onSelectionChangePresentacion(options2, event: any){
    console.log(options2);
    this.PresentacionSelect = options2.Presentacion;
    this.service.formProd.DescripcionProducto = this.ProductoSelect + ' ' + this.MarcaSelect + ' ' + this.OrigenSelect + ' ' + this.PresentacionSelect
    

  }







  Inicializar(form?: NgForm) {

    //Inicializar los valores del Cliente
    this.service.formData;
    this.service.formDataPedido;
    this.service.formDataDP;

    this.ActualizarDetallePedidoBool = false;

    // form.resetForm();



    //Obtener Tipo Cambio
    this.TipoCambio = this.serviceTipoCambio.TipoCambio;
    console.log('TIPO CAMBIO = ' + this.TipoCambio);


    //Obtener ID del local storage
    this.IdPedido = +localStorage.getItem('IdPedido');

    this.service.getPedidoId(this.IdPedido).subscribe(data => {
      console.log(data);
      this.service.formDataPedido = data[0];
      this.EstatusOC = this.service.formDataPedido.Estatus;

      //^ Obtendremos informacion Adicional al Pedido
      this.service.getPedidoInfoIdPedido(data[0].IdPedido).subscribe(respInfo=>{

        //^ Verificamos si existe un record. Si no, crearemos uno
        if(respInfo.length>0){
          this.pedidoInfo = respInfo[0];
          //^ Verificamos si se esta utilizando la seleccion manual
          if(respInfo[0].SeleccionManual == 'si'){
            this.seleccionManual=true;
          }else{
            this.seleccionManual=false;
          }
        }else{
          let pedidoIn: PedidoInfo = {
            IdPedidoInfo: 0,
            IdPedido: data[0].IdPedido,
            SeleccionManual: 'si',
            Campo1: '',
            Campo2: '',
            Campo3: ''
          }
          this.pedidoInfo = pedidoIn;
          this.seleccionManual=true;
            this.service.addPedidoInfo(pedidoIn).subscribe(resAdd=>{
              console.log(resAdd);
            })
        }
        // Utilizaremos Lugar de entrega para guardar si es seleccion Manual o no.
        // if(this.service.formDataPedido.LugarDeEntrega == 'si'){
        //   this.seleccionManual=true;
        // }else{
        //   this.seleccionManual=false;
        // }
        // console.log(this.Estatus);
        
        //VerificarFlete
        this.llevaFlete();
        
        //Verificar Factura
        this.llevaFactura(); 
        
        this.Moneda = this.service.formDataPedido.Moneda;
        
        if (this.MonedaBoolean == true) {
          this.descuento = this.service.formDataPedido.Descuento;
        } else {
          this.descuentoDlls = this.service.formDataPedido.DescuentoDlls;
          
        }
        if (this.Moneda == 'MXN') {
          this.MonedaBoolean = true;
          
        } else {
          this.MonedaBoolean = false;
        }
        console.log(this.service.formDataPedido);
        if (data[0].IdCliente == 0) {
          console.log('ID 0');
          this.service.formData = new Cliente();
          this.ChecarClienteSeleccionado();
        } else {
          console.log('ID Diferente a 0');
          this.service.GetCliente(data[0].IdCliente).subscribe(data => {
            console.log(data);
            this.service.formData = data[0];
            this.ChecarClienteSeleccionado();
          });
        }
        this.nodes();
      }); 
      });
      console.log(this.IdPedido);
      
      
      
    }
    
    nodes(){
      if (this.service.formDataPedido.Estatus === 'Cerrada') {
        let nodes = document.getElementById('step1').getElementsByTagName('*');
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].setAttribute('disabled', 'true')
      }
       nodes = document.getElementById('step2').getElementsByTagName('*');
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].setAttribute('disabled', 'true')
      }
       nodes = document.getElementById('step3').getElementsByTagName('*');
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].setAttribute('disabled', 'true')
      }
    }
  }



  MonedaSelected(event: any) {
    // console.log(event);
    this.Moneda = event.target.selectedOptions[0].text;
    if (this.Moneda == 'MXN') {
      this.MonedaBoolean = true;

    } else {
      this.MonedaBoolean = false;
    }
    // console.log(this.Moneda);
    this.service.formDataPedido.Moneda = this.Moneda;
    // console.log(this.service.formDataPedido);
    this.service.formDataPedido.Estatus = 'Guardada';
    this.service.updateVentasPedido(this.service.formDataPedido).subscribe(res => {
      console.log(res);
    })
    // this.service.Moneda = this.Moneda;
    // console.log(this.service.Moneda);
  }

  FleteSelected(event: any) {
    console.log(event);



    this.service.formDataPedido.Estatus = 'Guardada';
    this.service.updateVentasPedido(this.service.formDataPedido).subscribe(res => {
      console.log(res);

   


    })
  }

  onBlurDescuento() {
    this.descuento = this.service.formDataPedido.Descuento;
    this.service.formDataPedido.DescuentoDlls = (+this.descuento / this.TipoCambio).toString();
    this.service.formDataPedido.Estatus = 'Guardada';
    this.service.updateVentasPedido(this.service.formDataPedido).subscribe(res => {
      this.refreshDetallesPedidoList();
      /* console.clear(); */
      console.log(res);
      console.log(this.descuento,'descuentoMXN');
      console.log(this.descuentoDlls,'descuentoDLLS');
    })
  }

  onBlurDescuentoDlls() {
    this.descuentoDlls = this.service.formDataPedido.DescuentoDlls;
    this.service.formDataPedido.Descuento = (+this.descuentoDlls * this.TipoCambio).toString();
    this.service.formDataPedido.Estatus = 'Guardada';
    this.service.updateVentasPedido(this.service.formDataPedido).subscribe(res => {
      this.refreshDetallesPedidoList();
      // console.clear();
      console.log(res);
      console.log(this.descuentoDlls,'DescuentoDLLS');
      console.log(this.descuento,'DescuentoMXN');
    })
  }

  public listMoneda: Array<Object> = [
    { Moneda: 'MXN' },
    { Moneda: 'USD' }
  ];
  public listPrioridad: Array<Object> = [
    { Prioridad: 'Normal' },
    { Prioridad: 'Urgente' }
  ];
  public listFlete: Array<Object> = [
    { Flete: 'Local' },
    { Flete: 'Foraneo' },
    { Flete: 'Paqueteria' }
  ];

  //Tabla de Productos
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['ClaveProducto', 'Producto', 'Cantidad', 'Importe', 'Options'];
  @ViewChild(MatSort, null) sort: MatSort;



  //Iniciar en 0 Valores de los Totales
  IniciarTotales() {
    //Inicializar en 0 el select del producto
    this.ProductoSelect = "";
    this.options2 = [];
    this.dropdownRefresh2();
    //Inicializar Vacio el Select De Unidad
    this.service.formDataDP.Unidad = "";
    //Inicializar totales
    this.Cantidad = 0;
    this.subtotal = 0;
    this.iva = 0;
    this.total = 0;
    this.subtotalDlls = 0;
    this.totalDlls = 0;
    this.ivaDlls = 0;
    //Stock real al momento de editar
    this.StockReal = 0;
    this.descuento = 0;
    this.subtotal = 0;
    this.descuentoDlls = 0;
  }



  refreshDetallesPedidoList() {
    this.IniciarTotales();

    this.service.GetDetallePedidoId(this.IdPedido).subscribe(data => {
      console.log('------------------------');
      console.log(data);
      //Verificar si hay datos en la tabla
      if (data.length > 0) {
        this.valores = true;

      

        // if(data[0].TextoExtra != 0 ||  data[0].TextoExtra != ""){
          // this.seleccionManual = true;
        // }
        (<HTMLInputElement>document.getElementById("Moneda")).disabled = true;
        this.listData = new MatTableDataSource(data);
        this.listData.sort = this.sort;
        //Suma Total de importes de detalle pedidos

        this.service.GetSumaImporte(this.IdPedido).subscribe(data => {
          console.log(data);
          // console.clear();
          console.log(this.service.formDataPedido);
          this.descuento = this.service.formDataPedido.Descuento;
          this.subtotal = data[0].importe;
          this.total = data[0].importe - this.descuento;

          this.descuentoDlls = this.service.formDataPedido.DescuentoDlls;
          this.subtotalDlls = data[0].importeDlls;
          this.totalDlls = data[0].importeDlls - this.descuentoDlls;



          console.log(this.total);
          console.log(this.totalDlls);
        })

      } else {
        this.valores = false;
        if(this.service.formDataPedido.Flete == 'Sucursal'){
          this.seleccionManual = true;
        }
        (<HTMLInputElement>document.getElementById("Moneda")).disabled = false;
        this.listData = new MatTableDataSource(data);
        this.listData.sort = this.sort;
        console.log('No hay valores');
      }
    })
  }

  //Metodo para mostrat los tipos de flete en caso de que se requiera uno. U ocultar los fletes.
  changeFlete(checkbox: any) {
    console.log(checkbox);
    if (checkbox == true) {
      this.isFlete = true;
      this.seleccionManual = false;
      this.service.formDataPedido.Flete = 'Local';
      this.pedidoInfo.SeleccionManual = 'no';
      this.service.updatePedidoInfo(this.pedidoInfo).subscribe(res=>{
        console.log(res);
      })
      // this.service.formDataPedido.LugarDeEntrega = 'no';
    } else {
      this.isFlete = false;
      this.service.formDataPedido.Flete = 'Sucursal';
      this.pedidoInfo.SeleccionManual = 'si';
      // this.service.formDataPedido.LugarDeEntrega = 'si';
      this.seleccionManual = true;      
      this.service.updatePedidoInfo(this.pedidoInfo).subscribe(res=>{
        console.log(res);
      })
    }
  }

  //Metodo para verificar si lleva Flete el pedido
  llevaFlete() {
    let flete = this.service.formDataPedido.Flete;
    // console.clear();
    // console.log(flete);
    if (flete == 'Sucursal') {
      this.isFlete = false;
    } else {
      this.isFlete = true;
    }
  }

  //On change checkbox factura
  changeFactura(checkbox: any) {
    // console.clear();
    // console.log(checkbox);
    if (checkbox == true) {
      this.isFactura = true;
      this.service.formDataPedido.Factura = 1;
    } else {
      this.isFactura = false;
      this.service.formDataPedido.Factura = 0;
    }
    console.log(this.service.formDataPedido.Factura);

  }
  //Metodo para verificar si el pedido lleva factura y darle valor booleano al checkbox
  llevaFactura(){
let factura = this.service.formDataPedido.Factura;
// console.clear();
// console.log(factura);
if(factura == 0){
  this.isFactura = false;
}else{
this.isFactura = true;
}
  }





  onAddProducto(form: NgForm) {
    this.service.formDataDP.IdPedido = this.IdPedido;
    //this.service.formDataDP.ClaveProducto = this.service.formProd.ClaveProducto;
    this.service.formDataDP.ClaveProducto = this.service.formProd.ClaveProducto + this.clavemarca + this.claveorigen;
    this.service.formDataDP.TextoExtra = '';
    //this.service.formDataDP.Producto = this.service.formProd.Nombre;
    this.service.formDataDP.Producto = this.service.formProd.Nombre + ' ' + this.MarcaSelect + ' ' + this.OrigenSelect + ' ' + this.PresentacionSelect ;
    this.service.formDataDP.Unidad = this.service.formProd.UnidadMedida;
    this.service.formDataDP.PrecioUnitario = this.ProductoPrecioMXN.toString();
    this.service.formDataDP.PrecioUnitarioDlls = this.ProductoPrecioDLLS.toString();
    this.service.formDataDP.Cantidad = this.Cantidad.toString();
    this.service.formDataDP.Importe = this.importeP.toString();
    this.service.formDataDP.ImporteDlls = this.importePDLLS.toString();
    console.log(this.service.formDataDP);

    //^ Agregar datos Faltantes si es seleccion manual
    if(this.seleccionManual == true){
      // let productosIngreso = [];
      console.log(this.seleccionadosSeleccion);
      this.seleccionadosSeleccion.forEach(element => {
        element.Cantidad = this.Cantidad.toString();
        element.IdPedido = this.IdPedido;
        element.Importe = this.importeP.toString();
        element.ImporteDlls = this.importePDLLS.toString();
        element.PrecioUnitario = this.ProductoPrecioMXN.toString();
        element.PrecioUnitarioDlls = this.ProductoPrecioDLLS.toString();
        element.Unidad = '';
        //^ Usar TextoExtra como Lote
        element.TextoExtra = element.Lote;
        // //^ Usar Observaciones como Peso x Saco
        element.Observaciones = element.PesoxSaco;
        // productosIngreso.push(element);
        this.service.addDetallePedido(element).subscribe(res => {
          console.log('DETALLE',res);
          this.selection.clear();
          this.seleccionadosSeleccion = [];
          this.ProductoPrecio = 0
          this.ProductoPrecioDLLS = 0
          this.importeP = 0
          this.importePDLLS = 0
          this.refreshDetallesPedidoList();
                Swal.fire({
        icon: 'success',
        title: 'Concepto Agregado'
      })
        })
      });
      // console.log(productosIngreso);
    }else{
      this.service.addDetallePedido(this.service.formDataDP).subscribe(res => {
          console.log('DETALLE',res);
          this.ProductoPrecio = 0
          this.ProductoPrecioDLLS = 0
          this.importeP = 0
          this.importePDLLS = 0
          this.refreshDetallesPedidoList();
        })
          Swal.fire({
            icon: 'success',
            title: 'Concepto Agregado'
          })

    }


    //   //Restar el Stock
    //  // this.RestarStock();
    //   // this.IniciarTotales();
    //   //form.resetForm();


  }

  //Metodo para restar Stock Producto
  RestarStock() {
    let stock = this.PStock - +this.service.formDataDP.Cantidad;
    let id = this.ClaveProducto;
    console.log(stock + '-----' + id);
    this.service.updateStockProduto(id, stock.toString()).subscribe(res => {
      console.log(res);
    });
  }


  //Metodo para sumar Stock Producto
  SumarStock(Cantidad: string, ClaveProducto: string, Id: number) {
    console.log(ClaveProducto + 'claveproducto');
    console.log(Id + 'IDDDDD');
    this.service.GetProductoDetalleProducto(ClaveProducto, Id).subscribe(data => {
      console.log(data[0]);
      let stock = data[0].Stock;
      console.log(stock);
      stock = (+stock) + (+Cantidad);
      console.log(stock);
      this.service.updateStockProduto(ClaveProducto, stock.toString()).subscribe(res => {
        console.log(res);
      });
    })


  }

  //On change Cantidad 
  onChangeCantidadP(cantidad: any) {
    console.log(cantidad);
    let elemHTML: any = document.getElementsByName('Cantidad')[0];
    if(this.seleccionManual == true){
console.log('Seleccion Manual Obteniendo Kg Maximos');
// this.kilogramosMaximos
console.log('%c%s', 'color: #ffa640', this.kilogramosMaximos);
this.validarStock(cantidad);
    }
    elemHTML.value = this.Cantidad;
    //Transformar la Cantidad en entero e igualarlo a la variable Cantidad
    this.calcularImportePedido();
    // console.log(this.Cantidad);
    // console.log(this.ProductoPrecio);
  }

  //On change Precio
  onChangePrecio(precio: any) {
    console.log(precio);
    let elemHTML: any = document.getElementsByName('PrecioCosto')[0];
    // //Transformar la Cantidad en entero e igualarlo a la variable Cantidad
    elemHTML.value = +this.ProductoPrecio;
    this.calcularImportePedido();
  }
  onChangePrecioDlls(precioDlls: any) {
    console.log(precioDlls);
    let elemHTML: any = document.getElementsByName('PrecioCostoDlls')[0];
    // //Transformar la Cantidad en entero e igualarlo a la variable Cantidad
    elemHTML.value = +this.ProductoPrecioDLLS;
    this.calcularImportePedido();
  }

  validarStock(cantidad: any) {
    console.log(cantidad + ' CANTIDAD');
    if (+cantidad >= +this.kilogramosMaximos) {
      this.Cantidad = +this.kilogramosMaximos.toString();
    }
    if (+cantidad < 0) {
      this.Cantidad = 0;
    }
    if (cantidad == null) {
      this.Cantidad = 0;
    }
  }


  //Al Click en Edit va a buscar el JN y traer DP y Pedido para llenar los campos a editar
  OnEditProducto(dp: DetallePedido) {
    //Iniciar en 0 las variables de totales, stock y
    this.IniciarTotales();

    this.ActualizarDetallePedidoBool = true;
    this.service.formDataDP = dp;
    this.service.GetProductoDetalleProducto(dp.ClaveProducto, dp.IdDetallePedido).subscribe(data => {

      // if (this.service.formDataPedido.Moneda == 'MXN') {
      //   this.importeP = data[0].Importe;
      //   console.clear();
      //   console.log(this.importeP);
      //   console.log('mxn');
      // }
      // else {
      //   this.importeP = data[0].ImporteDlls;
      //   console.clear();
      //   console.log(this.importeP);
      //   console.log('dlls');
      // }
      if (this.MonedaBoolean == true) {
        this.importeP = data[0].Importe;
        this.ProductoPrecio = data[0].PrecioUnitario;
      } else {
        this.importePDLLS = data[0].ImporteDlls;
        this.ProductoPrecio = data[0].PrecioUnitarioDlls;
      }

      this.ProductoSelect = data[0].IdProducto;
      this.service.formProd.Nombre = data[0].Nombre;
      // this.ProductoPrecio = data[0].PrecioUnitario;
      // this.ProductoPrecioDLLS = data[0].PrecioUnitarioDlls;
      this.Cantidad = data[0].Cantidad;
      this.service.formDataPedido.Moneda;
      this.service.formProd.ClaveProducto = data[0].ClaveProducto;
      // this.service.formDataDP.Unidad = data[0].Unidad;
      this.service.formProd.Stock = data[0].Stock;
      this.service.formProd.DescripcionProducto = data[0].DescripcionProducto;
      this.service.formProd.Estatus = data[0].Estatus;
      this.service.formProd.IVA = data[0].IVA;
      this.service.formProd.ClaveSAT = data[0].ClaveSAT;
      // this.service.formDataDP.Observaciones = data[0].Observaciones;
      // this.service.formDataDP.TextoExtra = data[0].TextoExtra;

      //Asignar Clave producto a Editar, para ser validado despues
      this.ClaveP = data[0].ClaveProducto;
      this.CantidadP = this.Cantidad;

      this.StockReal = (+this.Cantidad) + (+this.service.formProd.Stock);
      console.log(this.StockReal);
      this.service.formProd.Stock = this.StockReal.toString();
      this.PStock = this.service.formProd.Stock;
      this.onChangePrecio(this.ProductoPrecio);
      this.onChangeCantidadP(this.Cantidad);
    })
  }

  OnEditDetallePedidodp(form: NgForm) {
    // console.clear();


    this.service.formDataDP.IdPedido = this.IdPedido;
    this.service.formDataDP.ClaveProducto = this.service.formProd.ClaveProducto;
    this.service.formDataDP.Producto = this.service.formProd.Nombre;
    this.service.formDataDP.Unidad = this.service.formProd.UnidadMedida;
    this.service.formDataDP.PrecioUnitario = this.ProductoPrecioMXN.toString();
    this.service.formDataDP.PrecioUnitarioDlls = this.ProductoPrecioDLLS.toString();
    this.service.formDataDP.Cantidad = this.Cantidad.toString();
    this.service.formDataDP.Importe = this.importeP.toString();
    this.service.formDataDP.ImporteDlls = this.importePDLLS.toString();
    console.log(this.service.formDataDP);

    if (this.ClaveP == this.service.formDataDP.ClaveProducto) {
      console.log('SIGUE SIENDO EL MISMO PRODUCTO');
      this.service.OnEditDetallePedido(this.service.formDataDP).subscribe(res => {
        this.ActualizarDetallePedidoBool = false;
        this.RestarStock();
        this.refreshDetallesPedidoList();
        this.IniciarTotales();
        form.resetForm();
        Swal.fire({
          icon: 'success',
          title: 'Pedido Actualizado'
        })
      })

    } else {
      console.log('NUEVO PRODUCTO');

      // console.clear();
      console.log(this.CantidadP.toString());
      console.log(this.ClaveP.toString());
      console.log(this.service.formDataDP.IdDetallePedido);



      this.SumarStock(this.CantidadP.toString(), this.ClaveP.toString(), this.service.formDataDP.IdDetallePedido);
      // console.log(this.service.formDataDP);

      this.service.OnEditDetallePedido(this.service.formDataDP).subscribe(res => {
        this.ActualizarDetallePedidoBool = false;
        this.RestarStock();
        this.refreshDetallesPedidoList();
        this.IniciarTotales();
        form.resetForm();
        Swal.fire({
          icon: 'success',
          title: 'Pedido Actualizado'
        })
      })


    }


  }

  Cancelar(form: NgForm) {
    this.ActualizarDetallePedidoBool = false;
    this.refreshDetallesPedidoList();
    this.IniciarTotales();
    form.resetForm();
    // resetear form
  }


  calcularImportePedido() {

    if (this.Moneda == 'MXN') {
      console.log('LA MONEDA ES MXN');
      this.ProductoPrecioMXN = +this.ProductoPrecio;
      this.ProductoPrecioDLLS = +this.ProductoPrecio / this.TipoCambio;
      this.importeP = this.Cantidad * +this.ProductoPrecio;
      this.importePDLLS = this.Cantidad * (+this.ProductoPrecio / this.TipoCambio);
    } else {
      console.log('LA MONEDA ES USD');
      console.log(this.ProductoPrecio);
      console.log(this.TipoCambio);
      this.ProductoPrecioDLLS = +this.ProductoPrecioDLLS;
      this.ProductoPrecioMXN = +this.ProductoPrecioDLLS * this.TipoCambio;
      this.importePDLLS = this.Cantidad * +this.ProductoPrecioDLLS;
      this.importeP = this.Cantidad * (+this.ProductoPrecioDLLS * this.TipoCambio);
    }

  }



  onDeleteDetalleProducto(dp: DetallePedido) {

    Swal.fire({
      title: '¿Segur@ de Borrar Concepto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {

        this.SumarStock(dp.Cantidad, dp.ClaveProducto, dp.IdDetallePedido);
        this.service.onDeleteDetallePedido(dp.IdDetallePedido).subscribe(res => {
          console.log('//////////////////////////////////////////////////////');
          console.log(res);
          console.log('//////////////////////////////////////////////////////');
          this.refreshDetallesPedidoList();

          Swal.fire({
            title: 'Borrado',
            icon: 'success',
            timer: 1000,
            showCancelButton: false,
            showConfirmButton: false
          });

        })

      }
    })






  }

  crearPedido() {

    this.service.formDataPedido.Estatus = 'Guardada';

    this.service.formDataPedido.Total = this.total;
    this.service.formDataPedido.Subtotal = this.subtotal;
    this.service.formDataPedido.TotalDlls = this.totalDlls;
    this.service.formDataPedido.SubtotalDlls = this.subtotalDlls;

    console.log(this.service.formDataPedido);
    this.service.updateVentasPedido(this.service.formDataPedido).subscribe(res => {
      console.log('Actualizacion',res)
      Swal.fire({
        icon: 'success',
        title: 'Venta Guardada'
      })
      this.generarEventoCalendario(this.service.formDataPedido.Folio);
      /* this.service.filter('Register click'); */
    }
    )
  }

  generarEventoCalendario(folio){
    // console.log(this.compra);
    //idcalendario, folio, documento, descripcion, inicio, fin, titulo, color, allday, rezi ,rezi, dragga
    // console.log(this.CalendarioService.DetalleCalendarioData);
    //Obtener el id del calendario que le corresponde al usuario y al modulo
    let usuario: any
    usuario = localStorage.getItem('ProlappSession');
    usuario = JSON.parse(usuario);
    console.log(usuario.user);
    this.CalendarioService.getCalendarioComprasUsuarioModulo(usuario.user, 'Ventas').subscribe(res=>{
      console.log(res);
      this.CalendarioService.DetalleCalendarioData.IdCalendario = res[0].IdCalendario;
      //el folio corresponde con la Orden/Documento que se genera junto con el evento.
      this.CalendarioService.DetalleCalendarioData.Folio = folio;
      this.CalendarioService.DetalleCalendarioData.Documento = 'OrdenVenta';
      this.CalendarioService.DetalleCalendarioData.Descripcion = 'Evento Orden de Venta con Folio: '+folio;
      //Las fechas van a variar dependiendo en el modulo en el que se encuentre
      this.CalendarioService.DetalleCalendarioData.Start =this.service.formDataPedido.FechaDeExpedicion;
      this.CalendarioService.DetalleCalendarioData.Endd = this.service.formDataPedido.FechaDeEntrega;
      this.CalendarioService.DetalleCalendarioData.Title = 'Orden de Venta ' + folio;
      this.CalendarioService.DetalleCalendarioData.Color = '#0fd8e6';
      console.log(this.CalendarioService.DetalleCalendarioData);
      this.CalendarioService.addDetalleCalendario(this.CalendarioService.DetalleCalendarioData).subscribe(resAdd=>{
        console.log(resAdd);
      })
    })
  }

  verlistdata(){
    console.log(this.listData.data);
    let palabra  = this.listData.data[0].Producto.split(' ')
    console.log(palabra,'palabra');
    let j = palabra.length-2;
    let i = palabra.length-1;
   console.log(palabra[j],'j');
   console.log(palabra[i],'i');
  }

  presentacion(producto){
    let palabra = producto.split(' ');
    let j = palabra.length-2;
    return palabra[j];
  }

  cerrarPedido() {

    let ordencarga;
    let detordencarga;
    let sacos;
    let kg;
    let user;
    user = JSON.parse(localStorage.getItem('ProlappSession')).user;


    console.log(this.service.formDataPedido);

    /* INICIO DE SELECCION MANUAL */

    if (this.seleccionManual && this.service.formDataPedido.Flete == 'Sucursal') {
    




      // const dialogConfig = new MatDialogConfig();
      // dialogConfig.disableClose = false;
      // dialogConfig.autoFocus = true;
      // dialogConfig.width = "90%";

      // dialogConfig.data = {
        // bodega: 'Chihuahua',
        // productos: this.listData.data,
        // tipo: this.seleccionManual
      // }

      // let mercanciadl = this.dialog.open(MercanciaComponent, dialogConfig);
      // let d = 1;

      // mercanciadl.afterClosed().subscribe(data => {

      //   console.log(data, 'AFTERCLOSED');



        // if (typeof data != 'undefined') {

          this.service.formDataPedido.Estatus = 'Cerrada';


          this.service.formDataPedido.Total = this.total;
          this.service.formDataPedido.Subtotal = this.subtotal;
          this.service.formDataPedido.TotalDlls = this.totalDlls;
          this.service.formDataPedido.SubtotalDlls = this.subtotalDlls;

// let productos = data
          let productos = this.listData.data;
          let fletera;
          let validacion;

          this.serviceordencarga.getUltimoFolio().subscribe(data => {

            console.log(data[0].Folio);
            // if (this.service.formDataPedido.Flete == 'Foraneo') {
            //   fletera = '0';
            // } else {
              fletera = this.service.formDataPedido.Flete;
            // }

            if (fletera == '0') {
              validacion = 'Sin Validar'
            } else {
              validacion = 'Creada'
            }


            sacos = 0;
            kg = 0;
            let presentacion;

            console.log(this.listData);

            for (let i = 0; i < this.listData.data.length; i++) {
              kg = kg + +this.listData.data[i].Cantidad;
              sacos = sacos + (+this.listData.data[i].Cantidad / +this.listData.data[i].Observaciones)
            }

            /* sacos = sacos / 25; */

            ordencarga = {

              IdOrdenCarga: 0,
              Folio: data[0].Folio,
              FechaEnvio: new Date(),
              IdCliente: this.service.formDataPedido.IdCliente,
              Cliente: this.service.formData.Nombre,
              IdPedido: this.service.formDataPedido.IdPedido,
              Fletera: fletera,
              Caja: '0',
              Sacos: sacos,
              Kg: kg,
              Chofer: '',
              Origen: 'Chihuahua',
              Destino: this.service.formData.Estado,
              Observaciones: '',
              Estatus: 'Terminada',
              FechaInicioCarga: new Date('01/01/1900'),
              FechaFinalCarga: new Date('01/01/1900'),
              FechaExpedicion: new Date(),
              IdUsuario: '0',
              Usuario: user
            }

            console.log(ordencarga);





             this.serviceordencarga.addOrdenCarga2(ordencarga).subscribe(data => {

              console.log(data);
              let ocinsertada = new MasterOrdenCarga();
              ocinsertada.ordenCarga = [];
              ocinsertada.ordenCarga.push(data[0]);
              ocinsertada.detalleOrdenCarga = []
              console.log(productos, 'PRODUCTOS');

              for (let i = 0; i < this.listData.data.length; i++) {
                console.log(this.listData.data[i], 'LISTDATA');

                // if (!this.seleccionManual) {
                //   productos[i].Lote = '0';
                // }

                this.tarimaService.getDetalleTarimaClaveLoteBodega(this.listData.data[i].ClaveProducto,this.listData.data[i].TextoExtra, 'Chihuahua' ).subscribe(resDetalle=>{

                  console.log(resDetalle);
                  let sal = 0
                  detordencarga = {
                    
                    IdDetalleOrdenCarga: 0,
                    IdOrdenCarga: ocinsertada.ordenCarga[0].IdOrdenCarga,
                    ClaveProducto: this.listData.data[i].ClaveProducto,
                    Producto: this.listData.data[i].Producto,
                    Sacos: (+this.listData.data[i].Cantidad / +resDetalle[0].PesoxSaco),
                    PesoxSaco: resDetalle[0].PesoxSaco,
                    Lote: this.listData.data[i].TextoExtra,
                    IdProveedor: resDetalle[0].IdProveedor,
                    Proveedor: resDetalle[0].Proveedor,
                    PO: resDetalle[0].PO,
                    FechaMFG: resDetalle[0].FechaMFG,
                    FechaCaducidad: resDetalle[0].FechaCaducidad,
                    Shipper: resDetalle[0].Shipper,
                    USDA: resDetalle[0].USDA,
                    Pedimento: resDetalle[0].Pedimento,
                    Saldo: sal.toString(),
                }
                
                console.log(detordencarga);
                ocinsertada.detalleOrdenCarga.push(detordencarga)
                
                 this.serviceordencarga.addDetalleOrdenCarga(detordencarga).subscribe(data => {
                  
                   console.log(data);
                 })
                //^Agregar Orden Temporal

          
                let ordenT = new OrdenTemporal();
                // let Sacos = this.ordenTemporalService.preOrdenTemporal[i].Sacos;
                // let Lote = this.ordenTemporalService.preOrdenTemporal[i].Lote;
                // let ClaveProducto = this.ordenTemporalService.preOrdenTemporal[i].ClaveProducto;
                console.log(this.ordenTemporalService.preOrdenTemporal);
                console.log(this.ordenTemporalService.preOrdenTemporal[i]);
            
                // ordenT.IdOrdenTemporal = this.ordenTemporalService.preOrdenTemporal[i].IdOrdenTemporal;
                ordenT.IdDetalleTarima = resDetalle[0].IdDetalleTarima;
                ordenT.IdOrdenCarga = ocinsertada.ordenCarga[0].IdOrdenCarga;
                ordenT.IdOrdenDescarga = 0;
                ordenT.QR = '';
                ordenT.NumeroFactura = resDetalle[0].Shipper;
                ordenT.NumeroEntrada = resDetalle[0].Pedimento
                ordenT.ClaveProducto = resDetalle[0].ClaveProducto;
                ordenT.Lote = resDetalle[0].Lote;
                ordenT.Sacos = (+this.listData.data[i].Cantidad / +resDetalle[0].PesoxSaco).toString();
                ordenT.Producto = resDetalle[0].Producto;
                ordenT.PesoTotal = this.listData.data[i].Cantidad;
                ordenT.FechaCaducidad = resDetalle[0].FechaCaducidad;
                ordenT.FechaMFG = resDetalle[0].FechaMFG;
                ordenT.Comentarios = '';
                //^ Recordar que el CampoExtra1 en OrdenTemporal es el PO de la compra del producto
                ordenT.CampoExtra1 = resDetalle[0].PO;
                ordenT.CampoExtra2 = '';
                ordenT.CampoExtra3 = '';
            
                console.log(ordenT);
                //Insert a Orden Temporal
                 this.ordenTemporalService.addOrdenTemporal(ordenT).subscribe(resAdd => {
                   console.log(resAdd);
                 })

                //^ Actualzar Detalle Tarima
                let DetalleTarima: DetalleTarima = resDetalle[0];

    
                DetalleTarima.SacosTotales = ((+DetalleTarima.SacosTotales) - (+detordencarga.Sacos)).toString();
                DetalleTarima.PesoTotal = ((+DetalleTarima.PesoTotal) - (+this.listData.data[i].Cantidad)).toString();
                // detalleTarimaNueva.Bodega = this.bodegaOrigen;
                // detalleTarimaNueva.Estatus = 'Creada';
        
      
                //^ Actualizar Detalle Tarima o borrar
                if(+DetalleTarima.PesoTotal == 0){
                   this.tarimaService.deleteDetalleTarima(resDetalle[0].IdDetalleTarima).subscribe(resDelete=>{
                     console.log(resDelete);
                   })
                 }else{
                   this.tarimaService.updateDetalleTarimaSacosPesoTarimasBodega(DetalleTarima).subscribe(resUpdateOriginal => {
                     console.log(resUpdateOriginal);
                   })
                 }
                
              })

              }

              //Actualizar DetalleTarima
              //Agregar Orden Temporal
              //



              console.log(this.service.formDataPedido);
               this.service.updateVentasPedido(this.service.formDataPedido).subscribe(res => {
              //   if (fletera == '0') {

              //     this.crearValidacion();
              //   } else {
              //     // localStorage.setItem('IdOrdenCarga', ocinsertada.ordenCarga[0].IdOrdenCarga.toString())
              //     // localStorage.setItem('OrdenCarga', JSON.stringify(ocinsertada))
              //     // this.router.navigate(['/ordenCargaPreparar']);
              //   }

              //   Swal.fire({
              //     icon: 'success',
              //     title: 'Pedido Cerrado'
              //   })

              //   //
              //   //this.ordenTemporalService._listeners.next('Orden')
              //   this.Inicializar();

               })


             })
          })

       // }


        //




      // })/* CERRAR el subscribe del afterclosed */


    } else {
      // console.clear();
      console.log(this.listData);


      /* ORDEN DE CARGA SIN MOSTRAR INVENTARIO */






      this.service.formDataPedido.Estatus = 'Cerrada';


      this.service.formDataPedido.Total = this.total;
      this.service.formDataPedido.Subtotal = this.subtotal;
      this.service.formDataPedido.TotalDlls = this.totalDlls;
      this.service.formDataPedido.SubtotalDlls = this.subtotalDlls;


      //let productos = data.selected;
      let fletera;
      let validacion;

      this.serviceordencarga.getUltimoFolio().subscribe(data => {

        console.log(data[0].Folio);
        // if (this.service.formDataPedido.Flete == 'Foraneo') {
          fletera = '0';
          validacion = 'Sin Validar'

          //^ Poder Generar una Venta sin Verificar el Inventario del producto
          
        sacos = 0;
        kg = 0;
        //let presentacion;






        for (let i = 0; i < this.listData.data.length; i++) {
          kg = kg + +this.listData.data[i].Cantidad;
          sacos = sacos + (+this.listData.data[i].Cantidad / this.presentacion(this.listData.data[i].Producto))
        }

        /* sacos = sacos / 25; */

        ordencarga = {

          IdOrdenCarga: 0,
          Folio: data[0].Folio,
          FechaEnvio: new Date(),
          IdCliente: this.service.formDataPedido.IdCliente,
          Cliente: this.service.formData.Nombre,
          IdPedido: this.service.formDataPedido.IdPedido,
          Fletera: fletera,
          Caja: '0',
          Sacos: sacos,
          Kg: kg,
          Chofer: '',
          Origen: 'Chihuahua',
          Destino: this.service.formData.Estado,
          Observaciones: '',
          Estatus: validacion,
          FechaInicioCarga: new Date('10/10/10'),
          FechaFinalCarga: new Date('10/10/10'),
          FechaExpedicion: new Date(),
          IdUsuario: '0',
          Usuario: user
        }

        console.log(ordencarga);





         this.serviceordencarga.addOrdenCarga2(ordencarga).subscribe(data => {
          let ocinsertada = new MasterOrdenCarga();
          ocinsertada.ordenCarga = [];
          ocinsertada.ordenCarga.push(data[0]);
          ocinsertada.detalleOrdenCarga = []
          /* console.log(data);
          console.log(productos,'PRODUCTOS'); */

          for (let i = 0; i < this.listData.data.length; i++) {
            console.log(this.listData.data[i], 'LISTDATA');

          //^ Validacion para asignarle un valor al Lote, Para que no marque error en el sig request.
            if(!this.listData.data[i].TextoExtra){
              this.listData.data[i].TextoExtra = 'lotenoexistente';
            }

            this.tarimaService.getDetalleTarimaClaveLoteBodega(this.listData.data[i].ClaveProducto,this.listData.data[i].TextoExtra, 'Chihuahua' ).subscribe(resDetalle=>{
  
              //^Inicializar los valores de Detalle Orden de Carga en 0's. Estos valores seran utilizados si la seleccion Manual no esta activa.
              let lote = '0';
              let IdProveedor = '';
              let Proveedor = '';
              let PO = '';
              let FechaCaducidad = new Date('01/01/00');            
              let FechaMFG = new Date('01/01/00');
              let Shipper = '';
              let Pedimento = '';    
              let usda = '';    
              //^ Si es seleccion manual, utilizaremos los datos obtenidos del producto en la bodega
            if (this.seleccionManual) {
              lote = this.listData.data[i].TextoExtra;
              IdProveedor = resDetalle[0].IdProveedor;
              Proveedor = resDetalle[0].Proveedor;
              PO = resDetalle[0].PO;
              FechaCaducidad = resDetalle[0].FechaCaducidad;
              FechaMFG = resDetalle[0].FechaMFG;
              Shipper = resDetalle[0].Shipper;
              Pedimento = resDetalle[0].Pedimento;
              usda = resDetalle[0].USDA;
            }

            detordencarga = {

              IdDetalleOrdenCarga: 0,
              IdOrdenCarga: ocinsertada.ordenCarga[0].IdOrdenCarga,
              ClaveProducto: this.listData.data[i].ClaveProducto,
              Producto: this.listData.data[i].Producto,
              Sacos: (+this.listData.data[i].Cantidad / +this.presentacion(this.listData.data[i].Producto)),
              PesoxSaco: this.presentacion(this.listData.data[i].Producto),
              Lote: lote,
              IdProveedor: IdProveedor,
              Proveedor: Proveedor,
              PO: PO,
              FechaMFG: FechaMFG,
              FechaCaducidad: FechaMFG,
              Shipper: Shipper,
              USDA: '',
              Pedimento: Pedimento,
              Saldo: (+this.listData.data[i].Cantidad),
            }

            console.log(detordencarga);
            ocinsertada.detalleOrdenCarga.push(detordencarga)

            //this.service.master[i].detalleOrdenCarga = [];

             this.serviceordencarga.addDetalleOrdenCarga(detordencarga).subscribe(data => {

               console.log(data);
             })
          })

          }



          console.log(this.service.formDataPedido);
          this.service.updateVentasPedido(this.service.formDataPedido).subscribe(res => {
            if (fletera == '0') {

               this.crearValidacion();
            } else {
              localStorage.setItem('IdOrdenCarga', ocinsertada.ordenCarga[0].IdOrdenCarga.toString())
              localStorage.setItem('OrdenCarga', JSON.stringify(ocinsertada))
              // this.router.navigate(['/ordenCargaPreparar']);
            }

            Swal.fire({
              icon: 'success',
              title: 'Pedido Cerrado'
            })

            //
            //this.ordenTemporalService._listeners.next('Orden')
            this.Inicializar();

           } )
         })
        // } 
        // else {
        //   fletera = this.service.formDataPedido.Flete;
        //   validacion = 'Creada'
        //   //^ Se genera una Orden Carga TERMINADA y se descuenta los productos del inventario
        //     this.tarimaService.getDetalleTarimaClaveLoteBodega().subscribe(resTarima=>{
        //       console.log(resTarima);
        //     })
        // }

        // if (fletera == '0') {
        // } else {
        // }

      })



      /*  */





    }







  }

  convertirPedido(){

    console.log(this.service.formDataPedido,'Pedidos');
    console.log(this.service.formData,'Cliente');
    console.log(this.listData.data,'Producto');

    this.service.formDataPedido.Estatus = 'Guardada';

    this.service.formDataPedido.Total = this.total;
    this.service.formDataPedido.Subtotal = this.subtotal;
    this.service.formDataPedido.TotalDlls = this.totalDlls;
    this.service.formDataPedido.SubtotalDlls = this.subtotalDlls;

    console.log(this.service.formDataPedido);
    this.service.updateVentasPedido(this.service.formDataPedido).subscribe(res => {
      Swal.fire({
        icon: 'success',
        title: 'Pedido Cerrado'
      })



    }
    )

  }

  enviarPedido(){
    
    this.service.formt = JSON.parse(localStorage.getItem('pedidopdf'));
    let pedido = this.service.formt;

    console.log(pedido);

 
    // document.getElementById('enviaremail2').click();
  
    // this.folioparam = folio;
    // this.idparam = id;
    this._MessageService.correo = 'ivan.talamantes@live.com';
    this._MessageService.cco = 'ivan.talamantes@riztek.com.mx';
    this._MessageService.asunto = 'Envio Orden de Compra ' + pedido.Folio;
    this._MessageService.cuerpo = 'Se ha enviado un comprobante fiscal digital con folio ' + pedido.Folio;
    this._MessageService.nombre = 'ProlactoIngredientes';

    this.service.formt = JSON.parse(localStorage.getItem('pedidopdf'));
    
    // console.log();
    const dialogConfig2 = new MatDialogConfig();
    dialogConfig2.disableClose = false;
    dialogConfig2.autoFocus = true;
    dialogConfig2.width="70%";
    let dialogFact = this.dialog.open(ReporteEmisionComponent, dialogConfig2);
    
  
  
    
  
    setTimeout(()=>{
  
      // this.xmlparam = folio;
        const content: Element = document.getElementById('element-to-PDF');
        const option = {
          margin: [0, 0, 0, 0],
          filename: 'Orden de Compra-' + pedido.Folio + '.pdf',
          image: { type: 'jpeg', quality: 1 },
          html2canvas: { scale: 2, logging: true, scrollY: 0 },
          jsPDF: { format: 'letter', orientation: 'portrait' },
        };
        html2pdf().from(content).set(option).output('datauristring').then(function(pdfAsString){
          localStorage.setItem('pdfcorreo'+pedido.Folio, pdfAsString);
          this.statusparam=true;          
          console.log(this.statusparam);                
        })
        dialogFact.close()
        
      },1000)
  
    const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "90%";
        dialogConfig.data = {
          foliop: pedido.Folio,
           cliente: pedido.Nombre,
          status: true,
          tipo: 'Pedido'
        }
        this.dialog.open(EmailgeneralComponent, dialogConfig);
  
   
  
  
  }


  verPDF(){
    // console.log(this.service.formDataPedido);
    console.log(this.service.formData);
    console.log(this.service.formDataDP);
    console.log(this.service.formDataPedido);
    console.log(this.service.formProd);
    this.service.formt = JSON.parse(localStorage.getItem('pedidopdf'));
    console.log(this.service.formt)
    // console.log();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    dialogConfig.data = {
      IdPedido: this.IdPedido
    }
    this.dialog.open(ReporteEmisionComponent, dialogConfig);
  }

  agregarProductos(){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "90%";

    dialogConfig.data = {
      bodega: 'Chihuahua',
      productos: this.listData.data
      }
   
    let mercanciadl = this.dialog.open(MercanciaComponent, dialogConfig);
    let d=1;

    mercanciadl.afterClosed().subscribe(data=>{
      console.log(data);

      
      this.service.getProducto(data.selected[0].ClaveProducto).subscribe(prod =>{
        console.log(prod);
        this.service.formProd = prod[0]
        this.service.formProd.ClaveProducto = data.selected[0].ClaveProducto;
        this.service.formProd.Nombre = data.selected[0].Producto;
        this.service.formProd.DescripcionProducto = data.selected[0].Producto;
      })
      
      
    })

  }

  agregarProducto(){
    this.service.formDataDP.IdPedido = this.IdPedido;
    this.service.formDataDP.ClaveProducto = this.service.formProd.ClaveProducto;
    this.service.formDataDP.Producto = this.service.formProd.Nombre;
    this.service.formDataDP.Unidad = this.service.formProd.UnidadMedida;
    this.service.formDataDP.PrecioUnitario = this.ProductoPrecioMXN.toString();
    this.service.formDataDP.PrecioUnitarioDlls = this.ProductoPrecioDLLS.toString();
    this.service.formDataDP.Cantidad = this.Cantidad.toString();
    this.service.formDataDP.Importe = this.importeP.toString();
    this.service.formDataDP.ImporteDlls = this.importePDLLS.toString();

    // console.log(this.service.formDataDP);

    this.service.addDetallePedido(this.service.formDataDP).subscribe(res => {
      // console.log(res);
      //Restar el Stock
      
      this.refreshDetallesPedidoList();
      Swal.fire({
        icon: 'success',
        title: 'Concepto Agregado'
      })
    })
  }


  enviarPedidoAuto(){
    
    this.service.formt = JSON.parse(localStorage.getItem('pedidopdf'));
    let pedido = this.service.formt;

    console.log(pedido);

 
    // document.getElementById('enviaremail2').click();
  
    // this.folioparam = folio;
    // this.idparam = id;
    this._MessageService.correo = 'ivan.talamantes@live.com';
    this._MessageService.cco = 'ivan.talamantes@riztek.com.mx';
    this._MessageService.asunto = 'Envio Orden de Compra ' + pedido.Folio;
    this._MessageService.cuerpo = 'Se ha enviado un comprobante fiscal digital con folio ' + pedido.Folio;
    this._MessageService.nombre = 'ProlactoIngredientes';

    this.service.formt = JSON.parse(localStorage.getItem('pedidopdf'));
    
    // console.log();
    const dialogConfig2 = new MatDialogConfig();
    dialogConfig2.disableClose = false;
    dialogConfig2.autoFocus = true;
    dialogConfig2.width="70%";
    let dialogFact = this.dialog.open(ReporteEmisionComponent, dialogConfig2);
    
  
  
    
  
  
      // this.xmlparam = folio;
        const content: Element = document.getElementById('element-to-PDF');
        const option = {
          margin: [0, 0, 0, 0],
          filename: 'Orden de Compra-' + pedido.Folio + '.pdf',
          image: { type: 'jpeg', quality: 1 },
          html2canvas: { scale: 2, logging: true, scrollY: 0 },
          jsPDF: { format: 'letter', orientation: 'portrait' },
        };
        html2pdf().from(content).set(option).output('datauristring').then(function(pdfAsString){
          localStorage.setItem('pdfcorreo'+pedido.Folio, pdfAsString);
          this.statusparam=true;          
          console.log(this.statusparam); 
                  
        })
        
        
        
        setTimeout(()=>{
          dialogFact.close()
    /*   dialogFact.afterClosed().subscribe(data=>{ */








this.llenarhtml();

        const formData = new FormData();
        formData.append('nombre', this._MessageService.nombre)
        
        formData.append('email', this._MessageService.correo+','+this._MessageService.cco)
        // formData.append('mensaje', this._MessageService.cuerpo)
        formData.append('mensaje', this.service.formData.Nombre)
        formData.append('folio', this.service.formt.Folio)
        formData.append('asunto', this._MessageService.asunto)
        formData.append('pdf', localStorage.getItem('pdfcorreo'+pedido.Folio))
        formData.append('html',this.html)
        // formData.append('xml', localStorage.getItem('xml'+this.data.foliop))
      
        console.log(formData);
        
        
            
            this._MessageService.enviarCorreo(formData).subscribe((resp) => {
        /*       this.loading2 = false;
              this.files = [] */
              //document.getElementById('cerrarmodal').click();
              console.log(resp);
              Swal.fire("Correo Enviado", "Mensaje enviado correctamente", "success");
            });      

    /*   }) */
  },5000)

  
  /*   const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "90%";
        dialogConfig.data = {
          foliop: pedido.Folio,
           cliente: pedido.Nombre,
          status: true,
          tipo: 'Pedido'
        }
        this.dialog.open(EmailgeneralComponent, dialogConfig); */
  
   
  
  
  }


  crearValidacion(){
    console.log(this.service.formDataPedido);

    let validacion = {
      idvalidarordencompra:0,
      idordencompra: this.service.formDataPedido.IdPedido,
      folioordencompra: this.service.formDataPedido.Folio,
      fechaenvio: new Date(),
      estatus: 'Sin Validar',
      fechavalidacion: new Date(10-10-10),
      token: uuid.v4()
    }

    console.log(validacion);

    this.url = 'https://prolapp.riztek.com.mx/#/documento/'+validacion.token

    this.service.addValidacion(validacion).subscribe(resp=>{
      console.log(resp);
      this.enviarPedidoAuto()
    })

 
  }

  getValidacion(){
    this.url = 'https://prolapp.riztek.com.mx/#/documento/2b2bbdf6-94e5-4c23-ad8f-b93e5dcec13d';
    console.log(this.url)
    /* this.service.getValidacion() */
  }




// * ************************** SELECCION MANUAL ****************************************** //

public listBodega: Array<Object> = [
  // { Bodega: 'Todos' },
  // { Bodega: 'PasoTx' },
  // { Bodega: 'San Diego' },
  { Bodega: 'Chihuahua' },
  // { Bodega: 'Transito' },
  
];
// data
// iniciarProductos(){

//   this.productosSeleccion= [];
  
//   console.log(this.listData2Seleccion.data);
//   for (let i=0; i<this.data.productos.length;i++){
//     this.productosSeleccion.push({
//       ClaveProducto:this.listData2Seleccion.data[i].ClaveProducto,
//       Producto:this.listData2Seleccion.data[i].Producto,       
//     })
//   }

//   console.log(this.productosSeleccion);

// }

validarProductos(){

//    this.productos.splice
// this.iniciarProductos()
console.log(this.productosSeleccion);
let productos2 = this.productosSeleccion;
this.contadorSeleccion = productos2.length;
console.log(this.contadorSeleccion);

for (let j=0; j<this.seleccionadosSeleccion.length;j++){
  for (let i=0; i<productos2.length;i++){
    console.log(productos2[i],i,'i');
    console.log(this.seleccionadosSeleccion[j],j,'j');

  if (productos2[i].ClaveProducto==this.seleccionadosSeleccion[j].ClaveProducto){
    productos2.splice(i,1);
    this.contadorSeleccion = this.contadorSeleccion - 1;
    break;
  }
}
}

if (this.contadorSeleccion==0){
this.aceptarSeleccion = false;
}else{
this.aceptarSeleccion = true;
}


console.log(this.aceptarSeleccion);
console.log(productos2);
console.log(this.seleccionadosSeleccion);
console.log(this.contadorSeleccion);


 
  
}


applyFilterSeleccion(filtervalue: string) {
  this.listDataSeleccion.filterPredicate = (data, filter: string) => {
    return data.Producto.toString().toLowerCase().includes(filter) || data.ClaveProducto.toString().toLowerCase().includes(filter);
  };
  this.listDataSeleccion.filter = filtervalue.trim().toLocaleLowerCase();

}

applyFilter2Seleccion(filtervalue: string) {
  this.listDataSeleccion.filterPredicate = (data, filter: string) => {
    return data.Bodega.toString().toLowerCase().includes(filter);
  };
  this.listDataSeleccion.filter = filtervalue.trim().toLocaleLowerCase();

}

obtenerTarimas(){
  // this.listDataSeleccion = new MatTableDataSource();
  this.bodegaSelectSeleccion = 'Chihuahua';
  this.tarimaService.getDetalleTarimaBodega(this.bodegaSelectSeleccion).subscribe(data=>{
    console.log(data,'obtner tarimas');
    this.listDataSeleccion = new MatTableDataSource(data);
    this.listDataSeleccion.sort = this.sortSeleccion;
    this.listDataSeleccion.paginator = this.paginatorSeleccion;
    this.listDataSeleccion.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
    // this.listDataSeleccion.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
    // this.applyFilter2Seleccion('Chihuahua');
    // console.log(this.listDataSeleccion.data[0].ClaveProducto);
    //this.applyFilter(this.listData2.data[0].ClaveProducto);

    // if (!this.seleccionManual){
    //   //console.clear();
    //   this.seleccionAutomatica();
    // }
    
    

  })
}

seleccionAutomatica(){
  /* console.log(this.listData2.data);
  console.log(this.selection.selected);
  console.log(this.listData.filteredData); */
  console.log(this.seleccionManual);

  for(let i=0; i<this.listData2Seleccion.data.length;i++){
    for(let j=0; j<this.listDataSeleccion.filteredData.length;j++){
      if (this.listData2Seleccion.data[i].ClaveProducto==this.listDataSeleccion.filteredData[j].ClaveProducto){

        this.selection.selected.push(this.listDataSeleccion.filteredData[j])
        break;

      }
    }

  }

  this.seleccionadosSeleccion = [];
  for (let i=0; i<this.selection.selected.length;i++){

    this.seleccionadosSeleccion.push({
      ClaveProducto:this.selection.selected[i].ClaveProducto,
      Producto:this.selection.selected[i].Producto,        
    })

  }

//   this.validarProductos();

//   console.log(this.selection);
//   console.log(this.aceptar);

//   if (!this.aceptar){
//     this.seleccionar()
//   }else{
//     console.log('No cerrar');

//   }

}


bodegaCambio(event){
  // console.log(event);
this.bodegaSelectSeleccion = event.value;
console.log(this.bodegaSelectSeleccion);
if (this.bodegaSelectSeleccion==='Todos'){
this.applyFilter2Seleccion('')
}else {

this.applyFilter2Seleccion(this.bodegaSelectSeleccion)
}

}

masterToggle() {
  this.isAllSelected() ?
      this.selection.clear() :
      this.listDataSeleccion.data.forEach(row => this.selection.select(row));
  console.log(this.selection);
}

isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.listDataSeleccion.data.length;
  return numSelected === numRows;
}
checkboxLabel(row?: any): string {
  if (!row) {
    return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
  }    
  return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
}



toggle(row){

console.log(row);
this.seleccionadosSeleccion = [];
  // for (let i=0; i<row.length;i++){
      // if(i == 0){
        this.kilogramosMaximos = row.PesoTotal;
        // console.log('%c%s', 'color: #00b300', this.kilogramosMaximos);
      // }
    this.seleccionadosSeleccion.push({
      ClaveProducto:row.ClaveProducto,
      Producto:row.Producto,        
      Lote:row.Lote,
      KgMaximos:row.PesoTotal,
      PesoxSaco: row.PesoxSaco
    })
    this.verificarKilogramosMaximosSeleccion(row.PesoTotal);

  // }

  


  this.validarProductos();
}

//^ Metodos para verificar cual es el producto con menos inventario disponible.
kilogramosMaximos = 0;
verificarKilogramosMaximosSeleccion(cantidad){
  console.log('%c%s', 'color: #1d5673', this.kilogramosMaximos);
  console.log('%c%s', 'color: #f200e2', cantidad);
  if(this.kilogramosMaximos >= +cantidad){
    this.kilogramosMaximos = cantidad
    this.Cantidad = this.kilogramosMaximos;
  }
  console.log('%c%s', 'color: #1d5673', this.kilogramosMaximos);
}



// * ************************** SELECCION MANUAL ****************************************** //




  llenarhtml(){
    this.html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

  <html xmlns="http://www.w3.org/1999/xhtml" lang="es">
  
  <head>
      <script src="https://kit.fontawesome.com/c30d3b68be.js" crossorigin="anonymous"></script>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  
      <title>Pro LactoIngredientes</title>
  
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  </head>
  
  </html>
  
  <body style="margin: 0; padding: 0;">
  
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
  
          <tr>
  
              <td>
  
                  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
  
                      <tr>
  
  
                          <td align="center" bgcolor="#000000" style="padding: 20px 0 30px 0;">
                              <img src='data:image/png;base64,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'
                                style="height: 150px; width: 150px;">
                              <h1 style="color: #ffffff">Pro LactoIngredientes - Orden de Compra</h1>
  
                          </td>
  
                      </tr>
  
                      <tr>
  
                          <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
  
                              <table border="0" cellpadding="0" cellspacing="0" width="100%">
  
                                  <tr>
  
                                      <td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
  
                                          Cliente: `+this.service.formData.Nombre+`
  
                                      </td>
  
                                  </tr>
  
                                  <tr>
  
                                      <td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
  
                                          Enviamos la siguiente orden de compra, favor de validarla para continuar con el proceso con el siguiente enlace

                                          <a href="`+this.url+`" target="_blank" > Validacion de la Orden de Compra </a>
  
                                      </td>
  
                                  </tr>
  
                                  <tr>
  
                                      <td>
  
                                          <table border="0" cellpadding="0" cellspacing="0" width="100%">
  
                                              <tr>
  
                                                  <td width="260" valign="top">
  
                                                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
  
                                                          <tr>
  
                                                              <td>
  
                                                                  <h1>Principios</h1>
  
                                                              </td>
  
                                                          </tr>
  
                                                          <tr>
  
                                                              <td style="padding: 25px 0 0 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
  
                                                                  Los principios fundamentales de Pro Lactoingredientes son: calidad ante todo y satisfacción total del cliente. Estamos convencidos que para que esto sea posible debemos aplicar una gestión basada en la excelencia, innovación, honestidad, mejora continua,
                                                                  y compromiso como valores corporativos de referencia.
  
  
  
                                                                  <br>1.- Asegurar que los productos y servicios cumplen con la satisfacción exigida por nuestros clientes.
  
                                                                  <br>2.- Conocer las necesidades y expectativas de los clientes para ofrecer un servicio personalizado.
  
                                                                  <br>3.- Asegurar el cumplimiento de los compromisos legales y normativas para garantizar la calidad de los productos que comercializamos.
  
                                                                  <br>4.- Optimizar el funcionamiento de los procesos a través de la calidad y la eficiencia.
  
                                                                  <br>5.- Promover un entorno positivo de desarrollo, participación y de formación con los empleados.
  
                                                                  <br>6.- Asegurar que esta política es difundida, entendida y aceptada por la Organización, con el fin de que contribuya al logro de los compromisos establecidos.
  
                                                              </td>
  
                                                          </tr>
  
                                                      </table>
  
                                                  </td>
  
                                                  <td style="font-size: 0; line-height: 0;" width="20">
  
                                                      &nbsp;
  
                                                  </td>
  
                                                  <td width="260" valign="top">
  
                                                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
  
                                                          <tr>
  
                                                              <td>
  
                                                                  <h1>Politica de Calidad</h1>
  
                                                              </td>
  
                                                          </tr>
  
                                                          <tr>
  
                                                              <td style="padding: 25px 0 0 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
  
                                                                  Comercializar únicamente productos que reúnan los requerimientos de calidad establecidos en las normas sanitarias de instituciones nacionales e internacionales. Recibir y enviar todos los productos que se comercializan debidamente respaldados con los
                                                                  documentos que permitan garantizar a nuestros clientes el origen y la calidad de los mismos. Basar nuestros servicios en un sustento de seriedad y responsabilidad por parte de directivos
                                                                  y colaboradores.
  
                                                              </td>
  
                                                          </tr>
  
                                                      </table>
  
                                                  </td>
  
                                              </tr>
  
                                          </table>
  
                                      </td>
  
                                  </tr>
  
                              </table>
  
                          </td>
  
                      </tr>
  
                      <tr>
  
                          <td bgcolor="#000000" style="padding: 30px 30px 30px 30px;">
  
                              <table border="0" cellpadding="0" cellspacing="0" width="100%">
  
                                  <tr>
  
                                      <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">
  
                                          &reg; Pro LactoIngredientes<br/>
  
  
  
                                      </td>
  
                                      <td align="right" style="color: #ffffff">
  
                                          <table border="0" cellpadding="0" cellspacing="0">
  
                                              <tr>
  
                                                  <td>
  
                                                      <a href="http://www.twitter.com/">
  
                                                          <i class="fa fa-twitter-square" style="color: #ffffff"></i>
  
                                                      </a>
  
                                                  </td>
  
                                                  <td style="font-size: 0; line-height: 0;" width="20">&nbsp;</td>
  
                                                  <td>
  
                                                      <a href="http://www.facebook.com/">
  
                                                          <i class="fa fa-facebook-square" style="color: #ffffff"></i>
  
                                                      </a>
  
                                                  </td>
  
                                              </tr>
  
                                          </table>
  
                                      </td>
  
                                  </tr>
  
                              </table>
  
                          </td>
  
                      </tr>
  
                  </table>
  
      </table>
  
      </td>
  
      </tr>
  
      </table>
  
  </body>`
  }

}
