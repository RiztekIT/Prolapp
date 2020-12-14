import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm, FormControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from 'rxjs';

import { map, startWith } from 'rxjs/operators';
import { Cliente } from 'src/app/Models/catalogos/clientes-model';
import { VentasCotizacionService } from 'src/app/services/ventas/ventas-cotizacion.service';

import { CurrencyPipe } from '@angular/common';
import { Producto } from '../../../../Models/catalogos/productos-model';

import { MatTableDataSource, MatSort } from '@angular/material';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import Swal from 'sweetalert2';
import { TipoCambioService } from '../../../../services/tipo-cambio.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UnidadMedidaService } from 'src/app/services/unidadmedida/unidad-medida.service';
import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { Vendedor } from 'src/app/Models/catalogos/vendedores.model';
import { ClienteDireccion } from 'src/app/Models/cliente-direccion/clienteDireccion-model';
import { ProductosService } from 'src/app/services/catalogos/productos.service';
import { ClienteDireccionService } from 'src/app/services/cliente-direccion/cliente-direccion.service';
import { ClienteDireccionComponent } from 'src/app/components/cliente-direccion/cliente-direccion.component';
import { DetalleCotizacion } from '../../../../Models/ventas/detalleCotizacion-model';
import { Prospecto } from 'src/app/Models/ventas/prospecto-model';
import { CotizacionComponent } from 'src/app/components/cotizacion/cotizacion.component';
import { MessageService } from 'src/app/services/message.service';
import { EmailgeneralComponent } from '../../../../components/email/emailgeneral/emailgeneral.component';
import * as html2pdf from 'html2pdf.js';
import { AddsproductosService } from '../../../../services/addsproductos.service';
import { Cotizacion } from 'src/app/Models/ventas/cotizacion-model';
import { VentasPedidoService } from 'src/app/services/ventas/ventas-pedido.service';
import { Pedido } from 'src/app/Models/Pedidos/pedido-model';
import { InventariosalmacenComponent } from 'src/app/pages/almacen/inventariosalmacen/inventariosalmacen.component';
import * as signalr from 'signalr'
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Bmx-Token': 'd83c7088f2823be9f29cc124cf95dc37056de37c340da5477a09ca1ee91a80a6',
    //'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Headers': 'Bmx-Token, Accept, Accept-Encoding, Content-Type, Origin',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'

  })
}

declare var $: any;

@Component({
  selector: 'app-add-cotizacion',
  templateUrl: './add-cotizacion.component.html',
  styleUrls: ['./add-cotizacion.component.css']
})
export class AddCotizacionComponent implements OnInit {
  

 private connection: any;
 private proxy: any;  
 private proxyName: string = 'alertasHub'; 

  private hubconnection: signalr;  
  notihub = 'https://riztekserver.ddns.net:44361/signalr'


  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  public show:boolean = false;
  public buttonName:any = 'Cliente Nuevo';

  dialogbox: any;
  IdPedido: any;
  Estatus: string;

  constructor(public router: Router, private currencyPipe: CurrencyPipe, public service: VentasCotizacionService,private _formBuilder: FormBuilder,
    private serviceTipoCambio: TipoCambioService, private serviceProducto: ProductosService, private http: HttpClient, public ServiceUnidad: UnidadMedidaService,
    private dialog: MatDialog, public serviceDireccion: ClienteDireccionService, public _MessageService: MessageService, public addproductos: AddsproductosService, public servicepedido: VentasPedidoService) { 
      this.MonedaBoolean = true;

      this.serviceDireccion.listen().subscribe((m:any)=>{
        this.dropdownRefreshDirecciones(this.service.formData.IdClientes);
        });
    }
    
    
    isLinear = false;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;

    Nuevo: false;


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

  public CotizacionBlanco: Cotizacion = 
  {
IdCotizacion: 0,
IdCliente: 0,
Nombre: "",
RFC: "",
Subtotal: 0,
Total: 0,
Descuento: 0,
SubtotalDlls: 0,
TotalDlls: 0,
DescuentoDlls: 0,
Observaciones: "",
Vendedor: 0,
Moneda: "MXN",
FechaDeExpedicion: new Date(),
Flete: "Sucursal",
Folio: 0,
Telefono: 0,
Correo:"",
IdDireccion: 0,
Estatus: "Creada", 
TipoDeCambio: 0,
Vigencia: new Date()
}

public PedidoBlanco: Pedido =
    {
      IdPedido: 0,
      IdCliente: 0,
      Folio: "",
      Subtotal: "",
      Descuento: "",
      Total: "",
      Observaciones: "",
      FechaVencimiento: new Date(),
      OrdenDeCompra: "",
      FechaDeEntrega: new Date(),
      CondicionesDePago: "",
      Vendedor: "",
      Estatus: "Creada",
      Usuario: "",
      Factura: 0,
      LugarDeEntrega: "",
      Moneda: "MXN",
      Prioridad: "Normal",
      SubtotalDlls: "",
      DescuentoDlls:"",
      TotalDlls:"",
      Flete: "Sucursal",
      IdDireccion: 0,
      FechaDeExpedicion: new Date()
    }


