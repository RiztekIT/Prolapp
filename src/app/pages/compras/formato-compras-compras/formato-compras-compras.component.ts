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

@Component({
  selector: 'app-formato-compras-compras',
  templateUrl: './formato-compras-compras.component.html',
  styleUrls: ['./formato-compras-compras.component.css']

})
export class FormatoComprasComprasComponent implements OnInit {

  constructor(public router: Router, private _formBuilder: FormBuilder, private currencyPipe: CurrencyPipe, public CompraService: CompraService,
     public proveedorService: ProveedoresService, public ServiceUnidad: UnidadMedidaService, public ServiceProducto: ProductosService) { 
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
    this.iniciarCantidades();

    if(this.compra.Moneda == 'MXN'){
this.MonedaBoolean = true;
    }else{
      this.MonedaBoolean = false;
    }
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

  //Metodo para obtener el IdCompra
  obtenerIdCompra() {
    this.IdCompra = +localStorage.getItem('IdCompra');
  }

  //Metodo para Inicializar/Obtener Valores de Esta compra
  obtenerInformacionCompra() {
    this.compra = new Compras;
    this.CompraService.getComprasId(this.IdCompra).subscribe(dataCompra => {
      this.compra = dataCompra[0];
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

  refreshDetallesCompra() {
    // this.IniciarTotales();

    this.CompraService.getDetalleComprasID(this.IdCompra).subscribe(data => {
      console.log('------------------------');
      console.log(data);
      //Verificar si hay datos en la tabla
      if (data.length > 0) {
        this.valores = true;
        (<HTMLInputElement>document.getElementById("Moneda")).disabled = true;
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
        console.log('No hay valores');
      }
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
    this.detalleCompra = new DetalleCompra();
  }
  sumatoriaTotales(){
    //Query para realizar una sumatoria de los Detalles Compra
    this.CompraService.getSumatoriaIdCompra(this.IdCompra).subscribe(dataSumatoria=>{
      console.warn(dataSumatoria);
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

  onEditProducto(detalleCompra: DetalleCompra){
    //Iniciar en 0 las variables de totales, stock y
    this.iniciarCantidades();
    this.addproducto = false;
    console.log(detalleCompra);
    this.detalleCompra = detalleCompra;
    this.ProductoSelect = detalleCompra.ClaveProducto;

    this.Cantidad = +this.detalleCompra.Cantidad;
    this.onChangeCantidadP(this.Cantidad);
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

GenerarCompra(){
  console.log(this.compra);
  //obtener suma de los detalles de la compra MXN y DLLS
  //actualizar estatus de compra
  this.compra.Estatus = 'Transito';
  this.CompraService.updateCompra(this.compra).subscribe(res=>{
    console.log(res);
    this.generarOrdenDescarga();
    Swal.fire({
      title: 'Compra Generada',
      icon: 'success',
      timer: 1000,
      showCancelButton: false,
      showConfirmButton: false
    });
    this.router.navigate(['/compras-principal']);
  })

}

generarOrdenDescarga(){
console.log(this.compra);


}



}
