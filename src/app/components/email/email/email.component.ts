import { Component, OnInit, Input } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import Swal from 'sweetalert2';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  @Input() foliop: any;
  @Input() idp: any;

  files: File[] = [];
  sanitizer: any;
  loading2 = false;

  constructor(public _MessageService: MessageService) { }

  ngOnInit() {
   
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
      let file = new File([blob],'archivo.pdf');
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
