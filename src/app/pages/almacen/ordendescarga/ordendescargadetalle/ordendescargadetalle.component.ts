import { Component, OnInit, ViewChild } from '@angular/core';
import { OrdenDescargaService } from 'src/app/services/almacen/orden-descarga/orden-descarga.service';
import { OrdenTemporalService } from 'src/app/services/almacen/orden-temporal/orden-temporal.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';



@Component({
  selector: 'app-ordendescargadetalle',
  templateUrl: './ordendescargadetalle.component.html',
  styleUrls: ['./ordendescargadetalle.component.css']
})
export class OrdendescargadetalleComponent implements OnInit {
  //Id Orden Carga
  IdOrdenDescarga: number;
  constructor(private service: OrdenDescargaService, public ordenTemporalService: OrdenTemporalService, ) {

    this.ordenTemporalService.listenOrdenTemporal().subscribe((m: any) => {
      this.actualizarTablaOrdenTemporal();
    });
  }

  // Tabla Orden Temporal
  listDataOrdenTemporal: MatTableDataSource<any>;
  displayedColumnsOrdenTemporal: string[] = ['QR', 'ClaveProducto', 'Producto', 'Lote', 'Sacos', 'PesoTotal', 'FechaCaducidad', 'Comentarios', 'Options'];
  @ViewChild(MatSort, null) sortOrdenTemporal: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginatorOrdenTemporal: MatPaginator;


  ngOnInit() {
    this.IdOrdenDescarga = +(localStorage.getItem('IdOrdenDescarga'));
    this.actualizarTablaOrdenTemporal();
    console.log(this.service.formData);
    console.log(localStorage.getItem('IdOrdenDescarga'));
  }

  actualizarTablaOrdenTemporal() {
    this.ordenTemporalService.GetOrdenTemporalIDOD(this.IdOrdenDescarga).subscribe(dataOrdenTemporal => {
      console.log(dataOrdenTemporal);
      if (dataOrdenTemporal.length > 0) {
        console.log('Si hay Movimientos en esta orden de carga');
        this.listDataOrdenTemporal = new MatTableDataSource(dataOrdenTemporal);
        this.listDataOrdenTemporal.sort = this.sortOrdenTemporal;
        this.listDataOrdenTemporal.paginator = this.paginatorOrdenTemporal;
        this.listDataOrdenTemporal.paginator._intl.itemsPerPageLabel = 'Conceptos por Pagina';
      } else {
        console.log('No hay Movimientos en esta orden de carga');
        this.listDataOrdenTemporal = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporal);
        // this.listDataOrdenTemporal.sort = this.sortOrdenTemporal;
        // this.listDataOrdenTemporal.paginator = this.paginatorOrdenTemporal;
        // this.listDataOrdenTemporal.paginator._intl.itemsPerPageLabel = 'Conceptos por Pagina';
      }
    })
  }

  nuevaTarima(){
    
  }








}


