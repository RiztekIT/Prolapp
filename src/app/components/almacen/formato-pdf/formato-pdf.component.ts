import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { startWith, map } from 'rxjs/operators';
import { MatTableDataSource, MatSort, MatPaginator, MatDialogConfig, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { OrdenDescargaService } from '../../../services/almacen/orden-descarga/orden-descarga.service';
import { OrdenCargaService } from '../../../services/almacen/orden-carga/orden-carga.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formato-pdf',
  templateUrl: './formato-pdf.component.html',
  styleUrls: ['./formato-pdf.component.css']
})
export class FormatoPDFComponent implements OnInit {


  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['ClaveProducto', 'Producto', 'Lote', 'Sacos', 'PesoTotal', 'SacosTarima', 'Tarimas', 'Options'];
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(@Inject(MAT_DIALOG_DATA) public dataComponente: any, public odService: OrdenDescargaService, public ocService: OrdenCargaService) { }

  ngOnInit() {
    this.IdOrden = this.dataComponente.IdOrden;
    console.log('%c%s', 'color: #e5de73', this.IdOrden);
    this.tipoOrden = this.dataComponente.Tipo;
    console.log('%c%s', 'color: #33cc99', this.tipoOrden);
    this.dataDetalles();
  }

  IdOrden: number;
  tipoOrden: string = "";
  arregloDetalles: any = [];

  //^Obtener Detalles de la Orden
  dataDetalles() {
    if (this.tipoOrden == 'OrdenDescarga') {
      this.odService.getOrdenDescargaIDList(this.IdOrden).subscribe(resOD => {
        this.arregloDetalles = resOD;
        resOD.forEach((element, i) => {
          let kg = ((+element.Sacos) * (+element.PesoxSaco))
          this.arregloDetalles[i].PesoTotal = kg;
          this.arregloDetalles[i].Tarimas = +this.arregloDetalles[i].Sacos / +this.arregloDetalles[i].USDA
        });
        this.listData = new MatTableDataSource(this.arregloDetalles);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
        this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
      })
    } else if (this.tipoOrden == 'OrdenCarga') {
      this.ocService.getOrdenCargaIDList(this.IdOrden).subscribe(resOC => {
        console.log('%c⧭', 'color: #73998c', resOC);
        this.arregloDetalles = resOC;
        resOC.forEach((element, i) => {
          let kg = ((+element.Sacos) * (+element.PesoxSaco))
          this.arregloDetalles[i].PesoTotal = kg;
          this.arregloDetalles[i].Tarimas = +this.arregloDetalles[i].Sacos / +this.arregloDetalles[i].USDA
        });
        this.listData = new MatTableDataSource(this.arregloDetalles);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
        this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
      })
    }
  }


  //^ Metodo para establecer el numero de tarimas de x Producto
  asignarTarimas(detalleOrden: any) {
    console.log('%c⧭', 'color: #ffa280', detalleOrden);
    let tarimasT = +detalleOrden.Sacos / +detalleOrden.USDA
    Swal.fire({
      title: 'Ingresar Sacos por Tarima',
      icon: 'info',      
      text: 'Tarimas Totales: '+tarimasT,
      input: 'number',
      inputValue: tarimasT.toString(),      
      /* inputValue: detalleOrden.USDA,       */
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      
    }).then((result) => {
      console.log(result);
      if(result.value){
        detalleOrden.USDA = result.value
       tarimasT = +detalleOrden.Sacos / +detalleOrden.USDA
        //^ Actualizamos Detalle con la informacion ingresada
        this.updateDetalle(detalleOrden);
      }
    })
  }

  //^ Metodo para actualizar el detalle de la orden
  updateDetalle(detalle) {
    console.log('%c⧭', 'color: #eeff00', detalle);
    if (this.tipoOrden == 'OrdenDescarga') {
      console.log('Actualizar OD');
      this.odService.OnEditDetalleOrdenDescarga(detalle).subscribe(resODupdate => {
        console.log(resODupdate);
        this.dataDetalles();
      })
    } else if (this.tipoOrden == 'OrdenCarga') {
      console.log('Actualizar OC');
      this.ocService.updateDetalleOrdenCarga(detalle).subscribe(resOCupdate => {
        console.log(resOCupdate);
        this.dataDetalles();
      })
    }
  }

}
