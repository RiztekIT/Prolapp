import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RedhgfacturacionService } from '../../../../services/redholding/redhgfacturacion.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { Producto } from 'src/app/Models/catalogos/productos-model';
import { UnidadMedidaService } from 'src/app/services/unidadmedida/unidad-medida.service';
import { map, startWith } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  selector: 'app-redhgaddeditproductosterceros',
  templateUrl: './redhgaddeditproductosterceros.component.html',
  styleUrls: ['./redhgaddeditproductosterceros.component.css']
})
export class RedhgaddeditproductostercerosComponent implements OnInit {

  constructor(
    public dialogbox: MatDialogRef<RedhgaddeditproductostercerosComponent>,
    public redhgSVC: RedhgfacturacionService,
    public ServiceUnidad: UnidadMedidaService,
    private http : HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any, 
  ) { }

  IdFactura: any;
  myControl = new FormControl();
  options: Producto[] = [];
  filteredOptions: Observable<any[]>;
  IVA;
  CONIVA;
  Cdolar: string;
  Total;
  TotalDlls;
  myControlUnidad = new FormControl();
  optionsUnidad = ['Pieza'];
  filteredOptionsUnidad: Observable<any[]>;
  um: boolean;
  public listUM: Array<any> = [];
  precioUnitarioF;

  ivaF;
  importeF;
  precioUnitarioDllsF;
  ivaDllsF;
  importeDllsF;

  listProductos: Producto[] = [];

  rootURL = "/SieAPIRest/service/v1/series/SF63528/datos/"

  ngOnInit() {
    if (this.data.movimiento=='Agregar'){

      this.resetForm();
    }
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
      // this.IdFactura = this.service.IdFactura ;
      this.IdFactura = this.redhgSVC.formData.Id ;
      // console.log(this.IdFactura);
  }

  tipoDeCambio(){
    this.traerApi().subscribe(data => {
      this.Cdolar = data.bmx.series[0].datos[0].dato;
      
    })

  }

