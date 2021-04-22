import { Component, OnChanges, OnInit, Input, Output, EventEmitter, SimpleChanges, ViewChild } from '@angular/core';
import { FileElement } from 'src/app/Models/explorardor-archivos/FileElement';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FileService } from '../../services/explorador-archivos/explorador.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Documento } from 'src/app/Models/documentos/documento-model';
import { DocumentosImportacionService } from 'src/app/services/importacion/documentos-importacion.service';

@Component({
  selector: 'app-explorador-documentos',
  templateUrl: './explorador-documentos.component.html',
  styleUrls: ['./explorador-documentos.component.css']
})
export class ExploradorDocumentosComponent implements OnInit, OnChanges  {

  constructor(public dialog: MatDialog, private fileService:  FileService,  public documentosService: DocumentosImportacionService,) { }

  ngOnInit() {
    console.log(this.fileService.archivosAdjuntadosCorreo);
    if(this.fileService.archivosAdjuntadosCorreo.length> 0){
      this.archivosSeleccionados = this.fileService.archivosAdjuntadosCorreo;
      this.actualizarTablaDocumentosSeleccionados();
    }
  }
  @Input() fileElements: FileElement[];
  @Input() canNavigateUp: string;
  @Input() path: string;

  @Output() folderAdded = new EventEmitter<{ name: string }>();
  @Output() elementRemoved = new EventEmitter<FileElement>();
  @Output() elementRenamed = new EventEmitter<FileElement>();
  @Output() navigatedDown = new EventEmitter<FileElement>();
  @Output() elementMoved = new EventEmitter<{ element: FileElement; moveTo: FileElement }>();
  @Output() navigatedUp = new EventEmitter();


  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Documento', 'Path', 'Options'];
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


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

  //Variable para identificar si el archivo es un documento o una imagen
  tipo: string;

  //******************** VARIABLES DOCUMENTOS (API, DROPZONE) ********************//


  ngOnChanges(changes: SimpleChanges): void {}

  deleteElement(element: FileElement) {
    this.elementRemoved.emit(element);
  }

  navigate(element: FileElement) {
    if (element.isFolder) {
      this.navigatedDown.emit(element);
    }
  }

 archivosSeleccionados = [];
  agregarArchivo(element){
      console.log(element);
      console.log(this.archivosSeleccionados);
      if(this.archivosSeleccionados.length > 0){
        console.log('Ya hay archivos');
        console.log(this.archivosSeleccionados.find(documento => documento.name === element.name));
        if(this.archivosSeleccionados.find(documento => documento.name === element.name) != undefined){
          console.log('ya se selecciono este doc');
          Swal.fire({
            title: 'Documento Ya seleccionado',
            icon: 'error',
            timer: 1000,
            showCancelButton: false,
            showConfirmButton: false
          });
        }else{          
          console.log('documento nuevo');
          this.archivosSeleccionados.push(element);
          Swal.fire({
            title: 'Documento Agregado',
            icon: 'success',
            timer: 1000,
            showCancelButton: false,
            showConfirmButton: false
          });
        }
      }else{
        console.log('No hay Archivos');
        Swal.fire({
          title: 'Documento Agregado',
          icon: 'success',
          timer: 1000,
          showCancelButton: false,
          showConfirmButton: false
        });
        this.archivosSeleccionados.push(element);
      }
      this.actualizarTablaDocumentosSeleccionados();
      console.log(this.archivosSeleccionados);
  }

  actualizarTablaDocumentosSeleccionados(){
    console.log(this.archivosSeleccionados);
    this.fileService.archivosAdjuntadosCorreo = this.archivosSeleccionados;
    this.listData = new MatTableDataSource(this.archivosSeleccionados);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    this.listData.paginator._intl.itemsPerPageLabel = 'Documentos por Pagina';
  }

  eliminarDocumento(row){
    // console.log(row);
    this.archivosSeleccionados.splice(row, 1);
    this.actualizarTablaDocumentosSeleccionados();
  }

  adjuntarArchivos(){
    console.log(this.archivosSeleccionados);
    this.fileService.archivosAdjuntadosCorreo = this.archivosSeleccionados;
    this.fileService.filter('');
    Swal.fire({
      title: 'Archivos Adjuntados',
      icon: 'success',
      timer: 1000,
      showCancelButton: false,
      showConfirmButton: false
    });
  }

  navigateUp() {
    this.navigatedUp.emit();
  }

  moveElement(element: FileElement, moveTo: FileElement) {
    this.elementMoved.emit({ element: element, moveTo: moveTo });
  }

  openNewFolderDialog() {
    // let dialogRef = this.dialog.open(NewFolderDialogComponent);
    // dialogRef.afterClosed().subscribe(res => {
    //   if (res) {
    //     this.folderAdded.emit({ name: res });
    //   }
    // });
  }

  openRenameDialog(element: FileElement) {
    // let dialogRef = this.dialog.open(RenameDialogComponent);
    // dialogRef.afterClosed().subscribe(res => {
    //   if (res) {
    //     element.name = res;
    //     this.elementRenamed.emit(element);
    //   }
    // });
  }

