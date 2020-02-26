import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { PedidoService } from '../../services/pedidos/pedido.service';

@Component({
  selector: 'app-reporte-emision',
  templateUrl: './reporte-emision.component.html',
  styleUrls: ['./reporte-emision.component.css']
})
export class ReporteEmisionComponent implements OnInit {

  constructor(public dialogbox: MatDialogRef<ReporteEmisionComponent>, public router: Router, private _formBuilder: FormBuilder, private service: PedidoService) { }

  ngOnInit() {
  }
  onClose() {
        this.dialogbox.close();
        this.service.filter('Register click');
  }

}
