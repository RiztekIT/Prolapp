import { Component, OnInit } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { MatDialogRef } from '@angular/material';
import { OrdenCargaService } from 'src/app/services/almacen/orden-carga/orden-carga.service';
import { OrdenTemporalService } from '../../../services/almacen/orden-temporal/orden-temporal.service';
import { EmpresaService } from '../../../services/empresas/empresa.service';

@Component({
  selector: 'app-salida-producto',
  templateUrl: './salida-producto.component.html',
  styleUrls: ['./salida-producto.component.css']
})
export class SalidaProductoComponent implements OnInit {

  usda: any;
  pesoTotalTarima: Array<any> = [];
  sacosTotalTarima: Array<any> = [];
  pesoTotal = 0;
  sacosTotal = 0;
  pedimento: any;

  constructor(public dialogbox: MatDialogRef<SalidaProductoComponent>, private service: OrdenCargaService, public ordentemporal: OrdenTemporalService, public empresaService: EmpresaService) { }

  objconc: any;
  con: string | number;
  arrcon: Array<any> = [];

  ObjetoUsuario: any;
  usuario: string = "";

  Factura = new Array<any>();

  FacturasString: string = "";

  logo;



  ngOnInit() {
    console.clear();


//^ Obtener Logo de empresa
this.logo = this.empresaService.empresaActual.Foto;    

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


    this.service.getOCID(+localStorage.getItem('IdOrdenCarga')).subscribe(data => {
this.ordentemporal.formDataOCPDF = data[0];
this.service.getOrdenCargaIDList(+localStorage.getItem('IdOrdenCarga')).subscribe(respuesta=> {
this.ordentemporal.formDataOCDTPDF = respuesta[0]



    this.ordentemporal.GetOrdenTemporalID(+localStorage.getItem('IdOrdenCarga')).subscribe(res => {
      
        
        console.log(this.ordentemporal.formDataOCPDF,'ORDENDECARGA')

        this.ordentemporal.formDataOtPDF = res;
        console.log(this.ordentemporal.formDataOtPDF);
        // console.clear();
        // console.log(this.service.formDatapdf);

        this.objconc = this.ordentemporal.formDataOtPDF;
        // select a orden temporal con base al id de la carga
        this.arrcon = [];
        // this.defaultpx = 350;
        for (this.con in this.objconc) {
          var conceptos = this.objconc[this.con];
          this.arrcon.push({
            IdOrdenTemporal: conceptos.IdOrdenTemporal,
            Folio: conceptos.Folio,
            IdTarima: conceptos.IdTarima,
            IdOrdenCarga: conceptos.IdOrdenCarga,
            IdOrdenDescarga: conceptos.IdOrdenDescarga,
            QR: conceptos.Factura,
            ClaveProducto: conceptos.ClaveProducto,
            Lote: conceptos.Lote,
            Sacos: conceptos.Sacos,
            Producto: conceptos.Producto,
            FechaCaducidad: conceptos.FechaCaducidad,
            Comentarios: conceptos.Comentarios,
          });
          this.pesoTotalTarima[this.con] = conceptos.Sacos * 25;
          this.sacosTotalTarima[this.con] = conceptos.Sacos;
          // console.log(this.pesoTotalTarima[this.con],'tarima');

          //^ push al arreglo de Facturas
          this.Factura.push(conceptos.QR);
          console.log(this.Factura);
          this.generarStringFacturas(this.Factura)

          this.pesoTotal = +this.pesoTotalTarima[this.con] + +this.pesoTotal;
          this.sacosTotal = +this.sacosTotalTarima[this.con] + +this.sacosTotal;
         

        }
          console.log(this.pesoTotal,'PESOTOTAL');
    });
  });
  });
  }

//^ Metodo para generar el string de Facturas
  generarStringFacturas(arreglo){
      this.FacturasString = "";
      this.FacturasString = arreglo[0];
      if(arreglo.length>1){
        for (let i=1; i< arreglo.length;i++){
            this.FacturasString = this.FacturasString +','+ arreglo[i];
        }
    }
      console.log(this.FacturasString);
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
