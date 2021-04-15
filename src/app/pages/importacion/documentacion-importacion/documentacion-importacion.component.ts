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
import { MessageService } from 'src/app/services/message.service';
import { DocumentacionImportacionVisorDocumentosComponent } from '../documentacion-importacion-visor-documentos/documentacion-importacion-visor-documentos.component';
import { Documento } from 'src/app/Models/documentos/documento-model';

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


  constructor(public router: Router, public documentosService: DocumentosImportacionService,
    public traspasoSVC: TraspasoMercanciaService, public _MessageService: MessageService,
    private dialog: MatDialog, public traspasoService: TraspasoMercanciaService,

  ) { }

  ngOnInit() {
    // this.obtenerOrdenDescargaDocumentos();
    this.obtenerDocumentos();
    //^ **** PRIVILEGIOS POR USUARIO *****
    this.obtenerPrivilegios();
    //^ **** PRIVILEGIOS POR USUARIO *****

    this._MessageService.documentosURL = [];
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
  displayedColumns: string[] = ['Tipo', 'CP', 'Documento', 'Lote', 'FechaV', 'Options'];
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
        for (let i = 0; i < data.length; i++) {
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


  obtenerDocumentos() {
    let query = 'select * from Documentos order by IdDocumento desc'
    let consulta = {
      'consulta': query
    };
    this.traspasoSVC.getQuery(consulta).subscribe((resDocumentos: any) => {
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

  //File URL del pdf, para ser mostrado en el visor de decumentos
  fileUrl;

  //Estatus
  pdfstatus = false;

  // ^ desplegar el visor de archivos
  leerArchivos(row, enviar?) {

    console.log(row);
    const formData = new FormData();
    formData.append('folio', '0')
    formData.append('id', '0')
    formData.append('archivo', row.NombreDocumento)
    // formData.append('direccionDocumento', 'Documentos/Importacion/Factura/01A1/LOT1')
    console.log('%c%s', 'color: #7f7700', 'Documentos/Importacion/', row.Tipo, '/', row.ClaveProducto, '/', row.Observaciones, '/', row.NombreDocumento);

    switch (row.Tipo) {
      case 'Factura':
        console.log('%c%s', 'color: #00ff88', 'Factura');
        formData.append('direccionDocumento', 'Documentos/Importacion/Factura/' + row.ClaveProducto + '/' + row.Observaciones)
        break;
      case 'CLV':
        console.log('%c%s', 'color: #00ff88', 'CLV');
        formData.append('direccionDocumento', 'Documentos/Importacion/CLV/0/0/' + row.ClaveProducto)
        break;
      case 'USDA':
        console.log('%c%s', 'color: #00ff88', 'USDA');
        formData.append('direccionDocumento', 'Documentos/Importacion/USDA/' + row.Folio)
        break;
      case 'CA':
        console.log('%c%s', 'color: #00ff88', 'CA');
        formData.append('direccionDocumento', 'Documentos/Importacion/CA/0/0/' + row.ClaveProducto + '/' + row.Observaciones)
        break;
      case 'PESPI':
        console.log('%c%s', 'color: #00ff88', 'PESPI');
        formData.append('direccionDocumento', 'Documentos/Importacion/PESPI/0/0/' + row.ClaveProducto + '/' + row.Observaciones)
        break;
      case 'CO':
        console.log('%c%s', 'color: #00ff88', 'CO');
        formData.append('direccionDocumento', 'Documentos/Importacion/CO/0/0/' + row.ClaveProducto)
        break;
      case 'General':
        console.log('%c%s', 'color: #00ff88', 'CO');
        formData.append('direccionDocumento', 'Documentos/Importacion/General')
        break;

    }

    this.documentosService.readDocumentosServer(formData, 'ObtenerDocumento').subscribe(res => {
      console.log(res);
      const blob = new Blob([res as BlobPart], { type: 'application/pdf' });
      let fr = new FileReader();

      fr.readAsDataURL(blob);
      fr.onload = e => {
        // console.log(e);
        // console.log(fr.result);
        this.fileUrl = fr.result;
        this.pdfstatus = true;
        this.documentosService.fileUrl = this.fileUrl;
        // ^ Si es enviar, solo guardaremos el resultado en  una variable , para enviarla por correo.
        if (enviar == true) {
          let temp = Object.assign({}, this.fileUrl);
          this._MessageService.documentosURL.push(temp);
        } else {
          const dialogConfig = new MatDialogConfig();
          dialogConfig.disableClose = true;
          dialogConfig.autoFocus = true;
          dialogConfig.width = "70%";
          this.dialog.open(DocumentacionImportacionVisorDocumentosComponent, dialogConfig);
        }
      }
    })

  }

  //^Eliminar Documento del Servidor
  onRemove(event) {
    console.log(event);
    Swal.fire({
      title: '¿Seguro de Borrar Documento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        const formData = new FormData();
        if (event.Tipo != 'USDA') {
          formData.append('name', event.NombreDocumento.toString())
          formData.append('folio', '0')
          formData.append('id', '0')
          formData.append('tipo', event.Tipo)
          formData.append('clave', event.ClaveProducto)
          formData.append('lote', event.Observaciones)

        } else {
          formData.append('name', event.NombreDocumento.toString())
          formData.append('folio', event.Folio.toString())
          formData.append('id', '')
          formData.append('tipo', 'USDA')
        }

        // this.documentosService.borrarDocumentoFMTDID(docu).subscribe(resDelete=>{
        // console.log(resDelete);
        let query = ''
        switch (event.Tipo) {
          case 'Factura':
            console.log('%c%s', 'color: #00ff88', 'Factura');
            query = 'delete Documentos where Path = ' + "'Documentos/Factura/" + event.ClaveProducto + "/" + event.Observaciones + "/" + event.NombreDocumento + "'" + ''
            break;
          case 'CLV':
            console.log('%c%s', 'color: #00ff88', 'CLV');
            query = 'delete Documentos where Path = ' + "'Documentos/CLV/0/0/" + event.ClaveProducto + "/" + event.NombreDocumento + "'" + ''
            break;
          case 'USDA':
            console.log('%c%s', 'color: #00ff88', 'USDA');
            query = 'delete Documentos where Path = ' + "'Documentos/USDA/" + event.Folio + "/" + event.NombreDocumento + "'" + ''
            break;
          case 'CA':
            console.log('%c%s', 'color: #00ff88', 'CA');
            query = 'delete Documentos where Path = ' + "'Documentos/CA/0/0/" + event.ClaveProducto + "/" + event.Observaciones + "/" + event.NombreDocumento + "'" + ''
            break;
          case 'PESPI':
            console.log('%c%s', 'color: #00ff88', 'PESPI');
            query = 'delete Documentos where Path = ' + "'Documentos/PESPI/0/0/" + event.ClaveProducto + "/" + event.Observaciones + "/" + event.NombreDocumento + "'" + ''
            break;
          case 'CO':
            console.log('%c%s', 'color: #00ff88', 'CO');
            query = 'delete Documentos where Path = ' + "'Documentos/CO/0/0/" + event.ClaveProducto + "/" + event.NombreDocumento + "'" + ''
            break;
          case 'General':
            console.log('%c%s', 'color: #00ff88', 'General');
            query = "delete Documentos where Path = 'Documentos/General/" + event.NombreDocumento + "'"; 
            break;
          // default:

        }
        let consulta = {
          'consulta': query
        };

        console.log('%c⧭', 'color: #9c66cc', consulta);
        //^ Borrar documento de la base de datos.
        this.traspasoService.getQuery(consulta).subscribe((detallesConsulta: any) => {
          console.log(detallesConsulta);
          this.documentosService.deleteDocumentoServer(formData, 'borrarDocumentoImportacion').subscribe(res => {
            console.log(res)
            this.pdfstatus = false;
            this.obtenerDocumentos();
            Swal.fire({
              title: 'Borrado',
              icon: 'success',
              timer: 1000,
              showCancelButton: false,
              showConfirmButton: false
            });
          })
        })


      }
    })

  }


}