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
  selector: 'app-documentacion-formulario-compras-importacion',
  templateUrl: './documentacion-formulario-compras-importacion.component.html',
  styleUrls: ['./documentacion-formulario-compras-importacion.component.css']
})
export class DocumentacionFormularioComprasImportacionComponent implements OnInit {

  constructor(public documentosService: DocumentosImportacionService, public router: Router, private dialog: MatDialog,) {
    this.productosExistentes = false;
  }

  ngOnInit() {
    if ((this.documentosService.folioCompras >= 0)) {
      this.folioCompras = this.documentosService.folioCompras;
      this.obtenerCompraDetalles(this.folioCompras);

    }
  }

  //Tabla Detalle Compras
  listDataDetalles: MatTableDataSource<any>;
  detallesCompras = new Array<any>();
  displayedColumnsDetalles: string[] = ['Agregar', 'ClaveProducto', 'Cantidad', 'PesoxSaco', 'Options'];
  @ViewChild(MatSort, null) sortDetalles: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginatorDetalles: MatPaginator;

  //Tabla detalles Seleccionados
  listDataSeleccionados: MatTableDataSource<any>;
  seleccionados = new Array<any>();
  displayedColumnsSeleccionados: string[] = ['Folio', 'ClaveProducto', 'Producto', 'Vigencia', 'Options'];
  @ViewChild(MatSort, null) sortSeleccionados: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginatorSeleccionados: MatPaginator;

  folioCompras: number;

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

  fechaVigencia: string = "";


  //******************** VARIABLES DOCUMENTOS (API, DROPZONE) ********************//

  //guardar arreglo de documentos del dropzone
  events: any;

  //Arreglo donde se guardan los nombres de los Documentos
  archivos: any[];

