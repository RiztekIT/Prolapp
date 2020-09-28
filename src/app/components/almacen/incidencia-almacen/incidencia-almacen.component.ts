import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { NgForm, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { IncidenciasService } from '../../../services/almacen/incidencias/incidencias.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ImgInfo } from 'src/app/Models/Imagenes/imgInfo-model';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Imagenes } from '../../../Models/Imagenes/imagenes-model';
import { ImagenService } from 'src/app/services/imagenes/imagen.service';



@Component({
  selector: 'app-incidencia-almacen',
  templateUrl: './incidencia-almacen.component.html',
  styleUrls: ['./incidencia-almacen.component.css']
})
export class IncidenciaAlmacenComponent implements OnInit {

  constructor(public dialogbox: MatDialogRef<IncidenciaAlmacenComponent>, private dialog: MatDialog, public incidenciasService: IncidenciasService,
    private _sanitizer: DomSanitizer,private imageCompress: NgxImageCompressService, public imageService: ImagenService, ) { }

  ngOnInit() {
    console.log(this.incidenciasService.incidenciaObject);
    if(this.incidenciasService.incidenciaObject.FolioProcedencia){
// console.log('Incidencia Existente');
this.procedenciaSeleccionada = this.incidenciasService.incidenciaObject.Procedencia;
this.IdDetalle = +this.incidenciasService.incidenciaObject.IdDetalle;
this.tipoIncidenciaSeleccionada = this.incidenciasService.incidenciaObject.TipoIncidencia;
this.estatusSeleccionado = this.incidenciasService.incidenciaObject.Estatus;
this.obtenerInformacionOrden(this.incidenciasService.incidenciaObject.Procedencia);
    }
  }

  //Imagen a comprimir
  imgResultBeforeCompress: string;
  imgResultAfterCompress: string;

  files: File[] = [];
  imagenes: any[];

  imagePath: SafeResourceUrl;
  imageInfo: ImgInfo[] = [];

  imagenSeleccionada: boolean;



  //Id de la Orden Carga/Descarga
  IdOrden: number = 0;

  
  //Dropdown Procedencias
  myControlProcedencia = new FormControl();
  //Lista de Procedencias
  public listProcedencias: Array<Object> = [
    { procedencia: 'OrdenCarga' },
    { procedencia: 'OrdenDescarga' }
  ];
  procedenciaSeleccionada: string ="";

  //Dropdown Tipo incidencia
  myControlTipoIncidencia = new FormControl();
  //Lista de Tipo de Incidencias
  public listTipoIncidencia: Array<Object> = [
    { tipo: 'Merma' },
    { tipo: 'Reparacion' },
    { tipo: 'Devolucion' }
  ];

  tipoIncidenciaSeleccionada: string="";

  //Dropdown Estatus
  myControlEstatus = new FormControl();
  //Lista de Estados
  public listEstatus: Array<Object> = [
    { estado: 'Iniciada' },
    { estado: 'Pendiente' },
    { estado: 'Finalizada' }
  ];

  estatusSeleccionado: string="";

    
  //Dropdown Detalles
  myControlDetalles = new FormControl();
  filteredOptionsDetalles: Observable<any[]>;
  optionsDetalle: any[] = [];
  detalleSeleccionado: string ="";
    Cantidad:number =1;
    IdDetalle: number;


    obtenerClaveProducto(id:number, iddetalle:number, tipo:string){
if(tipo == 'OrdenCarga'){
this.incidenciasService.getDetalleOrdenCargaIddetalle(id, iddetalle).subscribe(resOC=>{
  console.log(resOC);
  if(resOC.length>0){
this.detalleSeleccionado = resOC[0].ClaveProducto
  }
})
}else if(tipo == 'OrdenDescarga'){
 this.incidenciasService.getDetalleOrdenDescargaIddetalle(id, iddetalle).subscribe(resOD=>{
    console.log(resOD);
    if(resOD.length>0){
  this.detalleSeleccionado = resOD[0].ClaveProducto
    }
  })
}
      
      
    }

 //Metodo ejecutado cuando se agrega(n) archivo(s) en el dropzone
 onSelect(event) {
  console.log(event)
  this.imagenSeleccionada = true;
  console.log(event.addedFiles[0].size)

  for (var i = 0; i < event.addedFiles.length; i++) {
    console.log(event.addedFiles[i])
    let imageName = event.addedFiles[i].name;

    //Convertir imagen a Blob
    const blob = new Blob([event.addedFiles[i] as BlobPart], { type: imageName });
    let fr = new FileReader();
    let image;
    //Covertir Imagen a base64
    fr.readAsDataURL(blob);
    fr.onload = e => {
      console.log(e);
      console.log(fr.result);
      console.log(fr);
      image = fr.result;
      console.warn('Size in bytes was:', this.imageCompress.byteCount(image));
      //Comprimir la imagen
      this.imageCompress.compressFile(image, -1, 25, 50).then(
        result => {
          console.warn('Size in bytes is now:', this.imageCompress.byteCount(result));
          //Metodo para convertir imagen a File para guardarlo en arreglo y posteriormente subirlo al servidor
          this.dataURItoBlob(result, imageName);

        }
      );

    }
  }

}

//Metodo para convertir imagen base64 a tipo File
dataURItoBlob(dataURI: any, fileName: string): File {

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
  //igualar imagen a tipo File 
  let image = new File([ia], fileName, { type: mimeString });
  //Guardar imagen tipo File en areglo
  this.files.push(image);
  if(this.procedenciaSeleccionada == 'OrdenCarga'){

    this.guardarImagenesOrdenCarga('OrdenCarga', 'OrdenCargaIncidencias');
  }else{
    this.guardarImagenesOrdenCarga('OrdenDescarga', 'OrdenDescargaIncidencias');
  }


  return new File([ia], fileName, { type: mimeString });
}

// al remover una imagen del dropzone
onRemove(event) {
  console.log(event);
  //Eliminar imagen del dropzone
  this.files.splice(this.files.indexOf(event), 1);
}

//Eliminar imagen del servidor 
deleteImage(imageName: string) {
  console.log(imageName);
  //SWAL ALERT DELETE
  Swal.fire({
    title: '¿Segur@ de borar Imagen?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Borrar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.value) {

      Swal.fire({
        title: 'Borrado',
        icon: 'success',
        timer: 1000,
        showCancelButton: false,
        showConfirmButton: false
      });
      const formData = new FormData();
      formData.append('name', imageName)
      formData.append('folio', this.incidenciasService.incidenciaObject.FolioProcedencia.toString())
      formData.append('modulo', 'Incidencias')
  formData.append('tipo', this.procedenciaSeleccionada)
  formData.append('id', this.IdDetalle.toString())
      console.log(formData);
      //Eliminar imagen del servidor
      this.imageService.deleteImagenServidor(formData,'borrarIncidenciaImagen'+this.procedenciaSeleccionada).subscribe(res => {
        console.log(res);
        this.leerDirImagenes(this.incidenciasService.incidenciaObject.Procedencia);
        let imagen = new Imagenes();
        imagen.Folio = this.incidenciasService.incidenciaObject.FolioProcedencia;
        // imagen.Tipo = 'OrdenCarga';
        imagen.Tipo = this.procedenciaSeleccionada+'Incidencias';
        imagen.Imagen = imageName;
        console.log(imagen)
        //Eliminar Imagen de la base de datos
        this.imageService.deleteImagenOC(imagen).subscribe(resp => {
          console.log(resp)
        })
      })
    }
  })
}

//Comprimir imagen
compressFile() {


  this.imageCompress.uploadFile().then(({ image, orientation }) => {

    console.log(image);
    console.log(orientation);

    this.imgResultBeforeCompress = image;
    console.warn('Size in bytes was:', this.imageCompress.byteCount(image));

    this.imageCompress.compressFile(image, orientation, 50, 50).then(
      result => {
        this.imgResultAfterCompress = result;
        console.warn('Size in bytes is now:', this.imageCompress.byteCount(result));
      }
    );

  });

}

guardarImagenesOrdenCarga(tipo: string, tipoPath: string) {
  console.log(this.files);
  if (this.files.length > 0) {
    this.imagenSeleccionada = true;
    //recorrer el arreglo que se lleno previamente al seleccionar las imagenes ( Dropzone )
    for (let i = 0; i < this.files.length; i++) {
      console.log(this.files[i]);
      //agregar informacion necesaria a el objeto
      const formData = new FormData();




      formData.append('0', this.files[i]);
      formData.append('folio', this.incidenciasService.incidenciaObject.FolioProcedencia.toString())
      formData.append('modulo', 'Incidencias')
      formData.append('tipo', tipo)
      formData.append('id', this.IdDetalle.toString())
      console.log(formData);
      //Guardar la imagen en el servidor
      this.imageService.saveImagenServidor(formData,'guardarIncidenciaImagen'+tipo).subscribe(res => {
        console.log('RESPUESTA')
        console.log(res);
        const imagen = new Imagenes();
        imagen.Folio = this.incidenciasService.incidenciaObject.FolioProcedencia;
        imagen.Tipo = tipoPath;
        imagen.Imagen = this.files[i].name;
        // imagen.Path='';
        console.log('////////////////////////////')
        console.log(this.files[i].name)
        imagen.Path = 'imagenes/'+tipoPath+'/' + this.incidenciasService.incidenciaObject.FolioProcedencia.toString() + '/' + this.files[i].name;
        console.log(imagen);
        //Guardar Imagen en base de datos
        //Verficar si ya existe esa imagen en la base de datos
        this.imageService.getImagenFTN(imagen).subscribe(dataIma => {
          console.log(dataIma);
          if (dataIma.length > 0) {
            console.log('****************')
            console.log('Ya EXISTE LA IMAGEN')
            if (i = this.files.length) {
              this.leerDirImagenes(tipo);
            }
          } else {
            console.log('****************')
            console.log('IMAGEN NUEVA')
            this.imageService.addImagen(imagen).subscribe(resDB => {
              console.log(resDB)
              // this.leerDirImagenes()
              if (i = this.files.length) {
                this.leerDirImagenes(tipo);
              };
            })

          }
        })
      })
    }
  } else {
    this.imagenSeleccionada = false;
  }
}

//Metodo para obtener el nombre de las imagenes y posteriormente traerse la imagen del servidor
leerDirImagenes(tipo: string) {
  if(this.IdDetalle){
console.log('ID DETALLE VALIDO');
 //Obtener nombre de la imagen del servidor
 const formData = new FormData();
 formData.append('folio', this.incidenciasService.incidenciaObject.FolioProcedencia.toString())
 formData.append('modulo', 'Incidencias')
 formData.append('tipo', tipo)
 formData.append('id', this.IdDetalle.toString())
 this.imagenes = [];
 this.imageInfo = new Array<ImgInfo>();
 this.files = [];
 console.log(this.imageInfo);
 this.imageService.readDirImagenesServidor(formData,'cargarIncidenciasNombreImagenes').subscribe(res => {
   console.log(res);
   if (res) {
     console.log('Si hay imagenes')
     console.log(res);
     // this.imageInfo = [];
     // this.imageInfo.length=0;
     // if (res) {
     for (let i = 0; i < res.length; i++) {
       this.imagenes.push(res[i]);
       let data = new ImgInfo;
       data.ImageName = res[i];

       //Traer la imagen del servidor
       const formDataImg = new FormData();
       formDataImg.append('folio', this.incidenciasService.incidenciaObject.FolioProcedencia.toString())
       formDataImg.append('archivo', data.ImageName)
       formDataImg.append('modulo', 'Incidencias')
       formDataImg.append('tipo', tipo)
       formDataImg.append('id', this.IdDetalle.toString())
       console.log(formDataImg);
       this.imageService.readImagenesServidor(formDataImg,'ObtenerIncidenciasImagen').subscribe(resImagen => {
         console.log(resImagen);

         // var base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(resImagen)));
         // data.ImagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + base64String);

         let TYPED_ARRAY = new Uint8Array(resImagen);
         const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
           return data + String.fromCharCode(byte);
         }, '');
         let base64String = btoa(STRING_CHAR);

         data.ImagePath = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + base64String);

         console.log(data);
         this.imageInfo.push(data)
       })
     }
     console.log(this.imageInfo)

   } else {
     console.log('No hay imagenes')
   }
 })
  }else{
console.log('ID DETALLE NO VALIDO');
  }
 

}

