import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource, MAT_DATE_LOCALE } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Producto } from 'src/app/Models/catalogos/productos-model';
import { AddsproductosService } from 'src/app/services/addsproductos.service';
import { TarimaService } from 'src/app/services/almacen/tarima/tarima.service';
import { BodegasService } from 'src/app/services/catalogos/bodegas.service';
import { VentasPedidoService } from 'src/app/services/ventas/ventas-pedido.service';
import Swal from 'sweetalert2';
import { NativeDateAdapter, MAT_DATE_FORMATS, DateAdapter } from "@angular/material"
import { EventosService } from 'src/app/services/eventos/eventos.service';

class detalletarima{

  IdDetalleTarima:number
  ClaveProducto:string
  Producto:string
  SacosTotales:string
  PesoxSaco:string
  Lote:string
  PesoTotal:string
  SacosxTarima:string
  TarimasTotales:string
  Bodega:string
  IdProveedor:number
  Proveedor:string
  PO:string
  FechaMFG:Date
  FechaCaducidad:Date
  Shipper:string
  USDA:string
  Pedimento:string
  Estatus:string


}

/* Constante y variables para la transformacion de los meses en los datetimepicker */
// const months =['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DIC'];
const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
export class AppDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      return `${day}/${months[month]}/${year}`
    }
    return date.toDateString();
  }
}

