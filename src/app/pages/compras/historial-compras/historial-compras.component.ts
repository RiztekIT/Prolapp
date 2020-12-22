import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { CompraService } from '../../../services/compras/compra.service';
import { DetalleOrdenDescarga } from '../../../Models/almacen/OrdenDescarga/detalleOrdenDescarga-model';
import { OrdenDescargaService } from '../../../services/almacen/orden-descarga/orden-descarga.service';
import { ComprasHistorial } from 'src/app/Models/Compras/comprahistorial-model';
import { MatDialog, MatDialogConfig, MatTableDataSource, PageEvent, ThemePalette } from '@angular/material';
import { DatePipe } from '@angular/common';
import { ComprasPdfComponent } from 'src/app/components/compras-reporte/compras-pdf.component';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Proveedor } from 'src/app/Models/catalogos/proveedores-model';
import { map, startWith } from 'rxjs/operators';

import Swal from 'sweetalert2';
import { Compras } from '../../../Models/Compras/compra-model';


@Component({
  selector: 'app-historial-compras',
  templateUrl: './historial-compras.component.html',
  styleUrls: ['./historial-compras.component.css']
})
export class HistorialComprasComponent implements OnInit {
  
  compraInfo: ComprasHistorial[] = [];
  
  
  // ^ Variable para Filtrar por fechas / proveedores
  color: ThemePalette = 'accent';
  checked = false;
  disabled = false;
  
  pageSlice
  //! Fechas de reportes a ser filtradas
  fechaInicial: string
  fechaFinal: string

  //! Filtrar por estatus
  checkedEstatus = false;

  //! Filtrar por Folio
  checkedFolio = false;

    //variable estatus de la Compra (creada, guardada, transito, terminada, cerrada, administrativa)
    estatusCompra: string;

      //Lista de Estatus
  public listEstatus: Array<Object> = [
    { tipo: 'Guardada' },
    { tipo: 'Transito' },
    { tipo: 'Terminada' }
  ];
  
  //! Variables de DropDown Proveedores
  checkedProveedores = false;
  myControl = new FormControl();
  filteredOptions: Observable<any[]>
  options: Proveedor[] = [];
  ProveedroNombre: any;
  IdProveedor: number;


  
  
  constructor(public comprasService: CompraService,
    public OrdenDescargaService: OrdenDescargaService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    ) { }
    
    ngOnInit() {
      this.obtenerProveedores()
      this.GetcompraList()
  }
  
  // ^ obtener todas las compras para llenar el arreglo y desplegar las compras en html
  GetcompraList(dataCompras?, tipo?) {
    this.compraInfo = []
    // ^ obtiene todas las compras
    
    console.log('%c%s', 'color: #33cc99', tipo);
    
    switch (tipo) {
      case ('Fechas'):
    if (this.checked == true) {
      console.log('%c%s', 'color: #99adcc', 'entro False');
      this.comprasService.getComprasFecha(this.fechaInicial, this.fechaFinal).subscribe(res => {
        // console.clear();
        // console.log('%c%s', 'color: #731d1d', compras);
        console.log('res: ', res);
        
        this.llenarCompras(res)
    
      })
      
    } else {
      
      // console.log('%c%s', 'color: #f279ca', 'Else');
      
      this.llenarCompras(dataCompras)
    }
    
    break;
    case ('Proveedor'):
      if (this.checkedProveedores == true) {
        this.comprasService.GetComprasODDIdProveedor(this.IdProveedor).subscribe(comprasProveedor => {
          console.log(comprasProveedor);
          this.llenarCompras(comprasProveedor)
        })
      } else {
        this.llenarCompras(dataCompras)
      }
      
      break;
      case ('Estatus'):
        if (this.checkedEstatus == true) {
          
          this.comprasService.GetComprasODDEstatus(this.estatusCompra).subscribe(comprasEstatus => {comprasEstatus
            console.log(comprasEstatus);
            this.llenarCompras(comprasEstatus)
          })
        } else {
        }
        
        break;
        case ('Folio'):
          if (this.checkedFolio == true) {
            
            this.comprasService.getComprasFolio(this.folioCompra).subscribe(ComprasFolio=>{
              if (ComprasFolio.length > 0) {
                console.log(ComprasFolio);
                this.llenarCompras(ComprasFolio)
              
            } else {
              console.log('no hay na');
            }
          });
        } else {
        }
        
        break;
        
        default:
          
          console.log('%c%s', 'color: #364cd9', 'entra default');
          this.comprasService.GetComprasOrderFolio().subscribe(compras => {
            console.clear();
            // console.log('%c%s', 'color: #731d1d', compras);
            console.log('compras: ', compras);
            
            this.llenarCompras(compras)
        
          })
          break;
        }
        
        
        
      }

      Descargados = []
      KgDescargados = []
      
