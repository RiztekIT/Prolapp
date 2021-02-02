import { Component, Inject, OnInit } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OrdenCargaService } from 'src/app/services/almacen/orden-carga/orden-carga.service';
import { OrdenTemporalService } from '../../../services/almacen/orden-temporal/orden-temporal.service';
import { OrdenDescargaService } from '../../../services/almacen/orden-descarga/orden-descarga.service';
import { OrdenDescarga } from '../../../Models/almacen/OrdenDescarga/ordenDescarga-model';
import { DetalleOrdenDescarga } from '../../../Models/almacen/OrdenDescarga/detalleOrdenDescarga-model';

@Component({
  selector: 'app-entrada-producto',
  templateUrl: './entrada-producto.component.html',
  styleUrls: ['./entrada-producto.component.css']
})
export class EntradaProductoComponent implements OnInit {
  // usda: any;
  // pesoTotalTarima: Array<any> = [];
  // pesoTotal = 0;
  // pedimento: any;

  constructor(public dialogbox: MatDialogRef<EntradaProductoComponent>, private service: OrdenDescargaService,
    public ordentemporal: OrdenTemporalService, @Inject(MAT_DIALOG_DATA) public dataComponente: any, public serviceOC: OrdenCargaService) { }

  // objconc: any;
  // con: string | number;
  //   arrcon: Array<any> = [];

  //^ Objeto tipo Orden Descarga
  odInfo: OrdenDescarga;
  //^ Arreglo de Objetos tipo Detalle Orden Descarga
  dodInfo: Array<any> = [];

  IdOrdenDescarga: number;
  Folio: number;

  selloCaja: string = "";
  pedimentoOrden: string = '';



  ngOnInit() {
    // console.clear();
    // this.dataComponente.IdOrdenDescarga
    // console.log('%c⧭', 'color: #735656', this.dataComponente);
    // console.log('%c%s', 'color: #cc0088', this.dataComponente.IdOrdenDescarga);
    this.IdOrdenDescarga = this.dataComponente.IdOrdenDescarga;
    this.ver();
  }


  onClose() {
    this.dialogbox.close();
  }

  arregloDetalles: any = [];
  // numeroTarima:number = 1;
  ver() {
    this.service.getOrdenDescargaID(this.IdOrdenDescarga).subscribe(data => {
      console.log('%c⧭', 'color: #ffcc00', data);
      this.odInfo = data[0];
      this.Folio = data[0].Folio;
      console.log(this.odInfo);
      //^ Obtener informacion adicional a la Ordencarga
      this.serviceOC.getOrdenDescargaInfoIdOD(this.IdOrdenDescarga).subscribe(resSello => {
        if (resSello.length > 0) {
          this.selloCaja = resSello[0].SelloCaja;
          this.pedimentoOrden = resSello[0].Campo2;
        }
        //^ Obtener Detalles de la Orden
        this.service.getOrdenDescargaIDList(this.IdOrdenDescarga).subscribe(respuesta => {
          console.log(respuesta);
          if(respuesta[0].USDA){
            //^Generaremos el arreglo con los detalles generales
            this.detallesGenerales();
            // this.ordentemporal.formDataOCDTPDF = respuesta[0]
            // this.dodInfo = respuesta;
            this.arregloDetalles = respuesta;
            //^Dividiremos los detalles por tarima
            this.arregloDetalles.forEach((element,i) => {
              //^ Calculamos el numero de Tarimas
              let numeroTotalTarimas = ((+element.Sacos) / (+element.USDA));
              let sacos = +element.USDA
              let kg = ((sacos)*(+element.PesoxSaco))
              for (let i = 0; i < numeroTotalTarimas; i++) {
                //^ Objeto que sera ingresado
                let detalle: any
                detalle = element;
                detalle.Sacos = sacos;
                detalle.Kg = kg;
                // detalle.numeroTarima = this.numeroTarima;
                // this.numeroTarima = this.numeroTarima + 1;
                this.dodInfo.push(detalle);
              }
            });
          }else{
            this.dodInfo = respuesta;
          } 
        })



        //     this.ordentemporal.GetOrdenTemporalID(this.IdOrdenDescarga).subscribe(res => {


        //         console.log(this.ordentemporal.formDataOCPDF,'ORDENDECARGA')

        //         this.ordentemporal.formDataOtPDF = res;
        //         // console.log(this.ordentemporal.formDataOtPDF);
        //         // console.clear();
        //         // console.log(this.service.formDatapdf);

        //         this.objconc = this.ordentemporal.formDataOtPDF;
        //         // select a orden temporal con base al id de la carga
        //         this.arrcon = [];
        //         // this.defaultpx = 350;
        //         for (this.con in this.objconc) {
        //           var conceptos = this.objconc[this.con];
        //           this.arrcon.push({
        //             IdOrdenTemporal: conceptos.IdOrdenTemporal,
        //             IdTarima: conceptos.IdTarima,
        //             IdOrdenCarga: conceptos.IdOrdenCarga,
        //             IdOrdenDescarga: conceptos.IdOrdenDescarga,
        //             QR: conceptos.QR,
        //             ClaveProducto: conceptos.ClaveProducto,
        //             Lote: conceptos.Lote,
        //             Sacos: conceptos.Sacos,
        //             Producto: conceptos.Producto,
        //             FechaCaducidad: conceptos.FechaCaducidad,
        //             Comentarios: conceptos.Comentarios,
        //           });
        //           this.pesoTotalTarima[this.con] = conceptos.Sacos * 25;
        //           // console.log(this.pesoTotalTarima[this.con],'tarima');

        //           this.pesoTotal = +this.pesoTotalTarima[this.con] + +this.pesoTotal


        //         }
        // console.log(this.pesoTotal,'PESOTOTAL');
        //     });
      });
    });
  }

arregloDetallesGenerales: any = [];
  detallesGenerales(){

    //^ Volvemos a obtener la data, porque el obsevable le asignaba otros valores....
this.service.getOrdenDescargaIDList(this.IdOrdenDescarga).subscribe(respuesta => {

  respuesta.forEach((element, i) => {
      // var index:number = this.array.indexOf(this.array.find(x => x.idP == id));     
     let a = this.arregloDetallesGenerales.indexOf(this.arregloDetallesGenerales.find(clave => clave.ClaveProducto == element.ClaveProducto ));
     console.log(a);
     if(a == -1){
       this.arregloDetallesGenerales.push(element);
     }else{
       console.log('Repetido');
       let sacos = +element.Sacos;
      //  let kg = +element.Sacos * +element.PesoxSaco;
       this.arregloDetallesGenerales[a].Sacos = +this.arregloDetallesGenerales[a].Sacos + sacos;
     }
    });
  console.log(this.arregloDetallesGenerales);
    //  let index = this.service.master[i].Modulo.indexOf(this.service.master[i].Modulo.find(modulo => modulo.Modulo == res[l].Modulo));
  })
  }






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
