import { Component, OnInit } from '@angular/core';
import { DocumentosImportacionService } from 'src/app/services/importacion/documentos-importacion.service';

import * as html2pdf from 'html2pdf.js';
import { TraspasoMercanciaService } from 'src/app/services/importacion/traspaso-mercancia.service';

@Component({
  selector: 'app-orden-carga-descarga',
  templateUrl: './orden-carga-descarga.component.html',
  styleUrls: ['./orden-carga-descarga.component.css']
})
export class OrdenCargaDescargaComponent implements OnInit {

  constructor(public traspasoSVC: TraspasoMercanciaService,
    ) { }

    objconc: any; 
    con : string| number;
    arrcon: Array<any> = [];
    usdaArr: Array<any> = [];
    pesototalprod
    pesototal
    sacosTotales
    cliente
    folio
    expedicion

  ngOnInit() {
    this.obtenerDetallesTraspaso()
  }


  
  obtenerDetallesTraspaso(){
    let id = this.traspasoSVC.formrow[0].IdTraspasoMercancia;
this.traspasoSVC.GetTraspasoMercanciaid(id).subscribe(res =>{

console.log('%c⧭', 'color: #00b300', res);
this.cliente = res[0].Cliente
this.folio = res[0].Folio
this.expedicion = res[0].FechaExpedicion

})
    

   
    }


  onExportClick(Folio?:string) {
    const content: Element = document.getElementById('OrdenCargaDescarga-PDF');
    const option = {    
      margin: [.5,.5,0,.5],
      filename: 'C-'+this.traspasoSVC.formrow.Folio+'.pdf',
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
