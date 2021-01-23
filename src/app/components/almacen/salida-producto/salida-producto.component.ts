import { Component, OnInit, Inject } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OrdenCargaService } from 'src/app/services/almacen/orden-carga/orden-carga.service';
import { OrdenTemporalService } from '../../../services/almacen/orden-temporal/orden-temporal.service';
import { EmpresaService } from '../../../services/empresas/empresa.service';
import { OrdenCarga } from '../../../Models/almacen/OrdenCarga/ordencarga.model';
import { DetalleOrdenCarga } from '../../../Models/almacen/OrdenCarga/detalleOrdenCarga-model';

@Component({
  selector: 'app-salida-producto',
  templateUrl: './salida-producto.component.html',
  styleUrls: ['./salida-producto.component.css']
})
export class SalidaProductoComponent implements OnInit {

  // usda: any;
  // pesoTotalTarima: Array<any> = [];
  // sacosTotalTarima: Array<any> = [];
  // pesoTotal = 0;
  // sacosTotal = 0;
  // pedimento: any;

  constructor(public dialogbox: MatDialogRef<SalidaProductoComponent>, private service: OrdenCargaService, public ordentemporal: OrdenTemporalService, public empresaService: EmpresaService,  
    @Inject(MAT_DIALOG_DATA) public dataComponente: any) { }

  // objconc: any;
  // con: string | number;
  // arrcon: Array<any> = [];

  // ObjetoUsuario: any;
  // usuario: string = "";

  // Factura = new Array<any>();

  // FacturasString: string = "";

  logo;

  //^ Objeto tipo Orden Descarga
  ocInfo: OrdenCarga;
//^ Arreglo de Objetos tipo Detalle Orden Descarga
  docInfo: Array<DetalleOrdenCarga> = [];
  
  IdOrdenCarga:number;

  Folio: number;



  ngOnInit() {
    console.clear();


//^ Obtener Logo de empresa
//this.logo = this.empresaService.empresaActual.RFC; 

    this.logo = '../../../assets/images/'+this.empresaService.empresaActual.RFC+'.png'
this.IdOrdenCarga = this.dataComponente.IdOrdenCarga;
    this.ver();
  }

  onClose() {
    this.dialogbox.close();
  }

  ver() {


    // console.log(localStorage.getItem('userAuth'));
    // this.ObjetoUsuario = localStorage.getItem('userAuth');
    // console.log(this.ObjetoUsuario);
    // console.log(this.ObjetoUsuario.Nombre);
    // this.usuario = this.ObjetoUsuario.Nombre;
    // console.log(this.usuario);


    this.service.getOCID(this.IdOrdenCarga).subscribe(data => {
this.ocInfo = data[0];
this.Folio = data[0].Folio;
this.service.getOrdenCargaIDList(this.IdOrdenCarga).subscribe(respuesta=> {
    this.docInfo = respuesta




    // this.ordentemporal.GetOrdenTemporalID(+localStorage.getItem('IdOrdenCarga')).subscribe(res => {
      
        
    //     console.log(this.ordentemporal.formDataOCPDF,'ORDENDECARGA')

    //     this.ordentemporal.formDataOtPDF = res;
    //     console.log(this.ordentemporal.formDataOtPDF);
    //     // console.clear();
    //     // console.log(this.service.formDatapdf);

    //     this.objconc = this.ordentemporal.formDataOtPDF;
    //     // select a orden temporal con base al id de la carga
    //     this.arrcon = [];
    //     // this.defaultpx = 350;
    //     for (this.con in this.objconc) {
    //       var conceptos = this.objconc[this.con];
    //       this.arrcon.push({
    //         IdOrdenTemporal: conceptos.IdOrdenTemporal,
    //         Folio: conceptos.Folio,
    //         IdTarima: conceptos.IdTarima,
    //         IdOrdenCarga: conceptos.IdOrdenCarga,
    //         IdOrdenDescarga: conceptos.IdOrdenDescarga,
    //         QR: conceptos.Factura,
    //         ClaveProducto: conceptos.ClaveProducto,
    //         Lote: conceptos.Lote,
    //         Sacos: conceptos.Sacos,
    //         Producto: conceptos.Producto,
    //         FechaCaducidad: conceptos.FechaCaducidad,
    //         Comentarios: conceptos.Comentarios,
    //       });
    //       this.pesoTotalTarima[this.con] = conceptos.Sacos * 25;
    //       this.sacosTotalTarima[this.con] = conceptos.Sacos;
    //       // console.log(this.pesoTotalTarima[this.con],'tarima');

    //       //^ push al arreglo de Facturas
    //       this.Factura.push(conceptos.QR);
    //       console.log(this.Factura);
    //       this.generarStringFacturas(this.Factura)

    //       this.pesoTotal = +this.pesoTotalTarima[this.con] + +this.pesoTotal;
    //       this.sacosTotal = +this.sacosTotalTarima[this.con] + +this.sacosTotal;
         

    //     }
    //       console.log(this.pesoTotal,'PESOTOTAL');
    // });
  });
  });
  }

//^ Metodo para generar el string de Facturas
  // generarStringFacturas(arreglo){
  //     this.FacturasString = "";
  //     this.FacturasString = arreglo[0];
  //     if(arreglo.length>1){
  //       for (let i=1; i< arreglo.length;i++){
  //           this.FacturasString = this.FacturasString +','+ arreglo[i];
  //       }
  //   }
  //     console.log(this.FacturasString);
  // }






  onExportClick(Folio?: string) {
    const content: Element = document.getElementById('EntradaProducto-PDF');
    const option = {
      margin: [.5, 1, .5, 1],
      filename: 'F-' + this.Folio + '.pdf',
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
