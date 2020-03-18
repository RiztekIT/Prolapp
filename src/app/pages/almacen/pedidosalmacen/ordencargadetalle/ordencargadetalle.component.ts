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

  listData: MatTableDataSource<any>;
  displayedColumns: string [] = ['IdDetalleOrdenCarga', 'IdOrdenCarga', 'IdProveedor', 'Proveedor', 'PO', 'IdProducto', 'Lote', 'Sacos', 'PesoSaco', 'FechaMFG', 'FechaCaducidad', 'Bodega', 'USDA','Shipper', 'Pedimiento'];
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  
  formDatae: any;
  
  constructor(public router: Router, private dialog: MatDialog, public service: OrdenCargaService) { 

    this.service.listen().subscribe((m:any)=>{
      console.log(m);
      this.refreshDetalleOrdenCargaList();
      });


      

      
  }

  refreshForm(){

    this.formDatae = JSON.parse(localStorage.getItem('FormDataOrdenCarga'));

    console.log(this.formDatae.IdOrdenCarga);

  }

  ngOnInit() {
    this.refreshForm();
    this.refreshDetalleOrdenCargaList();
  }

  refreshDetalleOrdenCargaList(){
    // this.refreshForm();
    this.service.getDetalleOrdenCargaList(this.formDatae.IdOrdenCarga).subscribe(data => {
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    });
  }

  cambiarEstatusP(){

    this.refreshForm();
    console.log(this.formDatae.IdOrdenCarga);


    let estatus = {
      IdOrdenCarga: this.formDatae.IdOrdenCarga,
      Estatus: "Preparada"
    }

    this.service.updatedetalleOrdenCargaEstatus(estatus).subscribe(data =>{
      this.formDatae.Estatus = "Preparada"
    })

  }
  cambiarEstatusC(){

    this.refreshForm();

    let estatus = {
      IdOrdenCarga: this.formDatae.IdOrdenCarga,
      Estatus: "Cargada"
    }

    this.service.updatedetalleOrdenCargaEstatus(estatus).subscribe(data =>{
      this.formDatae.Estatus = "Cargada"
    })
    
  }
  cambiarEstatusE(){
    this.refreshForm();
    let estatus = {
      IdOrdenCarga: this.formDatae.IdOrdenCarga,
      Estatus: "Enviada"
    }

    this.service.updatedetalleOrdenCargaEstatus(estatus).subscribe(data =>{
      this.formDatae.Estatus = "Enviada"
    })
  }
  cambiarEstatusT(){
    this.refreshForm();
    let estatus = {
      IdOrdenCarga: this.formDatae.IdOrdenCarga,
      Estatus: "Terminada"
    }

    this.service.updatedetalleOrdenCargaEstatus(estatus).subscribe(data =>{
      this.formDatae.Estatus = "Terminada"
    })
    
  }

  regresar(){
    this.router.navigate(['/pedidosalmacen']);
  }

}
  