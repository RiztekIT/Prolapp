import { Component, Inject, OnInit } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OrdenCargaService } from 'src/app/services/almacen/orden-carga/orden-carga.service';
import { OrdenTemporalService } from '../../../services/almacen/orden-temporal/orden-temporal.service';
import { OrdenDescargaService } from '../../../services/almacen/orden-descarga/orden-descarga.service';
import { OrdenDescarga } from '../../../Models/almacen/OrdenDescarga/ordenDescarga-model';
import { DetalleOrdenDescarga } from '../../../Models/almacen/OrdenDescarga/detalleOrdenDescarga-model';
import Swal from 'sweetalert2';

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
  usdaOrden: string = '';


  pdfSrc
  currentPdf
  pdf
  style;


  ngOnInit() {
    this.style = 'block'
    Swal.showLoading()
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
          this.usdaOrden = resSello[0].Campo3;
        }
        //^ Obtener Detalles de la Orden
        this.service.getOrdenDescargaIDList(this.IdOrdenDescarga).subscribe(respuesta => {
          console.log(respuesta);
          if (respuesta[0].USDA) {
            //^Generaremos el arreglo con los detalles generales
            this.detallesGenerales();
            // this.ordentemporal.formDataOCDTPDF = respuesta[0]
            // this.dodInfo = respuesta;
            //^ LE QUITAMOS EL USA 25 KG
            respuesta.forEach((element, i) => {
              console.log(i);
              let producto = respuesta[i].Producto.split(' ')
              console.log(producto);
              let cantidadPabras = producto.length;
              console.log(cantidadPabras);
              let productoString = ""
              for (let i = 0; i < cantidadPabras - 3; i++) {
                if(i == 0){
                  productoString = producto[i];
                }else{
                  productoString = productoString + ' ' + producto[i];
                }
              }
              console.log(productoString);
              respuesta[i].Producto = productoString;
            });
            this.arregloDetalles = respuesta;
            //^Dividiremos los detalles por tarima
            let detalle: any
            this.arregloDetalles.forEach((element, i) => {
              //^ Calculamos el numero de Tarimas
              let numeroTotalTarimas = ((+element.Sacos) / (+element.USDA));
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



              //^ Objeto que sera ingresado
              detalle = element;
              detalle.Sacos = sacos;
              detalle.Kg = kg;
              //^ ELIMINAR USA 25KG
              detalle.Producto.split(' ')
              console.log(detalle.Producto);
              for (let i = 0; i < numeroTotalTarimas; i++) {

                //^ Verificar si es el ultimo objeto del arreglo.
                if ((sacosEnteros > 0) && (i == (sacosEnteros))) {
                  console.log('ultima posicion ' + i);
                  detalle.Sacos = sacosUltimaTarima;
                  detalle.Kg = kgUltimaTarima;
                  console.log('%c⧭', 'color: #d0bfff', detalle);
                }
                console.log('%c⧭', 'color: #d0bfff', detalle);
            
                let temp = Object.assign({}, detalle);    //! ATENCION ESTO TE PUEDE SERVIR
                //^ Clonar un objeto antes de hacer push.
                this.dodInfo.push(temp);
              }
            });
          } else {
            console.log(' No hay formato');
            //^ QUITAR USA 25 KG
            respuesta.forEach((element, i) => {
              console.log(i);
              let producto = respuesta[i].Producto.split(' ')
              console.log(producto);
              let cantidadPabras = producto.length;
              console.log(cantidadPabras);
              let productoString = ""
              for (let i = 0; i < cantidadPabras - 3; i++) {
                if(i == 0){
                  productoString = producto[i];
                }else{
                  productoString = productoString + ' ' + producto[i];
                }
              }
              console.log(productoString);
              respuesta[i].Producto = productoString;
            });
            this.dodInfo = respuesta;
          }
          // setTimeout(()=>{
          //   this.onExportClick();
          // },1000)
          // setTimeout(()=>{
          //   this.reloadPDF('entro')
          // },4500)
          setTimeout(()=>{
            let pdf =   this.onExportClickFinal();            
          },1000)
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
  detallesGenerales() {

    //^ Volvemos a obtener la data, porque el obsevable le asignaba otros valores....
    this.service.getOrdenDescargaIDList(this.IdOrdenDescarga).subscribe(respuesta => {

      respuesta.forEach((element, i) => {
        // var index:number = this.array.indexOf(this.array.find(x => x.idP == id));     
        //^ Verificamos si ya existe el producto en el arreglo
        let a = this.arregloDetallesGenerales.indexOf(this.arregloDetallesGenerales.find(clave => clave.ClaveProducto == element.ClaveProducto));
        console.log(a);
        //^ Arroja -1 si es falso
        if (a == -1) {

  
            console.log(i);
            //^ QUITAREMOS EL USA 25KG
            let producto = respuesta[i].Producto.split(' ')
            console.log(producto);
            let cantidadPabras = producto.length;
            console.log(cantidadPabras);
            let productoString = ""
            for (let i = 0; i < cantidadPabras - 3; i++) {
              if(i == 0){
                productoString = producto[i];
              }else{
                productoString = productoString + ' ' + producto[i];
              }
            }
            console.log(productoString);
           element.Producto = productoString;


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






  onExportClick2(Folio?: string) {
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

    
    const content: Element = document.getElementById('EntradaProducto-PDF');
    const option = {
      
      margin: [.5, .5, .5, .5],
      filename: 'OC-' + this.Folio + '.pdf',
      // image: {type: 'jpeg', quality: 1},
      html2canvas: { scale: 2, logging: true },
      jsPDF: { unit: 'cm', format: 'letter', orientation: 'portrait' },
      pagebreak: { avoid: '.pgbreak' }
    };

    let worker = html2pdf().from(content).set(option).output('datauristring')

    worker.then(function(pdfAsString){
      console.log(pdfAsString);
      this.pdf = pdfAsString;
      this.pdf = this.pdf.toString().replace(/^data:application\/pdf;filename=generated.pdf;base64,/, '')
      localStorage.setItem('pdfOC', this.pdf);
      this.currentPdf = this.pdf

      
      
      

      
      
    })


      
  }

  async onExportClickFinal(Folio?: string) {

    
    const content: Element = document.getElementById('EntradaProducto-PDF');
    const option = {
      
      margin: [.5, 1, 0, 1],
      filename: 'OC-'+this.Folio+'.pdf',
      image: {type: 'jpeg', quality: 1},
      html2canvas: { scale: 2, logging: true },
      jsPDF: { unit: 'cm', format: 'letter', orientation: 'portrait' },
      pagebreak: { avoid: '.pgbreak' }
    };

    let worker = html2pdf().from(content).set(option).output('datauristring')

    let pdf = await worker.then(function(pdfAsString){
      this.pdf = pdfAsString;
      this.pdf = this.pdf.toString().replace(/^data:application\/pdf;filename=generated.pdf;base64,/, '')
      return this.pdf;
    })
            this.reloadPDFFINAL(pdf);
  
  }


  reloadPDFFINAL(event){
    this.currentPdf = event
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


}