  //arreglo de objetos donde se guardaran los Documentos/Imagenes TIPO FILE (DROPZONE) ( estos son los que son enviados al server como parametro, para ser adjuntasos en el email)
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
    elemHTML.value = this.folioCompras;
    //Transformar la Cantidad en entero e igualarlo a la variable Cantidad
    // this.calcularImportePedido();
    console.log(this.folioCompras);
  }

  //Validar que el folio no sea nula o menor a 0
  validarFolio(folio: any) {
    // console.log(cantidad + ' CANTIDAD');
    this.folioCompras = +folio;
    if (this.folioCompras <= 0) {
      this.folioCompras = 0;
    }
    if (this.folioCompras == null) {
      this.folioCompras = 0;
    }
  }

  clearFolio() {
    // this.folioCompras = null;
  }

  clearTipoDocumento() {
    this.tipoDocumentoSeleccionado = "";
    this.stringDocumentoSeleccionado = "";
    this.fechaVigencia = "";
  }

  //llenar tabla con detalles Compra
  obtenerCompraDetalles(folio: number) {
    console.log(folio);
    if (folio>=0) {
      this.documentosService.getCompraFolio(folio).subscribe(dataC => {
        console.log(dataC);
        if (dataC.length > 0) {
          this.documentosService.getDetalleCompraId(dataC[0].IdCompra).subscribe(dataDC => {
            console.log(dataDC);
            for (let i = 0; i <= dataDC.length - 1; i++) {
              this.detallesCompras[i] = dataDC[i];
              this.detallesCompras[i].Agregar = false;
              this.detallesCompras[i].Folio = folio;
              this.detallesCompras[i].Posicion = i
            }

            console.log(this.detallesCompras);

            this.listDataDetalles = new MatTableDataSource(dataDC);
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
    this.router.navigate(['/documentacionComprasImportacion']);
  }

  addToList(checkbox: any, row: any) {
    console.log(checkbox);
    console.log(row);
    console.log(row.Posicion);
    //si checkbox == true
    if (checkbox == false && row == this.seleccionados[0]) {
      console.log('ES FALSO Y CORRESPONDE CON EL DETALLE');
      this.seleccionados.splice(this.seleccionados.indexOf(row), 1);
    }
    //si es falso
    else {
      if(this.seleccionados.length>0){
        console.log('ya no se pueden agregar mas detalles');
        this.detallesCompras[row.Posicion].Agregar == false;

      }else{
        console.log('Haciendo push');
        this.seleccionados.push(row);
      }
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

  // onSelectionChangeTipoDocumento(options: any, event: any) {
  //   if (event.isUserInput) {
  //     console.log(options);
  //     console.log(event);
  //     // this.NombreProveedor = options.Nombre;
  //     // this.compra.Proveedor = options.Nombre;
  //   }

  // }

  //Agregar documentos a la base de datos y Servidor
  onAddDocumentos() {

    let event = this.events;
    // console.log(event)
    // console.log(this.seleccionados.length);
    let ultimoSeleccionado = this.seleccionados.length
    for (var l = 0; l < this.seleccionados.length; l++) {
      // console.log(this.seleccionados[l]);
      // this.actualizarTipoDocumento(this.seleccionados[l]);
      for (var i = 0; i < event.addedFiles.length; i++) {
        const formData = new FormData();
        formData.append('0', event.addedFiles[i])
        formData.append('folio', this.seleccionados[l].Folio.toString())
        formData.append('id', this.seleccionados[l].IdDetalleCompra)
        // console.log(res);
        // Buscar ultimo folio Documento
        let documento = new Documento();
        documento.IdDocumneto = 0;
        documento.Folio = this.folioCompras;
        documento.IdDetalle = this.seleccionados[l].IdDetalleCompra;
        documento.Modulo = 'Importacion';
        documento.Tipo = 'Compras';
        documento.ClaveProducto = this.seleccionados[l].ClaveProducto;
        documento.NombreDocumento = event.addedFiles[i].name;
        documento.Path = 'Documentos/Compras/' + this.seleccionados[l].Folio.toString() + '/' + this.seleccionados[l].IdDetalleCompra.toString() + '/' + event.addedFiles[i].name;
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
              // this.clearFolio();
              this.clearTipoDocumento();
              this.archivos=[];
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
              this.documentosService.saveFileServer(formData, 'guardarDocumentoImportacionCompras').subscribe(res => {
                if (ultimoSeleccionado == l && event.addedFiles.length == i) {
                  this.seleccionados = []
                  this.listDataDetalles = new MatTableDataSource(this.seleccionados);
                  this.listDataSeleccionados = new MatTableDataSource(this.seleccionados);
                  // this.clearFolio();
                  this.clearTipoDocumento();
                  this.archivos=[];
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

//   actualizarTipoDocumento(detalle: any){
// // console.log(detalle);
// if(this.tipoDocumentoSeleccionado == 'USDA'){
// // console.log('ES USDA');
// this.documentosService.updateUSDA(this.stringDocumentoSeleccionado,detalle.IdDetalleCompra).subscribe(resUsda=>{
//   // console.log(resUsda);
// })
// }
// else if(this.tipoDocumentoSeleccionado == 'PEDIMENTO'){
// // console.log('ES PEDIMENTO');
// this.documentosService.updatePedimento(this.stringDocumentoSeleccionado,detalle.IdDetalleCompra).subscribe(resUsda=>{
//   // console.log(resUsda);
// })
// }
// else{
//   // console.log('ES OTRO');
// }
//   }


  // Leer archivo/documento del Servidor
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
        formData.append('folio', event.folio.toString())
        formData.append('id', event.id.toString())
        console.log(formData);
        let docu = new Documento();
        docu.Folio = event.folio;
        docu.Modulo = 'Importacion';
        docu.Tipo = 'Compras';
        docu.NombreDocumento = event.name;
        docu.IdDetalle = event.id
        this.documentosService.borrarDocumentoFMTDID(docu).subscribe(resDelete=>{
          console.log(resDelete);
          this.documentosService.deleteDocumentoServer(formData, 'borrarDocumentoImportacionCompras').subscribe(res => {
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

  resettipoDocumentoSeleccionado(){
    this.tipoDocumentoSeleccionado = '';
    this.stringDocumentoSeleccionado ="";
  }

}
