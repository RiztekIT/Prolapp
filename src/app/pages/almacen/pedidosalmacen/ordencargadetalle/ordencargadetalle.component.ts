import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatTable, MatDialog, MatSnackBar, MatDialogConfig } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { CurrencyPipe } from '@angular/common';
import { OrdenCargaService } from 'src/app/services/almacen/orden-carga/orden-carga.service';
import Swal from 'sweetalert2';
import { EmailComponent } from 'src/app/components/email/email/email.component';
import { MessageService } from 'src/app/services/message.service';
import { EnviarOrdenCargaComponent } from './enviar-orden-carga/enviar-orden-carga.component';
import { AlmacenEmailService } from 'src/app/services/almacen/almacen-email.service';

@Component({
  selector: 'app-ordencargadetalle',
  templateUrl: './ordencargadetalle.component.html',
  styleUrls: ['./ordencargadetalle.component.css'],
})
export class OrdencargadetalleComponent implements OnInit {

IdOrdenCarga: number;
  listData: MatTableDataSource<any>;
  displayedColumns: string [] = ['IdTarima', 'QR', 'ClaveProducto', 'Producto', 'Sacos', 'Lote', 'Proveedor', 'PO', 'FechaMFG', 'FechaCaducidad', 'Shipper', 'USDA', 'Pedimento'];
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  
  DataOrdenCarga: any;
  Folio: number;
  
  constructor(public router: Router, private dialog: MatDialog, public service: OrdenCargaService,  public _MessageService: MessageService, public AlmacenEmailService: AlmacenEmailService) { 

    this.service.listen().subscribe((m:any)=>{
      console.log(m);
      this.refreshDetalleOrdenCargaList();
      });
  }

  
  
  ngOnInit() {
    this.IdOrdenCarga = +(localStorage.getItem('IdOrdenCarga'));
    this.refreshForm();
    this.refreshDetalleOrdenCargaList();
    this.ObtenerFolio(this.IdOrdenCarga);
  }


          refreshForm(){
            this.DataOrdenCarga = this.service.getOrdenCargaID(this.IdOrdenCarga).subscribe( data=> {
                  console.log(data);
                  console.log(this.service.formData,'12312312312312');
                  this.service.formData = data[0];
                  
                  console.log(this.service.formData,'asdasdasdasdasd');
            });
          }

  refreshDetalleOrdenCargaList(){
    this.service.getOrdenCargaIDList(this.IdOrdenCarga).subscribe(data => {
      console.log(data);
      this.service.formDataDOC = data[0];
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    });
  }

   //Obtener Folio de Orden Carga
   ObtenerFolio(id: number) {
    this.service.getOrdenCargaID(id).subscribe(dataOC => {
      console.log(dataOC);
      this.Folio = dataOC[0].Folio;
      console.log(this.Folio);
    })
  }

  cambiarEstatusP(){

    console.log(this.service.formData.IdOrdenCarga);


    let estatus = {
      IdOrdenCarga: this.service.formData.IdOrdenCarga,
      Estatus: "Preparada"
    }

    this.router.navigate(['/ordenCargaPreparar']);

    // this.service.updatedetalleOrdenCargaEstatus(estatus.IdOrdenCarga, estatus.Estatus).subscribe(data =>{
    //   this.service.formData.Estatus = "Preparada"
    // })

  }
  cambiarEstatusC(){

    let estatus = {
      IdOrdenCarga: this.service.formData.IdOrdenCarga,
      Estatus: "Cargada"
    }
    this.router.navigate(['/ordenCargaCargar']);

    // this.service.updatedetalleOrdenCargaEstatus(estatus.IdOrdenCarga, estatus.Estatus).subscribe(data =>{
    //   this.service.formData.Estatus = "Cargada"
    // })
    
  }
  cambiarEstatusE(){
   
    let estatus = {
      IdOrdenCarga: this.service.formData.IdOrdenCarga,
      Estatus: "Enviada"
    }
    this.AlmacenEmailService.correo='ivan.talamantes@live.com';
    this.AlmacenEmailService.cco='ivan.talamantes@riztek.com.mx';
    this.AlmacenEmailService.asunto='Envio Factura ';
    this.AlmacenEmailService.cuerpo='Se ha enviado un comprobante fiscal digital con folio ';
    this.AlmacenEmailService.nombre='ProlactoIngredientes';
    this.AlmacenEmailService.folio = this.Folio;

    const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        // dialogConfig.width = "90%";
        dialogConfig.height = "90%";
        // dialogConfig.data = {
        //   foliop: folio,
        //   idp: id,
        //   status: true
        // }
        this.dialog.open(EnviarOrdenCargaComponent, dialogConfig);

    // this.router.navigate(['/ordenCargaEnviar']);

    // this.service.updatedetalleOrdenCargaEstatus(estatus.IdOrdenCarga, estatus.Estatus).subscribe(data =>{
    //   this.service.formData.Estatus = "Enviada"
    // })
  }
  cambiarEstatusT(){

    let estatus = {
      IdOrdenCarga: this.service.formData.IdOrdenCarga,
      Estatus: "Terminada"
    }

    // this.service.updatedetalleOrdenCargaEstatus(estatus.IdOrdenCarga, estatus.Estatus).subscribe(data =>{
    //   this.service.formData.Estatus = "Terminada"
    // })
    
  }

    /* Metodo para enviar por correo, abre el modal con los datos */
email(){
  // localStorage.removeItem('xml'+folio);
  // localStorage.removeItem('pdf'+folio);
  // localStorage.setItem('rowfact',JSON.stringify(row));
  // document.getElementById('enviaremail').click();
  let id=1
  let folio = 1

    this._MessageService.correo='ivan.talamantes@live.com';
    this._MessageService.cco='ivan.talamantes@riztek.com.mx';
    this._MessageService.asunto='Envio Factura '+folio;
    this._MessageService.cuerpo='Se ha enviado un comprobante fiscal digital con folio '+folio;
    this._MessageService.nombre='ProlactoIngredientes';
  

      // const dialogConfig2 = new MatDialogConfig();
      // dialogConfig2.autoFocus = false;
      // dialogConfig2.width = "0%";    
      // let dialogFact = this.dialog.open(FacturaComponent, dialogConfig2); 
      
  
      // setTimeout(()=>{

      //     const content: Element = document.getElementById('Factura-PDF');
      //     const option = {
      //       margin: [0, 0, 0, 0],
      //       filename: 'F-' + folio + '.pdf',
      //       image: { type: 'jpeg', quality: 1 },
      //       html2canvas: { scale: 2, logging: true, scrollY: 0 },
      //       jsPDF: { format: 'letter', orientation: 'portrait' },
      //     };
      //     // html2pdf().from(content).set(option).output('datauristring').then(function(pdfAsString){
      //     //   localStorage.setItem('pdf'+folio, pdfAsString);
      //     //   this.statusparam=true;          
      //     //   console.log(this .statusparam);                
      //     // })
      //     // dialogFact.close()
          
      //   },1000)
        
        // const dialogConfig = new MatDialogConfig();
        // dialogConfig.disableClose = true;
        // dialogConfig.autoFocus = true;
        // // dialogConfig.width = "90%";
        // dialogConfig.height = "90%";
        // dialogConfig.data = {
        //   foliop: folio,
        //   idp: id,
        //   status: true
        // }
        // this.dialog.open(EmailComponent, dialogConfig);
        
  
  
   
  
  }

  regresar(){
    localStorage.removeItem('FormDataOrdenCarga');
    this.router.navigate(['/pedidosalmacen']);
  }

}
  