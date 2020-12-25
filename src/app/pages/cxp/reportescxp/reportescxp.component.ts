import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatDialog, MatDialogConfig, MatSnackBar, MatDivider, MAT_DATE_LOCALE } from '@angular/material';
import {ThemePalette} from '@angular/material/core';
import { PagoscxpService } from '../../../services/cuentasxpagar/pagoscxp.service';
import { ShowreporteCxpComponent } from './showreporte-cxp/showreporte-cxp.component';

@Component({
  selector: 'app-reportescxp',
  templateUrl: './reportescxp.component.html',
  styleUrls: ['./reportescxp.component.css']
})
export class ReportescxpComponent implements OnInit {


  constructor(private dialog: MatDialog, public pagoService: PagoscxpService) { }

  ngOnInit() {
     }

     //Fechas de reportes a ser filtradas
   fechaInicialPago: Date;
   fechaFinalPago: Date;

 
 //Variable para Filtrar por fechas Pagos
 color: ThemePalette = 'accent';
 checkedFechasPago= false;
 disabledFechasPago= false;

 checkedTipoDocumentoPago= false;
 disabledTipoDocumentoPago= true;
 
 
   //variable tipo de documentos Pago (CAdministrativa, CMateriaPrima, Flete, Comision, )
   tipoDocumentoPago: string;
 
 
   //Lista de Tipos de Documento pago
   public listTipoDocumentoPago: Array<Object> = [
     { tipo: 'Compra Administrativa' },
     { tipo: 'Compra Materia Prima' },
     { tipo: 'Flete' },
     { tipo: 'Comision' }
   ];



    //Al filtrar por fecha
    onChangePorFechaPago(){
      if(this.checkedFechasPago == true){
        this.checkedFechasPago = false;
      }else{
        this.checkedFechasPago = true;
      }
        }



      //cuando se filtarara por tipo Documento Pago
  onChangeTipoDocumentoPago(){
    if(this.checkedTipoDocumentoPago == true){
      this.checkedTipoDocumentoPago = false;
    }else{
      this.checkedTipoDocumentoPago = true;
    }
  }


  //cuando se selecciona un tipo documento Pago
  changeTipoDocumentoPago(event){
    console.log(event);
    this.tipoDocumentoPago = event.target.selectedOptions[0].text;
  }



  abrirReporte(modulo){


    console.log(modulo);

    //Variables generales
    let filtrarFecha: boolean;
    let fechaStart = new Date();
    let fechaEnd = new Date();

    let pagoFiltro1Boolean: boolean = false;
    let pagoFiltro1Valor: string = '';


if(modulo == 'Pago'){

  if(this.checkedFechasPago == true){
    // console.log('SE FILTRA POR FECHA');
      fechaStart = this.fechaInicialPago;
      fechaEnd = this.fechaFinalPago;
      filtrarFecha = true;
  }else{
    filtrarFecha = false;
  }
  if(this.checkedTipoDocumentoPago == true){
    if(this.tipoDocumentoPago == 'Compra Administrativa'){
    this.tipoDocumentoPago = 'CAdministrativa';
    }
    if(this.tipoDocumentoPago == 'Compra Materia Prima'){
      this.tipoDocumentoPago = 'CMateriaPrima';
      }
    pagoFiltro1Boolean = true;
    pagoFiltro1Valor = this.tipoDocumentoPago; 
  }

}
    
// console.log('TipoReporte', tipoReporte);
// console.log('UnProveedor?', unProveedor);
// console.log('MONEDA:', moneda);
// console.log('IDPROVE', this.IdProveedor);
// console.log('FiltrarFEcha?', this.checked);
// console.log('FiltrarEstatus', estatus);
// console.log('TipoEstatus', tipoEstatus);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "80%";
    dialogConfig.data = {
      modulo: modulo,
      filtradoFecha: filtrarFecha,
      fechaInicial: fechaStart,
      fechaFinal: fechaEnd,
      pagoFiltro1Boolean: pagoFiltro1Boolean,
      pagoFiltro1Valor: pagoFiltro1Valor
      
    }
    this.dialog.open( ShowreporteCxpComponent, dialogConfig);


  }

}
