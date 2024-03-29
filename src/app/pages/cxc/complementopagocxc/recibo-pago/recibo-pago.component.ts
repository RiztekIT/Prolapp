import { Component, OnInit, ViewChild } from '@angular/core';

import { ReciboPagoService } from '../../../../services/complementoPago/recibo-pago.service';

import { Router } from '@angular/router';

import { NgForm, FormControl } from '@angular/forms';

import { ReciboPago } from '../../../../Models/ComplementoPago/recibopago';

import { Observable, empty, timer } from 'rxjs';

import { Cliente } from 'src/app/Models/catalogos/clientes-model';

//Importacion Angular Material Tables and Sort

import { MatTableDataSource, MatSort, NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';

//Importacion para utilizar Pipe de DropDown Clientes

import { map, startWith } from 'rxjs/operators';

import { Factura } from 'src/app/Models/facturacioncxc/factura-model';

import { PagoCFDI } from '../../../../Models/ComplementoPago/pagocfdi';

//Importacion Modal

import { MatDialog, MatDialogConfig } from '@angular/material';

//Importacion Edit Pago CFDI

import { PagoCFDIEditComponent } from '../pago-cfdi-edit/pago-cfdi-edit.component';

import { pagoTimbre } from 'src/app/Models/ComplementoPago/pagotimbre';

import { TipoCambioService } from 'src/app/services/tipo-cambio.service';

import { CurrencyPipe } from '@angular/common';

import { EnviarfacturaService } from 'src/app/services/facturacioncxc/enviarfactura.service';

import Swal from 'sweetalert2';

import { ngxLoadingAnimationTypes } from 'ngx-loading';

import { FoliosService } from 'src/app/services/direccion/folios.service';

import { FacturaService } from 'src/app/services/facturacioncxc/factura.service';

import * as html2pdf from 'html2pdf.js';

import { ComplementoPagoComponent } from 'src/app/components/complemento-pago/complemento-pago.component';

import { MessageService } from 'src/app/services/message.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { EmailComponent } from 'src/app/components/email/email/email.component';

import { NotaCreditoService } from 'src/app/services/cuentasxcobrar/NotasCreditocxc/notaCredito.service';

import { ClassGetter } from '@angular/compiler/src/output/output_ast';
// import { MatDialogRef } from '@angular/material';

import { ConnectionHubServiceService } from './../../../../services/shared/ConnectionHub/connection-hub-service.service';


let origenNotificacion =[] = [
  {
  "IdNotificacion": 0,
  "Folio": 0,
  "IdUsuario": '',
  "Usuario": '',
  "Mensaje": '',
  "ModuloOrigen": '',
  "FechaEnvio": '',
  "origen": "Cxc", 
  "titulo": 'Complemento',
  "datosExtra": '',
  },
]


let origen: { origen: string, titulo: string }[] = [
  {"origen": "Cxc", "titulo": 'Complemento'}
]


const httpOptions = {
  headers: new HttpHeaders({
    // 'Bmx-Token': '19b7c18b48291872e37dbfd89ee7e4ea26743de4777741f90b79059950c34544',
    'Bmx-Token': '410db2afc39118c6917da0778cf81b6becdf5614dabd10b92815768bc0a87e26',
    //'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Headers': 'Bmx-Token, Accept, Accept-Encoding, Content-Type, Origin',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'

  })
  
}

/* Constante y variables para la transformacion de los meses en los datetimepicker */
// const months =['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DIC'];
const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
export class AppDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      return `${day}/${months[month]}/${year}`
    }
    return date.toDateString();
  }
}

export const APP_DATE_FORMATS =
{
  parse: {
    dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
  },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'numeric' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  }
};
/* ----------------------------------------- */

