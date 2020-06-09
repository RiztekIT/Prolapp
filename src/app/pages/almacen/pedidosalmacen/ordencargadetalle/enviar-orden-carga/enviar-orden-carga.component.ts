import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlmacenEmailService } from 'src/app/services/almacen/almacen-email.service';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ImgInfo } from 'src/app/Models/Imagenes/imgInfo-model';
import { ImagenService } from 'src/app/services/imagenes/imagen.service';
import { OrdenCargaService } from 'src/app/services/almacen/orden-carga/orden-carga.service';



@Component({
  selector: 'app-enviar-orden-carga',
  templateUrl: './enviar-orden-carga.component.html',
  styleUrls: ['./enviar-orden-carga.component.css']
})
export class EnviarOrdenCargaComponent implements OnInit {

  constructor(public router: Router, public AlmacenEmailService: AlmacenEmailService, private sanitizer: DomSanitizer, public dialogRef: MatDialogRef<EnviarOrdenCargaComponent>,
   public imageService: ImagenService,  private _sanitizer: DomSanitizer, public ordenCargaService:OrdenCargaService) { }

  ngOnInit() {
    this.Folio = this.AlmacenEmailService.folio;
    this.IdOrdenCarga = +(localStorage.getItem('IdOrdenCarga'));
    this.obtenerDocumentos();
    this.evidencia = false;
  }

  IdOrdenCarga: number;

  //Variable de onjetos donde se guardaran los Documentos/Imagenes TIPO FILE ( estos son los que son enviados al server como parametro, para ser adjuntasos en el email)
  files: File[] = [];
  filesImagen:  File[] = [];

//Folio de la Orden de Carga
  Folio: number;

  //Arreglo donde se guardan los nombres de los Documentos
  archivos: any[];

  //Estatus
  pdfstatus = false;

  //File URL del pdf, para ser mostrado en el visor de decumentos
  fileUrl;

  //Variable para saber si las imagenes seran adjuntadas al correo
  evidencia: boolean;

  //Arreglo de objetos donde se guardaran las fotos obtenidas del server
  imageInfo: ImgInfo[] = [];
  imagenes: any[];

//Variable para identificar si el archivo es un documento o una imagen
  tipo: string;
  regresar(){
    this.router.navigate(['/ordencargadetalle']);
  }

  onClose(){
    this.dialogRef.close();
  }

