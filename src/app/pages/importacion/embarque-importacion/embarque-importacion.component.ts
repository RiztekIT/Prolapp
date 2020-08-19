import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { TarimaService } from 'src/app/services/almacen/tarima/tarima.service';
import { SelectionModel } from '@angular/cdk/collections';


declare function steps();
declare function upload();

@Component({
  selector: 'app-embarque-importacion',
  templateUrl: './embarque-importacion.component.html',
  styleUrls: ['./embarque-importacion.component.css'],

})
export class EmbarqueImportacionComponent implements OnInit {

  ciudades: any = [
    'Seleccionar Ciudad',
    'Aguascalientes',
    'Baja California',
    'Baja California Sur',
    'Campeche',
    'Coahuila',
    'Colima',
    'Chiapas',
    'Chihuahua',
    'Distrito Federal',
    'Durango',
    'Guanajuato',
    'Guerrero',
    'Hidalgo',
    'Jalisco',
    'México',
    'Michoacán de Ocampo',
    'Morelos',
    'Nayarit',
    'Nuevo León',
    'Oaxaca',
    'Puebla',
    'Querétaro',
    'Quintana Roo',
    'San Luis Potosí',
    'Sinaloa',
    'Sonora',
    'Tabasco',
    'Tamaulipas',
    'Tlaxcala',
    'Veracruz',
    'Yucatán',
    'Zacatecas'
];

public listBodega: Array<Object> = [
  { Bodega: 'Todos' },
  { Bodega: 'PasoTx' },
  { Bodega: 'Chihuahua' },
  { Bodega: 'Transito' },
  
];


  constructor(public router: Router, public serviceTarima: TarimaService) { }
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['select','Bodega', 'Clave','Producto','Lote', 'Fecha Caducidad', 'Cantidad','Options'];
  bodegaSelect;
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  selection = new SelectionModel<any>(true, []);

  ngOnInit() {
    this.obtenerTarimas();
  }

  bodegaCambio(event){
    // console.log(event);
this.bodegaSelect = event.value;
console.log(this.bodegaSelect);
if (this.bodegaSelect==='Todos'){
  this.applyFilter2('')
}else {

  this.applyFilter2(this.bodegaSelect)
}

  }

  applyFilter(filtervalue: string) {
    this.listData.filterPredicate = (data, filter: string) => {
      return data.Nombre.toString().toLowerCase().includes(filter) || data.IdCotizacion.toString().includes(filter);
    };
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();

  }

  applyFilter2(filtervalue: string) {
    this.listData.filterPredicate = (data, filter: string) => {
      return data.Bodega.toString().toLowerCase().includes(filter);
    };
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();

  }

  obtenerTarimas(){
    this.serviceTarima.GetTarimaBodega().subscribe(data=>{
      console.log(data,'obtner tarimas');
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
    })
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.listData.data.forEach(row => this.selection.select(row));
    console.log(this.selection);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.listData.data.length;
    return numSelected === numRows;
  }
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }    
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  toggle(row){
    console.log(row);
  }

  lista(){
    console.log(this.selection.selected);
  }

}
