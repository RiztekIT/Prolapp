import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ReciboPagoService } from 'src/app/services/complementoPago/recibo-pago.service';

@Component({
  selector: 'app-complemento-pago',
  templateUrl: './complemento-pago.component.html',
  styleUrls: ['./complemento-pago.component.css']
})
export class ComplementoPagoComponent implements OnInit {

  constructor(public dialogbox: MatDialogRef<ComplementoPagoComponent>, public router: Router, private _formBuilder: FormBuilder, 
    public service: ReciboPagoService) { }

  ngOnInit() {
    this.ver();
  }

  onClose() {
    this.dialogbox.close();
    this.service.filter('Register click');
}
  ver(){

    console.log(this.service.formt)
  }

}
