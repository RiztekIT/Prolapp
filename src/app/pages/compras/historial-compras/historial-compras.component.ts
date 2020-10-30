import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CompraService } from '../../../services/compras/compra.service';
import { DetalleOrdenDescarga } from '../../../Models/almacen/OrdenDescarga/detalleOrdenDescarga-model';
import { OrdenDescargaService } from '../../../services/almacen/orden-descarga/orden-descarga.service';
import { ComprasHistorial } from 'src/app/Models/Compras/comprahistorial-model';
import { PageEvent, ThemePalette } from '@angular/material';
import { DatePipe } from '@angular/common';


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
  checkedProveedores = true;
  
  pageSlice
  //Fechas de reportes a ser filtradas
  fechaInicial: string
  fechaFinal: string
  
  
  
  constructor(public comprasService: CompraService,
    public OrdenDescargaService: OrdenDescargaService,
    private datePipe: DatePipe
    ) { }
    
    ngOnInit() {
      this.checked = false;
      this.GetcompraList()
  }
  
  // ^ obtener todas las compras para llenar el arreglo y desplegar las compras en html
  GetcompraList(dataCompras?) {
    this.compraInfo = []
    // ^ obtiene todas las compras
    
    console.log('%c%s', 'color: #7f7700', this.checked);
    if (this.checked == false) {
      console.log('%c%s', 'color: #99adcc', 'entro False');
      this.comprasService.getComprasHistorialList().subscribe(compras => {
        // console.clear();
        // console.log('%c%s', 'color: #731d1d', compras);
        // console.log('compras: ', compras);
        
        this.llenarCompras(compras)
  
      })
      
    } else {
      
      console.log('%c%s', 'color: #f279ca', 'Else');
      
      this.llenarCompras(dataCompras)
    }
    
  }
  
  llenarCompras(compras){
    // ^ por cada compra, se hara el push al arreglo
    compras.forEach((element, index) => {
      
      let IdCompraOD = +element.Ver
  
      this.compraInfo.push(element)
  
      // ^ se crea el espacio de los detalles en blanco para ser llenado luego
      this.compraInfo[index].OrdenDescargaDODCompras = []
      this.OrdenDescargaService.GetODDOD(IdCompraOD).subscribe(res => {
  
        // ^ obtiene cada orden de descarga perteneciente a esta compra y llena el arreglo con OD y DOD
        res.forEach((elementODDOD, indexRES) => {
  
          this.compraInfo[index].OrdenDescargaDODCompras.push(elementODDOD)
          this.pageSlice = this.compraInfo.slice(0,3)

        });
      })
    });
    
}




  // ^ metodo para filtrar las compras por fecha
  // & se pasa como parametro el rango de fechas(Inicial y final)
  filtroFecha() {
    
    this.fechaInicial = this.datePipe.transform(this.fechaInicial, 'yyyy-MM-dd');
    this.fechaFinal = this.datePipe.transform(this.fechaFinal, 'yyyy-MM-dd');

    
    console.log('%c%s', 'color: #00ff88', this.fechaInicial);
    
    console.log('%c%s', 'color: #00258c', this.fechaFinal);

    this.comprasService.getComprasFecha(this.fechaInicial, this.fechaFinal).subscribe(res => {
      // console.log(res);
      this.GetcompraList(res);
    })

  }

  onChangePorFecha() {
    if (this.checked == true) {
      this.checked = false;
      this.GetcompraList(null);
    } else {
      this.checked = true;
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
}
