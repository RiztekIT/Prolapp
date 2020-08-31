import { NgForm, FormControl } from "@angular/forms";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { PagoscxpService } from '../../../../services/cuentasxpagar/pagoscxp.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pago-documento',
  templateUrl: './pago-documento.component.html',
  styleUrls: ['./pago-documento.component.css']
})
export class PagoDocumentoComponent implements OnInit {

  constructor(public dialogbox: MatDialogRef<PagoDocumentoComponent>, public pagoService: PagoscxpService) { }

  ngOnInit() {

    console.log(this.pagoService.objetoPago.FechaPago);
    if(this.pagoService.nuevoPago == true){
        this.generarNuevoFolio();
    }else{
      this.FolioPago = this.pagoService.objetoPago.Folio;
      this.Cantidad = +this.pagoService.objetoPago.Cantidad;
    }

    if(this.pagoService.modulo == 'Flete'){
      this.FolioModulo = this.pagoService.objetoModulo.IDFacturaFlete;
    }else{
      this.FolioModulo = this.pagoService.objetoModulo.Folio;
    }
  }

  FolioPago: number;

  FolioModulo: number;

  Cantidad: number

  generarNuevoFolio(){
    this.pagoService.getNewFolio().subscribe(newFolio=>{
      console.log(newFolio);
      this.FolioPago = +newFolio;
    })
  }

  ver(){
    console.log(this.pagoService.objetoPago);

  }

  //On change Cantidad
  onChangeCantidad(cantidad: any) {
    // console.log(cantidad);
    let elemHTML: any = document.getElementsByName('CantidadPago')[0];
    this.validarCantidad(cantidad);
    elemHTML.value = this.Cantidad;
  }

  //Validar que la cantidad sea >=0
  validarCantidad(cantidad: any) {
    this.Cantidad = +cantidad;
    if (this.Cantidad <= 0) {
      this.Cantidad = 0;
    }
    if (this.Cantidad == null) {
      this.Cantidad = 0;
    }
  }

  newPago(){
    this.pagoService.objetoPago.Folio = this.FolioPago;
    this.pagoService.objetoPago.FolioDocumento = this.FolioModulo;
    this.pagoService.objetoPago.TipoDocumento = this.pagoService.modulo;
    this.pagoService.objetoPago.Cantidad = this.Cantidad.toString();
    console.log(this.pagoService.objetoPago);
    this.pagoService.addPago(this.pagoService.objetoPago).subscribe(res=>{
      console.log(res);
      Swal.fire({
        title: 'Pago Generado',
        icon: 'success',
        timer: 1000,
        showCancelButton: false,
        showConfirmButton: false
      });
      this.onClose();
    })
  }
  
  updatePago(){
    this.pagoService.objetoPago.Cantidad = this.Cantidad.toString();
    console.log(this.pagoService.objetoPago);
    // this.onClose();
    this.pagoService.updatePago(this.pagoService.objetoPago).subscribe(res=>{
      console.log(res);
      Swal.fire({
        title: 'Pago Actualizado',
        icon: 'success',
        timer: 1000,  
        showCancelButton: false,
        showConfirmButton: false
      });
      this.onClose();
    })
  }
  
  onClose() {
    this.dialogbox.close();
    this.pagoService.filter('');
  }

}
