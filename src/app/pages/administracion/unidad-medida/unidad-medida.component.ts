import { Component, OnInit, ViewChild } from '@angular/core';
import { UnidadMedidaService } from '../../../services/unidadmedida/unidad-medida.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
// import {MatCheckboxModule} from '@angular/material/checkbox';
import { UnidadMedidaDetalle } from '../../../Models/Unidad-Medida/unidadmedidaDetalle-model';

@Component({
  selector: 'app-unidad-medida',
  templateUrl: './unidad-medida.component.html',
  styleUrls: ['./unidad-medida.component.css']
})
export class UnidadMedidaComponent implements OnInit {

  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['key', 'name', 'Options'];
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private service: UnidadMedidaService) { }
  ngOnInit() {
    this.unidadMedida();
  }

  public listUM: Array<any> = [];

  unidadMedida() {
    this.listUM = [];
    this.service.master = [];
    console.log(this.service.master);
    this.service.unidadMedidaAPISAT().subscribe(data => {
  
      for (let i = 0; i < JSON.parse(data).data.length; i++) {
        this.listUM[i] = (JSON.parse(data).data[i])
        // console.log(this.listUM);
        this.service.master[i] = this.listUM[i];
        this.service.GetUnidadMedidaClaveSAT(this.listUM[i].key).subscribe(res => {

          if (res.length > 0) {
            this.service.master[i].checkbox = true;
          } else {
            this.service.master[i].checkbox = false;
          }

        });
      }
      // console.log(this.listUM);
      // console.log(this.service.master);
      //  console.log(this.listUM);
      this.listData = new MatTableDataSource(this.listUM);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Unidad Medida por Pagina';
    })
  }

  change(checkbox: any, row: any) {
    // console.log(checkbox);
    // console.log(row);
    if (checkbox == true) {
      console.log('Agregarlo a la BD');
    } else {
      console.log('Eliminarlo de la BD');
    }



  }

  applyFilter(filtervalue: string) {
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();
  }

}
