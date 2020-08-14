import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatTable, MatDialog, MatSnackBar, MatDialogConfig } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DocumentosImportacionService } from '../../../../services/importacion/documentos-importacion.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ImgInfo } from 'src/app/Models/Imagenes/imgInfo-model';
import { DocumentacionImportacionVisorDocumentosComponent } from '../../documentacion-importacion-visor-documentos/documentacion-importacion-visor-documentos.component';
import { Documento } from '../../../../Models/documentos/documento-model';

@Component({
  selector: 'app-documentacion-formulario-importacion',
  templateUrl: './documentacion-formulario-importacion.component.html',
  styleUrls: ['./documentacion-formulario-importacion.component.css']
})
export class DocumentacionFormularioImportacionComponent implements OnInit {

  constructor(public documentosService: DocumentosImportacionService, public router: Router, private dialog: MatDialog,) {
    this.productosExistentes = false;
  }

  ngOnInit() {
    if (this.documentosService.folioOrdenDescarga) {
      this.folioOrdenDescarga = this.documentosService.folioOrdenDescarga;
      this.obtenerOrdenesDescargaDetalles(this.folioOrdenDescarga);

    }
  }

  //Tabla Detalle Orden Descarga
  listDataDetalles: MatTableDataSource<any>;
  detallesOrdenDescarga = new Array<any>();
  displayedColumnsDetalles: string[] = ['Agregar', 'ClaveProducto', 'Producto', 'Lote', 'USDA', 'Pedimento', 'Options'];
  @ViewChild(MatSort, null) sortDetalles: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginatorDetalles: MatPaginator;

  //Tabla detalles Seleccionados
  listDataSeleccionados: MatTableDataSource<any>;
  seleccionados = new Array<any>();
  displayedColumnsSeleccionados: string[] = ['Folio', 'ClaveProducto', 'Producto', 'Lote', 'Tipo', 'Options'];
  @ViewChild(MatSort, null) sortSeleccionados: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginatorSeleccionados: MatPaginator;

  folioOrdenDescarga: number;

  //Esta variable especifica si hay productos en la tabla productos Seleccionados
  productosExistentes: boolean;

  //Dropdown Tipo de Documentos
  myControlTipoDocumento = new FormControl();
  filteredOptionsTipoDocumento: Observable<any[]>;
  //Lista de Documentos
  public listTipoDocumentos: Array<Object> = [
    { Tipo: 'USDA' },
    { Tipo: 'PEDIMENTO' },
    { Tipo: 'OTRO' }
  ];
  //Tipo Documento Seleccionado
  tipoDocumentoSeleccionado: String;
  //guardar el # del documento
  stringDocumentoSeleccionado: string = "";


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

  //On change Folio
  onChangeFolio(folio: any) {
    // console.log(cantidad);
    let elemHTML: any = document.getElementsByName('Folio')[0];
    this.validarFolio(folio);
    elemHTML.value = this.folioOrdenDescarga;
    //Transformar la Cantidad en entero e igualarlo a la variable Cantidad
    // this.calcularImportePedido();
    console.log(this.folioOrdenDescarga);
  }

  //Validar que el folio no sea nula o menor a 0
  validarFolio(folio: any) {
    // console.log(cantidad + ' CANTIDAD');
    this.folioOrdenDescarga = +folio;
    if (this.folioOrdenDescarga <= 0) {
      this.folioOrdenDescarga = 0;
    }
    if (this.folioOrdenDescarga == null) {
      this.folioOrdenDescarga = 0;
    }
  }

  clearFolio() {
    this.folioOrdenDescarga = null;
  }

  clearTipoDocumento() {
    this.tipoDocumentoSeleccionado = "";
    this.stringDocumentoSeleccionado = "";
  }

