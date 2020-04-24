import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Observable } from 'rxjs';
import { FormControl, NgForm } from '@angular/forms';
import { OrdenDescargaService } from '../../../../../services/almacen/orden-descarga/orden-descarga.service';
import Swal from 'sweetalert2';
import { OrdenTemporalService } from 'src/app/services/almacen/orden-temporal/orden-temporal.service';
import { DetalleOrdenDescarga } from '../../../../../Models/almacen/OrdenDescarga/detalleOrdenDescarga-model';

@Component({
  selector: 'app-ordendescargatarima',
  templateUrl: './ordendescargatarima.component.html',
  styleUrls: ['./ordendescargatarima.component.css']
})
export class OrdendescargatarimaComponent implements OnInit {

rowDTOD:any;
sacosSaldo:any;
sacostotal:any;
saldototal:any;
IdOrdenDescarga: number;
Lote: any;
cantidadSacos: number;
ClaveProducto: any;
dataODID = new Array<DetalleOrdenDescarga>();
cantidadMaximaSacos: number;

  constructor(private dialog: MatDialog, public service: OrdenDescargaService, public ordenTemporalService: OrdenTemporalService,) {
    this.service.listen().subscribe((m:any)=>{
      console.log(m);
      this.refreshOrdenDescargaList();
      });
   }

   //tabla visualizacion
   listData: MatTableDataSource<any>;
   displayedColumns: string [] = ['ClaveProducto','Producto', 'Sacos', 'SacosIngresados', 'Lote', 'Saldo', 'Options'];
   @ViewChild(MatSort, null) sort : MatSort;
   @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

   // Tabla Orden Temporal
  listDataOrdenTemporal: MatTableDataSource<any>;
  displayedColumnsOrdenTemporal: string[] = ['QR', 'ClaveProducto', 'Producto', 'Lote', 'Sacos', 'PesoTotal', 'FechaCaducidad', 'Comentarios', 'Options'];
  @ViewChild(MatSort, null) sortOrdenTemporal: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginatorOrdenTemporal: MatPaginator;

  ngOnInit() {
    console.clear();
    this.IdOrdenDescarga = +(localStorage.getItem('IdOrdenDescarga'));
    this.refreshOrdenDescargaList();
    //igualar en 0s el arreglo que se encuentra en el servicio
    this.ordenTemporalService.preOrdenTemporalOD = [];
    console.log(this.ordenTemporalService.preOrdenTemporalOD);
  }
  refreshOrdenDescargaList(){   
    this.service.getOrdenDescargaIDList(this.IdOrdenDescarga).subscribe(dataID =>{ 

      console.log(dataID,'detalles DOD a asignarse');
      // recorrer tantos conceptos tenga la OD
      for (let i = 0; i <= dataID.length - 1; i++) {
      this.dataODID[i] = dataID[i];

    
    this.service.getDetalleOrdenDescargaIdLoteClave(this.IdOrdenDescarga,this.dataODID[i].Lote, this.dataODID[i].ClaveProducto).subscribe(data =>{
    console.log(data,'IDLOTECP');
    let DOD = new DetalleOrdenDescarga();

    DOD.IdDetalleOrdenDescarga = this.dataODID[i].IdDetalleOrdenDescarga;
    DOD.IdOrdenDescarga = this.dataODID[i].IdOrdenDescarga;
    DOD.ClaveProducto = this.dataODID[i].ClaveProducto
    DOD.Producto = this.dataODID[i].Producto
    DOD.Sacos = this.dataODID[i].Sacos
    DOD.Lote = this.dataODID[i].Lote
    DOD.Saldo = this.dataODID[i].Saldo
    DOD.SacosIngresados = '0'
    console.log(DOD,'asasasasasas');
    this.ordenTemporalService.preOrdenTemporalOD.push(DOD);
        this.listData = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporalOD);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
        this.listData.paginator._intl.itemsPerPageLabel = 'Ordenes de Descarga por Pagina';
    
        // this.service.getOrdenCargaList().subscribe(data => {
        //   console.log(data);
          
        // });
      })
      }
    })
      }
    

      IngresoSacos(row){
this.rowDTOD = row;
console.log(this.rowDTOD);
this.ordenTemporalService.posicionOrdenTemporalOD = this.rowDTOD.IdDetalleOrdenDescarga;

//asigna el id del producto a la posicion para que se le puedan asignar los valores al dato temporal en tabla -1
console.log(this.ordenTemporalService.posicionOrdenTemporalOD,'Posicion');

if(this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD -1].Saldo != this.rowDTOD.Sacos){
  this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD -1].SacosIngresados = '0'
  this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD -1].Saldo = this.rowDTOD.Sacos
}

console.log(this.rowDTOD.Sacos,'Sacos en total');
console.log(this.rowDTOD.Saldo,'Saldo al momento');

  }

      validarCantidad() {
      this.cantidadSacos = this.sacosSaldo;
      this.cantidadMaximaSacos = +this.rowDTOD.Sacos;
      
      if ((+this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD -1].Saldo - +this.cantidadSacos) < 0) {
        this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD -1].Saldo = '0'
      }
      else{
        if (this.sacosSaldo >= this.cantidadMaximaSacos) {
          this.cantidadSacos = this.cantidadMaximaSacos;
        }
        if (this.sacosSaldo <= 0) {
          this.cantidadSacos = 0;
        }
        if (this.sacosSaldo == null) {
          this.cantidadSacos = 0;
        }
        this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD -1].SacosIngresados = this.cantidadSacos.toString();
        this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD -1].Saldo = (+this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD -1].Saldo - +this.cantidadSacos.toString()).toString();
      }
    }

  addSacos(form: NgForm){
    this.validarCantidad();
    console.log(this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD -1].Sacos,'Cantidad de sacos');
    console.log(this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD -1].SacosIngresados,'Sacos ingresados');
    console.log(+this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD -1].Saldo - +this.cantidadSacos.toString(),'resta' ) 
  }

  

regresar(){
  
}



}
