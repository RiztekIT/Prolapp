import { Component, OnInit } from '@angular/core';
import { DocumentosImportacionService } from 'src/app/services/importacion/documentos-importacion.service';

import * as html2pdf from 'html2pdf.js';
import { TraspasoMercanciaService } from 'src/app/services/importacion/traspaso-mercancia.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-orden-carga-descarga',
  templateUrl: './orden-carga-descarga.component.html',
  styleUrls: ['./orden-carga-descarga.component.css']
})
export class OrdenCargaDescargaComponent implements OnInit {

  constructor(public traspasoSVC: TraspasoMercanciaService,
    public dialogbox: MatDialogRef<OrdenCargaDescargaComponent>,
  ) { }

  objconc: any;
  con: string | number;
  arrcon: Array<any> = [];
  usdaArr: Array<any> = [];
  pesototalprod;
  pesototal;
  sacosTotales;
  cliente;
  folio;
  expedicion;
  caja;
  Fletera;
  enviarA;

  ngOnInit() {
    this.obtenerDetallesTraspaso()
    this.ver()
  }
  
  
  
  obtenerDetallesTraspaso() {
    this.traspasoSVC.formrow[0].forEach((element,i) => {

      let id = element.IdTraspasoMercancia;
      this.traspasoSVC.GetTraspasoMercanciaid(id).subscribe(res => {
        let idOC = res[0].IdOrdenCarga;
        console.log('%c⧭', 'color: #408059', res);
        
        let query = 'select * from OrdenCarga where idordencarga ='+ idOC;
        let consulta = {
          'consulta':query
        };
        
        this.traspasoSVC.getQuery(consulta).subscribe((detalles: any)=>{
          console.log('%c⧭', 'color: #00ff88', detalles);
          this.caja = detalles[0].Caja
          this.Fletera = detalles[0].Fletera
          this.cliente = detalles[0].Cliente
          this.folio = res[0].Folio
          this.enviarA = res[0].Destino
          console.log('%c%s', 'color: #33cc99', this.enviarA);

          this.expedicion = res[0].FechaExpedicion


        })
  

  
      })
      
    });
  }

  totalSacos = 0;
  totalKg = 0;
  totalKgprod = [];
  producto: string;
  usda: string;
  comentarios: string;

  ver() {

    this.objconc = this.traspasoSVC.formrow[0]

    this.arrcon = [];


    for (this.con in this.objconc) {
      var conceptos = this.objconc[this.con];
      this.arrcon.push({

        Bodega: conceptos.Bodega,
        Bodega1: conceptos.Bodega1,
        CampoExtra3: conceptos.CampoExtra3,
        CampoExtra4: conceptos.CampoExtra4,
        Cbk: conceptos.Cbk,
        ClaveProducto: conceptos.ClaveProducto,
        ClaveProducto1: conceptos.ClaveProducto1,
        ClaveProducto2: conceptos.ClaveProducto2,
        Comentarios: conceptos.Comentarios,
        Estatus: conceptos.Estatus,
        FechaCaducidad: conceptos.FechaCaducidad,
        FechaCaducidad1: conceptos.FechaCaducidad1,
        FechaMFG: conceptos.FechaMFG,
        IdDetalle: conceptos.IdDetalle,
        IdDetalleTarima: conceptos.IdDetalleTarima,
        IdDetalleTarima1: conceptos.IdDetalleTarima1,
        IdDetalleTraspasoMercancia: conceptos.IdDetalleTraspasoMercancia,
        IdOrdenCarga: conceptos.IdOrdenCarga,
        IdOrdenDescarga: conceptos.IdOrdenDescarga,
        IdOrdenTemporal: conceptos.IdOrdenTemporal,
        IdProveedor: conceptos.IdProveedor,
        IdProveedor1: conceptos.IdProveedor1,
        IdTraspasoMercancia: conceptos.IdTraspasoMercancia,
        Lote: conceptos.Lote,
        Lote1: conceptos.Lote1,
        Lote2: conceptos.Lote2,
        PO: conceptos.PO,
        PO1: conceptos.PO1,
        Pedimento: conceptos.Pedimento,
        PesoTotal: conceptos.PesoTotal,
        PesoTotal1: conceptos.PesoTotal1,
        PesoTotal2: conceptos.PesoTotal2,
        PesoxSaco: conceptos.PesoxSaco,
        PesoxSaco1: conceptos.PesoxSaco1,
        Producto: conceptos.Producto,
        Producto1: conceptos.Producto1,
        Producto2: conceptos.Producto2,
        Proveedor: conceptos.Proveedor,
        Proveedor1: conceptos.Proveedor1,
        QR: conceptos.QR,
        Sacos: conceptos.Sacos,
        Sacos1: conceptos.Sacos1,
        SacosTotales: conceptos.SacosTotales,
        SacosxTarima: conceptos.SacosxTarima,
        Shipper: conceptos.Shipper,
        TarimasTotales: conceptos.TarimasTotales,
        USDA1: conceptos.USDA1,
        Usda: conceptos.Usda
        
      });
       this.totalSacos = +conceptos.Sacos + this.totalSacos;
       this.totalKgprod[this.con] = conceptos.PesoxSaco * +conceptos.Sacos;
       this.totalKg = this.totalKgprod[this.con] + this.totalKg;
       this.producto = this.arrcon[0].Producto;
       this.usda = this.arrcon[0].Usda;
       this.comentarios = this.arrcon[0].Comentarios;
       
      }
      console.log('%c⧭', 'color: #1d5673', conceptos);
      console.log('%c⧭', 'color: #007300', this.arrcon);
  }



  onExportClick(Folio?: string) {
    const content: Element = document.getElementById('OrdenCargaDescarga-PDF');
    const option = {
      margin: [.5, .5, 0, .5],
      filename: 'C-' + this.folio + '.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, logging: true },
      jsPDF: { unit: 'cm', format: 'letter', orientation: 'landscape' },
      pagebreak: { avoid: '.pgbreak' }
    };

    html2pdf()
      .from(content)
      .set(option)
      .save();
  }

  onClose() {
    this.dialogbox.close();
  }

}
