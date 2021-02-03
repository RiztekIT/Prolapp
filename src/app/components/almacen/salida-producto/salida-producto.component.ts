import { Component, OnInit, Inject } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OrdenCargaService } from 'src/app/services/almacen/orden-carga/orden-carga.service';
import { OrdenTemporalService } from '../../../services/almacen/orden-temporal/orden-temporal.service';
import { EmpresaService } from '../../../services/empresas/empresa.service';
import { OrdenCarga } from '../../../Models/almacen/OrdenCarga/ordencarga.model';
import { DetalleOrdenCarga } from '../../../Models/almacen/OrdenCarga/detalleOrdenCarga-model';
import { VentasPedidoService } from '../../../services/ventas/ventas-pedido.service';
import { element } from 'protractor';

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
    @Inject(MAT_DIALOG_DATA) public dataComponente: any, public ventasService: VentasPedidoService) { }

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
  docInfo: Array<any> = [];

  IdOrdenCarga: number;

  Folio: number;



  ngOnInit() {
    console.clear();


    //^ Obtener Logo de empresa
    //this.logo = this.empresaService.empresaActual.RFC; 

    this.logo = '../../../assets/images/' + this.empresaService.empresaActual.RFC + '.png'
    this.IdOrdenCarga = this.dataComponente.IdOrdenCarga;
    this.ver();
  }

  onClose() {
    this.dialogbox.close();
  }

  selloCaja: string = "";

  FolioPedido: string = "";
  arregloDetalles: any = [];
  ver() {


    // console.log(localStorage.getItem('userAuth'));
    // this.ObjetoUsuario = localStorage.getItem('userAuth');
    // console.log(this.ObjetoUsuario);
    // console.log(this.ObjetoUsuario.Nombre);
    // this.usuario = this.ObjetoUsuario.Nombre;
    // console.log(this.usuario);

    //^ Obtener informacion de la Orden Carga
    this.service.getOCID(this.IdOrdenCarga).subscribe(data => {
      this.ocInfo = data[0];
      this.Folio = data[0].Folio;
      //^ Obtener informacion adicional a la Ordencarga
      this.service.getOrdenCargaInfoIdOC(this.IdOrdenCarga).subscribe(resSello => {
        if (resSello.length > 0) {
          this.selloCaja = resSello[0].SelloCaja;
        }
        //^ Obtener informacion del Pedido/Venta que Genero la Orden Carga
        this.ventasService.getPedidoId(data[0].IdPedido).subscribe(resVenta => {
          if (resVenta.length > 0) {
            this.FolioPedido = resVenta[0].Folio;
          }
          //^ Obtener informacion de los Detalles de  Orden Carga
          this.service.getOrdenCargaIDList(this.IdOrdenCarga).subscribe((respuesta: any) => {
            console.log('%c⧭', 'color: #514080', respuesta);
            if (respuesta[0].USDA) {
              //^Generaremos el arreglo con los detalles generales
              this.detallesGenerales();
              // this.ordentemporal.formDataOCDTPDF = respuesta[0]
              // this.dodInfo = respuesta;
              this.arregloDetalles = respuesta;
              //^Dividiremos los detalles por tarima
              let detalle: any;
              for (let l = 0; l < respuesta.length; l++) {
                let element = respuesta[l];
              // this.arregloDetalles.forEach((element, i) => {
                //^ Calculamos el numero de Tarimas
                let numeroTotalTarimas = ((+element.Sacos) / (+element.USDA));
                console.log(numeroTotalTarimas);
                let sacos = +element.USDA
                let kg = ((sacos) * (+element.PesoxSaco))

                //* ------------------------------- EN DADO CASO QUE LA ULTIMA TARIMA NO ESTE COMPLETA ---------------------------------- >
                
                //^ Verificar si todas las tarimas tendran el mismo numero de sacos y kg
                let tarimaCompleta = numeroTotalTarimas % 1;
                let sacosUltimaTarima;
                let kgUltimaTarima;
                let sacosEnteros = 0;
                console.log(tarimaCompleta);
                //^ En este caso, la ultima tarima tendra menos sacos que las demas.
                if (tarimaCompleta > 0) {
                  console.log('La ultima tarima tendra menos sacos');
                  //^ Obtenemos el entero de las tarimas
                  sacosEnteros = Math.floor(numeroTotalTarimas);
                  console.log(sacosEnteros);
                  //^ Multiplicamos el numero de tarimas completas por la cantidad de Sacos
                  let sacosCompletos = +sacosEnteros * +element.USDA;
                  sacosUltimaTarima = +element.Sacos - +sacosCompletos;
                  console.log('%c%s', 'color: #99614d', sacosUltimaTarima);
                  kgUltimaTarima = +element.PesoxSaco * +sacosUltimaTarima;
                  console.log('%c%s', 'color: #00736b', kgUltimaTarima);
                } else {
                  console.log('Todas las tarimas seran iguales');
                }              
                //* ------------------------------- EN DADO CASO QUE LA ULTIMA TARIMA NO ESTE COMPLETA ---------------------------------- >
                
                
                // element.Sacos = sacosUltimaTarima;
                //   element.Kg = kgUltimaTarima;
                //^ Objeto que sera ingresado
                detalle = element;
                detalle.Sacos = sacos;
                detalle.Kg = kg;
                //   this.docInfo.push(element);              
                for (let i = 0; i < numeroTotalTarimas; i++) {
                  
                  //^ Verificar si es el ultimo objeto del arreglo.
                  if ((sacosEnteros > 0) && (i == (sacosEnteros))) {
                    console.log('ultima posicion ' + i);
                    detalle.Sacos = sacosUltimaTarima;
                    detalle.Kg = kgUltimaTarima;
                    console.log('%c⧭', 'color: #d0bfff', detalle);
                  }
                  console.log('%c⧭', 'color: #d0bfff', detalle);
                  //! ATENCION ESTO TE PUEDE SERVIR
                  //^ Clonar un objeto antes de hacer push.
                  let temp = Object.assign({}, detalle);
                  this.docInfo.push(temp);
                }  
              // });
            }
              console.log(this.docInfo);
            } else {
              this.docInfo = respuesta
            }
          })
        })


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

  arregloDetallesGenerales: any = [];
  detallesGenerales() {

    //^ Volvemos a obtener la data, porque el obsevable le asignaba otros valores....
    this.service.getOrdenCargaIDList(this.IdOrdenCarga).subscribe(respuesta => {

      respuesta.forEach((element, i) => {
        // var index:number = this.array.indexOf(this.array.find(x => x.idP == id));     
        let a = this.arregloDetallesGenerales.indexOf(this.arregloDetallesGenerales.find(clave => clave.ClaveProducto == element.ClaveProducto));
        console.log(a);
        if (a == -1) {
          this.arregloDetallesGenerales.push(element);
        } else {
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
