import { Component, Inject, OnInit } from '@angular/core';
import { DocumentosImportacionService } from 'src/app/services/importacion/documentos-importacion.service';

import * as html2pdf from 'html2pdf.js';
import { TraspasoMercanciaService } from 'src/app/services/importacion/traspaso-mercancia.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OrdenCarga } from 'src/app/Models/almacen/OrdenCarga/ordencarga.model';
import { DetalleOrdenCarga } from 'src/app/Models/almacen/OrdenCarga/detalleOrdenCarga-model';
import { OrdenCargaService } from '../../services/almacen/orden-carga/orden-carga.service';
import { DetalleTraspasoMercancia } from '../../Models/importacion/traspasoMercancia-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orden-carga-descarga',
  templateUrl: './orden-carga-descarga.component.html',
  styleUrls: ['./orden-carga-descarga.component.css']
})
export class OrdenCargaDescargaComponent implements OnInit {

  constructor(public traspasoSVC: TraspasoMercanciaService,
    public dialogbox: MatDialogRef<OrdenCargaDescargaComponent>,
    @Inject(MAT_DIALOG_DATA) public dataComponente: any,
    public ocService: OrdenCargaService
  ) { }

  // objconc: any;
  // con: string | number;
  // arrcon: Array<any> = [];
  // usdaArr: Array<any> = [];
  // pesototalprod;
  // pesototal;
  // sacosTotales;
  // cliente;
  // folio;
  // expedicion;
  // caja;
  // Fletera;
  // enviarA;

  //^ Objeto tipo Any, Aqui se guardara la informacion del Traspaso
  tInfo: any = [];
  tdetalleInfo: any = [];
  //^ Objeto tipo Any, Aqui se guardara la informacion de la Orden Carga
  ocInfo: any = [];
  ocDetalleInfo: any = [];
//^ Arreglo de Objetos tipo Any, aqui se guardara la informacion de los detalles de OrdenCarga y Detalle Traspaso Mercancia
  dtInfo: Array<any> = [];

  cadenaProducto: string = "";
  
  IdOrdenCarga:number;
USDA: string="";
  Folio: number;

  pdfSrc
  currentPdf
  pdf
  style;

  ngOnInit() {
    this.style = 'block'
    Swal.fire({
      allowOutsideClick: false,
      text: 'Espere por favor...',
      icon: 'info'
    });
    Swal.showLoading()
    // this.obtenerDetallesTraspaso()
    // this.ver()
this.IdOrdenCarga = this.dataComponente.IdOrdenCarga
    this.ObtenerInformacion();
  }
  
  ObtenerInformacion(){
console.log(this.IdOrdenCarga);
    //^ Obtendremos la informacion del TraspasoMercancia
    let query = ' select * from TraspasoMercancia where IdOrdenCarga = '+this.IdOrdenCarga;
    // console.log('%c⧭', 'color: #731d6d', query);
    let consulta = {
      'consulta':query
    };
this.traspasoSVC.getQuery(consulta).subscribe((resTraspaso:any)=>{
  // console.log(resTraspaso);
  if(resTraspaso.length > 0){

    this.tInfo = resTraspaso[0];
    //^Obtendremos la informacion de los Detalles de Traspaso Mercancia
    let query = ' select * from DetalleTraspasoMercancia where IdTraspasoMercancia = '+resTraspaso[0].IdTraspasoMercancia;
    // console.log('%c⧭', 'color: #731d6d', query);
    let consulta1 = {
      'consulta':query
    };
    this.traspasoSVC.getQuery(consulta1).subscribe(resTraspaso=>{
      // console.log(resTraspaso);
      //^ Todos los detalles Traspaso traen el mismo USDA, entonces lo guardamos a la Variable USDA
      this.USDA = resTraspaso[0].Usda;
      this.tdetalleInfo = resTraspaso;
      //^ Obtendremos la informacion de la Orden Carga
      this.ocService.getOCID(this.IdOrdenCarga).subscribe(resOC=>{
        console.log(resOC);
        this.ocInfo = resOC[0];
        
        //^ Obtendremos la informacion de los Detalles Orden Carga
        this.ocService.getOrdenCargaIDList(this.IdOrdenCarga).subscribe(resDOC=>{
          // console.log(resDOC);
          this.ocDetalleInfo = resDOC;
          
          //^ Generar Cadena de producto a mostrar
          this.generarCadenaProducto();
          setTimeout(()=>{
            this.onExportClick();
          },1000)
          setTimeout(()=>{
            this.reloadPDF('entro')
          },4500)
        })
      })
    })
  }
})


  }

