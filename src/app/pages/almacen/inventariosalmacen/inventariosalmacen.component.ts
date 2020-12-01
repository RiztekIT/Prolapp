import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogConfig, MatDialog } from '@angular/material';
import { TarimaService } from 'src/app/services/almacen/tarima/tarima.service';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { DocumentosComponent } from './documentos/documentos.component';
import { BodegasService } from '../../../services/catalogos/bodegas.service';
import { Bodega } from '../../../Models/catalogos/bodegas-model';

@Component({
  selector: 'app-inventariosalmacen',
  templateUrl: './inventariosalmacen.component.html',
  styleUrls: ['./inventariosalmacen.component.css'],
  animations: [
    /* Trigger para tabla con detalles, cambio de estado colapsado y expandido y sus estilis */
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0px', visibility: 'hidden'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class InventariosalmacenComponent implements OnInit {

  constructor(public serviceTarima: TarimaService, private dialog: MatDialog,
    private bodegaservice: BodegasService) { 
   
  }
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  listData: MatTableDataSource<any>;
  
  displayedColumns: string[] = ['Clave','Producto', 'PesoTotal','PesoDisponible'];

  master;
  expandedElement: any;
  bodegaSelect;
  

  public listBodega: Array<any> = [];
  
  
  
  ngOnInit() {
    this.getbodegas()
    this.bodegaSelect = 'PasoTx';
    this.obtenerProductos(this.bodegaSelect)
  }
  
  applyFilter(filtervalue: string) {
    this.listData.filterPredicate = (data, filter: string) => {
      return data.Producto.toString().toLowerCase().includes(filter) || data.ClaveProducto.toString().includes(filter);
    };
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();

  }
  
  applyFilter2(filtervalue: string) {
    this.listData.filterPredicate = (data, filter: string) => {
      return data.Bodega.toString().toLowerCase().includes(filter);
    };
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();
    
  }

  getbodegas(){
    this.bodegaservice.getBodegasList().subscribe(res => {
      console.clear();
      console.log(res);
      console.log(res[0].Origen);
      for (let i = 0; i <= res.length -1; i++) {
        let b = res[i].Origen
        this.listBodega.push(b)
      }

    })
  }

 /*  obtenerProductos(bodega){
    this.serviceTarima.master = [];
    let sacostotales;
    this.serviceTarima.getDetalleTarimaBodegaOrdenado(bodega).subscribe(dataDT=>{
      console.log(dataDT);
      this.listData = new MatTableDataSource(dataDT);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
    })
  } */
  
  obtenerProductos(bodega){
    let contador = 0;
    
    this.serviceTarima.master = [];
    let kgtotales;
    let kgdisponibles;
    
    this.serviceTarima.getProductos().subscribe((data:any)=>{
      console.log(data,'obtner tarimas');
      
      for (let l=0; l<data.length; l++){
        console.log(data[l].Nombre);
        
        this.serviceTarima.GetTarimaProducto(data[l].Nombre,bodega).subscribe(datadet =>{
          //this.master[contador] = []
          
          console.log(datadet);
          if (datadet.length>0){
            kgtotales = 0;
            kgdisponibles = 0;
            this.serviceTarima.master[contador] = data[l];
            //this.serviceTarima.master[contador].detalle = datadet;
            for (let i=0; i<datadet.length;i++){

              kgtotales = +kgtotales + (+datadet[i].SacosTotales* +datadet[i].PesoxSaco);
              kgdisponibles  = kgtotales;

              datadet[i].KgD = (+datadet[i].SacosTotales* +datadet[i].PesoxSaco);
              datadet[i].KgT = (+datadet[i].SacosTotales* +datadet[i].PesoxSaco);


              this.serviceTarima.GetTarimaProductoD(datadet[i].Producto,datadet[i].Lote).subscribe(datas=>{
                console.log(datas,'datas');
                // console.log(contador,'c2');
                // console.log(this.serviceTarima.master[contador],'2');
                // console.log(this.master[contador].detalle[j].SacosD,'2');
                // console.log(this.serviceTarima.master[contador].detalle[i].SacosD,'3');
                if (datas.length>0){

                  for (let d=0; d<datas.length;d++){

                    datadet[i].KgD = +datadet[i].KgD - (+datas[d].Sacos * +datadet[i].PesoxSaco)
                    kgdisponibles = kgdisponibles - datadet[i].KgD
                    
                  }
                  



                }else{
                  datadet[i].KgD = datadet[i].KgD
                }
              }) 


            }

            this.serviceTarima.master[contador].detalle = datadet;
            this.serviceTarima.master[contador].Stock = kgtotales;

            /* for (let n=0; n<this.serviceTarima.master[contador].detalle.length;n++){
              kgdisponibles = +kgdisponibles + this.serviceTarima.master[contador].detalle[n].KgD;
              console.log(kgdisponibles,'KG');

            } */
            this.serviceTarima.master[contador].StockD = kgdisponibles;
            
            

           /*  for (let j=0; j<datadet.length;j++ ){

              this.serviceTarima.master[contador].detalle[j].SacosD = this.serviceTarima.master[contador].detalle[j].Sacos;
              



            } */
            // console.log(this.master[contador].detalle,'1'); 

          /*   */
            
         /*    for (let i:0; i< datadet.length;i++){
              this.master[contador].detalle[i].push(datadet[i]);
            } */
            contador++;
          }

          

          
                console.log(this.serviceTarima.master);
                this.listData = new MatTableDataSource(this.serviceTarima.master);
                this.listData.sort = this.sort;
                this.listData.paginator = this.paginator;
                this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
        })

      }

      


              // console.log(contador,'c1');
            /*   */

    

      //this.applyFilter2('PasoTx');
      
    })
    // for (let m=0; m<this.serviceTarima.master.length;m++){
    //   for(let d=0;d<this.serviceTarima.master[m].detalle.length;d++){
       

    //   }
    // }

    // console.log(this.serviceTarima.master,'m1');

  }

  disponibles(producto){

    let kgdisponibles = 0;

    for (let n=0; n<producto.detalle.length;n++){
      kgdisponibles = +kgdisponibles + +producto.detalle[n].KgD;
      // console.log(kgdisponibles,'KG');

    } 

    return kgdisponibles;

  }

  bodegaCambio(event){
       // console.log(event);
this.bodegaSelect = event.value;
console.log(this.bodegaSelect);
this.obtenerProductos(this.bodegaSelect)


  }



  obtenerDocumentos(detalle){
    console.log(detalle);
    // this.serviceTarima.getTarimaCompra(detalle.IdTarima).subscribe(resp=>{
      // console.log('RESPUESTA',resp);

      this.serviceTarima.getJOINCompraDetalleTarima(detalle.IdDetalleTarima).subscribe(resp=>{
        console.log(resp);

        if (resp.length>0){

          this.serviceTarima.compra = resp[0];


          //^ Metodo para obtener la informacion de los detalles de la compra. Se utilizara en el componente Documentos para obtener los documentos.
          this.serviceTarima.GetDetalleCompraIdClave(resp[0].IdCompra, resp[0].ClaveProducto).subscribe(res=>{
  
            this.serviceTarima.compra.IdDetalleCompra = res[0].IdDetalleCompra;
  
            const dialogConfig = new MatDialogConfig();
            dialogConfig.disableClose = false;
            dialogConfig.autoFocus = true;
            dialogConfig.width = "90%";
            
            
            let mercanciadl = this.dialog.open(DocumentosComponent, dialogConfig);
          }) 


        }
        
       
      })
    // })


  }

  obtenerDocumentos2(detalle){
    this.serviceTarima.getDetalleTarimaOT(detalle.IdDetalleTarima).subscribe(res=>{
      console.log(res);
      this.serviceTarima.detalleTarima = res[0];
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.width = "90%";
      
      
      let mercanciadl = this.dialog.open(DocumentosComponent, dialogConfig);
    })

  }

}