      llenarCompras(compras){
        this.Descargados = []
        this.KgDescargados = []
        console.log('%c%s', 'color: #ffa280', compras);
        // ^ por cada compra, se hara el push al arreglo
        console.clear();
        if (compras.length > 0) {
          compras.forEach((element, index) => {
            
            let IdCompraOD = +element.Ver
            
            this.compraInfo.push(element)
            
            // ^ se crea el espacio de los detalles en blanco para ser llenado luego
            this.compraInfo[index].OrdenDescargaDODCompras = []
            this.OrdenDescargaService.GetODDOD(IdCompraOD).subscribe(res => {
              // ^ obtiene cada orden de descarga perteneciente a esta compra y llena el arreglo con OD y DOD
              res.forEach((elementODDOD, indexRES) => {
                console.log('%c⧭', 'color: #00ff88', elementODDOD);
                elementODDOD.KgDescargados = (+elementODDOD.Kg - +elementODDOD.Saldo).toString()

// this.Descargados[indexRES].push(this.KgDescargados[indexRES])




// console.log('%c⧭', 'color: #00ff62', this.Descargados);
this.compraInfo[index].OrdenDescargaDODCompras.push(elementODDOD)
this.pageSlice = this.compraInfo.slice(0,3)

});
})
});
          
    } else {
      Swal.fire({
        title: 'No hay Registros',
        icon: 'warning',
        timer: 2000,
        showCancelButton: false,
        showConfirmButton: false
      });
    }
    
  }

  
  
  
  // ^ metodo para filtrar las compras por fecha
  // & se pasa como parametro el rango de fechas(Inicial y final)
  filtroFecha() {
    
    this.fechaInicial = this.datePipe.transform(this.fechaInicial, 'yyyy-MM-dd');
    this.fechaFinal = this.datePipe.transform(this.fechaFinal, 'yyyy-MM-dd');

    
    console.log('%c%s', 'color: #00ff88', this.fechaInicial);
    
    console.log('%c%s', 'color: #00258c', this.fechaFinal);

    
      this.GetcompraList(null, 'Fechas');

  }

  onChangePorFecha() {
    if (this.checked == true) {
      this.checked = false;
      this.GetcompraList(null);
    } else {
      this.checked = true;
      this.checkedFolio = false;
      this.checkedEstatus = false
      this.checkedProveedores = false
    }
  }

  OnPageChange(event?: PageEvent){
    console.log('event: ', event);
    console.log('this.compraInfo.length: ', this.compraInfo.length);

    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if (endIndex > this.compraInfo.length){
      endIndex = this.compraInfo.length;
    }
    this.pageSlice = this.compraInfo.slice(startIndex, endIndex)
  }

  openrep(row){
    console.clear();
      console.log(row);
      this.comprasService.getDetalleComprasID(row.IdCompra).subscribe(res =>{
        console.log(res);

        this.comprasService.formt = row
        // console.log();
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width="70%";
        dialogConfig.data ={
          OrigenConsulta: 'Historial',
          datos: res
        }
        this.dialog.open(ComprasPdfComponent, dialogConfig);

      })
    
    }

    obtenerProveedores(){
      this.comprasService.getProveedoresList().subscribe(data=>{
        // console.log(data);
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

// !dropdown proveedores
    onSelectionChange(proveedor: Proveedor, event: any) {
      console.log(proveedor);
    this.ProveedroNombre = proveedor.Nombre;
  }

  onChangeTodosProveedores(){
    if(this.checkedProveedores == true){
      this.checkedProveedores = false;
      this.GetcompraList(null);
    }else{
      this.checkedProveedores = true;
      this.checkedFolio = false;
      this.checkedEstatus = false
      this.checked = false
    }
  }



//! Filtro por Folio
    onChangeFolio(){
      if(this.checkedFolio == true){
        this.checkedFolio = false;
        
        console.log('%c%s', 'color: #00a3cc', 'tabaprendio');
        this.GetcompraList(null);
      }else{
        this.checkedFolio = true;
        this.checkedEstatus = false
        this.checkedProveedores = false
        this.checked = false
      }
    }

//! Filtro por estatus
    onChangeEstatus(){
      if(this.checkedEstatus == true){
        this.checkedEstatus = false;
      this.GetcompraList(null);
      }else{
        this.checkedEstatus = true;
        this.checkedFolio = false;
        this.checkedProveedores = false
        this.checked = false
      }
    }

    //^ cuando se selecciona un estatus
  changeEstatus(event){
    this.estatusCompra = event.target.selectedOptions[0].text;
    console.log('%c%s', 'color: #e5de73', this.estatusCompra );
    this.GetcompraList(null,'Estatus');
    
  }
  
  
  
  obtenerReporteUnProveedor(){
    console.log(this.IdProveedor);
    
    this.GetcompraList(null,'Proveedor');
    
  }
  folioCompra:number;
  
  applyFilter(filtervalues: string) {
    this.compraInfo = []
    //  console.log('%c%s', 'color: #d0bfff', this.compraInfo);
    if (filtervalues.length != 0) {
      this.folioCompra = +filtervalues
      
      this.GetcompraList(null,'Folio');
      
    } else {
      this.GetcompraList()
    }
}













}
