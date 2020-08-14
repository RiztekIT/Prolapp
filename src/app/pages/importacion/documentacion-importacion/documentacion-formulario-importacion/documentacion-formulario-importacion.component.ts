import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatPaginator, MatTable, MatDialog, MatSnackBar, MatDialogConfig} from '@angular/material';
import {MatSort} from '@angular/material/sort';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DocumentosImportacionService } from '../../../../services/importacion/documentos-importacion.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ImgInfo } from 'src/app/Models/Imagenes/imgInfo-model';


@Component({
  selector: 'app-documentacion-formulario-importacion',
  templateUrl: './documentacion-formulario-importacion.component.html',
  styleUrls: ['./documentacion-formulario-importacion.component.css']
})
export class DocumentacionFormularioImportacionComponent implements OnInit {

  constructor(public documentosService: DocumentosImportacionService, public router: Router,) {
    this.productosExistentes = false;
   }

  ngOnInit() {
if(this.documentosService.folioOrdenDescarga){
this.folioOrdenDescarga = this.documentosService.folioOrdenDescarga;
this.obtenerOrdenesDescargaDetalles(this.folioOrdenDescarga);

}
  }

  //Tabla Detalle Orden Descarga
  listDataDetalles: MatTableDataSource<any>;
  detallesOrdenDescarga=new Array<any>();
  displayedColumnsDetalles : string [] = [ 'Agregar','ClaveProducto', 'Producto', 'Lote', 'USDA', 'Pedimento', 'Options'];
  @ViewChild(MatSort, null) sortDetalles : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginatorDetalles: MatPaginator;

  //Tabla detalles Seleccionados
  listDataSeleccionados: MatTableDataSource<any>;
  seleccionados=new Array<any>();
  displayedColumnsSeleccionados : string [] = [ 'Folio', 'ClaveProducto', 'Producto', 'Lote', 'Tipo', 'Options'];
  @ViewChild(MatSort, null) sortSeleccionados : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginatorSeleccionados: MatPaginator;

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
   stringDocumentoSeleccionado: string="";


//******************** VARIABLES DOCUMENTOS (API, DROPZONE) ********************//

 //Arreglo donde se guardan los nombres de los Documentos
 archivos: any[];

   //Variable de onjetos donde se guardaran los Documentos/Imagenes TIPO FILE ( estos son los que son enviados al server como parametro, para ser adjuntasos en el email)
   files: File[] = [];
   filesImagen:  File[] = [];

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

  clearFolio(){
    this.folioOrdenDescarga = null;
  }

