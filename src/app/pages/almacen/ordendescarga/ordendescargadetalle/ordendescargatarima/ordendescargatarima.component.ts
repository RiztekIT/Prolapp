import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Observable } from 'rxjs';
import { FormControl, NgForm } from '@angular/forms';
import { OrdenDescargaService } from '../../../../../services/almacen/orden-descarga/orden-descarga.service';
import Swal from 'sweetalert2';
import { OrdenTemporalService } from 'src/app/services/almacen/orden-temporal/orden-temporal.service';
import { DetalleOrdenDescarga } from '../../../../../Models/almacen/OrdenDescarga/detalleOrdenDescarga-model';
import { OrdenTemporal } from 'src/app/Models/almacen/OrdenTemporal/ordenTemporal-model';
import { Router } from '@angular/router';
import { preOrdenTemporalOD } from '../../../../../Models/almacen/OrdenTemporal/preOrdenTemporalOD-model';

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

  constructor(public router: Router, private dialog: MatDialog, public service: OrdenDescargaService, public ordenTemporalService: OrdenTemporalService,) {
    this.service.listen().subscribe((m:any)=>{
      console.log(m);
      this.refreshOrdenDescargaList();
      });
   }
   
regresar(){
  this.router.navigate(['/ordenDescargadetalle']);
}

   //tabla visualizacion
   listData: MatTableDataSource<any>;
   displayedColumns: string [] = ['ClaveProducto','Producto', 'Sacos', 'SacosIngresados', 'Lote', 'Saldo', 'Options'];
   @ViewChild(MatSort, null) sort : MatSort;
   @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    //tabla Sacos Ingresados
    listDataSacosIngresados: MatTableDataSource<any>;
    displayedColumnsSacosIngresados: string [] = ['ClaveProducto','Producto', 'Sacos', 'SacosIngresados'];
    @ViewChild(MatSort, null) sortSacosIngresados : MatSort;
    @ViewChild(MatPaginator, {static: true}) paginatorSacosIngresados: MatPaginator;

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
    let DOD = new preOrdenTemporalOD();

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
    

      onEdit(detalleordendescarga: DetalleOrdenDescarga, id: any){
        console.clear();
        console.log(id);
        console.log(detalleordendescarga);
       this.rowDTOD = detalleordendescarga;
        console.log(id,'posicion');
        this.ordenTemporalService.posicionOrdenTemporalOD = id;
        console.log(this.ordenTemporalService.posicionOrdenTemporalOD,'wwwwwwwwwwwwwwwwwwwwwwwwwww');
        
//asigna el id del producto a la posicion para que se le puedan asignar los valores al dato temporal en tabla -1
console.log(this.ordenTemporalService.posicionOrdenTemporalOD,'Posicion');

if(this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Saldo != this.rowDTOD.Sacos){
  this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].SacosIngresados = '0'
  this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Saldo = this.rowDTOD.Sacos
}

