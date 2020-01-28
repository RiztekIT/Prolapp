import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar, MatAutocompleteSelectedEvent, MatOptionSelectionChange } from '@angular/material';
import { FacturaService } from '../../../../services/facturacioncxc/factura.service';
import { NgForm, FormControl } from '@angular/forms';
import { Factura } from 'src/app/Models/facturacioncxc/factura-model';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Producto } from '../../../../Models/catalogos/productos-model';
import { HttpHeaders,HttpClient } from '@angular/common/http';

import Swal from 'sweetalert2';
import { CurrencyPipe } from '@angular/common';
import { EnviarfacturaService } from 'src/app/services/facturacioncxc/enviarfactura.service';




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
  selector: 'app-facturacioncxc-producto',
  templateUrl: './facturacioncxc-producto.component.html',
  styleUrls: ['./facturacioncxc-producto.component.css']
})
export class FacturacioncxcProductoComponent implements OnInit {

  IVA;
  IdFactura: any;
  myControl = new FormControl();
  options: Producto[] = [];
  filteredOptions: Observable<any[]>;
  rootURL = "/SieAPIRest/service/v1/series/SF63528/datos/"
  Cdolar: string;
  precioUnitarioF;
  importeF;
  ivaF;
  precioUnitarioDllsF;
  importeDllsF;
  ivaDllsF;
  Moneda: string;
  um: boolean;
  // options = [{city_name: "AnyTown", city_num: "4"}, {city_name: "YourTown", city_num: "15"}, {city_name: "SmallTown", city_num: "35"}];
  //Objeto de ProductoslistClientes: Cliente[] = [];
  listProductos: Producto[] = [];
  
  myControlUnidad = new FormControl();
  optionsUnidad = ['Pieza'];
  filteredOptionsUnidad: Observable<any[]>;
  

  constructor(public dialogbox: MatDialogRef<FacturacioncxcProductoComponent>,
    public service: FacturaService, private snackBar: MatSnackBar, private http : HttpClient, private currencyPipe: CurrencyPipe, public enviarfact: EnviarfacturaService) { }

  ngOnInit() {
    this.resetForm();
    this.obtenerProductos();
    this.tipoDeCambio();
    this.um = true;
    
    // this.unidadMedida();
    // console.log((this.service));


    this.filteredOptionsUnidad = this.myControlUnidad.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterUnidad(value))
      );

      // console.log(this.service.IdFactura);
      this.IdFactura = this.service.IdFactura ;
      // console.log(this.IdFactura);

  }
