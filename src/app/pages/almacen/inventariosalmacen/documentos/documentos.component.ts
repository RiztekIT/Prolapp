import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material';
import { DocumentosImportacionService } from 'src/app/services/importacion/documentos-importacion.service';
import { DocumentacionImportacionVisorDocumentosComponent } from 'src/app/pages/importacion/documentacion-importacion-visor-documentos/documentacion-importacion-visor-documentos.component';
import Swal from 'sweetalert2';
import { TarimaService } from 'src/app/services/almacen/tarima/tarima.service';

export interface parametros{
  compra: any,
        
}


@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.css']
})
export class DocumentosComponent implements OnInit {
  archivos: any[];
  fileUrl;
  pdfstatus = false;
  tipo: string;
  constructor(public dialogRef: MatDialogRef<DocumentosComponent>,@Inject(MAT_DIALOG_DATA) public data: parametros,public documentosService: DocumentosImportacionService, private dialog: MatDialog, public serviceTarima: TarimaService) { }

  ngOnInit() {

    console.log(this.serviceTarima.compra);

    console.log('%c%s', 'color: #00a3cc', 'IMPRIMIR COLORRRRR');

    this.obtenerDocumentos(this.serviceTarima.compra.Folio, this.serviceTarima.compra.IdDetalleCompra)

  }

  leerArchivos(a) {
    console.log(a);
    const formData = new FormData();
    formData.append('folio', a.folio.toString())
    formData.append('id', a.id.toString())
    formData.append('archivo', a.name)
    this.documentosService.readDocumentosServer(formData, 'ObtenerDocumentoImportacionCompras').subscribe(res => {
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


  obtenerDocumentos(folio: number, id: number) {

    console.log(folio, id);

    const formData = new FormData();
    formData.append('folio', folio.toString());
    formData.append('id', id.toString());
    this.documentosService.readDirDocuemntosServer(formData, 'cargarNombreDocumentosImportacionCompras').subscribe(res => {
      // console.log(res);
      this.archivos = [];
      if (res) {
        // console.log(res.length)
        for (let i = 0; i < res.length; i++) {
          let archivo = <any>{};
          archivo.name = res[i];
          archivo.id = id;
          archivo.folio = folio;
          this.archivos.push(archivo);
          const formDataDoc = new FormData();
          formDataDoc.append('folio', folio.toString());
          formDataDoc.append('id', id.toString());
          formDataDoc.append('archivo', res[i])
          this.documentosService.readDocumentosServer(formDataDoc, 'ObtenerDocumentoImportacionCompras').subscribe(resDoc => {
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
      }else{
        Swal.fire({
          title: 'Error',
          icon: 'error',
          text: 'Documento no encontrado',
          timer: 1000,
          showCancelButton: false,
          showConfirmButton: false
        });
      }
      // console.log(this.archivos)
    })

  }

    //Metodo para convertir imagen base64 a tipo File
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