  //^Metodo para generar Cadena de producto a mostrat
  generarCadenaProducto(){
    // this.ocDetalleInfo.forEach(element => {
    //   console.log(element.Producto.split(' ', 3));
    //   // this.cadenaProducto = this.cadenaProducto + element
    // });
  }


  //^ Se tienen que mezclar los detalles del traspaso con orden Carga para poder obtener toda la informacion necesaria a mostrar
  // MezclarDetalles(){
    
  //   console.log('%c⧭', 'color: #99adcc', this.tInfo);
  //   console.log('%c⧭', 'color: #f279ca', this.tdetalleInfo);
  //   console.log('%c⧭', 'color: #7f7700', this.ocInfo);
  //   console.log('%c⧭', 'color: #00ff88', this.ocDetalleInfo);
  //   this.tdetalleInfo.forEach((element,i) => {
  //     this.ocDetalleInfo[i].USDA = element.Usda
  //   });
  // }
  
  // obtenerDetallesTraspaso() {
  //   this.traspasoSVC.formrow[0].forEach((element,i) => {

  //     let id = element.IdTraspasoMercancia;
  //     this.traspasoSVC.GetTraspasoMercanciaid(id).subscribe(res => {
  //       let idOC = res[0].IdOrdenCarga;
  //       console.log('%c⧭', 'color: #408059', res);
        
  //       let query = 'select * from OrdenCarga where idordencarga ='+ idOC;
  //       let consulta = {
  //         'consulta':query
  //       };
        
  //       this.traspasoSVC.getQuery(consulta).subscribe((detalles: any)=>{
  //         console.log('%c⧭', 'color: #00ff88', detalles);
  //         this.caja = detalles[0].Caja
  //         this.Fletera = detalles[0].Fletera
  //         this.cliente = detalles[0].Cliente
  //         this.folio = res[0].Folio
  //         this.enviarA = res[0].Destino
  //         console.log('%c%s', 'color: #33cc99', this.enviarA);

  //         this.expedicion = res[0].FechaExpedicion


  //       })
  

  
  //     })
      
  //   });
  // }

  // totalSacos = 0;
  // totalKg = 0;
  // totalKgprod = [];
  // producto: string;
  // usda: string;
  // comentarios: string;

  // ver() {

  //   this.objconc = this.traspasoSVC.formrow[0]

  //   this.arrcon = [];


  //   for (this.con in this.objconc) {
  //     var conceptos = this.objconc[this.con];
  //     this.arrcon.push({

