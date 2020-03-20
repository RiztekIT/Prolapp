import { Component, OnInit } from '@angular/core';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-orden-carga',
  templateUrl: './orden-carga.component.html',
  styleUrls: ['./orden-carga.component.css']
})
export class OrdenCargaComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  
onExportClick(Folio?:string) {
  const content: Element = document.getElementById('OrdenCarga-PDF');
  const option = {    
    margin: [.5,0,0,0],
    filename: 'F-'+'.pdf',
    image: {type: 'jpeg', quality: 1},
    html2canvas: {scale: 2, logging: true},
    jsPDF: {unit: 'cm', format: 'letter', orientation: 'portrait'}, 
    pagebreak:{ avoid: '.pgbreak'}
  };

  html2pdf()
 .from(content)
 .set(option)
 .save();
} 

}
