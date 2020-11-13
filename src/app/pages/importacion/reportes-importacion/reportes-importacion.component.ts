import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import {ThemePalette} from '@angular/material/core';
import { MatDialog, MatDialogConfig, MatSnackBar, MatDivider, MAT_DATE_LOCALE } from '@angular/material';
import { OrdenCargaService } from '../../../services/almacen/orden-carga/orden-carga.service';
import { DocumentosImportacionService } from '../../../services/importacion/documentos-importacion.service';
import { ShowreporteImportacionComponent } from './showreporte-importacion/showreporte-importacion.component';

@Component({
  selector: 'app-reportes-importacion',
  templateUrl: './reportes-importacion.component.html',
  styleUrls: ['./reportes-importacion.component.css']
})
export class ReportesImportacionComponent implements OnInit {

  constructor(public ocService: OrdenCargaService, private dialog: MatDialog, public documentosService: DocumentosImportacionService) { }

  ngOnInit() {
 this.obtenerDocumentos();
  }

   //^Fechas de reportes a ser filtradas
   fechaInicialDocumento: Date;
   fechaFinalDocumento: Date;

   fechaInicialTraspaso: Date;
   fechaFinalTraspaso: Date;
 
 
 //^Variable para Filtrar por fechas Documentos
 color: ThemePalette = 'accent';
 checkedFechasDocumento = false;
 disabledFechasDocumento = false;
 checkedDocumento = true;
 checkedEstatusDocumento = false;
 disabledEstatusDocumento = true;
 
 //^Variable para Filtrar por fechas Traspaso
   checkedFechasTraspaso = false;
   disabledFechasTraspaso = false;
   checkedTraspaso = true;
   checkedEstatusTraspaso = false;
   disabledEstatusTraspaso = true;
 
 
   //^variable estatus de la Documento
   estatusDocumento: string;
   
   //variable estatus de la Traspaso (creada, preparada, cargada, enviada, terminada)
   estatusTraspaso: string = 'Creada';

   bodegaOrigen: string = 'PasoTx'
   bodegaDestino: string = 'Chihuahua'
 

   //variables dropdown clientes Cotizacion
  //  myControlCotizacion = new FormControl();
  //  filteredOptionsCotizacion: Observable<any[]>
  //  optionsCotizacion: Cliente[] = [];
  //  CotizacionClienteNombre: any;
  //  CotizacionIdCliente: number;

   //^ variables dropdown tipo modulo y folio Documento
   myControlDocumento = new FormControl();
   filteredOptionsDocumento: Observable<any[]>
   optionsDocumento: any[] = [];
   DocumentoSeleccionado = "";
   DocumentoFolio: any;
   DocumentoModulo: any;
   DocumentoTipo: any;
 
 
  //  //Lista de Estatus Pedido
  //  public listEstatusPedido: Array<Object> = [
  //    { tipo: 'Guardada' },
  //    { tipo: 'Cerrada' },
  //  ];
 
   //Lista de Estatus Traspaso
   public listEstatusTraspaso: Array<Object> = [
     { tipo: 'Creada' },
     { tipo: 'Preparada' },
     { tipo: 'Cargada' },
     { tipo: 'Terminada' },
     { tipo: 'Enviada' }
   ];
   //Lista de Bodegas
   public listBodegas: Array<Object> = [
     { tipo: 'Chihuahua' },
     { tipo: 'PasoTx' },
     { tipo: 'SAN DIEGO' }
   ];

     obtenerDocumentos(){
       this.documentosService.getReporteDocumentosInfo().subscribe(data=>{
         console.log(data);
         for (let i = 0; i < data.length; i++) {
           let doc = data[i];
           this.optionsDocumento.push(doc)
           this.filteredOptionsDocumento= this.myControlDocumento.valueChanges
             .pipe(
               startWith(''),
               map(value => this._filterDocumento(value))
             );
         }
       })
     }
   
     _filterDocumento(value: any): any {
       const filterValue = value.toString().toLowerCase();
      return this.optionsDocumento.filter(option =>
        option.Tipo.toLowerCase().includes(filterValue) ||
        option.Modulo.toLowerCase().includes(filterValue) ||
        option.Folio.toString().includes(filterValue));
    }


    //Al filtrar por fecha
    onChangePorFechaDocumento(){
      if(this.checkedFechasDocumento == true){
        this.checkedFechasDocumento = false;
      }else{
        this.checkedFechasDocumento = true;
      }
        }
    onChangePorFechaTraspaso(){
      if(this.checkedFechasTraspaso == true){
        this.checkedFechasTraspaso = false;
      }else{
        this.checkedFechasTraspaso = true;
      }
        }
  

