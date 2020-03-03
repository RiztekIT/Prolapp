import { Component, OnInit } from '@angular/core';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-reportescxc',
  templateUrl: './reportescxc.component.html',
  styleUrls: ['/reportescxc.component.css']
})
export class ReportescxcComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onExportClick(){
    const content: Element = document.getElementById('element-to-PDF');
    const option = {    
    margin: [.5,0,0,0],
    filename: 'F-.pdf',
    image: {type: 'jpeg', quality: 1},
    html2canvas: {scale: 2, logging: true, scrollY: content.scrollHeight},
    jsPDF: {unit: 'cm', format: 'letter', orientation: 'portrait'}, 
    pagebreak:{ avoid: '.pgbreak'}
  };

  html2pdf()
 .from(content)
 .set(option)
 .save();
  }
}
