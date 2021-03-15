import { Component, OnInit, ViewChild } from '@angular/core';
import { PosserviceService } from '../../posservice.service';
import Swal from 'sweetalert2';
import { MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AddeditposproductosComponent } from './addeditposproductos/addeditposproductos.component';

@Component({
  selector: 'app-poscatproductos',
  templateUrl: './poscatproductos.component.html',
  styleUrls: ['./poscatproductos.component.css']
})
export class PoscatproductosComponent implements OnInit {

  constructor(public posSVC: PosserviceService,private dialog: MatDialog) { }

  arrcon: Array<any> = [];
  listData: MatTableDataSource<any>;
  displayedColumns : string [] = [ 'Clave','Nombre',  'Options'];
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {
    this.getProductos()
  }

  getProductos(){
 


    Swal.fire({
      allowOutsideClick: false,
      text: 'Cargando Informacion de los Productos...',
      icon: 'info'
    });

    Swal.showLoading();
    let consulta = {
      'consulta':'select * from productos'
    };
    this.posSVC.generarConsulta(consulta).subscribe((data: any)=>{
      console.log(data);
      Swal.close();
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
    })
  }

  onAdd(){
    //this.posSVC.productosForm = new Producto();
    this.posSVC.addedit = 'Agregar Producto';

const dialogConfig = new MatDialogConfig();
dialogConfig.disableClose = false;
dialogConfig.autoFocus = true;
dialogConfig.width="70%";
let dlg = this.dialog.open(AddeditposproductosComponent, dialogConfig);
dlg.afterClosed().subscribe(resp=>{
  this.refreshTablaP();
})
  }
  refreshTablaP(){
    Swal.fire({
      allowOutsideClick: false,
      text: 'Cargando Informacion de los Productos...',
      icon: 'info'
    });

    Swal.showLoading();
    let consulta = {
      'consulta':'select * from productos'
    };
    
    
    this.posSVC.generarConsulta(consulta).subscribe((data:any)=>{
      console.log(data);
      Swal.close();
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
    console.log(this.listData);
    })
  }

  applyFilter(filtervalue: string){  
    this.listData.filter= filtervalue.trim().toLocaleLowerCase();
    
    }

    onEdit(producto){

      console.log(producto);
      this.posSVC.productosForm = producto;
      this.posSVC.addedit = 'Editar Producto';
      
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.width="70%";
      this.dialog.open(AddeditposproductosComponent, dialogConfig);
      
      }

      onDelete(row){
        console.log(row);

        let consulta = {
          'consulta':'delete from Productos where idproductos='+row.idProductos
        };

        console.log(consulta);

Swal.fire({
  title: '¿Seguro de Borrar el Producto?',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Borrar',
  cancelButtonText: 'Cancelar'
}).then((result) => {
  if (result.value) {
    this.posSVC.generarConsulta(consulta).subscribe(res => {
      this.refreshTablaP();
      
      Swal.fire({
        title: 'Borrado',
        icon: 'success',
        timer: 1000,
        showCancelButton: false,
        showConfirmButton: false
    });
      });
  }
})
      }

}
