import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import Swal from 'sweetalert2';
import { PosserviceService } from '../posservice.service';

@Component({
  selector: 'app-posinventarios',
  templateUrl: './posinventarios.component.html',
  styleUrls: ['./posinventarios.component.css']
})
export class PosinventariosComponent implements OnInit {

  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Clave','Producto', 'Cantidad', 'Sucursal'];
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(public posSVC: PosserviceService) { }

  ngOnInit() {
    
    



    // this.sucursalSelect = 'Zarco';
    this.obtenerProductos()
    
  }

  obtenerProductos(){
    Swal.showLoading();

    this.posSVC.inventarioMaster = [];
    this.listData = new MatTableDataSource();
    
//select claveproducto,nombreproducto,precio, (SUM(case tipo when 'Entrada' then CONVERT(float,cantidad) else 0 end) - SUM(case tipo when 'Salida' then CONVERT(float,cantidad) else 0 end)) as cantidad ,sucursal from inventarios where sucursal ='"+sucursal+"' group by claveproducto,nombreproducto,sucursal,precio";
let consulta = {
  'consulta':"select claveproducto,nombreproducto,precio, (SUM(case tipo when 'Entrada' then CONVERT(float,cantidad) else 0 end) - SUM(case tipo when 'Salida' then CONVERT(float,cantidad) else 0 end)) as cantidad ,sucursal from inventarios where sucursal ='Hermosillo' group by claveproducto,nombreproducto,sucursal,precio"
};
// this.entradaSVC.getEntradas().subscribe(data=>{

console.log(consulta);
  this.posSVC.generarConsulta(consulta).subscribe((data:any)=>{
// console.clear();
      // console.log(data);

      for(let i=0; i<data.length; i++){

       



        this.posSVC.inventarioMaster[i] = data[i];
        
      }

      Swal.close();
      
            this.listData = new MatTableDataSource(this.posSVC.inventarioMaster);
            this.listData.sort = this.sort;
            this.listData.paginator = this.paginator;
            this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
    })
  
  

  }


  applyFilter(filtervalue: string) {
    this.listData.filterPredicate = (data, filter: string) => {
      return data.Nombre.toString().toLowerCase().includes(filter) || data.ClaveProducto.toString().includes(filter);
    };
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();

  }

}