  //Obtener Imagenes 
  obtenerImagenes(){
    this.filesImagen= [];
if(this.evidencia==true){
  //Obtener nombre de la imagen del servidor
  const formData = new FormData();
  formData.append('folio', this.Folio.toString())
  this.imagenes = [];
  this.imageInfo = new Array<ImgInfo>();
    //  this.files = [];
     this.filesImagen = [];
    //  console.log(this.imageInfo);
     this.imageService.readDirImagenesServidor(formData,'cargarNombreImagenesOrdenCarga').subscribe(res => {
       if (res.length > 0) {
         console.log('Si hay imagenes')
        //  console.log(res);
         // this.imageInfo = [];
         // this.imageInfo.length=0;
         // if (res) {
         for (let i = 0; i < res.length; i++) {
           this.imagenes.push(res[i]);
           let data = new ImgInfo;
           data.ImageName = res[i];
           
           //Traer la imagen del servidor
           const formDataImg = new FormData();
           formDataImg.append('folio', this.Folio.toString())
           formDataImg.append('archivo', data.ImageName)
          //  console.log(formDataImg);
           this.imageService.readImagenesServidor(formDataImg,'ObtenerImagenOrdenCarga').subscribe(resImagen => {
            //  console.log(resImagen);
             
             // var base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(resImagen)));
             // data.ImagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + base64String);
 
             let TYPED_ARRAY = new Uint8Array(resImagen);
             const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
               return data + String.fromCharCode(byte);
             }, '');
             let base64String = btoa(STRING_CHAR);
             data.ImagePath = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + base64String);
            //  console.log(data);
             this.imageInfo.push(data);

      const blob = new Blob([resImagen as BlobPart], { type: 'application/pdf' });
      //  console.log(blob)
       let fr = new FileReader();
       let name = res[i];
       fr.readAsDataURL(blob);
      //  console.log(fr.readAsDataURL(blob));
       fr.onload = e =>{
        //  console.log(e);
        //  console.log(fr.result);
         this.tipo='imagen'
         this.dataURItoBlob(fr.result, data.ImageName);
       }
            })
          }
          // console.log(this.imageInfo)
 
        } else {
          console.log('No hay imagenes')
        }
      })
      
    }
  }

  obtenerDocumentos(){

    const formData = new FormData();
    formData.append('folio', this.Folio.toString());
    this.AlmacenEmailService.readDirDocuemntosAlmacen(formData, 'cargarNombreDocuemntosOrdenCarga').subscribe(res=>{
      // console.log(res);
      this.archivos =[];
      if (res){
        // console.log(res.length)
      for(let i = 0; i<res.length; i++){
        this.archivos.push(res[i]);
        const formDataDoc = new FormData();
        formDataDoc.append('folio', this.Folio.toString())
        formDataDoc.append('archivo', res[i])
        this.AlmacenEmailService.readDocumentosAlmacen(formDataDoc,'ObtenerDocumentoOrdenCarga').subscribe(resDoc=>{
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

    if(this.tipo=='documento'){
      console.log('/////////////////////')
      console.log('DOCUMENTOOOOOOO')
      console.log('/////////////////////')
      //Guardar docuemnto tipo File en arreglo
      this.files.push(file);
    }
    if(this.tipo=='imagen'){
      console.log('/////////////////////')
      console.log('IMAGENNNNNNNNN')
      console.log('/////////////////////')
      this.filesImagen.push(file);
    }
    

    return new File([ia], fileName, { type: mimeString });
  }

  leerArchivos(a){
    const formData = new FormData();
    formData.append('folio', this.Folio.toString())
    formData.append('archivo', a)
    this.AlmacenEmailService.readDocumentosAlmacen(formData,'ObtenerDocumentoOrdenCarga').subscribe(res=>{
      // console.log(res);
      const blob = new Blob([res as BlobPart], { type: 'application/pdf' });
      let fr = new FileReader();
      
      fr.readAsDataURL(blob);
      fr.onload = e =>{
        // console.log(e);
        // console.log(fr.result);
          this.fileUrl = fr.result;
          this.pdfstatus = true;
      }
    })
  }

  //Agregar Documento
  onSelect(event){
    console.log(event)
    for (var i = 0; i < event.addedFiles.length; i++) {
     const formData = new FormData();
    formData.append('0',event.addedFiles[i])
    formData.append('folio', this.Folio.toString())
    this.AlmacenEmailService.saveFileAlmacen(formData,'guardarDocumentoOrdenCarga').subscribe(res=>{
console.log(res);
this.obtenerDocumentos();
    })
  }
    this.files.push(...event.addedFiles);
  }

  //Eliminar
  onRemove(event){
    console.log(event);
    const formData = new FormData();
        formData.append('name', event)
        formData.append('folio', this.Folio.toString())
        console.log(formData);
        this.AlmacenEmailService.deleteDocumentoAlmacen(formData,'borrarDocumentoOrdenCarga').subscribe(res => {
          console.log(res)
          this.files.splice(this.files.indexOf(event),1);
          this.obtenerDocumentos();
          this.pdfstatus = false;
        
        })
      }




      onEnviar(){
        // this.loading2=true;
        console.log(this.files);
        console.log(this.filesImagen);
        
        const formData = new FormData();
        let NoArchivos = 0;
        
        // setTimeout(()=>{
        for (let i=0; i<= this.files.length-1; i++){
          console.log(this.files[i]);
          formData.append(NoArchivos.toString(),this.files[i], this.files[i].name);
          NoArchivos = NoArchivos + 1;
        }
        if(this.evidencia==true){
          // this.obtenerImagenes();
          for (let i=0; i<= this.filesImagen.length-1; i++){
            // console.log(this.[i]);
            formData.append(NoArchivos.toString(),this.filesImagen[i], this.filesImagen[i].name);
            NoArchivos = NoArchivos + 1;
          }   
        }
    
        // NoArchivos = NoArchivos - 1;
        console.log(NoArchivos)
        formData.append('nombre', this.AlmacenEmailService.nombre)
        // formData.append('adjuntos', NoArchivos.toString())
        // formData.append('adjuntos', this.files.length.toString())
        formData.append('adjuntos', (this.files.length + this.filesImagen.length).toString())
        formData.append('email', this.AlmacenEmailService.correo+','+this.AlmacenEmailService.cco)
        formData.append('mensaje', this.AlmacenEmailService.cuerpo)
        formData.append('folio', this.Folio.toString())
        formData.append('asunto', this.AlmacenEmailService.asunto)
        // formData.append('pdf', localStorage.getItem('pdf'+this.data.foliop))
        // formData.append('xml', localStorage.getItem('xml'+this.data.foliop))
      
        console.log(formData);
        console.log(this.files);
        console.log(this.filesImagen);
        
        
            
            this.AlmacenEmailService.sendMessageAlmacen(formData).subscribe(() => {
              // this.loading2 = false;
              // this.files = []
              //document.getElementById('cerrarmodal').click();
              this.ordenCargaService.getOCID(this.IdOrdenCarga).subscribe(res => {
                if (res[0].Estatus == 'Cargada') {
              this.ordenCargaService.updatedetalleOrdenCargaEstatus(this.IdOrdenCarga, "Enviada").subscribe(data => {
              Swal.fire("Correo Enviado", "Mensaje enviado correctamente", "success");
              this.ordenCargaService.filter('');
              this.dialogRef.close();
            });
            }
            Swal.fire("Correo Enviado", "Mensaje enviado correctamente", "success");
            this.ordenCargaService.filter('');
            this.dialogRef.close();
        });
      });
          // },5000);
      }


}
