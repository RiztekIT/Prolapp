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
import Swal from 'sweetalert2';

declare function cantidad(n);
// declare function cantidadDlls(n);

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

    calle;
    numeroext;
    colonia;
    codigopostal;
    ciudad
    estado;
    numeroint;
    lugarExpedicion;

    pdfSrc
    currentPdf
    pdf
    style;

    moneda: string = 'MXN';
    mostrarPrecios: boolean;

    

  ngOnInit() {
    this.style = 'block'
    Swal.showLoading()
    this.rfcE = this.enviarfact.empresa.RFC;
    this.logo = '../../../assets/images/'+this.rfcE+'.png'
    this.calle = this.enviarfact.empresa.Calle
  this.numeroext = this.enviarfact.empresa.NumeroExterior
  this.colonia = this.enviarfact.empresa.Colonia
  this.codigopostal = this.enviarfact.empresa.CP
  this.lugarExpedicion = this.enviarfact.empresa.LugarDeExpedicion
  this.ciudad = this.enviarfact.empresa.Ciudad
  this.estado = this.enviarfact.empresa.Estado
  this.numeroint = this.enviarfact.empresa.NumeroInterior
    this.IdPedido = this.dataComponente.IdPedido;
    this.mostrarPrecios = this.dataComponente.mostrarPrecio;
    console.log(this.IdPedido);
    this.ver();
  }
  onClose() {
        this.dialogbox.close();
        this.service.filter('Register click');
  }


  textnum: string;

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
        this.moneda = resPedido[0].Moneda;
        this.objconc = resPedido[0];
        console.log(this.objconc);
      if(resPedido[0].Moneda == 'MXN'){      
        this.textnum = cantidad(resPedido[0].Total);
      }else{
        this.textnum = cantidad(resPedido[0].TotalDlls);
      }


        this.service.GetCliente(resPedido[0].IdCliente).subscribe(resCliente=>{
        this.objCliente = resCliente[0];
          this.service.getDetallePedidoId(this.IdPedido).subscribe(resDetalle=>{
            console.log(resDetalle);
            this.arrcon = resDetalle;
            setTimeout(()=>{
              this.onExportClick();
            },1000)
            setTimeout(()=>{
              this.reloadPDF('entro')
            },4500)
          })
        })
      })
      
      console.log(this.arrcon);
    } catch (error) {
      console.log('Ocurrio algun problema');
    }
  }
  FolioVenta: any
  Folio() {
    this.service.GetFolio().subscribe(data => {
      // this.service.formt.folio = data;
      // console.log(this.service.formt.Folio);
      this.FolioVenta = data
     });
      } 
      
  onExportClick2(Folio?:string) {
    const content: Element = document.getElementById('element-to-PDF');
    const option = {    
      margin: [.5,0,0,0],
      filename: 'F-'+this.FolioVenta+'.pdf',
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

  reloadPDF(event){
    console.log(event);
    this.currentPdf = localStorage.getItem('pdfOC');
    let blob = this.b64toBlob(this.currentPdf,'application/pdf',1024)
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank'    
    link.click();
    this.style = 'none'
    
    Swal.close();
    this.onClose()

  }

  b64toBlob(b64Data, contentType, sliceSize) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  onExportClick(Folio?: string) {

    
    const content: Element = document.getElementById('element-to-PDF');
    const option = {
      
      margin: [.5, 0, 0, 0],
      filename: 'OV-'+this.FolioVenta+'.pdf',
      image: {type: 'jpeg', quality: 1},
      html2canvas: { scale: 2, logging: true },
      jsPDF: { unit: 'cm', format: 'letter', orientation: 'portrait' },
      pagebreak: { avoid: '.pgbreak' }
    };

    let worker = html2pdf().from(content).set(option).output('datauristring')

    worker.then(function(pdfAsString){
      // console.log(pdfAsString);
      this.pdf = pdfAsString;
      this.pdf = this.pdf.toString().replace(/^data:application\/pdf;filename=generated.pdf;base64,/, '')
      localStorage.setItem('pdfOC', this.pdf);
      this.currentPdf = this.pdf

      
      
      

      
      
    })


      
  }


}
