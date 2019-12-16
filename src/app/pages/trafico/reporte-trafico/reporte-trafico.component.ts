import { Component, OnInit } from '@angular/core';
import * as html2pdf from 'html2pdf.js';

declare function printTrafico();
@Component({
  selector: 'app-reporte-trafico',
  templateUrl: './reporte-trafico.component.html',
  styles: []
})
export class ReporteTraficoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    printTrafico();
  }

  onExportClick() {
    const option = {
      filename: 'FacturaPDF.pdf',
      image: {type: 'jpeg'},
      html2canvas: {},
      jsPDF: {orientation: 'portrait'}
    };
    const content: Element = document.getElementById('element-to-PDF');

    html2pdf()
   .from(content)
   .set(option)
   .save();
}

}
