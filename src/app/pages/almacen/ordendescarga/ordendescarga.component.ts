import { Component, OnInit, ViewChild } from '@angular/core';

import {MatTableDataSource, MatPaginator, MatTable, MatDialog, MatSnackBar, MatDialogConfig} from '@angular/material';
import {MatSort} from '@angular/material/sort';
import { Router } from '@angular/router';
import { stringify } from 'querystring';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import Swal from 'sweetalert2';
import { Observable, Subscriber } from 'rxjs';
import { DetalleOrdenDescarga } from '../../../Models/almacen/OrdenDescarga/detalleOrdenDescarga-model';
import { OrdenDescargaService } from '../../../services/almacen/orden-descarga/orden-descarga.service';
@Component({
  selector: 'app-ordendescarga',
  templateUrl: './ordendescarga.component.html',
  styleUrls: ['./ordendescarga.component.css'],
  animations: [
    trigger('detailExpand', [
      // state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),  
  ],
})
export class OrdendescargaComponent implements OnInit {

  listData: MatTableDataSource<any>;
  displayedColumns: string [] = ['Folio', 'FechaEnvio', 'Cliente', 'IdPedido', 'Fletera', 'Caja', 'Sacos', 'Kg', 'Origen' , 'Destino', 'Estatus', 'Options'];
  displayedColumnsVersion: string[] = ['ClaveProducto', 'Producto', 'Sacos', 'Lote'];
  expandedElement: any;
  detalle = new Array<DetalleOrdenDescarga>();
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ArrOrdenDescarga: any;

  constructor(public router: Router,private service:OrdenDescargaService, private dialog: MatDialog) { }

  ngOnInit() {
    this.service.listen().subscribe((m:any)=>{
      console.log(m);
      this.refreshOrdenCargaList();
      });
  }

}