  ngOnInit() {  
    this.ConnectionHub();

    this.Inicializar();
    this.dropdownRefresh();
    this.dropdownRefreshVendedor();
    // this.dropdownRefresh2();
    this.refreshDetallesPedidoList();
    // this.IniciarTotales();
    this.tipoDeCambio();
    this.service.formProd = new Producto();

    //^ **** PRIVILEGIOS POR USUARIO *****
    this.obtenerPrivilegios();
    //^ **** PRIVILEGIOS POR USUARIO *****
    // this.firstFormGroup = this._formBuilder.group({
    //   firstCtrl: ['', Validators.required]
    // });
    // this.secondFormGroup = this._formBuilder.group({
    //   secondCtrl: ['', Validators.required]
    // });
    // this.thirdFormGroup = this._formBuilder.group({
    //   thirdCtrl: ['', Validators.required]
    // });

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
    area = 'Cotizaciones';
  
    //^ VARIABLES DE PERMISOS
    Guardar: boolean = false;
    Duplicar: boolean = false;
    Convertir: boolean = false;
    Enviar: boolean = false;
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
        case ('Guardar Cotizacion'):
          this.Guardar = true;
          break;
        case ('Duplicar Cotizacion'):
          this.Duplicar = true;
          break;
        case ('Convertir Cotizacion'):
          this.Convertir = true;
          break;
        case ('Enviar Cotizacion'):
          this.Enviar = true;
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
    localStorage.removeItem('IdCotizacion');
    this.router.navigateByUrl('/cotizacionesVentas');
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
  
  //IdCotizacion
  IdCotizacion: number;

    //cantidad Producto
    Cantidad: number;

  //Variable para verificar si hay valores en detalle pedido. En caso que
  //sea negativo se podra cambiar la moneda. Si es positivo la moneda no se prodra cambiar
  //hasta haber eliminado todos los detalles pedido
  valores: boolean;
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
  // StockReal: number;

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

  //VIGENCIA
  Vigencia: Date;

  // //////////////////////////// BEGIN OBTENER TIPO CAMBIO ////////////////////////////
  rootURL = "/SieAPIRest/service/v1/series/SF63528/datos/"
  Cdolar: String;

  

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

  private _filter(value: any): any[] {
    // console.log(value);
    const filterValue = value.toString().toLowerCase();
    return this.options.filter(option =>
      option.Nombre.toLowerCase().includes(filterValue) ||
      option.IdClientes.toString().includes(filterValue));
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

  //DropDown de Vendedores
  dropdownRefreshVendedor() {
    this.service.GetVendedor().subscribe(data => {
      console.log(data);
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
    console.log(value);
    const filterValue = value.toString().toLowerCase();
    return this.listVendedores.filter(option =>
      option.Nombre.toLowerCase().includes(filterValue) || option.IdVendedor.toString().includes(filterValue));
  }

  onSelectionChangeVendedor(options: Vendedor, event: any) {
    if (event.isUserInput) {
      this.NombreVendedor = options.Nombre;
    }
  }
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
private _filterDireccion(value: any): any[] {
  // console.log(value);
  const filterValue = value.toString().toLowerCase();
  return this.listDireccion.filter(option =>
    option.Calle.toLowerCase().includes(filterValue) || option.Colonia.toString().includes(filterValue));
}
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

      // this.service.formDataPedido.IdDireccion = 0;

    this.IdDireccion = +"";

      //Actualizar Pedido con la informacion de cliente seleccionada
      this.service.onEditCotizacion(this.service.formDataCotizacion).subscribe(res => {
        console.log(res);
      });
    });
  }
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

    // this.service.formDataCotizacion.IdDireccion = options.IdDireccion;
      this.service.onEditCotizacion(this.service.formDataCotizacion).subscribe(res => {
        console.log(res);
      });
  }
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

