import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatTable, MatDialog, MatSnackBar, MatDialogConfig } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { trigger, state, transition, animate, style } from '@angular/animations';
import Swal from 'sweetalert2';
import { Observable, Subscriber } from 'rxjs';
import { DocumentosImportacionService } from '../../../services/importacion/documentos-importacion.service';
import { DetalleOrdenDescarga } from '../../../Models/almacen/OrdenDescarga/detalleOrdenDescarga-model';
import { mergeMap, last, scan } from 'rxjs/operators';
import { TraspasoMercanciaService } from 'src/app/services/importacion/traspaso-mercancia.service';

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


  constructor(public router: Router, public documentosService: DocumentosImportacionService, public traspasoSVC: TraspasoMercanciaService) { }

  ngOnInit() {
    // this.obtenerOrdenDescargaDocumentos();
    this.obtenerDocumentos();
    //^ **** PRIVILEGIOS POR USUARIO *****
    this.obtenerPrivilegios();
    //^ **** PRIVILEGIOS POR USUARIO *****
  }


    
    //^ **** PRIVILEGIOS POR USUARIO *****
    privilegios: any;
    privilegiosExistentes: boolean = false;
    modulo = 'Importacion';
    area = 'Documentacion';
  
    //^ VARIABLES DE PERMISOS
    AgregarNueva: boolean = false;
    Agregar: boolean = false;
    //^ VARIABLES DE PERMISOS
  
  
    obtenerPrivilegios() {
      let arrayPermisosMenu = JSON.parse(localStorage.getItem('Permisos'));
      console.log(arrayPermisosMenu);
      let arrayPrivilegios: any;
      try {
        arrayPrivilegios = arrayPermisosMenu.find(modulo => modulo.titulo == this.modulo);
        // console.log(arrayPrivilegios);
        arrayPrivilegios = arrayPrivilegios.submenu.find(area => area.titulo == this.area);
        // console.log(arrayPrivilegios);
        this.privilegios = [];
        arrayPrivilegios.privilegios.forEach(element => {
          this.privilegios.push(element.nombreProceso);
          this.verificarPrivilegio(element.nombreProceso);
        });
        // console.log(this.privilegios);
      } catch {
        console.log('Ocurrio algun problema');
      }
    }
  
    verificarPrivilegio(privilegio) {
      switch (privilegio) {
        case ('Agregar Nueva Documentacion'):
          this.AgregarNueva = true;
          break;
        case ('Agregar Documento'):
          this.Agregar = true;
          break;
        default:
          break;
      }
    }
    //^ **** PRIVILEGIOS POR USUARIO *****

  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Tipo', 'CP', 'Documento', 'Lote', 'FechaV'];
  // displayedColumnsVersion: string[] = ['ClaveProducto', 'Sacos', 'Lote', 'USDA', 'Pedimento', 'Documentos'];
  displayedColumnsVersion: string[] = ['ClaveProducto', 'Sacos', 'Lote', 'USDA', 'Pedimento'];
  expandedElement: any;
  detalle = new Array<any>();
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  arrOrdenDescarga: any;

 

  //Obtiene Ordenes Descargadas.
  obtenerOrdenDescargaDocumentos() {
  this.documentosService.getOrdenesDescargadas().subscribe(data => {
      console.log(data);
      this.documentosService.master = []
      console.log(this.documentosService.master);
      if (data.length > 0) {
        // console.log('Si hay datos');
        // let detalleOrdenDescarga = new Array<any>();
        for (let i = 0; i < data.length ; i++) {
          console.log(i);
          this.documentosService.master[i] = data[i];
          this.documentosService.master[i].detalleDocumento = [];

          this.documentosService.getDetalleOrdenDescargaId(data[i].IdOrdenDescarga).subscribe(dataOD => {
            console.log(dataOD);
            // detalleOrdenDescarga = dataOD;
            dataOD.forEach(element => {
              console.log(element);
              // console.log(l);
              // console.log( detalleOrdenDescarga[l]);
              // let joinDescargaDocumento = dataOD[l];
              // console.log(element);
              // let joinDescargaDocumento = element;
              // console.log(joinDescargaDocumento);
              // console.log(detalleOrdenDescarga[l]);
              //  this.documentosService.getJoinDodD(element.IdDetalleOrdenDescarga, element.ClaveProducto).subscribe(dataJoin => {
              //   console.log(dataJoin);
              // //   // console.log(joinDescargaDocumento);
              //   if (dataJoin.length > 0) {              
              //     joinDescargaDocumento.Documento = true;
              //     console.log('si hay documento');                  
              //   } else {
              //     joinDescargaDocumento.Documento = false;
              //     console.log('no hay documento');
              //   }
                this.documentosService.master[i].detalleDocumento.push(element);
                this.listData = new MatTableDataSource(this.documentosService.master);
                this.listData.sort = this.sort;
                // this.listData.paginator = this.paginator;
                //         // console.log(this.documentosService.master);
              // })
              console.log(this.documentosService.master);
          });
          })
        }
      } else {
        this.listData = new MatTableDataSource(this.documentosService.master);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
      }

      // this.listData.paginator._intl.itemsPerPageLabel = 'Compras por Pagina';
    })
  }


  obtenerDocumentos(){
    let query = ' select * from Documentos'
    let consulta = {
      'consulta':query
    };
this.traspasoSVC.getQuery(consulta).subscribe((resDocumentos:any)=>{
  console.log(resDocumentos);
  this.listData = new MatTableDataSource(resDocumentos);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
})
  }

  //puede llegar como parametro el idDetalleOrdenDescarga
  accederDocumentos(folio?: number) {
    console.log(folio);
    if (folio) {
      this.documentosService.folioOrdenDescarga = folio;
    } else {
      this.documentosService.folioOrdenDescarga = null;

    }
    console.log(this.documentosService.folioOrdenDescarga);
    this.router.navigate(['/documentacion-formulario-importacion']);
  }

    applyFilter(filtervalue: string) {
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();
  }

}