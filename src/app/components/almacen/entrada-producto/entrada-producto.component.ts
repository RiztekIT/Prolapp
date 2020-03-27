import { Component, OnInit } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { MatDialogRef } from '@angular/material';
import { OrdenCargaService } from 'src/app/services/almacen/orden-carga/orden-carga.service';

@Component({
  selector: 'app-entrada-producto',
  templateUrl: './entrada-producto.component.html',
  styleUrls: ['./entrada-producto.component.css']
})
export class EntradaProductoComponent implements OnInit {
  usda: any;
  pesoTotal: any;
  pedimento: any;

  constructor(public dialogbox: MatDialogRef<EntradaProductoComponent>, public service: OrdenCargaService) { }

  objconc: any;
  con: string | number;
  arrcon: Array<any> = [];



  ngOnInit() {
    
    console.clear();
    console.log(this.service.formData);
    this.ver();
  }

  onClose() {
    this.dialogbox.close();
  }
  ver() {
    console.clear();
    console.log(this.service.formDatapdf);
    
    this.objconc = this.service.formDatapdf.detalleOrdenCarga;
// select a orden temporal con base al id de la carga
    this.arrcon = [];
    for (this.con in this.objconc) {
      var conceptos = this.objconc[this.con];
      this.arrcon.push({
        IdDetalleOrdenCarga: conceptos.IdDetalleOrdenCarga,
        IdOrdenCarga: conceptos.IdOrdenCarga,
        ClaveProducto: conceptos.ClaveProducto,
        Producto: conceptos.Producto,
        Sacos: conceptos.Sacos,
        PesoxSaco: conceptos.PesoxSaco,
        Lote: conceptos.Lote,
        IdProveedor: conceptos.IdProveedor,
        Proveedor: conceptos.Proveedor,
        PO: conceptos.PO,
        FechaMFG: conceptos.FechaMFG,
        FechaCaducidad: conceptos.FechaCaducidad,
        Shipper: conceptos.Shipper,
        USDA: conceptos.USDA,
        Pedimento: conceptos.Pedimento,
        Saldo: conceptos.Saldo,
      });
    }
    console.log(conceptos.USDA);
    this.usda = conceptos.USDA;
    this.pesoTotal = +conceptos.Sacos * +conceptos.PesoxSaco;
    this.pedimento = conceptos.Pedimento;
  }






  onExportClick(Folio?: string) {
    const content: Element = document.getElementById('EntradaProducto-PDF');
    const option = {
      margin: [.5, 1, .5, 1],
      filename: 'F-' + '.pdf',
      // image: {type: 'jpeg', quality: 1},
      html2canvas: { scale: 2, logging: true },
      jsPDF: { unit: 'cm', format: 'letter', orientation: 'portrait' },
      pagebreak: { avoid: '.pgbreak' }
    };

    html2pdf()
      .from(content)
      .set(option)
      .save();
  }


}
