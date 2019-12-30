import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { ClientesService } from '../../../../../services/catalogos/clientes.service';
import { NgForm } from '@angular/forms';
import { EnviarfacturaService } from 'src/app/services/facturacioncxc/enviarfactura.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-cliente',
  templateUrl: './add-cliente.component.html',
  styleUrls: ['./add-cliente.component.css']
})
export class AddClienteComponent implements OnInit {

  constructor(public dialogbox: MatDialogRef<AddClienteComponent>,
    public service: ClientesService, private snackBar: MatSnackBar, public apicliente: EnviarfacturaService) { }

  ngOnInit() {
    this.resetForm();
  }

  //Forma Pago
  public listFP: Array<Object> = [
    { FormaDePago: "01", text: "01-Efectivo" },
    { FormaDePago: "02", text: "02-Cheque nominativo" },
    { FormaDePago: "03", text: "03-Transferencia electrónica de fondos" },
    { FormaDePago: "04", text: "04-Tarjeta de crédito" },
    { FormaDePago: "05", text: "05-Monedero electrónico" },
    { FormaDePago: "06", text: "06-Dinero electrónico" },
    { FormaDePago: "08", text: "08-Vales de despensa" },
    { FormaDePago: "12", text: "12-Dación en pago" },
    { FormaDePago: "13", text: "13-Pago por subrogación" },
    { FormaDePago: "14", text: "14-Pago por consignación" },
    { FormaDePago: "15", text: "15-Condonación" },
    { FormaDePago: "17", text: "17-Compensación" },
    { FormaDePago: "23", text: "23-Novación" },
    { FormaDePago: "24", text: "24-Confusión" },
    { FormaDePago: "25", text: "25-Remisión de deuda" },
    { FormaDePago: "26", text: "26-Prescripción o caducidad" },
    { FormaDePago: "27", text: "27-A satisfacción del acreedor" },
    { FormaDePago: "28", text: "28-Tarjeta de débito" },
    { FormaDePago: "29", text: "29-Tarjeta de servicios" },
    { FormaDePago: "30", text: "30-Aplicación de anticipos" },
    { FormaDePago: "31", text: "31-Intermediario pagos" },
    { FormaDePago: "99", text: "99-Por definir" }
  ];
  //list CFDI
  public listCFDI: Array<Object> = [
    { UsoDelCFDI: "G01", text: "G01-Adquisición de mercancias" },
    { UsoDelCFDI: "G02", text: "G02-Devoluciones, descuentos o bonificaciones" },
    { UsoDelCFDI: "G03", text: "G03-Gastos en general" },
    { UsoDelCFDI: "I01", text: "I01-Construcciones" },
    { UsoDelCFDI: "I02", text: "I02-Mobilario y equipo de oficina por inversiones" },
    { UsoDelCFDI: "I03", text: "I03-Equipo de transporte" },
    { UsoDelCFDI: "I04", text: "I04-Equipo de computo y accesorios" },
    { UsoDelCFDI: "I05", text: "I05-Dados, troqueles, moldes, matrices y herramental" },
    { UsoDelCFDI: "I06", text: "I06-Comunicaciones telefónicas" },
    { UsoDelCFDI: "I07", text: "I07-Comunicaciones satelitales" },
    { UsoDelCFDI: "I08", text: "I08-Otra maquinaria y equipo" },
    { UsoDelCFDI: "D01", text: "D01-Honorarios médicos, dentales y gastos hospitalarios" },
    { UsoDelCFDI: "D02", text: "D02-Gastos médicos por incapacidad o discapacidad" },
    { UsoDelCFDI: "D03", text: "D03-Gastos funerales" },
    { UsoDelCFDI: "D04", text: "D04-Donativos" },
    { UsoDelCFDI: "D05", text: "D05-Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación)" },
    { UsoDelCFDI: "D06", text: "D06-Aportaciones voluntarias al SAR" },
    { UsoDelCFDI: "D07", text: "D07-Primas por seguros de gastos médicos" },
    { UsoDelCFDI: "D08", text: "D08-Gastos de transportación escolar obligatoria" },
    { UsoDelCFDI: "D09", text: "D09-Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones" },
    { UsoDelCFDI: "D10", text: "D10-Pagos por servicios educativos (colegiaturas)" },
    { UsoDelCFDI: "P01", text: "P01-Por definir" }
  ];


