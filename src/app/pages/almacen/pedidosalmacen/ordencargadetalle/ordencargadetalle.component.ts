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
      this.getOrdenCarga();
      this.refreshDetalleOrdenCargaList();
      });
  }

  
  
  ngOnInit() {
    this.IdOrdenCarga = +(localStorage.getItem('IdOrdenCarga'));
    console.log(this.IdOrdenCarga)
    this.getOrdenCarga();
    this.refreshDetalleOrdenCargaList();
    this.ObtenerFolio(this.IdOrdenCarga);
  }

  //variable para guardar el estatus de la Orden Carga
  estatusOC: string;

  //Obtener informacion Orden Carga
          getOrdenCarga(){
            this.service.getOCID(this.IdOrdenCarga).subscribe( data=> {
              console.log(data)
                  this.service.formData = data[0];
                  this.estatusOC = data[0].Estatus;
                  console.log(this.estatusOC);
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

  preparar(){
    this.router.navigate(['/ordenCargaPreparar']);
  }
  cargar(){

    this.service.getOCID(this.IdOrdenCarga).subscribe(data=>{
console.log(data)
if(data[0].Fletera == '' || data[0].Caja == ''){
  Swal.fire({
    title: 'Error',
    text:'Favor de asignar Fletera y/o Caja',
    icon: 'error',
    // showCancelButton: false,
    // showConfirmButton: false
  });
}
else{
  this.router.navigate(['/ordenCargaCargar']);
    }
    });
  }
  enviar(){
   
    this.AlmacenEmailService.correo='ivan.talamantes@live.com';
    this.AlmacenEmailService.cco='javier.sierra@riztek.com.mx';
    this.AlmacenEmailService.asunto='Envio Orden Carga con Folio '+this.Folio.toString();
    this.AlmacenEmailService.cuerpo='Se han enviado Documentos de Orden Carga con el Folio '+this.Folio.toString();
    this.AlmacenEmailService.nombre='ProlactoIngredientes';
    this.AlmacenEmailService.folio = this.Folio;

    const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.height = "90%";
      
        this.dialog.open(EnviarOrdenCargaComponent, dialogConfig);

  }
   terminar(){
  }

  regresar(){
    localStorage.removeItem('FormDataOrdenCarga');
    this.router.navigate(['/pedidosalmacen']);
  }

}
  