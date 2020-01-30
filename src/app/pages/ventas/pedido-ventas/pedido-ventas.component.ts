import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm, FormControl } from "@angular/forms";
import { Observable } from 'rxjs';
import { Cliente } from 'src/app/Models/catalogos/clientes-model';
import { map, startWith } from 'rxjs/operators';
import { VentasPedidoService } from '../../../services/ventas/ventas-pedido.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Producto } from '../../../Models/catalogos/productos-model';

@Component({
  selector: 'app-pedido-ventas',
  templateUrl: './pedido-ventas.component.html',
  styleUrls: ['./pedido-ventas.component.css']
})
export class PedidoVentasComponent implements OnInit {

  constructor(public router: Router, public service: VentasPedidoService, private _formBuilder: FormBuilder) { }
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  ngOnInit() {

    this.resetForm();
    this.dropdownRefresh();
    this.dropdownRefresh2()

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });

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


  recargar() {
    // this.router.navigate(['/pedidoVentas']);
    this.ngOnInit();

  }

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

  onSelectionChange(options:Cliente, event: any){
    if(event.isUserInput){

      this.service.formData.IdClientes = options.IdClientes
      this.service.formData.Nombre = options.Nombre;
      this.service.formData.RFC = options.RFC;
      this.service.formData.RazonSocial = options.RazonSocial;
      this.service.formData.Calle = options.Calle;
      this.service.formData.Colonia = options.Colonia;
      this.service.formData.CP = options.CP;
      this.service.formData.Ciudad = options.Ciudad;
      this.service.formData.Estado = options.Estado;
      this.service.formData.NumeroInterior = options.NumeroInterior;
      this.service.formData.NumeroExterior = options.NumeroExterior;
      this.service.formData.ClaveCliente = options.ClaveCliente;
      this.service.formData.Estatus = options.Estatus;
      this.service.formData.LimiteCredito = options.LimiteCredito;
      this.service.formData.DiasCredito = options.DiasCredito;
      this.service.formData.MetodoPago = options.MetodoPago;
      this.service.formData.UsoCFDI = options.UsoCFDI;
      this.service.formData.IdApi = options.IdApi;
      this.service.formData.Vendedor = options.Vendedor;
    }
  }

  onSelectionChange2(options2: Producto, event: any) {
    if (event.isUserInput) {
      this.service.formProd.IdProducto = options2.IdProducto;
      this.service.formProd.Nombre = options2.Nombre;
      this.service.formProd.PrecioVenta = options2.PrecioVenta;
      this.service.formProd.PrecioCosto = options2.PrecioCosto;
      this.service.formProd.Cantidad = options2.Cantidad;
      this.service.formProd.ClaveProducto = options2.ClaveProducto;
      this.service.formProd.Stock = options2.Stock;
      this.service.formProd.DescripcionProducto = options2.DescripcionProducto;
      this.service.formProd.Estatus = options2.Estatus;
      this.service.formProd.UnidadMedida = options2.UnidadMedida;
      this.service.formProd.IVA = options2.IVA;
    }
  }


  resetForm(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.service.formData = {
      IdClientes: 0,
      Nombre: '',
      RFC: '',
      RazonSocial: '',
      Calle: '',
      Colonia: '',
      CP: '',
      Ciudad: '',
      Estado: '',
      NumeroInterior: '',
      NumeroExterior: '',
      ClaveCliente: '',
      Estatus: '',
      LimiteCredito: '',
      DiasCredito: '',
      MetodoPago: '',
      UsoCFDI: '',
      IdApi: '',
      MetodoPagoCliente: '',
      Vendedor: 7,

    }

  }

  MonedaSelected(event: any) {
    // console.log(event);
    this.Moneda = event.target.selectedOptions[0].text;
    // console.log(this.Moneda);
    this.service.Moneda = this.Moneda;
    // console.log(this.service.Moneda);
  }



}
