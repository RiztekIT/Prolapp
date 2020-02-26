import { Component, OnInit, ViewChild } from '@angular/core';
import { UnidadMedidaService } from '../../../services/unidadmedida/unidad-medida.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { MatSnackBar } from '@angular/material';
// import {MatCheckboxModule} from '@angular/material/checkbox';
import { UnidadMedidaDetalle } from '../../../Models/Unidad-Medida/unidadmedidaDetalle-model';
import { UnidadMedida } from 'src/app/Models/Unidad-Medida/unidadmedida-model';

@Component({
  selector: 'app-unidad-medida',
  templateUrl: './unidad-medida.component.html',
  styleUrls: ['./unidad-medida.component.css']
})
export class UnidadMedidaComponent implements OnInit {

  //list data que sera renderizada por la tabla
  listData: MatTableDataSource<any>;
  //titulos de las columnas de la tabla
  displayedColumns: string[] = ['key', 'name', 'Options'];

  //propiedades de la table
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(public service: UnidadMedidaService, private snackBar: MatSnackBar) { }
  ngOnInit() {
    this.unidadMedida();
  }

  //Arreglo donde se aguardaran todas las unidades de medida provenientes de la API del SAT
  public listUM: Array<any> = [];


  unidadMedida() {
    //inicializar en vacio los arreglos
    this.listUM = [];
    this.service.master = [];
    //obtener las unidades de medida del SAT
    this.service.unidadMedidaAPISAT().subscribe(data => {

      for (let i = 0; i < JSON.parse(data).data.length; i++) {
        this.listUM[i] = (JSON.parse(data).data[i])
        this.service.master[i] = this.listUM[i];
        this.service.master[i].index = i;
        this.UnidadMedidaExistente((this.listUM[i].key).toString(), i);
      }
      //asignar los valores y propiedades a la tabla
      this.listData = new MatTableDataSource(this.listUM);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Unidad Medida por Pagina';
    })
  }

  UnidadMedidaExistente(key, i){
// //verficar si ya existe registro de esa unidad de medida en la base de datos
this.service.GetUnidadMedidaClaveSAT(key).subscribe(res => {

  //si ya existe registro, se pondra el checkbox como true
  if (res.length > 0) {
    this.service.master[i].checkbox = true;
    //en caso contrario el checkbox sera false
  } else {
    this.service.master[i].checkbox = false;
  }

});
  }

  //Metodo que se ejectua cuando hay un cambio en el checkbox
  change(checkbox: any, row: any) {
    this.service.formData = new UnidadMedida;
    this.service.formData.Nombre = row.name;
    this.service.formData.ClaveSAT = row.key.toString();

    //si se palomea el checkbox, se agregara la unidad de medida a la base de datos
    if (checkbox == true) {
      this.service.addUnidadMedida(this.service.formData).subscribe(res => {
this.UnidadMedidaExistente((row.key).toString(), row.index);
        this.snackBar.open(res.toString(), '', {
          duration: 5000,
          verticalPosition: 'bottom'
        });
      });
      //por lo contrario, se eliminara la unidad de medida de la base de datos
    } else {
      this.service.deleteUnidadMedida(this.service.formData.ClaveSAT).subscribe(res => {
        this.UnidadMedidaExistente((row.key).toString(), row.index);
        this.snackBar.open(res.toString(), '', {
          duration: 5000,
          verticalPosition: 'bottom'
        });
      });
    }

  }

  //filtro para filtrar las unidades de medida por nombre / key
  applyFilter(filtervalue: string) {
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();
  }

}
