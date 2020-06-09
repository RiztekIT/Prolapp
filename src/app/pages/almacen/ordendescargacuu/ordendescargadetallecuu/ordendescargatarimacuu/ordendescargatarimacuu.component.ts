import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
import { Tarima } from 'src/app/Models/almacen/Tarima/tarima-model';

@Component({
  selector: 'app-ordendescargatarimacuu',
  templateUrl: './ordendescargatarimacuu.component.html',
  styleUrls: ['./ordendescargatarimacuu.component.css']
})
export class OrdendescargatarimacuuComponent implements OnInit {
IdOrdenDescarga: number;

  constructor(public router: Router, public Tarimaservice: Tarima) { }

  ngOnInit() {
    this.IdOrdenDescarga = +(localStorage.getItem('IdOrdenDescarga'));
  }

  regresar() {
    this.router.navigate(['/ordenDescargadetalle']);
    this.actualizarTablaTarima();
  }

  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['ClaveProducto', 'Producto', 'Sacos', 'Saldo', 'Lote', 'Comentarios', 'Options'];
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  actualizarTablaTarima(){

    // this.Tarimaservice.Get(this.IdOrdenDescarga).subscribe(dataID => {
    // })
    }

}
