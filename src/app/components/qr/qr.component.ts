import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import * as html2pdf from 'html2pdf.js';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.css']
})
export class QrComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<QrComponent>,) { }

  QRtarima: string;
QRsize:number;

  ngOnInit() {
    console.clear();
    this.QRtarima = localStorage.getItem("QRtarima");
    console.log('this.QRtarima: ', this.QRtarima);
  }


  onClose(){
    this.dialogRef.close();
    // localStorage.removeItem("QRtarima")
  }


//PDF
  onExportClick() {
    const content: Element = document.getElementById('QR-PDF');
    const option = {    
      margin: [.5,.5,0,.5],
      filename: 'QR_'+this.QRtarima+'.pdf',
      image: {type: 'jpeg', quality: 1},
      html2canvas: {scale: 2, logging: true},
      jsPDF: {unit: 'cm', format: 'letter', orientation: 'portrait'}, 
      pagebreak:{ avoid: '.pgbreak'}
    };
  
    html2pdf()
   .from(content)
   .set(option)
   .save();

   
  this.onClose();

  }

}
