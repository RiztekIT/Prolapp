
import { Component, OnInit, ViewChild } from '@angular/core';

import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs';

import { map, startWith } from 'rxjs/operators';

import { Producto } from 'src/app/Models/catalogos/productos-model';

import { ImgInfo } from 'src/app/Models/Imagenes/imgInfo-model';

import { AddsproductosService } from 'src/app/services/addsproductos.service';

import { ProductosService } from 'src/app/services/catalogos/productos.service';

import { DocumentosImportacionService } from 'src/app/services/importacion/documentos-importacion.service';

import { MatTableDataSource, MatPaginator, MatTable, MatDialog, MatSnackBar, MatDialogConfig } from '@angular/material';

import { DocumentacionImportacionVisorDocumentosComponent } from '../../documentacion-importacion-visor-documentos/documentacion-importacion-visor-documentos.component';

import { Documento } from 'src/app/Models/documentos/documento-model';

import Swal from 'sweetalert2';

import { MatSort } from '@angular/material/sort';

import { TraspasoMercanciaService } from 'src/app/services/importacion/traspaso-mercancia.service';

import { EventosService } from 'src/app/services/eventos/eventos.service';

@Component({
  selector: 'app-documentacion-general-importacion',
  templateUrl: './documentacion-general-importacion.component.html',
  styleUrls: ['./documentacion-general-importacion.component.css']
})
export class DocumentacionGeneralImportacionComponent implements OnInit {

  constructor(public ServiceProducto: ProductosService, 
    public addproductos: AddsproductosService, 
    public documentosService: DocumentosImportacionService,  
    private dialog: MatDialog, 
    public traspasoSVC:TraspasoMercanciaService,
    private eventosService:EventosService,) { 
    this.productosExistentes = false;
  }

  ngOnInit() {
    this.obtenerDocumentosGenerales();
  }
    //******************** VARIABLES DOCUMENTOS (API, DROPZONE) ********************//

  //guardar arreglo de documentos del dropzone
  events: any;

  //Arreglo donde se guardan los nombres de los Documentos
  archivos: any[];

  //Variable de onjetos donde se guardaran los Documentos/Imagenes TIPO FILE ( estos son los que son enviados al server como parametro, para ser adjuntasos en el email)
  files: File[] = [];
  filesImagen: File[] = [];

  //Estatus
  pdfstatus = false;

  //File URL del pdf, para ser mostrado en el visor de decumentos
  fileUrl;

  //Arreglo de objetos donde se guardaran las fotos obtenidas del server
  imageInfo: ImgInfo[] = [];
  imagenes: any[];

  //Variable para identificar si el archivo es un documento o una imagen
  tipo: string;

  //******************** VARIABLES DOCUMENTOS (API, DROPZONE) ********************//

  //Tabla detalles Seleccionados
  listDataSeleccionados: MatTableDataSource<any>;
  // seleccionados = new Array<any>();
  displayedColumnsSeleccionados: string[] = ['Nombre', 'Options'];
  @ViewChild(MatSort, null) sortSeleccionados: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginatorSeleccionados: MatPaginator;


    //Esta variable especifica si hay productos en la tabla productos Seleccionados
productosExistentes: boolean;

obtenerDocumentosGenerales(){
  let query = "select * from Documentos where Tipo = 'General'"
        let consulta = {
          'consulta': query
        };
        this.traspasoSVC.getQuery(consulta).subscribe((documentos: any) => {
          console.log(documentos);
          this.listDataSeleccionados = new MatTableDataSource(documentos);
        this.listDataSeleccionados.sort = this.sortSeleccionados;
        this.listDataSeleccionados.paginator = this.paginatorSeleccionados;
        })

}

