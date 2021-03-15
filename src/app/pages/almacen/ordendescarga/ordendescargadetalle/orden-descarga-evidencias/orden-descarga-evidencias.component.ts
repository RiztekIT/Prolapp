import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ImagenService } from '../../../../../services/imagenes/imagen.service';
import { Imagenes } from 'src/app/Models/Imagenes/imagenes-model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ImgInfo } from 'src/app/Models/Imagenes/imgInfo-model';
import Swal from 'sweetalert2';
import { NgxImageCompressService } from 'ngx-image-compress';
import { OrdenDescargaService } from '../../../../../services/almacen/orden-descarga/orden-descarga.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-orden-descarga-evidencias',
  templateUrl: './orden-descarga-evidencias.component.html',
  styleUrls: ['./orden-descarga-evidencias.component.css']
})
export class OrdenDescargaEvidenciasComponent implements OnInit {

  constructor(public router: Router, public imageService: ImagenService, public ordenDescargaService: OrdenDescargaService, private _sanitizer: DomSanitizer,
    private imageCompress: NgxImageCompressService, public location: Location) { }

    ngOnInit() {
      this.IdOrdenDescarga = +localStorage.getItem('IdOrdenDescarga');
      this.ObtenerFolio(this.IdOrdenDescarga);
  
    }
    //Imagen a comprimir
    imgResultBeforeCompress: string;
    imgResultAfterCompress: string;
  
    files: File[] = [];
    imagenes: any[];
    IdOrdenDescarga: number;
    Folio: number;
  
    imagePath: SafeResourceUrl;
    imageInfo: ImgInfo[] = [];

    bodega: string;
  
    // public listUM: Array<any> = [];
    // listProducts: Producto[] = [];
  
  
  
    imagenSeleccionada: boolean;
  
    regresar() {
    /*   console.log(this.bodega);
      if(this.bodega != 'Chihuahua'){
        this.router.navigate(['/ordenDescargadetalle']);
      }else if(this.bodega == 'Chihuahua'){
        this.router.navigate(['/ordenDescargadetallecuu']);
      } */
      this.location.back();
    }
  
    //Obtener Folio de Orden Descarga
    ObtenerFolio(id: number) {
      this.ordenDescargaService.getOrdenDescargaID(id).subscribe(dataOC => {
        console.log(dataOC);
        this.bodega = dataOC[0].Destino;
        this.Folio = dataOC[0].Folio;
        console.log(this.Folio);
        console.log(this.bodega);
        this.leerDirImagenes();
      })
    }

//Metodo para obtener el nombre de las imagenes y posteriormente traerse la imagen del servidor
leerDirImagenes() {
  //Obtener nombre de la imagen del servidor
  const formData = new FormData();
  formData.append('folio', this.Folio.toString())
  this.imagenes = [];
  this.imageInfo = new Array<ImgInfo>();
  this.files = [];
  console.log(this.imageInfo);
  this.imageService.readDirImagenesServidor(formData,'cargarNombreImagenesOrdenDescarga').subscribe(res => {
    if(res){
    if (res.length > 0) {
      console.log('Si hay imagenes')
      console.log(res);
      
      for (let i = 0; i < res.length; i++) {
        this.imagenes.push(res[i]);
        let data = new ImgInfo;
        data.ImageName = res[i];

        //Traer la imagen del servidor
        const formDataImg = new FormData();
        formDataImg.append('folio', this.Folio.toString())
        formDataImg.append('archivo', data.ImageName)
        console.log(formDataImg);
        this.imageService.readImagenesServidor(formDataImg,'ObtenerImagenOrdenDescarga').subscribe(resImagen => {
          console.log(resImagen);

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
  }
  })

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
    this.guardarImagenes();

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
        formData.append('folio', this.Folio.toString())
        console.log(formData);
        //Eliminar imagen del servidor
        this.imageService.deleteImagenServidor(formData,'borrarImagenOrdenDescarga').subscribe(res => {
          console.log(res);
          this.leerDirImagenes();
          let imagen = new Imagenes();
          imagen.Folio = this.Folio;
          imagen.Tipo = 'OrdenDescarga';
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

  guardarImagenes() {
    console.log(this.files);
    if (this.files.length > 0) {
      this.imagenSeleccionada = true;
      //recorrer el arreglo que se lleno previamente al seleccionar las imagenes ( Dropzone )
      for (let i = 0; i < this.files.length; i++) {
        console.log(this.files[i]);
        //agregar informacion necesaria a el objeto
        const formData = new FormData();




        formData.append('0', this.files[i]);
        formData.append('folio', this.Folio.toString())
        console.log(formData);
        //Guardar la imagen en el servidor
        this.imageService.saveImagenServidor(formData,'guardarImagenOrdenDescarga').subscribe(res => {
          console.log('RESPUESTA')
          console.log(res);
          const imagen = new Imagenes();
          imagen.Folio = this.Folio;
          imagen.Tipo = 'OrdenDescarga';
          imagen.Imagen = this.files[i].name;
          // imagen.Path='';
          console.log('////////////////////////////')
          console.log(this.files[i].name)
          imagen.Path = 'imagenes/OrdenDescarga/' + this.Folio.toString() + '/' + this.files[i].name;
          console.log(imagen);
          //Guardar Imagen en base de datos
          //Verficar si ya existe esa imagen en la base de datos
          this.imageService.getImagenFTN(imagen).subscribe(dataIma => {
            if (dataIma.length > 0) {
              console.log('****************')
              console.log('Ya EXISTE LA IMAGEN')
              if (i = this.files.length) {
                this.leerDirImagenes();
              }
            } else {
              console.log('****************')
              console.log('IMAGEN NUEVA')
              this.imageService.addImagen(imagen).subscribe(resDB => {
                console.log(resDB)
                // this.leerDirImagenes()
                if (i = this.files.length) {
                  this.leerDirImagenes();
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

  descargar(name) {
    console.log(name.ImageName);
      const blobData = this.convertBase64ToBlobData(name.ImagePath.changingThisBreaksApplicationSecurity.toString().replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));
      const blob = new Blob([blobData], { type: 'contentType' });
      const url = window.URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = url;
      link.download = name.ImageName;
      link.click();
  
    }

    convertBase64ToBlobData(base64Data: string, contentType: string = 'imagessssss/jpg', sliceSize = 512) {
      const byteCharacters = atob(base64Data);
      const byteArrays = [];
  
      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
  
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
  
        const byteArray = new Uint8Array(byteNumbers);
  
        byteArrays.push(byteArray);
      }
  
      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    }


}
