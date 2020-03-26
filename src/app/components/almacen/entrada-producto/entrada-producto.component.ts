import { Component, OnInit } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-entrada-producto',
  templateUrl: './entrada-producto.component.html',
  styleUrls: ['./entrada-producto.component.css']
})
export class EntradaProductoComponent implements OnInit {

  constructor(public dialogbox: MatDialogRef<EntradaProductoComponent>,) { }

  ngOnInit() {
  }

  onClose() {
    this.dialogbox.close();
}







onExportClick(Folio?:string) {
  const content: Element = document.getElementById('EntradaProducto-PDF');
  const option = {    
    margin: [.5,1,.5,1],
    filename: 'F-'+'.pdf',
    // image: {type: 'jpeg', quality: 1},
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
