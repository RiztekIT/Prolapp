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
import { MatTableDataSource, MatSort } from '@angular/material';
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
    public serviceDireccion: ClienteDireccionService, private dialog: MatDialog, public servicecoti: VentasCotizacionService, public addproductos: AddsproductosService, public _MessageService: MessageService, public serviceordencarga: OrdenCargaService, public ordenTemporalService: OrdenTemporalService, public location: Location) {
    
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

    this.seleccionManual=false;
    this.getValidacion();
    




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
  /* console.log(this.seleccionManual); */

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
    } else {
      this.isFlete = false;
      this.service.formDataPedido.Flete = 'Sucursal';
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
    //this.service.formDataDP.Producto = this.service.formProd.Nombre;
    this.service.formDataDP.Producto = this.service.formProd.Nombre + ' ' + this.MarcaSelect + ' ' + this.OrigenSelect + ' ' + this.PresentacionSelect ;
    this.service.formDataDP.Unidad = this.service.formProd.UnidadMedida;
    this.service.formDataDP.PrecioUnitario = this.ProductoPrecioMXN.toString();
    this.service.formDataDP.PrecioUnitarioDlls = this.ProductoPrecioDLLS.toString();
    this.service.formDataDP.Cantidad = this.Cantidad.toString();
    this.service.formDataDP.Importe = this.importeP.toString();
    this.service.formDataDP.ImporteDlls = this.importePDLLS.toString();

    console.log(this.service.formDataDP);

    this.service.addDetallePedido(this.service.formDataDP).subscribe(res => {
      console.log('DETALLE',res);
      //Restar el Stock
     // this.RestarStock();
      // this.IniciarTotales();
      //form.resetForm();
      this.refreshDetallesPedidoList();
      Swal.fire({
        icon: 'success',
        title: 'Concepto Agregado'
      })
    })


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
    //this.validarStock(cantidad);
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
    if (+cantidad >= +this.PStock) {
      this.Cantidad = this.PStock.toString();
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
      Swal.fire({
        icon: 'success',
        title: 'Pedido Generado'
      })
      this.service.filter('Register click');
    }
    )
  }

  cerrarPedido(){

    let ordencarga;
    let detordencarga;
    let sacos;
    let kg;
    let user;
    user = JSON.parse( localStorage.getItem('ProlappSession')).user;
    


    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "90%";

    dialogConfig.data = {
      bodega: 'Chihuahua',
      productos: this.listData.data,
      tipo: this.seleccionManual
      }
   
    let mercanciadl = this.dialog.open(MercanciaComponent, dialogConfig);
    let d=1;

    mercanciadl.afterClosed().subscribe(data=>{

      console.log(data, 'AFTERCLOSED');
      


      if (typeof data != 'undefined'){

        this.service.formDataPedido.Estatus = 'Cerrada';
        

    this.service.formDataPedido.Total = this.total;
    this.service.formDataPedido.Subtotal = this.subtotal;
    this.service.formDataPedido.TotalDlls = this.totalDlls;
    this.service.formDataPedido.SubtotalDlls = this.subtotalDlls;


        let productos = data.selected;
        let fletera;
    
    this.serviceordencarga.getUltimoFolio().subscribe(data=>{

      console.log(data[0].Folio);
      if (this.service.formDataPedido.Flete=='Foraneo'){

        fletera='0';
      }else{
        fletera=this.service.formDataPedido.Flete;
      }


      sacos = 0;

      for (let i=0; i< this.listData.data.length;i++){
        sacos = sacos + +this.listData.data[i].Cantidad;
      }

      kg = sacos * 25;

      ordencarga= {
  
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
        Estatus: 'Sin Validar',
        FechaInicioCarga: new Date('10/10/10'),
        FechaFinalCarga: new Date('10/10/10'),
        FechaExpedicion: new Date(),
        IdUsuario: '0',
        Usuario: user
      }

      console.log(ordencarga);

     



      this.serviceordencarga.addOrdenCarga(ordencarga).subscribe(data=>{

        console.log(data);

        for (let i=0; i< productos.length;i++){
       
          detordencarga = {
    
            IdDetalleOrdenCarga:0,
            IdOrdenCarga:0,
            ClaveProducto:productos[i].ClaveProducto,
        Producto:productos[i].Producto,
        Sacos:this.listData.data[i].Cantidad,
        PesoxSaco:productos[i].PesoxSaco,
        Lote:productos[i].Lote,
        IdProveedor:productos[i].IdProveedor,
        Proveedor:productos[i].Proveedor,
        PO:productos[i].PO,
        FechaMFG:productos[i].FechaMFG,
        FechaCaducidad:productos[i].FechaCaducidad,
        Shipper:productos[i].Shipper,
        USDA:productos[i].USDA,
        Pedimento:productos[i].Pedimento,
        Saldo:this.listData.data[i].Cantidad,
          }

          console.log(detordencarga);

          this.serviceordencarga.addDetalleOrdenCarga(detordencarga).subscribe(data=>{
            
            console.log(data);
          })
          
      
        }

        

        console.log(this.service.formDataPedido);
        this.service.updateVentasPedido(this.service.formDataPedido).subscribe(res => {
          this.crearValidacion();

          Swal.fire({
            icon: 'success',
            title: 'Pedido Cerrado'
          })
    
    //
    //this.ordenTemporalService._listeners.next('Orden')
          this.Inicializar();
    
        }
        )


      })
    })

  }


    //
  



  })/* CERRAR el subscribe del afterclosed */







  
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

    this.url = 'https://192.168.1.199:4200/#/documento/'+validacion.token

    this.service.addValidacion(validacion).subscribe(resp=>{
      console.log(resp);
      this.enviarPedidoAuto()
    })

 
  }

  getValidacion(){
    this.url = 'https://192.168.1.199:4200/#/documento/2b2bbdf6-94e5-4c23-ad8f-b93e5dcec13d';
    console.log(this.url)
    /* this.service.getValidacion() */
  }


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
