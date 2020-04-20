import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {MatTableDataSource, MatPaginator, MatTable, MatDialog, MatSnackBar, MatDialogConfig} from '@angular/material';
import {MatSort} from '@angular/material/sort';
import Swal from 'sweetalert2';
import { Prospecto } from 'src/app/Models/ventas/prospecto-model';
import { VentasCotizacionService } from '../../../services/ventas/ventas-cotizacion.service';
import { FormBuilder } from '@angular/forms';
import { AddClienteComponent } from '../../administracion/catalogos/clientes/add-cliente/add-cliente.component';
import { ClientesService } from '../../../services/catalogos/clientes.service';



@Component({
  selector: 'app-prospecto-ventas',
  templateUrl: './prospecto-ventas.component.html',
  styleUrls: ['./prospecto-ventas.component.css']
})
export class ProspectoVentasComponent implements OnInit {

  constructor(public router: Router, private dialog: MatDialog, public service: VentasCotizacionService, public service2: ClientesService, private _formBuilder: FormBuilder) {
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

  onEdit(prospecto: Prospecto){
    console.log(prospecto);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    this.dialog.open(AddClienteComponent, dialogConfig);
    
    this.service2.formData.Nombre = prospecto.Nombre;
    this.service2.formData.Calle = prospecto.Direccion;
    this.service2.formData.RazonSocial = prospecto.Empresa;
    this.service2.prospEstatus = prospecto.Estatus;


  }

  applyFilter(filtervalue: string) {
    this.listData.filterPredicate = (data, filter: string) => {
      return data.Nombre.toString().toLowerCase().includes(filter) || data.IdCotizacion.toString().includes(filter);
    };
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();

  }
}
