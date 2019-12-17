import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { FacturaService } from '../../../../services/facturacioncxc/factura.service';
import {  NgForm } from '@angular/forms';
import { Cliente } from '../../../../Models/catalogos/clientes-model';
import { Router } from '@angular/router';
import { Usuario } from '../../../../Models/catalogos/usuarios-model';

@Component({
  selector: 'app-facturacioncxc-add',
  templateUrl: './facturacioncxc-add.component.html'
})
export class FacturacioncxcAddComponent implements OnInit {
  folio: string;

  constructor( 
    public service: FacturaService, private snackBar: MatSnackBar,  private router:Router) { }
    
  
    listClientes: Cliente[]  = [];
  

  ngOnInit() {
    this.resetForm();
    this.dropdownRefresh();
    this.Folio();
  }


  dropdownRefresh(){
    this.service.getDepDropDownValues().subscribe((data) =>{
    // console.log(data);
    for (let i = 0; i < data.length; i++){
      let client=data[i];
      this.listClientes.push(client);
    }
    // console.log(JSON.stringify(data));
    // this.listClientes = data[0];
    // this.listClientes = data.;
    // console.log(this.listClientes + "LIST CLIENTEESSS");


      // data.forEach(element =>{
      //   let datos = JSON.stringify(element)
      //   this.listClientes.push(JSON.stringify(datos));
      //   console.log(this.listClientes + "LIST CLIENTEESSS");
        
       
      // });

    });
  }
  Regresar(){
    this.router.navigateByUrl('/facturacionCxc');
  }
  Folio(){
    this.folio = "200"; 
    // this.service.getFolio().subscribe(data => {
      console.log(this.folio);
      // console.log(this.folio);
      this.service.formData.Folio = this.folio;
      console.log(this.service.formData.Folio);
      // this.service.formData.Folio = this.folio;
      // console.log(this.service.formData.Folio);
    // });
  }

  



  resetForm(form?: NgForm) {
    if (form != null)
   form.resetForm();
   this.service.formData = {
     //Factura
    Id: 0,
    ClienteId: 0,
    Serie: '',
    Folio: '',
    Tipo: '',
    FechaDeExpedicion: '',
    LugarDeExpedicion: '',
    Certificado: '',
    NumeroDeCertificado: '',
    UUID: '',
    UsoDelCFDI: '',
    Subtotal: '',
    Descuento: '',
    ImpuestosRetenidos: '',
    ImpuestosTrasladados: '',
    Total: '',
    FormaDePago: '',
    MetodoDePago: '',
    Cuenta: '',
    Moneda: '',
    CadenaOriginal: '',
    SelloDigitalSAT: '',
    SelloDigitalCFDI: '',
    NumeroDeSelloSAT: '',
    RFCdelPAC: '',
    Observaciones: '',
    FechaVencimiento: '',
    OrdenDeCompra: '',
    TipoDeCambio: '',
    FechaDeEntrega: '',
    CondicionesDePago: '',
    Vendedor: '',
    Estatus: '',
    Version: '',
    Usuario: '',
    //Detalle Factura
    IdDetalle: 0,
    IdFactura: 0,
    ClaveProducto: '',
    Producto: '',
    Unidad: '',
    ClaveSat: '',
    PrecioUnitario: '',
    Cantidad: '',
    Importe: '',
    ObservacionesConcepto: '',
    TextoExtra: ''
   }

  }


onSubmit(form: NgForm) {
  // console.log(form.value);
  // this.service.addProducto(form.value).subscribe( res =>
  //   {
  //     this.resetForm(form);
  //     this.snackBar.open(res.toString(),'',{
  //       duration: 5000,
  //       verticalPosition: 'top'
  //     });
  //   }
  //   );
  console.log(form.value);
}

}
