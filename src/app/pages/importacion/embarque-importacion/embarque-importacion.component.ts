import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { TarimaService } from 'src/app/services/almacen/tarima/tarima.service';
import { SelectionModel } from '@angular/cdk/collections';
import Swal from 'sweetalert2';
import { OrdenCargaService } from 'src/app/services/almacen/orden-carga/orden-carga.service';


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


  constructor(public router: Router, public serviceTarima: TarimaService, public serviceordencarga: OrdenCargaService) { }
  listData: MatTableDataSource<any>;
  listData2: MatTableDataSource<any>;
  displayedColumns: string[] = ['select','Bodega', 'Clave','Producto','Lote', 'Fecha Caducidad', 'Cantidad'];
  displayedColumns2: string[] = ['Bodega', 'Clave','Producto','Lote', 'Fecha Caducidad', 'Cantidad','Options'];
  bodegaSelect;
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  selection = new SelectionModel<any>(true, []);
  detalletraspaso=[];
  inicio=true;

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
      return data.Producto.toString().toLowerCase().includes(filter) || data.Lote.toString().includes(filter);
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
      this.applyFilter2('PasoTx');
      this.bodegaSelect = 'PasoTx';
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
    
    /* console.log(this.selection.isSelected(row)); */
    /* if (this.selection.isSelected(row)){

      Swal.fire({
        title: 'Ingresar Numero de Sacos',
        icon: 'info',
        input: 'text',
        inputValue: row.Sacos,
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
      }).then((result) => {
        console.log(result);
        this.detalletraspaso.push({
          "Bodega": row.Bodega,
"ClaveProducto" :  row.ClaveProducto,
"FechaCaducidad" :  row.FechaCaducidad,
"FechaMFG" :  row.FechaMFG,
"IdDetalleTarima" :  row.IdDetalleTarima,
"IdProveedor" :  row.IdProveedor,
"IdTarima" :  row.IdTarima,
"IdTarima1" :  row.IdTarima1,
"Lote" :  row.Lote,
"PO" :  row.PO,
"Pedimento" :  row.Pedimento,
"PesoTotal" :  row.PesoTotal,
"PesoxSaco" :  row.PesoxSaco,
"Producto" :  row.Producto,
"Proveedor" :  row.Proveedor,
"QR" :  row.QR,
"Sacos" :  result.value,
"Sacos1" :  row.Sacos1,
"Shipper" :  row.Shipper,
"USDA" :  row.USDA,
        })

        console.log(this.selection.selected.indexOf(row));
        console.log(this.detalletraspaso);
        console.log(console.log(this.selection.selected));
      })
    }else{
      console.log(this.detalletraspaso);
      console.log(console.log(this.selection.selected));
      console.log(this.selection.selected.indexOf(row));

    } */


    /* this.detalletraspaso. */

  }

  lista(){
    this.listData2 = new MatTableDataSource(this.selection.selected);
    this.listData2.sort = this.sort;
    this.listData2.paginator = this.paginator;
    this.listData2.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
    this.inicio = false;
    console.log(this.selection.selected);
  }
  lista2(){
    
    this.inicio = true;
    console.log(this.selection.selected);
  }

  onEdit(row){
    console.log(row);
    
    Swal.fire({
      title: 'Ingresar Numero de Sacos',
      icon: 'info',
      input: 'text',
      inputValue: row.Sacos,
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
    }).then((result) => {
      console.log(result);
      row.Sacos = result.value
    /*   this.detalletraspaso.push({
        "Bodega": row.Bodega,
"ClaveProducto" :  row.ClaveProducto,
"FechaCaducidad" :  row.FechaCaducidad,
"FechaMFG" :  row.FechaMFG,
"IdDetalleTarima" :  row.IdDetalleTarima,
"IdProveedor" :  row.IdProveedor,
"IdTarima" :  row.IdTarima,
"IdTarima1" :  row.IdTarima1,
"Lote" :  row.Lote,
"PO" :  row.PO,
"Pedimento" :  row.Pedimento,
"PesoTotal" :  row.PesoTotal,
"PesoxSaco" :  row.PesoxSaco,
"Producto" :  row.Producto,
"Proveedor" :  row.Proveedor,
"QR" :  row.QR,
"Sacos" :  result.value,
"Sacos1" :  row.Sacos1,
"Shipper" :  row.Shipper,
"USDA" :  row.USDA,
      }) */

      //console.log(this.selection.selected.indexOf(row));
      //console.log(this.detalletraspaso);
      console.log(this.listData2.data);
    })
  
    
  }

  hacerTraspaso(){
    console.log(this.listData2.data);
    this.crearOC();
  }

   crearOC(){

    let ordencarga;
    let detordencarga;
    let sacos;
    let kg;
    let user;
    user = JSON.parse( localStorage.getItem('ProlappSession')).user;
    //this.service.formDataPedido.Estatus = 'Cerrada';

    //this.service.formDataPedido.Total = this.total;
    //this.service.formDataPedido.Subtotal = this.subtotal;
    //this.service.formDataPedido.TotalDlls = this.totalDlls;
    //this.service.formDataPedido.SubtotalDlls = this.subtotalDlls;

    this.serviceordencarga.getUltimoFolio().subscribe(data=>{

      console.log(data[0].Folio);

      sacos = 0;

      for (let i=0; i< this.listData2.data.length;i++){
        sacos = sacos + +this.listData2.data[i].Sacos;
      }

      kg = sacos * 25;

      ordencarga= {
  
        IdOrdenCarga: 0,
        Folio: data[0].Folio,
        FechaEnvio: new Date(),
        IdCliente: '0',
        Cliente: 'Traspaso',
        IdPedido: '0',
        Fletera: '0',
        Caja: '0',
        Sacos: sacos,
        Kg: kg,
        Chofer: '',
        Origen: 'PasoTx',
        Destino: 'Chihuahua',
        Observaciones: '',
        Estatus: 'Creada',
        FechaInicioCarga: new Date('10/10/10'),
        FechaFinalCarga: new Date('10/10/10'),
        FechaExpedicion: new Date(),
        IdUsuario: '0',
        Usuario: user
      }

      console.log(ordencarga);

     



      this.serviceordencarga.addOrdenCarga(ordencarga).subscribe(data=>{

        console.log(data);

        for (let i=0; i< this.listData2.data.length;i++){
       
          detordencarga = {
    
            IdDetalleOrdenCarga:0,
            IdOrdenCarga:0,
            ClaveProducto:this.listData2.data[i].ClaveProducto,
        Producto:this.listData2.data[i].Producto,
        Sacos:this.listData2.data[i].Sacos,
        PesoxSaco:'25',
        Lote:this.listData2.data[i].Lote,
        IdProveedor:this.listData2.data[i].IdProveedor,
        Proveedor:this.listData2.data[i].Proveedor,
        PO:this.listData2.data[i].PO,
        FechaMFG:new Date('10/10/10'),
        FechaCaducidad:new Date('10/10/10'),
        Shipper:this.listData2.data[i].Shipper,
        USDA:this.listData2.data[i].USDA,
        Pedimento:this.listData2.data[i].Pedimento,
        Saldo:this.listData2.data[i].Sacos,
          }

          this.serviceordencarga.addDetalleOrdenCarga(detordencarga).subscribe(data=>{
            console.log(data);
            Swal.fire({
              icon: 'success',
              title: 'Traspaso Creado'
            })
            
          })
          
      
        }

        

       /*  console.log(this.service.formDataPedido);
        this.service.updateVentasPedido(this.service.formDataPedido).subscribe(res => {
          Swal.fire({
            icon: 'success',
            title: 'Pedido Cerrado'
          }) */
    
    
          /* this.Inicializar(); */
    
        }
        )


      })
    
   }

}
