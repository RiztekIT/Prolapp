import { Component, OnInit, ViewChild } from '@angular/core';
import { OrdenTemporalService } from '../../services/almacen/orden-temporal/orden-temporal.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';


@Component({
  selector: 'app-tracking-pedido',
  templateUrl: './tracking-pedido.component.html',
  styles: []
})
export class TrackingPedidoComponent implements OnInit {


  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(public ordenTemporalService: OrdenTemporalService) { 
 
  }

  fecha1;
  fecha2;
  displayedColumns: string[] = ['Folio','Origen', 'Destino', 'Estatus','Fecha'];
  listData: MatTableDataSource<any>;

  private intervalUpdate: any = null;

  ngOnInit() {
  
  /*   this.ordenTemporalService.listen().subscribe((m:any)=>{
      console.log(m);
      this.getPedidos()
      this.listData.connect();
      }); */

      this.fecha1 = new Date();
      this.fecha2 = new Date();
      this.fecha2.setDate(this.fecha1.getDate() + 1)
      

      this.intervalUpdate = setInterval(function(){
        this.getPedidos();
       }.bind(this), 500);
  }


getPedidos(){


  /* this.listData = new MatTableDataSource(); */
  
    let fecha1;
    let fecha2;
  
    //fecha1 = this.fecha1;
    //fecha2 = this.data.fecha2;


/*     this.fecha1 = this.sharedService.fecha1
    this.fecha2 = this.sharedService.fecha2 */

    let dia = this.fecha1.getDate();
    let mes = this.fecha1.getMonth() + 1;
    let anio = this.fecha1.getFullYear();
    fecha1 = anio + '-' + mes + '-' + dia
    
    let dia2 = this.fecha2.getDate();
    let mes2 = this.fecha2.getMonth() + 1;
    let anio2 = this.fecha2.getFullYear();
    fecha2 = anio2 + '-' + mes2 + '-' + dia2

    this.ordenTemporalService.GetTracking(fecha1,fecha2).subscribe(data=>{
      
      
      console.log(data);
      
      this.listData = new MatTableDataSource(data);
                this.listData.sort = this.sort;
                this.listData.paginator = this.paginator;
                this.listData.paginator._intl.itemsPerPageLabel = 'Pedidos por Pagina';
    })
  }

  private ngOnDestroy(): void {
    clearInterval(this.intervalUpdate);
   }



}
