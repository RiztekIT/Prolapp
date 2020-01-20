import { Component, OnInit } from '@angular/core';
import { ReciboPagoService } from '../../../../services/complementoPago/recibo-pago.service';
import { Router } from '@angular/router';
import { NgForm, FormControl } from '@angular/forms';
import { ReciboPago } from '../../../../Models/ComplementoPago/recibopago';
import { Observable } from 'rxjs';
import { Cliente } from 'src/app/Models/catalogos/clientes-model';
//Importacion para utilizar Pipe de DropDown Clientes
import {map, startWith} from 'rxjs/operators';
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
  this.dropdownRefresh2(this.service.formData.IdCliente);

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
  Cantidad=0;
  //Cantidad a pagar de cierta Factura
  CantidadF = 0;
  //Total 
  TotalF = 0;
  //Saldo Restante de la Factura
  Saldo: number;
  //Nombre del Cliente a Facturar 
  ClienteNombre: any;


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
this.service.getFacturaClienteID(this.service.formData.IdCliente).subscribe(res =>{
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
          map(value =>  this._filter(value))
        );
      }
    });

  }
  
  //Lista Facturas por IdClient
  dropdownRefresh2(idCliente) {
    // console.log(idCliente+ 'Este es el IDCliente');
    this.service.getClienteFacturaList(idCliente).subscribe((data) => {
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        let factura = data[i];
        this.FacturaList.push(factura);
        this.options2.push(factura)
        // console.log(this.options2);
        this.filteredOptions2 = this.myControl2.valueChanges
        .pipe(
          startWith(''),
          map(value =>  this._filter2(value))
        );
      }
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
  option.Folio.toString().includes(filterValue2) );
}

onSelectionChange(reciboPago : any, event: any){

  if(event.isUserInput){
  console.log('ON CHANGEEEEE');
  console.log(reciboPago);
  //Limpiar arreglo de Facturas dependiendo del cliente
  this.options2 = [];
  this.FacturaList = [];
  this.dropdownRefresh2(this.service.formData.IdCliente);
  this.ClienteNombre = reciboPago.Nombre;
  }
  

}

onSelectionChange2(factura : Factura, event: any){
if(event.isUserInput){
  console.log(factura);
  this.TotalF = +factura.Total;
}
}



onChangeCantidad(Cantidad: Event){
  this.Cantidad = +Cantidad; 
  console.log(this.Cantidad);
}
onChangeCantidadF(CantidadF: Event){
  this.CantidadF = +CantidadF;
  console.log(this.CantidadF)
  if(this.CantidadF > this.Cantidad){
  console.log("La cantidad es mayor a la permitida");
   this. CantidadF = this.Cantidad;
  }else{
console.log("Si se arma");
  }

  // if (+Cantidad > this.Cantidad){
  //   this.CantidadF = this.Cantidad;
  // } else{
  //   this.Cantidad = this.CantidadF
  // }
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

  onSubmitCFDI(){

  }

  onAddPagoCFDI(){

  }



}
