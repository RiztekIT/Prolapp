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
  imagenproducto;


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

nombreimagen(clave:string){

  let nombreproducto;
  let marcaproducto;

  let claven;
  let clavem;

  this.imagenproducto = '';

  claven = clave.substr(0,2);
  clavem = clave.substr(2,1);

  switch (claven){
    case '01': nombreproducto = 'LECHE DESCREMADA EN POLVO LH';
    break;
    case '02': nombreproducto = 'LECHE DESCREMADA EN POLVO MH';
    break;
    case '03': nombreproducto = 'SUERO DULCE';
    break;
    case '04': nombreproducto = 'SUERO DESPROTEINIZADO';
    break;
    case '05': nombreproducto = 'SUERO DESMINERALIZADO';
    break;
    case '06': nombreproducto = 'LACTOSA';
    break;
    case '07': nombreproducto = 'MALTODEXTRINA MALLA 110';
    break;
    case '08': nombreproducto = 'MALTODEXTRINA MALLA 120';
    break;
    case '09': nombreproducto = 'MALTODEXTRINA MALLA 130';
    break;
    case '10': nombreproducto = 'SOLIDOS DE MANTEQUILLA';
    break;
    case '11': nombreproducto = 'MPC 70';
    break;
    case '12': nombreproducto = 'GRASA VEGETAL';
    break;
    case '13': nombreproducto = 'GRASA BUTIRICA';
    break;
    case '14': nombreproducto = 'PRODUCTO LACTEO COMBINADO';
    break;
    case '15': nombreproducto = 'LECHE ENTERA';
    break;
    case '16': nombreproducto = 'PERMEATO DE SUERO';
    break;
    case '17': nombreproducto = 'PERMEATO DE LECHE';
    break;
    case '18': nombreproducto = 'CASEINA ACIDA';
    break;
    case '19': nombreproducto = 'CASEINA RENINA';
    break;

  }

  this.imagenproducto = nombreproducto;

  switch (clavem){
    case 'A': marcaproducto='DAIRY AMERICA';
    break;
case 'B': marcaproducto='KRAFT';
break;
case 'C': marcaproducto='CRINO';
break;
case 'D': marcaproducto='RENNY PICOT';
break;
case 'E': marcaproducto='AGROPUR';
break;
case 'F': marcaproducto='MALTRIN';
break;
case 'G': marcaproducto='EXTRALAC';
break;
case 'H': marcaproducto='FONTERRA';
break;
case 'I': marcaproducto='PRO LACTOINGREDIENTES';
break;
case 'J': marcaproducto='FRANKLIN';
break;
case 'K': marcaproducto='IDAHO';
break;
case 'L': marcaproducto='NEW ZEALAND';
break;
case 'M': marcaproducto='LONE STAR';
break;
case 'N': marcaproducto='LEPRINO';
break;
case 'O': marcaproducto='LAND O LAKES';
break;
case 'P': marcaproducto='DFA';
break;
case 'Q': marcaproducto='ACOROMA 39';
break;
case 'R': marcaproducto='BONGARDS';
break;
case 'S': marcaproducto='CONTINENTAL';
break;
case 'T': marcaproducto='LANDO LAKES';
break;
case 'U': marcaproducto='LYYN';
break;
case 'V': marcaproducto='GRASSLAND';
break;
case 'W': marcaproducto='TATUA';
break;
case 'X': marcaproducto='DARIGOLD';
break;
case 'Y': marcaproducto='CDI';
break;
case 'Z': marcaproducto='DAIRIGOLD';
break;
case 'AA': marcaproducto='MURRAY';
break;
case 'AB': marcaproducto='AMPY ';
break;
case 'AC': marcaproducto='CAYUGA';
break;
  }

  this.imagenproducto = this.imagenproducto + ' ' + marcaproducto;

  
  return this.imagenproducto

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
      imagen: this.nombreimagen(conceptos.ClaveProducto)    
       
     });

      // this.total = +conceptos.PrecioUnitario * +conceptos.Cantidad;
      // console.log(this.total);

      // if (this.con > "0" && this.defaultpx <70) {
      //   this.defaultpx = this.defaultpx - 70
      // }
      // console.log(this.con,"contador");
      // console.log(this.defaultpx,"pixeles");
  }

  console.log(this.arrcon);


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