//Metodo para obtener imagen del server, recibe como parametro el nombre del archivo (  YA NO SE UTILIZA EN ESTE METODO  )
obtenerImagen(a) {
  console.log(a);
  const formData = new FormData();
  formData.append('folio', this.incidenciasService.incidenciaObject.FolioProcedencia.toString())
  formData.append('archivo', a)
  console.log(formData);
  this.imageService.readImagenesServidor(formData,'ObtenerImagenOrdenCarga').subscribe(res => {
    console.log(res);
    var base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(res)));
    // console.log(base64String);
    // this.user_photo = this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + data).toString();
    this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + base64String);
  })
}



 obtenerInformacionOrden(procedencia: string){
  if(procedencia == 'OrdenCarga'){
    this.incidenciasService.getOrdenCargaFolio(this.incidenciasService.incidenciaObject.FolioProcedencia).subscribe(resOC=>{
      // console.log(resOC);
      if(resOC.length>0){
        this.IdOrden = resOC[0].IdOrdenCarga
        this.dropdownRefreshDetalles('OrdenCarga');
        this.leerDirImagenes('OrdenCarga');
        this.obtenerClaveProducto(resOC[0].IdOrdenCarga, this.incidenciasService.incidenciaObject.IdDetalle, 'OrdenCarga');
        console.log('Orden Carga', this.IdOrden);
      }else{
        this.filteredOptionsDetalles = new Observable<any>();
        this.detalleSeleccionado = "";
        Swal.fire({
          title: 'Error',
          text: 'Favor de Verificar Informacion',
          icon: 'error',  
        });
      }
    })

  }else if(procedencia == 'OrdenDescarga'){
    this.incidenciasService.getOrdenDescargaFolio(this.incidenciasService.incidenciaObject.FolioProcedencia).subscribe(resOD=>{
      // console.log(resOD);
      if(resOD.length > 0){
        this.IdOrden = resOD[0].IdOrdenDescarga;
        this.dropdownRefreshDetalles('OrdenDescarga');
        this.leerDirImagenes('OrdenDescarga');
        this.obtenerClaveProducto(resOD[0].IdOrdenDescarga, this.incidenciasService.incidenciaObject.IdDetalle, 'OrdenDescarga');
        console.log('Orden Descarga', this.IdOrden);
      }else{
        this.filteredOptionsDetalles = new Observable<any>();
        this.detalleSeleccionado = "";
        Swal.fire({
          title: 'Folio Incorrecto',
          text: 'Favor de Verificar Informacion',
          icon: 'error',  
        });
      }
   
    })
  }
 }

  dropdownRefreshDetalles(procedencia: string) {
    this.optionsDetalle = [];
    this.filteredOptionsDetalles = new Observable<any>();
    if(procedencia == 'OrdenCarga'){
      this.incidenciasService.getListOrdenCargaId(this.IdOrden).subscribe(dataP => {
        for (let i = 0; i < dataP.length; i++) {
          let product = dataP[i];
          product.IdDetalle = dataP[i].IdDetalleOrdenCarga;
          this.optionsDetalle.push(product)
          this.filteredOptionsDetalles = this.myControlDetalles.valueChanges
            .pipe(
              startWith(''),
              map(value => this._filterDetalles(value))
            );
        }
      });
    }else if(procedencia == 'OrdenDescarga'){
      this.incidenciasService.getListOrdenDescargaId(this.IdOrden).subscribe(dataP => {
        for (let i = 0; i < dataP.length; i++) {
          let product = dataP[i];
          product.IdDetalle = dataP[i].IdDetalleOrdenDescarga;
          this.optionsDetalle.push(product)
          this.filteredOptionsDetalles = this.myControlDetalles.valueChanges
            .pipe(
              startWith(''),
              map(value => this._filterDetalles(value))
            );
        }
      });
    }
    

  }

  private _filterDetalles(value: any): any[] {
    // console.clear();
    // console.log(value);
    if (typeof (value) == 'string') {
      const filterValue2 = value.toLowerCase();
      return this.optionsDetalle.filter(option => option.ClaveProducto.toString().toLowerCase().includes(filterValue2) || option.Producto.toString().toLowerCase().includes(filterValue2));
    } else if (typeof (value) == 'number') {
      const filterValue2 = value.toString();
      return this.optionsDetalle.filter(option => option.ClaveProducto.toString().includes(filterValue2) || option.Producto.toString().includes(filterValue2));
    }


  }

  onSelectionChangeProcedencia(procedencia: any, event: any){
    if (event.isUserInput) {
          // console.log(procedencia);
          // console.log(event);
          this.procedenciaSeleccionada = procedencia;
          this.obtenerInformacionOrden(procedencia)
         
          // this.NombreProveedor = options.Nombre;
          // this.compra.Proveedor = options.Nombre;
        }
  }
  onSelectionChangeDetalle(options: any, event: any){
    if (event.isUserInput) {
          console.log(options);
          console.log(event);
          this.detalleSeleccionado = options.ClaveProducto;
          this.IdDetalle = options.IdDetalle;
          this.leerDirImagenes(this.incidenciasService.incidenciaObject.Procedencia);
          // this.NombreProveedor = options.Nombre;
          // this.compra.Proveedor = options.Nombre;
        }
  }

  onSelectionChangeTipoIncidencia(options: any, event: any){
    if(event.isUserInput){
      console.log(options);

    }
  }

  //On change Cantidad
  onChangeCantidadSacos(cantidad: any) {
    // console.log(cantidad);
    let elemHTML: any = document.getElementsByName('cantidadSacos')[0];
    this.validarCantidad(cantidad);
    elemHTML.value = this.Cantidad;
  }

  //Validar que la cantidad sea >=0
  validarCantidad(cantidad: any) {
    this.Cantidad = +cantidad;
    if (this.Cantidad <= 0) {
      this.Cantidad = 0;
    }
    if (this.Cantidad == null) {
      this.Cantidad = 0;
    }
  }

  guardarIncidencia(){
    this.incidenciasService.incidenciaObject.Cantidad = this.Cantidad.toString();
    this.incidenciasService.incidenciaObject.TipoIncidencia = this.tipoIncidenciaSeleccionada;
    this.incidenciasService.incidenciaObject.Estatus = this.estatusSeleccionado;
    this.incidenciasService.incidenciaObject.IdDetalle = this.IdDetalle;
    console.log(this.incidenciasService.incidenciaObject);
    this.incidenciasService.updateIncidencia(this.incidenciasService.incidenciaObject).subscribe(res=>{
      console.log(res);
      Swal.fire({
        title: 'Incidencia Generada',
        icon: 'success',
        timer: 1000,
        showCancelButton: false,
        showConfirmButton: false
      });
    })
    
  }

  onClose() {
    this.dialogbox.close();
    this.incidenciasService.filter('');
  }

}
