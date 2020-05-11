import { Component, OnInit, Inject } from '@angular/core';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material';
import { MessageService } from 'src/app/services/message.service';
import Swal from 'sweetalert2';

export interface parametros{
  foliop: string,
        cliente:string;
        status: boolean
}




@Component({
  selector: 'app-emailgeneral',
  templateUrl: './emailgeneral.component.html',
  styleUrls: ['./emailgeneral.component.css']
})
export class EmailgeneralComponent implements OnInit {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  constructor(public dialogRef: MatDialogRef<EmailgeneralComponent>,public _MessageService: MessageService, @Inject(MAT_DIALOG_DATA) public data: parametros) { }
  pdfstatus = false;
  fileUrl;
  files: File[] = [];
  archivos: any[];
  loading2 = false;
  Intevalo;
  // cuerpo;


  ngOnInit() {
    this.Intevalo = setInterval(()=>{  
      this.urlPDF();
    },1000)
  }

  onClose(){
    this.dialogRef.close();
    // this.service.filter('Register click');
  }

  urlPDF(){

    // const blob = new Blob([localStorage.getItem('pdf'+this.foliop) as BlobPart], { type: 'application/pdf' });
    // let file = new File(blob,'pdf.pdf')
    console.log(this.data.foliop);
    this.fileUrl = localStorage.getItem('pdfcotizacion'+this.data.foliop);
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
    // formData.append('mensaje', this._MessageService.cuerpo)
    formData.append('mensaje', this.data.cliente)
    formData.append('folio', this.data.foliop)
    formData.append('asunto', this._MessageService.asunto)
    formData.append('pdf', localStorage.getItem('pdfcotizacion'+this.data.foliop))
    // formData.append('xml', localStorage.getItem('xml'+this.data.foliop))
  
    console.log(formData);
    
    
        
        this._MessageService.enviarCorreo(formData).subscribe(() => {
          this.loading2 = false;
          this.files = []
          //document.getElementById('cerrarmodal').click();
          Swal.fire("Correo Enviado", "Mensaje enviado correctamente", "success");
        });
      },5000);
  }


  


}
