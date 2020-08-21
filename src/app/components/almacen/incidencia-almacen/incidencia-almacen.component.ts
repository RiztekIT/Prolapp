import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { NgForm, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { IncidenciasService } from '../../../services/almacen/incidencias/incidencias.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-incidencia-almacen',
  templateUrl: './incidencia-almacen.component.html',
  styleUrls: ['./incidencia-almacen.component.css']
})
export class IncidenciaAlmacenComponent implements OnInit {

  constructor(public dialogbox: MatDialogRef<IncidenciaAlmacenComponent>, private dialog: MatDialog, public incidenciasService: IncidenciasService) { }

  ngOnInit() {
    console.log(this.incidenciasService.incidenciaObject);
    if(this.incidenciasService.incidenciaObject.FolioProcedencia){
// console.log('Incidencia Existente');
this.procedenciaSeleccionada = this.incidenciasService.incidenciaObject.Procedencia;
this.obtenerInformacionOrden(this.incidenciasService.incidenciaObject.Procedencia);
    }
  }

  //Id de la Orden Carga/Descarga
  IdOrden: number = 0;

  
  //Dropdown Procedencias
  myControlProcedencia = new FormControl();
  //Lista de Procedencias
  public listProcedencias: Array<Object> = [
    { procedencia: 'OrdenCarga' },
    { procedencia: 'OrdenDescarga' }
  ];
  procedenciaSeleccionada: string ="";

  //Dropdown Tipo incidencia
  myControlTipoIncidencia = new FormControl();
  //Lista de Tipo de Incidencias
  public listTipoIncidencia: Array<Object> = [
    { tipo: 'Merma' },
    { tipo: 'Reparacion' },
    { tipo: 'Devolucion' }
  ];

  tipoIncidenciaSeleccionada: string="";

  //Dropdown Estatus
  myControlEstatus = new FormControl();
  //Lista de Estados
  public listEstatus: Array<Object> = [
    { estado: 'Iniciada' },
    { estado: 'Pendiente' },
    { estado: 'Finalizada' }
  ];

  estatusSeleccionado: string="";

    
  //Dropdown Detalles
  myControlDetalles = new FormControl();
  filteredOptionsDetalles: Observable<any[]>;
  optionsDetalle: any[] = [];
  detalleSeleccionado: string ="";
    Cantidad:number =1;
    IdDetalle: number;

 obtenerInformacionOrden(procedencia: string){
  if(procedencia == 'OrdenCarga'){
    this.incidenciasService.getOrdenCargaFolio(this.incidenciasService.incidenciaObject.FolioProcedencia).subscribe(resOC=>{
      // console.log(resOC);
      if(resOC.length>0){
        this.IdOrden = resOC[0].IdOrdenCarga
        this.dropdownRefreshDetalles('OrdenCarga');
        console.log('Orden Carga', this.IdOrden);
      }else{
        this.filteredOptionsDetalles = new Observable<any>();
        this.detalleSeleccionado = "";
        Swal.fire({
          title: 'Folio Incorrecto',
          icon: 'error',  
        });
      }
    })

  }else if(procedencia == 'OrdenDescarga'){
    this.incidenciasService.getOrdenDescargaFolio(this.incidenciasService.incidenciaObject.FolioProcedencia).subscribe(resOD=>{
      // console.log(resOD);
      if(resOD.length > 0){
        this.IdOrden = resOD[0].IdOrdenDescarga;
        this.dropdownRefreshDetalles('OrdenDescarga');
        console.log('Orden Descarga', this.IdOrden);
      }else{
        this.filteredOptionsDetalles = new Observable<any>();
        this.detalleSeleccionado = "";
        Swal.fire({
          title: 'Folio Incorrecto',
          icon: 'error',  
        });
      }
   
    })
  }
 }

  dropdownRefreshDetalles(procedencia: string) {
    this.optionsDetalle = [];
    this.filteredOptionsDetalles = new Observable<any>();
    if(procedencia == 'OrdenCarga'){
      this.incidenciasService.getListOrdenCargaId(this.IdOrden).subscribe(dataP => {
        for (let i = 0; i < dataP.length; i++) {
          let product = dataP[i];
          product.IdDetalle = dataP[i].IdDetalleOrdenCarga;
          this.optionsDetalle.push(product)
          this.filteredOptionsDetalles = this.myControlDetalles.valueChanges
            .pipe(
              startWith(''),
              map(value => this._filterDetalles(value))
            );
        }
      });
    }else if(procedencia == 'OrdenDescarga'){
      this.incidenciasService.getListOrdenDescargaId(this.IdOrden).subscribe(dataP => {
        for (let i = 0; i < dataP.length; i++) {
          let product = dataP[i];
          product.IdDetalle = dataP[i].IdDetalleOrdenDescarga;
          this.optionsDetalle.push(product)
          this.filteredOptionsDetalles = this.myControlDetalles.valueChanges
            .pipe(
              startWith(''),
              map(value => this._filterDetalles(value))
            );
        }
      });
    }
    

  }

  private _filterDetalles(value: any): any[] {
    // console.clear();
    // console.log(value);
    if (typeof (value) == 'string') {
      const filterValue2 = value.toLowerCase();
      return this.optionsDetalle.filter(option => option.ClaveProducto.toString().toLowerCase().includes(filterValue2) || option.Producto.toString().toLowerCase().includes(filterValue2));
    } else if (typeof (value) == 'number') {
      const filterValue2 = value.toString();
      return this.optionsDetalle.filter(option => option.ClaveProducto.toString().includes(filterValue2) || option.Producto.toString().includes(filterValue2));
    }


  }

  onSelectionChangeProcedencia(procedencia: any, event: any){
    if (event.isUserInput) {
          // console.log(procedencia);
          // console.log(event);
          this.procedenciaSeleccionada = procedencia;
          this.obtenerInformacionOrden(procedencia)
         
          // this.NombreProveedor = options.Nombre;
          // this.compra.Proveedor = options.Nombre;
        }
  }
  onSelectionChangeDetalle(options: any, event: any){
    if (event.isUserInput) {
          console.log(options);
          console.log(event);
          this.detalleSeleccionado = options.ClaveProducto;
          this.IdDetalle = options.IdDetalle;
          // this.NombreProveedor = options.Nombre;
          // this.compra.Proveedor = options.Nombre;
        }
  }

  onSelectionChangeTipoIncidencia(options: any, event: any){
    if(event.isUserInput){
      console.log(options);

    }
  }

  //On change Cantidad
  onChangeCantidadSacos(cantidad: any) {
    // console.log(cantidad);
    let elemHTML: any = document.getElementsByName('cantidadSacos')[0];
    this.validarCantidad(cantidad);
    elemHTML.value = this.Cantidad;
  }

  //Validar que la cantidad sea >=0
  validarCantidad(cantidad: any) {
    this.Cantidad = +cantidad;
    if (this.Cantidad <= 0) {
      this.Cantidad = 0;
    }
    if (this.Cantidad == null) {
      this.Cantidad = 0;
    }
  }

  guardarIncidencia(){
    this.incidenciasService.incidenciaObject.Cantidad = this.Cantidad.toString();
    this.incidenciasService.incidenciaObject.TipoIncidencia = this.tipoIncidenciaSeleccionada;
    this.incidenciasService.incidenciaObject.Estatus = this.estatusSeleccionado;
    console.log(this.incidenciasService.incidenciaObject);
    
  }

  onClose() {
    this.dialogbox.close();
  }

}
