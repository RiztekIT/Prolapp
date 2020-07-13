import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import * as html2pdf from 'html2pdf.js';
import { MessageService } from 'src/app/services/message.service';
import { VentasCotizacionService } from '../../services/ventas/ventas-cotizacion.service';
import { DetalleCotizacion } from '../../Models/ventas/detalleCotizacion-model';


@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.css']
})
export class CotizacionComponent implements OnInit {

  constructor(public dialogbox: MatDialogRef<CotizacionComponent>, public _MessageService: MessageService, public service: VentasCotizacionService) { }

  con : string| number;
  arrcon: Array<any> = [];
  objconc: any; 
  total:any;
  fechaVencimiento:any;
  defaultpx:number
  srcimagen;
  srcimageninicial;


  public imagessacos: Array<Object> = [
    {producto: "LECHE DESCREMADA EN POLVO LH DFA", imagen: "2.DFAMILK.png"},
    {producto: "LECHE DESCREMADA EN POLVO LH DAIRIGOLD", imagen: "3.DARIGOLDmilk.png"},
    {producto: "LACTOSA LEPRINO", imagen: "4.Leprino Food-lactose.png"},
    {producto: "SUERO DESPROTEINIZADO  CRINO", imagen: "5.Premium crino deprotenized whey.png"},
    {producto: "LECHE DESCREMADA EN POLVO LH CONTINENTAL", imagen: "6.Continental nonfatdrymilk.png"},
    {producto: "LECHE DESCREMADA EN POLVO LH DAIRY AMERICA", imagen: "7.DairyAmerica-grade A nonfat drymilk.png"},
    {producto: "MALTODEXTRINA MALLA 110 MALTRIN", imagen: "8.maltrin GPC azul.png"},
    {producto: "SUERO DULCE LANDO LAKES", imagen: "9.landolakesextragradedrysweetWhey.png"},
    {producto: "GRASA VEGETAL ACOROMA 39", imagen: "13.grasa vegetal akoroma.png"},
    {producto: "GRASA VEGETAL EXTRALAC USA 25", imagen: "14.AAKextralac.png"},
    {producto: "SUERO DULCE KRAFT", imagen: "1.KraftMilk.png"}    
  ]

  ngOnInit() {
    this.ver();
    // this.srcimagen = '../../../assets/images/sacos/7.DairyAmerica-grade A nonfat drymil.png'
    this.srcimageninicial = '../../../assets/images/sacos/'
    
  }

  onClose() {
    this.dialogbox.close();
}


ver(){
  
  this.objconc = this.service.formrow.DetalleCotizacion
  
  this.arrcon = [];
  this.defaultpx = 350;
  for (this.con in this.objconc){
    var conceptos = this.objconc[this.con];
    this.arrcon.push({
      IdDetalleCotizacion: conceptos.IdDetalleCotizacion,
      IdCotizacion: conceptos.IdCotizacion,
      ClaveProducto: conceptos.ClaveProducto,
      Producto: conceptos.Producto,
      Unidad: conceptos.Unidad,
      PrecioUnitario: conceptos.PrecioUnitario,
      PrecioUnitarioDlls: conceptos.PrecioUnitarioDlls,
      Cantidad: conceptos.Cantidad,
      Importe: conceptos.Importe,
      ImporteDlls: conceptos.ImporteDlls,
      Observaciones: conceptos.Observaciones,    
       
     });

      // this.total = +conceptos.PrecioUnitario * +conceptos.Cantidad;
      // console.log(this.total);

      // if (this.con > "0" && this.defaultpx <70) {
      //   this.defaultpx = this.defaultpx - 70
      // }
      // console.log(this.con,"contador");
      // console.log(this.defaultpx,"pixeles");
  }


//si se agregan direcciones, usar esta seccion
  // this.service.GetCliente(this.service.formrow.IdCliente).subscribe(data => {

  //   this.service.formData.Calle = data[0].Calle;
  //   this.service.formData.Colonia = data[0].Colonia;
  //   this.service.formData.CP = data[0].CP;
  //   this.service.formData.RFC = data[0].RFC;
  //   this.service.formData.Ciudad = data[0].Ciudad;
  //   this.service.formData.Estado = data[0].Estado;
  //   this.service.formData.NumeroExterior = data[0].NumeroExterior;
  //   this.service.formData.NumeroInterior = data[0].NumeroInterior;
  // });
  
}

onExportClick(Folio?:string) {
  const content: Element = document.getElementById('Cotizacion-PDF');
  const option = {    
    margin: [.5,.5,0,.5],
    filename: 'C-'+this.service.formrow.Folio+'.pdf',
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

