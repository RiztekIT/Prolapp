import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatSnackBar, MatDivider, MAT_DATE_LOCALE } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { IncidenciasService } from '../../../services/almacen/incidencias/incidencias.service';
import {ThemePalette} from '@angular/material/core';
import { ShowreporteCalidadComponent } from './showreporte-calidad/showreporte-calidad.component';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styles: []
})


export class ReportesComponent implements OnInit {

  constructor(private dialog: MatDialog, public incidenciaService:IncidenciasService) { }

  ngOnInit() {
    // this.obtenerProveedores();
  }


  //^Fechas de reportes a ser filtradas
  fechaInicial: Date
  fechaFinal: Date


//^Variable para Filtrar por fechas
  color: ThemePalette = 'accent';
  checkedFecha = false;
  disabled = false;
  // checkedProveedores = true;

  //^ Variable para filtrar por Estatus
  checkedEstatus = false;
  disabledEstatus = true;

  //^ TipoIncidencia
  tipoIncidencia: string = 'Todo';

  //^variable estatus de la Incidencia (Creada, Iniciada, Pendiente)
  estatusIncidencia: string;

  //^variables procendencia de Incidencia (OrdenCarga, OrdenDescarga)
  procedenciaIncidencia: string = 'Todo';

  //^Lista de tipos de Incidencia
  public listTipoIncidencia: Array<Object> = [
    { tipo: 'Merma' },
    { tipo: 'Reparacion' },
    { tipo: 'Devolucion'},
    { tipo: 'Todo' }
  ];
  //^Lista de Estatus
  public listEstatus: Array<Object> = [
    { tipo: 'Creada' },
    { tipo: 'Iniciada' },
    { tipo: 'Pendiente' }
  ];

  tipoIncidenciaSelected(event: any) {
    console.log(event);
    this.tipoIncidencia = event.target.selectedOptions[0].text;

    // if(this.tipoCompra == 'Administrativa' || this.tipoCompra == 'Todo'){
    //     this.disabledEstatus = true;
    //     this.checkedEstatus = false;
    // }else{
    //   this.disabledEstatus = false;
    // }
    
  }

  //cuando se filtarara por estatus
  onChangeEstatus(){
    if(this.checkedEstatus == true){
      this.checkedEstatus = false;
    }else{
      this.checkedEstatus = true;
    }
  }
//cuando se selecciona un estatus
  changeEstatus(event){
    console.log(event);
    this.estatusIncidencia = event.target.selectedOptions[0].text;
  }

  onChangePorFecha(){
if(this.checkedFecha == true){
  this.checkedFecha = false;
}else{
  this.checkedFecha = true;
}
  }

  // obtenerProveedores(){
  //   this.comprasService.getProveedoresList().subscribe(data=>{
  //     console.log(data);
  //     for (let i = 0; i < data.length; i++) {
  //       let proveedor = data[i];
        
  //       this.options.push(proveedor)
  //       this.filteredOptions = this.myControl.valueChanges
  //         .pipe(
  //           startWith(''),
  //           map(value => this._filter(value))
  //         );
  //     }
  //   })
  // }

  // _filter(value: any): any {
  //    const filterValue = value.toString().toLowerCase();
  //   return this.options.filter(option =>
  //     option.Nombre.toLowerCase().includes(filterValue) ||
  //     option.IdProveedor.toString().includes(filterValue));
  // }

  // onSelectionChange(proveedor: Proveedor, event: any) {
  //     console.log(proveedor);
  //   this.ProveedroNombre = proveedor.Nombre;
  // }
  // onChangeTodosProveedores(){
  //   if(this.checkedProveedores == true){
  //     this.checkedProveedores = false;
  //   }else{
  //     this.checkedProveedores = true;
  //   }
  // }

  abrirReporte(procedencia: string){

    let fechaStart = new Date();
    let fechaEnd = new Date();

    let estatus: boolean = false;
    let tipoEstatus: string = '';

    let tipoReporte: string;

    if(this.checkedFecha == true){
      console.log(this.checkedFecha);
      console.log('SE FILTRA POR FECHA');
        fechaStart = this.fechaInicial;
        fechaEnd = this.fechaFinal;
    }

    if(this.tipoIncidencia == 'Todo'){
        tipoReporte = 'Ambas';
    }
    if(this.tipoIncidencia == 'Merma'){
        tipoReporte = 'Merma';
    }
    if(this.tipoIncidencia == 'Reparacion'){
        tipoReporte = 'Reparacion';
    }
    if(this.tipoIncidencia == 'Devolucion'){
        tipoReporte = 'Devolucion';
    }

    if(this.checkedEstatus == true){
      estatus = true;
      tipoEstatus = this.estatusIncidencia; 
    }

console.log('TipoReporte', tipoReporte);
console.log('Procedencia:', procedencia);
console.log('FiltrarFEcha?', this.checkedFecha);
console.log('FiltrarEstatus', estatus);
console.log('TipoEstatus', tipoEstatus);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "80%";
    dialogConfig.data = {
      tipoReporte: tipoReporte,
      procedencia: procedencia,
      filtradoFecha: this.checkedFecha,
      fechaInicial: fechaStart,
      fechaFinal: fechaEnd,
      estatus: estatus,
      tipoEstatus: tipoEstatus
      
    }
    this.dialog.open(ShowreporteCalidadComponent, dialogConfig);

  }
}
