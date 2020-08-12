import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatPaginator, MatTable, MatDialog, MatSnackBar, MatDialogConfig} from '@angular/material';
import {MatSort} from '@angular/material/sort';
import { Router } from '@angular/router';
import { trigger, state, transition, animate, style } from '@angular/animations';
import Swal from 'sweetalert2';
import { Observable, Subscriber } from 'rxjs';
import { DocumentosImportacionService } from '../../../services/importacion/documentos-importacion.service';
import { DetalleOrdenDescarga } from '../../../Models/almacen/OrdenDescarga/detalleOrdenDescarga-model';

@Component({
  selector: 'app-documentacion-importacion',
  templateUrl: './documentacion-importacion.component.html',
  styleUrls: ['./documentacion-importacion.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),  
  ],
})
export class DocumentacionImportacionComponent implements OnInit {


  constructor(public router: Router, public documentosService:DocumentosImportacionService) { }

  ngOnInit() {
    this.obtenerOrdenDescargaDocumentos();
  }

  listData: MatTableDataSource<any>;
  displayedColumns: string [] = ['Folio', 'PO', 'Sacos', 'Fletera', 'Origen', 'FechaDescarga', 'Options'];
  displayedColumnsVersion: string[] = ['ClaveProducto', 'Sacos', 'Lote', 'USDA', 'Pedimento','Documentos'];
  expandedElement: any;
  detalle = new Array<any>();
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  arrOrdenDescarga: any;
  
  //Obtiene Ordenes Descargadas.
  obtenerOrdenDescargaDocumentos(){
    this.arrOrdenDescarga = this.documentosService.getOrdenesDescargadas();
    this.arrOrdenDescarga.subscribe(data =>{
    console.log(data);
    this.documentosService.master = []  
    if(data.length>0){
      console.log('Si hay datos');
      let detalleOrdenDescarga = new Array<any>();
      this.documentosService.getDetalleOrdenDescargaId(data[0].IdOrdenDescarga).subscribe(dataOD=>{
        console.log(dataOD);
        detalleOrdenDescarga = dataOD;
        console.log(detalleOrdenDescarga);
        for (let i = 0; i <= data.length - 1; i++) {
          this.documentosService.master[i] = data[i];
          this.documentosService.master[i].detalleDocumento = [];
          for (let l = 0; l <= detalleOrdenDescarga.length - 1; l++) {
            this.documentosService.getJoinDodD(detalleOrdenDescarga[l].IdDetalleOrdenDescarga, detalleOrdenDescarga[l].ClaveProducto).subscribe(dataJoin=>{
              console.log(dataJoin);
              let joinDescargaDocumento = detalleOrdenDescarga[l];
              if(dataJoin.length>0){
                joinDescargaDocumento.Documento= true;
              }else{
                joinDescargaDocumento.Documento = false;
              }
              this.documentosService.master[i].detalleDocumento.push(joinDescargaDocumento); 
              this.listData = new MatTableDataSource(this.documentosService.master);
              this.listData.sort = this.sort;
              this.listData.paginator = this.paginator;
              console.log(this.documentosService.master);
            })
          }
        }
      })
    }else{
      this.listData = new MatTableDataSource(this.documentosService.master);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    }
      console.log(this.documentosService.master);
             
        // this.listData.paginator._intl.itemsPerPageLabel = 'Compras por Pagina';
    })
      }

      applyFilter(filtervalue: string){  
        this.listData.filter= filtervalue.trim().toLocaleLowerCase();  
      }

}