export const APP_DATE_FORMATS =
{
  parse: {
    dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
  },
  display: {
    dateInput: 'input',
    // monthYearLabel: 'MMM YYYY',
    // dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    // monthYearA11yLabel: 'MMM YYYY',
    monthYearLabel: { year: 'numeric', month: 'numeric' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  }
};
/* ----------------------------------------- */

@Component({
  selector: 'app-movimientosinventarios',
  templateUrl: './movimientosinventarios.component.html',
  styleUrls: ['./movimientosinventarios.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    },
    {
      provide: MAT_DATE_LOCALE, useValue: 'es-MX'
    }
  ]
})
export class MovimientosinventariosComponent implements OnInit {

  constructor(public serviceTarima: TarimaService, public addproductos: AddsproductosService, public ventasSVC: VentasPedidoService, private bodegaservice: BodegasService,
    private eventosService:EventosService,) { }

  filteredOptions2: Observable<any[]>;
  filteredOptions3: Observable<any[]>;
  filteredOptions4: Observable<any[]>;
  filteredOptions5: Observable<any[]>;
  myControl2 = new FormControl();
  myControl3 = new FormControl();
  myControl4 = new FormControl();
  myControl5 = new FormControl();
  ProductoSelect: string;
  MarcaSelect: string;
  OrigenSelect:string;
  PresentacionSelect: string;
  ClaveProducto: string;
  clavemarca:string;
  claveorigen:string;
  clavepresentacion:string;
  options2: Producto[] = [];
  options3: any[] = []
  options4: any[] = []
  options5: any[] = []
  listProducts: Producto[] = [];

  PesoTotal;
  Lote;
  bodegaSelect;
  FechaMFG;
  FechaCaducidad;
  public listBodega: Array<any> = [];

  productosAgregados;
  listData: MatTableDataSource<any>;
  
  
  displayedColumns: string[] = ['ID','Clave','Producto', 'Kg','Options'];

  tipoSelect;

  public listTipos: Array<any> = [
    { tipo: 'Entrada' },
    { tipo: 'Salida' },    
    { tipo: 'Muestra' },    
    { tipo: 'Merma' },    
  ];
  


  public detalletarimaBlanco: detalletarima = {
    IdDetalleTarima:0,
    ClaveProducto:'',
    Producto:'',
    SacosTotales:'',
    PesoxSaco:'',
    Lote:'',
    PesoTotal:'',
    SacosxTarima:'',
    TarimasTotales:'',
    Bodega:'',
    IdProveedor:0,
    Proveedor:'',
    PO:'',
    FechaMFG:new Date(),
    FechaCaducidad:new Date(),
    Shipper:'0',
    USDA:'0',
    Pedimento:'0',
    Estatus:'Creada',


  }


  ngOnInit() {
    this.getProductosInventario()
    this.ProductoSelect = "";
    this.options2 = [];
    this.dropdownRefresh2();
    this.getbodegas()
    this.productosAgregados = []
    this.tipoSelect = ""
  }

  getProductosInventario(){
    let consulta = {
      'consulta':"select * from detalletarima where iddetalletarima=1"
    };
    this.serviceTarima.generarConsulta(consulta).subscribe(data=>{
      console.log(data);
    })
  }

  bodegaCambio(event){
    // console.log(event);
this.bodegaSelect = event.value;
console.log(this.bodegaSelect);



}

subs1: Subscription

getbodegas(){
  this.subs1 = this.bodegaservice.getBodegasList().subscribe(res => {
    console.clear();
    console.log(res);
    console.log(res[0].Origen);
    for (let i = 0; i <= res.length -1; i++) {
      let b = res[i].Origen
      this.listBodega.push(b)
    }

  })
}


  dropdownRefresh2() {
    this.options2 = [];
    this.ventasSVC.getDepDropDownValues2().subscribe(dataP => {
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

  onSelectionChange2(options2: Producto, event: any) {
    if (event.isUserInput) {
      this.serviceTarima.formProd = options2;
      //this.PStock = this.service.formProd.Stock;
      //this.ProductoPrecio = +this.service.formProd.PrecioVenta;
      //asignar el valor inicial en caso de que la moneda este declarada en USD
    /*   if (this.MonedaBoolean == false) {
        this.ProductoPrecioDLLS = (+this.service.formProd.PrecioVenta / this.TipoCambio);
      } */

      this.ClaveProducto = this.serviceTarima.formProd.ClaveProducto;
      this.droddownMarcas(this.serviceTarima.formProd.Nombre);
      this.droddownOrigen();
      this.droddownPresentacion();

      this.OrigenSelect = 'USA'
      this.claveorigen = '1'
      this.PresentacionSelect = '25 Kg'      
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
    // console.clear();
    // console.log(value);
    if (typeof (value) == 'string') {
      const filterValue2 = value.toLowerCase();
      return this.options3.filter(option => option.NombreMarca.toString().toLowerCase().includes(filterValue2));
    } 
  }
  private _filterorigen(value: any): any[] {
    // console.clear();
    // console.log(value);
    if (typeof (value) == 'string') {
      const filterValue2 = value.toLowerCase();
      return this.options4.filter(option => option.NombreOrigen.toString().toLowerCase().includes(filterValue2));
    } 
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
    
    this.serviceTarima.formProd.DescripcionProducto = this.ProductoSelect + ' ' + this.MarcaSelect + ' ' + this.OrigenSelect + ' ' + this.PresentacionSelect
  }
  onSelectionChangeOrigen(options2, event: any){
    console.log(options2);
    this.claveorigen = options2.ClaveOrigen;
    this.OrigenSelect = options2.NombreOrigen;
    this.serviceTarima.formProd.DescripcionProducto = this.ProductoSelect + ' ' + this.MarcaSelect + ' ' + this.OrigenSelect + ' ' + this.PresentacionSelect

  }
  onSelectionChangePresentacion(options2, event: any){
    console.log(options2);
    this.PresentacionSelect = options2.Presentacion;
    this.serviceTarima.formProd.DescripcionProducto = this.ProductoSelect + ' ' + this.MarcaSelect + ' ' + this.OrigenSelect + ' ' + this.PresentacionSelect
    

  }


  movimientoInv(){

    console.log(this.tipoSelect);

    if (this.tipoSelect=='Salida'){
      this.salidaMercancia()

    }else if(this.tipoSelect=='Entrada'){
      this.entradaMercancia();

    }else if(this.tipoSelect=='Muestra'){
      this.muestraMercancia();

    }else if(this.tipoSelect=='Merma'){
      this.mermaMercancia();

    }else{
      Swal.fire({
        text: 'Tipo no Seleccionado',
        icon: 'error'
      });
    }

  }

  salidaMercancia(){


    let consulta = {
      'consulta':"select * from detalletarima where Producto='"+this.serviceTarima.formProd.DescripcionProducto+ "' and lote='"+this.Lote+"' and Bodega='"+this.bodegaSelect+"' and Estatus='Creada';"
    };

    console.log(consulta);
    this.serviceTarima.generarConsulta(consulta).subscribe((data:any)=>{

      if (data.length>0){

        let PesoNuevo = (+data[0].PesoTotal - +this.PesoTotal )

        let SacosTotales = (+PesoNuevo / +data[0].PesoxSaco).toFixed(4);



        let consulta2 = {
          'consulta':"update detalletarima set SacosTotales='"+SacosTotales+"', PesoTotal='"+PesoNuevo+"'  where Producto='"+this.serviceTarima.formProd.DescripcionProducto+ "' and lote='"+this.Lote+"' and Bodega='"+this.bodegaSelect+"' and Estatus='Creada';"
        };

        this.serviceTarima.generarConsulta(consulta2).subscribe((data2:any)=>{
          console.log(data2);
          
          this.eventosService.movimientos('Salida de Mercancia')
          if (data2.length==0){

            Swal.fire({
              icon: 'success',
              title: 'Producto Actualizado',
              text: ''+this.serviceTarima.formProd.DescripcionProducto+'',
              timer: 1500
            })
          }

        })


      }else{
        Swal.fire({
          text: 'Producto No Existe en el Inventario',
          icon: 'error'
        });
      }

    })

  }


  entradaMercancia(){


    let consulta = {
      'consulta':"select * from detalletarima where Producto='"+this.serviceTarima.formProd.DescripcionProducto+ "' and lote='"+this.Lote+"' and Bodega='"+this.bodegaSelect+"' and Estatus='Creada';"
    };

    console.log(consulta);
    this.serviceTarima.generarConsulta(consulta).subscribe((data:any)=>{

      if (data.length>0){

        let PesoNuevo = (+data[0].PesoTotal + +this.PesoTotal)

        let SacosTotales = (+PesoNuevo / +data[0].PesoxSaco).toFixed(4);



        let consulta2 = {
          'consulta':"update detalletarima set SacosTotales='"+SacosTotales+"', PesoTotal='"+PesoNuevo+"'  where Producto='"+this.serviceTarima.formProd.DescripcionProducto+ "' and lote='"+this.Lote+"' and Bodega='"+this.bodegaSelect+"' and Estatus='Creada';"
        };

        this.serviceTarima.generarConsulta(consulta2).subscribe((data2:any)=>{
          console.log(data2);

          this.eventosService.movimientos('Entrada de Mercancia')
          if (data2.length==0){

            Swal.fire({
              icon: 'success',
              title: 'Producto Actualizado',
              text: ''+this.serviceTarima.formProd.DescripcionProducto+'',
              timer: 1500
            })
          }


        })


      }else{


    let movimiento = this.detalletarimaBlanco;
    movimiento.ClaveProducto = this.serviceTarima.formProd.ClaveProducto + this.clavemarca + this.claveorigen;
    movimiento.Producto = this.serviceTarima.formProd.DescripcionProducto;
    movimiento.PesoTotal = this.PesoTotal;
    if (this.PresentacionSelect=='25 Kg'){
      movimiento.PesoxSaco = '25';
    }else  if (this.PresentacionSelect=='50 Kg'){
      movimiento.PesoxSaco = '50';
    }else  if (this.PresentacionSelect=='1000 Kg'){
      movimiento.PesoxSaco = '1000';
    }else  if (this.PresentacionSelect=='22.68 Lb'){
      movimiento.PesoxSaco = '22.68';
    }else  if (this.PresentacionSelect=='1 Kg'){
      movimiento.PesoxSaco = '1';
    }else{
      movimiento.PesoxSaco = '25';
    }
    movimiento.SacosTotales = (+movimiento.PesoTotal / +movimiento.PesoxSaco).toFixed(4);
    movimiento.Lote = this.Lote;
    movimiento.Bodega = this.bodegaSelect;
    movimiento.FechaMFG = new Date(this.FechaMFG)
    movimiento.FechaCaducidad = new Date(this.FechaCaducidad)

    console.log(movimiento);

    let consulta = {
      'consulta':"insert into detalletarima output inserted.* values ('"+movimiento.ClaveProducto+"','"+movimiento.Producto+"','"+movimiento.SacosTotales+"','"+movimiento.PesoxSaco+"','"+movimiento.Lote+"','"+movimiento.PesoTotal+"','"+movimiento.SacosxTarima+"','"+movimiento.TarimasTotales+"','"+movimiento.Bodega+"',"+movimiento.IdProveedor+",'"+movimiento.Proveedor+"','"+movimiento.PO+"','"+movimiento.FechaMFG.toISOString()+"','"+movimiento.FechaCaducidad.toISOString()+"','"+movimiento.Shipper+"','"+movimiento.USDA+"','"+movimiento.Pedimento+"','"+movimiento.Estatus+"');"
    };

    console.log(consulta);
    this.serviceTarima.generarConsulta(consulta).subscribe(data=>{
      console.log(data);
      let tmp = Object.assign({}, data[0]);
      this.productosAgregados.push(tmp)

      Swal.fire({
        icon: 'success',
        title: 'Producto Agregado',
        text: ''+movimiento.Producto+'',
        timer: 1500
      })
      this.llenarTabla();
      this.limpiarCampos();
    })
     
      }

    })


    






  }


  llenarTabla(){
    this.listData = new MatTableDataSource(this.productosAgregados);
  }

  limpiarCampos(){

    this.ProductoSelect = '';
    this.MarcaSelect = '';
    this.OrigenSelect = '';
    this.PresentacionSelect = '';
    this.serviceTarima.formProd = new Producto();
    this.Lote = '';
    this.FechaCaducidad = new Date();
    this.FechaMFG = new Date();
    this.PesoTotal = '';

   

  }

  onEdit(row){
    console.log(row);
  
  }

  onDelete(row){
    console.log(row);

    console.log();

  


    Swal.fire({
      title: '¿Seguro de Borrar el Producto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {

        let consulta = {
          'consulta':"delete from detalletarima where iddetalletarima="+row.IdDetalleTarima
        };
    
        console.log(consulta);
        this.serviceTarima.generarConsulta(consulta).subscribe(data=>{
          console.log(data);

          let i = this.productosAgregados.indexOf(row)
          if (i !== -1){
            this.productosAgregados.splice(i, 1)

          }

          this.llenarTabla();
         
        })
       
      }
    })

  }

  checarFechas(){

    let consulta = {
      'consulta':"select * from detalletarima where Producto='"+this.serviceTarima.formProd.DescripcionProducto+ "' and lote='"+this.Lote+"' and Bodega='"+this.bodegaSelect+"';"
    };

    console.log(consulta);
    this.serviceTarima.generarConsulta(consulta).subscribe((data:any)=>{

      if (data.length>0){

        this.FechaCaducidad = new Date(data[0].FechaCaducidad);
        this.FechaMFG = new Date(data[0].FechaMFG);

      }

    })

  }

  muestraMercancia(){

    let consulta = {
      'consulta':"select * from detalletarima where Producto='"+this.serviceTarima.formProd.DescripcionProducto+ "' and lote='"+this.Lote+"' and Bodega='"+this.bodegaSelect+"' and Estatus='Creada';"
    };

    console.log(consulta);
    this.serviceTarima.generarConsulta(consulta).subscribe((data:any)=>{
      console.log(data);

      if (data.length>0){

          let PesoNuevo = (+data[0].PesoTotal - +this.PesoTotal )

          let SacosTotales = (+PesoNuevo / +data[0].PesoxSaco).toFixed(4);
  
  
  
          let consulta2 = {
            'consulta':"update detalletarima set SacosTotales='"+SacosTotales+"', PesoTotal='"+PesoNuevo+"'  where Producto='"+this.serviceTarima.formProd.DescripcionProducto+ "' and lote='"+this.Lote+"' and Bodega='"+this.bodegaSelect+"' and Estatus='Creada';"
          };
  
          this.serviceTarima.generarConsulta(consulta2).subscribe((data2:any)=>{
            console.log(data2);


        let movimiento = data[0]

        
        //movimiento.ClaveProducto = this.serviceTarima.formProd.ClaveProducto + this.clavemarca + this.claveorigen;
        //movimiento.Producto = this.serviceTarima.formProd.DescripcionProducto;
        movimiento.PesoTotal = this.PesoTotal;
        if (this.PresentacionSelect=='25 Kg'){
          movimiento.PesoxSaco = '25';
        }else  if (this.PresentacionSelect=='50 Kg'){
          movimiento.PesoxSaco = '50';
        }else  if (this.PresentacionSelect=='1000 Kg'){
          movimiento.PesoxSaco = '1000';
        }else  if (this.PresentacionSelect=='22.68 Lb'){
          movimiento.PesoxSaco = '22.68';
        }else  if (this.PresentacionSelect=='1 Kg'){
          movimiento.PesoxSaco = '1';
        }else{
          movimiento.PesoxSaco = '25';
        }
        movimiento.SacosTotales = (+movimiento.PesoTotal / +movimiento.PesoxSaco).toFixed(4);
        movimiento.Estatus = 'Muestra'
        //movimiento.Lote = this.Lote;
        //movimiento.Bodega = this.bodegaSelect;
        //movimiento.FechaMFG = new Date(this.FechaMFG)
        //movimiento.FechaCaducidad = new Date(this.FechaCaducidad)



        let consulta = {
          'consulta':"insert into detalletarima output inserted.* values ('"+movimiento.ClaveProducto+"','"+movimiento.Producto+"','"+movimiento.SacosTotales+"','"+movimiento.PesoxSaco+"','"+movimiento.Lote+"','"+movimiento.PesoTotal+"','"+movimiento.SacosxTarima+"','"+movimiento.TarimasTotales+"','"+movimiento.Bodega+"',"+movimiento.IdProveedor+",'"+movimiento.Proveedor+"','"+movimiento.PO+"','"+movimiento.FechaMFG+"','"+movimiento.FechaCaducidad+"','"+movimiento.Shipper+"','"+movimiento.USDA+"','"+movimiento.Pedimento+"','"+movimiento.Estatus+"');"
        };

        this.serviceTarima.generarConsulta(consulta).subscribe(res=>{

        })
            
            this.eventosService.movimientos('Muestra de Mercancia')
            if (data2.length==0){
  
              Swal.fire({
                icon: 'success',
                title: 'Producto Actualizado',
                text: ''+this.serviceTarima.formProd.DescripcionProducto+'',
                timer: 1500
              })
            }
  
          }) 


        




    /*    */


      }else{
        Swal.fire({
          text: 'Producto No Existe en el Inventario',
          icon: 'error'
        });
      }

    })

  }

  mermaMercancia(){

    let consulta = {
      'consulta':"select * from detalletarima where Producto='"+this.serviceTarima.formProd.DescripcionProducto+ "' and lote='"+this.Lote+"' and Bodega='"+this.bodegaSelect+"' and Estatus='Creada';"
    };

    console.log(consulta);
    this.serviceTarima.generarConsulta(consulta).subscribe((data:any)=>{
      console.log(data);

      if (data.length>0){

          let PesoNuevo = (+data[0].PesoTotal - +this.PesoTotal )

          let SacosTotales = (+PesoNuevo / +data[0].PesoxSaco).toFixed(4);
  
  
  
          let consulta2 = {
            'consulta':"update detalletarima set SacosTotales='"+SacosTotales+"', PesoTotal='"+PesoNuevo+"'  where Producto='"+this.serviceTarima.formProd.DescripcionProducto+ "' and lote='"+this.Lote+"' and Bodega='"+this.bodegaSelect+"' and Estatus='Creada';"
          };
  
          this.serviceTarima.generarConsulta(consulta2).subscribe((data2:any)=>{
            console.log(data2);


        let movimiento = data[0]

        
        //movimiento.ClaveProducto = this.serviceTarima.formProd.ClaveProducto + this.clavemarca + this.claveorigen;
        //movimiento.Producto = this.serviceTarima.formProd.DescripcionProducto;
        movimiento.PesoTotal = this.PesoTotal;
        if (this.PresentacionSelect=='25 Kg'){
          movimiento.PesoxSaco = '25';
        }else  if (this.PresentacionSelect=='50 Kg'){
          movimiento.PesoxSaco = '50';
        }else  if (this.PresentacionSelect=='1000 Kg'){
          movimiento.PesoxSaco = '1000';
        }else  if (this.PresentacionSelect=='22.68 Lb'){
          movimiento.PesoxSaco = '22.68';
        }else  if (this.PresentacionSelect=='1 Kg'){
          movimiento.PesoxSaco = '1';
        }else{
          movimiento.PesoxSaco = '25';
        }
        movimiento.SacosTotales = (+movimiento.PesoTotal / +movimiento.PesoxSaco).toFixed(4);
        movimiento.Estatus = 'Merma'
        //movimiento.Lote = this.Lote;
        //movimiento.Bodega = this.bodegaSelect;
        //movimiento.FechaMFG = new Date(this.FechaMFG)
        //movimiento.FechaCaducidad = new Date(this.FechaCaducidad)



        let consulta = {
          'consulta':"insert into detalletarima output inserted.* values ('"+movimiento.ClaveProducto+"','"+movimiento.Producto+"','"+movimiento.SacosTotales+"','"+movimiento.PesoxSaco+"','"+movimiento.Lote+"','"+movimiento.PesoTotal+"','"+movimiento.SacosxTarima+"','"+movimiento.TarimasTotales+"','"+movimiento.Bodega+"',"+movimiento.IdProveedor+",'"+movimiento.Proveedor+"','"+movimiento.PO+"','"+movimiento.FechaMFG+"','"+movimiento.FechaCaducidad+"','"+movimiento.Shipper+"','"+movimiento.USDA+"','"+movimiento.Pedimento+"','"+movimiento.Estatus+"');"
        };

        this.serviceTarima.generarConsulta(consulta).subscribe(res=>{

        })
            
            this.eventosService.movimientos('Muestra de Mercancia')
            if (data2.length==0){
  
              Swal.fire({
                icon: 'success',
                title: 'Producto Actualizado',
                text: ''+this.serviceTarima.formProd.DescripcionProducto+'',
                timer: 1500
              })
            }
  
          }) 


        




    /*    */


      }else{
        Swal.fire({
          text: 'Producto No Existe en el Inventario',
          icon: 'error'
        });
      }

    })

  }



}
