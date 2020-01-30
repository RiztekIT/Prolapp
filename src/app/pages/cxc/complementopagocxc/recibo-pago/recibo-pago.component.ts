import { Component, OnInit, ViewChild } from '@angular/core';
import { ReciboPagoService } from '../../../../services/complementoPago/recibo-pago.service';
import { Router } from '@angular/router';
import { NgForm, FormControl } from '@angular/forms';
import { ReciboPago } from '../../../../Models/ComplementoPago/recibopago';
import { Observable, empty } from 'rxjs';
import { Cliente } from 'src/app/Models/catalogos/clientes-model';
//Importacion Angular Material Tables and Sort
import { MatTableDataSource, MatSort } from '@angular/material';
//Importacion para utilizar Pipe de DropDown Clientes
import { map, startWith } from 'rxjs/operators';
import { Factura } from 'src/app/Models/facturacioncxc/factura-model';
import { PagoCFDI } from '../../../../Models/ComplementoPago/pagocfdi';
//Importacion Modal
import { MatDialog, MatDialogConfig } from '@angular/material';
//Importacion Edit Pago CFDI
import { PagoCFDIEditComponent } from '../pago-cfdi-edit/pago-cfdi-edit.component';

@Component({
  selector: 'app-recibo-pago',
  templateUrl: './recibo-pago.component.html',
  styleUrls: ['./recibo-pago.component.css']
})
export class ReciboPagoComponent implements OnInit {

  constructor(public service: ReciboPagoService, private router: Router, private dialog: MatDialog) {

  }

