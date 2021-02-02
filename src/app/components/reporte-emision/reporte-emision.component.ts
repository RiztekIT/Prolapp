import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { PedidoService } from '../../services/pedidos/pedido.service';
import { ClientesService } from '../../services/catalogos/clientes.service';
import { EmpresaService } from '../../services/empresas/empresa.service';
import { Pedido } from 'src/app/Models/Pedidos/pedido-model';
import { VentasPedidoService } from '../../services/ventas/ventas-pedido.service';
import * as html2pdf from 'html2pdf.js';
import { EnviarfacturaService } from 'src/app/services/facturacioncxc/enviarfactura.service';
import { Cliente } from '../../Models/catalogos/clientes-model';

@Component({
  selector: 'app-reporte-emision',
  templateUrl: './reporte-emision.component.html',
  styleUrls: ['./reporte-emision.component.css']
})
export class ReporteEmisionComponent implements OnInit {

  constructor(public dialogbox: MatDialogRef<ReporteEmisionComponent>, public router: Router, private _formBuilder: FormBuilder, 
    public service: VentasPedidoService, public enviarfact: EnviarfacturaService,@Inject(MAT_DIALOG_DATA) public dataComponente: any  ) { }

    con : string| number;
    arrcon: Array<any> = [];
  
    objconc: any = []; 
    objCliente: Cliente;
    logo;
    rfcE: string;
  
    IdPedido: number;

  ngOnInit() {
    this.rfcE = this.enviarfact.empresa.RFC;
    this.logo = '../../../assets/images/'+this.rfcE+'.png'
    this.IdPedido = this.dataComponente.IdPedido;
    console.log(this.IdPedido);
    this.ver();
  }
  onClose() {
        this.dialogbox.close();
        this.service.filter('Register click');
  }

  ver(){

    // console.log(this.service.formt.DetallePedido);
    
    // this.objconc = this.service.formt.DetallePedido
    
    // this.arrcon = [];
    // for (this.con in this.objconc){
    //   var conceptos = this.objconc[this.con];
    //   this.arrcon.push({
    //     IdDetallePedido: conceptos.IdDetallePedido,
    //     IdPedido: conceptos.IdPedido,
    //     ClaveProducto: conceptos.ClaveProducto,
    //     Producto: conceptos.Producto,
    //     Unidad: conceptos.Unidad,
    //     PrecioUnitario: conceptos.PrecioUnitario,
    //     Cantidad: conceptos.Cantidad,
    //     Importe: conceptos.Importe,
    //     Observaciones: conceptos.Observaciones,
    //     TextoExtra: conceptos.TextoExtra,
    //     PrecioUnitarioDlls: conceptos.PrecioUnitarioDlls,
    //     ImporteDlls: conceptos.ImporteDlls
    //   });
    // }
    try {    
      this.service.getPedidoId(this.IdPedido).subscribe(resPedido=>{
        console.log(resPedido);
        this.objconc = resPedido[0];
        console.log(this.objconc);
        this.service.GetCliente(resPedido[0].IdCliente).subscribe(resCliente=>{
        this.objCliente = resCliente[0];
          this.service.getDetallePedidoId(this.IdPedido).subscribe(resDetalle=>{
            console.log(resDetalle);
            this.arrcon = resDetalle;
          })
        })
      })
      
      console.log(this.arrcon);
    } catch (error) {
      console.log('Ocurrio algun problema');
    }
  }
  Folio() {
    this.service.GetFolio().subscribe(data => {
      this.service.formt.folio = data;
      console.log(this.service.formt.Folio); })  ;
      } 
      
  onExportClick(Folio?:string) {
    const content: Element = document.getElementById('element-to-PDF');
    const option = {    
      margin: [.5,0,0,0],
      filename: 'F-'+this.service.formt.Folio+'.pdf',
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
