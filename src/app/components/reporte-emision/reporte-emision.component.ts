import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { PedidoService } from '../../services/pedidos/pedido.service';
import { ClientesService } from '../../services/catalogos/clientes.service';
import { EmpresaService } from '../../services/empresas/empresa.service';
import { Pedido } from 'src/app/Models/Pedidos/pedido-model';
import { VentasPedidoService } from '../../services/ventas/ventas-pedido.service';

@Component({
  selector: 'app-reporte-emision',
  templateUrl: './reporte-emision.component.html',
  styleUrls: ['./reporte-emision.component.css']
})
export class ReporteEmisionComponent implements OnInit {

  constructor(public dialogbox: MatDialogRef<ReporteEmisionComponent>, public router: Router, private _formBuilder: FormBuilder, 
    public service: VentasPedidoService ) { }

    con : string| number;
    arrcon: Array<any> = [];
  
    objconc: any; 
  

  ngOnInit() {
    this.ver();
  }
  onClose() {
        this.dialogbox.close();
        this.service.filter('Register click');
  }

  ver(){

    console.log(this.service.formt.DetallePedido[0]);
    
    this.objconc = this.service.formt.DetallePedido
    
    this.arrcon = [];
    for (this.con in this.objconc){
      var conceptos = this.objconc[this.con];
      this.arrcon.push({
        IdDetallePedido: conceptos.IdDetallePedido,
        IdPedido: conceptos.IdPedido,
        ClaveProducto: conceptos.ClaveProducto,
        Producto: conceptos.Producto,
        Unidad: conceptos.Unidad,
        PrecioUnitario: conceptos.PrecioUnitario,
        Cantidad: conceptos.Cantidad,
        Importe: conceptos.Importe,
        Observaciones: conceptos.Observaciones,
        TextoExtra: conceptos.TextoExtra,
        PrecioUnitarioDlls: conceptos.PrecioUnitarioDlls,
        ImporteDlls: conceptos.ImporteDlls
      });
    }
    console.log(this.arrcon);


  }

}