  obtenerProductos(){
    let consulta = 'select * from redhgproducto'
    /* getProductos() */
    this.redhgSVC.consultaRedhg(consulta).subscribe((data:any) => {
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

  private _filter(value: any): any[] {
    const filterValue = value.toLowerCase();
    // console.log(filterValue + "FILTER  VALUE");
    // return this.options.filter(option => option.Nombre.toLowerCase().includes(filterValue));
    return this.options.filter(option => 
      option.Nombre.toLowerCase().includes(filterValue) || 
      option.ClaveProducto.toLowerCase().includes(filterValue));
  }


  onClose() {
    this.dialogbox.close();
   
  }

  onSubmit(form: NgForm) {

    if (this.data.movimiento == 'Agregar'){
      

      this.redhgSVC.formDataDFTerceros.IdFactura = this.IdFactura;
      // console.log(this.service.formDataDF);
  
      let factura = this.redhgSVC.formDataDFTerceros
  
      let consulta ="insert into redhgDetalleFactura values (" + factura.IdFactura + ",'" + factura.ClaveProducto + "','" + factura.Producto + "','" + factura.Unidad + "','" + factura.ClaveSAT + "','" + factura.PrecioUnitario + "','" + factura.Cantidad + "','" + factura.Importe + "','" + factura.Observaciones + "','" + factura.TextoExtra + "','" + factura.PrecioUnitarioDlls + "','" + factura.ImporteDlls + "','" + factura.ImporteIVA + "','" + factura.ImporteIVADlls + "');"
      /* addDetalleFactura(this.redhgSVC.formDataDF) */
      this.redhgSVC.consultaRedhg(consulta).subscribe(res => {
        this.resetForm(form);
        // console.log(res);
        Swal.fire({
          icon: 'success',
          title: 'Producto Agregado'
        })
      }
      );
    }else{

      this.redhgSVC.formDataDFTerceros.IdFactura = this.IdFactura;
      // console.log(this.service.formDataDF);
  
      let factura = this.redhgSVC.formDataDFTerceros
  
      let consulta ="update redhgDetalleFactura set  IdFactura=" + factura.IdFactura + ", ClaveProducto='" + factura.ClaveProducto + "',Producto='" + factura.Producto + "',Unidad='" + factura.Unidad + "',ClaveSAT='" + factura.ClaveSAT + "',PrecioUnitario='" + factura.PrecioUnitario + "', Cantidad='" + factura.Cantidad + "',Importe='" + factura.Importe + "',Observaciones='" + factura.Observaciones + "',TextoExtra='" + factura.TextoExtra + "',PrecioUnitarioDlls='" + factura.PrecioUnitarioDlls + "',ImporteDlls='" + factura.ImporteDlls + "',ImporteIVA='" + factura.ImporteIVA + "',ImporteIVADlls='" + factura.ImporteIVADlls + "' where IdDetalle='"+factura.IdDetalle+"';"
      /* addDetalleFactura(this.redhgSVC.formDataDF) */
      this.redhgSVC.consultaRedhg(consulta).subscribe(res => {
        this.resetForm(form);
        // console.log(res);
        Swal.fire({
          icon: 'success',
          title: 'Producto Actualizado'
        })
      }
      );





    }

    
  
  }

  resetForm(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.redhgSVC.formDataDFTerceros = {
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

  onSelectionChange(options:Producto, event: any){
    if(event.isUserInput){
      // event.source.optionSelected
      
      // console.log(event.source);
      console.log('PRODUCTO',options);
      // console.log((this.service));
      
      
      this.redhgSVC.formDataDFTerceros.Producto = options.Nombre;
      this.redhgSVC.formDataDFTerceros.ClaveSAT = options.ClaveSAT;
      this.redhgSVC.formDataDFTerceros.Unidad = options.UnidadMedida;
      this.redhgSVC.formDataDFTerceros.PrecioUnitario = options.PrecioVenta;
      this.redhgSVC.formDataDFTerceros.Cantidad = '1'
      this.IVA = options.IVA;
      if (this.IVA=='0.16'){
        this.CONIVA = true;
      } else if (this.IVA=='0'){
        this.CONIVA = false;
      }
      this.sumar();
    }
    // this.onMoneda();


  }

  sumar(){
    let p1: number;
    let p2: number;
    let suma: number;
    console.log(this.IVA);
    if (this.redhgSVC.Moneda=='MXN'){
    p1 = parseFloat(this.redhgSVC.formDataDFTerceros.PrecioUnitario);
    p2 = parseFloat(this.redhgSVC.formDataDFTerceros.Cantidad);
    this.redhgSVC.formDataDFTerceros.PrecioUnitarioDlls = (p1 / parseFloat(this.Cdolar)).toFixed(4)
    suma = p1 * p2;
    this.redhgSVC.formDataDFTerceros.Importe=suma.toFixed(4);
    this.redhgSVC.formDataDFTerceros.ImporteDlls= (suma / parseFloat(this.Cdolar)).toFixed(4);
    // this.service.formDataDF.ImporteIVA = parseFloat(this.IVA).toFixed(4);
    // this.service.formDataDF.ImporteIVADlls = parseFloat(this.IVA).toFixed(4);
    this.redhgSVC.formDataDFTerceros.ImporteIVA = (suma * parseFloat(this.IVA)).toFixed(4);
    this.redhgSVC.formDataDFTerceros.ImporteIVADlls = (parseFloat(this.redhgSVC.formDataDFTerceros.ImporteDlls) * parseFloat(this.IVA)).toFixed(4);
    this.Total = +this.redhgSVC.formDataDFTerceros.Importe + +this.redhgSVC.formDataDFTerceros.ImporteIVA
    this.TotalDlls = +this.redhgSVC.formDataDFTerceros.ImporteDlls + +this.redhgSVC.formDataDFTerceros.ImporteIVADlls
    
    
    


    }else if (this.redhgSVC.Moneda=='USD'){
    p1 = parseFloat(this.redhgSVC.formDataDFTerceros.PrecioUnitarioDlls);
    p2 = parseFloat(this.redhgSVC.formDataDFTerceros.Cantidad);

    this.redhgSVC.formDataDFTerceros.PrecioUnitario = (p1 * parseFloat(this.Cdolar)).toFixed(4);
    suma = p1 * p2;
    this.redhgSVC.formDataDFTerceros.Importe= (suma * parseFloat(this.Cdolar)).toFixed(4);
    this.redhgSVC.formDataDFTerceros.ImporteDlls=suma.toFixed(4);
    // this.service.formDataDF.Importe= ( suma / parseFloat(this.Cdolar)).toFixed(4);
    // this.service.formDataDF.ImporteIVADlls = parseFloat(this.IVA).toFixed(4);
    // this.service.formDataDF.ImporteIVA = parseFloat(this.IVA).toFixed(4);
    console.log(this.IVA);
    this.redhgSVC.formDataDFTerceros.ImporteIVADlls = (suma * parseFloat(this.IVA)).toFixed(4);
    this.redhgSVC.formDataDFTerceros.ImporteIVA = (parseFloat(this.redhgSVC.formDataDFTerceros.Importe) * parseFloat(this.IVA)).toFixed(4);
    this.Total = +this.redhgSVC.formDataDFTerceros.Importe + +this.redhgSVC.formDataDFTerceros.ImporteIVA
    this.TotalDlls = +this.redhgSVC.formDataDFTerceros.ImporteDlls + +this.redhgSVC.formDataDFTerceros.ImporteIVADlls
  
    }
    
    
  }

  unidadMedida(){
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

  private _filterUnidad(value: any): any[] {
    if (typeof(value)=='string'){
    const filterValueUnidad = value.toLowerCase();
    return this.listUM.filter(optionUnidad => optionUnidad.ClaveSAT.toString().toLowerCase().includes(filterValueUnidad) || optionUnidad.Nombre.toString().toLowerCase().includes(filterValueUnidad));
    }else if (typeof(value)=='number'){
      const filterValueUnidad = value;
      return this.listUM.filter(optionUnidad => optionUnidad.ClaveSAT.toString().includes(filterValueUnidad) || optionUnidad.Nombre.toString().includes(filterValueUnidad));
    }
  }


  formato(){
    this.redhgSVC.formDataDFTerceros.PrecioUnitario = (+this.redhgSVC.formDataDFTerceros.PrecioUnitario).toFixed(4)
    this.redhgSVC.formDataDFTerceros.Importe = (+this.redhgSVC.formDataDFTerceros.Importe).toFixed(4)
    this.redhgSVC.formDataDFTerceros.ImporteIVA = (+this.redhgSVC.formDataDFTerceros.ImporteIVA).toFixed(4)
    this.Total = (+this.Total).toFixed(4)
    this.redhgSVC.formDataDFTerceros.PrecioUnitarioDlls = (+this.redhgSVC.formDataDFTerceros.PrecioUnitarioDlls).toFixed(4)
    this.redhgSVC.formDataDFTerceros.ImporteDlls = (+this.redhgSVC.formDataDFTerceros.ImporteDlls).toFixed(4)
    this.redhgSVC.formDataDFTerceros.ImporteIVADlls = (+this.redhgSVC.formDataDFTerceros.ImporteIVADlls).toFixed(4)
    this.TotalDlls = (+this.TotalDlls).toFixed(4)
    
  /*   const preciounitario = <HTMLInputElement>document.getElementById('precioUnitario');
    const importe = <HTMLInputElement>document.getElementById('importe');
    const iva = <HTMLInputElement>document.getElementById('iva');
    // console.log(this.service.formDataDF.Importe);
    

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

    } */

  }

  quitarPonerIVA(event){

    console.log(event);
    console.log(this.CONIVA);

    if (this.CONIVA){
      this.IVA = '0'
    }else{
      this.IVA = '0.16'
    }

    this.CONIVA = !this.CONIVA
    this.sumar();
    this.formato();

  /*   if (this.IVA){
      this.IVA = !this.IVA;
      
    }else{
      this.IVA = !this.IVA;
      
    }

    this.sumar(); */


  }


  Finalizar(form: NgForm){

    if (this.data.movimiento=='Agregar'){

      this.redhgSVC.formDataDFTerceros.IdFactura = this.IdFactura;
      // console.log(this.service.formDataDF);
      let factura = this.redhgSVC.formDataDFTerceros
  
      let consulta ="insert into redhgDetalleFactura values (" + factura.IdFactura + ",'" + factura.ClaveProducto + "','" + factura.Producto + "','" + factura.Unidad + "','" + factura.ClaveSAT + "','" + factura.PrecioUnitario + "','" + factura.Cantidad + "','" + factura.Importe + "','" + factura.Observaciones + "','" + factura.TextoExtra + "','" + factura.PrecioUnitarioDlls + "','" + factura.ImporteDlls + "','" + factura.ImporteIVA + "','" + factura.ImporteIVADlls + "');"
      /* addDetalleFactura(this.redhgSVC.formDataDF) */
      this.redhgSVC.consultaRedhg(consulta).subscribe(res => {
        this.resetForm(form);
        Swal.fire({
          icon: 'success',
          title: 'Producto Agregado'
        })
        this.dialogbox.close();
        /* this.redhgSVC.filter(this.IdFactura); */
      }
      );
      // console.log(this.service.formDataDF);
    }else{
      this.redhgSVC.formDataDFTerceros.IdFactura = this.IdFactura;
      // console.log(this.service.formDataDF);
  
      let factura = this.redhgSVC.formDataDFTerceros
  
      let consulta ="update redhgDetalleFactura set  IdFactura=" + factura.IdFactura + ", ClaveProducto='" + factura.ClaveProducto + "',Producto='" + factura.Producto + "',Unidad='" + factura.Unidad + "',ClaveSAT='" + factura.ClaveSAT + "',PrecioUnitario='" + factura.PrecioUnitario + "', Cantidad='" + factura.Cantidad + "',Importe='" + factura.Importe + "',Observaciones='" + factura.Observaciones + "',TextoExtra='" + factura.TextoExtra + "',PrecioUnitarioDlls='" + factura.PrecioUnitarioDlls + "',ImporteDlls='" + factura.ImporteDlls + "',ImporteIVA='" + factura.ImporteIVA + "',ImporteIVADlls='" + factura.ImporteIVADlls + "' where IdDetalle='"+factura.IdDetalle+"';"
      /* addDetalleFactura(this.redhgSVC.formDataDF) */
      this.redhgSVC.consultaRedhg(consulta).subscribe(res => {
        this.resetForm(form);
        // console.log(res);
        Swal.fire({
          icon: 'success',
          title: 'Producto Actualizado'
        })
      }
      );
    }


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

  ver(){
    console.log(this.redhgSVC.formDataDFTerceros);
  }

}
