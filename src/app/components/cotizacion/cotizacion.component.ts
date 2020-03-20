import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import * as html2pdf from 'html2pdf.js';
import { MessageService } from 'src/app/services/message.service';


@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.css']
})
export class CotizacionComponent implements OnInit {

  constructor(public dialogbox: MatDialogRef<CotizacionComponent>, public _MessageService: MessageService) { }

  ngOnInit() {
  }

  onClose() {
    this.dialogbox.close();
}

onExportClick(Folio?:string) {
  const content: Element = document.getElementById('Cotizacion-PDF');
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
