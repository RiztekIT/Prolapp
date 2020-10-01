import { Component, OnInit, ViewChild } from '@angular/core';

import {MatTableDataSource, MatPaginator, MatTable, MatDialog, MatSnackBar, MatDialogConfig} from '@angular/material';
import {MatSort} from '@angular/material/sort';
import { OrdenCargaService } from 'src/app/services/almacen/orden-carga/orden-carga.service';
import { OrdenCarga } from '../../../Models/almacen/OrdenCarga/ordencarga.model';
import { Router } from '@angular/router';
import { stringify } from 'querystring';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import Swal from 'sweetalert2';
import { DetalleOrdenCarga } from '../../../Models/almacen/OrdenCarga/detalleOrdenCarga-model';
import { Observable, Subscriber } from 'rxjs';
import { OrdenCargaComponent } from 'src/app/components/almacen/orden-carga/orden-carga.component';

@Component({
  selector: 'app-pedidosalmacen',
  templateUrl: './pedidosalmacen.component.html',
  styleUrls: ['./pedidosalmacen.component.css'],
  animations: [
    trigger('detailExpand', [
      // state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),  
  ],
})
export class PedidosalmacenComponent implements OnInit {

  // INICIO VARIABLES TABLA ORDEN CARGA
  listData: MatTableDataSource<any>;
  displayedColumns: string [] = ['Folio', 'FechaEnvio', 'Cliente', 'IdPedido', 'Fletera', 'Caja',  'Origen' , 'Destino', 'Estatus', 'Options'];
  displayedColumnsVersion: string[] = ['ClaveProducto', 'Producto', 'Sacos', 'Lote'];
  expandedElement: any;
  detalle = new Array<DetalleOrdenCarga>();
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


 arrOrdenCarga: any;
 estatusSelect;

// FIN VARIABLES TABLA ORDEN CARGA

  constructor(public router: Router,private service:OrdenCargaService, private dialog: MatDialog) {

    this.service.listen().subscribe((m:any)=>{
      console.log(m);
      this.refreshOrdenCargaList();
      });

   }

  ngOnInit() {

    this.refreshOrdenCargaList();
    
  }

  estatusCambio(event){
    // console.log(event);
this.estatusSelect = event.value;
console.log(this.estatusSelect);
if (this.estatusSelect==='Todos'){
  this.applyFilter2('')
}else {

  this.applyFilter2(this.estatusSelect)
}

  }


  public listEstatus: Array<Object> = [
    { Estatus: 'Todos' },
    { Estatus: 'Creada' },
    { Estatus: 'Preparada' },
    { Estatus: 'Cargada' },    
    { Estatus: 'Terminada' },        
  ];

  applyFilter2(filtervalue: string) {
    this.listData.filterPredicate = (data, filter: string) => {
      return data.Estatus.toString().toLowerCase().includes(filter);
    };
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();

  }

  refreshOrdenCargaList(){
this.arrOrdenCarga = this.service.getOrdenCargaList();
this.arrOrdenCarga.subscribe(data =>{
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
    this.listData = new MatTableDataSource(data);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    this.listData.paginator._intl.itemsPerPageLabel = 'Ordenes de Carga por Pagina';
})
    // this.service.getOrdenCargaList().subscribe(data => {
    //   console.log(data);
      
    // });
  }

  onEdit(ordencarga: OrdenCarga){
    console.log(ordencarga)
    localStorage.setItem('IdOrdenCarga', ordencarga.IdOrdenCarga.toString())
    localStorage.setItem('OrdenCarga', JSON.stringify(ordencarga.IdOrdenCarga))
    this.router.navigate(['/ordencargadetalle']);
  }

  applyFilter(filtervalue: string){  
    this.listData.filter= filtervalue.trim().toLocaleLowerCase();  
  }

///////////////////////////////// MODALES /////////////////////////////////////////////
openrep(row){

  this.service.formrow = row;
  console.log(row);
  console.log(this.service.formrow);
  // this.service.formrow = row;
  // console.log();
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = false;
  dialogConfig.autoFocus = true;
  dialogConfig.width="70%";
  this.dialog.open(OrdenCargaComponent, dialogConfig);
}

/////////////////////////////// Fin Modales //////////////////////////////////////////

}