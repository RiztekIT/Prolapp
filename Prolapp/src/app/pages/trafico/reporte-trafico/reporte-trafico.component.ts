import { Component, OnInit } from '@angular/core';
import * as html2pdf from 'html2pdf.js';

declare function printTrafico();
@Component({
  selector: 'app-reporte-trafico',
  templateUrl: './reporte-trafico.component.html',
  styleUrls: ['./reporte-trafico.component.css']
})
export class ReporteTraficoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    printTrafico();
  }

  onExportClick() {
    const option = {
      margin: [0,0,0,0],
      filename: 'FacturaPDF.pdf',
      image: {type: 'jpeg', quality: 1},
      html2canvas: {scale: 2, logging: true},
      jsPDF: {orientation: 'portrait'}


    };
    const content: Element = document.getElementById('element-to-PDF');

    html2pdf()
   .from(content)
   .set(option)
   .save();
}

}
