import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { ClientesService } from '../../../../../services/catalogos/clientes.service';
import { NgForm, FormControl } from '@angular/forms';
import { EnviarfacturaService } from 'src/app/services/facturacioncxc/enviarfactura.service';
import Swal from 'sweetalert2';
import {MAT_DIALOG_DATA } from "@angular/material";

import { map, startWith } from 'rxjs/operators';

import { Vendedor } from '../../../../../Models/catalogos/vendedores.model';

import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Cliente } from 'src/app/Models/catalogos/clientes-model';
import { VentasCotizacionService } from '../../../../../services/ventas/ventas-cotizacion.service';

//Registro de eventos
import { DatePipe } from '@angular/common';
import { UsuariosServieService } from '../../../../../services/catalogos/usuarios-servie.service';
import { EventosService } from '../../../../../services/eventos/eventos.service';
import { Evento } from 'src/app/Models/eventos/evento-model';

import { ConnectionHubServiceService } from 'src/app/services/shared/ConnectionHub/connection-hub-service.service';

let origen: { origen: string, titulo: string }[] = [
  {"origen": "Administracion", "titulo": 'Cliente'}
]
let origenNotificacion =[] = [
  {
  "IdNotificacion": 0,
  "Folio": 0,
  "IdUsuario": '',
  "Usuario": '',
  "Mensaje": '',
  "ModuloOrigen": '',
  "FechaEnvio": '',
  "origen": "Administracion", 
  "titulo": 'Cliente',
  "datosExtra": '',
  },
]

@Component({
  selector: 'app-add-cliente',
  templateUrl: './add-cliente.component.html',
  styleUrls: ['./add-cliente.component.css']
})
export class AddClienteComponent implements OnInit {

  constructor(public dialogbox: MatDialogRef<AddClienteComponent>, 
    public router: Router,
    public service: ClientesService, 
    public service2: VentasCotizacionService, 
    private snackBar: MatSnackBar, 
    public apicliente: EnviarfacturaService, 
    private _formBuilder: FormBuilder,
    private usuarioService: UsuariosServieService,
    private datePipe: DatePipe,
    private eventosService: EventosService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private ConnectionHubService: ConnectionHubServiceService,) { }

  ngOnInit() {
    this.ConnectionHubService.ConnectionHub(origen[0]);
    // console.log(this.service2.formprosp);
    // this.service.formData = new Cliente();
    this.usuariosesion = JSON.parse(localStorage.getItem('ProlappSession'));
    this.BodegaInfo = this.data;
    this.movimiento = this.BodegaInfo.movimiento
    this.resetForm();
    this.dropdownRefresh();  
  }

  

