import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm, FormControl } from "@angular/forms";
import { Observable, Subscriber } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CurrencyPipe } from '@angular/common';
import { MatTableDataSource, MatSort } from '@angular/material';
import { CompraService } from '../../../services/compras/compra.service';
import { Compras } from 'src/app/Models/Compras/compra-model';
import { ProveedoresService } from '../../../services/catalogos/proveedores.service';
import { Proveedor } from '../../../Models/catalogos/proveedores-model';
import { map, startWith } from 'rxjs/operators';
import { Producto } from 'src/app/Models/catalogos/productos-model';
import { UnidadMedidaService } from '../../../services/unidadmedida/unidad-medida.service';
import { ProductosService } from '../../../services/catalogos/productos.service';
import { DetalleCompra } from '../../../Models/Compras/detalleCompra-model';
import { OrdenDescarga } from '../../../Models/almacen/OrdenDescarga/ordenDescarga-model';
import { DetalleOrdenDescarga } from '../../../Models/almacen/OrdenDescarga/detalleOrdenDescarga-model';
import { OrdenDescargaService } from '../../../services/almacen/orden-descarga/orden-descarga.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AddsproductosService } from '../../../services/addsproductos.service';
import { CalendarioService } from '../../../services/calendario/calendario.service';

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
  selector: 'app-formato-compras-compras',
  templateUrl: './formato-compras-compras.component.html',
  styleUrls: ['./formato-compras-compras.component.css']

})
export class FormatoComprasComprasComponent implements OnInit {

  constructor(public router: Router, private _formBuilder: FormBuilder, private currencyPipe: CurrencyPipe, public CompraService: CompraService,
     public proveedorService: ProveedoresService, public ServiceUnidad: UnidadMedidaService, public ServiceProducto: ProductosService, 
     public ordenDescargaService: OrdenDescargaService, private http: HttpClient, public addproductos: AddsproductosService, public CalendarioService: CalendarioService) { 
       this.MonedaBoolean = true;
     }

  ngOnInit() {
    this.obtenerIdCompra();
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    // this.thirdFormGroup = this._formBuilder.group({
    //   thirdCtrl: ['', Validators.required]
    // });
    this.obtenerInformacionCompra();
    this.refreshDetallesCompra();
    this.dropdownRefreshProveedor();
    this.dropdownRefresh2();
    this.unidadMedida();
    this.tipoDeCambio();
    this.iniciarCantidades();
    

 this.addproducto = true;
    this.descuento = +this.compra.Descuento;
    // this.um = true;

    // this.filteredOptionsUnidad = this.myControlUnidad.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => this._filterUnidad(value))
    //   );
  }

  //Variables del Step
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  // thirdFormGroup: FormGroup;

  //Dropdowns
  myControlProveedor = new FormControl();
  filteredOptionsProveedor: Observable<any[]>;
  //Lista de Proveedores
  listProveedores: Proveedor[] = []; 
  //NombreProveedor
  NombreProveedor: String;

  //valores de unidad
  filteredOptionsUnidad: Observable<any[]>;
  myControlUnidad = new FormControl();
  optionsUnidad = ['Pieza'];
  um: boolean;
  public listUM: Array<any> = [];

  //valores Producto
  ProductoSelect: string;
  myControl2 = new FormControl();
  options2: Producto[] = [];
  filteredOptions2: Observable<any[]>;
  listProducts: Producto[] = [];
  Cantidad:number
  ProductoPrecio: number;

  formProd = new Producto();

  //Valores Marca
  MarcaSelect: string;
  clavemarca:string;
  myControl3 = new FormControl();
  options3: any[] = []
  filteredOptions3: Observable<any[]>;

  //Valores Origen
  OrigenSelect:string;
  claveorigen:string;
  myControl4 = new FormControl();
  filteredOptions4: Observable<any[]>;
  options4: any[] = []
  //Valores presentacion
  PresentacionSelect: string;
  clavepresentacion:string;
  myControl5 = new FormControl();
  filteredOptions5: Observable<any[]>;
  options5: any[] = []


  
  

  detalleCompra: DetalleCompra;

  //Variable para saber si la moneda es MXN (TRUE) / USD (FALSE)
  MonedaBoolean: boolean
  //Variable Moneda
  Moneda: string;

  //Variables que manejaran el costo (USD Y MXN dependiendo de la moneda seleccionada)
  importeProducto: number;
  descuento: number;
  subtotal: number;
  total: number

  //Variable para saber si se agrega o edita un producto (true add/ false edit)
  addproducto: boolean
//variable para saber el total de sacos en la compra
totalSacos: number;
//variable para saber el peso total de la compra
pesoTotal: number;

  

    //Tabla de Productos
    listData: MatTableDataSource<any>;
    displayedColumns: string[] = ['ClaveProducto', 'Producto', 'Cantidad', 'CostoTotal', 'Options'];
    @ViewChild(MatSort, null) sort: MatSort;

  //Variables Generales
  //Objeto tipo Compra
  compra: Compras;
  IdCompra: number;
   //Variable para verificar si hay valores en detalle pedido. En caso que
  //sea negativo se podra cambiar la moneda. Si es positivo la moneda no se prodra cambiar
  //hasta haber eliminado todos los detalles pedido
  valores: boolean;

  //variable para verificar si el producto lleva IVA.
  LlevaIVA: boolean;

  //Variables del precio tipo de cambio
  oldTipoCambio: number;
  newTipoCambio: number;

  //Variable par averificar si cambio el tipo de cambio
  tipoCambioChanged: boolean;



