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
import { EnviarfacturaService } from '../../../../../services/facturacioncxc/enviarfactura.service';

@Component({
  selector: 'app-pedidoventas-add',
  templateUrl: './pedidoventas-add.component.html',
  styleUrls: ['./pedidoventas-add.component.css']
})
export class PedidoventasAddComponent implements OnInit {
  dialogbox: any;

  constructor(public router: Router, private currencyPipe: CurrencyPipe, public service: VentasPedidoService, private _formBuilder: FormBuilder, public enviarfact: EnviarfacturaService ) { }

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  //valores de unidad
  filteredOptionsUnidad: Observable<any[]>;
  myControlUnidad = new FormControl();
  optionsUnidad = ['Pieza'];
  um: boolean;


  ngOnInit() {

    this.Inicializar();
    this.dropdownRefresh();
    this.dropdownRefresh2();
    this.refreshDetallesPedidoList();
    

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
    if (typeof(value)=='string'){
    const filterValueUnidad = value.toLowerCase();
    return this.listUM.filter(optionUnidad => optionUnidad.key.toString().toLowerCase().includes(filterValueUnidad) || optionUnidad.name.toString().toLowerCase().includes(filterValueUnidad));
    }else if (typeof(value)=='number'){
      const filterValueUnidad = value;
      return this.listUM.filter(optionUnidad => optionUnidad.key.toString().includes(filterValueUnidad) || optionUnidad.name.toString().includes(filterValueUnidad));
    }
  }




  unidadMedida(){
    if (this.um){
    this.listUM = [];
    this.enviarfact.unidadMedida().subscribe(data=>{
      //console.log(JSON.parse(data).data);
      for (let i=0; i<JSON.parse(data).data.length; i++){
        this.listUM.push(JSON.parse(data).data[i])
      }
      this.filteredOptionsUnidad = this.myControlUnidad.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterUnidad(value))
      );
      // console.log(this.listUM);

      this.um=false;
      
    })

  }
  }


  Regresar() {
    localStorage.removeItem('IdPedido');
    this.router.navigateByUrl('/pedidosVentas');
  }


  myControl = new FormControl();
  myControl2 = new FormControl();
  options: Cliente[] = [];
  options2: Producto[] = [];
  filteredOptions: Observable<any[]>;
  filteredOptions2: Observable<any[]>;
  listClientes: Cliente[] = [];
  listProducts: Producto[] = [];
  Moneda: string;
  importeF;
  precioUnitarioF;
  //IdPedido
  IdPedido: number;
  //cantidad Producto
  Cantidad: number;

  //Valores de Totales
  subtotal: any;
  iva: any;
  total: any;
  ivaDlls: any;
  subtotalDlls: any;
  totalDlls: any;

  private _filter(value: any): any[] {
    console.log(value);
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
    // console.log(value);
    const filterValue2 = value.toString();
    return this.options2.filter(option =>
      option.IdProducto.toString().includes(filterValue2));
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

  //Selection change de cliente

  onSelectionChange(options: Cliente, event: any) {
    if (event.isUserInput) {

      this.service.formData = options;
    }
  }


  //Blur del Cliente
  onBlurCliente(){
    // console.log(this.service.formDataPedido);
    this.service.formDataPedido.IdCliente = this.service.formData.IdClientes;
    console.log(this.service.formDataPedido);
    this.service.updateVentasPedido(this.service.formDataPedido).subscribe(res =>{
      console.log(res);
    });
  }

  onSelectionChange2(options2: Producto, event: any) {
    if (event.isUserInput) {
      this.service.formProd = options2;
    }
  }




  Inicializar(form?: NgForm) {

  //Inicializar los valores del Cliente
  this.service.formData;
  this.service.formDataPedido;

  //Obtener ID del local storage
  this.IdPedido = +localStorage.getItem('IdPedido');

  this.service.getPedidoId(this.IdPedido).subscribe( data =>{
    console.log(data);
    this.service.formDataPedido = data[0];
    console.log(this.service.formDataPedido);
    this.service.GetCliente(data[0].IdCliente).subscribe(data => {
      // console.log(data);
      this.service.formData = data[0];
    });
  });


    console.log(this.IdPedido);




  }

  MonedaSelected(event: any) {
    // console.log(event);
    this.Moneda = event.target.selectedOptions[0].text;
    // console.log(this.Moneda);
    this.service.Moneda = this.Moneda;
    // console.log(this.service.Moneda);
  }

  public listMoneda: Array<Object> = [
    { Moneda: 'MXN' },
    { Moneda: 'USD' }
  ];

  formato() {
    const preciounitario = <HTMLInputElement>document.getElementById('precioUnitario');
    const importe = <HTMLInputElement>document.getElementById('importe');
    const iva = <HTMLInputElement>document.getElementById('iva');
    // console.log(this.service.formDataDP.Importe);


    if (this.service.formDataDP.PrecioUnitario != 'NaN') {
      this.precioUnitarioF = this.currencyPipe.transform(this.service.formDataDP.PrecioUnitario);
      preciounitario.value = this.precioUnitarioF;
    } else {
      preciounitario.value = '$0.00';
    }
    if (this.service.formDataDP.Importe != 'NaN') {
      this.importeF = this.currencyPipe.transform(this.service.formDataDP.Importe);
      importe.value = this.importeF;
    } else {
      importe.value = '$0.00';
    }

  }



  //Tabla de Productos
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['ClaveProducto', 'ClaveSAT', 'Producto', 'Cantidad', 'Precio', 'Options'];
  @ViewChild(MatSort, null) sort: MatSort;



  //Iniciar en 0 Valores de los Totales
  IniciarTotales() {
    this.subtotal = 0;
    this.iva = 0;
    this.total = 0;
    this.subtotalDlls = 0;
    this.totalDlls = 0;
    this.ivaDlls = 0;
  }

  refreshDetallesPedidoList(){
this.IniciarTotales();

this.service.GetDetallePedidoId(this.IdPedido).subscribe(data =>{
  this.listData = new MatTableDataSource(data);
  this.listData.sort = this.sort; 
})
  }

  onAddProducto(){
    console.log(this.service.formProd);
    console.log(this.IdPedido);
    this.service.formDataDP.IdPedido = this.IdPedido;
    this.service.formDataDP.ClaveProducto = this.service.formProd.ClaveProducto;
    this.service.formDataDP.Producto = this.service.formProd.Nombre;
    this.service.formDataDP.Unidad = this.service.formProd.UnidadMedida;
    this.service.formDataDP.PrecioUnitario = this.service.formProd.PrecioVenta;
    this.service.formDataDP.Cantidad = this.Cantidad.toString();
    this.service.formDataDP.Importe = this.total;
    this.service.formDataDP.Observaciones = "NA";
    this.service.formDataDP.TextoExtra = "NA";
    console.log(this.service.formDataDP);
  }

  OnEditProducto(){
  console.log(this.service.formProd);
  }

crearPedido(){
  this.service.updateVentasPedido(this.service.formDataPedido).subscribe(res =>{

    Swal.fire({
      icon: 'success',
      title: 'Pedido Agregado'
    })
    this.dialogbox.close();
    this.service.filter('Register click');
  }
  )}

}