  //       Bodega: conceptos.Bodega,
  //       Bodega1: conceptos.Bodega1,
  //       CampoExtra3: conceptos.CampoExtra3,
  //       CampoExtra4: conceptos.CampoExtra4,
  //       Cbk: conceptos.Cbk,
  //       ClaveProducto: conceptos.ClaveProducto,
  //       ClaveProducto1: conceptos.ClaveProducto1,
  //       ClaveProducto2: conceptos.ClaveProducto2,
  //       Comentarios: conceptos.Comentarios,
  //       Estatus: conceptos.Estatus,
  //       FechaCaducidad: conceptos.FechaCaducidad,
  //       FechaCaducidad1: conceptos.FechaCaducidad1,
  //       FechaMFG: conceptos.FechaMFG,
  //       IdDetalle: conceptos.IdDetalle,
  //       IdDetalleTarima: conceptos.IdDetalleTarima,
  //       IdDetalleTarima1: conceptos.IdDetalleTarima1,
  //       IdDetalleTraspasoMercancia: conceptos.IdDetalleTraspasoMercancia,
  //       IdOrdenCarga: conceptos.IdOrdenCarga,
  //       IdOrdenDescarga: conceptos.IdOrdenDescarga,
  //       IdOrdenTemporal: conceptos.IdOrdenTemporal,
  //       IdProveedor: conceptos.IdProveedor,
  //       IdProveedor1: conceptos.IdProveedor1,
  //       IdTraspasoMercancia: conceptos.IdTraspasoMercancia,
  //       Lote: conceptos.Lote,
  //       Lote1: conceptos.Lote1,
  //       Lote2: conceptos.Lote2,
  //       PO: conceptos.PO,
  //       PO1: conceptos.PO1,
  //       Pedimento: conceptos.Pedimento,
  //       PesoTotal: conceptos.PesoTotal,
  //       PesoTotal1: conceptos.PesoTotal1,
  //       PesoTotal2: conceptos.PesoTotal2,
  //       PesoxSaco: conceptos.PesoxSaco,
  //       PesoxSaco1: conceptos.PesoxSaco1,
  //       Producto: conceptos.Producto,
  //       Producto1: conceptos.Producto1,
  //       Producto2: conceptos.Producto2,
  //       Proveedor: conceptos.Proveedor,
  //       Proveedor1: conceptos.Proveedor1,
  //       QR: conceptos.QR,
  //       Sacos: conceptos.Sacos,
  //       Sacos1: conceptos.Sacos1,
  //       SacosTotales: conceptos.SacosTotales,
  //       SacosxTarima: conceptos.SacosxTarima,
  //       Shipper: conceptos.Shipper,
  //       TarimasTotales: conceptos.TarimasTotales,
  //       USDA1: conceptos.USDA1,
  //       Usda: conceptos.Usda
        
  //     });
  //      this.totalSacos = +conceptos.Sacos + this.totalSacos;
  //      this.totalKgprod[this.con] = conceptos.PesoxSaco * +conceptos.Sacos;
  //      this.totalKg = this.totalKgprod[this.con] + this.totalKg;
  //      this.producto = this.arrcon[0].Producto;
  //      this.usda = this.arrcon[0].Usda;
  //      this.comentarios = this.arrcon[0].Comentarios;
       
  //     }
  //     console.log('%c⧭', 'color: #1d5673', conceptos);
  //     console.log('%c⧭', 'color: #007300', this.arrcon);
  // }



  onExportClick2(Folio?: string) {
    const content: Element = document.getElementById('OrdenCargaDescarga-PDF');
    const option = {
      margin: [.5, .5, 0, .5],
      filename: 'C-' + this.Folio + '.pdf',
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

  reloadPDF(event){
    console.log(event);
    this.currentPdf = localStorage.getItem('pdfOC');
    let blob = this.b64toBlob(this.currentPdf,'application/pdf',1024)
    const url = window.URL.createObjectURL(blob);

    if(this.dataComponente.origen=='traspaso'){

      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank'    
      link.click();
      this.style = 'none'
    }

    
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

    
    const content: Element = document.getElementById('OrdenCargaDescarga-PDF');
    const option = {
      
      margin: [.5, .5, 0, .5],
      filename: 'T-' + this.Folio + '.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, logging: true },
      jsPDF: { unit: 'cm', format: 'letter', orientation: 'landscape' },
      pagebreak: { avoid: '.pgbreak' }
    };

    let worker = html2pdf().from(content).set(option).output('datauristring')

    worker.then(function(pdfAsString){
      console.log(pdfAsString);
      this.pdf = pdfAsString;
      localStorage.setItem('OC', this.pdf);
      this.pdf = this.pdf.toString().replace(/^data:application\/pdf;filename=generated.pdf;base64,/, '')
      localStorage.setItem('pdfOC', this.pdf);
      this.currentPdf = this.pdf

      
      
      

      
      
    })


      
  }

}
