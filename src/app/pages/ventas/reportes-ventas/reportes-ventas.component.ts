import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ClientesService } from 'src/app/services/catalogos/clientes.service';
import { Observable } from 'rxjs';
import { Cliente } from 'src/app/Models/catalogos/clientes-model';
import { startWith, map } from 'rxjs/operators';
import { FacturaService } from 'src/app/services/facturacioncxc/factura.service';
import { ReportefechasfacturacionVentasComponent } from 'src/app/components/ventas/reportefechasfacturacion/reportefechasfacturacion.component';
import { MatDialog, MatDialogConfig, MatSnackBar, MatDivider, MAT_DATE_LOCALE } from '@angular/material';

declare function btn_table();


@Component({
  selector: 'app-reportes-ventas',
  templateUrl: './reportes-ventas.component.html',
  styles: []
})
export class ReportesVentasComponent implements OnInit {

  todosClientes = true;
  myControl = new FormControl();
  filteredOptions: Observable<any[]>
  listClientes: Cliente[] = [];
  options: Cliente[] = [];
  ClienteNombre: any;
  fecha1 = new Date();
  fecha2 = new Date();
  facturas = new Array<any>();
/* 
  ReporteVentas: any = [
    {
      id: '1',
      cliente: 'Riztek',
      cantidad: '3',
      producto: 'Premium',
      fecha: '2019/11/15',
      estatus: 'Resuelta',
      precio: '$ 36500'
    }, {
      id: '2',
      cliente: 'Lex Impulse',
      cantidad: '25',
      producto: 'Dairy Quenn',
      fecha: '2019/11/20',
      estatus: 'Resuelta',
      precio: '$ 48751'
    }
  ]; */

  constructor(public serviceCliente: ClientesService, public serviceFactura: FacturaService, private dialog: MatDialog) { }

  ngOnInit() {
    btn_table();
    this.obtenerClientes();

  }

  obtenerClientes(){
    this.serviceCliente.getClientesListIDN().subscribe(data=>{
      console.log(data);
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
    })
  }

  _filter(value: any): any {
    const filterValue = value.toString().toLowerCase();
   return this.options.filter(option =>
     option.Nombre.toLowerCase().includes(filterValue) ||
     option.IdClientes.toString().includes(filterValue));
 }

  checkbox(event){
    this.todosClientes = event.checked;
    console.log(this.todosClientes);
  }

  onSelectionChange(cliente: Cliente, event: any) {
    console.log('OSC',cliente);
    console.log('OSC',event);
    this.ClienteNombre = cliente.Nombre;
  }

  reporteCobranza(){

  }


  abrirReporteFactutacionVentas(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "80%";
    dialogConfig.data = {
    fecha1: this.fecha1,
    fecha2: this.fecha2,
    }
    let dl = this.dialog.open(ReportefechasfacturacionVentasComponent, dialogConfig);
  }

 

}
