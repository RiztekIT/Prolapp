import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlmacenEmailService } from 'src/app/services/almacen/almacen-email.service';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-enviar-orden-carga',
  templateUrl: './enviar-orden-carga.component.html',
  styleUrls: ['./enviar-orden-carga.component.css']
})
export class EnviarOrdenCargaComponent implements OnInit {

  constructor(public router: Router, public AlmacenEmailService: AlmacenEmailService, private sanitizer: DomSanitizer, public dialogRef: MatDialogRef<EnviarOrdenCargaComponent>) { }

  ngOnInit() {
    this.Folio = this.AlmacenEmailService.folio;
  }

  files: File[] = [];
  Folio: number;

  regresar(){
    this.router.navigate(['/ordencargadetalle']);
  }

  onClose(){
    this.dialogRef.close();
  }

  //Agregar Documento
  onSelect(event){
    console.log(event)
    for (var i = 0; i < event.addedFiles.length; i++) {
     const formData = new FormData();
    formData.append('0',event.addedFiles[i])
    formData.append('folio', this.Folio.toString())
    this.AlmacenEmailService.saveFile(formData).subscribe(res=>{
console.log(res);
    })
  }
    this.files.push(...event.addedFiles);
  }

  //Eliminar Documento
  onRemove(event){
    console.log(event);
    const formData = new FormData();
        formData.append('name', event.name)
        formData.append('folio', this.Folio.toString())
        console.log(formData);
        this.AlmacenEmailService.deleteDocumentoOrdenCarga(formData).subscribe(res => {
          console.log(res)
          this.files.splice(this.files.indexOf(event),1);
        })
      }



      
}