  //llenar tabla con detalles Orden Descarga
  obtenerOrdenesDescargaDetalles(folio: number) {
    console.log(folio);
    if (folio) {

      this.documentosService.getOrdenDescargaFolio(folio).subscribe(dataOD => {
        console.log(dataOD);
        if (dataOD.length > 0) {
          this.documentosService.getDetalleOrdenDescargaId(dataOD[0].IdOrdenDescarga).subscribe(dataDOD => {
            console.log(dataDOD);
            for (let i = 0; i <= dataDOD.length - 1; i++) {
              this.detallesOrdenDescarga[i] = dataDOD[i];
              this.detallesOrdenDescarga[i].Agregar = false;
              this.detallesOrdenDescarga[i].Folio = folio;
            }

            console.log(this.detallesOrdenDescarga);

            this.listDataDetalles = new MatTableDataSource(dataDOD);
            this.listDataDetalles.sort = this.sortDetalles;
            // this.listDataDetalles.paginator = this.paginatorDetalles;
            // this.listDataDetalles.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
          })
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Favor de Verificar el Estatus',
            icon: 'error',
            timer: 1000,
            showCancelButton: false,
            showConfirmButton: false
          });
        }
      })
    } else {
      Swal.fire({
        title: 'Folio no valido',
        icon: 'error',
        timer: 1000,
        showCancelButton: false,
        showConfirmButton: false
      });
    }
  }

  Regresar() {
    this.router.navigate(['/documentacion-importacion']);
  }

  addToList(checkbox: any, row: any) {
    console.log(checkbox);
    console.log(row);
    //si checkbox == true
    if (checkbox == true) {
      this.seleccionados.push(row);
    }
    //si es falso
    else {
      this.seleccionados.splice(this.seleccionados.indexOf(row), 1);
    }
    this.verificarProductosSeleccionados();

  }

  removeFromList(row: any) {
    console.log(row);
    this.seleccionados.splice(this.seleccionados.indexOf(row), 1);
    this.verificarProductosSeleccionados();

  }

  //este metodo verifica si aun hay datos en la tabla de productos seleccionados
  verificarProductosSeleccionados() {
    if (this.seleccionados.length > 0) {
      this.productosExistentes = true;
    } else {
      this.productosExistentes = false;
    }
    this.listDataSeleccionados = new MatTableDataSource(this.seleccionados);
    this.listDataDetalles.sort = this.sortDetalles;
  }

  onSelectionChangeTipoDocumento(options: any, event: any) {
    if (event.isUserInput) {
      console.log(options);
      console.log(event);
      // this.NombreProveedor = options.Nombre;
      // this.compra.Proveedor = options.Nombre;
    }

  }

  //Agregar documentos a la base de datos y Servidor
  onAddDocumentos() {

    let event = this.events;
    // console.log(event)
    // console.log(this.seleccionados.length);
    let ultimoSeleccionado = this.seleccionados.length
    for (var l = 0; l < this.seleccionados.length; l++) {
      // console.log(this.seleccionados[l]);
      //update detalles Orden descarga
      this.actualizarTipoDocumento(this.seleccionados[l]);
      for (var i = 0; i < event.addedFiles.length; i++) {
        const formData = new FormData();
        formData.append('0', event.addedFiles[i])
        formData.append('folio', this.seleccionados[l].Folio.toString())
        formData.append('id', this.seleccionados[l].IdDetalleOrdenDescarga)
        // console.log(res);
        // Buscar ultimo folio Documento
        let documento = new Documento();
        documento.IdDocumneto = 0;
        documento.Folio = this.folioOrdenDescarga;
        documento.IdDetalle = this.seleccionados[l].IdDetalleOrdenDescarga;
        documento.Modulo = 'Importacion';
        documento.Tipo = 'OrdenDescarga';
        documento.ClaveProducto = this.seleccionados[l].ClaveProducto;
        documento.NombreDocumento = event.addedFiles[i].name;
        documento.Path = 'Documentos/OrdenDescarga/' + this.seleccionados[l].Folio.toString() + '/' + this.seleccionados[l].IdDetalleOrdenDescarga.toString() + '/' + event.addedFiles[i].name;
        documento.Observaciones = "";
        documento.Vigencia = new Date();
        // console.log(documento);

        //verificar que no exista ese documento en la base de datos

        this.documentosService.getDocumentoFMTDID(documento).subscribe(resExistente => {
          if (resExistente.length > 0) {
            // console.log('Ya existe este documento');
            if (ultimoSeleccionado == l && event.addedFiles.length == i) {
              this.seleccionados = []
              this.listDataDetalles = new MatTableDataSource(this.seleccionados);
              this.listDataSeleccionados = new MatTableDataSource(this.seleccionados);
              this.clearFolio();
              this.clearTipoDocumento();
              this.events = [];
              this.files = [];
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
              this.documentosService.saveFileServer(formData, 'guardarDocumentoImportacionOrdenDescarga').subscribe(res => {
                if (ultimoSeleccionado == l && event.addedFiles.length == i) {
                  this.seleccionados = []
                  this.listDataDetalles = new MatTableDataSource(this.seleccionados);
                  this.listDataSeleccionados = new MatTableDataSource(this.seleccionados);
                  this.clearFolio();
                  this.clearTipoDocumento();
                  this.events = [];
                  this.files = [];
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

  actualizarTipoDocumento(detalle: any){
// console.log(detalle);
if(this.tipoDocumentoSeleccionado == 'USDA'){
// console.log('ES USDA');
this.documentosService.updateUSDA(this.stringDocumentoSeleccionado,detalle.IdDetalleOrdenDescarga).subscribe(resUsda=>{
  // console.log(resUsda);
})
}
else if(this.tipoDocumentoSeleccionado == 'PEDIMENTO'){
// console.log('ES PEDIMENTO');
this.documentosService.updatePedimento(this.stringDocumentoSeleccionado,detalle.IdDetalleOrdenDescarga).subscribe(resUsda=>{
  // console.log(resUsda);
})
}
else{
  // console.log('ES OTRO');
}
  }
  //Leer archivo/documento del Servidor
  leerArchivos(a) {
    console.log(a);
    const formData = new FormData();
    formData.append('folio', a.folio.toString())
    formData.append('id', a.id.toString())
    formData.append('archivo', a.name)
    this.documentosService.readDocumentosServer(formData, 'ObtenerDocumentoImportacionOrdenDescarga').subscribe(res => {
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
    this.documentosService.readDirDocuemntosServer(formData, 'cargarNombreDocumentosImportacionOrdenDescarga').subscribe(res => {
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
          this.documentosService.readDocumentosServer(formDataDoc, 'ObtenerDocumentoImportacionOrdenDescarga').subscribe(resDoc => {
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
        console.log(formData);
        let docu = new Documento();
        docu.Folio = event.folio;
        docu.Modulo = 'Importacion';
        docu.Tipo = 'OrdenDescarga';
        docu.NombreDocumento = event.name;
        docu.IdDetalle = event.id
        this.documentosService.borrarDocumentoFMTDID(docu).subscribe(resDelete=>{
          console.log(resDelete);
          this.documentosService.deleteDocumentoServer(formData, 'borrarDocumentoImportacionOrdenDescarga').subscribe(res => {
            console.log(res)
            // this.files.splice(this.files.indexOf(event),1);
            this.archivos.splice(this.archivos.indexOf(event), 1);
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

}
