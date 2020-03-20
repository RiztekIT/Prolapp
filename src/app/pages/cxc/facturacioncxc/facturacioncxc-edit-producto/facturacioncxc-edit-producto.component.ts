import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar, MatAutocompleteSelectedEvent } from '@angular/material';
import { FacturaService } from '../../../../services/facturacioncxc/factura.service';
import { NgForm, FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Producto } from '../../../../Models/catalogos/productos-model';
import Swal from 'sweetalert2';
import { EnviarfacturaService } from 'src/app/services/facturacioncxc/enviarfactura.service';
import { CurrencyPipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UnidadMedidaService } from 'src/app/services/unidadmedida/unidad-medida.service';

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
  selector: 'app-facturacioncxc-edit-producto',
  templateUrl: './facturacioncxc-edit-producto.component.html',
  styleUrls: ['./facturacioncxc-edit-producto.component.css']
})
export class FacturacioncxcEditProductoComponent implements OnInit {
  um: boolean;
  IVA;
  IdFactura: any;
  myControl = new FormControl();
  options: Producto[] = [];
  filteredOptions: Observable<any[]>;
  listProductos: Producto[] = [];

  rootURL = "/SieAPIRest/service/v1/series/SF63528/datos/"
  
  myControlUnidad = new FormControl();
  optionsUnidad = ['Pieza'];
  Cdolar: string;
  precioUnitarioF;
  importeF;
  ivaF;
  precioUnitarioDllsF;
  importeDllsF;
  ivaDllsF;
  
  filteredOptionsUnidad: Observable<any[]>;
  //Clave Unidad
public listUM: Array<any> = [];

  

  constructor(public dialogbox: MatDialogRef<FacturacioncxcEditProductoComponent>,
    public service: FacturaService, private snackBar: MatSnackBar,public enviarfact: EnviarfacturaService, private currencyPipe: CurrencyPipe, private http : HttpClient,public ServiceUnidad: UnidadMedidaService) { }

