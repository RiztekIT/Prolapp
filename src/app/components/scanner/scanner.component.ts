import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css']
})
export class ScannerComponent implements OnInit {
  qrleido;

  constructor(public dialogRef: MatDialogRef<ScannerComponent>) { }

  ngOnInit() {
  }

  escaner(evento){
    console.log(evento);
    this.qrleido = evento;
    this.dialogRef.close(this.qrleido)
    
    // this.enableScan = false;
  }

}