//Clave Unidad
public listUM: Array<any> = [];



  //Filter Clave Producto
   private _filter(value: any): any[] {
    const filterValue = value.toLowerCase();
    // console.log(filterValue + "FILTER  VALUE");
    // return this.options.filter(option => option.Nombre.toLowerCase().includes(filterValue));
    return this.options.filter(option => 
      option.Nombre.toLowerCase().includes(filterValue) || 
      option.ClaveProducto.toLowerCase().includes(filterValue));
  }
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
  onMoneda(){
    // console.log(event);
    // console.log(this.service.formData);
    
    this.Moneda = this.service.formData.Moneda;
    // console.log(this.Moneda);
    this.service.Moneda = this.Moneda;
    // console.log(this.service.Moneda);
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

  onClose() {
    this.dialogbox.close();
    this.service.filter('Register click');
  }
 
  obtenerProductos(){
    this.service.getProductos().subscribe((data) => {
    for (let i = 0; i < data.length; i++) {
      let producto = data[i];
      this.listProductos.push(producto);
       this.options.push(producto)
      // console.log(this.options);
      // this.service.formDataDF.Producto = producto.Nombre;

      
    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    }
    
    // console.log(this.listProductos);
    // console.log(this.listProductos[0].Nombre);
    });
    // this.options = this.listProductos['ClaveProducto'];
    // console.log(this.options);
  }
  // onSelectionChange(event: MatAutocompleteSelectedEvent, options:Producto){
  onSelectionChange(options:Producto, event: any){
    if(event.isUserInput){
      // event.source.optionSelected
      
      // console.log(event.source);
      // console.log(options);
      // console.log((this.service));
      
      
      this.service.formDataDF.Producto = options.Nombre;
      this.service.formDataDF.ClaveSAT = options.ClaveSAT;
      this.service.formDataDF.Unidad = options.UnidadMedida;
      this.IVA = options.IVA;
      this.sumar();
    }
    // this.onMoneda();


  }

  sumar(){
    let p1: number;
    let p2: number;
    let suma: number;
    if (this.service.Moneda=='MXN'){
    p1 = parseFloat(this.service.formDataDF.PrecioUnitario);
    p2 = parseFloat(this.service.formDataDF.Cantidad);
    this.service.formDataDF.PrecioUnitarioDlls = (p1 / parseFloat(this.Cdolar)).toFixed(4)
    suma = p1 * p2;
    this.service.formDataDF.Importe=suma.toFixed(4);
    this.service.formDataDF.ImporteDlls= (suma / parseFloat(this.Cdolar)).toFixed(4);
    this.service.formDataDF.ImporteIVA = (suma * parseFloat(this.IVA)).toFixed(4);
    this.service.formDataDF.ImporteIVADlls = (parseFloat(this.service.formDataDF.ImporteDlls) * parseFloat(this.IVA)).toFixed(4);
    
    
    


    }else if (this.service.Moneda=='USD'){
    p1 = parseFloat(this.service.formDataDF.PrecioUnitarioDlls);
    p2 = parseFloat(this.service.formDataDF.Cantidad);

    this.service.formDataDF.PrecioUnitario = (p1 * parseFloat(this.Cdolar)).toFixed(4);
    suma = p1 * p2;
    this.service.formDataDF.Importe= (suma * parseFloat(this.Cdolar)).toFixed(4);
    this.service.formDataDF.ImporteDlls=suma.toFixed(4);
    // this.service.formDataDF.Importe= ( suma / parseFloat(this.Cdolar)).toFixed(4);
    this.service.formDataDF.ImporteIVADlls = (suma * parseFloat(this.IVA)).toFixed(4);
    this.service.formDataDF.ImporteIVA = (parseFloat(this.service.formDataDF.Importe) * parseFloat(this.IVA)).toFixed(4);
    
  
    }
    
    
  }

  formato(){
    const preciounitario = document.getElementById('precioUnitario');
    const importe = document.getElementById('importe');
    const iva = document.getElementById('iva');
    // console.log(this.service.formDataDF.Importe);
    

  //   if(this.service.formDataDF.PrecioUnitario!='NaN'){
  //   this.precioUnitarioF = this.currencyPipe.transform(this.service.formDataDF.PrecioUnitario);
  //   preciounitario.value = this.precioUnitarioF;
  //   }else{
  //     preciounitario.value = '$0.00';
  //   }
  //   if(this.service.formDataDF.Importe!='NaN'){
  //   this.importeF = this.currencyPipe.transform(this.service.formDataDF.Importe);
  //   importe.value = this.importeF;
  // }else{
  //   importe.value = '$0.00';
  //   }
  //   if(this.service.formDataDF.ImporteIVA!='NaN'){
  //   this.ivaF = this.currencyPipe.transform(this.service.formDataDF.ImporteIVA);
  //   iva.value = this.ivaF;
  // }else{
  //   iva.value = '$0.00';

  //   }

  }

  formatoDlls(){
    const preciounitarioDlls = document.getElementById('precioUnitarioDlls');
    const importeDlls = document.getElementById('importeDlls');
    const ivaDlls = document.getElementById('ivaDlls');
    // console.log(this.service.formDataDF.Importe);
    

  //   if(this.service.formDataDF.PrecioUnitarioDlls!='NaN'){
  //   this.precioUnitarioDllsF = this.currencyPipe.transform(this.service.formDataDF.PrecioUnitarioDlls);
  //   preciounitarioDlls.value = this.precioUnitarioDllsF;
  //   }else{
  //     preciounitarioDlls.value = '$0.00';
  //   }
  //   if(this.service.formDataDF.ImporteDlls!='NaN'){
  //   this.importeDllsF = this.currencyPipe.transform(this.service.formDataDF.ImporteDlls);
  //   importeDlls.value = this.importeDllsF;
  // }else{
  //   importeDlls.value = '$0.00';
  //   }
  //   if(this.service.formDataDF.ImporteIVADlls!='NaN'){
  //   this.ivaDllsF = this.currencyPipe.transform(this.service.formDataDF.ImporteIVADlls);
  //   ivaDlls.value = this.ivaDllsF;
  // }else{
  //   ivaDlls.value = '$0.00';

  //   }

  }
   

  // onSelectionChanged(event: MatAutocompleteSelectedEvent,options: Producto) {
  //   if (event.source.selected) {
    // console.log(options);
  //    this.service.formDataDF.Producto = options.Nombre;
  //   }
  // }

  resetForm(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.service.formDataDF = {
      // Detalle Factura
    IdDetalle: 0,
    IdFactura: 0,
    ClaveProducto: '',
    Producto: '',
    Unidad: '',
    ClaveSAT: '',
    PrecioUnitario: '',
    PrecioUnitarioDlls: '',
    Cantidad: '',
    Importe: '',
    ImporteDlls: '',
    Observaciones: '',
    TextoExtra: '',
    ImporteIVA: '',
    ImporteIVADlls: ''
    }

  }


  
 
  onSubmit(form: NgForm) {
    this.service.formDataDF.IdFactura = this.IdFactura;
    // console.log(this.service.formDataDF);
    this.service.addDetalleFactura(this.service.formDataDF).subscribe(res => {
      this.resetForm(form);
      // console.log(res);
      Swal.fire({
        icon: 'success',
        title: 'Producto Agregado'
      })
    }
    );
    // console.log(this.service.formDataDF);
  
  }

  Finalizar(form: NgForm){

    this.service.formDataDF.IdFactura = this.IdFactura;
    // console.log(this.service.formDataDF);
    this.service.addDetalleFactura(this.service.formDataDF).subscribe(res => {
      this.resetForm(form);
      Swal.fire({
        icon: 'success',
        title: 'Producto Agregado'
      })
      this.dialogbox.close();
      this.service.filter('Register click');
    }
    );
    // console.log(this.service.formDataDF);

  }

  tipoDeCambio(){
    this.traerApi().subscribe(data => {
      this.Cdolar = data.bmx.series[0].datos[0].dato;
      
    })

  }

  traerApi(): Observable<any>{

    
   
    
    let hora = new Date().getHours();
    let fechahoy = new Date();
    let fechaayer = new Date();
    

    fechaayer.setDate(fechahoy.getDate() - 1)
    let diaayer = new Date(fechaayer).getDate();
    let mesayer = new Date(fechaayer).getMonth();
    let añoayer = new Date(fechaayer).getFullYear();
    let diasemana = new Date(fechahoy).getDay();
    
    
    // console.log(fechaayer.getDay());
    // console.log(hora);
    // console.log('dia semana '+ diasemana);
    //2020-01-03/2020-01-03
if (diasemana == 6 || diasemana == 0){
  this.rootURL = this.rootURL+'oportuno'
}else{
  if (hora<11){
    this.rootURL = this.rootURL+'oportuno'
  }
  else{
    if (diasemana == 1 ){
      fechaayer.setDate(fechahoy.getDate() - 3)
    let diaayer = new Date(fechaayer).getDate();
    let mesayer = new Date(fechaayer).getMonth();
    let añoayer = new Date(fechaayer).getFullYear();
    mesayer = mesayer+1;
    let fecha = añoayer+'-'+mesayer+'-'+diaayer;
    // console.log(fecha);
    this.rootURL = this.rootURL+fecha+'/'+fecha

    }else{
    mesayer = mesayer+1;
    let fecha = añoayer+'-'+mesayer+'-'+diaayer;
    // console.log(fecha);
    this.rootURL = this.rootURL+fecha+'/'+fecha
    }
  }
}

    
    
    
    

    // console.log(this.http.get(this.rootURL, httpOptions));
    
    return this.http.get(this.rootURL, httpOptions)

  }


}
