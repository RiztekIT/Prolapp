import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Observable } from 'rxjs';
import { FormControl, NgForm } from '@angular/forms';
import { OrdenDescargaService } from '../../../../services/almacen/orden-descarga/orden-descarga.service';
import Swal from 'sweetalert2';

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

  constructor(private dialog: MatDialog,public service: OrdenDescargaService) {

    this.service.listen().subscribe((m:any)=>{
      console.log(m);
      this.refreshOrdenDescargaList();
      });
   }

  listData: MatTableDataSource<any>;
  displayedColumns: string [] = ['Producto', 'Sacos', 'Lote', 'Saldo', 'Options'];
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  



  ngOnInit() {
    console.clear();
    this.refreshOrdenDescargaList();
  }

  refreshOrdenDescargaList(){
    this.service.getDetalleOrdenDescarga().subscribe(data =>{
    console.log(data);
      
      
        this.listData = new MatTableDataSource(data);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
        this.listData.paginator._intl.itemsPerPageLabel = 'Ordenes de Descarga por Pagina';
    })
        // this.service.getOrdenCargaList().subscribe(data => {
        //   console.log(data);
          
        // });
      }

  onEdit(row){
this.rowDTOD = row;
console.log(this.rowDTOD.Sacos);
  }

  onBlursacos(form:NgForm){
    

this.sacostotal = this.rowDTOD.Sacos;
this.service.formDTOD.Saldo = (+this.sacostotal - +this.sacosSaldo).toString();
console.log(this.sacostotal ,'sacos en tarima');
console.log(this.sacosSaldo,'Sacos Ingresados');
console.log(this.service.formDTOD.Saldo,'saldos totales');
console.log(this.service.formDTOD,'asfasfasfasfsa');

this.service.formDTOD.IdDetalleOrdenDescarga = this.rowDTOD.IdDetalleOrdenDescarga;
this.service.formDTOD.IdOrdenDescarga = this.rowDTOD.IdOrdenDescarga;
this.service.formDTOD.ClaveProducto = this.rowDTOD.ClaveProducto;
this.service.formDTOD.Producto = this.rowDTOD.Producto;
this.service.formDTOD.Sacos = this.rowDTOD.Sacos;
this.service.formDTOD.PesoxSaco = this.rowDTOD.PesoxSaco;
this.service.formDTOD.Lote = this.rowDTOD.Lote;
this.service.formDTOD.IdProveedor = this.rowDTOD.IdProveedor;
this.service.formDTOD.Proveedor = this.rowDTOD.Proveedor;
this.service.formDTOD.PO = this.rowDTOD.PO;
this.service.formDTOD.FechaMFG = this.rowDTOD.FechaMFG;
this.service.formDTOD.FechaCaducidad = this.rowDTOD.FechaCaducidad;
this.service.formDTOD.Shipper = this.rowDTOD.Shipper;
this.service.formDTOD.USDA = this.rowDTOD.USDA;
this.service.formDTOD.Pedimento = this.rowDTOD.Pedimento;n




this.service.OnEditDetalleOrdenDescarga(this.service.formDTOD).subscribe(res => {
  this.refreshOrdenDescargaList();
  Swal.fire({
    icon: 'success',
    title: 'Saldo Actualizado'
  })
})

  }

regresar(){
  
}



}
