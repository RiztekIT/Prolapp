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

@Component({
  selector: 'app-recibo-pago',
  templateUrl: './recibo-pago.component.html',
  styleUrls: ['./recibo-pago.component.css']
})
export class ReciboPagoComponent implements OnInit {

  constructor(public service: ReciboPagoService, private router: Router) {

  }

  ngOnInit() {
    this.dropdownRefresh();
    this.Inicializar();
    this.Valores0();
    this.dropdownRefresh2(this.service.formData.IdCliente);
    this.refreshPagoCFDITList();

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

  //Iniciar Valores a 0
  Valores0() {
    // this.Cantidad = 0;
    this.CantidadF = 0;
    // this.TotalF = 0;
    // this.SaldoF = 0;
  }

  //Informacion para tabla de productos
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['FolioFactura', 'Cantidad', 'SaldoPendiente', 'Options'];
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


      // if (this.Estatus==='Timbrada' || this.Estatus==='Cancelada'){
      // let nodes = document.getElementById('div1').getElementsByTagName('*');
      // for (let i = 0; i < nodes.length; i++){
      // nodes[i].setAttribute('disabled','true')
      // }
      // }
    });
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

  //Lista Facturas por IdClient
  dropdownRefresh2(idCliente) {
    // console.log(idCliente+ 'Este es el IDCliente');
    this.service.formDataPagoCFDI.IdFactura = 0;
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
      } else {
        this.options2 = [];
      }
    });

  }

  refreshPagoCFDITList(){
    this.service.getReciboPagosCFDI(2).subscribe(data => {
      console.log(data);
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
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

  onSelectionChange(reciboPago: any, event: any) {

    if (event.isUserInput) {
      console.log('ON CHANGEEEEE');
      console.log(reciboPago);
      //Limpiar arreglo de Facturas dependiendo del cliente
      this.options2 = [];
      this.dropdownRefresh2(this.service.formData.IdCliente);
      this.ClienteNombre = reciboPago.Nombre;
    }


  }

  onSelectionChange2(factura: any, event: any) {
    if (event.isUserInput) {
      console.log(factura);
      this.TotalF = +factura.Total;
      this.SaldoF = +factura.Saldo;
    }
  }



  onChangeCantidad(Cantidad: Event) {
    this.Cantidad = +Cantidad;
    this.Saldo = +Cantidad;
    console.log(this.Cantidad);
  }
  onChangeCantidadF(CantidadF: Event) {

    //Obtener el valor que se ingresa en cierto input en la posicion 0
    let elemHTML: any = document.getElementsByName('Cantidad2')[0];
    //Transformar la Cantidad en entero e igualarlo a la variable CantidadF
    this.CantidadF = +CantidadF;


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
    elemHTML.value = this.CantidadF;
    console.log(this.CantidadF);
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

  //Editar PagoCFDI
  onEditPagoCFDI() {

  }
  //Eliminar PagoCFDI
  onDeletePagoCFDI() {

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

  onSubmitCFDI() {
    this.Saldo = this.Saldo - this.CantidadF;

  }

  onAddPagoCFDI() {

  }



}
