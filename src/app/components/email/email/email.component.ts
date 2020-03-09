import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import Swal from 'sweetalert2';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpRequest, HttpClient, HttpEventType, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, tap, last, map } from 'rxjs/operators';
import { Subscription, of } from 'rxjs';




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
  // @Output() complete = new EventEmitter<string>();
  

  files: File[] = [];
  // sanitizer: any;
  loading2 = false;
  fileUrl;
  a = document.createElement('a');
  pdfstatus = false;

  private files2: Array<FileUploadModel> = [];

  constructor(public _MessageService: MessageService,private sanitizer: DomSanitizer, private _http: HttpClient) { 
  }
  
  ngOnInit() {
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.urlPDF();
    
  }

//   onClick() {
//     const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
//     fileUpload.onchange = () => {
//           for (let index = 0; index < fileUpload.files.length; index++) {
//                 const file = fileUpload.files[index];
//                 this.files2.push({ data: file, state: 'in', 
//                   inProgress: false, progress: 0, canRetry: false, canCancel: true });
//           }
//           this.uploadFiles();
//     };
//     fileUpload.click();
// }

// private uploadFiles() {
//   const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
//   fileUpload.value = '';

//   this.files2.forEach(file => {this.uploadFile(file);});
// }



  

//   private uploadFile(file: FileUploadModel) {
//     const fd = new FormData();
//     console.log(file);
//     fd.append(this.param, file.data);
//     console.log(fd.get(this.param))
//     const req = new HttpRequest('POST', 'https://file.io', fd, {
//           reportProgress: true
//     });

//     file.inProgress = true;
//     file.sub = this._http.request(req).pipe(
//           map(event => {
//                 switch (event.type) {
//                       case HttpEventType.UploadProgress:
//                             // file.progress = Math.round(event.loaded * 100 / event.total);
//                             break;
//                       case HttpEventType.Response:
//                             return event;
//                 }
//           }),
//           tap(message => { }),
//           last(),
//           catchError((error: HttpErrorResponse) => {
//                 // file.inProgress = false;
//                 // file.canRetry = true;
//                 console.log(error);
//                 return of('upload failed.');
//           })
//     ).subscribe(
//           (event: any) => {
//                 if (typeof (event) === 'object') {
//                       // this.removeFileFromArray(file);
//                       this.complete.emit(event.body);
//                       console.log(event.body);
//                       this.fileUrl = event.body.link
//                       this.pdfstatus=true;
//                 }
//           }
//     );
// }

  urlPDF(){

    const blob = new Blob([localStorage.getItem('pdf'+this.foliop) as BlobPart], { type: 'application/pdf' });
    // let file = new File(blob,'pdf.pdf')
    this.fileUrl = window.URL.createObjectURL(blob);
    // this.fileUrl = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(localStorage.getItem('pdf'+this.foliop)))
    // this.fileUrl = localStorage.getItem('pdf'+this.foliop); 
    // this.pdfstatus = true;   
    console.log(this.fileUrl);
  }

  leerArchivo(){
    const formData = new FormData();
    formData.append('folio', this.foliop)
    console.log(this.foliop);

    
    

    this._MessageService.readFile(formData).subscribe(res=>{
      console.log(res);
      const blob = new Blob([res as ArrayBuffer], { type: 'application/xml' });
      // this.files.push(blob)
      console.log(blob);
      let file = new File([blob],'archivo.xml');
      this.files.push(file);


      
      
    })
    
  
  }

  

  onSelect(event){
    console.log(event);
    const formData = new FormData();
    formData.append('0',event.addedFiles[0])
    formData.append('folio', this.foliop)
    this._MessageService.saveFile(formData).subscribe(res=>{
      console.log(res);
    })
    this.files.push(...event.addedFiles);
    // this.uploadFile(event.addedFiles[0]);
  }

  onRemove(event){
    console.log(event);
    this.files.splice(this.files.indexOf(event),1);
    
  }

  onEnviar(){
    this.loading2=true;
    console.log(this.foliop);
    
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
    formData.append('folio', this.foliop)
    formData.append('asunto', this._MessageService.asunto)
    formData.append('pdf', localStorage.getItem('pdf'+this.foliop))
    formData.append('xml', localStorage.getItem('xml'+this.foliop))
  
    console.log(formData);
    
    
        
        this._MessageService.sendMessage(formData).subscribe(() => {
          this.loading2 = false;
          this.files = []
          document.getElementById('cerrarmodal').click();
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