  //Metodo para obtener el IdCompra
  obtenerIdCompra() {
    this.IdCompra = +localStorage.getItem('IdCompra');
  }

  //Metodo para Inicializar/Obtener Valores de Esta compra
  obtenerInformacionCompra() {
    this.compra = new Compras();
    this.CompraService.getComprasId(this.IdCompra).subscribe(dataCompra => {
      this.compra = dataCompra[0];
      this.oldTipoCambio = +this.compra.TipoCambio;
      
    if(this.compra.Moneda == 'MXN'){
      this.MonedaBoolean = true;
          }else{
            this.MonedaBoolean = false;
          }
      console.log(this.compra);
    })
  }


  Regresar() {
    // localStorage.removeItem('IdCompra')
    this.router.navigate(['/compras-principal']);
  }

  //DropDown de Proveedores
  dropdownRefreshProveedor() {
    this.proveedorService.getProveedoresList().subscribe(data => {
      console.log(data)
      for (let i = 0; i < data.length; i++) {
        let Proveedor = data[i];
        this.listProveedores.push(Proveedor);
        // this.options.push(Proveedor)
        this.filteredOptionsProveedor = this.myControlProveedor.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filterProveedor(value))
          );
      }
    });

  }
  //Filtro Dropdown Proveedores
  private _filterProveedor(value: any): any[] {
    const filterValue = value.toString().toLowerCase();
    return this.listProveedores.filter(option =>
      option.Nombre.toLowerCase().includes(filterValue) ||
      option.IdProveedor.toString().includes(filterValue));
  }

  onSelectionChangeProveedor(options: Proveedor, event: any) {
    if (event.isUserInput) {
      this.NombreProveedor = options.Nombre;
      this.compra.Proveedor = options.Nombre;
    }
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
    this.detalleCompra = new DetalleCompra();
    this.options2 = [];
    this.ServiceProducto.getProductosList().subscribe(dataP => {
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

  private _filtermarca(value: any): any[] {
    if (typeof (value) == 'string') {
      const filterValue2 = value.toLowerCase();
      return this.options3.filter(option => option.NombreMarca.toString().toLowerCase().includes(filterValue2));
    } 
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
  private _filterorigen(value: any): any[] {
    // console.clear();
    // console.log(value);
    if (typeof (value) == 'string') {
      const filterValue2 = value.toLowerCase();
      return this.options4.filter(option => option.NombreOrigen.toString().toLowerCase().includes(filterValue2));
    } 
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

  private _filterpresentacion(value: any): any[] {
    // console.clear();
    // console.log(value);
    if (typeof (value) == 'string') {
      const filterValue2 = value.toLowerCase();
      return this.options5.filter(option => option.Presentacion.toString().toLowerCase().includes(filterValue2));
    } 
  }

  onSelectionChangeMarca(options2, event: any){
    console.log(options2);
    this.clavemarca = options2.ClaveMarca
    this.MarcaSelect = options2.NombreMarca
    // this.service.formProd.DescripcionProducto = this.ProductoSelect + ' ' + this.MarcaSelect + ' ' + this.OrigenSelect + ' ' + this.PresentacionSelect
  }
  onSelectionChangeOrigen(options2, event: any){
    console.log(options2);
    this.claveorigen = options2.ClaveOrigen;
    this.OrigenSelect = options2.NombreOrigen;
    // this.service.formProd.DescripcionProducto = this.ProductoSelect + ' ' + this.MarcaSelect + ' ' + this.OrigenSelect + ' ' + this.PresentacionSelect

  }
  onSelectionChangePresentacion(options2, event: any){
    console.log(options2);
    this.PresentacionSelect = options2.Presentacion;
    // this.service.formProd.DescripcionProducto = this.ProductoSelect + ' ' + this.MarcaSelect + ' ' + this.OrigenSelect + ' ' + this.PresentacionSelect
  
  }

  onSelectionChange2(options2: Producto, event: any) {
    if (event.isUserInput) {
      // this.service.formProd = options2;
      this.detalleCompra.ClaveProducto = options2.ClaveProducto;
      this.detalleCompra.Producto = options2.Nombre;
      this.ProductoPrecio = +options2.PrecioVenta;
      if(options2.IVA == '0'){
      this.LlevaIVA = false;
      let iva = 0;
      this.detalleCompra.IVA = iva.toString();
      }else{
      this.LlevaIVA = true;
      let iva = (+options2.PrecioVenta * 1.16)
      this.detalleCompra.IVA = iva.toString();
      }
      this.droddownMarcas(this.detalleCompra.Producto);
      this.droddownOrigen();
      this.droddownPresentacion();

      this.OrigenSelect = 'USA'
      this.claveorigen = '1'
      this.PresentacionSelect = '25'
      // this.PStock = this.service.formProd.Stock;
      // this.ProductoPrecio = +this.service.formProd.PrecioVenta;
      //asignar el valor inicial en caso de que la moneda este declarada en USD
      // if (this.MonedaBoolean == false) {
      //   this.ProductoPrecioDLLS = (+this.service.formProd.PrecioVenta / this.TipoCambio);
      // }

      // this.ClaveProducto = this.service.formProd.ClaveProducto;
      // console.log(+this.PStock + " STOCKKKK");
    }
  }


  
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
    // if (this.um) {
      this.listUM = [];
      this.ServiceUnidad.GetUnidadesMedida().subscribe(data => {
        this.listUM = data;
        this.filteredOptionsUnidad = this.myControlUnidad.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filterUnidad(value))
          );
        this.um = false;
      })

    // }
  }
  //Lista de Monedas
  public listMoneda: Array<Object> = [
    { Moneda: 'MXN' },
    { Moneda: 'USD' }
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
    this.compra.Moneda = this.Moneda;
    this.compra.Estatus = 'Guardada';
    console.log(this.compra);
    this.CompraService.updateCompra(this.compra).subscribe(res => {
      console.log(res);
    })
    // this.service.Moneda = this.Moneda;
    // console.log(this.service.Moneda);
  }

  detalleCompras: DetalleCompra[];
  refreshDetallesCompra() {
    // this.IniciarTotales();

    this.CompraService.getDetalleComprasID(this.IdCompra).subscribe(data => {
      console.log('------------------------');
      console.log(data);
      //Verificar si hay datos en la tabla
      this.totalSacos = 0;
      this.pesoTotal = 0;
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          //Obtener el total de sacos
          this.totalSacos = this.totalSacos + +data[i].Cantidad;
          this.pesoTotal = ((+data[i].PesoxSaco)*(+data[i].Cantidad)) + this.pesoTotal; 
        }
        
        this.valores = true;
        (<HTMLInputElement>document.getElementById("Moneda")).disabled = true;
        this.detalleCompras = data;
        this.listData = new MatTableDataSource(data);
        this.listData.sort = this.sort;
        this.sumatoriaTotales();
        //Suma Total de importes de detalle pedidos

        // this.service.GetSumaImporte(this.IdPedido).subscribe(data => {
        //   console.log(data);
        //   // console.clear();
        //   console.log(this.service.formDataPedido);
        //   this.descuento = this.service.formDataPedido.Descuento;
        //   this.subtotal = data[0].importe;
        //   this.total = data[0].importe - this.descuento;

        //   this.descuentoDlls = this.service.formDataPedido.DescuentoDlls;
        //   this.subtotalDlls = data[0].importeDlls;
        //   this.totalDlls = data[0].importeDlls - this.descuentoDlls;



        //   console.log(this.total);
        //   console.log(this.totalDlls);
        // })

      } else {
        this.valores = false;
        (<HTMLInputElement>document.getElementById("Moneda")).disabled = false;
        this.listData = new MatTableDataSource(data);
        this.listData.sort = this.sort;
        this.total = 0;
        this.subtotal =0;
        this.compra.TotalDlls = "0";
        this.compra.Total = "0";
        this.compra.SubtotalDlls = "0";
        this.compra.Subtotal = "0";
        console.log('No hay valores');
      }
      console.log('PESO TOTALLLL');
      console.log(this.pesoTotal);
      console.log(this.totalSacos);
      this.compra.PesoTotal = this.pesoTotal.toString();
      this.compra.SacosTotales = this.totalSacos.toString();
      console.log('PESO TOTALLLL');
    })
  }

  clearCamposDetalleCompra(form: NgForm){
    form.resetForm();
    this.iniciarCantidades();
  }

  iniciarCantidades(){
    this.importeProducto = 0;
    this.Cantidad = 0;
    this.ProductoPrecio = 0;
    this.ProductoSelect="";
    this.OrigenSelect = ''
      this.claveorigen = ''
      this.PresentacionSelect = ''
    this.detalleCompra = new DetalleCompra();
  }
  sumatoriaTotales(){
    //Query para realizar una sumatoria de los Detalles Compra
    this.CompraService.getSumatoriaIdCompra(this.IdCompra).subscribe(dataSumatoria=>{
      console.warn(dataSumatoria[0]);
      if(dataSumatoria.length > 0){
          if(this.MonedaBoolean == true){
            this.subtotal = dataSumatoria[0].CostoTotal
            this.total = (this.subtotal - +this.compra.Descuento)

            this.compra.Total = this.total.toString();
            this.compra.TotalDlls = (this.total / +this.compra.TipoCambio).toString();

            this.compra.Subtotal = this.subtotal.toString();
            this.compra.SubtotalDlls = (this.subtotal / +this.compra.TipoCambio).toString();
          }else{
            this.subtotal = dataSumatoria[0].CostoTotalDlls
            this.total = (this.subtotal - +this.compra.Descuento)

            this.compra.TotalDlls = this.total.toString();
            this.compra.Total = (this.total * +this.compra.TipoCambio).toString();

            this.compra.SubtotalDlls = this.subtotal.toString();
            this.compra.Subtotal = (this.subtotal * +this.compra.TipoCambio).toString();
          }
      }else{
        this.total = 0;
        this.subtotal =0;
        this.compra.TotalDlls = "0";
        this.compra.Total = "0";
        this.compra.SubtotalDlls = "0";
        this.compra.Subtotal = "0";
      }
    })
  }
  //On change Cantidad 
  onChangeCantidadP(cantidad: any) {
    // console.log(cantidad);
    let elemHTML: any = document.getElementsByName('Cantidad')[0];
    this.validarCantidad(cantidad);
    elemHTML.value = this.Cantidad;
    //Transformar la Cantidad en entero e igualarlo a la variable Cantidad
    // this.calcularImportePedido();
    console.log(this.Cantidad);
    this.calcularImporte();
    // console.log(this.ProductoPrecio);
  }

  //Validar que la cantidad no sea nula o menor a 0
  validarCantidad(cantidad: any) {
    // console.log(cantidad + ' CANTIDAD');
  this.Cantidad = +cantidad;
    if (this.Cantidad <= 0) {
      this.Cantidad = 0;
    }
    if (cantidad == null) {
      this.Cantidad = 0;
    }
  }

  calcularImporte(){
    this.importeProducto = +(this.ProductoPrecio * this.Cantidad).toFixed(6);
  }

  onChangePrecio(precio: any){
    let elemHTML: any = document.getElementsByName('PrecioUnitario')[0];
    this.validarPrecio(precio);
    elemHTML.value = this.ProductoPrecio;
    console.log(this.ProductoPrecio);
    this.calcularImporte();
    if(this.LlevaIVA == true){
      let iva = (this.ProductoPrecio * 1.16)
      this.detalleCompra.IVA = iva.toString();
    }
  }
  //Validar que la cantidad no sea nula o menor a 0
  validarPrecio(precio: any) {
    // console.log(cantidad + ' CANTIDAD');
  this.ProductoPrecio = +precio;
    if (this.ProductoPrecio <= 0) {
      this.ProductoPrecio = 0;
    }
    if (precio == null) {
      this.ProductoPrecio = 0;
    }
  }
  onChangeDescuento(descuento: any){
    let elemHTML: any = document.getElementsByName('Descuento')[0];
    this.validarDescuento(descuento);
    elemHTML.value = this.descuento;
    console.log(this.descuento);
    if(this.compra.Moneda == 'MXN'){
this.compra.Descuento =this.descuento.toString();
this.compra.DescuentoDlls = ((this.descuento) / (+this.compra.TipoCambio)).toString();
    }else{
      this.compra.DescuentoDlls =this.descuento.toString();
      this.compra.Descuento = ((this.descuento) * (+this.compra.TipoCambio)).toString();
    }
    this.sumatoriaTotales();
  }
  //Validar que la cantidad no sea nula o menor a 0
  validarDescuento(descuento: any) {
    // console.log(cantidad + ' CANTIDAD');
  this.descuento = +descuento;
    if (this.descuento <= 0) {
      this.descuento = 0;
    }
    if (descuento == null) {
      this.descuento = 0;
    }
  }

  onAddDetalleCompra(){
    this.detalleCompra.IdCompra = this.IdCompra;
    this.detalleCompra.Cantidad = this.Cantidad.toString();
    this.detalleCompra.ClaveProducto = this.detalleCompra.ClaveProducto + this.clavemarca + this.claveorigen;
    this.detalleCompra.Producto = this.detalleCompra.Producto + ' ' + this.MarcaSelect + ' ' + this.OrigenSelect + ' ' + this.PresentacionSelect;
    this.detalleCompra.PesoxSaco = this.PresentacionSelect;

    if(!this.detalleCompra.Observaciones){
      this.detalleCompra.Observaciones = "";
    }

    if(this.compra.Moneda == 'MXN'){

this.detalleCompra.CostoTotal = this.importeProducto.toString();
this.detalleCompra.CostoTotalDlls = ((this.importeProducto)/(+this.compra.TipoCambio)).toFixed(6).toString();

this.detalleCompra.IVADlls = (+this.detalleCompra.IVA / +this.compra.TipoCambio).toFixed(6).toString();

this.detalleCompra.PrecioUnitario = (this.ProductoPrecio).toString();
this.detalleCompra.PrecioUnitarioDlls = (this.ProductoPrecio / +this.compra.TipoCambio).toFixed(6).toString();

    }else{
      this.detalleCompra.CostoTotalDlls = this.importeProducto.toString();
      this.detalleCompra.CostoTotal = ((this.importeProducto)*(+this.compra.TipoCambio)).toFixed(6).toString();
      
      this.detalleCompra.IVADlls = (+this.detalleCompra.IVA).toString();
      this.detalleCompra.IVA = (+this.detalleCompra.IVA * +this.compra.TipoCambio).toFixed(6).toString();
      
      this.detalleCompra.PrecioUnitarioDlls = (this.ProductoPrecio).toString();
      this.detalleCompra.PrecioUnitario = (this.ProductoPrecio * +this.compra.TipoCambio).toFixed(6).toString();
    }



    console.log(this.detalleCompra);

    this.CompraService.addDetalleCompra(this.detalleCompra).subscribe(res=>{
console.log(res);
this.refreshDetallesCompra();
this.iniciarCantidades();
Swal.fire({
  icon: 'success',
  title: 'Producto Agregado'
})
    });
  }

  onAddDetalleCompraAdministrativa(){
console.log('Agregando DETALLE ADMINISTRATIVO');
this.detalleCompra.IdCompra = this.IdCompra;
    this.detalleCompra.Cantidad = this.Cantidad.toString();
    this.detalleCompra.ClaveProducto = "";
    this.detalleCompra.Observaciones = "";
    this.detalleCompra.IVA = "";
    this.detalleCompra.IVADlls = "";
    this.detalleCompra.Unidad = "";
    this.detalleCompra.PesoxSaco = "";

    if(this.compra.Moneda == 'MXN'){

this.detalleCompra.CostoTotal = this.importeProducto.toString();
this.detalleCompra.CostoTotalDlls = ((this.importeProducto)/(+this.compra.TipoCambio)).toFixed(6).toString();

// this.detalleCompra.IVADlls = (+this.detalleCompra.IVA / +this.compra.TipoCambio).toFixed(6).toString();

this.detalleCompra.PrecioUnitario = (this.ProductoPrecio).toString();
this.detalleCompra.PrecioUnitarioDlls = (this.ProductoPrecio / +this.compra.TipoCambio).toFixed(6).toString();

    }else{
      this.detalleCompra.CostoTotalDlls = this.importeProducto.toString();
      this.detalleCompra.CostoTotal = ((this.importeProducto)*(+this.compra.TipoCambio)).toFixed(6).toString();
      
      // this.detalleCompra.IVADlls = (+this.detalleCompra.IVA).toString();
      // this.detalleCompra.IVA = (+this.detalleCompra.IVA * +this.compra.TipoCambio).toFixed(6).toString();
      
      this.detalleCompra.PrecioUnitarioDlls = (this.ProductoPrecio).toString();
      this.detalleCompra.PrecioUnitario = (this.ProductoPrecio * +this.compra.TipoCambio).toFixed(6).toString();
    }



    console.log(this.detalleCompra);

    this.CompraService.addDetalleCompra(this.detalleCompra).subscribe(res=>{
console.log(res);
this.refreshDetallesCompra();
this.iniciarCantidades();
Swal.fire({
  icon: 'success',
  title: 'Producto Agregado'
})
    });
}
onEditDetalleCompraAdministrativa(){
  console.log('EDITANDO DETALLE ADMINISTRATIVO');
  this.detalleCompra.IdCompra = this.IdCompra;
    this.detalleCompra.Cantidad = this.Cantidad.toString();
    this.detalleCompra.ClaveProducto = "";
    this.detalleCompra.Observaciones = "";
    this.detalleCompra.IVA = "";
    this.detalleCompra.IVADlls = "";
    this.detalleCompra.Unidad = "";
    this.detalleCompra.PesoxSaco = "";

    if(this.compra.Moneda == 'MXN'){

this.detalleCompra.CostoTotal = this.importeProducto.toString();
this.detalleCompra.CostoTotalDlls = ((this.importeProducto)/(+this.compra.TipoCambio)).toFixed(6).toString();

// this.detalleCompra.IVADlls = (+this.detalleCompra.IVA / +this.compra.TipoCambio).toFixed(6).toString();

this.detalleCompra.PrecioUnitario = (this.ProductoPrecio).toString();
this.detalleCompra.PrecioUnitarioDlls = (this.ProductoPrecio / +this.compra.TipoCambio).toFixed(6).toString();

    }else{
      this.detalleCompra.CostoTotalDlls = this.importeProducto.toString();
      this.detalleCompra.CostoTotal = ((this.importeProducto)*(+this.compra.TipoCambio)).toFixed(6).toString();
      
      // this.detalleCompra.IVADlls = (+this.detalleCompra.IVA).toString();
      // this.detalleCompra.IVA = (+this.detalleCompra.IVA * +this.compra.TipoCambio).toFixed(6).toString();
      
      this.detalleCompra.PrecioUnitarioDlls = (this.ProductoPrecio).toString();
      this.detalleCompra.PrecioUnitario = (this.ProductoPrecio * +this.compra.TipoCambio).toFixed(6).toString();
    }
    console.log(this.detalleCompra);

this.CompraService.updateDetalleCompra(this.detalleCompra).subscribe(res=>{
  console.log(res);
  Swal.fire({
    title: 'Actualizado',
    icon: 'success',
    timer: 1000,
    showCancelButton: false,
    showConfirmButton: false
  });
  this.refreshDetallesCompra();
  this.iniciarCantidades();
  this.addproducto = true;
})
  }
