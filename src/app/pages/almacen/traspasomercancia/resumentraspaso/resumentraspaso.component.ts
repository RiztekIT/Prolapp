import { Component, OnInit, ViewChild } from '@angular/core';
import { TraspasoMercanciaService } from 'src/app/services/importacion/traspaso-mercancia.service';
import { MatTableDataSource, MatSort, MatPaginator, MatDialogConfig, MatDialog } from '@angular/material';
import { DocumentosImportacionService } from 'src/app/services/importacion/documentos-importacion.service';
import Swal from 'sweetalert2';
import { DocumentacionImportacionVisorDocumentosComponent } from 'src/app/pages/importacion/documentacion-importacion-visor-documentos/documentacion-importacion-visor-documentos.component';
import { Documento } from 'src/app/Models/documentos/documento-model';

@Component({
  selector: 'app-resumentraspaso',
  templateUrl: './resumentraspaso.component.html',
  styleUrls: ['./resumentraspaso.component.css']
})
export class ResumentraspasoComponent implements OnInit {

  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Clave', 'Producto','PesoTotal','Sacos'];
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  archivosfactura: any[];
  archivosCLV: any[];
  archivosCO: any[];
  archivosCA: any[];
  archivosPESPI: any[];
  tipo: string;
   //Estatus
   pdfstatus = false;

   //File URL del pdf, para ser mostrado en el visor de decumentos
   fileUrl;
 
  constructor(public traspasoSVC: TraspasoMercanciaService, public documentosService: DocumentosImportacionService, private dialog: MatDialog) { }

  ngOnInit() {
    this.obtenerDetallesTraspaso();
    
  }


  obtenerDetallesTraspaso(){

    

      let query = 'select DetalleTraspasoMercancia.*, DetalleTarima.*, OrdenTemporal.* from DetalleTraspasoMercancia left join detalletarima on DetalleTraspasoMercancia.IdDetalle=detalletarima.IdDetalleTarima left join OrdenTemporal on OrdenTemporal.IdDetalleTarima=DetalleTarima.IdDetalleTarima where DetalleTraspasoMercancia.IdTraspasoMercancia=3'
      let consulta = {
        'consulta':query
      };

      this.traspasoSVC.getQuery(consulta).subscribe((detalles: any)=>{
        console.log(detalles);
        this.listData = new MatTableDataSource(detalles);
        this.listData.sort = this.sort;
   /*      this.listData.paginator = this.paginator;
        this.listData.paginator._intl.itemsPerPageLabel = 'Traspasos por Pagina'; */
        for (let i=0; i< detalles.length;i++){

          this.obtenerDocumentosFactura(detalles[i],detalles[i].IdOrdenDescarga,detalles[i].IdDetalleTarima);
          this.obtenerDocumentosCLV(detalles[i]);
        }
      })
    



  }

  obtenerDocumentosFactura(row,folio: number, id: number) {

    console.log(folio, id);
    console.log(row,'ROW');

    const formData = new FormData();
    formData.append('folio', row.Lote.toString());
    formData.append('id', id.toString());
    formData.append('direccionDocumento', 'Documentos/Importacion/Factura/'+folio.toString()+'/'+id.toString());
    this.documentosService.readDirDocuemntosServer(formData, 'cargarNombreDocumentos').subscribe(res => {
      // console.log(res);
      this.archivosfactura = [];
      if (res) {
        // console.log(res.length)
        for (let i = 0; i < res.length; i++) {
          let archivo = <any>{};
          archivo.name = res[i];
          archivo.id = id;
          archivo.folio = row.IdOrdenDescarga;
          this.archivosfactura.push(archivo);
          const formDataDoc = new FormData();
          formDataDoc.append('folio', folio.toString());
          formDataDoc.append('id', id.toString());
          formDataDoc.append('archivo', res[i])
          formDataDoc.append('direccionDocumento', 'Documentos/Importacion/Factura/'+folio.toString()+'/'+id.toString());
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

  leerArchivosfactura(a) {
    console.log(a);
    const formData = new FormData();
    formData.append('folio', a.folio.toString())
    formData.append('id', a.id.toString())
    formData.append('archivo', a.name)
    formData.append('direccionDocumento', 'Documentos/Importacion/Factura/'+a.folio.toString()+'/'+a.id.toString())
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
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "70%";
        this.dialog.open(DocumentacionImportacionVisorDocumentosComponent, dialogConfig);
      }
    })

  }

  onRemoveFactura(event) {
    console.log(event);
    Swal.fire({
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
            // this.files.splice(this.files.indexOf(event),1);
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


  obtenerDocumentosCLV(detalle) {

    // console.log(folio, id);
    let clave = detalle.ClaveProducto
    let ClaveProducto = clave.slice(0,-1)

    const formData = new FormData();
    formData.append('folio', '0');
    formData.append('id', '0');
    formData.append('direccionDocumento', 'Documentos/Importacion/CLV/0/0/'+ClaveProducto);
    this.documentosService.readDirDocuemntosServer(formData, 'cargarNombreDocumentos').subscribe(res => {
      // console.log(res);
      this.archivosCLV = [];
      if (res) {
        // console.log(res.length)
        for (let i = 0; i < res.length; i++) {
          let archivo = <any>{};
          archivo.name = res[i];
          archivo.id = ClaveProducto;
          archivo.folio = 0;
          this.archivosCLV.push(archivo);
          const formDataDoc = new FormData();
          formDataDoc.append('folio', '0');
          formDataDoc.append('id', ClaveProducto);
          formDataDoc.append('archivo', res[i])
          formDataDoc.append('direccionDocumento', 'Documentos/Importacion/CLV/0/0/'+ClaveProducto);
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

  leerArchivosCA(a){

  }

  onRemoveCA(a){
    
  }
  leerArchivosCLV(a){

  }

  onRemoveCLV(a){

  }
  leerArchivosCO(a){

  }

  onRemoveCO(a){

  }
  leerArchivosPESPI(a){

  }

  onRemovePESPI(a){
    
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

}