      //******************** METODOS ARCHIVOS  ********************//

     
 //Agregar documentos a la base de datos y Servidor
 onAddDocumentos() {

   let event = this.events;
   console.log(event)

 
     for (var i = 0; i < event.addedFiles.length; i++) {
       const formData = new FormData();
       formData.append('0', event.addedFiles[i])
       formData.append('folio', '0')
       formData.append('id', '0')
       formData.append('tipo', 'General')
       // console.log(res);
       // Buscar ultimo folio Documento
       let documento = new Documento();
       documento.IdDocumneto = 0;
       documento.Folio = 0;
       documento.IdDetalle = 0;
       documento.Modulo = 'Importacion';
       documento.Tipo = 'General';
       documento.ClaveProducto = '';
       documento.NombreDocumento = event.addedFiles[i].name;
       documento.Path = 'Documentos/General/' + event.addedFiles[i].name;
       documento.Observaciones = '';
       documento.Vigencia = new Date();
       console.log(documento);

       //verificar que no exista ese documento en la base de datos

       this.documentosService.getDocumentoFMTDID(documento).subscribe(resExistente => {
         if (resExistente.length > 0) {
           console.log('Ya existe este documento');
           if (event.addedFiles.length == i) {
          console.log('ultimo seleccioanado');
             this.events = [];
             this.files = [];
             this.archivos = [];
             this.obtenerDocumentosGenerales();
             Swal.fire({
               title: 'Documentos Guardados',
               icon: 'success',
               timer: 1000,
               showCancelButton: false,
               showConfirmButton: false
             });
           }
         } else {
           console.log('Agregar Documento');
           this.documentosService.addDocumento(documento).subscribe(resBaseDatos => {
             console.log(resBaseDatos);
             this.documentosService.saveFileServer(formData, 'guardarDocumentoImportacion').subscribe(res => {
               console.log('%c%s', 'color: #ff6600', res);
               if ( event.addedFiles.length == i) {
                  console.log('ultimo seleccionado');
                 this.events = [];
                 this.files = [];
                 this.archivos = [];
                 this.obtenerDocumentosGenerales();
                 
                 this.eventosService.movimientos('Agregar Documento General')
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

 
   // this.files.push(...event.addedFiles);
 }


 //Leer archivo/documento del Servidor
 leerArchivos(a) {
   console.log(a);
   const formData = new FormData();
   formData.append('folio', '0')
   formData.append('id', '0')
   formData.append('archivo', a.name)
   formData.append('direccionDocumento', 'Documentos/Importacion/General')
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

 obtenerDocumentos(row) {
   console.log(row);
// const formData = new FormData();
//     this.documentosService.readDirDocumentosServer(formData, 'cargarNombreDocumentos').subscribe(res => {
//       console.log(res);
//     })

   // console.log(folio, id);
  //  let ClaveProducto = this.ClaveProducto
  //  console.log('%c%s', 'color: #cc0036', this.ClaveProducto);

   const formData = new FormData();
   //Folio de la Orden
   formData.append('folio', '0');
   //Id Detalle Tarima
   formData.append('id', '0');
   formData.append('direccionDocumento', 'Documentos/Importacion/General');
   console.log(formData);
   this.documentosService.readDirDocuemntosServer(formData, 'cargarNombreDocumentos').subscribe(res => {
     console.log(res);
     this.archivos = [];
     if (res) {
       // console.log(res.length)
       for (let i = 0; i < res.length; i++) {
         if(res[i] == row.NombreDocumento){
         let archivo = <any>{};
         archivo.name = res[i];
         archivo.id = 0
         archivo.folio = 0;
         this.archivos.push(archivo);
         const formDataDoc = new FormData();
         formDataDoc.append('folio', '0');
         formDataDoc.append('id', '0');
         formDataDoc.append('archivo', res[i])
         formDataDoc.append('direccionDocumento', 'Documentos/Importacion/General');
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

 //Agregar Documento al arreglo events(este arreglo es el que se usa para guardar Docs en Server y Base de datos) y al arreglo files(dropzone)
 onSelect(event) {

   this.events = event
   this.files.push(...event.addedFiles);

 }
 //Eliminar documento de arreglos locales
 onRemoveDocDropzone(event) {
   this.files.splice(this.files.indexOf(event), 1);
   this.events.addedFiles.splice(this.events.addedFiles.indexOf(event), 1);
 }
 //Eliminar Documento del Servidor
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
       formData.append('name', event.name.toString())
       formData.append('folio', '0')
       formData.append('id', '0')
       formData.append('tipo', 'General')
       formData.append('clave', '')
       console.log(formData);
       let docu = new Documento();
       docu.Folio = event.folio;
       docu.Modulo = 'Importacion';
       docu.Tipo = 'General';
       docu.NombreDocumento = event.name;
       docu.IdDetalle = event.id
       this.documentosService.borrarDocumentoFMTDID(docu).subscribe(resDelete=>{
         console.log(resDelete);
         this.documentosService.deleteDocumentoServer(formData, 'borrarDocumentoImportacion').subscribe(res => {
           console.log(res)
           // this.files.splice(this.files.indexOf(event),1);
           this.archivos.splice(this.archivos.indexOf(event), 1);
           this.pdfstatus = false;
           this.obtenerDocumentosGenerales();
           
           this.eventosService.movimientos('Documento General Borrado')
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

     //******************** METODOS ARCHIVOS  ********************// 

}
