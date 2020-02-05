import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm, FormControl } from "@angular/forms";
import { Observable } from 'rxjs';
import { Cliente } from 'src/app/Models/catalogos/clientes-model';
import { map, startWith } from 'rxjs/operators';
import { VentasPedidoService } from '../../../../../services/ventas/ventas-pedido.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from '../../../../../Models/catalogos/productos-model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-pedidoventas-add',
  templateUrl: './pedidoventas-add.component.html',
  styleUrls: ['./pedidoventas-add.component.css']
})
export class PedidoventasAddComponent implements OnInit {

  constructor(public router: Router, private currencyPipe: CurrencyPipe, public service: VentasPedidoService, private _formBuilder: FormBuilder) { }

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  ngOnInit() {

    this.Inicializar();
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



}

