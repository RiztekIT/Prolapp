import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { TraspasoMercanciaService } from 'src/app/services/importacion/traspaso-mercancia.service';
import { MatTableDataSource, MatSort, MatPaginator, MatDialogConfig, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { DocumentosImportacionService } from 'src/app/services/importacion/documentos-importacion.service';
import Swal from 'sweetalert2';
import { DocumentacionImportacionVisorDocumentosComponent } from 'src/app/pages/importacion/documentacion-importacion-visor-documentos/documentacion-importacion-visor-documentos.component';
import { Documento } from 'src/app/Models/documentos/documento-model';
import { OrdenTemporalService } from 'src/app/services/almacen/orden-temporal/orden-temporal.service';
import { FormControl } from '@angular/forms';
import { MessageService } from 'src/app/services/message.service';
import * as html2pdf from 'html2pdf.js';
import { EmailgeneralComponent } from 'src/app/components/email/emailgeneral/emailgeneral.component';

@Component({
  selector: 'app-resumentraspaso',
  templateUrl: './resumentraspaso.component.html',
  styleUrls: ['./resumentraspaso.component.css']
})
export class ResumentraspasoComponent implements OnInit {

  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['PO', 'Factura', 'CBK', 'Usda', 'Clave', 'Producto', 'PesoTotal', 'Sacos'];
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  archivosfactura: any[];
  archivosCLV: any[];
  archivosCO: any[];
  archivosCA: any[];
  archivosPESPI: any[];
  archivosUSDA: any[];
  tipo: string;

  eventsFacturas: any;
  eventsCLV: any;
  eventsCO: any;
  eventsPESPI: any;
  eventsCA: any;
  eventsUSDA: any;
  filesFacturas: File[] = [];
  filesCLV: File[] = [];
  filesCO: File[] = [];
  filesPESPI: File[] = [];
  filesCA: File[] = [];
  filesUSDA: File[] = [];

  informacionGeneral = new Array<any>();
  seleccionadosFacturas = new Array<any>();
  seleccionadosCLV = new Array<any>();
  seleccionadosCO = new Array<any>();
  seleccionadosPESPI = new Array<any>();
  seleccionadosCA = new Array<any>();
  seleccionadosUSDA = new Array<any>();
  stringDocumentoSeleccionadoFactura: string = "";
  tipoDocumentoSeleccionadoFactura: String;
  //Estatus
  pdfstatus = false;

  numUSDA;
  myControl4 = new FormControl();

  //File URL del pdf, para ser mostrado en el visor de decumentos
  fileUrl;

  constructor(public traspasoSVC: TraspasoMercanciaService, public documentosService: DocumentosImportacionService, 
    private dialog: MatDialog, public otService: OrdenTemporalService, @Inject(MAT_DIALOG_DATA) public data: any,  public _MessageService: MessageService) { }

  ngOnInit() {

    this.obtenerDetallesTraspaso();
this._MessageService.documentosURL = [];
  }


  obtenerDetallesTraspaso() {

    this.obtenerInformacionOrdenCarga(this.traspasoSVC.selectTraspaso.IdOrdenCarga);

    // let query = 'select DetalleTraspasoMercancia.*, DetalleTarima.*, OrdenTemporal.* from DetalleTraspasoMercancia left join detalletarima on DetalleTraspasoMercancia.IdDetalle=detalletarima.IdDetalleTarima left join OrdenTemporal on OrdenTemporal.IdDetalleTarima=DetalleTarima.IdDetalleTarima where DetalleTraspasoMercancia.IdTraspasoMercancia=' + this.traspasoSVC.selectTraspaso.IdTraspasoMercancia + ''
    let query = 'select TraspasoMercancia.*, OrdenTemporal.* from TraspasoMercancia left join OrdenTemporal on OrdenTemporal.IdOrdenCarga = TraspasoMercancia.IdOrdenCarga where TraspasoMercancia.IdTraspasoMercancia =' + this.traspasoSVC.selectTraspaso.IdTraspasoMercancia + ''
    let consulta = {
      'consulta': query
    };

    this.traspasoSVC.getQuery(consulta).subscribe((detalles: any) => {
      console.log(detalles);
      //^Guardamos la informacion General
      this.informacionGeneral = detalles;
      this.seleccionadosFacturas = detalles;
      this.seleccionadosCLV = detalles;
      this.seleccionadosCO = detalles;
      this.seleccionadosPESPI = detalles;
      this.seleccionadosCA = detalles;
      this.seleccionadosUSDA = detalles;
      this.listData = new MatTableDataSource(detalles);
      this.listData.sort = this.sort;
      /*      this.listData.paginator = this.paginator;
           this.listData.paginator._intl.itemsPerPageLabel = 'Traspasos por Pagina'; */
      if (detalles.length > 0) {
        this.archivosfactura = [];
        this.archivosCLV = [];
        this.archivosCO = [];
        this.archivosPESPI = [];
        this.archivosCA = [];
        this.archivosUSDA = [];
        for (let i = 0; i < detalles.length; i++) {

          this.obtenerDocumentosFactura(detalles[i], detalles[i].IdDetalleTarima);
          this.obtenerDocumentosCLV(detalles[i]);
          this.obtenerDocumentosCO(detalles[i]);
          this.obtenerPESPI(detalles[i]);
          this.obtenerDocumentosCA(detalles[i]);
          this.obtenerDocumentosUSDA(detalles[i]);

        }
      }
    })




  }
  //   refrescarDocumentos(){



  //     let query = 'select DetalleTraspasoMercancia.*, DetalleTarima.*, OrdenTemporal.* from DetalleTraspasoMercancia left join detalletarima on DetalleTraspasoMercancia.IdDetalle=detalletarima.IdDetalleTarima left join OrdenTemporal on OrdenTemporal.IdDetalleTarima=DetalleTarima.IdDetalleTarima where DetalleTraspasoMercancia.IdTraspasoMercancia=3'
  //     let consulta = {
  //       'consulta':query
  //     };

  //     this.traspasoSVC.getQuery(consulta).subscribe((detalles: any)=>{
  //       console.log(detalles);
  //       this.seleccionadosFacturas = detalles;
  //    /*    this.listData = new MatTableDataSource(detalles);
  //       this.listData.sort = this.sort; */
  //  /*      this.listData.paginator = this.paginator;
  //       this.listData.paginator._intl.itemsPerPageLabel = 'Traspasos por Pagina'; */

  //       this.numUSDA = [];
  //       for (let i=0; i< detalles.length;i++){
  //         this.numUSDA = this.numUSDA + detalles[i].Usda; 
  //         this.obtenerDocumentosFactura(detalles[i],detalles[i].IdOrdenDescarga,detalles[i].IdDetalleTarima);
  //         this.obtenerDocumentosCLV(detalles[i]);
  //         this.obtenerDocumentosCO(detalles[i]);
  //         this.obtenerPESPI(detalles[i]);
  //         this.obtenerDocumentosCA(detalles[i]);
  //         this.obtenerDocumentosUSDA(detalles[i]);

  //       }
  //     })




  // }

  obtenerInformacionOrdenCarga(id) {
    let query = 'select * from OrdenCarga where IdOrdenCarga=' + id + ''
    let consulta = {
      'consulta': query
    };

    this.traspasoSVC.getQuery(consulta).subscribe((oc: any) => {
      console.log(oc);
      this.Caja = oc[0].Caja;
      this.Fletera = oc[0].Fletera;
    });
  }

  obtenerDocumentosFactura(row,  id: number) {

    console.log( id);
    console.log(row, 'ROW');
    try {
      const formData = new FormData();
      formData.append('folio', row.Lote.toString());
      formData.append('id', id.toString());
      // formData.append('direccionDocumento', 'Documentos/Importacion/Factura/'+folio.toString()+'/'+id.toString());
      formData.append('direccionDocumento', 'Documentos/Importacion/Factura/' + row.IdOrdenDescarga + '/' + row.ClaveProducto + '/' + row.Lote);
      this.documentosService.readDirDocuemntosServer(formData, 'cargarNombreDocumentos').subscribe(res => {
        console.log(res);
        // this.archivosfactura = [];
        if (res) {
          // console.log(res.length)
          for (let i = 0; i < res.length; i++) {
            // let archivo = <any>{};
            // archivo.name = res[i];
            // archivo.id = id;
            // archivo.folio = row.IdOrdenDescarga;
            let archivo = <any>{};
            archivo.name = res[i];
            archivo.id = row.IdOrdenDescarga;
            archivo.clave = row.ClaveProducto;
            archivo.lote = row.Lote;
            archivo.path = 'Documentos/Importacion/Factura/' + row.IdOrdenDescarga + '/' + row.ClaveProducto + '/' + row.Lote + '/' + archivo.name
            this.archivosfactura.push(archivo);
            const formDataDoc = new FormData();
            // formDataDoc.append('folio', folio.toString());
            // formDataDoc.append('id', id.toString());
            // formDataDoc.append('archivo', res[i])
            // formDataDoc.append('direccionDocumento', 'Documentos/Importacion/Factura/'+folio.toString()+'/'+id.toString());
            formDataDoc.append('direccionDocumento', 'Documentos/Importacion/Factura/' + row.IdOrdenDescarga + '/' + row.ClaveProducto + '/' + row.Lote);
            this.documentosService.readDocumentosServer(formDataDoc, 'ObtenerDocumento').subscribe(resDoc => {
              console.log(resDoc)
              const blob = new Blob([resDoc as BlobPart], { type: 'application/pdf' });
              //  console.log(blob)
              let fr = new FileReader();
              let name = res[i];
              fr.readAsDataURL(blob);
              //  console.log(fr.readAsDataURL(blob));
              fr.onload = e => {
                //  console.log(e);
                //  console.log(fr.result);
                this.tipo = 'documento'
                this.dataURItoBlob(fr.result, name);
              }
            })
          }
        }
        // console.log(this.archivos)
      })
    } catch (error) {
      console.log(error);
    }

  }

  leerArchivosfactura(a) {
    // console.log(a);
    // const formData = new FormData();
    // formData.append('folio', a.folio.toString())
    // formData.append('id', a.id.toString())
    // formData.append('archivo', a.name)
    // formData.append('direccionDocumento', 'Documentos/Importacion/Factura/'+a.folio.toString()+'/'+a.id.toString())
    // this.documentosService.readDocumentosServer(formData, 'ObtenerDocumento').subscribe(res => {
    //   // console.log(res);
    //   const blob = new Blob([res as BlobPart], { type: 'application/pdf' });
    //   let fr = new FileReader();

    //   fr.readAsDataURL(blob);
    console.log(a);
    const formData = new FormData();
    formData.append('clave', a.clave.toString())
    formData.append('lote', a.lote.toString())
    formData.append('id', a.id.toString())
    formData.append('archivo', a.name)
    formData.append('direccionDocumento', 'Documentos/Importacion/Factura/' + a.id.toString() + '/' + a.clave + '/' + a.lote)
    this.documentosService.readDocumentosServer(formData, 'ObtenerDocumento').subscribe(res => {
      console.log(res);
      const blob = new Blob([res as BlobPart], { type: 'application/pdf' });
      console.log(blob);
      let fr = new FileReader();

      fr.readAsDataURL(blob);
      fr.onload = e => {
        // console.log(e);
        console.log(fr.result);
        // this.fileUrl = fr.result;
        this.pdfstatus = true;
        // this.documentosService.fileUrl = this.fileUrl;
        //^ Si es enviar, solo guardaremos el resultado en  una variable , para enviarla por correo.
        // if(enviar == true){
        //   let temp = Object.assign({}, fr.result);
        //   let objeto = {
        //     name: a.name,
        //     file: btoa(temp.toString())
        //   }
        //     this._MessageService.documentosURL.push(objeto);
        // }else{
          const dialogConfig = new MatDialogConfig();
          dialogConfig.disableClose = true;
          dialogConfig.autoFocus = true;
          dialogConfig.width = "70%";
          this.dialog.open(DocumentacionImportacionVisorDocumentosComponent, dialogConfig);
        // }
      }
    })

  }

  onRemoveFactura(event) {
    console.log(event);
    this.archivosfactura.splice(this.archivosfactura.indexOf(event), 1);
    /* Swal.fire({
      title: '¿Seguro de Borrar Documento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        const formData = new FormData();
        formData.append('name', event.name.toString())
        formData.append('folio', event.folio.toString())
        formData.append('id', event.id.toString())
        formData.append('tipo', 'Factura')
        console.log(formData);
        let docu = new Documento();
        docu.Folio = event.folio;
        docu.Modulo = 'Importacion';
        docu.Tipo = 'Factura';
        docu.NombreDocumento = event.name;
        docu.IdDetalle = event.id
        this.documentosService.borrarDocumentoFMTDID(docu).subscribe(resDelete=>{
          console.log(resDelete);
          this.documentosService.deleteDocumentoServer(formData, 'borrarDocumentoImportacion').subscribe(res => {
            console.log(res)
            this.archivosfactura.splice(this.archivosfactura.indexOf(event), 1);
            this.pdfstatus = false;
            
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
    }) */

  }


  obtenerDocumentosCLV(detalle) {

    // console.log(folio, id);
    let clave = detalle.ClaveProducto
    let ClaveProducto = clave.slice(0, -1)

    const formData = new FormData();
    formData.append('folio', '0');
    formData.append('id', '0');
    formData.append('direccionDocumento', 'Documentos/Importacion/CLV/0/0/' + ClaveProducto);
    this.documentosService.readDirDocuemntosServer(formData, 'cargarNombreDocumentos').subscribe(res => {
      // console.log(res);
      // this.archivosCLV = [];
      if (res) {
        // console.log(res.length)
        for (let i = 0; i < res.length; i++) {
          let archivo = <any>{};
          archivo.name = res[i];
          archivo.id = ClaveProducto;
          archivo.folio = 0;
          archivo.path = 'Documentos/Importacion/CLV/0/0/' + ClaveProducto + '/' + archivo.name
          this.archivosCLV.push(archivo);
          const formDataDoc = new FormData();
          formDataDoc.append('folio', '0');
          formDataDoc.append('id', ClaveProducto);
          formDataDoc.append('archivo', res[i])
          formDataDoc.append('direccionDocumento', 'Documentos/Importacion/CLV/0/0/' + ClaveProducto);
          this.documentosService.readDocumentosServer(formDataDoc, 'ObtenerDocumento').subscribe(resDoc => {
            //  console.log(resDoc)
            const blob = new Blob([resDoc as BlobPart], { type: 'application/pdf' });
            //  console.log(blob)
            let fr = new FileReader();
            let name = res[i];
            fr.readAsDataURL(blob);
            //  console.log(fr.readAsDataURL(blob));
            fr.onload = e => {
              //  console.log(e);
              //  console.log(fr.result);
              this.tipo = 'documento'
              this.dataURItoBlob(fr.result, name);
            }
          })
        }
      }
      // console.log(this.archivos)
    })

  }

  obtenerDocumentosCA(detalle) {

    // console.log(folio, id);
    let clave = detalle.ClaveProducto
    let ClaveProducto = clave.slice(0, -1);
    let Lote = detalle.Lote;

    const formData = new FormData();
    formData.append('folio', '0');
    formData.append('id', '0');
    formData.append('direccionDocumento', 'Documentos/Importacion/CA/0/0/' + ClaveProducto + '/' + Lote);
    this.documentosService.readDirDocuemntosServer(formData, 'cargarNombreDocumentos').subscribe(res => {
      // console.log(res);
      // this.archivosCA = [];
      if (res) {
        // console.log(res.length)
        for (let i = 0; i < res.length; i++) {
          let archivo = <any>{};
          archivo.name = res[i];
          archivo.id = 0;
          archivo.folio = 0;
          archivo.clave = ClaveProducto;
          archivo.lote = Lote;
          archivo.path = 'Documentos/Importacion/CA/0/0/' + ClaveProducto + '/' + Lote + '/' + archivo.name
          this.archivosCA.push(archivo);
          const formDataDoc = new FormData();
          formDataDoc.append('folio', '0');
          formDataDoc.append('id', '0');
          formDataDoc.append('archivo', res[i])
          formDataDoc.append('direccionDocumento', 'Documentos/Importacion/CA/0/0/' + ClaveProducto + '/' + Lote);
          this.documentosService.readDocumentosServer(formDataDoc, 'ObtenerDocumento').subscribe(resDoc => {
            //  console.log(resDoc)
            const blob = new Blob([resDoc as BlobPart], { type: 'application/pdf' });
            //  console.log(blob)
            let fr = new FileReader();
            let name = res[i];
            fr.readAsDataURL(blob);
            //  console.log(fr.readAsDataURL(blob));
            fr.onload = e => {
              //  console.log(e);
              //  console.log(fr.result);
              this.tipo = 'documento'
              this.dataURItoBlob(fr.result, name);
            }
          })
        }
      }
      // console.log(this.archivos)
    })

  }

  leerArchivosCA(a, enviar?) {
    console.log(a);
    const formData = new FormData();
    formData.append('folio', '0')
    formData.append('id', '0')
    formData.append('archivo', a.name)
    formData.append('lote', a.lote)
    formData.append('direccionDocumento', 'Documentos/Importacion/CA/0/0/' + a.clave + '/' + a.lote)
    this.documentosService.readDocumentosServer(formData, 'ObtenerDocumento').subscribe(res => {
      // console.log(res);
      const blob = new Blob([res as BlobPart], { type: 'application/pdf' });
      let fr = new FileReader();

      fr.readAsDataURL(blob);
      fr.onload = e => {
        // console.log(e);
        // console.log(fr.result);
        this.fileUrl = fr.result;
        this.pdfstatus = true;
        this.documentosService.fileUrl = this.fileUrl;
    //^ Si es enviar, solo guardaremos el resultado en  una variable , para enviarla por correo.
    if(enviar == true){
      let temp = Object.assign({}, this.fileUrl);
        this._MessageService.documentosURL.push(temp);
    }else{
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = "70%";
      this.dialog.open(DocumentacionImportacionVisorDocumentosComponent, dialogConfig);
    }
      }
    })

  }

  onRemoveCA(event) {
    console.log(event);
    this.archivosCA.splice(this.archivosCA.indexOf(event), 1);
    /*  Swal.fire({
       title: '¿Seguro de Borrar Documento?',
       icon: 'warning',
       showCancelButton: true,
       confirmButtonColor: '#3085d6',
       cancelButtonColor: '#d33',
       confirmButtonText: 'Borrar',
       cancelButtonText: 'Cancelar'
     }).then((result) => {
       if (result.value) {
         const formData = new FormData();
         formData.append('name', event.name.toString())
         formData.append('folio', '0')
         formData.append('id', '0')
         formData.append('tipo', 'CA')
         formData.append('clave', event.clave)
         formData.append('lote', event.lote)
         console.log(formData);
         let docu = new Documento();
         docu.Folio = event.folio;
         docu.Modulo = 'Importacion';
         docu.Tipo = 'CA';
         docu.NombreDocumento = event.name;
         docu.IdDetalle = event.id
         this.documentosService.borrarDocumentoFMTDID(docu).subscribe(resDelete=>{
           console.log(resDelete);
           this.documentosService.deleteDocumentoServer(formData, 'borrarDocumentoImportacion').subscribe(res => {
             console.log(res)
             this.archivosCA.splice(this.archivosCA.indexOf(event), 1);
             this.pdfstatus = false;
             
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
     }) */

  }
  leerArchivosCLV(a, enviar?) {

    console.log(a);
    const formData = new FormData();
    formData.append('folio', '0')
    formData.append('id', '0')
    formData.append('archivo', a.name)
    formData.append('direccionDocumento', 'Documentos/Importacion/CLV/0/0/' + a.id)
    this.documentosService.readDocumentosServer(formData, 'ObtenerDocumento').subscribe(res => {
      // console.log(res);
      const blob = new Blob([res as BlobPart], { type: 'application/pdf' });
      let fr = new FileReader();

      fr.readAsDataURL(blob);
      fr.onload = e => {
        // console.log(e);
        // console.log(fr.result);
        this.fileUrl = fr.result;
        this.pdfstatus = true;
        this.documentosService.fileUrl = this.fileUrl;
      //^ Si es enviar, solo guardaremos el resultado en  una variable , para enviarla por correo.
      if(enviar == true){
        let temp = Object.assign({}, this.fileUrl);
          this._MessageService.documentosURL.push(temp);
      }else{
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "70%";
        this.dialog.open(DocumentacionImportacionVisorDocumentosComponent, dialogConfig);
      }
      }
    })

  }

  onRemoveCLV(event) {

    console.log(event);
    this.archivosCLV.splice(this.archivosCLV.indexOf(event), 1);
    /* Swal.fire({
      title: '¿Seguro de Borrar Documento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        const formData = new FormData();
        formData.append('name', event.name.toString())
        formData.append('folio', '0')
        formData.append('id', '0')
        formData.append('tipo', 'CLV')
        formData.append('clave', event.id)
        console.log(formData);
        let docu = new Documento();
        docu.Folio = event.folio;
        docu.Modulo = 'Importacion';
        docu.Tipo = 'CLV';
        docu.NombreDocumento = event.name;
        docu.IdDetalle = event.id
        this.documentosService.borrarDocumentoFMTDID(docu).subscribe(resDelete=>{
          console.log(resDelete);
          this.documentosService.deleteDocumentoServer(formData, 'borrarDocumentoImportacion').subscribe(res => {
            console.log(res)
            // this.files.splice(this.files.indexOf(event),1);
            this.archivosCLV.splice(this.archivosCLV.indexOf(event), 1);
            this.pdfstatus = false;
            
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
    }) */

  }


  obtenerDocumentosCO(detalle) {

    // console.log(folio, id);
    let clave = detalle.ClaveProducto
    let ClaveProducto = clave.slice(0, -1);

    const formData = new FormData();
    formData.append('folio', '0');
    formData.append('id', '0');
    formData.append('direccionDocumento', 'Documentos/Importacion/CO/0/0/' + ClaveProducto);
    this.documentosService.readDirDocuemntosServer(formData, 'cargarNombreDocumentos').subscribe(res => {
      // console.log(res);
      // this.archivosCO = [];
      if (res) {
        // console.log(res.length)
        for (let i = 0; i < res.length; i++) {
          let archivo = <any>{};
          archivo.name = res[i];
          archivo.id = ClaveProducto;
          archivo.folio = 0;
          archivo.path = 'Documentos/Importacion/CO/0/0/' + ClaveProducto + '/' + archivo.name
          this.archivosCO.push(archivo);
          const formDataDoc = new FormData();
          formDataDoc.append('folio', '0');
          formDataDoc.append('id', ClaveProducto);
          formDataDoc.append('archivo', res[i])
          formDataDoc.append('direccionDocumento', 'Documentos/Importacion/CO/0/0/' + ClaveProducto);
          this.documentosService.readDocumentosServer(formDataDoc, 'ObtenerDocumento').subscribe(resDoc => {
            //  console.log(resDoc)
            const blob = new Blob([resDoc as BlobPart], { type: 'application/pdf' });
            //  console.log(blob)
            let fr = new FileReader();
            let name = res[i];
            fr.readAsDataURL(blob);
            //  console.log(fr.readAsDataURL(blob));
            fr.onload = e => {
              //  console.log(e);
              //  console.log(fr.result);
              this.tipo = 'documento'
              this.dataURItoBlob(fr.result, name);
            }
          })
        }
      }
      // console.log(this.archivos)
    })

  }

  leerArchivosCO(a, enviar?) {
    console.log(a);
    const formData = new FormData();
    formData.append('folio', '0')
    formData.append('id', '0')
    formData.append('archivo', a.name)
    formData.append('direccionDocumento', 'Documentos/Importacion/CO/0/0/' + a.id)
    this.documentosService.readDocumentosServer(formData, 'ObtenerDocumento').subscribe(res => {
      // console.log(res);
      const blob = new Blob([res as BlobPart], { type: 'application/pdf' });
      let fr = new FileReader();

      fr.readAsDataURL(blob);
      fr.onload = e => {
        // console.log(e);
        // console.log(fr.result);
        this.fileUrl = fr.result;
        this.pdfstatus = true;
        this.documentosService.fileUrl = this.fileUrl;
    //^ Si es enviar, solo guardaremos el resultado en  una variable , para enviarla por correo.
    if(enviar == true){
      let temp = Object.assign({}, this.fileUrl);
        this._MessageService.documentosURL.push(temp);
    }else{
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = "70%";
      this.dialog.open(DocumentacionImportacionVisorDocumentosComponent, dialogConfig);
    }
      }
    })

  }

  onRemoveCO(event) {
    console.log(event);
    this.archivosCO.splice(this.archivosCO.indexOf(event), 1);
    /* Swal.fire({
      title: '¿Seguro de Borrar Documento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        const formData = new FormData();
        formData.append('name', event.name.toString())
        formData.append('folio', '0')
        formData.append('id', '0')
        formData.append('tipo', 'CO')
        formData.append('clave', event.id)
        console.log(formData);
        let docu = new Documento();
        docu.Folio = event.folio;
        docu.Modulo = 'Importacion';
        docu.Tipo = 'CO';
        docu.NombreDocumento = event.name;
        docu.IdDetalle = event.id
        this.documentosService.borrarDocumentoFMTDID(docu).subscribe(resDelete=>{
          console.log(resDelete);
          this.documentosService.deleteDocumentoServer(formData, 'borrarDocumentoImportacion').subscribe(res => {
            console.log(res)
            // this.files.splice(this.files.indexOf(event),1);
            this.archivosCO.splice(this.archivosCO.indexOf(event), 1);
            this.pdfstatus = false;
            
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
    }) */

  }


  obtenerPESPI(detalle) {
    // console.log(folio, id);

    let clave = detalle.ClaveProducto
    let ClaveProducto = clave.slice(0, -1);
    let Lote = detalle.Lote;

    const formData = new FormData();
    formData.append('folio', '0');
    formData.append('id', '0');
    formData.append('direccionDocumento', 'Documentos/Importacion/PESPI/0/0/' + ClaveProducto + '/' + Lote);
    this.documentosService.readDirDocuemntosServer(formData, 'cargarNombreDocumentos').subscribe(res => {
      // console.log(res);
      // this.archivosPESPI = [];
      if (res) {
        // console.log(res.length)
        for (let i = 0; i < res.length; i++) {
          let archivo = <any>{};
          archivo.name = res[i];
          archivo.id = 0;
          archivo.folio = 0;
          archivo.clave = ClaveProducto;
          archivo.lote = Lote;
          archivo.path = 'Documentos/Importacion/PESPI/0/0/' + ClaveProducto + '/' + Lote + '/' + archivo.name
          this.archivosPESPI.push(archivo);
          const formDataDoc = new FormData();
          formDataDoc.append('folio', '0');
          formDataDoc.append('id', '0');
          formDataDoc.append('archivo', res[i])
          formDataDoc.append('direccionDocumento', 'Documentos/Importacion/PESPI/0/0/' + ClaveProducto + '/' + Lote);
          this.documentosService.readDocumentosServer(formDataDoc, 'ObtenerDocumento').subscribe(resDoc => {
            //  console.log(resDoc)
            const blob = new Blob([resDoc as BlobPart], { type: 'application/pdf' });
            //  console.log(blob)
            let fr = new FileReader();
            let name = res[i];
            fr.readAsDataURL(blob);
            //  console.log(fr.readAsDataURL(blob));
            fr.onload = e => {
              //  console.log(e);
              //  console.log(fr.result);
              this.tipo = 'documento'
              this.dataURItoBlob(fr.result, name);
            }
          })
        }
      }
      // console.log(this.archivos)
    })
  }



  leerArchivosPESPI(a, enviar?) {

    console.log(a);
    const formData = new FormData();
    formData.append('folio', '0')
    formData.append('id', '0')
    formData.append('archivo', a.name)
    formData.append('lote', a.lote)
    formData.append('direccionDocumento', 'Documentos/Importacion/PESPI/0/0/' + a.clave + '/' + a.lote)
    this.documentosService.readDocumentosServer(formData, 'ObtenerDocumento').subscribe(res => {
      // console.log(res);
      const blob = new Blob([res as BlobPart], { type: 'application/pdf' });
      let fr = new FileReader();

      fr.readAsDataURL(blob);
      fr.onload = e => {
        // console.log(e);
        // console.log(fr.result);
        this.fileUrl = fr.result;
        this.pdfstatus = true;
        this.documentosService.fileUrl = this.fileUrl;
      //^ Si es enviar, solo guardaremos el resultado en  una variable , para enviarla por correo.
      if(enviar == true){
        let temp = Object.assign({}, this.fileUrl);
          this._MessageService.documentosURL.push(temp);
      }else{
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "70%";
        this.dialog.open(DocumentacionImportacionVisorDocumentosComponent, dialogConfig);
      }
      }
    })

  }


  onRemovePESPI(event) {
    console.log(event);
    this.archivosPESPI.splice(this.archivosPESPI.indexOf(event), 1);
    /*  Swal.fire({
       title: '¿Seguro de Borrar Documento?',
       icon: 'warning',
       showCancelButton: true,
       confirmButtonColor: '#3085d6',
       cancelButtonColor: '#d33',
       confirmButtonText: 'Borrar',
       cancelButtonText: 'Cancelar'
     }).then((result) => {
       if (result.value) {
         const formData = new FormData();
         formData.append('name', event.name.toString())
         formData.append('folio', '0')
         formData.append('id', '0')
         formData.append('tipo', 'PESPI')
         formData.append('clave', event.clave)
         formData.append('lote', event.lote)
         console.log(formData);
         let docu = new Documento();
         docu.Folio = event.folio;
         docu.Modulo = 'Importacion';
         docu.Tipo = 'PESPI';
         docu.NombreDocumento = event.name;
         docu.IdDetalle = event.id
         this.documentosService.borrarDocumentoFMTDID(docu).subscribe(resDelete=>{
           console.log(resDelete);
           this.documentosService.deleteDocumentoServer(formData, 'borrarDocumentoImportacion').subscribe(res => {
             console.log(res)
             // this.files.splice(this.files.indexOf(event),1);
             this.archivosPESPI.splice(this.archivosPESPI.indexOf(event), 1);
             this.pdfstatus = false;
             
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
     }) */

  }


  onSelectFacturas(event) {

    this.eventsFacturas = event
    this.filesFacturas.push(...event.addedFiles);

  }
  //Eliminar documento de arreglos locales
  onRemoveDocDropzoneFacturas(event) {
    this.filesFacturas.splice(this.filesFacturas.indexOf(event), 1);
    this.eventsFacturas.addedFiles.splice(this.eventsFacturas.addedFiles.indexOf(event), 1);
  }

  onAddDocumentosFacturas() {

    console.log(this.seleccionadosFacturas, 'seleccionados');

    let event = this.eventsFacturas;
    // console.log(event)
    // console.log(this.seleccionados.length);
    let ultimoSeleccionado = this.seleccionadosFacturas.length
    for (var l = 0; l < this.seleccionadosFacturas.length; l++) {
      // console.log(this.seleccionados[l]);
      //update OrdenTemporal
      this.actualizarTipoDocumentoFactura(this.seleccionadosFacturas[l]);
      for (var i = 0; i < event.addedFiles.length; i++) {
        const formData = new FormData();
        formData.append('0', event.addedFiles[i])
        formData.append('folio', this.seleccionadosFacturas[l].IdOrdenDescarga.toString())
        formData.append('id', this.seleccionadosFacturas[l].IdDetalleTarima)
        formData.append('tipo', 'Factura')
        // console.log(res);
        // Buscar ultimo folio Documento
        let documento = new Documento();
        documento.IdDocumneto = 0;
        documento.Folio = this.seleccionadosFacturas[l].IdOrdenDescarga;
        documento.IdDetalle = this.seleccionadosFacturas[l].IdDetalleTarima;
        documento.Modulo = 'Importacion';
        documento.Tipo = 'Factura';
        documento.ClaveProducto = this.seleccionadosFacturas[l].ClaveProducto;
        documento.NombreDocumento = event.addedFiles[i].name;
        documento.Path = 'Documentos/Factura/' + this.seleccionadosFacturas[l].IdOrdenDescarga.toString() + '/' + this.seleccionadosFacturas[l].IdDetalleTarima.toString() + '/' + event.addedFiles[i].name;
        documento.Observaciones = "";
        documento.Vigencia = new Date();
        // console.log(documento);

        //verificar que no exista ese documento en la base de datos

        this.documentosService.getDocumentoFMTDID(documento).subscribe(resExistente => {
          if (resExistente.length > 0) {
            // console.log('Ya existe este documento');
            if (ultimoSeleccionado == l && event.addedFiles.length == i) {

              this.seleccionadosFacturas = []
              /* this.listDataDetalles = new MatTableDataSource(this.seleccionadosFacturas);
              this.listDataSeleccionados = new MatTableDataSource(this.seleccionadosFacturas); */
              // this.clearFolio();
              this.clearTipoDocumentoFacturas();
              this.eventsFacturas = [];
              this.filesFacturas = [];
              /* this.archivosfactura = []; */
              this.obtenerDetallesTraspaso()

              Swal.fire({
                title: 'Documentos Guardados',
                icon: 'success',
                timer: 1000,
                showCancelButton: false,
                showConfirmButton: false
              });
            }
          } else {
            // console.log('Agregar Documento');
            this.documentosService.addDocumento(documento).subscribe(resBaseDatos => {
              // console.log(resBaseDatos);
              this.documentosService.saveFileServer(formData, 'guardarDocumentoImportacion').subscribe(res => {
                if (ultimoSeleccionado == l && event.addedFiles.length == i) {

                  this.seleccionadosFacturas = []
                  /* this.listDataDetalles = new MatTableDataSource(this.seleccionadosFacturas);
                  this.listDataSeleccionados = new MatTableDataSource(this.seleccionadosFacturas); */
                  // this.clearFolio();
                  this.clearTipoDocumentoFacturas();
                  this.eventsFacturas = [];
                  this.filesFacturas = [];
                  this.obtenerDetallesTraspaso()
                  //this.obtenerDocumentosFactura(this.seleccionadosFacturas[l],this.seleccionadosFacturas[i].IdOrdenDescarga,this.seleccionadosFacturas[i].IdDetalleTarima);
                  /* this.archivosfactura = []; */
                  Swal.fire({
                    title: 'Documentos Guardados',
                    icon: 'success',
                    timer: 1000,
                    showCancelButton: false,
                    showConfirmButton: false
                  });
                }

              });
            })
          }

        })
      }

    }
    // this.files.push(...event.addedFiles);
  }

  actualizarTipoDocumentoFactura(detalle: any) {
    //Actualizar Factura en Orden Temporal
    console.log(detalle);
    detalle.QR = this.stringDocumentoSeleccionadoFactura;

    this.otService.updateOrdenTemporal(detalle).subscribe(res => {
      console.log(res);
    })

  }

  clearTipoDocumentoFacturas() {
    this.tipoDocumentoSeleccionadoFactura = "";
    this.stringDocumentoSeleccionadoFactura = "";
  }




  onAddDocumentosCLV() {

    let event = this.eventsCLV;
    // console.log(event)
    // console.log(this.seleccionados.length);
    let ultimoSeleccionado = this.seleccionadosCLV.length
    for (var l = 0; l < this.seleccionadosCLV.length; l++) {
      // console.log(this.seleccionados[l]);
      for (var i = 0; i < event.addedFiles.length; i++) {
        let ClaveProducto = this.seleccionadosCLV[l].ClaveProducto.slice(0, -1);
        const formData = new FormData();
        formData.append('0', event.addedFiles[i])
        formData.append('folio', '0')
        formData.append('id', '0')
        formData.append('tipo', 'CLV')
        formData.append('clave', ClaveProducto)
        // console.log(res);
        // Buscar ultimo folio Documento
        let documento = new Documento();
        documento.IdDocumneto = 0;
        documento.Folio = 0;
        documento.IdDetalle = 0;
        documento.Modulo = 'Importacion';
        documento.Tipo = 'CLV';
        documento.ClaveProducto = ClaveProducto;
        documento.NombreDocumento = event.addedFiles[i].name;
        documento.Path = 'Documentos/CLV/0/0/' + ClaveProducto + '/' + event.addedFiles[i].name;
        documento.Observaciones = "";
        documento.Vigencia = new Date();
        // console.log(documento);

        //verificar que no exista ese documento en la base de datos

        this.documentosService.getDocumentoFMTDID(documento).subscribe(resExistente => {
          if (resExistente.length > 0) {
            // console.log('Ya existe este documento');
            if (ultimoSeleccionado == l && event.addedFiles.length == i) {
              this.seleccionadosCLV = []
              // this.listDataDetalles = new MatTableDataSource(this.seleccionados);
              /* this.listDataSeleccionados = new MatTableDataSource(this.seleccionados); */
              // this.clearFolio();
              // this.clearTipoDocumento();
              this.eventsCLV = [];
              this.filesCLV = [];
              this.obtenerDetallesTraspaso()
              /* this.archivos = []; */
              Swal.fire({
                title: 'Documentos Guardados',
                icon: 'success',
                timer: 1000,
                showCancelButton: false,
                showConfirmButton: false
              });
            }
          } else {
            // console.log('Agregar Documento');
            this.documentosService.addDocumento(documento).subscribe(resBaseDatos => {
              // console.log(resBaseDatos);
              this.documentosService.saveFileServer(formData, 'guardarDocumentoImportacion').subscribe(res => {
                if (ultimoSeleccionado == l && event.addedFiles.length == i) {
                  this.seleccionadosCLV = []
                  // this.listDataDetalles = new MatTableDataSource(this.seleccionados);

                  // this.clearFolio();
                  // this.clearTipoDocumento();
                  this.eventsCLV = [];
                  this.filesCLV = [];
                  this.obtenerDetallesTraspaso()
                  /* this.archivosCLV = []; */
                  Swal.fire({
                    title: 'Documentos Guardados',
                    icon: 'success',
                    timer: 1000,
                    showCancelButton: false,
                    showConfirmButton: false
                  });
                }

              });
            })
          }

        })
      }

    }
    // this.files.push(...event.addedFiles);
  }

  onSelectCLV(event) {

    this.eventsCLV = event
    this.filesCLV.push(...event.addedFiles);

  }

  onRemoveDocDropzoneCLV(event) {
    this.filesCLV.splice(this.filesCLV.indexOf(event), 1);
    this.eventsCLV.addedFiles.splice(this.eventsCLV.addedFiles.indexOf(event), 1);

  }




  onAddDocumentosCO() {

    let event = this.eventsCO;
    // console.log(event)
    // console.log(this.seleccionados.length);
    let ultimoSeleccionado = this.seleccionadosCO.length
    for (var l = 0; l < this.seleccionadosCO.length; l++) {
      // console.log(this.seleccionados[l]);
      for (var i = 0; i < event.addedFiles.length; i++) {
        let ClaveProducto = this.seleccionadosCO[l].ClaveProducto.slice(0, -1);
        const formData = new FormData();
        formData.append('0', event.addedFiles[i])
        formData.append('folio', '0')
        formData.append('id', '0')
        formData.append('tipo', 'CO')
        formData.append('clave', ClaveProducto)
        // console.log(res);
        // Buscar ultimo folio Documento
        let documento = new Documento();
        documento.IdDocumneto = 0;
        documento.Folio = 0;
        documento.IdDetalle = 0;
        documento.Modulo = 'Importacion';
        documento.Tipo = 'CO';
        documento.ClaveProducto = ClaveProducto;
        documento.NombreDocumento = event.addedFiles[i].name;
        documento.Path = 'Documentos/CO/0/0/' + ClaveProducto + '/' + event.addedFiles[i].name;
        documento.Observaciones = "";
        documento.Vigencia = new Date();
        // console.log(documento);

        //verificar que no exista ese documento en la base de datos

        this.documentosService.getDocumentoFMTDID(documento).subscribe(resExistente => {
          if (resExistente.length > 0) {
            // console.log('Ya existe este documento');
            if (ultimoSeleccionado == l && event.addedFiles.length == i) {
              this.seleccionadosCO = []
              // this.listDataDetalles = new MatTableDataSource(this.seleccionados);
              //this.listDataSeleccionados = new MatTableDataSource(this.seleccionados);
              // this.clearFolio();
              // this.clearTipoDocumento();
              this.eventsCO = [];
              this.filesCO = [];
              this.obtenerDetallesTraspaso();

              Swal.fire({
                title: 'Documentos Guardados',
                icon: 'success',
                timer: 1000,
                showCancelButton: false,
                showConfirmButton: false
              });
            }
          } else {
            // console.log('Agregar Documento');
            this.documentosService.addDocumento(documento).subscribe(resBaseDatos => {
              // console.log(resBaseDatos);
              this.documentosService.saveFileServer(formData, 'guardarDocumentoImportacion').subscribe(res => {
                if (ultimoSeleccionado == l && event.addedFiles.length == i) {
                  this.seleccionadosCO = []
                  // this.listDataDetalles = new MatTableDataSource(this.seleccionados);
                  //this.listDataSeleccionados = new MatTableDataSource(this.seleccionados);
                  // this.clearFolio();
                  // this.clearTipoDocumento();
                  this.eventsCO = [];
                  this.filesCO = [];
                  this.obtenerDetallesTraspaso();

                  Swal.fire({
                    title: 'Documentos Guardados',
                    icon: 'success',
                    timer: 1000,
                    showCancelButton: false,
                    showConfirmButton: false
                  });
                }

              });
            })
          }

        })
      }

    }
    // this.files.push(...event.addedFiles);
  }

  onSelectCO(event) {

    this.eventsCO = event
    this.filesCO.push(...event.addedFiles);

  }

  onRemoveDocDropzoneCO(event) {
    this.filesCO.splice(this.filesCO.indexOf(event), 1);
    this.eventsCO.addedFiles.splice(this.eventsCO.addedFiles.indexOf(event), 1);

  }




  onAddDocumentosPESPI() {

    let event = this.eventsPESPI;
    // console.log(event)
    // console.log(this.seleccionados.length);
    let ultimoSeleccionado = this.seleccionadosPESPI.length
    for (var l = 0; l < this.seleccionadosPESPI.length; l++) {
      // console.log(this.seleccionados[l]);
      for (var i = 0; i < event.addedFiles.length; i++) {
        let ClaveProducto = this.seleccionadosCO[l].ClaveProducto.slice(0, -1);
        const formData = new FormData();
        formData.append('0', event.addedFiles[i])
        formData.append('folio', '0')
        formData.append('id', '0')
        formData.append('tipo', 'PESPI')
        formData.append('lote', this.seleccionadosPESPI[l].Lote)
        formData.append('clave', ClaveProducto)
        // console.log(res);
        // Buscar ultimo folio Documento
        let documento = new Documento();
        documento.IdDocumneto = 0;
        documento.Folio = 0;
        documento.IdDetalle = 0;
        documento.Modulo = 'Importacion';
        documento.Tipo = 'PESPI';
        documento.ClaveProducto = ClaveProducto;
        documento.NombreDocumento = event.addedFiles[i].name;
        documento.Path = 'Documentos/PESPI/0/0/' + ClaveProducto + '/' + this.seleccionadosPESPI[l].Lote + '/' + event.addedFiles[i].name;
        //Las observaciones se usaran como Lote
        documento.Observaciones = this.seleccionadosPESPI[l].Lote;

        documento.Vigencia = new Date();
        // console.log(documento);

        //verificar que no exista ese documento en la base de datos

        this.documentosService.getDocumentoFMTDID(documento).subscribe(resExistente => {
          if (resExistente.length > 0) {
            // console.log('Ya existe este documento');
            if (ultimoSeleccionado == l && event.addedFiles.length == i) {
              this.seleccionadosPESPI = []
              // this.listDataDetalles = new MatTableDataSource(this.seleccionados);

              // this.clearFolio();
              // this.clearTipoDocumento();
              this.eventsPESPI = [];
              this.filesPESPI = [];
              this.obtenerDetallesTraspaso();
              /* this.archivos = []; */
              Swal.fire({
                title: 'Documentos Guardados',
                icon: 'success',
                timer: 1000,
                showCancelButton: false,
                showConfirmButton: false
              });
            }
          } else {
            // console.log('Agregar Documento');
            this.documentosService.addDocumento(documento).subscribe(resBaseDatos => {
              // console.log(resBaseDatos);
              this.documentosService.saveFileServer(formData, 'guardarDocumentoImportacion').subscribe(res => {
                if (ultimoSeleccionado == l && event.addedFiles.length == i) {
                  this.seleccionadosPESPI = []
                  // this.listDataDetalles = new MatTableDataSource(this.seleccionados);
                  /* this.listDataSeleccionados = new MatTableDataSource(this.seleccionados); */
                  // this.clearFolio();
                  // this.clearTipoDocumento();
                  this.eventsPESPI = [];
                  this.filesPESPI = [];
                  this.obtenerDetallesTraspaso();
                  /* this.archivos = []; */
                  Swal.fire({
                    title: 'Documentos Guardados',
                    icon: 'success',
                    timer: 1000,
                    showCancelButton: false,
                    showConfirmButton: false
                  });
                }

              });
            })
          }

        })
      }

    }
    // this.files.push(...event.addedFiles);
  }

  onSelectPESPI(event) {
    this.eventsPESPI = event
    this.filesPESPI.push(...event.addedFiles);
  }


  onRemoveDocDropzonePESPI(event) {
    this.filesPESPI.splice(this.filesPESPI.indexOf(event), 1);
    this.eventsPESPI.addedFiles.splice(this.eventsPESPI.addedFiles.indexOf(event), 1);

  }



  onAddDocumentosCA() {

    let event = this.eventsCA;
    // console.log(event)
    // console.log(this.seleccionados.length);
    let ultimoSeleccionado = this.seleccionadosCA.length
    for (var l = 0; l < this.seleccionadosCA.length; l++) {
      // console.log(this.seleccionados[l]);
      for (var i = 0; i < event.addedFiles.length; i++) {
        let ClaveProducto = this.seleccionadosCA[l].ClaveProducto.slice(0, -1);
        const formData = new FormData();
        formData.append('0', event.addedFiles[i])
        formData.append('folio', '0')
        formData.append('id', '0')
        formData.append('tipo', 'CA')
        formData.append('lote', this.seleccionadosCA[l].Lote)
        formData.append('clave', ClaveProducto)
        // console.log(res);
        // Buscar ultimo folio Documento
        let documento = new Documento();
        documento.IdDocumneto = 0;
        documento.Folio = 0;
        documento.IdDetalle = 0;
        documento.Modulo = 'Importacion';
        documento.Tipo = 'CA';
        documento.ClaveProducto = ClaveProducto;
        documento.NombreDocumento = event.addedFiles[i].name;
        documento.Path = 'Documentos/CA/0/0/' + ClaveProducto + '/' + this.seleccionadosCA[l].Lote + '/' + event.addedFiles[i].name;
        //Las observaciones se usaran como Lote
        documento.Observaciones = this.seleccionadosCA[l].Lote;

        documento.Vigencia = new Date();
        // console.log(documento);

        //verificar que no exista ese documento en la base de datos

        this.documentosService.getDocumentoFMTDID(documento).subscribe(resExistente => {
          if (resExistente.length > 0) {
            // console.log('Ya existe este documento');
            if (ultimoSeleccionado == l && event.addedFiles.length == i) {
              this.seleccionadosCA = []
              // this.listDataDetalles = new MatTableDataSource(this.seleccionados);
              /* this.listDataSeleccionados = new MatTableDataSource(this.seleccionados); */
              // this.clearFolio();
              // this.clearTipoDocumento();
              this.eventsCA = [];
              this.filesCA = [];
              this.obtenerDetallesTraspaso();
              /* this.archivos = []; */
              Swal.fire({
                title: 'Documentos Guardados',
                icon: 'success',
                timer: 1000,
                showCancelButton: false,
                showConfirmButton: false
              });
            }
          } else {
            // console.log('Agregar Documento');
            this.documentosService.addDocumento(documento).subscribe(resBaseDatos => {
              // console.log(resBaseDatos);
              this.documentosService.saveFileServer(formData, 'guardarDocumentoImportacion').subscribe(res => {
                if (ultimoSeleccionado == l && event.addedFiles.length == i) {
                  this.seleccionadosCA = []
                  // this.listDataDetalles = new MatTableDataSource(this.seleccionados);
                  /* this.listDataSeleccionados = new MatTableDataSource(this.seleccionados); */
                  // this.clearFolio();
                  // this.clearTipoDocumento();
                  this.eventsCA = [];
                  this.filesCA = [];
                  this.obtenerDetallesTraspaso();
                  /* this.archivos = []; */
                  Swal.fire({
                    title: 'Documentos Guardados',
                    icon: 'success',
                    timer: 1000,
                    showCancelButton: false,
                    showConfirmButton: false
                  });
                }

              });
            })
          }

        })
      }

    }
    // this.files.push(...event.addedFiles);
  }



  onSelectCA(event) {

    this.eventsCA = event
    this.filesCA.push(...event.addedFiles);

  }

  onRemoveDocDropzoneCA(event) {

    this.filesCA.splice(this.filesCA.indexOf(event), 1);
    this.eventsCA.addedFiles.splice(this.eventsCA.addedFiles.indexOf(event), 1);

  }


  obtenerDocumentosUSDA(detalle) {

    let clave = detalle.ClaveProducto
    let ClaveProducto = clave.slice(0, -1);
    let Lote = detalle.Lote;

    const formData = new FormData();
    formData.append('folio', detalle.IdTraspasoMercancia);
    formData.append('id', this.numUSDA);
    formData.append('direccionDocumento', 'Documentos/Importacion/USDA/' + detalle.IdTraspasoMercancia.toString());
    this.documentosService.readDirDocuemntosServer(formData, 'cargarNombreDocumentos').subscribe(res => {
      // console.log(res);
      // this.archivosUSDA = [];
      if (res) {
        // console.log(res.length)
        for (let i = 0; i < res.length; i++) {
          let archivo = <any>{};
          archivo.name = res[i];
          archivo.folio = detalle.IdTraspasoMercancia;
          archivo.id = this.numUSDA;
          archivo.clave = ClaveProducto;
          archivo.lote = Lote;
          archivo.path = 'Documentos/Importacion/USDA/' + detalle.IdTraspasoMercancia.toString() + '/' + archivo.name
          this.archivosUSDA.push(archivo);
          const formDataDoc = new FormData();
          formDataDoc.append('folio', detalle.IdTraspasoMercancia);
          formDataDoc.append('id', this.numUSDA);
          formDataDoc.append('archivo', res[i])
          formDataDoc.append('direccionDocumento', 'Documentos/Importacion/USDA/' + detalle.IdTraspasoMercancia.toString());
          this.documentosService.readDocumentosServer(formDataDoc, 'ObtenerDocumento').subscribe(resDoc => {
            //  console.log(resDoc)
            const blob = new Blob([resDoc as BlobPart], { type: 'application/pdf' });
            //  console.log(blob)
            let fr = new FileReader();
            let name = res[i];
            fr.readAsDataURL(blob);
            //  console.log(fr.readAsDataURL(blob));
            fr.onload = e => {
              //  console.log(e);
              //  console.log(fr.result);
              this.tipo = 'documento'
              this.dataURItoBlob(fr.result, name);
            }
          })
        }
      }
      // console.log(this.archivos)
    })

  }

  leerArchivosUSDA(a, enviar) {

    console.log(a);
    const formData = new FormData();
    formData.append('folio', a.folio)
    formData.append('id', a.id)
    formData.append('archivo', a.name)
    formData.append('lote', a.lote)
    formData.append('direccionDocumento', 'Documentos/Importacion/USDA/' + a.folio)
    this.documentosService.readDocumentosServer(formData, 'ObtenerDocumento').subscribe(res => {
      // console.log(res);
      const blob = new Blob([res as BlobPart], { type: 'application/pdf' });
      let fr = new FileReader();

      fr.readAsDataURL(blob);
      fr.onload = e => {
        // console.log(e);
        // console.log(fr.result);
        this.fileUrl = fr.result;
        this.pdfstatus = true;
        this.documentosService.fileUrl = this.fileUrl;
        //^ Si es enviar, solo guardaremos el resultado en  una variable , para enviarla por correo.
        if(enviar == true){
          let temp = Object.assign({}, this.fileUrl);
            this._MessageService.documentosURL.push(temp);
        }else{
          const dialogConfig = new MatDialogConfig();
          dialogConfig.disableClose = true;
          dialogConfig.autoFocus = true;
          dialogConfig.width = "70%";
          this.dialog.open(DocumentacionImportacionVisorDocumentosComponent, dialogConfig);
        }
      }
    })

  }

  onRemoveUSDA(event) {
    console.log(event);
    /* this.archivosUSDA.splice(this.archivosUSDA.indexOf(event), 1); */
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
        formData.append('name', event.name.toString())
        formData.append('folio', event.folio.toString())
        formData.append('id', '')
        formData.append('tipo', 'USDA')
        console.log(formData);
        let docu = new Documento();
        docu.Folio = event.folio;
        docu.Modulo = 'Importacion';
        docu.Tipo = 'USDA';
        docu.NombreDocumento = event.name;
        docu.IdDetalle = event.id
        this.documentosService.borrarDocumentoFMTDID(docu).subscribe(resDelete => {
          console.log(resDelete);
          this.documentosService.deleteDocumentoServer(formData, 'borrarDocumentoImportacion').subscribe(res => {
            console.log(res)
            this.archivosfactura.splice(this.archivosfactura.indexOf(event), 1);
            this.pdfstatus = false;

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


  onAddDocumentosUSDA() {

    let event = this.eventsUSDA;
    // console.log(event)
    // console.log(this.seleccionados.length);
    let ultimoSeleccionado = this.seleccionadosUSDA.length
    for (var l = 0; l < this.seleccionadosUSDA.length; l++) {
      // console.log(this.seleccionados[l]);
      for (var i = 0; i < event.addedFiles.length; i++) {
        let ClaveProducto = this.seleccionadosUSDA[l].ClaveProducto.slice(0, -1);
        const formData = new FormData();
        formData.append('0', event.addedFiles[i])
        formData.append('folio', this.seleccionadosFacturas[l].IdTraspasoMercancia)
        formData.append('id', this.numUSDA)
        formData.append('tipo', 'USDA')
        formData.append('lote', this.seleccionadosUSDA[l].Lote)
        formData.append('clave', ClaveProducto)
        // console.log(res);
        // Buscar ultimo folio Documento
        let documento = new Documento();
        documento.IdDocumneto = 0;
        documento.Folio = this.seleccionadosFacturas[l].IdTraspasoMercancia;
        documento.IdDetalle = this.numUSDA;
        documento.Modulo = 'Importacion';
        documento.Tipo = 'USDA';
        documento.ClaveProducto = ClaveProducto;
        documento.NombreDocumento = event.addedFiles[i].name;
        documento.Path = 'Documentos/USDA/' + this.seleccionadosFacturas[l].IdTraspasoMercancia.toString() + '/' + event.addedFiles[i].name;
        //Las observaciones se usaran como Lote
        documento.Observaciones = this.seleccionadosUSDA[l].Lote;

        documento.Vigencia = new Date();
        // console.log(documento);

        //verificar que no exista ese documento en la base de datos

        this.documentosService.getDocumentoFMTDID(documento).subscribe(resExistente => {
          if (resExistente.length > 0) {
            // console.log('Ya existe este documento');
            if (ultimoSeleccionado == l && event.addedFiles.length == i) {
              this.seleccionadosUSDA = []
              // this.listDataDetalles = new MatTableDataSource(this.seleccionados);
              /* this.listDataSeleccionados = new MatTableDataSource(this.seleccionados); */
              // this.clearFolio();
              // this.clearTipoDocumento();
              this.eventsUSDA = [];
              this.filesUSDA = [];
              // this.numUSDA = '';
              // this.refrescarDocumentos();
              this.updateUSDA();
              /* this.archivos = []; */
              Swal.fire({
                title: 'Documentos Guardados',
                icon: 'success',
                timer: 1000,
                showCancelButton: false,
                showConfirmButton: false
              });
            }
          } else {
            // console.log('Agregar Documento');
            this.documentosService.addDocumento(documento).subscribe(resBaseDatos => {
              // console.log(resBaseDatos);
              this.documentosService.saveFileServer(formData, 'guardarDocumentoImportacion').subscribe(res => {
                if (ultimoSeleccionado == l && event.addedFiles.length == i) {
                  this.seleccionadosUSDA = []
                  // this.listDataDetalles = new MatTableDataSource(this.seleccionados);
                  /* this.listDataSeleccionados = new MatTableDataSource(this.seleccionados); */
                  // this.clearFolio();
                  // this.clearTipoDocumento();
                  this.eventsUSDA = [];
                  this.filesUSDA = [];
                  // this.numUSDA = '';
                  // this.refrescarDocumentos();
                  this.updateUSDA();
                  /* this.archivos = []; */
                  Swal.fire({
                    title: 'Documentos Guardados',
                    icon: 'success',
                    timer: 1000,
                    showCancelButton: false,
                    showConfirmButton: false
                  });
                }

              });
            })
          }

        })
      }

    }
    // this.files.push(...event.addedFiles);


  }

  updateUSDA() {
    //! CHECAR COMO ACTUALIZAR USDA
    let query = 'update detalletraspasomercancia set Usda=' + "'" + this.numUSDA + "'" + ' where IdTraspasoMercancia = ' + this.traspasoSVC.selectTraspaso.IdTraspasoMercancia + ''
    let consulta = {
      'consulta': query
    };

    console.log(query);

    this.traspasoSVC.getQuery(consulta).subscribe((detalles: any) => {
      console.log(detalles);
      this.numUSDA = '';
      this.obtenerDetallesTraspaso();
    })

  }
  Fletera: string = '';
  Caja: string = '';
  actualizarOrdenCarga() {
    let query = 'update OrdenCarga set Fletera=' + "'" + this.Fletera + "'" + ', Caja = ' + "'" + this.Caja + "'" + '  where IdOrdenCarga = ' + this.traspasoSVC.selectTraspaso.IdOrdenCarga + ''
    let consulta = {
      'consulta': query
    };

    console.log(query);

    this.traspasoSVC.getQuery(consulta).subscribe((detalles: any) => {
      console.log(detalles);
    })

  }

  onSelectUSDA(event) {

    this.eventsUSDA = event
    this.filesUSDA.push(...event.addedFiles);

  }

  onRemoveDocDropzoneUSDA(event) {

    this.filesUSDA.splice(this.filesUSDA.indexOf(event), 1);
    this.eventsUSDA.addedFiles.splice(this.eventsUSDA.addedFiles.indexOf(event), 1);

  }


  updateInformacionTraspaso() {
    console.log(this.traspasoSVC.selectTraspaso);
    this.traspasoSVC.updateTraspasoMercancia(this.traspasoSVC.selectTraspaso).subscribe(resUpdate => {
      console.log(resUpdate);
    })
  }









  dataURItoBlob(dataURI: any, fileName: string): File {

    // console.log(dataURI);
    // console.log(fileName);

    // convert base64/URLEncoded data component to a file
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else
      byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    //igualar documento a tipo File 
    let file = new File([ia], fileName, { type: mimeString });

    return new File([ia], fileName, { type: mimeString });
  }

//^ Metodo para enviar correo con archivos Adjuntos
  enviarTraspaso() {

    // console.log(this.traspasoSVC.selectTraspaso);
    // console.log(this.archivosfactura);
    // console.log(this.archivosCLV);
    // console.log(this.archivosCO);
    // console.log(this.archivosPESPI);
    // console.log(this.archivosCA);
    // console.log(this.archivosUSDA);

    //^ Guardamos la informacion de los Archivos en un Arreglo.

    this.archivosfactura.forEach(element => {      
      this._MessageService.documentosURL.push(element);
    });

    this.archivosCLV.forEach(element => {
    this._MessageService.documentosURL.push(element);
    });

    this.archivosCO.forEach(element => {
    this._MessageService.documentosURL.push(element);
     });

    this.archivosPESPI.forEach(element => {
    this._MessageService.documentosURL.push(element);
    });

    this.archivosCA.forEach(element => {
    this._MessageService.documentosURL.push(element);
    });

    this.archivosUSDA.forEach(element => {
    this._MessageService.documentosURL.push(element);
    });

    // console.log(this._MessageService.documentosURL);


//^ Variables que iran adjuntas al enviar el Correo.

    this._MessageService.correo = 'javier.sierra@riztek.com.mx';
    this._MessageService.cco = 'ivan.talamantes@riztek.com.mx';
    this._MessageService.asunto = 'Envio Orden de Traspaso ' + this.traspasoSVC.selectTraspaso.Folio;
    this._MessageService.cuerpo = 'Se ha enviado un comprobante fiscal digital con folio ' + this.traspasoSVC.selectTraspaso.Folio;
    this._MessageService.nombre = 'ProlactoIngredientes';

    //^ Generamos el modal del Correo

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "90%";
    //^ Asignamos variables en base a la Informacion del Documento.
    dialogConfig.data = {
      foliop: this.traspasoSVC.selectTraspaso.Folio,
      cliente: this.traspasoSVC.selectTraspaso.Nombre,
      status: true,
      //^ Indicamos que es de Tipo Traspaso
      tipo: 'Traspaso'
    }
     this.dialog.open(EmailgeneralComponent, dialogConfig);




  }





}
