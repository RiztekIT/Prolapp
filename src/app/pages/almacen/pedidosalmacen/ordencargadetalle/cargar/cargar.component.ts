import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ImagenService } from '../../../../../services/imagenes/imagen.service';
import { Imagenes } from 'src/app/Models/Imagenes/imagenes-model';
import { OrdenCargaService } from 'src/app/services/almacen/orden-carga/orden-carga.service';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ImgInfo } from 'src/app/Models/Imagenes/imgInfo-model';


@Component({
  selector: 'app-cargar',
  templateUrl: './cargar.component.html',
  styleUrls: ['./cargar.component.css']
})
export class CargarComponent implements OnInit {

  constructor(public router: Router, public imageService: ImagenService, public ordenCargaService: OrdenCargaService, private _sanitizer: DomSanitizer) { }

  ngOnInit() {
this.IdOrdenCarga = +localStorage.getItem('IdOrdenCarga');
this.ObtenerFolio(this.IdOrdenCarga);

  }
  files: File[] = [];
  imagenes: any[];
  IdOrdenCarga: number;
  Folio: number;

  imagePath: SafeResourceUrl;
  imageInfo: ImgInfo[] = [];

  // public listUM: Array<any> = [];
  // listProducts: Producto[] = [];



  imagenSeleccionada: boolean;

  regresar(){
    this.router.navigate(['/ordencargadetalle']);
    

  }

  ObtenerFolio(id: number){
this.ordenCargaService.getOrdenCargaID(id).subscribe( dataOC =>{
  console.log(dataOC);
this.Folio = dataOC[0].Folio;
console.log(this.Folio);
this.leerDirImagenes();
})
  }

  //Metodo ejecutado cuando se agrega(n) archivo(s) en el dropzone
  onSelect(event){
    this.imagenSeleccionada = true;
    // console.log(event);
    console.log(event.addedFiles[0])
    // for(let i = 0; i<event.addedFiles.length; i++){
    // const formData = new FormData();
    // formData.append('0',event.addedFiles[i])
    //Cambiar el folio, por uno en base a la orden de carga
    // formData.append('folio', this.Folio.toString())
    // console.log(formData);
    // this.imageService.saveImagenOrdenCarga(formData).subscribe(res=>{
      // console.log('RESPUESTA')
      // console.log(res);
      //Guardar ruta de la imagen en la base de datos
      //imagenes/OrdenCarga/folio/nombreIMAGEN
      // const imagen = new Imagenes();
      // imagen.Folio = 5;
      // this.imageService.addImagen(imagen).subscribe(res =>{
        // this.leerDirImagenes();

      // })
    // })
  // }
    this.files.push(...event.addedFiles);
  }

  // al remover una imagen del dropzone
  onRemove(event){
    console.log(event);
    // const formData = new FormData();
    // formData.append('name', event.name)
    //Cambiar el folio, por uno en base a la orden de carga
    //Cambiar el folio, por uno en base a la orden de carga
    // formData.append('folio', this.Folio.toString())
    // console.log(formData);
    // this.imageService.deleteImagenOrdenCarga(formData).subscribe( res =>{
      // console.log(res);
      this.files.splice(this.files.indexOf(event),1);
      // this.leerDirImagenes();
    // })

  }

  //Eliminar imagen del servidor 
  deleteImage(imageName: string){
    console.log(imageName);
    //SWAL ALERT DELETE
    const formData = new FormData();
    formData.append('name', imageName)
    formData.append('folio', this.Folio.toString())
    console.log(formData);
    this.imageService.deleteImagenOrdenCarga(formData).subscribe( res =>{
      console.log(res);
      //Eliminar Imagen de la base de datos
      this.leerDirImagenes();
    })

  }

  guardarImagenes(){
    console.log(this.files[0]);
    if(this.files.length>0){
this.imagenSeleccionada = true;
      //recorrer el arreglo que se lleno previamente al seleccionar las imagenes ( Dropzone )
      for(let i = 0; i<this.files.length; i++){
        console.log(this.files[i]);
        //agregar informacion necesaria a el objeto
    const formData = new FormData();
    formData.append('0',this.files[i]);
    formData.append('folio', this.Folio.toString())
    console.log(formData);
    //Guardar la imagen en el servidor
    this.imageService.saveImagenOrdenCarga(formData).subscribe(res=>{
      console.log('RESPUESTA')
      console.log(res);
      this.leerDirImagenes();
      const imagen = new Imagenes();
      imagen.Folio = this.Folio;
      imagen.Tipo = 'OrdenCarga';
      imagen.Imagen='';
      // imagen.Path='';
      console.log('////////////////////////////')
      console.log(this.files[i].name)
      imagen.Path='imagenes/OrdenCarga/'+this.Folio.toString()+'/'+this.files[i].name;
      console.log(imagen);
      //Guardar Imagen en base de datos
      this.imageService.addImagen(imagen).subscribe(resDB =>{
        console.log(resDB)
      })
    })
  }
  }else{
this.imagenSeleccionada = false;
  }
  }
  
  //Metodo para obtener el nombre de las imagenes y posteriormente traerse la imagen del servidor
  leerDirImagenes(){  
    //Obtener nombre de la imagen del servidor
    const formData = new FormData();
    formData.append('folio', this.Folio.toString())
    this.imageService.readDirImagenes(formData).subscribe(res=>{
      console.log(res);
      this.imagenes =[];
      this.imageInfo = [];
      this.files = [];
      if (res){
      for(let i = 0; i<res.length; i++){
        this.imagenes.push(res[i]);
        let data = new ImgInfo;
        data.ImageName = res[i];

        //Traer la imagen del servidor
        const formData = new FormData();
    formData.append('folio', this.Folio.toString())
    formData.append('archivo', data.ImageName)
    console.log(formData);
    this.imageService.readImagenes(formData).subscribe(resImagen=>{
      console.log(resImagen);
      var base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(resImagen)));
      data.ImagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,'+ base64String);
        console.log(data);
        this.imageInfo.push(data)
    })
      }
      console.log(this.imageInfo)

    }
    })

  }

  //Metodo para obtener imagen del server, recibe como parametro el nombre del archivo (  YA NO SE UTILIZA EN ESTE COMPONENTE  )
  obtenerImagen(a){
    console.log(a);
    const formData = new FormData();
    formData.append('folio', this.Folio.toString())
    formData.append('archivo', a)
    console.log(formData);
    this.imageService.readImagenes(formData).subscribe(res=>{
      console.log(res);
      var base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(res)));
      // console.log(base64String);
      // this.user_photo = this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + data).toString();
      this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,'+ base64String);
    })
  }



}