GenerarCompraAdministrativa(){
  console.log('GENERANDO COMPRA ADMINISTRATIVA DETALLE ADMINISTRATIVO');
  console.log(this.compra);
  
}

  onEditProducto(detalleCompra: DetalleCompra){
    //Iniciar en 0 las variables de totales, stock y
    this.iniciarCantidades();
    this.addproducto = false;
    console.log(detalleCompra);
    this.detalleCompra = detalleCompra;
    this.ProductoSelect = detalleCompra.ClaveProducto;
    this.PresentacionSelect = detalleCompra.PesoxSaco;

    this.Cantidad = +this.detalleCompra.Cantidad;
    this.onChangeCantidadP(this.Cantidad);

    if(this.compra.Estatus != 'Administrativa'){
      this.droddownMarcas(this.detalleCompra.Producto);
      this.droddownOrigen();
      this.droddownPresentacion();
      //VALORES HARDCODEADOS//
      //VALORES HARDCODEADOS//
      this.OrigenSelect = 'USA'
      this.claveorigen = '1'
      // this.PresentacionSelect = '25'
      //VALORES HARDCODEADOS//
      //VALORES HARDCODEADOS//
      //VALORES HARDCODEADOS//
    }


    if(this.MonedaBoolean == true){
      this.ProductoPrecio = +this.detalleCompra.PrecioUnitario
      this.onChangePrecio(this.ProductoPrecio);
      
    }else{
      this.ProductoPrecio = +this.detalleCompra.PrecioUnitarioDlls
      this.onChangePrecio(this.ProductoPrecio);
    }

  // this.ActualizarDetallePedidoBool = true;
  // this.service.formDataDP = dp;
  // this.service.GetProductoDetalleProducto(dp.ClaveProducto, dp.IdDetallePedido).subscribe(data => {

  //   // if (this.service.formDataPedido.Moneda == 'MXN') {
  //   //   this.importeP = data[0].Importe;
  //   //   console.clear();
  //   //   console.log(this.importeP);
  //   //   console.log('mxn');
  //   // }
  //   // else {
  //   //   this.importeP = data[0].ImporteDlls;
  //   //   console.clear();
  //   //   console.log(this.importeP);
  //   //   console.log('dlls');
  //   // }
  //   if (this.MonedaBoolean == true) {
  //     this.importeP = data[0].Importe;
  //     this.ProductoPrecio = data[0].PrecioUnitario;
  //   } else {
  //     this.importePDLLS = data[0].ImporteDlls;
  //     this.ProductoPrecio = data[0].PrecioUnitarioDlls;
  //   }

  //   this.ProductoSelect = data[0].IdProducto;
  //   this.service.formProd.Nombre = data[0].Nombre;
  //   // this.ProductoPrecio = data[0].PrecioUnitario;
  //   // this.ProductoPrecioDLLS = data[0].PrecioUnitarioDlls;
  //   this.Cantidad = data[0].Cantidad;
  //   this.service.formDataPedido.Moneda;
  //   this.service.formProd.ClaveProducto = data[0].ClaveProducto;
  //   // this.service.formDataDP.Unidad = data[0].Unidad;
  //   this.service.formProd.Stock = data[0].Stock;
  //   this.service.formProd.DescripcionProducto = data[0].DescripcionProducto;
  //   this.service.formProd.Estatus = data[0].Estatus;
  //   this.service.formProd.IVA = data[0].IVA;
  //   this.service.formProd.ClaveSAT = data[0].ClaveSAT;
  //   // this.service.formDataDP.Observaciones = data[0].Observaciones;
  //   // this.service.formDataDP.TextoExtra = data[0].TextoExtra;

  //   //Asignar Clave producto a Editar, para ser validado despues
  //   this.ClaveP = data[0].ClaveProducto;
  //   this.CantidadP = this.Cantidad;

  //   this.StockReal = (+this.Cantidad) + (+this.service.formProd.Stock);
  //   console.log(this.StockReal);
  //   this.service.formProd.Stock = this.StockReal.toString();
  //   this.PStock = this.service.formProd.Stock;
  //   this.onChangePrecio(this.ProductoPrecio);
  //   this.onChangeCantidadP(this.Cantidad);
  // })
  }

  onEditDetalleCompra(){

    this.detalleCompra.IdCompra = this.IdCompra;
    this.detalleCompra.Cantidad = this.Cantidad.toString();
    this.detalleCompra.PesoxSaco = this.PresentacionSelect;

    if(!this.detalleCompra.Observaciones){
      this.detalleCompra.Observaciones = "";
    }

    if(this.compra.Moneda == 'MXN'){

this.detalleCompra.CostoTotal = this.importeProducto.toString();
this.detalleCompra.CostoTotalDlls = ((this.importeProducto)/(+this.compra.TipoCambio)).toFixed(6).toString();

this.detalleCompra.IVADlls = (+this.detalleCompra.IVA / +this.compra.TipoCambio).toFixed(6).toString();

this.detalleCompra.PrecioUnitario = (this.ProductoPrecio).toString();
this.detalleCompra.PrecioUnitarioDlls = (this.ProductoPrecio / +this.compra.TipoCambio).toFixed(6).toString();

    }else{
      this.detalleCompra.CostoTotalDlls = this.importeProducto.toString();
      this.detalleCompra.CostoTotal = ((this.importeProducto)*(+this.compra.TipoCambio)).toFixed(6).toString();
      
      this.detalleCompra.IVADlls = (+this.detalleCompra.IVA).toString();
      this.detalleCompra.IVA = (+this.detalleCompra.IVA * +this.compra.TipoCambio).toFixed(6).toString();
      
      this.detalleCompra.PrecioUnitarioDlls = (this.ProductoPrecio).toString();
      this.detalleCompra.PrecioUnitario = (this.ProductoPrecio * +this.compra.TipoCambio).toFixed(6).toString();
    }
    console.log(this.detalleCompra);

this.CompraService.updateDetalleCompra(this.detalleCompra).subscribe(res=>{
  console.log(res);
  Swal.fire({
    title: 'Actualizado',
    icon: 'success',
    timer: 1000,
    showCancelButton: false,
    showConfirmButton: false
  });
  this.refreshDetallesCompra();
  this.iniciarCantidades();
  this.addproducto = true;
})
  }

  Cancelar(form: NgForm){
    // form.resetForm();
    this.iniciarCantidades();
    this.addproducto = true;
    //Hay un problema que borra los datos de la tabla
    //buscar otra manera de no volver a actualizar la tabla
    this.refreshDetallesCompra();
  }
  