  ngOnInit() {
    this.obtenerProductos();
    // this.unidadMedida();


    this.filteredOptionsUnidad = this.myControlUnidad.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterUnidad(value))
      );

      // console.log(this.service.IdFactura);
      this.IdFactura = this.service.IdFactura ;
      // console.log(this.IdFactura);

      this.tipoDeCambio();
      this.um = true;
      

  }
  //Filter Clave Producto
   private _filter(value: any): any[] {
    //  console.log(value);
    const filterValue = value.toLowerCase();
    return this.options.filter(option => 
      option.Nombre.toLowerCase().includes(filterValue) || 
      option.ClaveProducto.toLowerCase().includes(filterValue));
  }
  //Filter Unidad
  // private _filterUnidad(value: any): any[] {
  //   const filterValueUnidad = value.toLowerCase();
  //   //return this.optionsUnidad.filter(optionUnidad => optionUnidad.toString().toLowerCase().includes(filterValueUnidad));
  //   return this.listUM.filter(optionUnidad => optionUnidad.key.toString().toLowerCase().includes(filterValueUnidad) || optionUnidad.name.toString().toLowerCase().includes(filterValueUnidad));
  // }

  private _filterUnidad(value: any): any[] {
    if (typeof(value)=='string'){
    const filterValueUnidad = value.toLowerCase();
    return this.listUM.filter(optionUnidad => optionUnidad.ClaveSAT.toString().toLowerCase().includes(filterValueUnidad) || optionUnidad.Nombre.toString().toLowerCase().includes(filterValueUnidad));
    }else if (typeof(value)=='number'){
      const filterValueUnidad = value;
      return this.listUM.filter(optionUnidad => optionUnidad.ClaveSAT.toString().includes(filterValueUnidad) || optionUnidad.Nombre.toString().includes(filterValueUnidad));
    }
  }

  onClose() {
    this.dialogbox.close();
    this.service.filter('Register click');
  }

  unidadMedida(){
    // this.listUM = [];
    // this.enviarfact.unidadMedida().subscribe(data=>{
    //   //console.log(JSON.parse(data).data);
    //   for (let i=0; i<JSON.parse(data).data.length; i++){
    //     this.listUM.push(JSON.parse(data).data[i])
    //   }
    //   // console.log(this.listUM);
      

      
    // })
    if (this.um){
      this.listUM = [];
      // this.enviarfact.unidadMedida().subscribe(data=>{
      //   //console.log(JSON.parse(data).data);
      //   for (let i=0; i<JSON.parse(data).data.length; i++){
      //     this.listUM.push(JSON.parse(data).data[i])
      //   }
      this.ServiceUnidad.GetUnidadesMedida().subscribe(data =>{
        this.listUM = data;
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
 
  obtenerProductos(){
    this.service.getProductos().subscribe((data) => {
    for (let i = 0; i < data.length; i++) {
      let producto = data[i];
      this.listProductos.push(producto);
       this.options.push(producto)


      
    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    }
    });

  }
  onSelectionChange(options:Producto){
    
    
      this.service.formDataDF.Producto = options.Nombre;
      this.service.formDataDF.ClaveSAT = options.ClaveSAT;
      this.service.formDataDF.Unidad = options.UnidadMedida;
      this.IVA = options.IVA;
      this.sumar();
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
  
  sumar(){
    console.log(this.service.formDataDF);
    let p1: number;
    let p2: number;
    let suma: number;
    if (this.service.Moneda=='MXN'){
      console.log('SON PESOSOSOSOSSO');
    p1 = parseFloat(this.service.formDataDF.PrecioUnitario);
    p2 = parseFloat(this.service.formDataDF.Cantidad);
    this.service.formDataDF.PrecioUnitarioDlls = (p1 / parseFloat(this.Cdolar)).toFixed(4)
    suma = p1 * p2;
    this.service.formDataDF.Importe=suma.toFixed(4);
    this.service.formDataDF.ImporteDlls= (suma / parseFloat(this.Cdolar)).toFixed(4);
    // this.service.formDataDF.ImporteIVA = parseFloat(this.IVA).toFixed(4);
    // this.service.formDataDF.ImporteIVADlls = parseFloat(this.IVA).toFixed(4);
    this.service.formDataDF.ImporteIVA = (suma * parseFloat(this.IVA)).toFixed(4);
    this.service.formDataDF.ImporteIVADlls = (parseFloat(this.service.formDataDF.ImporteDlls) * parseFloat(this.IVA)).toFixed(4);
    
    // console.log(this.Cdolar);
    // console.log(this.service.formDataDF.PrecioUnitarioDlls);
    // console.log(this.service.formDataDF.ImporteDlls);
    


    }else if (this.service.Moneda=='USD'){
      console.log('SON DOLARUCOSSSSSS');
    p1 = parseFloat(this.service.formDataDF.PrecioUnitarioDlls);
    p2 = parseFloat(this.service.formDataDF.Cantidad);
    console.log(this.Cdolar);
    this.service.formDataDF.PrecioUnitario = (p1 * parseFloat(this.Cdolar)).toFixed(4);
    console.log(this.service.formDataDF.PrecioUnitario);
    suma = p1 * p2;
    this.service.formDataDF.ImporteDlls=suma.toFixed(4);
    this.service.formDataDF.Importe = (suma * parseFloat(this.Cdolar)).toFixed(4);
    // this.service.formDataDF.Importe= (suma / parseFloat(this.Cdolar)).toFixed(4);
    console.log(this.IVA);
    this.service.formDataDF.ImporteIVADlls = (suma * parseFloat(this.IVA)).toFixed(4);
    this.service.formDataDF.ImporteIVA = (parseFloat(this.service.formDataDF.Importe) * parseFloat(this.IVA)).toFixed(4);
    // this.service.formDataDF.ImporteIVADlls = parseFloat(this.IVA).toFixed(4);
    // this.service.formDataDF.ImporteIVA =  parseFloat(this.IVA).toFixed(4);
    console.log(this.service.formDataDF.PrecioUnitario);
    console.log(this.service.formDataDF.Importe);
    }
    
  }

  formato(){
    const preciounitario = <HTMLInputElement>document.getElementById('precioUnitario');
    const importe = <HTMLInputElement>document.getElementById('importe');
    const iva = <HTMLInputElement>document.getElementById('iva');
    console.log(this.service.formDataDF.Importe);
    

    if(this.service.formDataDF.PrecioUnitario!='NaN'){
    this.precioUnitarioF = this.currencyPipe.transform(this.service.formDataDF.PrecioUnitario);
    preciounitario.value = this.precioUnitarioF;
    }else{
      preciounitario.value = '$0.00';
    }
    if(this.service.formDataDF.Importe!='NaN'){
    this.importeF = this.currencyPipe.transform(this.service.formDataDF.Importe);
    importe.value = this.importeF;
  }else{
    importe.value = '$0.00';
    }
    if(this.service.formDataDF.ImporteIVA!='NaN'){
    this.ivaF = this.currencyPipe.transform(this.service.formDataDF.ImporteIVA);
    iva.value = this.ivaF;
  }else{
    iva.value = '$0.00';

    }

  }

  formatoDlls(){
    const preciounitarioDlls = <HTMLInputElement>document.getElementById('precioUnitarioDlls');
    const importeDlls = <HTMLInputElement>document.getElementById('importeDlls');
    const ivaDlls = <HTMLInputElement>document.getElementById('ivaDlls');
    // console.log(this.service.formDataDF.Importe);
    

    if(this.service.formDataDF.PrecioUnitarioDlls!='NaN'){
    this.precioUnitarioDllsF = this.currencyPipe.transform(this.service.formDataDF.PrecioUnitarioDlls);
    preciounitarioDlls.value = this.precioUnitarioDllsF;
    }else{
      preciounitarioDlls.value = '$0.00';
    }
    if(this.service.formDataDF.ImporteDlls!='NaN'){
    this.importeDllsF = this.currencyPipe.transform(this.service.formDataDF.ImporteDlls);
    importeDlls.value = this.importeDllsF;
    // console.log(this.service.formDataDF.Importe);
  }else{
    importeDlls.value = '$0.00';
    }
    if(this.service.formDataDF.ImporteIVADlls!='NaN'){
    this.ivaDllsF = this.currencyPipe.transform(this.service.formDataDF.ImporteIVADlls);
    ivaDlls.value = this.ivaDllsF;
  }else{
    ivaDlls.value = '$0.00';

    }

  }
   

 
  onSubmit(form: NgForm) {
    this.service.formDataDF.IdFactura = this.IdFactura;
    console.log(this.service.formDataDF);
    this.service.updateDetalleFactura(this.service.formDataDF).subscribe(res => {
      Swal.fire({
        icon: 'success',
        title: 'Producto Actualizado'
      })
      
    }
    );
  
  }




}
