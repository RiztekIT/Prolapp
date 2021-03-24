import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatSnackBar, MatDivider, MAT_DATE_LOCALE } from '@angular/material';
import { ShowreporteComprasComponent } from './showreporte-compras/showreporte-compras.component';
import {ThemePalette} from '@angular/material/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Proveedor } from '../../../Models/catalogos/proveedores-model';
import { CompraService } from '../../../services/compras/compra.service';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-reporte-compras',
  templateUrl: './reporte-compras.component.html',
  styleUrls: ['./reporte-compras.component.css']
})
export class ReporteComprasComponent implements OnInit {



  constructor(private dialog: MatDialog,public comprasService: CompraService) { }

  ngOnInit() {

    
    this.obtenerProveedores();
    this.obtenerProveedoresFactura();
  }


  //Fechas de reportes a ser filtradas
  fechaInicial: Date
  fechaFinal: Date

  //Fechas de reportes a ser filtradas
  fechaInicialFactura: Date
  fechaFinalFactura: Date


//Variable para Filtrar por fechas / proveedores
  color: ThemePalette = 'accent';
  checked = false;
  disabled = false;
  checkedProveedores = true;
  checkedFactura = false;
  disabledFactura = false;
  checkedProveedoresFactura = true;

  checkedEstatus = false;
  disabledEstatus = true;

  //variable tipo reporte (Administrativa, Materia Prima o Ambas)
  tipoReporte: string;

  //variable estatus de la Compra (creada, guardada, transito, terminada, cerrada, administrativa)
  estatusCompra: string;

  //variables dropdown proveedores
  myControl = new FormControl();
  filteredOptions: Observable<any[]>
  options: Proveedor[] = [];
  ProveedroNombre: any;
  IdProveedor: number;

  //variables dropdown proveedores
  myControlFactura = new FormControl();
  filteredOptionsFactura: Observable<any[]>
  optionsFactura: Proveedor[] = [];
  ProveedroNombreFactura: any;
  IdProveedorFactura: number;

  //variables tipo de reporte (Materia Prima, Administrativa, Ambos)
  tipoCompra: string = 'Todo';

  

  //Lista de tipos de Compras
  public listTipoCompras: Array<Object> = [
    { tipo: 'Administrativa' },
    { tipo: 'MateriaPrima' },
    { tipo: 'Todo' }
  ];
  //Lista de Estatus
  public listEstatus: Array<Object> = [
    { tipo: 'Guardada' },
    { tipo: 'Transito' },
    { tipo: 'Terminada' }
  ];

  tipoReporteSelected(event: any) {
    console.log(event);
    this.tipoCompra = event.target.selectedOptions[0].text;

    if(this.tipoCompra == 'Administrativa' || this.tipoCompra == 'Todo'){
        this.disabledEstatus = true;
        this.checkedEstatus = false;
    }else{
      this.disabledEstatus = false;
    }
    
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
    this.estatusCompra = event.target.selectedOptions[0].text;
  }

  onChangePorFecha(){
if(this.checked == true){
  this.checked = false;
}else{
  this.checked = true;
}
  }
  onChangePorFechaFactura(){
if(this.checkedFactura == true){
  this.checkedFactura = false;
}else{
  this.checkedFactura = true;
}
  }

  obtenerProveedores(){
    this.comprasService.getProveedoresList().subscribe(data=>{
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        let proveedor = data[i];
        
        this.options.push(proveedor)
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
      option.IdProveedor.toString().includes(filterValue));
  }

  onSelectionChange(proveedor: Proveedor, event: any) {
      console.log(proveedor);
    this.ProveedroNombre = proveedor.Nombre;
  }
  onChangeTodosProveedores(){
    if(this.checkedProveedores == true){
      this.checkedProveedores = false;
    }else{
      this.checkedProveedores = true;
    }
  }
  obtenerProveedoresFactura(){
    this.comprasService.getProveedoresList().subscribe(data=>{
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        let proveedor = data[i];
        
        this.optionsFactura.push(proveedor)
        this.filteredOptionsFactura = this.myControlFactura.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filterFactura(value))
          );
      }
    })
  }

  _filterFactura(value: any): any {
     const filterValue = value.toString().toLowerCase();
    return this.optionsFactura.filter(option =>
      option.Nombre.toLowerCase().includes(filterValue) ||
      option.IdProveedor.toString().includes(filterValue));
  }

  onSelectionChangeFactura(proveedor: Proveedor, event: any) {
      console.log(proveedor);
    this.ProveedroNombreFactura = proveedor.Nombre;
  }
  onChangeTodosProveedoresFactura(){
    if(this.checkedProveedoresFactura == true){
      this.checkedProveedoresFactura = false;
    }else{
      this.checkedProveedoresFactura = true;
    }
  }

  abrirReporte(moneda: string){

    let fechaStart = new Date();
    let fechaEnd = new Date();

    let estatus: boolean = false;
    let tipoEstatus: string = '';

    let unProveedor: boolean = false;

    let tipoReporte: string;

    if(this.checked == true){
      console.log(this.checked);
      console.log('SE FILTRA POR FECHA');
        fechaStart = this.fechaInicial;
        fechaEnd = this.fechaFinal;
    }
    if(this.checkedProveedores == false){
      console.log(this.checkedProveedores);
      console.log('SE FILTRA POR PROVEEDORES');
        unProveedor = true;
    }

    if(this.tipoCompra == 'Todo'){
        tipoReporte = 'Ambas';
    }
    if(this.tipoCompra == 'MateriaPrima'){
        tipoReporte = 'MateriaPrima';
    }
    if(this.tipoCompra == 'Administrativa'){
        tipoReporte = 'Administrativa';
    }

    if(this.checkedEstatus == true){
      estatus = true;
      tipoEstatus = this.estatusCompra; 
    }
// console.log('TipoReporte', tipoReporte);
// console.log('UnProveedor?', unProveedor);
// console.log('MONEDA:', moneda);
// console.log('IDPROVE', this.IdProveedor);
// console.log('FiltrarFEcha?', this.checked);
// console.log('FiltrarEstatus', estatus);
// console.log('TipoEstatus', tipoEstatus);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "80%";
    dialogConfig.data = {
      tipoReporte: tipoReporte,
      unsoloproveedor: unProveedor,
      moneda: moneda,
      idProveedor: this.IdProveedor,
      filtradoFecha: this.checked,
      fechaInicial: fechaStart,
      fechaFinal: fechaEnd,
      estatus: estatus,
      tipoEstatus: tipoEstatus
      
    }
    this.dialog.open(ShowreporteComprasComponent, dialogConfig);

  }
  abrirReporteFactura(){
    
// console.log(this.IdProveedorFactura);    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "80%";
    dialogConfig.data = {
      tipoReporte: 'Factura',      
      idProveedor: this.IdProveedorFactura,      
      fechaInicial: this.fechaInicialFactura,
      fechaFinal: this.fechaFinalFactura,            
    }
    this.dialog.open(ShowreporteComprasComponent, dialogConfig);

  }

}