onDeleteDetalleProducto(detalleCompra: DetalleCompra){
  Swal.fire({
    title: '¿Segur@ de Borrar producto?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Borrar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.value) {

      this.CompraService.deleteDetalleCompra(detalleCompra.IdDetalleCompra).subscribe(res => {
        console.log('//////////////////////////////////////////////////////');
        console.log(res);
        console.log('//////////////////////////////////////////////////////');
        this.refreshDetallesCompra();
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


    this.newTipoCambio = data.bmx.series[0].datos[l - i].dato;
    console.log('------CAMBIO------');
    console.log(this.newTipoCambio);
    this.cambioTipoCambio();
    console.log('------CAMBIO------');
  })

}

traerApi(): Observable<any> {

  return this.http.get("/SieAPIRest/service/v1/series/SF63528/datos/", httpOptions)

}


//metodo para checar si cambio el tipo de cambio
cambioTipoCambio(){
  console.log(this.oldTipoCambio);
  console.log(this.newTipoCambio);
  if(+this.oldTipoCambio != +this.newTipoCambio){
console.log('Cambio el tipo de Cambio');
this.tipoCambioChanged = true;
}else{
  console.log('El tipo de cambio es el mismo');
  this.tipoCambioChanged = false;
  }
}


//Calcular los importes y precios en dado caso que el tipo de cambio haya cambiado
calculosTipoCambio(estado: string, accion: string){

  console.log(this.newTipoCambio);
  console.log(this.MonedaBoolean);
  console.log(estado);
  console.log(accion);

  // let subtotal = 0;
  // let total = 0;
  // let descuento = this.descuento;
  //MONEDA MXN
  if(this.MonedaBoolean == true){
    //recorrer arreglo e ir actualizando el detalle de compra
    for (let i = 0; i < this.detalleCompras.length; i++) {
      console.log(this.detalleCompras[i]);
     let dc = this.detalleCompras[i];
     dc.CostoTotalDlls = (+dc.CostoTotal / +this.newTipoCambio).toFixed(6).toString();
     dc.PrecioUnitarioDlls = (+dc.PrecioUnitario / +this.newTipoCambio).toFixed(6).toString();
     dc.IVADlls = (+dc.IVA / +this.newTipoCambio).toFixed(6).toString();
    //  subtotal = (subtotal + +dc.CostoTotalDlls);
    //  descuento = (descuento / +this.newTipoCambio);
    console.log(dc);
     this.CompraService.updateDetalleCompra(dc).subscribe(res=>{
       console.log(res);
     })
    }
    //actualizar totales en la compra
    // total = (subtotal) + (iva) - (descuento);
    // console.log(subtotal);
    // console.log(iva);
    // console.log(descuento);
    // console.log(total);
    this.compra.TotalDlls = (+this.compra.Total * +this.newTipoCambio).toString();
    this.compra.SubtotalDlls = (+this.compra.Subtotal * +this.newTipoCambio).toString();
    this.compra.DescuentoDlls = (+this.compra.Descuento * +this.newTipoCambio).toString();
    console.log(this.compra);

  }else{
    //MONEDA USD
    //recorrer arreglo e ir actualizando el detalle de compra
    for (let i = 0; i < this.detalleCompras.length; i++) {
      console.log(this.detalleCompras[i]);
      let dc = this.detalleCompras[i];
     dc.CostoTotal = (+dc.CostoTotalDlls * +this.newTipoCambio).toFixed(6).toString();
     dc.PrecioUnitario = (+dc.PrecioUnitarioDlls * +this.newTipoCambio).toFixed(6).toString();
     dc.IVA = (+dc.IVADlls * +this.newTipoCambio).toFixed(6).toString();
     console.log(dc);
     this.CompraService.updateDetalleCompra(dc).subscribe(res=>{
       console.log(res);
     })
    }
    //actulizar totales compra
    this.compra.Total = (+this.compra.TotalDlls / +this.newTipoCambio).toString();
    this.compra.Subtotal = (+this.compra.SubtotalDlls / +this.newTipoCambio).toString();
    this.compra.Descuento = (+this.compra.DescuentoDlls / +this.newTipoCambio).toString();
    // console.log(this.compra);
  }

  //Actualizar compra
  console.log(this.compra);
  this.compra.TipoCambio = this.newTipoCambio.toString();
  this.updateCompra(estado, accion);
}


//para generar la compra debe de haber ya valores en detalleCompras
GenerarCompra(){
  if(this.tipoCambioChanged == true){
    if(this.compra.Estatus == 'Administrativa'){
      this.calculosTipoCambio('Administrativa', 'Generada');
    }else{
      this.calculosTipoCambio('Transito', 'Generada');
    }
    // this.updateCompra('Transito','Generada');
  }else{
    if(this.compra.Estatus == 'Administrativa'){
      this.updateCompra('Administrativa','Generada');
    }else{
      
      this.updateCompra('Transito','Generada');
    }
  }
  
}

updateCompra(estatus: string, texto: string){
  //actualizar estatus de compra
  this.compra.Estatus = estatus;
  console.log(this.compra);
  
  this.CompraService.updateCompra(this.compra).subscribe(res=>{
    // console.log(res);
    if(estatus == 'Transito'){
      console.log('GENERAR ORDEN DESCARGA');
      this.generarOrdenDescarga();
    }
    Swal.fire({
      title: 'Compra '+texto,
      icon: 'success',
      timer: 1000,
      showCancelButton: false,
     showConfirmButton: false
    });
    // this.router.navigate(['/compras-principal']);
  })
}

guardarCompra(){
  if(this.valores == true){
    if(this.tipoCambioChanged == true){
      //Advertir que el tipo de cambio no es el mismo
      Swal.fire({
        title: 'El tipo de cambio ha cambiado',
        text:'Se actualizaran los importes al nuevo tipo de cambio. ¿Deseas continuar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.value) {
          if(this.compra.Estatus == 'Administrativa'){

            this.calculosTipoCambio('Administrativa', 'Guardada');
          }else{

            this.calculosTipoCambio('Guardada', 'Guardada');
          }
          // this.updateCompra('Guardada','Guardada');
            Swal.fire({
              title: 'Importes Actualizados',
              icon: 'success',
              timer: 1000,
              showCancelButton: false,
              showConfirmButton: false
            });
        }
      })
    }else{
      
      if(this.compra.Estatus == 'Administrativa'){
        this.updateCompra('Administrativa','Guardada');

      }else{

        this.updateCompra('Guardada','Guardada');
      }
    }
  }else{
    console.log('No hay valores');
    
    if(this.compra.Estatus == 'Administrativa'){
      this.updateCompra('Administrativa','Guardada');
console.log('COMPRA ADMINISTRATIVA');
}else{
  
  console.log('COMPRA NORMAL');
      this.updateCompra('Guardada','Guardada');
    }
  }
}

od: OrdenDescarga;
dod: DetalleOrdenDescarga;

generarOrdenDescarga(){

console.log(this.compra);
console.log(this.detalleCompras);
console.log(this.totalSacos);
 this.od = new OrdenDescarga();
 this.dod = new DetalleOrdenDescarga();

this.ordenDescargaService.getFolioOrdenDescarga().subscribe(resFolio=>{
// console.log(resFolio);
  //Generar automaticamente el Folio de Orden Descarga
  this.od.Folio = +resFolio;
  // console.log(this.od.Folio);
  this.od.FechaLlegada = new Date('10/10/10');
  //buscar la manera de ingresar las fechas en blanco
  this.od.IdProveedor = this.compra.IdProveedor;
  this.od.Proveedor = this.compra.Proveedor;
  this.od.PO = this.compra.PO.toString();
  this.od.Fletera = '';
  this.od.Caja = '';
  this.od.Sacos = this.totalSacos.toString();
  this.od.Kg = this.compra.PesoTotal;
  this.od.Chofer = '';
  this.od.Origen = 'EUA';
  this.od.Destino = 'PasoTx';
  this.od.Observaciones = '';
  //Con que estatus se generara?
  this.od.Estatus = 'Creada';
  //Fechas y usuario
  this.od.FechaInicioDescarga = new Date('10/10/10');
  this.od.FechaFinalDescarga = new Date('10/10/10');
  this.od.FechaExpedicion = new Date('10/10/10');
  this.od.IdUsuario = 1;
  let usuario: any
  usuario = localStorage.getItem('ProlappSession');
  usuario = JSON.parse(usuario);
  this.od.Usuario = usuario.user;
  
  console.log(this.od);
  this.ordenDescargaService.addOrdenDescarga(this.od).subscribe(res=>{
    //  console.log(res);
    //traer el id generado
    this.ordenDescargaService.getUltimoIdOrdenDescarga().subscribe(ultimoId=>{
      console.log(ultimoId);
      
      //Agregar detalle orden Descarga
      for (let i = 0; i < this.detalleCompras.length; i++) {
        // console.log(this.detalleCompras[i]);
        this.dod.IdOrdenDescarga = ultimoId;
        this.dod.ClaveProducto = this.detalleCompras[i].ClaveProducto;
        this.dod.Producto = this.detalleCompras[i].Producto;
        this.dod.Sacos = this.detalleCompras[i].Cantidad;
        //Verificar el peso x saco
        this.dod.PesoxSaco = this.detalleCompras[i].PesoxSaco;
        //segun yo no se conoce el lote.
        this.dod.Lote = '';
        this.dod.IdProveedor = this.od.IdProveedor;
        this.dod.Proveedor = this.od.Proveedor;
        //duda sobre las fechas
        this.dod.FechaMFG = new Date('10/10/10');
        this.dod.FechaCaducidad = new Date('10/10/10');
        //duda sobre el shipper
        this.dod.Shipper = '';
        //duda USDA
        this.dod.USDA = '';
        //duda pedimento
        this.dod.Pedimento = '';
        this.dod.Saldo = this.detalleCompras[i].Cantidad;
        
        console.log(this.dod);
        
        this.ordenDescargaService.addDetalleOrdenDescarga(this.dod).subscribe(resDetalle=>{
          console.log(resDetalle);
        })
      }

      //GENERAR EVENTO
      this.generarEventoCalendario(this.compra.Folio);
      //GENERAR NOTIFICACION
      //GENERAR NOTIFICACION
      //GENERAR NOTIFICACION
      //GENERAR NOTIFICACION
      //GENERAR NOTIFICACION
      //GENERAR NOTIFICACION
      
    })
  })
});
  
}



generarEventoCalendario(folio){
  console.log(this.compra);
  //idcalendario, folio, documento, descripcion, inicio, fin, titulo, color, allday, rezi ,rezi, dragga
  console.log(this.CalendarioService.DetalleCalendarioData);
  //Obtener el id del calendario que le corresponde al usuario y al modulo
  let usuario: any
  usuario = localStorage.getItem('ProlappSession');
  usuario = JSON.parse(usuario);
  console.log(usuario.user);
  this.CalendarioService.getCalendarioComprasUsuarioModulo(usuario.user, 'Compras').subscribe(res=>{
    console.log(res);
    this.CalendarioService.DetalleCalendarioData.IdCalendario = res[0].IdCalendario;
    //el folio corresponde con la Orden/Documento que se genera junto con el evento.
    this.CalendarioService.DetalleCalendarioData.Folio = folio;
    this.CalendarioService.DetalleCalendarioData.Documento = 'OrdenCompra';
    this.CalendarioService.DetalleCalendarioData.Descripcion = 'Evento Orden de Compra con Folio: '+folio;
    //Las fechas van a variar dependiendo en el modulo en el que se encuentre
    this.CalendarioService.DetalleCalendarioData.Start = this.compra.FechaElaboracion;
    this.CalendarioService.DetalleCalendarioData.Endd = this.compra.FechaPromesa;
    this.CalendarioService.DetalleCalendarioData.Title = 'Orden de Compra';
    this.CalendarioService.DetalleCalendarioData.Color = '#0fd8e6';
    console.log(this.CalendarioService.DetalleCalendarioData);
    this.CalendarioService.addDetalleCalendario(this.CalendarioService.DetalleCalendarioData).subscribe(resAdd=>{
      console.log(resAdd);
    })
  })
}



}