  openMenu(event: MouseEvent, element: FileElement, viewChild: MatMenuTrigger) {
    event.preventDefault();
    viewChild.openMenu();
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
            this.fileService.filterUpdate('update');
            Swal.fire({
              title: 'Documento(s) Guardados',
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
                this.fileService.filterUpdate('update');
                // this.obtenerDocumentosGenerales();
                Swal.fire({
                  title: 'Documento(s) Guardados',
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
// leerArchivos(a) {
//   console.log(a);
//   const formData = new FormData();
//   formData.append('folio', '0')
//   formData.append('id', '0')
//   formData.append('archivo', a.name)
//   formData.append('direccionDocumento', 'Documentos/Importacion/General')
//   this.documentosService.readDocumentosServer(formData, 'ObtenerDocumento').subscribe(res => {
//     // console.log(res);
//     const blob = new Blob([res as BlobPart], { type: 'application/pdf' });
//     let fr = new FileReader();

//     fr.readAsDataURL(blob);
//     fr.onload = e => {
//       // console.log(e);
//       // console.log(fr.result);
//       this.fileUrl = fr.result;
//       this.pdfstatus = true;
//       this.documentosService.fileUrl = this.fileUrl;
//       const dialogConfig = new MatDialogConfig();
//       dialogConfig.disableClose = true;
//       dialogConfig.autoFocus = true;
//       dialogConfig.width = "70%";
//       this.dialog.open(DocumentacionImportacionVisorDocumentosComponent, dialogConfig);
//     }
//   })

// }

// obtenerDocumentos(row) {
//   console.log(row);
// // const formData = new FormData();
// //     this.documentosService.readDirDocumentosServer(formData, 'cargarNombreDocumentos').subscribe(res => {
// //       console.log(res);
// //     })

//   // console.log(folio, id);
//  //  let ClaveProducto = this.ClaveProducto
//  //  console.log('%c%s', 'color: #cc0036', this.ClaveProducto);

//   const formData = new FormData();
//   //Folio de la Orden
//   formData.append('folio', '0');
//   //Id Detalle Tarima
//   formData.append('id', '0');
//   formData.append('direccionDocumento', 'Documentos/Importacion/General');
//   console.log(formData);
//   this.documentosService.readDirDocuemntosServer(formData, 'cargarNombreDocumentos').subscribe(res => {
//     console.log(res);
//     this.archivos = [];
//     if (res) {
//       // console.log(res.length)
//       for (let i = 0; i < res.length; i++) {
//         if(res[i] == row.NombreDocumento){
//         let archivo = <any>{};
//         archivo.name = res[i];
//         archivo.id = 0
//         archivo.folio = 0;
//         this.archivos.push(archivo);
//         const formDataDoc = new FormData();
//         formDataDoc.append('folio', '0');
//         formDataDoc.append('id', '0');
//         formDataDoc.append('archivo', res[i])
//         formDataDoc.append('direccionDocumento', 'Documentos/Importacion/General');
//         this.documentosService.readDocumentosServer(formDataDoc, 'ObtenerDocumento').subscribe(resDoc => {
//           //  console.log(resDoc)
//           const blob = new Blob([resDoc as BlobPart], { type: 'application/pdf' });
//           //  console.log(blob)
//           let fr = new FileReader();
//           let name = res[i];
//           fr.readAsDataURL(blob);
//           //  console.log(fr.readAsDataURL(blob));
//           fr.onload = e => {
//             //  console.log(e);
//             //  console.log(fr.result);
//             this.tipo = 'documento'
//             this.dataURItoBlob(fr.result, name);
//           }
//         })
//        }
//       }
//     }
//     // console.log(this.archivos)
//   })

// }

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
// onRemove(event) {
//   console.log(event);
//   Swal.fire({
//     title: '¿Seguro de Borrar Documento?',
//     icon: 'warning',
//     showCancelButton: true,
//     confirmButtonColor: '#d33',
//   cancelButtonColor: '#3085d6',
//     confirmButtonText: 'Borrar',
//     cancelButtonText: 'Cancelar'
//   }).then((result) => {
//     if (result.value) {
//       const formData = new FormData();
//       formData.append('name', event.name.toString())
//       formData.append('folio', '0')
//       formData.append('id', '0')
//       formData.append('tipo', 'General')
//       formData.append('clave', '')
//       console.log(formData);
//       let docu = new Documento();
//       docu.Folio = event.folio;
//       docu.Modulo = 'Importacion';
//       docu.Tipo = 'General';
//       docu.NombreDocumento = event.name;
//       docu.IdDetalle = event.id
//       this.documentosService.borrarDocumentoFMTDID(docu).subscribe(resDelete=>{
//         console.log(resDelete);
//         this.documentosService.deleteDocumentoServer(formData, 'borrarDocumentoImportacion').subscribe(res => {
//           console.log(res)
//           // this.files.splice(this.files.indexOf(event),1);
//           this.archivos.splice(this.archivos.indexOf(event), 1);
//           this.pdfstatus = false;
//           this.obtenerDocumentosGenerales();
//           Swal.fire({
//             title: 'Borrado',
//             icon: 'success',
//             timer: 1000,
//             showCancelButton: false,
//             showConfirmButton: false
//           });
//         })
//       })


//     }
//   })

// }

    //******************** METODOS ARCHIVOS  ********************// 


}