  clearTipoDocumento(){
    this.tipoDocumentoSeleccionado = "";
    this.stringDocumentoSeleccionado= "";
  }

//llenar tabla con detalles Orden Descarga
obtenerOrdenesDescargaDetalles(folio:number){
  console.log(folio);
  if(folio){

    this.documentosService.getOrdenDescargaFolio(folio).subscribe(dataOD=>{
      console.log(dataOD);
      if(dataOD.length>0){
        this.documentosService.getDetalleOrdenDescargaId(dataOD[0].IdOrdenDescarga).subscribe(dataDOD=>{
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
      }else{
        Swal.fire({
          title: 'Error',
          text:'Favor de Verificar el Estatus',
          icon: 'error',
          timer: 1000,
          showCancelButton: false,
          showConfirmButton: false
        });
      }
    })
  }else{
    Swal.fire({
      title: 'Folio no valido',
      icon: 'error',
      timer: 1000,
      showCancelButton: false,
      showConfirmButton: false
    });
  }
}

Regresar(){
  this.router.navigate(['/documentacion-importacion']);
}

addToList(checkbox: any, row:any){
console.log(checkbox);
console.log(row);
//si checkbox == true
if(checkbox == true){
  this.seleccionados.push(row);
}
//si es falso
else{
  this.seleccionados.splice(this.seleccionados.indexOf(row), 1);
}
this.verificarProductosSeleccionados();

}

removeFromList(row: any){
  console.log(row);
  this.seleccionados.splice(this.seleccionados.indexOf(row), 1);
  this.verificarProductosSeleccionados();
 
}

//este metodo verifica si aun hay datos en la tabla de productos seleccionados
verificarProductosSeleccionados(){
  if(this.seleccionados.length>0){
this.productosExistentes = true;
  }else{
this.productosExistentes = false;
  }
  this.listDataSeleccionados = new MatTableDataSource(this.seleccionados);
  this.listDataDetalles.sort = this.sortDetalles;
}

onSelectionChangeTipoDocumento(options: any, event: any){
  if (event.isUserInput) {
    console.log(options);
    console.log(event);
    // this.NombreProveedor = options.Nombre;
    // this.compra.Proveedor = options.Nombre;
  }

}

//Agregar documentos a la base de datos
onAddDocumentos(){

}

obtenerDocumentos(folio: number, id: number){

  console.log(folio, id);

  const formData = new FormData();
  formData.append('folio', folio.toString());
  formData.append('id', id.toString());
  this.documentosService.readDirDocuemntosServer(formData, 'cargarNombreDocumentosImportacionOrdenDescarga').subscribe(res=>{                                                    
    // console.log(res);
    this.archivos =[];
    if (res){
      // console.log(res.length)
    for(let i = 0; i<res.length; i++){
      // public listTipoDocumentos: Array<Object> = [
      //   { Tipo: 'USDA' },
      //   { Tipo: 'PEDIMENTO' },
      //   { Tipo: 'OTRO' }
      // ];
      // let archivo: Array<Object> = [
      //   {name: res[i]},
      //   {id: id},
      //   {folio: folio}

      // ];
      let archivo =<any>{};
      archivo.name = res[i];
      archivo.id = id;
      archivo.folio = folio;
      this.archivos.push(archivo);
      const formDataDoc = new FormData();
      formDataDoc.append('folio', folio.toString());
      formDataDoc.append('id', id.toString());
      formDataDoc.append('archivo', res[i])
      this.documentosService.readDocumentosServer(formDataDoc,'ObtenerDocumentoImportacionOrdenDescarga').subscribe(resDoc=>{
    //  console.log(resDoc)
     const blob = new Blob([resDoc as BlobPart], { type: 'application/pdf' });
    //  console.log(blob)
     let fr = new FileReader();
     let name = res[i];
     fr.readAsDataURL(blob);
    //  console.log(fr.readAsDataURL(blob));
     fr.onload = e =>{
      //  console.log(e);
      //  console.log(fr.result);
       this.tipo='documento'
       this.dataURItoBlob(fr.result, name);
     }
    //  let TYPED_ARRAY = new Uint8Array(resDoc);
    //       const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
    //         return data + String.fromCharCode(byte);
    //       }, '');
          // let base64String = btoa(STRING_CHAR);
          // this.dataURItoBlob(base64String, res[i]);
    //  this.files.push(resDoc)
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
  
    this.files.push(file);
  // if(this.tipo=='documento'){
  //   console.log('/////////////////////')
  //   console.log('DOCUMENTOOOOOOO')
  //   console.log('/////////////////////')
  //   //Guardar docuemnto tipo File en arreglo
  //   this.files.push(file);
  // }
  // if(this.tipo=='imagen'){
  //   console.log('/////////////////////')
  //   console.log('IMAGENNNNNNNNN')
  //   console.log('/////////////////////')
  //   this.filesImagen.push(file);
  // }
  

  return new File([ia], fileName, { type: mimeString });
}

 //Agregar Documento al Servidor
 onSelect(event){
  //  console.log(event)
     for (var l = 0; l < this.seleccionados.length; l++) {
// console.log(this.seleccionados[l]);
     for (var i = 0; i < event.addedFiles.length; i++) {
   const formData = new FormData();
  formData.append('0',event.addedFiles[i])
  formData.append('folio', this.seleccionados[l].Folio.toString())
  formData.append('id', this.seleccionados[l].IdDetalleOrdenDescarga)
//   this.documentosService.saveFileServer(formData,'guardarDocumentoImportacionOrdenDescarga').subscribe(res=>{
// console.log(res);
// // this.obtenerDocumentos();
//   })
}
this.seleccionados = []
this.listDataDetalles = new MatTableDataSource(this.seleccionados);
this.listDataSeleccionados = new MatTableDataSource(this.seleccionados);
this.clearFolio();
this.clearTipoDocumento();
}
  // this.files.push(...event.addedFiles);
}
//Leer archivo/documento del Servidor
leerArchivos(a){
  console.log(a);
  // const formData = new FormData();
  // formData.append('folio', this.Folio.toString())
  // formData.append('archivo', a)
  // this.AlmacenEmailService.readDocumentosAlmacen(formData,'ObtenerDocumentoOrdenCarga').subscribe(res=>{
  //   // console.log(res);
  //   const blob = new Blob([res as BlobPart], { type: 'application/pdf' });
  //   let fr = new FileReader();
    
  //   fr.readAsDataURL(blob);
  //   fr.onload = e =>{
  //     // console.log(e);
  //     // console.log(fr.result);
  //       this.fileUrl = fr.result;
  //       this.pdfstatus = true;
  //   }
  // })
}


  //Eliminar Documento del Servidor
  onRemove(event){
    // console.log(event);
    // const formData = new FormData();
    //     formData.append('name', event)
    //     formData.append('folio', this.Folio.toString())
    //     console.log(formData);
    //     this.AlmacenEmailService.deleteDocumentoAlmacen(formData,'borrarDocumentoOrdenCarga').subscribe(res => {
    //       console.log(res)
    //       this.files.splice(this.files.indexOf(event),1);
    //       this.obtenerDocumentos();
    //       this.pdfstatus = false;
        
    //     })
      }

}
