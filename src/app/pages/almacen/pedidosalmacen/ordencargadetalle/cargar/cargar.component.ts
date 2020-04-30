import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ImagenService } from '../../../../../services/imagenes/imagen.service';


@Component({
  selector: 'app-cargar',
  templateUrl: './cargar.component.html',
  styleUrls: ['./cargar.component.css']
})
export class CargarComponent implements OnInit {

  constructor(public router: Router, public imageService: ImagenService) { }

  ngOnInit() {
  }
  files: File[] = [];
  imagenes: any[];

  regresar(){
    this.router.navigate(['/ordencargadetalle']);
    

  }

  //Metodo ejecutado cuando se agrega(n) archivo(s) en el dropzone
  // onSelect(event){
  //   console.log(event);
  //   const formData = new FormData();
  //   formData.append('0',event.addedFiles[0])
  //   formData.append('folio', this.data.foliop)
  //   this.imageService.saveFile(formData).subscribe(res=>{
  //     console.log(res);
  //     this.leerDir();
  //   })
  //   this.files.push(...event.addedFiles);
  // }

  // onRemove(event){
  //   console.log(event);
  //   this.files.splice(this.files.indexOf(event),1);
    
  // }

  // leerArchivo(){
  //   const formData = new FormData();
  //   formData.append('folio', this.data.foliop)
  //   formData.append('archivo', this.archivos[0])
  //   console.log(this.data.foliop);
  //   this.ImagenService.readFile(formData).subscribe(res=>{
  //     console.log(res);
  //     const blob = new Blob([res as BlobPart], { type: 'application/pdf' });
  //     let fr = new FileReader();
      
  //     fr.readAsDataURL(blob);
  //     fr.onload = e =>{
  //       console.log(e);
  //       console.log(fr.result);
  //         this.fileUrl = fr.result;
  //     }
  //   })
  // }

  // leerArchivos(a){
  //   const formData = new FormData();
  //   formData.append('folio', this.data.foliop)
  //   formData.append('archivo', a)
  //   console.log(this.data.foliop);
  //   this.ImagenService.readFile(formData).subscribe(res=>{
  //     console.log(res);
  //     const blob = new Blob([res as BlobPart], { type: 'application/pdf' });
  //     let fr = new FileReader();
      
  //     fr.readAsDataURL(blob);
  //     fr.onload = e =>{
  //       console.log(e);
  //       console.log(fr.result);
  //         this.fileUrl = fr.result;
  //     }
  //   })
  // }

  // leerDir(){

  //   const formData = new FormData();
  //   formData.append('folio', this.data.foliop)
  //   console.log(this.data.foliop);
  //   this.ImagenService.readDir(formData).subscribe(res=>{
  //     console.log(res);
  //     this.archivos =[];
  //     if (res){
  //     for(let i = 0; i<res.length; i++){
  //       this.archivos.push(res[i]);
  //     }
  //   }
  //   })

  // }


}
