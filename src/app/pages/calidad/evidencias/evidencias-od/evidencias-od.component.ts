import { Component, OnInit } from '@angular/core';
import { OrdenDescargaService } from '../../../../services/almacen/orden-descarga/orden-descarga.service';
import { Router } from '@angular/router';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ImgInfo } from 'src/app/Models/Imagenes/imgInfo-model';
import { ImagenService } from 'src/app/services/imagenes/imagen.service';

@Component({
  selector: 'app-evidencias-od',
  templateUrl: './evidencias-od.component.html',
  styleUrls: ['./evidencias-od.component.css']
})
export class EvidenciasODComponent implements OnInit {

 //variable para guardar el estatus de la Orden Carga
 estatusOD: string;
 FolioOD: string;
 OrigenOD: string;
DestinoOD: string;

 IdOrdenDescarga: number;

 files: File[] = [];
 imagenes: any[];
 Folio: number;

 imagePath: SafeResourceUrl;
 imageInfo: ImgInfo[] = [];

  constructor(public router: Router, private _sanitizer: DomSanitizer ,public imageService: ImagenService, private OrdenDescargaService: OrdenDescargaService) { }

  ngOnInit() {
    this.IdOrdenDescarga = +(localStorage.getItem('evidenciaOD'));
    this.getOrdenDescarga();
    this.ObtenerFolio(this.IdOrdenDescarga);
  }

  getOrdenDescarga(){
    this.OrdenDescargaService.getOrdenDescargaID(this.IdOrdenDescarga).subscribe( data=> {
      console.log(data)
          this.OrdenDescargaService.formData = data[0];
          this.estatusOD = data[0].Estatus;
          this.FolioOD = data[0].Folio;
          this.OrigenOD = data[0].Origen;
          this.DestinoOD = data[0].Destino;
          console.log(this.estatusOD);
    });
  }

  regresar(){
    this.router.navigate(['/evidencias']);
  }

//Obtener Folio de Orden Descarga
ObtenerFolio(id: number) {
  this.OrdenDescargaService.getOrdenDescargaID(id).subscribe(dataOD => {
    console.log(dataOD);
    this.Folio = dataOD[0].Folio;
    console.log(this.Folio);
    this.leerDirImagenes();
  })
}

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
          console.log(data.ImageName);
  
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
            console.log(data.ImagePath);
  
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


  // download() {
  //   const formData = new FormData();
  //   formData.append('folio', this.Folio.toString())
  //   this.imagenes = [];
  //   this.imageInfo = new Array<ImgInfo>();
  //   this.files = [];
  //   console.log(this.imageInfo);
  //   this.imageService.readDirImagenesServidor(formData,'cargarNombreImagenesOrdenDescarga').subscribe(res => {
  //     if(res){
  //     if (res.length > 0) {
  //       console.log('Si hay imagenes')
  //       console.log(res);
        
  //       for (let i = 0; i < res.length; i++) {
  //         this.imagenes.push(res[i]);
  //         let data = new ImgInfo;
  //         data.ImageName = res[i];
  //         console.log(data.ImageName);
  
  //         //Traer la imagen del servidor
  //         const formDataImg = new FormData();
  //         formDataImg.append('folio', this.Folio.toString())
  //         formDataImg.append('archivo', data.ImageName)
  //         console.log(formDataImg);
  //         this.imageService.readImagenesServidor(formDataImg,'ObtenerImagenOrdenDescarga').subscribe(resImagen => {
  //           console.log(resImagen);
  
  //           let TYPED_ARRAY = new Uint8Array(resImagen);
  //           const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
  //             return data + String.fromCharCode(byte);
  //           }, '');
  //           let base64String = btoa(STRING_CHAR);
  
  //           data.ImagePath = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + base64String);
  //           console.log(data.ImagePath);
  
  //           console.log(data);
  //           this.imageInfo.push(data)
  //         })
  //       }
  //       console.log(this.imageInfo)
  
  //     } else {
  //       console.log('No hay imagenes')
  //     }
  //   }
  //   })
  // }
  descargar(name){
 
    const blobData = this.convertBase64ToBlobData(name.ImagePath.changingThisBreaksApplicationSecurity.toString().replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));

    const blob = new Blob([blobData], { type: 'contentType' });
    const url = window.URL.createObjectURL(blob);
 
    const link = document.createElement('a');
    link.href = url;
    link.download = name.ImageName;
    link.click();

  }



  
      convertBase64ToBlobData(base64Data: string, contentType: string='image/jpg', sliceSize=512) {
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