      //   onSelectionChangeCotizacion(cliente: Cliente, event: any) {
      //     console.log(cliente);
      //   this.CotizacionClienteNombre = cliente.Nombre;
      // }
        onSelectionChangeDocumento(doc: any, event: any) {
          console.log(doc);
        this.DocumentoFolio = doc.Folio;
        this.DocumentoTipo = doc.Tipo;
        this.DocumentoModulo = doc.Modulo;
      }

      //Al filtrar cliente
      // onChangeTodosClientesCotizacion(){
      //   if(this.checkedClientesCotizacion == true){
      //     this.checkedClientesCotizacion = false;
      //   }else{
      //     this.checkedClientesCotizacion = true;
      //   }
      // }
      onChangeTodosDocumentos(){
        if(this.checkedDocumento == true){
          this.checkedDocumento= false;
        }else{
          this.checkedDocumento = true;
        }
      }

//       //cuando se filtarara por estatus
//   onChangeEstatusCotizacion(){
//     if(this.checkedEstatusCotizacion == true){
//       this.checkedEstatusCotizacion = false;
//     }else{
//       this.checkedEstatusCotizacion = true;
//     }
//   }
// //cuando se selecciona un estatus Cotizacion
//   changeEstatusCotizacion(event){
//     console.log(event);
//     this.estatusCotizacion = event.target.selectedOptions[0].text;
//   }
      //cuando se filtarara por estatus Traspaso
  onChangeEstatusTraspaso(){
    if(this.checkedEstatusTraspaso == true){
      this.checkedEstatusTraspaso = false;
    }else{
      this.checkedEstatusTraspaso = true;
    }
  }
//cuando se selecciona un estatus traspaso
  changeEstatusTraspaso(event){
    console.log(event);
    this.estatusTraspaso = event.target.selectedOptions[0].text;
  }

  changeBodegaOrigen(event){
    console.log(event);
    this.bodegaOrigen = event.target.selectedOptions[0].text;
  }

  changeBodegaDestino(event){
    console.log(event);
    this.bodegaDestino = event.target.selectedOptions[0].text;
  }

  abrirReporte(modulo: string){

    console.log(modulo);

    //Variables generales
    let filtrarFecha: boolean;
    let fechaStart = new Date();
    let fechaEnd = new Date();

    let estatus: boolean = false;
    let tipoEstatus: string = '';

    let unDocumento: boolean = false;

if(modulo == 'Documento'){
  if(this.checkedFechasDocumento == true){
    // console.log('SE FILTRA POR FECHA');
      fechaStart = this.fechaInicialDocumento;
      fechaEnd = this.fechaFinalDocumento;
      filtrarFecha = true;
  }else{
    filtrarFecha = false;
  }
  if(this.checkedDocumento == false){
    // console.log(this.checkedProveedores);
    // console.log('SE FILTRA POR PROVEEDORES');
      unDocumento = true;
  }else{
    unDocumento = false
  }

}else if ('Traspaso'){

  if(this.checkedFechasTraspaso == true){
    // console.log('SE FILTRA POR FECHA');
      fechaStart = this.fechaInicialTraspaso;
      fechaEnd = this.fechaFinalTraspaso;
      filtrarFecha = true;
  }else{
    filtrarFecha = false;
  }
  if(this.checkedEstatusTraspaso == true){
    estatus = true;
    tipoEstatus = this.estatusTraspaso; 
  }
}
    
console.log('TipoReporte', modulo);
console.log('UnDocumento?', unDocumento);
console.log('Modulo', this.DocumentoModulo);
console.log('Tipo', this.DocumentoTipo);
console.log('Folio', this.DocumentoFolio);
console.log('FiltrarFecha?', filtrarFecha);
console.log('FechaInicial', fechaStart);
console.log('FechaFinal', fechaEnd);
console.log('FiltrarEstatus', estatus);
console.log('TipoEstatus', tipoEstatus);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    dialogConfig.data = {
      modulo: modulo,
      unDocumento: unDocumento,
      documentoTipo: this.DocumentoTipo,
      documentoModulo: this.DocumentoModulo,
      documentoFolio: this.DocumentoFolio,
      filtradoFecha: filtrarFecha,
      fechaInicial: fechaStart,
      fechaFinal: fechaEnd,
      bodegaOrigen: this.bodegaOrigen,
      bodegaDestino: this.bodegaDestino,
      estatusTraspaso: estatus,
      tipoEstatus: tipoEstatus
      
    }
    this.dialog.open( ShowreporteImportacionComponent, dialogConfig);

  }

}
