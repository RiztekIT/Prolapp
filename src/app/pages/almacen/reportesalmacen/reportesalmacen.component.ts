import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ClientesService } from 'src/app/services/catalogos/clientes.service';
import { Observable } from 'rxjs';
import { Cliente } from 'src/app/Models/catalogos/clientes-model';
import { startWith, map } from 'rxjs/operators';
import { MatDialog, MatDialogConfig, MatSnackBar, MatDivider, MAT_DATE_LOCALE } from '@angular/material';
import {ThemePalette} from '@angular/material/core';
import { OrdenCargaService } from '../../../services/almacen/orden-carga/orden-carga.service';
import { OrdenDescarga } from '../../../Models/almacen/OrdenDescarga/ordenDescarga-model';
import { ProveedoresService } from '../../../services/catalogos/proveedores.service';
import { Proveedor } from '../../../Models/catalogos/proveedores-model';


@Component({
  selector: 'app-reportesalmacen',
  templateUrl: './reportesalmacen.component.html',
  styleUrls: ['./reportesalmacen.component.css']
})

export class ReportesalmacenComponent implements OnInit {

  constructor(public serviceCliente: ClientesService, public proveedorService: ProveedoresService,  private dialog: MatDialog, public ocService: OrdenCargaService, public odService: OrdenDescarga) { }

  ngOnInit() {
    this.obtenerClientes();
    this.obtenerProveedores();
     }

     //Fechas de reportes a ser filtradas
   fechaInicialOrdenCarga: Date;
   fechaFinalOrdenCarga: Date;

   fechaInicialOrdenDescarga: Date;
   fechaFinalOrdenDescarga: Date;

   fechaInicialTraspaso: Date;
   fechaFinalTraspaso: Date;
 
 
 //Variable para Filtrar por fechas / clientes  OrdenCarga
 color: ThemePalette = 'accent';
 checkedFechasOrdenCarga = false;
 disabledFechasOrdenCarga = false;
 checkedClientesOrdenCarga = true;
 checkedEstatusOrdenCarga = false;
 disabledEstatusOrdenCarga = true;
 
 //Variable para Filtrar por fechas / clientes  Traspaso
   checkedFechasTraspaso = false;
   disabledFechasTraspaso = false;

   checkedEstatusTraspaso = false;
   disabledEstatusTraspaso = true;

 //Variable para Filtrar por fechas / provedores  OrdenDescarga
   checkedFechasOrdenDescarga = false;
   disabledFechasOrdenDescarga = false;
   checkedProveedorOrdenDescarga = true;
   checkedEstatusOrdenDescarga = false;
   disabledEstatusOrdenDescarga = true;
 
 
   //variable estatus de Orden Carga (creada, preparada, cargada, envidada, transito, terminada)
   estatusOrdenCarga: string;
   
   //variable estatus del Traspaso (creada, preparada, cargada, envidada, transito, terminada)
   estatusTraspaso: string;

   //variable estatus de la Orden Descarga (creda, proceso, descargada, transito,)
   estatusOrdenDescarga: string;
 

   //variables dropdown clientes Orden Carga
   myControlOrdenCarga = new FormControl();
   filteredOptionsOrdenCarga: Observable<any[]>
   optionsOrdenCarga: Cliente[] = [];
   OrdenCargaClienteNombre: any;
   OrdenCargaIdCliente: number;

   //variables dropdown proveedores Orden Descarga
   myControlOrdenDescarga = new FormControl();
   filteredOptionsOrdenDescarga: Observable<any[]>
   optionsOrdenDescarga: Proveedor[] = [];
   OrdenDescargaProveedorNombre: any;
   OrdenDescargaIdProveedor: number;
 
 
   //Lista de Estatus Orden Carga / Traspaso
   public listEstatusOrdenCarga: Array<Object> = [
     { tipo: 'Creada' },
     { tipo: 'Preparada' },
     { tipo: 'Cargada' },
     { tipo: 'Enviada' },
     { tipo: 'Transito' },
     { tipo: 'Terminada' }
   ];
 
   //Lista de Estatus Orden Descarga
   public listEstatusOrdenDescarga: Array<Object> = [
     { tipo: 'Creada' },
     { tipo: 'Proceso' },
     { tipo: 'Transito' },
     { tipo: 'Descargada' }
   ];