  ngOnInit() {
    this.CleanPagoCFDI();
    this.Inicializar();
    this.RP();
    this.dropdownRefresh();
    this.refreshPagoCFDITList();
    // this.ClienteDefault();
    

  }
  //Checar si el Id es el Default
  ClienteDefault(){
    // console.log('CHECHANDO EL CLIENTE');
    if(this.service.formData.IdCliente == 1){
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
  options2: Factura[] = [];
  filteredOptions2: Observable<any[]>;
  FacturaList: Factura[] = [];
  //Variables Saldo, Total, Cantidad
  //Cantidad Total ingresado al momento de hacer el pago
  Cantidad: number;
  //Cantidad a pagar de cierta Factura
  CantidadF: number;
  //Total 
  TotalF: number;
  //Saldo que tiene Cierto Recibo de Pago
  Saldo: number;
  //Saldo Restante de la Factura
  SaldoF: number;
  //Nuevo Saldo Factura
  SaldoNuevo: number;
  //Nombre del Cliente a Facturar 
  ClienteNombre: any;
  //Id De la Factua
  IdFactura: number;
  //NoParcialidad 
  NoParcialidad: string;
  //TRUE = NUEVO RECIBO PAGO - FALSE = NO NUEVO RECIBO PAGO
  Nuevo: boolean;





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
      // console.log(this.service.formData);
      this.Estatus = this.service.formData.Estatus;


      //OBTENER LA INFORMACION DEL CLIENTE, EN ESPECIFICO EL NOMBRE DEL CLIENTE PARA PINTARLO EN EL FORMULARIO
      this.service.getFacturaClienteID(this.service.formData.IdCliente).subscribe(res => {
        // console.log(res);
        this.ClienteNombre = res[0].Nombre;
      });

      
   
   
    });
  }


  //Limipiar PagoCFDI
  CleanPagoCFDI(){
    this.service.formDataPagoCFDI.IdFactura = 0;
    this.CantidadF = 0;
    this.TotalF = 0;
    this.SaldoF = 0;
    this.SaldoNuevo = 0;
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
    this.service.getReciboPagosCFDI(this.IdReciboPago).subscribe(data => {
      if (data.length > 0){
        console.log('CFDI EXISTENTES');
this.Nuevo = false;
      }else{
        console.log('CFDI NUEVO');
this.Nuevo  = true;
      }
    })
  }

  //Lista Facturas por IdClient
  dropdownRefresh2(idCliente) {
    //Checar si hay PAGOS CFDI
    console.log(this.Nuevo + 'VARIABLE NUEVOOOOOOOOO');
    // this.service.getReciboPagosCFDI(this.IdReciboPago).subscribe(data => {

      //Si hay pagosCFDI, se hara un select con condiciones de los PAGOSCFDI existentes
      if (this.Nuevo == false){
console.log('YA HAYYYYY CFDIISISISISISIS');
    console.log(idCliente+ 'Este es el IDCliente');
    this.service.getFacturaPagoCFDI(idCliente).subscribe((data) => {
      console.log(data);
      if (data) {
        for (let i = 0; i < data.length; i++) {
          let facturaPagoCFDI = data[i];
          this.FacturaList.push(facturaPagoCFDI);
          this.options2.push(facturaPagoCFDI)
          // console.log(this.options2);
          this.filteredOptions2 = this.myControl2.valueChanges
            .pipe(
              startWith(''),
              map(value => this._filter2(value))
            );
        }
      }else{
        console.log("No hay Facturas Correspondientes al Cliente");
        this.options2 = [];
      }
    });

//Si no hay pagos CFDI, solo se verifica que la factura este Timbrada y con cuerde con el IdCliente
  }else{
console.log('NUEVO CFDIIIIIIIIIII');
    this.service.getFacturaPrimerPagoCFDI(idCliente).subscribe((data) => {
      console.log(data);
      if (data) {
        for (let i = 0; i < data.length; i++) {
          let facturaPagoCFDI = data[i];
          this.FacturaList.push(facturaPagoCFDI);
          this.options2.push(facturaPagoCFDI)
          // console.log(this.options2);
          this.filteredOptions2 = this.myControl2.valueChanges
            .pipe(
              startWith(''),
              map(value => this._filter2(value))
            );
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
      // console.log(data);
         if (data.length > 0){
           this.Saldo = 0;
           for (let i=0; i<data.length; i++){
            //  console.log(i);
            //  console.log(data[i].Cantidad);
             this.Saldo = ((this.Saldo) + (+data[i].Cantidad)); 
           }
           this.Saldo = +this.service.formData.Cantidad - this.Saldo;
          //  console.log('SI HAY VALORES');
          //  console.log(this.service.formData.IdCliente);
           (<HTMLInputElement> document.getElementById("ClienteId")).disabled = true;
          //  console.log(data);
           this.listData = new MatTableDataSource(data);
           this.listData.sort = this.sort;
           this.dropdownRefresh2(this.service.formData.IdCliente);
      }else{
        // console.log('No hay valores');
        this.Saldo = +this.service.formData.Cantidad;
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
      option.IdClientes.toString().includes(filterValue));
  }
  //Filter Facturas por Folio
  private _filter2(value: any): any[] {
    // console.log(value);
    const filterValue2 = value.toString();
    return this.options2.filter(option =>
      option.Folio.toString().includes(filterValue2));
  }

  onSelectionChange(cliente: any, event: any) {

    if (event.isUserInput) {
      console.log('ON CHANGEEEEE');
      console.log(cliente);
      console.log('FORM DATA');
      console.log(this.service.formData);
      //Limpiar arreglo de Facturas dependiendo del cliente
      this.options2 = [];
      this.dropdownRefresh2(this.service.formData.IdCliente);
      this.ClienteNombre = cliente.Nombre;
    }


  }
  onBlurCliente(){
    this.service.updateReciboPago(this.service.formData).subscribe(data =>{
      console.log(data);
    })
  }

  onBlur(){
    // console.log("YA DEJO DE ESCRIBIR");
    this.service.updateReciboPago(this.service.formData).subscribe(data =>{
      console.log(data);
      this.refreshPagoCFDITList();
    })
  }

  onSelectionChange2(factura: any, event: any) {
    if (event.isUserInput) {
     
      console.log(factura);
      if( this.Nuevo == false){
        console.log('PAGOS CFDI EXISTENTES');
        this.TotalF = +factura.Total;
        this.SaldoF = +factura.Saldo;
        this.IdFactura = factura.Id;
      }else{
        console.log('NUEVO PAGO CFDI');
        this.TotalF = +factura.Total;
        this.SaldoF = +factura.Total;
        this.IdFactura = factura.Id;

      }
    
    }
  }



  onChangeCantidad(Cantidad: Event) {
    this.Cantidad = +Cantidad;
    this.refreshPagoCFDITList();
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

  ObtenerTotalFactura(){

  }

  //Editar PagoCFDI
  onEditCFDI(pagoCFDI: any) {
    // console.log(pagoCFDI);
    this.service.formDataPagoCFDI = pagoCFDI;
    // console.log(this.service.formDataPagoCFDI);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    this.dialog.open(PagoCFDIEditComponent, dialogConfig);

    // this.service.formDataPagoCFDI.IdFactura = pagoCFDI.Id;
    // this.CantidadF = pagoCFDI.Cantidad;
    // this.onChangeCantidadF(this.CantidadF);
    // this.CalcularSP();

  }
  //Calcular Saldos Pendientes de los Pagos de CFDI
  CalcularSP(){

  }
  //Eliminar PagoCFDI
  onDeletePagoCFDI() {

  }

  ObtenerNoParcialidad(){
    this.service.getNoParcialidad(this.IdFactura).subscribe(data =>{
      if(data[0].NoParcialidad == null){
        console.log('PARCIALIDAD NULL');
        this.service.formDataPagoCFDI.NoParcialidad = '1';
      }else{
        console.log('PACIALIDAD EXISTENTE');
        this.service.formDataPagoCFDI.NoParcialidad = data[0].NoParcialidad;
      }
    })
  }
  
  onAddCFDI() {
    this.ObtenerNoParcialidad();
    this.Saldo = this.Saldo - this.CantidadF;
    this.service.formDataPagoCFDI.IdReciboPago = this.IdReciboPago;
    this.service.formDataPagoCFDI.IdFactura = this.IdFactura;
    this.service.formDataPagoCFDI.UUID = "";
    this.service.formDataPagoCFDI.Cantidad = this.CantidadF.toString();
    this.service.formDataPagoCFDI.NoParcialidad = this.NoParcialidad;
    this.service.formDataPagoCFDI.Saldo = this.SaldoNuevo.toString();
    // console.log(this.service.formDataPagoCFDI);
      this.service.addPagoCFDI(this.service.formDataPagoCFDI).subscribe(res =>{
        this.refreshPagoCFDITList();
        this.CleanPagoCFDI();
        // this.dropdownRefresh2(this.service.formData.IdCliente);
        console.log(res);
      })
    
  }
  //Regresar a la pagina anterior
  Regresar() {
    //Remover el IdRecibo el local storage
    localStorage.removeItem('IdRecibo');
    this.router.navigateByUrl('/complementopagoCxc');
  }

  //Metodo Disparado al momento de hacer submit el cual recibe los valors del form como parametro
  onSubmit() {
    this.service.formData.Cantidad = parseFloat(this.service.formData.Cantidad).toFixed(6);
    // console.log(this.service.formData)
    console.log(this.service.formData.IdCliente);
  }


}
