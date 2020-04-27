import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm, FormControl } from "@angular/forms";
import { Observable } from 'rxjs';
import { Cliente } from 'src/app/Models/catalogos/clientes-model';
import { map, startWith } from 'rxjs/operators';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CurrencyPipe } from '@angular/common';
import { MatTableDataSource, MatSort } from '@angular/material';

import Swal from 'sweetalert2';

import { DataRowOutlet } from '@angular/cdk/table';

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Vendedor } from 'src/app/Models/catalogos/vendedores.model';
import { UnidadMedidaService } from 'src/app/services/unidadmedida/unidad-medida.service';


import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';

// import { ClienteDireccionComponent } from '../../../../../components/cliente-direccion/cliente-direccion.component';
import { ClienteDireccionService } from '../../services/cliente-direccion/cliente-direccion.service';
import { ClienteDireccion } from '../../Models/cliente-direccion/clienteDireccion-model';
import { ProductosService } from '../../services/catalogos/productos.service';
import { EnviarfacturaService } from '../../services/facturacioncxc/enviarfactura.service';
import { TipoCambioService } from '../../services/tipo-cambio.service';
import { DetallePedido } from '../../Models/Pedidos/detallePedido-model';
import { Producto } from '../../Models/catalogos/productos-model';
import { VentasPedidoService } from '../../services/ventas/ventas-pedido.service';
//Constantes para obtener tipo de cambio
const httpOptions = {
  headers: new HttpHeaders({
    'Bmx-Token': 'd83c7088f2823be9f29cc124cf95dc37056de37c340da5477a09ca1ee91a80a6',
    'Access-Control-Allow-Origin': 'http://localhost:4200',
    'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Headers': 'Bmx-Token, Accept, Accept-Encoding, Content-Type, Origin',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'

  })
}

@Component({
  selector: 'app-cotizacionpedido',
  templateUrl: './cotizacionpedido.component.html',
  styleUrls: ['./cotizacionpedido.component.css']
})

// PedidoVentasAddComponent
export class CotizacionpedidoComponent implements OnInit {
  dialogbox: any;

  constructor(public router: Router, private currencyPipe: CurrencyPipe, public service: VentasPedidoService, private _formBuilder: FormBuilder,
    private serviceTipoCambio: TipoCambioService, public enviarfact: EnviarfacturaService, private serviceProducto: ProductosService, private http: HttpClient, public ServiceUnidad: UnidadMedidaService,
    public serviceDireccion: ClienteDireccionService, private dialog: MatDialog) {
      
    this.MonedaBoolean = true;


    this.serviceDireccion.listen().subscribe((m:any)=>{
      this.dropdownRefreshDirecciones(this.service.formData.IdClientes);
      });

  }

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  //valores de unidad
  filteredOptionsUnidad: Observable<any[]>;
  myControlUnidad = new FormControl();
  optionsUnidad = ['Pieza'];
  um: boolean;
  ProductoSelect: string;
  Id: number;

  ngOnInit() {
    // this.Inicializar();
    this.dropdownRefresh();
    this.dropdownRefreshVendedor();
   
    // this.refreshDetallesPedidoList();
  
    this.tipoDeCambio();
    this.service.formProd = new Producto();

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
    // localStorage.removeItem('IdPedido');
    // this.router.navigateByUrl('/pedidosVentas');
  }

  
  myControl = new FormControl();
  myControl2 = new FormControl();
  myControlVendedor = new FormControl();
  myControlDireccion = new FormControl();

  options: Cliente[] = [];
  options2: Producto[] = [];

  filteredOptions: Observable<any[]>;
  filteredOptions2: Observable<any[]>;
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





}
