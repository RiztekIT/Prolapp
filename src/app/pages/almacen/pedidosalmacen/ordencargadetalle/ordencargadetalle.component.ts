import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatTable, MatDialog, MatSnackBar } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { CurrencyPipe } from '@angular/common';
import { OrdenCargaService } from 'src/app/services/almacen/orden-carga/orden-carga.service';
import Swal from 'sweetalert2';

// import { pedidoMaster } from 'src/app/Models/Pedidos/pedido-master';
// import { DetallePedido } from '../../../Models/Pedidos/detallePedido-model';

@Component({
  selector: 'app-ordencargadetalle',
  templateUrl: './ordencargadetalle.component.html',
  styleUrls: ['./ordencargadetalle.component.css'],
})
export class OrdencargadetalleComponent implements OnInit {

IdOrdenCarga: number;
  listData: MatTableDataSource<any>;
  displayedColumns: string [] = ['IdTarima', 'QR', 'ClaveProducto', 'Producto', 'Sacos', 'Lote', 'Proveedor', 'PO', 'FechaMFG', 'FechaCaducidad', 'Shipper', 'USDA', 'Pedimento'];
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  
  DataOrdenCarga: any;
  
  constructor(public router: Router, private dialog: MatDialog, public service: OrdenCargaService) { 

    this.service.listen().subscribe((m:any)=>{
      console.log(m);
      this.refreshDetalleOrdenCargaList();
      });
  }

  
  
  ngOnInit() {
    this.IdOrdenCarga = +(localStorage.getItem('IdOrdenCarga'));
    this.refreshForm();
    this.refreshDetalleOrdenCargaList();
  }


          refreshForm(){
            this.DataOrdenCarga = this.service.getOrdenCargaID(this.IdOrdenCarga).subscribe( data=> {
                  console.log(data);
                  console.log(this.service.formData,'12312312312312');
                  this.service.formData = data[0];
                  
                  console.log(this.service.formData,'asdasdasdasdasd');
            });
          }

  refreshDetalleOrdenCargaList(){
    this.service.getOrdenCargaIDList(this.IdOrdenCarga).subscribe(data => {
      console.log(data);
      this.service.formDataDOC = data[0];
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    });
  }

  cambiarEstatusP(){

    console.log(this.service.formData.IdOrdenCarga);


    let estatus = {
      IdOrdenCarga: this.service.formData.IdOrdenCarga,
      Estatus: "Preparada"
    }

    this.router.navigate(['/ordenCargaPreparar']);

    // this.service.updatedetalleOrdenCargaEstatus(estatus.IdOrdenCarga, estatus.Estatus).subscribe(data =>{
    //   this.service.formData.Estatus = "Preparada"
    // })

  }
  cambiarEstatusC(){

    let estatus = {
      IdOrdenCarga: this.service.formData.IdOrdenCarga,
      Estatus: "Cargada"
    }
    this.router.navigate(['/ordenCargaCargar']);

    // this.service.updatedetalleOrdenCargaEstatus(estatus.IdOrdenCarga, estatus.Estatus).subscribe(data =>{
    //   this.service.formData.Estatus = "Cargada"
    // })
    
  }
  cambiarEstatusE(){
   
    let estatus = {
      IdOrdenCarga: this.service.formData.IdOrdenCarga,
      Estatus: "Enviada"
    }
    this.router.navigate(['/ordenCargaEnviar']);

    // this.service.updatedetalleOrdenCargaEstatus(estatus.IdOrdenCarga, estatus.Estatus).subscribe(data =>{
    //   this.service.formData.Estatus = "Enviada"
    // })
  }
  cambiarEstatusT(){

    let estatus = {
      IdOrdenCarga: this.service.formData.IdOrdenCarga,
      Estatus: "Terminada"
    }

    // this.service.updatedetalleOrdenCargaEstatus(estatus.IdOrdenCarga, estatus.Estatus).subscribe(data =>{
    //   this.service.formData.Estatus = "Terminada"
    // })
    
  }

  regresar(){
    localStorage.removeItem('FormDataOrdenCarga');
    this.router.navigate(['/pedidosalmacen']);
  }

}
  