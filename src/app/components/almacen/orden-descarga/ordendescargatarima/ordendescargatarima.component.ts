// import { Component, OnInit, ViewChild } from '@angular/core';
// import { MatDialog, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
// import { Observable } from 'rxjs';
// import { FormControl, NgForm } from '@angular/forms';
// import { OrdenDescargaService } from '../../../../services/almacen/orden-descarga/orden-descarga.service';
// import Swal from 'sweetalert2';
// import { OrdenTemporalService } from 'src/app/services/almacen/orden-temporal/orden-temporal.service';
// import { DetalleOrdenDescarga } from '../../../../Models/almacen/OrdenDescarga/detalleOrdenDescarga-model';

// @Component({
//   selector: 'app-ordendescargatarima',
//   templateUrl: './ordendescargatarima.component.html',
//   styleUrls: ['./ordendescargatarima.component.css']
// })
// export class OrdendescargatarimaComponent implements OnInit {

// rowDTOD:any;
// sacosSaldo:any;
// sacostotal:any;
// saldototal:any;
// IdOrdenDescarga: number;
// Lote: any;
// ClaveProducto: any;
// dataODID = new Array<DetalleOrdenDescarga>();

//   constructor(private dialog: MatDialog,public service: OrdenDescargaService,public ordenTemporalService: OrdenTemporalService,) {

//     this.service.listen().subscribe((m:any)=>{
//       console.log(m);
//       this.refreshOrdenDescargaList();
//       });
//    }

//   listData: MatTableDataSource<any>;
//   displayedColumns: string [] = ['ClaveProducto','Producto', 'Sacos', 'Lote', 'Saldo', 'Options'];
//   @ViewChild(MatSort, null) sort : MatSort;
//   @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  



//   ngOnInit() {
//     console.clear();
//     this.IdOrdenDescarga = +(localStorage.getItem('IdOrdenDescarga'));
//     this.refreshOrdenDescargaList();
//     //igualar en 0s el arreglo que se encuentra en el servicio
//     this.ordenTemporalService.preOrdenTemporalOD = [];
//     console.log(this.ordenTemporalService.preOrdenTemporalOD);
//   }

//   refreshOrdenDescargaList(){   
//     this.service.getOrdenDescargaIDList(this.IdOrdenDescarga).subscribe(dataID =>{ 

//       console.log(dataID,'detalles DOD a asignarse');
//       // recorrer tantos conceptos tenga la OD
//       for (let i = 0; i <= dataID.length - 1; i++) {
//       this.dataODID[i] = dataID[i];

    
//     this.service.getDetalleOrdenDescargaIdLoteClave(this.IdOrdenDescarga,this.dataODID[i].Lote, this.dataODID[i].ClaveProducto).subscribe(data =>{
//     console.log(data,'IDLOTECP');
//     let DOD = new DetalleOrdenDescarga();

//     DOD.IdDetalleOrdenDescarga = this.dataODID[i].IdDetalleOrdenDescarga;
//     DOD.IdOrdenDescarga = this.dataODID[i].IdOrdenDescarga;
//     DOD.ClaveProducto = this.dataODID[i].ClaveProducto
//     DOD.Producto = this.dataODID[i].Producto
//     DOD.Sacos = this.dataODID[i].Sacos
//     DOD.PesoxSaco = this.dataODID[i].PesoxSaco
//     DOD.Lote = this.dataODID[i].Lote
//     DOD.IdProveedor = this.dataODID[i].IdProveedor
//     DOD.PO = this.dataODID[i].PO
//     DOD.FechaMFG = this.dataODID[i].FechaMFG
//     DOD.FechaCaducidad = this.dataODID[i].FechaCaducidad
//     DOD.Shipper = this.dataODID[i].Shipper
//     DOD.USDA = this.dataODID[i].USDA
//     DOD.Pedimento = this.dataODID[i].Pedimento
//     DOD.Saldo = this.dataODID[i].Saldo
// console.log(DOD,'asasasasasas');
//     this.ordenTemporalService.preOrdenTemporalOD.push(DOD);


      
      
//         this.listData = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporalOD);
//         this.listData.sort = this.sort;
//         this.listData.paginator = this.paginator;
//         this.listData.paginator._intl.itemsPerPageLabel = 'Ordenes de Descarga por Pagina';
    
//         // this.service.getOrdenCargaList().subscribe(data => {
//         //   console.log(data);
          
//         // });
//       })
//       }
//     })
//       }
    

//   onEdit(row){
// this.rowDTOD = row;
// console.log(this.rowDTOD.Sacos,'sacos en total');
// console.log(this.rowDTOD.Saldo,'saldo al momento');
// let sacosMaximos = +this.rowDTOD.Sacos;
// let saldoMaximo = +this.rowDTOD.Saldo;
// let sacosIngreso;

// if (saldoMaximo < sacosMaximos){}
//   }

//   onBlursacos(form:NgForm){
    
//     console.log(this.sacosSaldo,'ingresado');


//   }

// regresar(){
  
// }



// }