  resetForm(form?: NgForm) {
    if (form != null)
      form.resetForm();

    this.service.formData = {
      IdClientes: 0,
      Nombre: '',
      RFC: '',
      RazonSocial: '',
      Calle: '',
      Colonia: '',
      CP: '',
      Ciudad: '',
      Estado: '',
      NumeroInterior: '',
      NumeroExterior: '',
      ClaveCliente: '',
      Estatus: '',
      LimiteCredito: '',
      DiasCredito: '',
      MetodoPago: '',
      UsoCFDI: '',
      IdApi: ''
    }
  }

  onClose() {
    this.dialogbox.close();
    this.service.filter('Register click');
  }

  onSubmit(form: NgForm) {
    // console.log(form.value);
    let email;
    let rfc;
    let razon;
    let codpos;
    let datos;
    console.log(form.value);
    email = 'riztekti@gmail.com';
    rfc = form.value.RFC;
    razon = form.value.RazonSocial;
    codpos = form.value.CP;
    datos = {
      "email" : email,
      "razons" : razon,
      "rfc" : rfc,
      "codpos" : codpos
    }
    
    datos = JSON.stringify(datos);
    this.apicliente.crearCliente(datos).subscribe(data =>{
        
      if (data.status==='success'){
        form.value.IdApi=data.Data.UID
        form.value.Estatus = 'Activo'
        console.log(form.value);
        this.service.addCliente(form.value).subscribe(res => {
          // this.snackBar.open(res.toString(), '', {
          //   duration: 5000,
          //   verticalPosition: 'top'
          // });
          Swal.fire({
            icon: 'success',
            title: 'Cliente Agregado',
            text: ''+form.value.RazonSocial+'',
            timer: 1500
          })
          
        }
        );

        
        // console.log(data.Data.UID);
        // console.log(data.Data.RFC);
        // let act;
        // act = {
        //   "RFC": data.Data.RFC,
        //   "IdApi": data.Data.UID
        // }
        // console.log(act);
        
        // this.service.updateCliente(act).subscribe(res => {
        //   this.snackBar.open(res.toString(), '', {
        //     duration: 5000,
        //     verticalPosition: 'top'
        //   });
        // });
      }
      else{
        console.log(data);
        
      }
      this.resetForm(form);
    })



    
    
  }
  // onSubmit(form: NgForm) {
  //   // console.log(form.value);
  //   let email;
  //   let rfc;
  //   let razon;
  //   let codpos;
  //   let datos;
  //   console.log(form.value);
    
  //   this.service.addCliente(form.value).subscribe(res => {
  //     console.log(this.service.formData);
  //     console.log(form.value.RFC);
      
  //     email = 'riztekti@gmail.com';
  //     // rfc = this.service.formData.RFC;
  //     // razon = this.service.formData.RazonSocial;
  //     // codpos = this.service.formData.CP;
  //     rfc = this.service.formData.RFC;
  //     razon = this.service.formData.RazonSocial;
  //     codpos = this.service.formData.CP;
  //     datos = {
  //       "email" : email,
  //       "razons" : razon,
  //       "rfc" : rfc,
  //       "codpos" : codpos
  //     }
      
  //     datos = JSON.stringify(datos);
      
      
  //     this.snackBar.open(res.toString(), '', {
  //       duration: 5000,
  //       verticalPosition: 'top'
  //     });
  //     this.apicliente.crearCliente(datos).subscribe(data =>{
        
  //       if (data.status==='success'){
  //         console.log(data.Data.UID);
  //         console.log(data.Data.RFC);
  //         let act;
  //         act = {
  //           "RFC": data.Data.RFC,
  //           "IdApi": data.Data.UID
  //         }
  //         console.log(act);
          
  //         this.service.updateCliente(act).subscribe(res => {
  //           this.snackBar.open(res.toString(), '', {
  //             duration: 5000,
  //             verticalPosition: 'top'
  //           });
  //         });
          
  //       }
  //       else{
  //         console.log(data);
          
  //       }
  //       this.resetForm(form);
  //     })
  //   }
  //   );
  // }
}