     obtenerClientes(){
       this.serviceCliente.getClientesListIDN().subscribe(data=>{
         console.log(data);
         for (let i = 0; i < data.length; i++) {
           let client = data[i];
           this.optionsOrdenCarga.push(client)
           this.filteredOptionsOrdenCarga = this.myControlOrdenCarga.valueChanges
             .pipe(
               startWith(''),
               map(value => this._filterOrdenCarga(value))
             );
         }
       })
     }
   
     _filterOrdenCarga(value: any): any {
       const filterValue = value.toString().toLowerCase();
      return this.optionsOrdenCarga.filter(option =>
        option.Nombre.toLowerCase().includes(filterValue) ||
        option.IdClientes.toString().includes(filterValue));
    }
     obtenerProveedores(){
       this.proveedorService.getProveedoresList().subscribe(data=>{
         console.log(data);
         for (let i = 0; i < data.length; i++) {
           let proveedor = data[i];
           this.optionsOrdenDescarga.push(proveedor)
           this.filteredOptionsOrdenDescarga = this.myControlOrdenDescarga.valueChanges
             .pipe(
               startWith(''),
               map(value => this._filterOrdenDescarga(value))
             );
         }
       })
     }
   
     _filterOrdenDescarga(value: any): any {
       const filterValue = value.toString().toLowerCase();
      return this.optionsOrdenDescarga.filter(option =>
        option.Nombre.toLowerCase().includes(filterValue) ||
        option.IdProveedor.toString().includes(filterValue));
    }

    //Al filtrar por fecha
    onChangePorFechaOrdenCarga(){
      if(this.checkedFechasOrdenCarga == true){
        this.checkedFechasOrdenCarga = false;
      }else{
        this.checkedFechasOrdenCarga = true;
      }
        }
    onChangePorFechaTraspaso(){
      if(this.checkedFechasTraspaso == true){
        this.checkedFechasTraspaso = false;
      }else{
        this.checkedFechasTraspaso = true;
      }
        }
    onChangePorFechaOrdenDescarga(){
      if(this.checkedFechasOrdenDescarga == true){
        this.checkedFechasOrdenDescarga = false;
      }else{
        this.checkedFechasOrdenDescarga = true;
      }
        }
  

        onSelectionChangeOrdenCarga(cliente: Cliente, event: any) {
          console.log(cliente);
        this.OrdenCargaClienteNombre = cliente.Nombre;
      }
        onSelectionChangeOrdenDescarga(cliente: Cliente, event: any) {
          console.log(cliente);
        this.OrdenDescargaProveedorNombre = cliente.Nombre;
      }

      //Al filtrar cliente
      onChangeTodosClientesOrdenCarga(){
        if(this.checkedClientesOrdenCarga == true){
          this.checkedClientesOrdenCarga = false;
        }else{
          this.checkedClientesOrdenCarga = true;
        }
      }
      onChangeTodosProveedorOrdenDescarga(){
        if(this.checkedProveedorOrdenDescarga == true){
          this.checkedProveedorOrdenDescarga = false;
        }else{
          this.checkedProveedorOrdenDescarga = true;
        }
      }

      //cuando se filtarara por estatus Orden Carga
  onChangeEstatusOrdenCarga(){
    if(this.checkedEstatusOrdenCarga == true){
      this.checkedEstatusOrdenCarga = false;
    }else{
      this.checkedEstatusOrdenCarga = true;
    }
  }

      //cuando se filtarara por estatus Orden Carga TRASPASO
  onChangeEstatusTraspaso(){
    if(this.checkedEstatusTraspaso == true){
      this.checkedEstatusTraspaso = false;
    }else{
      this.checkedEstatusTraspaso = true;
    }
  }
      //cuando se filtarara por estatus Orden Descarga
  onChangeEstatusOrdenDescarga(){
    if(this.checkedEstatusOrdenDescarga == true){
      this.checkedEstatusOrdenDescarga = false;
    }else{
      this.checkedEstatusOrdenDescarga = true;
    }
  }
  //cuando se selecciona un estatus OrdenCarga
  changeEstatusCotizacion(event){
    console.log(event);
    this.estatusOrdenCarga = event.target.selectedOptions[0].text;
  }
  //cuando se selecciona un estatus OrdenCarga TRASPASO
  changeEstatusTraspaso(event){
    console.log(event);
    this.estatusTraspaso = event.target.selectedOptions[0].text;
  }
//cuando se selecciona un estatus orden Descarga
  changeEstatusOrdenDescarga(event){
    console.log(event);
    this.estatusOrdenDescarga = event.target.selectedOptions[0].text;
  }

  abrirReporte(modulo){
    
  }
     
}