  onSelectionChange(options: Cliente, event: any) {
    if (event.isUserInput) {
      this.service.formData = options;
      this.dropdownRefreshDirecciones(options.IdClientes);
      
    }
  }
  onBlurCliente() {
    console.log(this.service.formDataCotizacion)
    this.service.formDataCotizacion.IdCliente = this.service.formData.IdClientes;
    this.service.formDataCotizacion.Estatus = 'Creada';
    this.service.formDataCotizacion.Nombre = this.service.formData.Nombre;
    this.service.formDataCotizacion.RFC = this.service.formData.RFC;
    console.log(this.service.formDataCotizacion);
    this.service.onEditCotizacion(this.service.formDataCotizacion).subscribe(res => {
      this.ClienteSeleccionado = true;
      console.log(res);
    });
  }

  ChecarClienteSeleccionado(){
    console.log(this.service.formData.IdClientes);
    if(this.service.formData.IdClientes > 0){
this.ClienteSeleccionado = true;

//Asignar la direccion al formdata
if(this.service.formDataCotizacion.IdDireccion > 0){
  this.service.getDireccionID(this.service.formDataCotizacion.IdDireccion).subscribe( data =>{
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

  onSelectionChange2(options2: Producto, event?: any) {
    console.log(event);
    // if (event.isUserInput) {
      this.service.formProd = options2;
      // this.PStock = this.service.formProd.Stock;
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
      // console.log(+this.PStock + " STOCKKKK");
    // }
  }

  onSelectionChangeMarca(options2, event?: any){
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
    this.service.formDataCotizacion;
    this.service.formDataDP;

    this.service.formprosp = new Prospecto();

    this.ActualizarDetallePedidoBool = false;

    // form.resetForm();
    
    //Obtener Tipo Cambio
    this.TipoCambio = this.serviceTipoCambio.TipoCambio;
    console.log('TIPO CAMBIO = ' + this.TipoCambio);


    //Obtener ID del local storage
    this.IdCotizacion = +localStorage.getItem('IdCotizacion');

    this.service.getCotizacionId(this.IdCotizacion).subscribe(data => {
      console.log(data);
      this.service.formDataCotizacion = data[0];
      this.Estatus = this.service.formDataCotizacion.Estatus;

      // //VerificarFlete
      // this.llevaFlete();

      // //Verificar Factura
      // this.llevaFactura(); 

      this.Moneda = this.service.formDataCotizacion.Moneda;

      if (this.MonedaBoolean == true) {
        this.descuento = this.service.formDataCotizacion.Descuento;
      } else {
        this.descuentoDlls = this.service.formDataCotizacion.DescuentoDlls;

      }
      if (this.Moneda == 'MXN') {
        this.MonedaBoolean = true;

      } else {
        this.MonedaBoolean = false;
      }
      console.log(this.service.formDataCotizacion);
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
    });
    console.log(this.IdCotizacion);
  }

  changeFlete(checkbox: any) {
    console.log(checkbox);
    if (checkbox == true) {
      this.isFlete = true;
    } else {
      this.isFlete = false;
      this.service.formDataCotizacion.Flete = 'Sucursal';
    }
  }

  //Metodo para verificar si lleva Flete el pedido
  llevaFlete() {
    let flete = this.service.formDataCotizacion.Flete;
    // console.clear();
    // console.log(flete);
    if (flete == 'Sucursal') {
      this.isFlete = false;
    } else {
      this.isFlete = true;
    }
  }
  public listFlete: Array<Object> = [
    { Flete: 'Local' },
    { Flete: 'Foraneo' },
    { Flete: 'Paqueteria' }
  ];



MonedaSelected(event: any) {
  // console.log(event);
  this.Moneda = event.target.selectedOptions[0].text;
  if (this.Moneda == 'MXN') {
    this.MonedaBoolean = true;

  } else {
    this.MonedaBoolean = false;
  }
  // console.log(this.Moneda);
  this.service.formDataCotizacion.Moneda = this.Moneda;
  // console.log(this.service.formDataPedido);
  // this.service.formDataPedido.Estatus = 'Guardada';
  this.service.onEditCotizacion(this.service.formDataCotizacion).subscribe(res => {
    console.log(res);
  })
  // this.service.Moneda = this.Moneda;
  // console.log(this.service.Moneda);
}

public listMoneda: Array<Object> = [
  { Moneda: 'MXN' },
  { Moneda: 'USD' }
];

onBlurDescuento() {
  this.descuento = this.service.formDataCotizacion.Descuento;
  this.service.formDataCotizacion.DescuentoDlls = (+this.descuento / this.TipoCambio);
  this.service.formDataCotizacion.Estatus = 'Creada';
  this.service.onEditCotizacion(this.service.formDataCotizacion).subscribe(res => {
    this.refreshDetallesPedidoList();
    console.clear();
    console.log(res);
    console.log(this.descuento,'descuentoMXN');
    console.log(this.descuentoDlls,'descuentoDLLS');
  })
}

onBlurDescuentoDlls() {
  this.descuentoDlls = this.service.formDataCotizacion.DescuentoDlls;
  this.service.formDataCotizacion.Descuento = (+this.descuentoDlls * this.TipoCambio);
  this.service.formDataCotizacion.Estatus = 'Creada';
  this.service.onEditCotizacion(this.service.formDataCotizacion).subscribe(res => {
    this.refreshDetallesPedidoList();
    console.clear();
    console.log(res);
    console.log(this.descuentoDlls,'DescuentoDLLS');
    console.log(this.descuento,'DescuentoMXN');
  })
}

listData: MatTableDataSource<any>;
displayedColumns: string[] = ['ClaveProducto', 'Producto', 'Cantidad', 'Importe', 'Options'];
@ViewChild(MatSort, null) sort: MatSort;

//Iniciar en 0 Valores de los Totales
IniciarTotales() {
  //Inicializar en 0 el select del producto
  this.ProductoSelect = "";
  this.MarcaSelect ="";
  this.OrigenSelect ="";
  this.PresentacionSelect="";

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
  // this.StockReal = 0;
  this.descuento = 0;
  this.subtotal = 0;
  this.descuentoDlls = 0;
}

refreshDetallesPedidoList() {

  this.IniciarTotales();

  this.service.GetDetalleCotizacionId(this.IdCotizacion).subscribe(data => {
    console.log('------------------------');
    console.log(data);
    //Verificar si hay datos en la tabla
    if (data.length > 0) {

      this.service.formrow = this.service.formDataCotizacion;
      this.service.formrow.DetalleCotizacion = data;
      this.valores = true;
      (<HTMLInputElement>document.getElementById("Moneda")).disabled = true;
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      //Suma Total de importes de detalle pedidos

      this.service.GetSumaImporte(this.IdCotizacion).subscribe(data => {
        console.clear;
        console.log(data);
        // console.clear();
        console.log(this.service.formDataCotizacion);

        console.log(data[0].importe);
        console.log(data[0].ImporteDlls);
        
        
        this.descuento = this.service.formDataCotizacion.Descuento;
        this.subtotal = data[0].importe;
        this.total = data[0].importe - this.descuento;

        this.descuentoDlls = this.service.formDataCotizacion.DescuentoDlls;
        this.subtotalDlls = data[0].ImporteDlls;
        this.totalDlls = data[0].ImporteDlls - this.descuentoDlls;


    /*    console.log(this.descuentoDlls);

        console.log(this.total);
        console.log(this.totalDlls); */
      })

    } else {
      this.valores = false;
      (<HTMLInputElement>document.getElementById("Moneda")).disabled = false;
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      console.log('No hay valores');
    }
  })
}

onAddProducto(form: NgForm) {
console.log(this.PresentacionSelect);
  this.service.formDataDP.IdCotizacion = this.IdCotizacion;
  this.service.formDataDP.ClaveProducto = this.service.formProd.ClaveProducto + this.clavemarca + this.claveorigen;
  this.service.formDataDP.Producto = this.service.formProd.Nombre + ' ' + this.MarcaSelect + ' ' + this.OrigenSelect + ' ' + this.PresentacionSelect ;
  this.service.formDataDP.Unidad = this.service.formProd.UnidadMedida;
  this.service.formDataDP.PrecioUnitario = this.ProductoPrecioMXN.toString();
  this.service.formDataDP.PrecioUnitarioDLLS = this.ProductoPrecioDLLS.toString();
  this.service.formDataDP.Cantidad = this.Cantidad.toString();
  this.service.formDataDP.Importe = this.importeP.toString();
  this.service.formDataDP.ImporteDlls = this.importePDLLS.toString();
  this.service.formDataCotizacion.TipoDeCambio = this.TipoCambio;


  this.Vigencia = new Date();

  this.Vigencia.setDate(this.Vigencia.getDate() + 1);

  console.log(this.Vigencia);

  this.service.formDataCotizacion.Vigencia = this.Vigencia;
  

   console.log('DETALLE a AGREGAR',this.service.formDataDP);

  this.service.addDetalleCotizacion(this.service.formDataDP).subscribe(res => {
    // console.log(res);
    //Restar el Stock
    // this.RestarStock();
    // this.IniciarTotales();
    form.resetForm();
    this.refreshDetallesPedidoList();
    Swal.fire({
      icon: 'success',
      title: 'Concepto Agregado'
    })
  })

  this.crearCotizacion()

}

onChangeCantidadP(cantidad: any) {
  console.log(cantidad);
  let elemHTML: any = document.getElementsByName('Cantidad')[0];
  // this.validarStock(cantidad);
  //elemHTML.value = this.Cantidad;
  //Transformar la Cantidad en entero e igualarlo a la variable Cantidad
  this.calcularImportePedido();
  // console.log(this.Cantidad);
  // console.log(this.ProductoPrecio);
}

//On change Precio
onChangePrecio(precio: any) {
  if (this.MonedaBoolean){

    console.log(precio);
    let elemHTML: any = document.getElementsByName('PrecioCosto')[0];
    // //Transformar la Cantidad en entero e igualarlo a la variable Cantidad
    //elemHTML.value = +this.ProductoPrecio;
    this.calcularImportePedido();
  }
}
onChangePrecioDlls(precioDlls: any) {
  if (!this.MonedaBoolean){

    console.log(precioDlls);
    let elemHTML: any = document.getElementsByName('PrecioCostoDlls')[0];
    // //Transformar la Cantidad en entero e igualarlo a la variable Cantidad
    //elemHTML.value = +this.ProductoPrecioDLLS;
    this.calcularImportePedido();
  }
}
OnEditProducto(dp: DetalleCotizacion) {
  //Iniciar en 0 las variables de totales, stock y
  this.IniciarTotales();
  let clavep;
  clavep = dp.ClaveProducto.substr(0,2);

  this.ActualizarDetallePedidoBool = true;
  this.service.formDataDP = dp;
  this.service.GetProductoDetalleCotizacion(clavep, dp.IdDetalleCotizacion).subscribe(data => {

    console.log(data);

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
      this.ProductoPrecioDLLS = data[0].PrecioUnitarioDlls;
    }

    this.droddownMarcas(data[0].Nombre);
      this.droddownOrigen();
      this.droddownPresentacion();

    // this.ProductoSelect = data[0].IdProducto;
    this.service.formProd.ClaveProducto = data[0].ClaveProducto1;
    this.clavemarca = data[0].ClaveMarca;
    this.claveorigen = data[0].ClaveOrigen;
    console.log(this.service.formProd.ClaveProducto + this.clavemarca + this.claveorigen);
    this.ProductoSelect = data[0].Nombre
    this.MarcaSelect = data[0].NombreMarca;
    this.OrigenSelect = data[0].NombreOrigen;
    this.PresentacionSelect = '25 Kg'
    this.service.formProd.Nombre = data[0].Nombre;
    // this.ProductoPrecio = data[0].PrecioUnitario;
    // this.ProductoPrecioDLLS = data[0].PrecioUnitarioDlls;
    this.Cantidad = data[0].Cantidad;
    this.service.formDataCotizacion.Moneda;
    // this.service.formProd.ClaveProducto = data[0].ClaveProducto;
    // this.service.formDataDP.Unidad = data[0].Unidad;
    // this.service.formProd.Stock = data[0].Stock;
    this.service.formProd.DescripcionProducto = data[0].Producto;
    this.service.formProd.Estatus = data[0].Estatus;
    this.service.formProd.IVA = data[0].IVA;
    this.service.formProd.ClaveSAT = data[0].ClaveSAT;
    // this.service.formDataDP.Observaciones = data[0].Observaciones;
    // this.service.formDataDP.TextoExtra = data[0].TextoExtra;

    //Asignar Clave producto a Editar, para ser validado despues
    this.ClaveP = data[0].ClaveProducto;
    this.CantidadP = this.Cantidad;

    // this.StockReal = (+this.Cantidad) + (+this.service.formProd.Stock);
    // console.log(this.StockReal);
    // this.service.formProd.Stock = this.StockReal.toString();
    // this.PStock = this.service.formProd.Stock;
    this.onChangePrecio(this.ProductoPrecio);
    this.onChangeCantidadP(this.Cantidad);
  })
}

OnEditDetallePedidodp(form: NgForm) {
  console.clear();

  
 console.log(this.service.formProd.Nombre + ' ' + this.MarcaSelect + ' ' + this.OrigenSelect + ' ' + this.PresentacionSelect);
 console.log(this.service.formProd.ClaveProducto + this.clavemarca + this.claveorigen);




  this.service.formDataDP.IdCotizacion = this.IdCotizacion;
  this.service.formDataDP.ClaveProducto = this.service.formProd.ClaveProducto + this.clavemarca + this.claveorigen;
  this.service.formDataDP.Producto = this.service.formProd.Nombre + ' ' + this.MarcaSelect + ' ' + this.OrigenSelect + ' ' + this.PresentacionSelect ;
  this.service.formDataDP.Unidad = this.service.formProd.UnidadMedida;
  //this.onSelectionChange2(this.service.formDataDP.Producto);
  this.service.formDataDP.PrecioUnitario = this.ProductoPrecioMXN.toString();
  this.service.formDataDP.PrecioUnitarioDLLS = this.ProductoPrecioDLLS.toString();
  this.service.formDataDP.Cantidad = this.Cantidad.toString();
  this.service.formDataDP.Importe = this.importeP.toString();
  this.service.formDataDP.ImporteDlls = this.importePDLLS.toString();
  console.log(this.service.formDataDP);

  if (this.ClaveP == this.service.formDataDP.ClaveProducto) {
    console.log('SIGUE SIENDO EL MISMO PRODUCTO');
    this.service.OnEditDetalleCotizacion(this.service.formDataDP).subscribe(res => {
      this.ActualizarDetallePedidoBool = false;
      // this.RestarStock();
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

    console.clear();
    console.log(this.CantidadP.toString());
    console.log(this.ClaveP.toString());
    console.log(this.service.formDataDP.IdDetalleCotizacion);



    // this.SumarStock(this.CantidadP.toString(), this.ClaveP.toString(), this.service.formDataDP.IdDetallePedido);
    // console.log(this.service.formDataDP);

    this.service.OnEditDetalleCotizacion(this.service.formDataDP).subscribe(res => {
      this.ActualizarDetallePedidoBool = false;
      // this.RestarStock();
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



onDeleteDetalleProducto(dp: DetalleCotizacion) {

  console.log(dp);

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

      // this.SumarStock(dp.Cantidad, dp.ClaveProducto, dp.IdDetallePedido);
      this.service.onDeleteDetalleCotizacion(dp.IdDetalleCotizacion).subscribe(res => {
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

cerrarCotizacion(){

  this.service.formDataCotizacion.Estatus = 'Cerrada';
  this.service.formDataCotizacion.Total = this.total;
  this.service.formDataCotizacion.Subtotal = this.subtotal;
  this.service.formDataCotizacion.TotalDlls = this.totalDlls;
  this.service.formDataCotizacion.SubtotalDlls = this.subtotalDlls;
  
  console.clear();  
  console.log(this.service.formDataCotizacion);
  
  this.service.onEditCotizacion(this.service.formDataCotizacion).subscribe(res => {
    console.log(res);
    Swal.fire({
      icon: 'success',
      title: 'Cotizacion Cerrada'
    })
    this.Inicializar();
  })


}

crearCotizacion() {

  this.service.formDataCotizacion.Estatus = 'Guardada';
  this.service.formDataCotizacion.Total = this.total;
  this.service.formDataCotizacion.Subtotal = this.subtotal;
  this.service.formDataCotizacion.TotalDlls = this.totalDlls;
  this.service.formDataCotizacion.SubtotalDlls = this.subtotalDlls;
  
  // console.clear();  
  console.log(this.service.formDataCotizacion);
  
  this.service.onEditCotizacion(this.service.formDataCotizacion).subscribe(res => {
    console.log(res);
    Swal.fire({
      icon: 'success',
      title: 'Cotizacion Generada'
    })

    if (this.show == false){

      // this.service.formDataCotizacion.Estatus = 'Prospecto Pendiente'
      
      this.service.onEditCotizacion(this.service.formDataCotizacion).subscribe(res2 =>{
        console.log("Cotizacion Pendiente");
        
      })
      
      this.service.formprosp.Nombre = this.service.formDataCotizacion.Nombre;
      console.log(this.service.formDataCotizacion);
      this.service.formprosp.Telefono = this.service.formDataCotizacion.Telefono;
      console.log(this.service.formprosp.Telefono);
      this.service.formprosp.Correo = this.service.formDataCotizacion.Correo;
      this.service.formprosp.Estatus = 'Pendiente';
      this.service.formprosp.IdCotizacion = this.service.formDataCotizacion.IdCotizacion;
  
      // console.log(this.service.formprosp);
  
      this.service.addProspecto(this.service.formprosp).subscribe(res => {
        console.log(res);
        console.log('Se agrego Prospecto');

        this.service.formprosp = new Prospecto();

      })
      
    }
  }
  )

}

toggle() {

  this.show = !this.show;


  if(this.show)  
    this.buttonName = "Cliente Existente";  
  else
    this.buttonName = "Cliente Nuevo";

}

// onSubmit(form: NgForm) {

//   this.service.formDataCotizacion.Estatus = 'Guardada';

//   if (this.service.formDataCotizacion.Moneda == 'USD') {
//     this.service.formDataCotizacion.TipoDeCambio = +this.Cdolar;
//   } else {
//     this.service.formDataCotizacion.TipoDeCambio = +'0';
//   }
//   this.service.onEditCotizacion(this.service.formDataCotizacion).subscribe(res => {
//     // this.resetForm(form);
//     this.IniciarTotales();
//     Swal.fire(
//       'Cotizacion Guardada',
//       '',
//       'success'
//     )

//   }
//   );
// }

dxml2(form: any) {

  console.log(form);

  this.service.formrow = form;

const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true; 
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    
  
    this.dialog.open(CotizacionComponent, dialogConfig);
}

email(cotizacion){
  console.log(cotizacion);

 
  // document.getElementById('enviaremail2').click();

  // this.folioparam = folio;
  // this.idparam = id;
  this._MessageService.correo = 'ivan.talamantes@live.com';
  this._MessageService.cco = 'ivan.talamantes@riztek.com.mx';
  this._MessageService.asunto = 'Envio Cotizacion ' + cotizacion.Folio;
  this._MessageService.cuerpo = 'Se ha enviado un comprobante fiscal digital con folio ' + cotizacion.Folio;
  this._MessageService.nombre = 'ProlactoIngredientes';

  this.service.formrow = cotizacion;
  const dialogConfig2 = new MatDialogConfig();
  dialogConfig2.autoFocus = false;
  dialogConfig2.width = "0%";    
  let dialogFact = this.dialog.open(CotizacionComponent, dialogConfig2); 
  

  setTimeout(()=>{

    // this.xmlparam = folio;
      const content: Element = document.getElementById('Cotizacion-PDF');
      const option = {
        margin: [0, 0, 0, 0],
        filename: 'Cotizacion-' + cotizacion.Folio + '.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, logging: true, scrollY: 0 },
        jsPDF: { format: 'letter', orientation: 'portrait' },
      };
      html2pdf().from(content).set(option).output('datauristring').then(function(pdfAsString){
        localStorage.setItem('pdfcorreo'+cotizacion.Folio, pdfAsString);
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
        foliop: cotizacion.Folio,
         cliente: cotizacion.Nombre,
        status: true,
        tipo: 'Cotizacion'
      }
      this.dialog.open(EmailgeneralComponent, dialogConfig);

 

}

nuevacoti(coti){
  console.log(coti);



  this.service.formDataCotizacion.Estatus = 'Duplicada';
  
  this.service.onEditCotizacion(this.service.formDataCotizacion).subscribe(res => {
    console.log(res);
  /*   Swal.fire({
      icon: 'success',
      title: 'Cotizacion Generada'
    }) */

  })




  this.service.GetFolio().subscribe(data => {
    console.log(data[0].Folio);
    let folio = data[0].Folio;
    if (folio == "") {
      folio = 1;
    } else {
      folio = +folio + 1;
    }
    console.log(folio);
    this.CotizacionBlanco = coti;
    this.CotizacionBlanco.FechaDeExpedicion = new Date(),
    this.CotizacionBlanco.Estatus = 'Guardada'
    this.CotizacionBlanco.Folio = folio.toString();
    console.log(this.CotizacionBlanco);
    //Agregar el nuevo pedido. NECESITA ESTAR DENTRO DEL SUBSCRIBEEEEEEEE :(
    this.service.addCotizacion(this.CotizacionBlanco).subscribe(res => {
      console.log(res);
      //Obtener el pedido que se acaba de generar
      
      this.service.getUltimaCotizacion().subscribe(res => {
        console.log('NUEVO IDCOTIZACION------');
        console.log(res[0]);
        console.log('NUEVO IDCOTIZACION------');
        this.IdCotizacion = res[0].IdCotizacion;
        // console.log(this.IdPedido);
        localStorage.setItem('IdCotizacion', this.IdCotizacion.toString());
        this.router.navigate(['/cotizacionesVentasAdd']);


        for (let i=0; i< coti.DetalleCotizacion.length; i++){

          this.service.formDataDP = coti.DetalleCotizacion[i];
          this.service.formDataDP.IdCotizacion = this.IdCotizacion;
          console.clear;
          console.log(this.service.formDataDP.IdCotizacion);
          this.service.addDetalleCotizacion(this.service.formDataDP).subscribe(res => {
            // console.log(res);
            //Restar el Stock
            // this.RestarStock();
            // this.IniciarTotales();
            //form.resetForm();
            //this.refreshDetallesPedidoList();
            Swal.fire({
              icon: 'success',
              title: 'Cotizacion Duplicada'
            })
          })
        }

      })
   

  });
   

  });

}

ObtenerUltimoPedido() {
  this.service.getUltimaCotizacion().subscribe(res => {
    console.log('NUEVO IDCOTIZACION------');
    console.log(res[0]);
    console.log('NUEVO IDCOTIZACION------');
    this.IdCotizacion = res[0].IdCotizacion;
    // console.log(this.IdPedido);
    localStorage.setItem('IdCotizacion', this.IdCotizacion.toString());
    this.router.navigate(['/cotizacionesVentasAdd']);
  })
}

nuevaoc(coti){
  console.log(coti);
  this.cerrarCotizacion();

  this.servicepedido.GetFolio().subscribe(data => {
    // console.log(data[0].Folio);
    let folio = data[0].Folio;
    if (folio == "") {
      folio = 1;
    } else {
      folio = +folio + 1;
    }
    console.log(folio);

   

    this.PedidoBlanco.IdCliente = coti.IdCliente;
    this.PedidoBlanco.Subtotal = coti.Subtotal;
    this.PedidoBlanco.Descuento = coti.Descuento;
    this.PedidoBlanco.Total = coti.Total;
    this.PedidoBlanco.Observaciones = coti.Observaciones;
    this.PedidoBlanco.FechaVencimiento = coti.Vigencia;
    this.PedidoBlanco.Vendedor = coti.Vendedor;
    this.PedidoBlanco.Estatus = 'Guardada';
    this.PedidoBlanco.Moneda = coti.Moneda;
    this.PedidoBlanco.SubtotalDlls = coti.SubtotalDlls;
    this.PedidoBlanco.DescuentoDlls = coti.DescuentoDlls;
    this.PedidoBlanco.TotalDlls = coti.TotalDlls;
    this.PedidoBlanco.Flete = coti.Flete;
    this.PedidoBlanco.IdDireccion = coti.IdDireccion;
    this.PedidoBlanco.FechaDeExpedicion = new Date();







    this.PedidoBlanco.Folio = folio.toString();
    console.log(this.PedidoBlanco);
    //Agregar el nuevo pedido. NECESITA ESTAR DENTRO DEL SUBSCRIBEEEEEEEE :(
    this.servicepedido.addPedido(this.PedidoBlanco).subscribe(res => {
      console.log(res);
      //Obtener el pedido que se acaba de generar
        this.servicepedido.getUltimoPedido().subscribe(res => {
       // console.log('NUEVO IDPEDIDO------');
       console.log(res[0]);
       this.IdPedido = res[0].IdPedido;
       // console.log('NUEVO IDPEDIDO------');
       for (let i=0; i< coti.DetalleCotizacion.length; i++){
        this.servicepedido.formDataDP.IdPedido = this.IdPedido
        this.servicepedido.formDataDP.ClaveProducto = coti.DetalleCotizacion[i].ClaveProducto;
        this.servicepedido.formDataDP.Producto = coti.DetalleCotizacion[i].Producto;
        this.servicepedido.formDataDP.Unidad = coti.DetalleCotizacion[i].Unidad;
        this.servicepedido.formDataDP.PrecioUnitario = coti.DetalleCotizacion[i].PrecioUnitario;
        this.servicepedido.formDataDP.PrecioUnitarioDlls = coti.DetalleCotizacion[i].PrecioUnitarioDlls;
        this.servicepedido.formDataDP.Cantidad = coti.DetalleCotizacion[i].Cantidad;
        this.servicepedido.formDataDP.Importe = coti.DetalleCotizacion[i].Importe;
        this.servicepedido.formDataDP.ImporteDlls = coti.DetalleCotizacion[i].ImporteDlls;
    
        // console.log(this.service.formDataDP);
    
        this.servicepedido.addDetallePedido(this.servicepedido.formDataDP).subscribe(res => {
          // console.log(res);
          //Restar el Stock
          //this.RestarStock();
          // this.IniciarTotales();
          //form.resetForm();
          //this.refreshDetallesPedidoList();
        /*   Swal.fire({
            icon: 'success',
            title: 'Concepto Agregado'
          }) */
          
        })
       }
       
        console.log(this.IdPedido);
        localStorage.setItem('IdPedido', this.IdPedido.toString());
        this.router.navigate(['/pedidoventasAdd']);


        
      })
    });
  });
}


inventarios(detalle){

  const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.width = "90%";
     
      this.dialog.open(InventariosalmacenComponent, dialogConfig);

}



ConnectionHub(){
  


  this.connection = $.hubConnection(this.notihub);

  this.proxy = this.connection.createHubProxy(this.proxyName); 

  this.proxy.on('alertasHub', (data) => {  
    console.log('received in SignalRService: ' + JSON.stringify(data));  
    
}); 



  this.connection.start().done((data: any) => {  
    console.log('Now connected ' + data.transport.name + ', connection ID= ' + data.id);  
    /* this.connectionEstablished.emit(true);  */ 
    /* this.connectionExists = true;   */
})
}





}
