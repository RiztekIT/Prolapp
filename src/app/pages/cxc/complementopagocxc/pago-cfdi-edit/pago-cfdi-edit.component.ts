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
    this.IdFactura = this.service.formDataPagoCFDI.IdFactura;
    this.getTotal();
  }

  NuevoSaldo: number;
  //Arreglo de los pagosCFDI
  CFDI: any;
  //Id de la Factura de recibo pago
  IdFactura: any;
  //Total de la Factura
  Total: any;

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



  onSubmit(form: any) {
    this.service.formDataPagoCFDI.Cantidad = this.service.formDataPagoCFDI.Cantidad.toString();
    // console.log(this.service.formDataPagoCFDI);
    //Actualizar pagoCFDI con la nueva informacion
    this.service.updatePagoCFDI(this.service.formDataPagoCFDI).subscribe(res => {
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
