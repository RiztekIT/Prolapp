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
import { OrdenSalidaComponent } from 'src/app/components/almacen/orden-salida/orden-salida.component';
import { OrdenDescarga } from '../../../Models/almacen/OrdenDescarga/ordenDescarga-model';
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

  arrOrdenDescarga: any;

  constructor(public router: Router,private service:OrdenDescargaService, private dialog: MatDialog) {
    this.service.listen().subscribe((m:any)=>{
      console.log(m);
      this.refreshOrdenDescargaList();
      });
   }

  ngOnInit() {
    this.refreshOrdenDescargaList();
  }

  


  refreshOrdenDescargaList(){
    this.arrOrdenDescarga = this.service.getOrdenDescargaList();
    this.arrOrdenDescarga.subscribe(data =>{
    console.log(data);
      for (let i = 0; i <= data.length - 1; i++) {
        this.service.master[i] = data[i];
        this.service.master[i].detalleOrdenDescarga = [];
        this.service.getOrdenDescargaIDList(data[i].IdOrdenDescarga).subscribe(res => {
          console.log(res);
          for (let l = 0; l <= res.length - 1; l++) {
            this.service.master[i].detalleOrdenDescarga.push(res[l]); 
          }
        });
      }
      console.log(this.service.master);
        this.listData = new MatTableDataSource(data);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
        this.listData.paginator._intl.itemsPerPageLabel = 'Ordenes de Descarga por Pagina';
    })
        // this.service.getOrdenCargaList().subscribe(data => {
        //   console.log(data);
          
        // });
      }
      applyFilter(filtervalue: string){  
        this.listData.filter= filtervalue.trim().toLocaleLowerCase();  
      }

      openrep(row){

        this.service.formrow = row;
        console.log(this.service.formrow);
        // this.service.formrow = row;
        // console.log();
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width="70%";
        this.dialog.open(OrdenSalidaComponent, dialogConfig);
      }
}
