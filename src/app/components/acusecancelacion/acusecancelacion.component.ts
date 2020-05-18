import { Component, OnInit, Inject } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-acusecancelacion',
  templateUrl: './acusecancelacion.component.html',
  styleUrls: ['./acusecancelacion.component.css']
})
export class AcusecancelacionComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  rfcemisor;
  fechahorasolicitud;
  fechahoracancel;
  foliofiscal;
  estatus;
  sellodigitalsat;

  ngOnInit() {
    this.acuse();
  }

  acuse(){
    this.rfcemisor = this.data.rfcemisor;
    this.fechahorasolicitud = this.data.fechahorasolicitud;
    this.fechahoracancel = this.data.fechahoracancel;
    this.foliofiscal = this.data.foliofiscal;
    this.estatus = this.data.estatus;
    this.sellodigitalsat = this.data.sellodigitalsat;

    console.log(this.rfcemisor);
    console.log(this.fechahorasolicitud);
    console.log(this.fechahoracancel);
    console.log(this.foliofiscal);
    console.log(this.estatus);
    console.log(this.sellodigitalsat);
  }

  descargar(){
    
      // this.proceso = 'xml';
      const content: Element = document.getElementById('Acuse-PDF');
      const option = {
        margin: [.5, .5, .5, 0],
        filename: 'Acuse-1.pdf',
        image: { type: 'jpeg', quality: 1 },
        // html2canvas: { scale: 2, logging: true, scrollY: -2, scrollX: -15 },
        html2canvas: { scale: 2, logging: true },
        jsPDF: { unit: 'cm', format: 'letter', orientation: 'p' },
        pagebreak: { avoid: '.pgbreak' }
  
      };
  
      html2pdf()
        .from(content)
        .set(option).toPdf().get('pdf').then(function (pdf) {
          setTimeout(() => { }, 1000);
        })
        .save();
      
      // this.dialog.closeAll();
      
     
  }

}
