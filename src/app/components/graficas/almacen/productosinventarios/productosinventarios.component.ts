import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { TarimaService } from 'src/app/services/almacen/tarima/tarima.service';
import { trigger, state, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-productosinventarios',
  templateUrl: './productosinventarios.component.html',
  styleUrls: ['./productosinventarios.component.css'],
  animations: [
    /* Trigger para tabla con detalles, cambio de estado colapsado y expandido y sus estilis */
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0px', visibility: 'hidden'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProductosinventariosComponent implements OnInit {

  constructor(public serviceTarima: TarimaService) { }

  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  listDataChihuahua: MatTableDataSource<any>;
  listDataPaso: MatTableDataSource<any>;
  listDataTransito: MatTableDataSource<any>;
  
  displayedColumns: string[] = ['Clave','Producto', 'Cantidad'];

  master;
  expandedElement: any;
  bodegaSelect;
  

  public listBodega: Array<Object> = [
    
    { Bodega: 'PasoTx' },
    { Bodega: 'Chihuahua' },
    { Bodega: 'Transito' },    
    
  ];
  
  

  ngOnInit() {
    this.bodegaSelect = 'PasoTx';
    this.obtenerProductosChihuahua('Chihuahua')
    this.obtenerProductosPaso('PasoTx')
    this.obtenerProductosTransito('Transito')
    
  }
/* 
  applyFilter(filtervalue: string) {
    this.listData.filterPredicate = (data, filter: string) => {
      return data.Nombre.toString().toLowerCase().includes(filter) || data.ClaveProducto.toString().includes(filter);
    };
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();

  }

  applyFilter2(filtervalue: string) {
    this.listData.filterPredicate = (data, filter: string) => {
      return data.Bodega.toString().toLowerCase().includes(filter);
    };
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();

  } */

  obtenerProductosChihuahua(bodega){
    let contador = 0;
    
    this.serviceTarima.master = [];
    let sacostotales;
    
    this.serviceTarima.getProductos().subscribe((data:any)=>{
      console.log(data,'obtner tarimas');

      for (let l=0; l<data.length; l++){
        console.log(data[l].Nombre);
        
        this.serviceTarima.GetTarimaProducto(data[l].Nombre,bodega).subscribe(datadet =>{
          //this.master[contador] = []
          
          console.log(datadet);
          if (datadet.length>0){
            sacostotales = 0;
            this.serviceTarima.master[contador] = data[l];

            for (let i=0; i<datadet.length;i++){

              sacostotales = sacostotales + +datadet[i].Sacos;

              datadet[i].SacosD = +datadet[i].Sacos;


              this.serviceTarima.GetTarimaProductoD(datadet[i].Producto,datadet[i].Lote).subscribe(datas=>{
                console.log(datas,'datas');

                if (datas.length>0){

                  for (let d=0; d<datas.length;d++){

                    datadet[i].SacosD = datadet[i].SacosD - +datas[d].Sacos
                  }

                }else{
                  datadet[i].SacosD = datadet[i].SacosD
                }
              }) 


            }
            this.serviceTarima.master[contador].detalle = datadet;
            this.serviceTarima.master[contador].Stock = sacostotales;
            

            contador++;
          }

          

          
                console.log(this.serviceTarima.master);
                this.listDataChihuahua = new MatTableDataSource(this.serviceTarima.master);
                this.listDataChihuahua.sort = this.sort;
                this.listDataChihuahua.paginator = this.paginator;
                this.listDataChihuahua.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
        })

      }

      


    })


  }
  obtenerProductosPaso(bodega){
    let contador = 0;
    
    this.serviceTarima.master = [];
    let sacostotales;
    
    this.serviceTarima.getProductos().subscribe((data:any)=>{
      console.log(data,'obtner tarimas');

      for (let l=0; l<data.length; l++){
        console.log(data[l].Nombre);
        
        this.serviceTarima.GetTarimaProducto(data[l].Nombre,bodega).subscribe(datadet =>{
          //this.master[contador] = []
          
          console.log(datadet);
          if (datadet.length>0){
            sacostotales = 0;
            this.serviceTarima.master[contador] = data[l];

            for (let i=0; i<datadet.length;i++){

              sacostotales = sacostotales + +datadet[i].Sacos;

              datadet[i].SacosD = +datadet[i].Sacos;


              this.serviceTarima.GetTarimaProductoD(datadet[i].Producto,datadet[i].Lote).subscribe(datas=>{
                console.log(datas,'datas');

                if (datas.length>0){

                  for (let d=0; d<datas.length;d++){

                    datadet[i].SacosD = datadet[i].SacosD - +datas[d].Sacos
                  }

                }else{
                  datadet[i].SacosD = datadet[i].SacosD
                }
              }) 


            }
            this.serviceTarima.master[contador].detalle = datadet;
            this.serviceTarima.master[contador].Stock = sacostotales;
            

            contador++;
          }

          

          
                console.log(this.serviceTarima.master);
                this.listDataPaso = new MatTableDataSource(this.serviceTarima.master);
                this.listDataPaso.sort = this.sort;
                this.listDataPaso.paginator = this.paginator;
                this.listDataPaso.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
        })

      }

      


    })


  }
  obtenerProductosTransito(bodega){
    let contador = 0;
    
    this.serviceTarima.master = [];
    let sacostotales;
    
    this.serviceTarima.getProductos().subscribe((data:any)=>{
      console.log(data,'obtner tarimas');

      for (let l=0; l<data.length; l++){
        console.log(data[l].Nombre);
        
        this.serviceTarima.GetTarimaProducto(data[l].Nombre,bodega).subscribe(datadet =>{
          //this.master[contador] = []
          
          console.log(datadet);
          if (datadet.length>0){
            sacostotales = 0;
            this.serviceTarima.master[contador] = data[l];

            for (let i=0; i<datadet.length;i++){

              sacostotales = sacostotales + +datadet[i].Sacos;

              datadet[i].SacosD = +datadet[i].Sacos;


              this.serviceTarima.GetTarimaProductoD(datadet[i].Producto,datadet[i].Lote).subscribe(datas=>{
                console.log(datas,'datas');

                if (datas.length>0){

                  for (let d=0; d<datas.length;d++){

                    datadet[i].SacosD = datadet[i].SacosD - +datas[d].Sacos
                  }

                }else{
                  datadet[i].SacosD = datadet[i].SacosD
                }
              }) 


            }
            this.serviceTarima.master[contador].detalle = datadet;
            this.serviceTarima.master[contador].Stock = sacostotales;
            

            contador++;
          }

          

          
                console.log(this.serviceTarima.master);
                this.listDataTransito = new MatTableDataSource(this.serviceTarima.master);
                this.listDataTransito.sort = this.sort;
                this.listDataTransito.paginator = this.paginator;
                this.listDataTransito.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
        })

      }

      


    })


  }

/*   bodegaCambio(event){
       // console.log(event);
this.bodegaSelect = event.value;
console.log(this.bodegaSelect);
this.obtenerProductos(this.bodegaSelect)


  } */

}

