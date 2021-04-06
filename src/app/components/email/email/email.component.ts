import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter, Inject } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import Swal from 'sweetalert2';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpRequest, HttpClient, HttpEventType, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, tap, last, map } from 'rxjs/operators';
import { Subscription, of } from 'rxjs';
import * as html2pdf from 'html2pdf.js';
import * as FileSaver from 'file-saver';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

export interface parametros{
  foliop: string,
        idp: string,
        status: boolean
}


@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  // @Input() param = 'file';
  @Input() foliop: any;
  @Input() idp: any;
  @Input() status:boolean;
  // @Output() complete = new EventEmitter<string>();
  
  

  files: File[] = [];
  // sanitizer: any;
  loading2 = false;
  fileUrl;
  a = document.createElement('a');
  pdfstatus = false;
  archivos: any[];
  Intevalo;

  // private files2: Array<FileUploadModel> = [];

  constructor(public _MessageService: MessageService,private sanitizer: DomSanitizer, private _http: HttpClient,
    public dialogRef: MatDialogRef<EmailComponent>,@Inject(MAT_DIALOG_DATA) public data: parametros) { 
  }
  
  ngOnInit() {
    // setTimeout(()=>{

      
    // },1500)

    this.Intevalo = setInterval(()=>{  
      this.urlPDF();
    },1000)
  
  }

  
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    // this.urlPDF();
    
  }



  urlPDF(){

    // const blob = new Blob([localStorage.getItem('pdf'+this.foliop) as BlobPart], { type: 'application/pdf' });
    // let file = new File(blob,'pdf.pdf')
    console.log(this.data.foliop);
    this.fileUrl = localStorage.getItem('pdf'+this.data.foliop);
    // this.fileUrl = localStorage.getItem('pdfnuevo2');
    // this.fileUrl = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(localStorage.getItem('pdf'+this.foliop)))
    // this.fileUrl = localStorage.getItem('pdf'+this.foliop); 
    // this.pdfstatus = true;  
    if (this.fileUrl){
      console.log(this.fileUrl);
      this.pdfstatus=true;
      clearInterval(this.Intevalo);
      this.leerDir();
    } 
    console.log(this.fileUrl);
  }

  leerArchivo(){
    const formData = new FormData();
    formData.append('folio', this.data.foliop)
    formData.append('archivo', this.archivos[0])
    console.log(this.data.foliop);
    this._MessageService.readFile(formData).subscribe(res=>{
      console.log(res);
      const blob = new Blob([res as BlobPart], { type: 'application/pdf' });
      let fr = new FileReader();
      
      fr.readAsDataURL(blob);
      fr.onload = e =>{
        console.log(e);
        console.log(fr.result);
          this.fileUrl = fr.result;
      }
    })
  }

  leerArchivos(a){
    const formData = new FormData();
    formData.append('folio', this.data.foliop)
    formData.append('archivo', a)
    console.log(this.data.foliop);
    this._MessageService.readFile(formData).subscribe(res=>{
      console.log(res);
      const blob = new Blob([res as BlobPart], { type: 'application/pdf' });
      let fr = new FileReader();
      
      fr.readAsDataURL(blob);
      fr.onload = e =>{
        console.log(e);
        console.log(fr.result);
          this.fileUrl = fr.result;
      }
    })
  }

  leerDir(){

    const formData = new FormData();
    formData.append('folio', this.data.foliop)
    console.log(this.data.foliop);
    this._MessageService.readDir(formData).subscribe(res=>{
      console.log(res);
      this.archivos =[];
      if (res){
      for(let i = 0; i<res.length; i++){
        this.archivos.push(res[i]);
      }
    }
    })

  }
  onClose(){
    this.dialogRef.close();
    // this.service.filter('Register click');
  }

  

  onSelect(event){
    console.log(event);
    const formData = new FormData();
    formData.append('0',event.addedFiles[0])
    formData.append('folio', this.data.foliop)
    this._MessageService.saveFile(formData).subscribe(res=>{
      console.log(res);
      this.leerDir();
    })
    this.files.push(...event.addedFiles);
  }

  onRemove(event){
    console.log(event);
    this.files.splice(this.files.indexOf(event),1);
    
  }

  onEnviar(){
    this.loading2=true;
    console.log(this.data.foliop);
    
    const formData = new FormData();
    
    setTimeout(()=>{
    for (let i=0; i<= this.files.length-1; i++){
      console.log(this.files[i]);
      
      formData.append(i.toString(),this.files[i], this.files[i].name);
    }

    
    formData.append('nombre', this._MessageService.nombre)
    formData.append('adjuntos', this.files.length.toString())
    formData.append('email', this._MessageService.correo+','+this._MessageService.cco)
    formData.append('mensaje', this._MessageService.cuerpo)
    formData.append('folio', this.data.foliop)
    formData.append('asunto', this._MessageService.asunto)
    formData.append('pdf', localStorage.getItem('pdf'+this.data.foliop))
    formData.append('xml', localStorage.getItem('xml'+this.data.foliop))
  
    console.log(formData);
    
    
        
        this._MessageService.sendMessage(formData).subscribe(() => {
          this.loading2 = false;
          this.files = []
          //document.getElementById('cerrarmodal').click();
          Swal.fire("Correo Enviado", "Mensaje enviado correctamente", "success");
        });
      },5000);
  }

}


export class FileUploadModel {
  data: File;
  state: string;
  inProgress: boolean;
  progress: number;
  canRetry: boolean;
  canCancel: boolean;
  sub?: Subscription;
}