@Component({
  selector: 'app-recibo-pago',
  templateUrl: './recibo-pago.component.html',
  styleUrls: ['./recibo-pago.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class ReciboPagoComponent implements OnInit {
  banco;
  banco2;
  banco3;
  folioparam;
  xmlparam;
  idparam;
  clienteLogin;
  json1 = new pagoTimbre();
  conceptos : any;
  fecha2;
  fechaapi;
  index;
  Cdolar: string;
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  FechaPago;

  fileUrl;
  a = document.createElement('a');
  public loading2 = false;

  

  constructor(public _MessageService: MessageService,
    public service: ReciboPagoService, 
    private router: Router, 
    private dialog: MatDialog,
    private tipoCambio:TipoCambioService,
    private currencyPipe: CurrencyPipe,
    public servicetimbrado:EnviarfacturaService, 
    public servicefolios: FoliosService, 
    public servicefactura: FacturaService,
    private http : HttpClient, 
    public notacreditService: NotaCreditoService,
    private ConnectionHubService: ConnectionHubServiceService, ) {
    this.service.listen().subscribe((m:any)=>{
      // console.log(m);
      this.refreshPagoCFDITList();
      });
   

      /* Metodo para obtener el tipo de cambio y ponerlo en la variable a usar */
  // this.traerApi().subscribe(data => {
    
  // })


  }

  ngOnInit() {
    
 /*    this.ConnectionHubService.ConnectionHub(origen[0]); */
    this.service.rfcempresa = this.servicefactura.rfcempresa
    console.log(localStorage.getItem("inicioCliente"));
    this.clienteLogin = localStorage.getItem("inicioCliente");
    this.CleanPagoCFDI();
    this.Inicializar();
    this.RP();
    this.dropdownRefresh();
    this.refreshPagoCFDITList();
    this.setpagoTimbre();
    console.log(this.servicefactura.rfcempresa)
    
    // this.tCambio();
    
    // this.tipoDeCambio();

    
    // this.ClienteDefault();
    //^ **** PRIVILEGIOS POR USUARIO *****
    this.obtenerPrivilegios();
    //^ **** PRIVILEGIOS POR USUARIO *****

  }

    
    
    //^ **** PRIVILEGIOS POR USUARIO *****
    privilegios: any;
    privilegiosExistentes: boolean = false;
    modulo = 'Cuentas por Cobrar';
    area = 'Complemento de Pago';
  
    //^ VARIABLES DE PERMISOS
    Guardar: boolean = false;
    GuardarTimbrar: boolean = false;
    JSON: boolean = false;
    //^ VARIABLES DE PERMISOS
  
  
    obtenerPrivilegios() {
      let arrayPermisosMenu = JSON.parse(localStorage.getItem('Permisos'));
      console.log(arrayPermisosMenu);
      let arrayPrivilegios: any;
      try {
        arrayPrivilegios = arrayPermisosMenu.find(modulo => modulo.titulo == this.modulo);
        // console.log(arrayPrivilegios);
        arrayPrivilegios = arrayPrivilegios.submenu.find(area => area.titulo == this.area);
        // console.log(arrayPrivilegios);
        this.privilegios = [];
        arrayPrivilegios.privilegios.forEach(element => {
          this.privilegios.push(element.nombreProceso);
          this.verificarPrivilegio(element.nombreProceso);
        });
        // console.log(this.privilegios);
      } catch {
        console.log('Ocurrio algun problema');
      }
    }
  
    verificarPrivilegio(privilegio) {
      switch (privilegio) {
        case ('Guardar'):
          this.Guardar = true;
          break;
        case ('Guardar y Timbrar'):
          this.GuardarTimbrar = true;
          break;
        case ('JSON'):
          this.JSON = true;
          break;
        default:
          break;
      }
    }
    //^ **** PRIVILEGIOS POR USUARIO *****

  

  tCambio(){
    this.tipoCambio.TC();
    this.tipoCambio.getTc().subscribe((data:any)=>{
      console.log(data);

      this.Cdolar = data;
      console.log(this.Cdolar);
      
      this.service.formData.TipoCambio = this.currencyPipe.transform(this.Cdolar,'','symbol','1.4-4');
      console.log(this.service.formData.TipoCambio);
    })

  }
  //Checar si el Id es el Default
  ClienteDefault(){
    // console.log('CHECHANDO EL CLIENTE');
    if(this.service.formData.IdCliente == 0){
      console.log('CLIENTE DEFAULT');
    }else{
      console.log('ACTUALIZANDO DROPDOWN2');
      this.dropdownRefresh2(this.service.formData.IdCliente);
    }
  }
  //Variable Estatus del Recibo Pago
  Estatus: string;
  //Variable IdRecibo
  IdReciboPago: any;
  //Control para Search/Lista de Clientes 
  myControl = new FormControl();
  options: Cliente[] = [];
  filteredOptions: Observable<any[]>;
  listClientes: Cliente[] = [];
  //Control Search/Lista de Facturas en base a IdClient
  myControl2 = new FormControl();
  options2: any[] = [];
  filteredOptions2: Observable<any[]>;
  FacturaList: Factura[] = [];
  //Variables Saldo, Total, Cantidad
  //Cantidad Total ingresado al momento de hacer el pago
  Cantidad: number;
  //Cantidad a pagar de cierta Factura
  CantidadF: number;
  //Total 
  TotalF: number;
  TotalFFormat;
  //Saldo que tiene Cierto Recibo de Pago
  Saldo: number;
  
  //Saldo Restante de la Factura
  SaldoF: number;
  SaldoFFormat
  //Nuevo Saldo Factura
  SaldoNuevo: number;
  SaldoNuevoFormat;
  //Nombre del Cliente a Facturar 
  ClienteNombre: any;
  //Id De la Factua
  IdFactura: number;
  //NoParcialidad 
  NoParcialidad: string;
  //TRUE = NUEVO RECIBO PAGO - FALSE = NO NUEVO RECIBO PAGO
  Nuevo: boolean;
   //Arreglo de los pagosCFDI
   CFDI: any;
   //Total de la Factura
   Total: any;

   Moneda: string;





  //Informacion para tabla de productos
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['FolioFactura', 'Cantidad', 'SaldoPendiente', 'NoParcialidad', 'Options'];
  @ViewChild(MatSort, null) sort: MatSort;


  //Iniciar Valores de los campos de Cierto Recibo Pago
  Inicializar() {
    //Obtener Id del Recibo del pago guardado en el local storage
    this.IdReciboPago = localStorage.getItem('IdRecibo');
    +this.IdReciboPago;
    // console.log(this.IdReciboPago);
    this.service.getReciboId(this.IdReciboPago).subscribe(res => {
      this.service.formData = res[0];
      // this.tCambio();
      console.log(this.service.formData);
      this.Estatus = this.service.formData.Estatus;


      //OBTENER LA INFORMACION DEL CLIENTE, EN ESPECIFICO EL NOMBRE DEL CLIENTE PARA PINTARLO EN EL FORMULARIO
      if (this.service.formData.IdCliente!=0){
      this.service.getFacturaClienteID(this.service.formData.IdCliente).subscribe(res => {
        console.log(res);
        this.json1.Receptor.UID = res[0].IdApi;
        this.ClienteNombre = res[0].Nombre;
      });
    }

      
   
   
    });
  }


  //Limipiar PagoCFDI
  CleanPagoCFDI(){
    this.service.formDataPagoCFDI.IdFactura = 0;
    this.CantidadF = 0;
    this.TotalF = 0;
    this.SaldoF = 0;
    this.SaldoNuevo = 0;
    this.TotalFFormat = 0;
    this.SaldoFFormat = 0;
    this.SaldoNuevoFormat = 0;
  }

  //Lista Clientes
  dropdownRefresh() {
    this.service.getDepDropDownValues().subscribe((data) => {
      for (let i = 0; i < data.length; i++) {
        let client = data[i];
        this.listClientes.push(client);
        this.options.push(client)
        this.filteredOptions = this.myControl.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(value))
          );
      }
    });

  }

  //Verificar si ya existen o no PAGOS CFDI previos
  RP(){
//     this.service.getReciboPagosCFDI(this.IdReciboPago).subscribe(data => {
//       if (data.length > 0){
//         console.log('CFDI EXISTENTES');
// this.Nuevo = false;
//       }else{
//         console.log('CFDI NUEVO');
// this.Nuevo  = true;
//       }
//     })
this.Nuevo = true
  }

  //Lista Facturas por IdClient
  dropdownRefresh2(idCliente) {
    this.options2 = [];
    //Checar si hay PAGOS CFDI
    console.log(this.Nuevo + 'VARIABLE NUEVOOOOOOOOO');
    // this.service.getReciboPagosCFDI(this.IdReciboPago).subscribe(data => {

      //Si hay pagosCFDI, se hara un select con condiciones de los PAGOSCFDI existentes
      if (this.Nuevo == false){
// console.log('YA HAYYYYY CFDIISISISISISIS');
//     console.log(idCliente+ 'Este es el IDCliente');
//     this.service.getFacturaPagoCFDI(idCliente).subscribe((data) => {
//       console.log(data);
//       if (data) {
//         for (let i = 0; i < data.length; i++) {
//           let facturaPagoCFDI = data[i];
//           this.FacturaList.push(facturaPagoCFDI);
//           this.options2.push(facturaPagoCFDI)
//           // console.log(this.options2);
//           this.filteredOptions2 = this.myControl2.valueChanges
//             .pipe(
//               startWith(''),
//               map(value => this._filter2(value))
//             );
//         }
//       }else{
//         console.log("No hay Facturas Correspondientes al Cliente");
//         this.options2 = [];
//       }
//     });

//Si no hay pagos CFDI, solo se verifica que la factura este Timbrada y con cuerde con el IdCliente
  }else{
console.log('NUEVO CFDIIIIIIIIIII');
    this.service.getFacturaPrimerPagoCFDI(idCliente).subscribe((data) => {
      console.log(data);
      if (data) {
        for (let i = 0; i < data.length; i++) {
          //this.service.formData.Moneda = data[i].Moneda;


          if (data[i].Moneda==='MXN'){
          this.service.getFacturaPagoCFDI(idCliente,data[i].Folio).subscribe((data2) => {
            console.log(data2);
            if (data2.length>0){
              console.log(this.IdReciboPago); 
              console.log(data2[0].IdReciboPago); 
              if (this.IdReciboPago!=data2[0].IdReciboPago){
                this.options2.push(data2[0])
              }
            }else{
              let facturaPagoCFDI = data[i];
              this.FacturaList.push(facturaPagoCFDI);
              this.options2.push(facturaPagoCFDI)
            }
          })
        }
        if (data[i].Moneda==='USD'){
          this.service.getFacturaPagoCFDIDlls(idCliente,data[i].Folio).subscribe((data2) => {
            console.log(data2);
            if (data2.length>0){
              console.log(this.IdReciboPago); 
              console.log(data2[0].IdReciboPago); 
              if (this.IdReciboPago!=data2[0].IdReciboPago){
                this.options2.push(data2[0])
              }
            }else{
              let facturaPagoCFDI = data[i];
              this.FacturaList.push(facturaPagoCFDI);
              this.options2.push(facturaPagoCFDI)
            }
          })
        }


          console.log(this.options2);
          this.filteredOptions2 = this.myControl2.valueChanges.pipe(startWith(''),map(value => this._filter2(value)));
        }
      }else{
        console.log("No hay Facturas Correspondientes al Cliente");
        this.options2 = [];
      }
    });

  }

  // });

  }

  refreshPagoCFDITList(){
    this.service.getReciboPagosCFDI(this.IdReciboPago).subscribe(data => {
      console.log(data);
      this.conceptos = data;
         if (data.length > 0){
           this.Saldo = 0;
           for (let i=0; i<data.length; i++){
            //  console.log(i);
            //  console.log(data[i].Cantidad);
             this.Saldo = ((this.Saldo) + (+data[i].Cantidad)); 
           }
           this.Saldo = +this.service.formData.Cantidad - this.Saldo;
           if (this.Saldo<=0.00001){
             this.Saldo=0
           }
          //  console.log('SI HAY VALORES');
          //  console.log(this.service.formData.IdCliente);
           (<HTMLInputElement> document.getElementById("ClaveCliente")).disabled = true;
          //  console.log(data);
           this.listData = new MatTableDataSource(data);
           this.listData.sort = this.sort;
           this.dropdownRefresh2(this.service.formData.IdCliente);
      }else{
        // console.log('No hay valores');
        this.Saldo = +this.service.formData.Cantidad;
        this.listData = new MatTableDataSource(data);
           this.listData.sort = this.sort;
        this.dropdownRefresh2(this.service.formData.IdCliente);
      }
      console.log(this.Saldo);
    });
  }

  //Filter Clientes
  private _filter(value: any): any[] {
    // console.log(value);
    const filterValue = value.toString().toLowerCase();
    return this.options.filter(option =>
      option.Nombre.toLowerCase().includes(filterValue) ||
      option.ClaveCliente.toString().includes(filterValue));
  }
  //Filter Facturas por Folio
  private _filter2(value: any): any[] {
    // console.log(value);
    const filterValue2 = value.toString();
    return this.options2.filter(option =>
      option.Folio.toString().includes(filterValue2));
  }

  borrarfact(id:any){
    //console.log(this.options2);
    this.options2.splice(id,1);
    //console.log(this.options2);
    this.filteredOptions2 = this.myControl2.valueChanges.pipe(startWith(''),map(value => this._filter2(value)));
    
  }

  onSelectionChange(cliente: any, event: any) {

    if (event.isUserInput) {
      console.log('ON CHANGEEEEE');
      console.log(cliente);
      console.log('FORM DATA');
      console.log(this.service.formData);
      //Limpiar arreglo de Facturas dependiendo del cliente
      this.options2 = [];
      this.service.formData.IdCliente = cliente.IdClientes;
      console.log(this.service.formData.IdCliente);
      this.dropdownRefresh2(this.service.formData.IdCliente);
      this.json1.Receptor.UID = cliente.IdApi;
      this.ClienteNombre = cliente.Nombre;
    }


  }
  onBlurCliente(){
    console.log(this.service.formData);
    this.service.updateReciboPago(this.service.formData).subscribe(data =>{
      this.dropdownRefresh2(this.service.formData.IdCliente);
      console.log(data);
      console.log(this.service.formData);
    })
  }

  onBlur(){
    // console.log("YA DEJO DE ESCRIBIR");
    this.service.updateReciboPago(this.service.formData).subscribe(data =>{
      console.log(data);
      this.refreshPagoCFDITList();
    })
  }

  onSelectionChange2(factura: any, event: any, i: any) {
    if (event.isUserInput) {

    this.notacreditService.getNotaCreditoFacturaID(factura.Id).subscribe(data=>{
      //console.clear();
      console.log(data)
      console.log('facura', factura);
      console.log(event);
      console.log('form',this.service.formData.Moneda);
      this.index = i;

      let notascreditototal = 0;
      let notascreditototaldlls = 0;
      if (data.length>0){

        if(this.service.formData.Moneda==='MXN'){
          for (let j=0;j<data.length; j++){
            notascreditototal = +notascreditototal + +data[j].Total;
            
          }
        }else if(this.service.formData.Moneda==='USD'){
          for (let j=0;j<data.length; j++){
            console.log('for dlls',data[j].TotalDlls);
          notascreditototal = +notascreditototal + +data[j].TotalDlls;
          }
        }

        console.log('NOTAS',notascreditototal);
        //console.log(i);

        

        if( factura.IdCliente == 0 || !factura.IdCliente){
          console.log('PAGOS CFDI EXISTENTES');
          this.TotalF = +factura.Total;
          this.SaldoF = +factura.Saldo - +notascreditototal;
          this.IdFactura = factura.Id;
        }else{
          if(this.service.formData.Moneda==='MXN'){
          console.log('NUEVO PAGO CFDI');
          this.TotalF = +factura.Total;
          this.SaldoF = +factura.Total - +notascreditototal;
          this.IdFactura = factura.Id;
        }
              if(this.service.formData.Moneda==='USD'){
          console.log('NUEVO PAGO CFDI');
          this.TotalF = +factura.TotalDlls;
          this.SaldoF = +factura.TotalDlls - +notascreditototal;
          this.IdFactura = factura.Id;
        }
  
        }



      }else{

        if( factura.IdCliente == 0 || !factura.IdCliente){
          console.log('PAGOS CFDI EXISTENTES');
          this.TotalF = +factura.Total;
          this.SaldoF = +factura.Saldo;
          this.IdFactura = factura.Id;
        }else{
          if(this.service.formData.Moneda==='MXN'){
          console.log('NUEVO PAGO CFDI');
          this.TotalF = +factura.Total;
          this.SaldoF = +factura.Total;
          this.IdFactura = factura.Id;
        }
              if(this.service.formData.Moneda==='USD'){
          console.log('NUEVO PAGO CFDI');
          this.TotalF = +factura.TotalDlls;
          this.SaldoF = +factura.TotalDlls;
          this.IdFactura = factura.Id;
        }
  
        }

      }
     
   
     
      
      
      console.log(this.TotalF);
      this.TotalFFormat = this.currencyPipe.transform(this.TotalF)
      console.log(this.TotalFFormat);
      this.SaldoFFormat = this.currencyPipe.transform(this.SaldoF)
  
      
   
    })

  }
  }



  onChangeCantidad(Cantidad: Event) {
    this.Cantidad = +Cantidad;
    // this.refreshPagoCFDITList();
  }


  onChangeCantidadF(CantidadF: any) {
    // console.log(this.CantidadF);
    //Obtener el valor que se ingresa en cierto input en la posicion 0
    let elemHTML: any = document.getElementsByName('Cantidad2')[0];
    //Transformar la Cantidad en entero e igualarlo a la variable CantidadF

    this.CalcularCantidades(CantidadF);

    elemHTML.value = this.CantidadF;
    // console.log(this.CantidadF);
  }

  //
  CalcularCantidades(CantidadF: any){
    this.CantidadF = +CantidadF;
    console.log('ESTE ES EL SALDO AL CAMBIAR LAS CANTIDADES');
    console.log(this.Saldo);
    // console.log(this.CantidadF);
// this.Saldo = this.CantidadF;
    if (this.CantidadF > this.Saldo) {
      this.CantidadF = this.Saldo;
      if (this.CantidadF >= this.SaldoF) {
        this.CantidadF = this.SaldoF;
      }
    } else if (this.CantidadF > this.SaldoF) {
      this.CantidadF = this.SaldoF;
    } else if (this.CantidadF <= 0) {
      this.CantidadF = 0;
    }
    this.SaldoNuevo = this.SaldoF - this.CantidadF;
    this.SaldoFFormat = this.currencyPipe.transform(this.SaldoNuevo);
  }


   /* list Metodo Pago */
   public listMoneda: Array<any> = [
    { Moneda: 'MXN' },
    { Moneda: 'USD' }
  ];

  /* lista de Bancos*/
  public listbancos: Array<any> = [
    { banco: 'SANTANDER', cuenta:"014150655040229899"},
    { banco: 'HSBC', cuenta:"021150040537518226"},
    { banco: 'HSBC DLLS', cuenta:"021150070030383384"},
    { banco: 'SANTANDER DLLS', cuenta:"014150825007240214"},
    { banco: 'BANCOMER', cuenta:"012150001119448432"},
    { banco: 'BANCOMER DLLS', cuenta:"012150001119942475"}
  ]
  public listbancos2: Array<any> = [
    { banco: 'BANORTE', cuenta:"072150004619216703"},
    { banco: 'SANTANDER', cuenta:"014150655081955339"},
    { banco: 'BANCOMER', cuenta:"012150001158942041"},
    { banco: 'BANORTE DLLS', cuenta:"072150011196871531"},
    { banco: 'SANTANDER DLLS', cuenta:"014150825009889589"},
    { banco: 'BANCOMER DLLS', cuenta:"012150001159680386"}
    
  ]
  public listbancos3: Array<any> = [
    { banco: 'SANTANDER', cuenta:"014150655087979539"},
    { banco: 'SANTANDER DLLS', cuenta:"014150825010549151"},
    { banco: 'BANCOMER', cuenta:"012150001182050789"},
    { banco: 'BANCOMER DLLS', cuenta:"012150001182545168"},
  
    
  ]

  MonedaSelected(event: any) {
    this.Moneda = event.target.selectedOptions[0].text;
    this.service.formData.Moneda = this.Moneda;
    this.change(this.service.formData.FechaPago);
  }

  BancoSelected(event:any){
    if (event.target.selectedOptions[0].text==='SANTANDER'){
      this.service.formData.Cuenta = '014150655040229899'
    }
    if (event.target.selectedOptions[0].text==='HSBC'){
      this.service.formData.Cuenta = '021150040537518226'
    }
    if (event.target.selectedOptions[0].text==='HSBC DLLS'){
      this.service.formData.Cuenta = '021150070030383384'
    }
    if (event.target.selectedOptions[0].text==='SANTANDER DLLS'){
      this.service.formData.Cuenta = '014150825007240214'
    }
    if (event.target.selectedOptions[0].text==='BANCOMER'){
      this.service.formData.Cuenta = '012150001119448432'
    }
    if (event.target.selectedOptions[0].text==='BANCOMER DLLS'){
      this.service.formData.Cuenta = '012150001119942475'
    }
  }

  BancoSelected2(event:any){
    if (event.target.selectedOptions[0].text==='BANORTE'){
      this.service.formData.Cuenta = '072150004619216703'
    }
    if (event.target.selectedOptions[0].text==='SANTANDER'){
      this.service.formData.Cuenta = '014150655081955339'
    }
    if (event.target.selectedOptions[0].text==='BANCOMER'){
      this.service.formData.Cuenta = '012150001158942041'
    }
    if (event.target.selectedOptions[0].text==='BANORTE DLLS'){
      this.service.formData.Cuenta = '072150011196871531'
    }
    if (event.target.selectedOptions[0].text==='SANTANDER DLLS'){
      this.service.formData.Cuenta = '014150825009889589'
    }
    if (event.target.selectedOptions[0].text==='BANCOMER DLLS'){
      this.service.formData.Cuenta = '012150001159680386'
    }
    
  }

  BancoSelected3(event:any){
  /*   if (event.target.selectedOptions[0].text==='BANORTE'){
      this.service.formData.Cuenta = '072150004619216703'
    } */
    if (event.target.selectedOptions[0].text==='SANTANDER'){
      this.service.formData.Cuenta = '014150655087979539'
    }
    if (event.target.selectedOptions[0].text==='SANTANDER DLLS'){
      this.service.formData.Cuenta = '014150825010549151'
    }
    if (event.target.selectedOptions[0].text==='BANCOMER'){
      this.service.formData.Cuenta = '012150001182050789'
    }
    if (event.target.selectedOptions[0].text==='BANCOMER DLLS'){
      this.service.formData.Cuenta = '012150001182545168'
    }
  /*   if (event.target.selectedOptions[0].text==='BANCOMER'){
      this.service.formData.Cuenta = '012150001158942041'
    }
    if (event.target.selectedOptions[0].text==='BANORTE DLLS'){
      this.service.formData.Cuenta = '072150011196871531'
    }
    if (event.target.selectedOptions[0].text==='SANTANDER DLLS'){
      this.service.formData.Cuenta = '014150825009889589'
    }
    if (event.target.selectedOptions[0].text==='BANCOMER DLLS'){
      this.service.formData.Cuenta = '012150001159680386'
    } */
    
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

  ObtenerTotalFactura(){

  }

  //Editar PagoCFDI
  onEditCFDI(pagoCFDI: any) {
    console.log(pagoCFDI);
    this.service.formDataPagoCFDIEdit = pagoCFDI;
    this.service.SaldoComplementoPago = this.Saldo + +pagoCFDI.Cantidad;
    this.service.SaldoFactura = +pagoCFDI.Saldo;
    console.log(this.service.formDataPagoCFDI);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    this.dialog.open(PagoCFDIEditComponent, dialogConfig);

  }
   //Obtener el total de la factura
   getTotal(id){
    //Obtener el total de la Factura
    this.service.getTotalFactura(id).subscribe(data => {
     this.Total = data[0].Total
   });
     }

  //Eliminar PagoCFDI
  onDeletePagoCFDI(CFDI: any) {

    Swal.fire({
      title: '¿Segur@ de Borrar Pago CFDI?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
       
        this.getTotal(CFDI.IdFactura);
        console.log(CFDI);
        //Borrar pagoCFDI
        this.service.deletePagoCFDI(CFDI.Id).subscribe(res =>{
          
        console.log(res);
        
        this.service.getPagoCFDIFacturaID(CFDI.IdFactura).subscribe(data => {
          this.CFDI = data;
          let SaldoP = this.Total
          let NoP = 0
          console.log(data);
          
          for (let i=0; i<data.length; i++){
            this.CFDI[i].Saldo = SaldoP - +this.CFDI[i].Cantidad;
            SaldoP = SaldoP - +this.CFDI[i].Cantidad;
            NoP = NoP + 1
            this.CFDI[i].NoParcialidad = NoP.toString();
            this.service.updatePagoCFDI(this.CFDI[i]).subscribe(res =>{
              console.log(res);
            });
          }
          console.log(this.CFDI);
        });
        
    /*     this.ConnectionHubService.on(origen[0]); */
        this.refreshPagoCFDITList();
        Swal.fire({
          title: 'Borrado',
          icon: 'success',
          timer: 1000,
          showCancelButton: false,
          showConfirmButton: false
        });
      
        });
      }
    })
   

  }

  ObtenerNoParcialidad(){
    this.service.getNoParcialidad(this.IdFactura).subscribe(data =>{
      console.log(data);
      if(data[0].NoParcialidad == null){
        console.log('PARCIALIDAD NULL');
        this.service.formDataPagoCFDI.NoParcialidad = '1';
      }else{
        console.log('PACIALIDAD EXISTENTE');
        this.service.formDataPagoCFDI.NoParcialidad = data[0].NoParcialidad.toString();
      }
    })
  }

  //Metodo que se activara cuando se alla deja de manipular el campo Folio Factua
  onBlurFolio(){
    console.log(this.IdFactura);
    if (this.IdFactura>0){
    this.ObtenerNoParcialidad();
   console.log(this.service.formDataPagoCFDI);
  }
  }
  
  onAddCFDI() {
    // this.ObtenerNoParcialidad();
    this.Saldo = this.Saldo - this.CantidadF;
    this.service.formDataPagoCFDI.IdReciboPago = this.IdReciboPago;
    this.service.formDataPagoCFDI.IdFactura = this.IdFactura;
    this.service.formDataPagoCFDI.UUID = "";
    this.service.formDataPagoCFDI.Cantidad = this.CantidadF.toString();
    // this.service.formDataPagoCFDI.NoParcialidad = this.NoParcialidad;
    this.service.formDataPagoCFDI.Saldo = this.SaldoNuevo.toString();
    console.log(this.service.formDataPagoCFDI);
      this.service.addPagoCFDI(this.service.formDataPagoCFDI).subscribe(res =>{
        this.options2 = [];
        
   /*      this.ConnectionHubService.on(origen[0]); */
        this.CleanPagoCFDI();
        this.refreshPagoCFDITList();
        // this.borrarfact(this.index);
        console.log(res);
      })
    
  }
  //Regresar a la pagina anterior
  Regresar() {
    //Remover el IdRecibo el local storage
    localStorage.removeItem('IdRecibo');
    if (this.clienteLogin == 'true') {
      this.router.navigateByUrl('/complementodepago');
      
    } else {
      
      this.router.navigateByUrl('/complementopagoCxc');
    }
  }

  //Metodo Disparado al momento de hacer submit el cual recibe los valors del form como parametro
  onSubmit() {
    this.service.formData.Cantidad = parseFloat(this.service.formData.Cantidad).toFixed(2);
    this.service.formData.Estatus = 'Guardada';
    this.service.formData.TipoCambio = this.service.tipoCambioPago
    console.log(this.service.formData)
    this.service.updateReciboPago(this.service.formData).subscribe(data =>{
      this.Estatus = this.service.formData.Estatus;
      
 /*      this.ConnectionHubService.generarNotificacion(origenNotificacion[0])
      this.ConnectionHubService.on(origen[0]); */
      console.log(data);
      this.refreshPagoCFDITList();
    })
    
  }


  /* Metodos para Timbrado */
  setpagoTimbre(){

    this.json1 = {
      Receptor: {
        UID: '',
    },
    TipoCfdi:'',
    Conceptos:[
        {
            ClaveProdServ:'',
            Cantidad:'',
            ClaveUnidad:'',
            Descripcion:'',
            ValorUnitario:'',
            Importe:'',
            Complemento:[
              {
                  typeComplement:'',
                  FechaPago:'',
                  FormaDePagoP:'',
                  MonedaP:'',
                  Monto:'',
                  relacionados:[
                  ]
              }
          ]
        }
    ],
    UsoCFDI:'',
    Serie:'',
    Moneda:'',
   
    }
    
  }

 



  crearJSON(){
    let datos : any = this.service.formData
    let relacionados = new Array<any>();
    this.conceptos = this.listData.filteredData;
    console.log(datos);
    this.change(this.service.formData.FechaPago);
    
    this.json1.TipoCfdi = 'pago';
    this.json1.UsoCFDI = "P01";
    //this.json1.Serie = "6390";
     
     if (this.servicetimbrado.empresa.RFC==='PLA11011243A'){

      this.json1.Serie = "358668";
    }
    else if (this.servicetimbrado.empresa.RFC==='AIN140101ME3'){
      
      this.json1.Serie = "421147";
    }
    else if (this.servicetimbrado.empresa.RFC==='DTM200220KRA'){
      
      this.json1.Serie = "558457";
    }
    this.json1.Moneda = 'XXX';
    console.log(this.json1.Receptor.UID);
// console.log(this.conceptos);
    // this.json1.Receptor.UID = datos.IdApi; LISTO
    for (let i = 0; i< this.conceptos.length; i++){
      relacionados.push({
      "IdDocumento": this.conceptos[i].UUID1,
      // "IdDocumento": '81F3E693-0B77-4D67-B4EC-9DCF4B06DF17',
      "MonedaDR" : this.conceptos[i].Moneda,
      "TipoCambioDR" : parseFloat(this.service.tipoCambioPago).toFixed(4),
      "MetodoDePagoDR" : "PPD",
      "NumParcialidad" : this.conceptos[i].NoParcialidad,
      "ImpSaldoAnt" : (parseFloat(this.conceptos[i].Saldo) + parseFloat(this.conceptos[i].Cantidad)).toFixed(2),
      "ImpPagado": parseFloat(this.conceptos[i].Cantidad).toFixed(2),
      "ImpSaldoInsoluto": parseFloat(this.conceptos[i].Saldo).toFixed(2)
      })
    }
    this.json1.Conceptos.pop();
    this.json1.Conceptos.push({
      "ClaveProdServ" : "84111506",
      "Cantidad" : "1",
      "ClaveUnidad" : "ACT",
      "Descripcion" : "Pago",
      "ValorUnitario" : "0",
      "Importe" : "0",
      "Complemento":[{
        "typeComplement" : "pagos",
        "FechaPago" : this.fecha2,
        "FormaDePagoP": this.service.formData.FormaPago,
        "MonedaP" : 'MXN',
        "Monto" : parseFloat(this.service.formData.Cantidad).toFixed(2),
        "relacionados" : relacionados
      }]
    });

    
    //  console.log(relacionados);
    console.clear();
     console.log(JSON.stringify(this.json1));

     if(this.json1.Conceptos[0].Complemento[0].relacionados[0].ImpSaldoInsoluto=='0.00'){
       console.log(this.json1.Conceptos[0].Complemento[0].relacionados[0].IdDocumento);
      this.servicefactura.updatePagadaFactura(this.json1.Conceptos[0].Complemento[0].relacionados[0].IdDocumento).subscribe(data =>{
        console.log(data);
      })

     }
    

    
  }
  
  onTimbrar(){
    this.loading = true;
    this.onSubmit();
    this.crearJSON();
    
    console.log(JSON.stringify(this.json1));
    this.servicetimbrado.timbrarPago(JSON.stringify(this.json1)).subscribe(data=>{
      console.log(data);
      if (data.response === 'success') {
        let datos : any = this.service.formData        
        this.service.formData.FechaExpedicion =  new Date();        
        
        this.service.formData.Moneda = datos.Moneda;
        
        
        
        this.service.formData.UUID = data.UUID;
        
        this.service.formData.Certificado ='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';
        this.service.formData.NoCertificado ='00001000000403628664';
        
        this.service.formData.CadenaOriginal ='||' + data.SAT.Version + '|' + data.SAT.UUID + '|' + data.SAT.FechaTimbrado + '|LSO1306189R5|' + data.SAT.SelloCFD + '|' + data.SAT.NoCertificadoSAT + '||';
        this.service.formData.SelloDigitalSAT =data.SAT.SelloSAT;
        this.service.formData.SelloDigitalCFDI =data.SAT.SelloCFD;
        this.service.formData.NoSelloSAT =data.SAT.NoCertificadoSAT;
        this.service.formData.RFCPAC ='LSO1306189R5';
        this.service.formData.Estatus ='Timbrada';
        this.service.formData.folio = data.INV.Folio;
        
        this.Estatus = this.service.formData.Estatus;

console.log(this.json1);
    this.service.updateReciboPago(this.service.formData).subscribe(data =>{
      for (let i = 0; i < this.json1.Conceptos[0].Complemento[0].relacionados.length; i++){
        console.log(this.json1.Conceptos[0].Complemento[0].relacionados[i].ImpSaldoInsoluto);
        if(this.json1.Conceptos[0].Complemento[0].relacionados[i].ImpSaldoInsoluto=='0.00'){
          this.servicefactura.updatePagadaFactura(this.json1.Conceptos[0].Complemento[0].relacionados[i].IdDocumento).subscribe(data =>{
            console.log(data);
          })
        }
      }
      console.log(this.json1);
      this.loading = false;
      Swal.fire(
        'Complemento Pago Creado',
        '' + this.service.formData.UUID + '',
        'success'
      )
      this.servicefolios.updateFolios().subscribe(data =>{
        console.log(data);
      });
      console.log(data);
    })
  }else
  if (data.response === 'error') {
    this.loading = false;
    document.getElementById('cerrarmodal').click();
    Swal.fire(
      'Error',
      '' + data.message.message + '',
      'error'
    )
  }
  })
        


  }

  changeMat(evento){
    this.service.formData.FechaPago = evento.target.value;
    this.change(this.service.formData.FechaPago);
  }
//
  change(date:any){
    //2020-02-26T07:00:00
    console.log(date);
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const days = ['00','01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12','13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
    let dia;
    let dia2;
    let mes;
    let mes2;
    let año;
    let hora;
    let min;
    let seg;
    let diaf;
    let añonuevo = 0;
    
    let fecha = new Date(date);
    console.log(fecha.getMonth())
    if (((fecha.getDate()+1)==31) && ((fecha.getMonth()==1) || (fecha.getMonth()==3) || (fecha.getMonth()==5) || (fecha.getMonth()==8) || (fecha.getMonth()==10))){
      diaf = 1;
   
      if ((fecha.getMonth()+1)==12){
        mes2 = `${months[0]}`;
        añonuevo = 1
      }else{
        mes2 = `${months[fecha.getMonth()+1]}`;
      }
    }else if ((fecha.getDate()+1)==32){
      diaf = 1;
      if ((fecha.getMonth()+1)==12){
        mes2 = `${months[0]}`;
        añonuevo = 1
      }else{
        mes2 = `${months[fecha.getMonth()+1]}`;
      }
     
    }else{

      console.log(diaf)
      console.log(fecha.getMonth())
      if ((fecha.getMonth()+1)==2){
        if ((fecha.getDate()+1)==29){
          diaf = 1;
          if ((fecha.getMonth()+1)==12){
            mes2 = `${months[0]}`;
            añonuevo = 1
          }else{
            mes2 = `${months[fecha.getMonth()+1]}`;
          }
        }
      }else{

        diaf = fecha.getDate()+1
        //  if ((fecha.getMonth()+1)==12){
        //    mes2 = `${months[0]}`;
        //    añonuevo = 1
        //  }else{
            mes2 = `${months[fecha.getMonth()]}`;
        //  }
      }


    }



    mes = `${months[fecha.getMonth()]}`;
    dia = `${days[fecha.getDate()]}`;
    dia2 = `${days[diaf]}`;
    
    año = fecha.getFullYear() + +añonuevo;
    hora = fecha.getHours();
    min = fecha.getMinutes();
    seg = fecha.getSeconds();

    hora = '00';
    min = '00';
    seg = '00';

    this.fecha2 = año + '-' + mes + '-' + dia + 'T' + hora + ':' + min + ':' + seg
    console.log(fecha);
    console.log(this.fecha2);

    this.fechaapi = año + '-' + mes2 + '-' + dia2
    console.log(this.service.formData.Moneda)

    if(this.service.formData.Moneda==='USD'){
      console.log(this.fechaapi);
      this.traerApi(this.fechaapi).subscribe(data =>{
        let l;
        console.log(data);
        l = data.bmx.series[0].datos[0].dato;
        console.log(l);
        this.service.tipoCambioPago = parseFloat(l).toFixed(4);
    
        
      })
    }else{
      this.service.tipoCambioPago = '0';
    
    }
    
    
    
    
    
  }

  traerApi(fecha): Observable<any>{

    //return this.http.get("/SieAPIRest/service/v1/series/SF63528/datos/"+fecha+'/'+fecha, httpOptions)
    return this.http.get("/SieAPIRest/service/v1/series/SF60653/datos/"+fecha+'/'+fecha, httpOptions)

  }

  dxml(uuid,id){
    this.loading = true;
    //document.getElementById('enviaremail').click();
    //let xml = 'http://devfactura.in/api/v3/cfdi33/' + uuid + '/xml';
    this.servicetimbrado.xml(uuid).subscribe(data => {
      localStorage.setItem('xml' + id, data)
      const blob = new Blob([data as BlobPart], { type: 'application/xml' });
      this.fileUrl = window.URL.createObjectURL(blob);
      this.a.href = this.fileUrl;
      this.a.target = '_blank';
      this.a.download = 'F-' + id + '.xml';
      document.body.appendChild(this.a);
      this.a.click();    
    });
    
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width="80%";
    this.dialog.open(ComplementoPagoComponent, dialogConfig);

    setTimeout(()=>{
      this.onExportClick(id);    
      this.dialog.closeAll();
      
     },1000)
}
onExportClick(folio?: string) {
  // this.proceso = 'xml';
  const content: Element = document.getElementById('ComprobanteDePago-PDF');
  const option = {
    margin: [0, 0, 0, 0],
    filename: 'F-' + folio + '.pdf',
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { scale: 2, logging: true, scrollY: content.scrollHeight },
    jsPDF: { format: 'letter', orientation: 'portrait' },
    
  };

  html2pdf().from(content).set(option).save(); 
  // this.proceso = '';
}


  dxml2(uuid,id){
    // console.log(row);
    // this.service.formt = this.service.formData
    //  console.log(this.service.row);
    //  console.log(this.service.master);
    //  console.log(this.listData.data);
      // this.service.formt = JSON.parse(localStorage.getItem('rowpago'));
      const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width="80%";
    this.dialog.open(ComplementoPagoComponent, dialogConfig);
      // console.log((this.service.formt));
    
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = false;
    // dialogConfig.autoFocus = true;
    // dialogConfig.width="70%";
    // this.dialog.open(ComplementoPagoComponent, dialogConfig);

  }
  cancelar(uuid,id){
    Swal.fire({
      title: '¿Segur@ de Cancelar Complemento Pago?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Cancelar',
      cancelButtonText: 'Deshacer'
    }).then((result) => {
      if (result.value) {
        this.loading = true;
        let resp = {motivo: '02', folioSustituto: ''}
  console.log(resp);
        this.servicetimbrado.cancelar(uuid,resp).subscribe(data => {
          let data2 = JSON.parse(data);
          if (data2.response === 'success') {
            this.service.formData.Estatus='Cancelada';
            this.service.updateReciboPago(this.service.formData).subscribe(data => {
              this.loading = false;
              Swal.fire({
                title: 'Factura Cancelada',
                icon: 'success',
                timer: 1000,
                showCancelButton: false,
                showConfirmButton: false
              });
            });
            //
            this.service.cancelarPagoCFDI(this.service.formData.Id).subscribe(data2=>{

              console.log(data2);
            
            })

            /* cambio nuevo desaldar factura */
            let query;
            let consulta;
            if (this.servicefactura.rfcempresa==='PLA11011243A'){

              query = "update Factura set Estatus='Timbrada' where Id in (select idFactura from PagoCFDI where IdReciboPago="+this.service.formData.Id+")"
            }
            else if (this.servicefactura.rfcempresa=='AIN140101ME3'){
              query = "update Factura2 set Estatus='Timbrada' where Id in (select idFactura from PagoCFDI2 where IdReciboPago="+this.service.formData.Id+")"
            }      else if (this.servicefactura.rfcempresa=='DTM200220KRA'){
              query = "update Factura3 set Estatus='Timbrada' where Id in (select idFactura from PagoCFDI3 where IdReciboPago="+this.service.formData.Id+")"
            }
      
             consulta = {
              'consulta':query
            };
    
            console.log(consulta);
      
            this.servicefactura.getQuery(consulta).subscribe((res:any)=>{
             console.log(res);
            })
            /* cambio nuevo desaldar factura */


          }
          else if (data2.response === 'error') {
            this.loading = false;
            // this.resetForm();
            Swal.fire(
              'Error en Cancelacion',
              '' + data2.message + '',
              'error'
            )
          }
        })
      }

    })

  }

  email(uuid,id){
  localStorage.removeItem('xml'+id);
  localStorage.removeItem('pdf'+id);
  // document.getElementById('enviaremail2').click();


  this.folioparam = id;
  this.idparam = uuid;
  this._MessageService.correo='';
  this._MessageService.cco='';
  this._MessageService.asunto='Envio Complemento de Pago '+id;
  this._MessageService.cuerpo='Se ha enviado un comprobante fiscal digital con folio '+id;
  this._MessageService.nombre='Abarrotodo';
    this.servicetimbrado.xml(uuid).subscribe(data => {
      localStorage.setItem('xml' + id, data)
    })

    const dialogConfig2 = new MatDialogConfig();
    dialogConfig2.autoFocus = false;
    dialogConfig2.width = "0%";    
    let dialogFact = this.dialog.open(ComplementoPagoComponent, dialogConfig2); 
    

    setTimeout(()=>{

      // this.xmlparam = folio;
        const content: Element = document.getElementById('ComprobanteDePago-PDF');
        const option = {
          margin: [0, 0, 0, 0],
          filename: 'F-' + id + '.pdf',
          image: { type: 'jpeg', quality: 1 },
          html2canvas: { scale: 2, logging: true, scrollY: 0 },
          jsPDF: { format: 'letter', orientation: 'portrait' },
        };
        html2pdf().from(content).set(option).output('datauristring').then(function(pdfAsString){
          localStorage.setItem('pdf'+id, pdfAsString);
          this.statusparam=true;          
          console.log(this.statusparam);                
        })
        dialogFact.close()
        
      },1000)
      
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      // dialogConfig.width = "90%";
      dialogConfig.height = "90%";
      dialogConfig.data = {
        foliop: id,
        idp: uuid,
        status: true
      }
      this.dialog.open(EmailComponent, dialogConfig);

  }



}

