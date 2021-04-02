import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatTable, MatDialog, MatSnackBar, MatDialogConfig } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { DocumentosImportacionService } from '../../../services/importacion/documentos-importacion.service';


@Component({
  selector: 'app-documentacion-compras-importacion',
  templateUrl: './documentacion-compras-importacion.component.html',
  styleUrls: ['./documentacion-compras-importacion.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DocumentacionComprasImportacionComponent implements OnInit {

  
  constructor(public router: Router, public documentosService: DocumentosImportacionService) { }

  ngOnInit() {
    // this.obtenerOrdenDescargaDocumentos();
  }

  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Folio', 'PO', 'Proveedor', 'SacosTotales', 'PesoTotal', 'FechaEntrega', 'Options'];
  // displayedColumnsVersion: string[] = ['ClaveProducto', 'Cantidad', 'PesoxSaco', 'Documentos'];
  displayedColumnsVersion: string[] = ['ClaveProducto', 'Cantidad', 'PesoxSaco'];
  expandedElement: any;
  detalle = new Array<any>();
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  arrOrdenDescarga: any;

 

  //Obtiene Ordenes Descargadas.
  obtenerOrdenDescargaDocumentos() {
  this.documentosService.getComprasTerminadas().subscribe(data => {
      // console.log(data);
      this.documentosService.master = []
      if (data.length > 0) {
        // console.log('Si hay datos');
        // let detalleOrdenDescarga = new Array<any>();
        for (let i = 0; i <= data.length - 1; i++) {
          this.documentosService.master[i] = data[i];
          this.documentosService.master[i].detalleDocumento = [];

          this.documentosService.getDetalleCompraId(data[i].IdCompra).subscribe(dataOD => {
            // console.log(dataOD);
            // detalleOrdenDescarga = dataOD;
            dataOD.forEach(element => {
              // console.log(l);
              // console.log( detalleOrdenDescarga[l]);
              // let joinDescargaDocumento = dataOD[l];
              let joinDescargaDocumento = element;
              // console.log(detalleOrdenDescarga[l]);
              // console.log(element);
              //  this.documentosService.getJoinDcD(element.IdDetalleCompra, element.ClaveProducto).subscribe(dataJoin => {
              //   console.log(dataJoin);
              //   console.log(joinDescargaDocumento);
              //   if (dataJoin.length > 0) {
              //     joinDescargaDocumento.Documento = true;
              //     joinDescargaDocumento.Vigencia = dataJoin[0].Vigencia;
              //     console.log('si hay documento');
              //   } else {
              //     joinDescargaDocumento.Documento = false;
              //     console.log('no hay documento');
              //   }
                this.documentosService.master[i].detalleDocumento.push(joinDescargaDocumento);
                this.listData = new MatTableDataSource(this.documentosService.master);
                this.listData.sort = this.sort;
                // this.listData.paginator = this.paginator;
                //         // console.log(this.documentosService.master);
              // })
          });
          })
        }
      } else {
        this.listData = new MatTableDataSource(this.documentosService.master);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
      }
      // console.log(this.documentosService.master);

      // this.listData.paginator._intl.itemsPerPageLabel = 'Compras por Pagina';
    })
  }

  //puede llegar como parametro el idDetalleOrdenDescarga
  accederDocumentos(folio?: number) {
    // console.log(folio);
    if (folio) {
      this.documentosService.folioCompras = folio;
    } else if(folio == 0) {
      this.documentosService.folioCompras = folio;

    }else{
      this.documentosService.folioCompras = null;
    }
    // console.log(this.documentosService.folioCompras);
    this.router.navigate(['/documentacion-formulario-compras-importacion']);
  }

  applyFilter(filtervalue: string) {
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();
  }

}
