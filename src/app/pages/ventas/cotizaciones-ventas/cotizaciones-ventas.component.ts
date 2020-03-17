import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CotizacionComponent } from 'src/app/components/cotizacion/cotizacion.component';
import * as html2pdf from 'html2pdf.js';
import { MessageService } from 'src/app/services/message.service';
import { EmailComponent } from 'src/app/components/email/email/email.component';

@Component({
  selector: 'app-cotizaciones-ventas',
  templateUrl: './cotizaciones-ventas.component.html',
  styleUrls: ['./cotizaciones-ventas.component.css']
})
export class CotizacionesVentasComponent implements OnInit {

  constructor( private dialog: MatDialog, public _MessageService: MessageService) { }

  ngOnInit() {
  }



  openrep(){

    console.log();
    // console.log();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    this.dialog.open(CotizacionComponent, dialogConfig);
  }

  
email(){
  console.log();
    // console.log();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    this.dialog.open(EmailComponent, dialogConfig);

  console.log('asdasd');
  document.getElementById('enviaremail').click();
  
    // this.folioparam = folio;
    // this.idparam = id;
    this._MessageService.correo='ivan.talamantes@live.com';
    this._MessageService.cco='ivan.talamantes@riztek.com.mx';
    this._MessageService.asunto='Envio Factura ';
    this._MessageService.cuerpo='Se ha enviado un comprobante fiscal digital con folio ';
    this._MessageService.nombre='ProlactoIngredientes';
        setTimeout(()=>{
          const content: Element = document.getElementById('Cotizacion-PDF');
          const option = {
            margin: [0, 0, 0, 0],
            filename: 'F-'  + '.pdf',
            image: { type: 'jpeg', quality: 1 },
            html2canvas: { scale: 2, logging: true, scrollY: 0 },
            jsPDF: { format: 'letter', orientation: 'portrait' },
          };
          html2pdf().from(content).set(option).output('datauristring').then(function(pdfAsString){
            localStorage.setItem('pdf', pdfAsString);
            this.statusparam=true;          
            console.log(this.statusparam);
          })
        },1000)
  }
  

}
