import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { TarimaService } from 'src/app/services/almacen/tarima/tarima.service';
import { OrdenCargaService } from 'src/app/services/almacen/orden-carga/orden-carga.service';

export interface parametros{
  bodega: string,
  productos: [],
  tipo:string;
        
}

@Component({
  selector: 'app-mercancia',
  templateUrl: './mercancia.component.html',
  styleUrls: ['./mercancia.component.css']
})
export class MercanciaComponent implements OnInit {

  bodegaSelect;
  listData: MatTableDataSource<any>;
  listData2: MatTableDataSource<any>;
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = ['select','Bodega', 'Clave','Producto','Lote', 'Fecha Caducidad', 'Cantidad'];
  displayedColumns2: string[] = ['ClaveProducto','Producto', 'Cantidad'];
  aceptar;
  contador;
  productos = [];
  seleccionados = [];

  seleccionManual;

  constructor(public serviceTarima: TarimaService, public serviceordencarga: OrdenCargaService,public dialogRef: MatDialogRef<MercanciaComponent>,@Inject(MAT_DIALOG_DATA) public data: parametros) { }

  ngOnInit() {

    this.obtenerTarimas();

    this.listData2 = new MatTableDataSource(this.data.productos);

    
    
    
    this.aceptar=true;
    
    this.iniciarProductos()
    this.seleccionManual = this.data.tipo;

   


    
  }

  public listBodega: Array<Object> = [
    // { Bodega: 'Todos' },
    { Bodega: 'PasoTx' },
    { Bodega: 'Chihuahua' },
    // { Bodega: 'Transito' },
    
  ];

  seleccionar(){

    this.dialogRef.close(this.selection)
  }

  iniciarProductos(){

    this.productos= [];
    
    console.log(this.listData2.data);
    for (let i=0; i<this.data.productos.length;i++){
      this.productos.push({
        ClaveProducto:this.listData2.data[i].ClaveProducto,
        Producto:this.listData2.data[i].Producto,       
      })
    }

    console.log(this.productos);

  }

  validarProductos(){

//    this.productos.splice
this.iniciarProductos()
console.log(this.productos);
let productos2 = this.productos;
this.contador = productos2.length;
console.log(this.contador);

for (let j=0; j<this.seleccionados.length;j++){
    for (let i=0; i<productos2.length;i++){
      console.log(productos2[i],i,'i');
      console.log(this.seleccionados[j],j,'j');

    if (productos2[i].ClaveProducto==this.seleccionados[j].ClaveProducto){
      productos2.splice(i,1);
      this.contador = this.contador - 1;
      break;
    }
  }
}

if (this.contador==0){
  this.aceptar = false;
}else{
  this.aceptar = true;
}


console.log(this.aceptar);
console.log(productos2);
console.log(this.seleccionados);
console.log(this.contador);


   
    
  }


  applyFilter(filtervalue: string) {
    this.listData.filterPredicate = (data, filter: string) => {
      return data.Producto.toString().toLowerCase().includes(filter) || data.ClaveProducto.toString().toLowerCase().includes(filter);
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
    this.listData = new MatTableDataSource();
    this.serviceTarima.GetTarimaBodega().subscribe(data=>{
      console.log(data,'obtner tarimas');
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
      this.applyFilter2('Chihuahua');
      console.log(this.listData.data[0].ClaveProducto);
      //this.applyFilter(this.listData2.data[0].ClaveProducto);
      this.bodegaSelect = 'Chihuahua';

      if (!this.seleccionManual){
        console.clear();
        this.seleccionAutomatica();
      }
      
      

    })
  }

  seleccionAutomatica(){
    /* console.log(this.listData2.data);
    console.log(this.selection.selected);
    console.log(this.listData.filteredData); */
    console.log(this.seleccionManual);

    for(let i=0; i<this.listData2.data.length;i++){
      for(let j=0; j<this.listData.filteredData.length;j++){
        if (this.listData2.data[i].ClaveProducto==this.listData.filteredData[j].ClaveProducto){

          this.selection.selected.push(this.listData.filteredData[j])

        }
      }

    }

    this.seleccionados = [];
    for (let i=0; i<this.selection.selected.length;i++){

      this.seleccionados.push({
        ClaveProducto:this.selection.selected[i].ClaveProducto,
        Producto:this.selection.selected[i].Producto,        
      })

    }

    this.validarProductos();

    console.log(this.selection);
    console.log(this.aceptar);

    if (!this.aceptar){
      this.seleccionar()
    }else{
      console.log('No cerrar');

    }

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
console.log(this.selection);
this.seleccionados = [];
    for (let i=0; i<this.selection.selected.length;i++){

      this.seleccionados.push({
        ClaveProducto:this.selection.selected[i].ClaveProducto,
        Producto:this.selection.selected[i].Producto,        
      })

    }

    
  

    this.validarProductos();
  }

}