console.log(this.rowDTOD.Sacos,'Sacos en total');
console.log(this.rowDTOD.Saldo,'Saldo al momento');

  }

      validarCantidad() {
      this.cantidadSacos = this.sacosSaldo;
      this.cantidadMaximaSacos = +this.rowDTOD.Sacos;
      
      if ((+this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Saldo - +this.cantidadSacos) < 0) {
        this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Saldo = this.cantidadMaximaSacos.toString()
        console.log('la cantidad de sacos ingresados es mayor al saldo');
      }
      else{
        console.log('else');
        if (this.sacosSaldo >= this.cantidadMaximaSacos) {
          this.cantidadSacos = this.cantidadMaximaSacos;
        }
        if (this.sacosSaldo <= 0) {
          this.cantidadSacos = 0;
        }
        if (this.sacosSaldo == null) {
          this.cantidadSacos = 0;
        }
        this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].SacosIngresados = this.cantidadSacos.toString();
        this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Saldo = (+this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Saldo - +this.cantidadSacos.toString()).toString();
      }
    }

  addSacos(form: NgForm){
    this.validarCantidad();
    console.log('sipaso');
    console.log(this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD ].Sacos,'Cantidad de sacos');
    console.log(this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD ].SacosIngresados,'Sacos ingresados');
    console.log(+this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Saldo - +this.cantidadSacos.toString(),'resta' ) 
  }

  onFocusInputSaldo(){
    if (this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Saldo != this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD ].Sacos){
      this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD ].SacosIngresados = '0';
      this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Saldo = this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Sacos

    }
  }

  onAddTarimaOT(){
    console.log(this.ordenTemporalService.preOrdenTemporalOD);
    let IdOD = this.ordenTemporalService.preOrdenTemporalOD[0].IdOrdenDescarga
    console.log(IdOD);
    this.service.getOrdenDescargaIDList(IdOD).subscribe(dataOD =>{ 
      console.clear();
      console.log(dataOD)

      let conceptoCoincidir = dataOD.length;
      for (let l = 0; l <= dataOD.length -1; l++){
        for (let i =0; i <= this.ordenTemporalService.preOrdenTemporalOD.length -1; i++){
          if((dataOD[l].ClaveProducto == this.ordenTemporalService.preOrdenTemporalOD[i].ClaveProducto) && (dataOD[l].Sacos == this.ordenTemporalService.preOrdenTemporalOD[i].Sacos)){
            console.log(this.ordenTemporalService.preOrdenTemporalOD,'oooooooooooooasssssssssssss');
            console.log('ESTE COINCIDE');
            console.log(dataOD[l].ClaveProducto);
            console.log(this.ordenTemporalService.preOrdenTemporalOD[i].ClaveProducto);
            console.log(dataOD[l].Sacos);
            console.log(this.ordenTemporalService.preOrdenTemporalOD[i].Sacos);
            conceptoCoincidir = conceptoCoincidir - 1;
            break;
          } else{
            console.log('ESTE NO COINCIDE');
            console.log(dataOD[l].ClaveProducto);
            console.log(this.ordenTemporalService.preOrdenTemporalOD[i].ClaveProducto);
            console.log(dataOD[l].Sacos);
            console.log(this.ordenTemporalService.preOrdenTemporalOD[i].Sacos);
          }
        }
      }
      if (conceptoCoincidir == 0) {
        console.log('OD Completa');
        Swal.fire({
          title: 'Conceptos Validos',
          icon: 'success',
          text: ''
        });


        for (let i = 0; i <= this.ordenTemporalService.preOrdenTemporalOD.length -1; i++){
        //asignar valores al objeto que sera insertado en orden temporal.
        // se crea un nuevo objeto ya que el anterior(OT) tiene datos locales, los cuales no estan en la DB
        let ordenTemp = new OrdenTemporal();

        ordenTemp.IdOrdenTemporal = this.ordenTemporalService.preOrdenTemporalOD[i].IdOrdenTemporal;
        ordenTemp.IdTarima = this.ordenTemporalService.preOrdenTemporalOD[i].IdTarima;
        ordenTemp.IdOrdenCarga = this.ordenTemporalService.preOrdenTemporalOD[i].IdOrdenCarga;
        ordenTemp.IdOrdenDescarga = this.ordenTemporalService.preOrdenTemporalOD[i].IdOrdenDescarga;
        ordenTemp.QR = this.ordenTemporalService.preOrdenTemporalOD[i].QR;
        ordenTemp.ClaveProducto = this.ordenTemporalService.preOrdenTemporalOD[i].ClaveProducto;
        ordenTemp.Lote = this.ordenTemporalService.preOrdenTemporalOD[i].Lote;
        ordenTemp.Sacos = this.ordenTemporalService.preOrdenTemporalOD[i].Sacos;
        ordenTemp.Producto = this.ordenTemporalService.preOrdenTemporalOD[i].Producto;
        ordenTemp.PesoTotal = this.ordenTemporalService.preOrdenTemporalOD[i].PesoTotal;
        ordenTemp.FechaCaducidad = this.ordenTemporalService.preOrdenTemporalOD[i].FechaCaducidad;
        ordenTemp.Comentarios = this.ordenTemporalService.preOrdenTemporalOD[i].Comentarios;

        
        console.log(ordenTemp,'ordentemp´finalllllllll');
      }

      } else {

      }





    })






  }
}
