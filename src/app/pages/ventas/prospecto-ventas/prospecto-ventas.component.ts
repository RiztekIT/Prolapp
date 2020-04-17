import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {MatTableDataSource, MatPaginator, MatTable, MatDialog, MatSnackBar, MatDialogConfig} from '@angular/material';
import {MatSort} from '@angular/material/sort';
import Swal from 'sweetalert2';
import { Prospecto } from 'src/app/Models/ventas/prospecto-model';
import { VentasCotizacionService } from '../../../services/ventas/ventas-cotizacion.service';
import { FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-prospecto-ventas',
  templateUrl: './prospecto-ventas.component.html',
  styleUrls: ['./prospecto-ventas.component.css']
})
export class ProspectoVentasComponent implements OnInit {

  constructor(public router: Router, private dialog: MatDialog, public service: VentasCotizacionService, private _formBuilder: FormBuilder) {
    this.service.listen().subscribe((m:any)=>{
      this.refreshProspectoList();
    });
   }

  ngOnInit() {
    this.refreshProspectoList();
  }

  listData: MatTableDataSource<any>;
  displayedColumns: string [] = ['Nombre', 'Correo', 'Telefono', 'Direccion', 'Empresa', 'Estatus', 'IdCotizacion', 'Options']

  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  refreshProspectoList(){
    this.service.getProspectos().subscribe(data => {
      console.log(data);
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Prospectos por Pagina';
    })
  }

  onDelete(row){}

  onEdit(prospecto: Prospecto){}

  applyFilter(filtervalue: string) {
    this.listData.filterPredicate = (data, filter: string) => {
      return data.Nombre.toString().toLowerCase().includes(filter) || data.IdCotizacion.toString().includes(filter);
    };
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();

  }
}
