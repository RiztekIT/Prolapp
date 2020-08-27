import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogConfig } from '@angular/material';
import { DetalleOrdenCarga } from 'src/app/Models/almacen/OrdenCarga/detalleOrdenCarga-model';
import { OrdenCargaService } from 'src/app/services/almacen/orden-carga/orden-carga.service';
import { OrdenDescargaService } from '../../../services/almacen/orden-descarga/orden-descarga.service';
import { DetalleOrdenDescarga } from 'src/app/Models/almacen/OrdenDescarga/detalleOrdenDescarga-model';
import { Router } from '@angular/router';
import { OrdenCarga } from 'src/app/Models/almacen/OrdenCarga/ordencarga.model';
import { OrdenDescarga } from 'src/app/Models/almacen/OrdenDescarga/ordenDescarga-model';

@Component({
  selector: 'app-evidencias',
  templateUrl: './evidencias.component.html',
  styleUrls: ['./evidencias.component.css'],
  animations: [
    trigger('detailExpand', [
      // state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EvidenciasComponent implements OnInit {

  // INICIO VARIABLES TABLA ORDEN CARGA
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Folio', 'FechaEnvio', 'Cliente', 'IdPedido', 'Fletera', 'Caja', 'Origen', 'Destino', 'Estatus', 'Options'];
  displayedColumnsVersion: string[] = ['ClaveProducto', 'Producto', 'Sacos', 'Lote'];
  expandedElement: any;
  detalle = new Array<DetalleOrdenCarga>();
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  

  arrOrdenCarga: any;

  estatusSelect;
  toggletype: string;

  // FIN VARIABLES TABLA ORDEN CARGA

  // INICIO VARIABLES TABLA ORDEN DESCARGA

  listDatad: MatTableDataSource<any>;
  //displayedColumns: string[] = ['Folio', 'FechaLlegada', 'Proveedor', 'PO', 'Fletera', 'Caja', 'Sacos', 'Kg', 'Origen', 'Destino', 'Estatus', 'Options'];
  displayedColumnsd: string[] = ['Folio', 'PO', 'FechaLlegada', 'Proveedor', 'Fletera', 'Origen', 'Destino', 'Estatus', 'Options'];
  displayedColumnsVersiond: string[] = ['ClaveProducto', 'Producto', 'Sacos', 'Lote', '', '', '', '', ''];
  expandedElementd: any;
  detalled = new Array<DetalleOrdenDescarga>();
  isExpansionDetailRowd = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  @ViewChild(MatSort, null) sortd: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginatord: MatPaginator;

  arrOrdenDescarga: any;
  estatusSelectd;
  
  show: boolean;


  // FIN VARIABLES TABLA ORDEN DESCARGA

  constructor(public router: Router, private service: OrdenCargaService, private Ordendescargaservice: OrdenDescargaService, private dialog: MatDialog,) {

    this.service.listen().subscribe((m: any) => {
      console.log(m);
      this.refreshOrdenCargaList();
    });

    this.Ordendescargaservice.listen().subscribe((m: any) => {
      console.log(m);
      this.refreshOrdenDescargaList();
    });

  }



  ngOnInit() {

    this.show = false;
    this.toggletype = "Orden de Carga";
    this.refreshOrdenCargaList();
    this.refreshOrdenDescargaList(); 

  }

  refreshOrdenCargaList() {
    this.arrOrdenCarga = this.service.getOrdenCargaList();
    this.listData = new MatTableDataSource();
    
    this.arrOrdenCarga.subscribe(data => {
      console.log(data);
      for (let i = 0; i <= data.length - 1; i++) {
        this.service.master[i] = data[i];
        this.service.master[i].detalleOrdenCarga = [];
        this.service.getOrdenCargaIDList(data[i].IdOrdenCarga).subscribe(res => {
          console.log(res);
          for (let l = 0; l <= res.length - 1; l++) {
            this.service.master[i].detalleOrdenCarga.push(res[l]);
          }
          
        });
      }
      
      console.log(this.service.master);
      this.listData = new MatTableDataSource(this.service.master);
      console.log(this.listData);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Ordenes de Carga por Pagina'
      //this.listData.paginator._intl.itemsPerPageLabel = 'Ordenes de Carga por Pagina';
    })
    // this.service.getOrdenCargaList().subscribe(data => {
    //   console.log(data);

    // });
  }

  applyFilter(filtervalue: string) {
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();
  }

  estatusCambio(event) {
    // console.log(event);
    this.estatusSelect = event.value;
    console.log(this.estatusSelect);
    if (this.estatusSelect === 'Todos') {
      this.applyFilter2('')
    } else {

      this.applyFilter2(this.estatusSelect)
    }

  }

  applyFilter2(filtervalue: string) {
    this.listData.filterPredicate = (data, filter: string) => {
      return data.Estatus.toString().toLowerCase().includes(filter);
    };
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();

  }

  public listEstatus: Array<Object> = [
    { Estatus: 'Todos' },
    { Estatus: 'Guardada' },
    { Estatus: 'Descargada' },
    { Estatus: 'Proceso' },
    { Estatus: 'Transito' }
  ];

  openOC(ordencarga: OrdenCarga){

    console.log(ordencarga)
    localStorage.setItem('evidenciaOC', ordencarga.IdOrdenCarga.toString())
    this.router.navigate(['/evidenciasoc']);
  }

  // TERMINA TABLA DE ORDEN CARGA












  estatusCambiod(eventd) {
    // console.log(event);
    this.estatusSelectd = eventd.value;
    console.log(this.estatusSelectd);
    if (this.estatusSelectd === 'Todos') {
      this.applyFilter2d('')
    } else {

      this.applyFilter2d(this.estatusSelectd)
    }

  }

  public listEstatusd: Array<Object> = [
    { Estatus: 'Todos' },
    { Estatus: 'Guardada' },
    { Estatus: 'Descargada' },
    { Estatus: 'Proceso' },
    { Estatus: 'Transito' }
  ];

  refreshOrdenDescargaList() {
    this.arrOrdenDescarga = this.Ordendescargaservice.getOrdenDescargaList();
    this.arrOrdenDescarga.subscribe(datad => {
      console.log(datad);
      for (let i = 0; i <= datad.length - 1; i++) {
        this.Ordendescargaservice.master[i] = datad[i];
        this.Ordendescargaservice.master[i].detalleOrdenDescarga = [];
        this.Ordendescargaservice.getOrdenDescargaIDList(datad[i].IdOrdenDescarga).subscribe(res => {
          console.log(res);
          for (let l = 0; l <= res.length - 1; l++) {
            this.Ordendescargaservice.master[i].detalleOrdenDescarga.push(res[l]);
          }
        });
      }
      console.log(this.Ordendescargaservice.master);
      this.listDatad = new MatTableDataSource(datad);
      this.listDatad.sort = this.sortd;
      this.listDatad.paginator = this.paginatord;
      this.listDatad.paginator._intl.itemsPerPageLabel = 'Ordenes de Descarga por Pagina';
    })
  }

  applyFilterd(filtervalued: string) {
    this.listDatad.filter = filtervalued.trim().toLocaleLowerCase();
  }

  applyFilter2d(filtervalued: string) {
    this.listDatad.filterPredicate = (datad, filterd: string) => {
      return datad.Estatus.toString().toLowerCase().includes(filterd);
    };
    this.listDatad.filter = filtervalued.trim().toLocaleLowerCase();

  }

  openOD(ordenDescarga: OrdenDescarga) {

    console.log(ordenDescarga)
    localStorage.setItem('evidenciaOD', ordenDescarga.IdOrdenDescarga.toString())
    this.router.navigate(['/evidenciasod']);
    // this.dialog.open(OrdenSalidaComponent, dialogConfig);
  }



  toggle() {

    this.show = !this.show;


    if (this.show){
      
      console.log('OD');
      this.toggletype= "Orden de Descarga"
      // localStorage.setItem('toggleTypeEvidencia',this.toggletype)
    }
    else{
      
      console.log('OC');
      this.toggletype= "Orden de Carga"
            // localStorage.setItem('toggleTypeEvidencia',this.toggletype)

                                  
    }
  }







}
