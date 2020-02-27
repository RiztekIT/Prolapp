import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ReciboPagoService } from '../../../../services/complementoPago/recibo-pago.service';
import Swal from 'sweetalert2';
import { PagoCFDI } from '../../../../Models/ComplementoPago/pagocfdi';

@Component({
  selector: 'app-pago-cfdi-edit',
  templateUrl: './pago-cfdi-edit.component.html',
  styleUrls: ['./pago-cfdi-edit.component.css']
})
export class PagoCFDIEditComponent implements OnInit {

  constructor(public dialogbox: MatDialogRef<PagoCFDIEditComponent>, public service: ReciboPagoService, ) { }

  ngOnInit() {
    //Asignar el Valor de Id Factura
    this.IdFactura = this.service.formDataPagoCFDIEdit.IdFactura;
    //Asignar el Saldo Complemneto Pago
    this.Saldo = this.service.SaldoComplementoPago;
    //Asignar Cantidad a CantidadF
    this.CantidadF = +this.service.formDataPagoCFDIEdit.Cantidad;
    this.getTotal();
  }

  NuevoSaldo: number;
  //Arreglo de los pagosCFDI
  CFDI: any;
  //Id de la Factura de recibo pago
  IdFactura: any;
  //Total de la Factura
  Total: any;
  //Saldo Complemento Pago
  Saldo: number;
  //Variable Cantidad
  CantidadF: number;
  //Saldo de la Factura
  SaldoF: number;

  onClose() {
    this.dialogbox.close();
    this.service.filter('Register click');
  }

  //Obtener el total de la factura
  getTotal(){
 //Obtener el total de la Factura
 this.service.getTotalFactura(this.IdFactura).subscribe(data => {
  this.Total = data[0].Total
});
  }

  onChangeCantidad(CantidadF: any) {
    //Obtener el valor que se ingresa en cierto input en la posicion 0
    let elemHTML: any = document.getElementsByName('Cantidad')[0];
    console.log(elemHTML.value);
    //Transformar la Cantidad en entero e igualarlo a la variable CantidadF

    this.CalcularCantidades(CantidadF);
    console.log('CANTIDAD F');
    console.log(this.CantidadF);
    elemHTML.value = this.CantidadF;
  }

  //
  CalcularCantidades(CantidadF: any){
    this.SaldoF = 20;
    this.CantidadF = +CantidadF;
    // console.log(this.CantidadF);
    // console.log(this.Saldo);

    if (this.CantidadF > this.Saldo) {
      console.log('ES MAYOR');
      this.CantidadF = this.Saldo;
      if (this.CantidadF >= this.SaldoF) {
        console.log('MAYOR QUE EL SALDO DE LA FACTURA');
        this.CantidadF = this.SaldoF;
      }
    } else if (this.CantidadF > this.SaldoF) {
      this.CantidadF = this.SaldoF;
    } else if (this.CantidadF <= 0) {
      this.CantidadF = 0;
    } else if(this.CantidadF == null){
    this.CantidadF = 0;
    }
    // this.Saldo = this.Saldo - this.CantidadF;
    // this.SaldoNuevo = this.SaldoF - this.CantidadF;
  }



  onSubmit(form: any) {
    this.service.formDataPagoCFDIEdit.Cantidad = this.service.formDataPagoCFDIEdit.Cantidad.toString();
    // console.log(this.service.formDataPagoCFDI);
    //Actualizar pagoCFDI con la nueva informacion
    this.service.updatePagoCFDI(this.service.formDataPagoCFDIEdit).subscribe(res => {
      console.log(res);
      this.service.getPagoCFDIFacturaID(this.IdFactura).subscribe(data => {
        this.CFDI = data;
        let SaldoP = this.Total
        for (let i=0; i<data.length; i++){
          this.CFDI[i].Saldo = SaldoP - +this.CFDI[i].Cantidad;
          SaldoP = SaldoP - +this.CFDI[i].Cantidad;
          this.service.updatePagoCFDI(this.CFDI[i]).subscribe(res =>{
           console.log(res);
          });
         }
         console.log(this.CFDI);
      });
      Swal.fire({
        icon: 'success',
        title: 'PagoCFDI Actualizado'
      })
    });

  }

}