  //Forma Pago
  public listFP: Array<any> = [
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
  public listCFDI: Array<any> = [
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

  listVendedores: Vendedor[] = [];
  options: Vendedor[] = [];
  filteredOptions: Observable<any[]>;
  myControl = new FormControl();
  usuariosesion;
  movimiento;
  BodegaInfo;

  datos;
  cliente2;

  private _filter(value: any): any[] {
    console.log(value);
     const filterValue = value.toString().toLowerCase();
     return this.options.filter(option =>
       option.Nombre.toLowerCase().includes(filterValue) ||
       option.IdVendedor.toString().includes(filterValue));
  }

  dropdownRefresh(){
    this.service.getVendedoresList().subscribe(data =>{
      for (let i = 0; i < data.length; i++){
        let vendedor = data[i];
        this.listVendedores.push(vendedor);
        this.options.push(vendedor)
        this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
      }
    });
  }

  onSelectionChange(options:Vendedor, event: any){
    if(event.isUserInput){
      this.service.formDataV.IdVendedor = options.IdVendedor;
      this.service.formDataV.Nombre = options.Nombre;
    }
  }

  resetForm(form?: NgForm) {
    if (this.service.formData.Nombre != null){

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
      NumeroInterior: ''  ,
      NumeroExterior: '',
      ClaveCliente: '',
      Estatus: '',
      LimiteCredito: '',
      DiasCredito: '',
      MetodoPago: '',
      UsoCFDI: '',
      IdApi: '',
      MetodoPagoCliente: '',
      Vendedor: 7
    }

    this.service.formDataV = {
      IdVendedor: 7,
      Nombre: ''
    }
    };
  }

  onClose() {
    this.dialogbox.close(this.service.formData);
    this.service.filter('Register click');
    this.resetForm();
  }

  onSubmit(form: NgForm, ) {
this.movimiento;
    let email;
    let rfc;
    let razon;
    let codpos;

    let datos;
    
   
    email = 'riztekti@gmail.com';
    rfc = this.service.formData.RFC;
    razon = this.service.formData.RazonSocial;
    codpos = this.service.formData.CP;
    datos = {
      "email" : email,
      "razons" : razon,
      "rfc" : rfc,
      "codpos" : codpos
    }
    let temp = Object.assign(this.service.formData)
        this.cliente2 = temp;
    
    this.datos = JSON.stringify(datos);
     this.apicliente.crearCliente(this.datos).subscribe(data =>{
        
       if (data.status==='success'){
        console.log(data);
       /* if (data.status==='suc'){ */

         this.service.formData.IdApi=data.Data.UID
       // this.service.formData.IdApi='';
        this.service.formData.Estatus = 'Activo'
        //
        let datosExtra = this.service.formData.Nombre
        this.ConnectionHubService.generarNotificacion(origenNotificacion[0], datosExtra)
        
        this.service.addCliente(this.service.formData).subscribe(res => {

          this.ConnectionHubService.on(origen[0])
          console.log(res);
          
        this.movimientos(this.movimiento)

        /* this.otrocliente(form) */
          
      Swal.fire({
            icon: 'success',
            title: 'Cliente Agregado',
            text: ''+this.service.formData.RazonSocial+'',
            timer: 1500
          }) 
          
        
        });

        
    
       }
       else{
        Swal.fire({
          icon: 'error',
          title: 'Error al Crear Cliente',
          text: ''+JSON.stringify(data.message)+'',
          timer: 1500
        })
         console.log(data);
        
      }
      //this.resetForm(form);

    })



    
    
  }

  otrocliente(form: NgForm){
  /*   let email;
    let rfc;
    let razon;
    let codpos;
    let datos;
   
    email = 'riztekti@gmail.com';
    rfc = this.service.formData.RFC;
    razon = this.service.formData.RazonSocial;
    codpos = this.service.formData.CP;
    datos = {
      "email" : email,
      "razons" : razon,
      "rfc" : rfc,
      "codpos" : codpos
    } */
    
    //this.datos = JSON.stringify(this.datos);

      this.apicliente.crearCliente2(this.datos).subscribe(data =>{
        
       if (data.status==='success'){
         console.log(data);

         this.cliente2.IdApi=data.Data.UID
        //this.service.formData.IdApi='';
        this.cliente2.Estatus = 'Activo'
        //
        console.log(this.cliente2);
        this.service.addCliente2(this.cliente2).subscribe(res => {
          console.log(res);
          
        this.movimientos(this.movimiento)

         this.otrocliente2(form) 
          
       /*   Swal.fire({
            icon: 'success',
            title: 'Cliente Agregado',
            text: ''+this.service.formData.RazonSocial+'',
            timer: 1500
          })

          this.onClose();*/
          
        }
        );

        
    
       }
       else{
        Swal.fire({
          icon: 'error',
          title: 'Error al Crear Cliente',
          text: ''+JSON.stringify(data.message)+'',
          timer: 1500
        })
         console.log(data);
        
       }
       this.resetForm(form);

     })

  }

  otrocliente2(form: NgForm){
    /*   let email;
      let rfc;
      let razon;
      let codpos;
      let datos;
     
      email = 'riztekti@gmail.com';
      rfc = this.service.formData.RFC;
      razon = this.service.formData.RazonSocial;
      codpos = this.service.formData.CP;
      datos = {
        "email" : email,
        "razons" : razon,
        "rfc" : rfc,
        "codpos" : codpos
      } */
      
      //this.datos = JSON.stringify(this.datos);
  
        this.apicliente.crearCliente3(this.datos).subscribe(data =>{
          
         if (data.status==='success'){
           console.log(data);
  
           this.cliente2.IdApi=data.Data.UID
          //this.service.formData.IdApi='';
          this.cliente2.Estatus = 'Activo'
          //
          console.log(this.cliente2);
          this.service.addCliente3(this.cliente2).subscribe(res => {
            console.log(res);
            
          this.movimientos(this.movimiento)
  
          /* this.otrocliente() */
            
            Swal.fire({
              icon: 'success',
              title: 'Cliente Agregado',
              text: ''+this.service.formData.RazonSocial+'',
              timer: 1500
            })
  
            this.onClose();
            
          }
          );
  
          
      
         }
         else{
          Swal.fire({
            icon: 'error',
            title: 'Error al Crear Cliente',
            text: ''+JSON.stringify(data.message)+'',
            timer: 1500
          })
           console.log(data);
          
         }
         this.resetForm(form);
  
       })
  
    }

  	
  movimientos(movimiento){
    // let event = new Array<Evento>();
    let u = this.usuariosesion.user
    let fecha = new Date();
    
    let evento = new Evento();
    this.usuarioService.getUsuarioNombreU(u).subscribe(res => {
    let idU=res[0].IdUsuario

    evento.IdUsuario = idU
    evento.Autorizacion = '0'
    evento.Fecha = this.datePipe.transform(fecha, 'yyyy-MM-dd, h:mm:ss a');
    evento.Movimiento = movimiento
    
    console.log(evento);
    this.eventosService.addEvento(evento).subscribe(respuesta =>{
      console.log(respuesta);
    })
    })
  }


  
  // onSubmit(form: NgForm) {
  //   //
  //   let email;
  //   let rfc;
  //   let razon;
  //   let codpos;
  //   let datos;
  //  
    

      
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
