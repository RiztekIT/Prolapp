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
  selector: 'app-pedidoventas-add',
  templateUrl: './pedidoventas-add.component.html',
  styleUrls: ['./pedidoventas-add.component.css']
})
export class PedidoventasAddComponent implements OnInit {
  dialogbox: any;

  constructor(public router: Router, private currencyPipe: CurrencyPipe, public service: VentasPedidoService, private _formBuilder: FormBuilder,
    private serviceTipoCambio: TipoCambioService, public enviarfact: EnviarfacturaService, private serviceProducto: ProductosService, private http: HttpClient) {
    this.MonedaBoolean = true;
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

    this.Inicializar();
    this.dropdownRefresh();
    this.dropdownRefreshVendedor();
    this.dropdownRefresh2();
    this.refreshDetallesPedidoList();
    this.IniciarTotales();
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
      return this.listUM.filter(optionUnidad => optionUnidad.key.toString().toLowerCase().includes(filterValueUnidad) || optionUnidad.name.toString().toLowerCase().includes(filterValueUnidad));
    } else if (typeof (value) == 'number') {
      const filterValueUnidad = value;
      return this.listUM.filter(optionUnidad => optionUnidad.key.toString().includes(filterValueUnidad) || optionUnidad.name.toString().includes(filterValueUnidad));
    }
  }




  unidadMedida() {
    if (this.um) {
      this.listUM = [];
      this.enviarfact.unidadMedida().subscribe(data => {
        console.log(JSON.parse(data).data);
        for (let i = 0; i < JSON.parse(data).data.length; i++) {
          this.listUM.push(JSON.parse(data).data[i])
        }
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
    this.router.navigateByUrl('/pedidosVentas');
  }


  myControl = new FormControl();
  myControl2 = new FormControl();
  myControlVendedor = new FormControl();
  options: Cliente[] = [];
  options2: Producto[] = [];
  filteredOptions: Observable<any[]>;
  filteredOptions2: Observable<any[]>;
  filteredOptionsVendedor: Observable<any[]>;
  listClientes: Cliente[] = [];
  listProducts: Producto[] = [];
  //Lista de Vendedores
  listVendedores: Vendedor[] = [];
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
      return this.options2.filter(option => option.IdProducto.toString().toLowerCase().includes(filterValue2) || option.Nombre.toString().toLowerCase().includes(filterValue2));
    } else if (typeof (value) == 'number') {
      const filterValue2 = value.toString();
      return this.options2.filter(option => option.IdProducto.toString().includes(filterValue2) || option.Nombre.toString().includes(filterValue2));
    }


  }

  dropdownRefresh2() {
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

  //Selection change de cliente

  onSelectionChange(options: Cliente, event: any) {
    if (event.isUserInput) {

      this.service.formData = options;
    }
  }


  //Blur del Cliente
  onBlurCliente() {
    // console.log(this.service.formDataPedido);
    this.service.formDataPedido.IdCliente = this.service.formData.IdClientes;
    this.service.formDataPedido.Estatus = 'Guardada';
    console.log(this.service.formDataPedido);
    this.service.updateVentasPedido(this.service.formDataPedido).subscribe(res => {
      console.log(res);
    });
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
      console.log(+this.PStock + " STOCKKKK");
    }
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
      this.Moneda = this.service.formDataPedido.Moneda;
      
      if (this.MonedaBoolean==true) {
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
      } else {
        console.log('ID Diferente a 0');
        this.service.GetCliente(data[0].IdCliente).subscribe(data => {
          console.log(data);
          this.service.formData = data[0];
        });
      }
    });
    console.log(this.IdPedido);
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
    this.service.updateVentasPedido(this.service.formDataPedido).subscribe(res => {
      console.log(res);
    })
    // this.service.Moneda = this.Moneda;
    // console.log(this.service.Moneda);
  }

  onBlurDescuento() {
    this.service.updateVentasPedido(this.service.formDataPedido).subscribe(res => {
      this.descuento = this.service.formDataPedido.Descuento;
      this.refreshDetallesPedidoList();
      console.clear();
      console.log(res);
      console.log(this.descuento);
    })
  }

  onBlurDescuentoDlls() {
    this.service.updateVentasPedido(this.service.formDataPedido).subscribe(res => {
      this.descuentoDlls = this.service.formDataPedido.DescuentoDlls;
      this.descuento = this.descuentoDlls * this.TipoCambio;
      this.refreshDetallesPedidoList();
      console.clear();
      console.log(res);
      console.log(this.descuentoDlls);
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

  //Tabla de Productos
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['ClaveProducto', 'ClaveSAT', 'Producto', 'Cantidad', 'Importe', 'Options'];
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

  onAddProducto(form: NgForm) {
    this.service.formDataDP.IdPedido = this.IdPedido;
    this.service.formDataDP.ClaveProducto = this.service.formProd.ClaveProducto;
    this.service.formDataDP.Producto = this.service.formProd.Nombre;
    this.service.formDataDP.Unidad = this.service.formProd.UnidadMedida;
    this.service.formDataDP.PrecioUnitario = this.ProductoPrecioMXN.toString();
    this.service.formDataDP.PrecioUnitarioDlls = this.ProductoPrecioDLLS.toString();
    this.service.formDataDP.Cantidad = this.Cantidad.toString();
    this.service.formDataDP.Importe = this.importeP.toString();
    console.log(this.service.formDataDP.Importe);

    // console.log(this.service.formDataDP);

    this.service.addDetallePedido(this.service.formDataDP).subscribe(res => {
      // console.log(res);
      //Restar el Stock
      this.RestarStock();
      // this.IniciarTotales();
      form.resetForm();
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
    this.validarStock(cantidad);
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
      
        this.importeP = data[0].Importe;
        this.ProductoPrecio = data[0].PrecioUnitario;
      
        this.importePDLLS = data[0].ImporteDlls;
        this.ProductoPrecio = data[0].PrecioUnitarioDlls;
      

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
    console.clear();


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

      console.clear();
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
        this.service.formDataPedido.TotalDlls =this.totalDlls;
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

  }
