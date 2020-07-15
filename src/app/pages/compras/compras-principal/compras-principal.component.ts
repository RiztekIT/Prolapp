import { Component, OnInit, ViewChild } from '@angular/core';

import {MatTableDataSource, MatPaginator, MatTable, MatDialog, MatSnackBar, MatDialogConfig} from '@angular/material';
import {MatSort} from '@angular/material/sort';
import { Router } from '@angular/router';
import { stringify } from 'querystring';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import Swal from 'sweetalert2';
import { Observable, Subscriber } from 'rxjs';
import { DetalleCompra } from '../../../Models/Compras/detalleCompra-model';
import { CompraService } from '../../../services/compras/compra.service';
import { Compras } from 'src/app/Models/Compras/compra-model';
import { HttpClient, HttpHeaders } from "@angular/common/http";

const httpOptions = {
  headers: new HttpHeaders({
    'Bmx-Token': 'd83c7088f2823be9f29cc124cf95dc37056de37c340da5477a09ca1ee91a80a6',
    'Access-Control-Allow-Origin': 'http://localhost:4200',
    'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Headers': 'Bmx-Token, Accept, Accept-Encoding, Content-Type, Origin',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'

  })
}

@Component({
  selector: 'app-compras-principal',
  templateUrl: './compras-principal.component.html',
  styleUrls: ['./compras-principal.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),  
  ],
})
export class ComprasPrincipalComponent implements OnInit {

  listData: MatTableDataSource<any>;
  displayedColumns: string [] = ['Folio', 'PO', 'Proveedor', 'PesoTotal', 'FechaElaboracion', 'FechaPromesa', 'FechaEntrega','Estatus', 'Options'];
  displayedColumnsVersion: string[] = ['ClaveProducto', 'Producto', 'Cantidad', 'PrecioUnitario', 'CostoTotal'];
  expandedElement: any;
  detalle = new Array<DetalleCompra>();
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


 arrCompra: any;
// compraBlanco:Compras

//Variable que guarda el tipo de cambio
TipoCambio: string;

constructor(public router: Router,private service:CompraService, private dialog: MatDialog, private http: HttpClient) {

    // this.service.listen().subscribe((m:any)=>{
    //   console.log(m);
    //   this.refreshOrdenCargaList();
    //   });

   }

  ngOnInit() {

    this.obtenerCompras();
    this.tipoDeCambio();
  }


  obtenerCompras(){
this.arrCompra = this.service.getComprasList();
this.arrCompra.subscribe(data =>{
console.log(data);
this.service.master = []
  for (let i = 0; i <= data.length - 1; i++) {
    this.service.master[i] = data[i];
    this.service.master[i].detalleCompra = [];
    this.service.getDetalleComprasID(data[i].IdCompra).subscribe(res => {
      console.log(res);
      for (let l = 0; l <= res.length - 1; l++) {
        this.service.master[i].detalleCompra.push(res[l]); 
      }
    });
  }
  console.log(this.service.master);
    this.listData = new MatTableDataSource(this.service.master);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    this.listData.paginator._intl.itemsPerPageLabel = 'Compras por Pagina';
})
    // this.service.getOrdenCargaList().subscribe(data => {
    //   console.log(data);
      
    // });
  }

  onEdit(compra: Compras){
    console.log(compra)
    localStorage.setItem('IdCompra', compra.IdCompra.toString())
    this.router.navigate(['/formatoCompras']);
  }

  onDelete(compra: Compras){
    console.log(compra)
    
    Swal.fire({
      title: '¿Segur@ de Borrar Pedido?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        //Borrar todos los detalles compra
        this.service.deleteDetalleCompraID(compra.IdCompra).subscribe(resDetalle=>{
          console.log(resDetalle);
          //BorrarCompra
          this.service.deleteCompra(compra.IdCompra).subscribe(res=>{
            console.log(res);
            this.obtenerCompras();
          })
        })
          Swal.fire({
            title: 'Borrado',
            icon: 'success',
            timer: 1000,
            showCancelButton: false,
            showConfirmButton: false
          });
      }
    })
  }



  tipoDeCambio() {
    let hora = new Date().getHours();
    let fechahoy = new Date();
    let fechaayer = new Date();


    fechaayer.setDate(fechahoy.getDate() - 1)
    let diaayer = new Date(fechaayer).getDate();
    let mesayer = new Date(fechaayer).getMonth();
    let añoayer = new Date(fechaayer).getFullYear();
    let diasemana = new Date(fechahoy).getDay();

    let i;
    if (hora > 11) {
      i = 2;
    } else {
      i = 1;
    }
    this.traerApi().subscribe(data => {
      let l;

      l = data.bmx.series[0].datos.length;
      // console.log(i);
      // console.log(l);
      // console.log(data.bmx.series[0].datos.length);
      // console.log(data.bmx.series[0].datos[l-i].dato);


      this.TipoCambio = data.bmx.series[0].datos[l - i].dato;
      console.log('------CAMBIO------');
      console.log(this.TipoCambio);
      console.log('------CAMBIO------');
    })

  }

  traerApi(): Observable<any> {

    return this.http.get("/SieAPIRest/service/v1/series/SF63528/datos/", httpOptions)

  }

  public compraBlanco: Compras = {
IdCompra: +"",    
Folio: +"",
PO : "",
IdProveedor : +"",
Proveedor : "",
Subtotal :"",
Total:"",
Descuento:"0",
ImpuestosRetenidos:"",
ImpuestosTrasladados:"",
Moneda:"MXN",
Observaciones:"",
TipoCambio:"",
CondicionesPago:"",
PesoTotal:"",
Estatus:"Creada",
Factura: +"",
Ver:"",
FechaElaboracion : new Date(),
FechaPromesa : new Date(),
FechaEntrega : new Date(),
Comprador:"",
SubtotalDlls: "",
TotalDlls: "",
DescuentoDlls: "0",
ImpuestosTrasladadosDlls: ""
  }

  onAdd(){
    this.service.getNewFolio().subscribe(res=>{
      console.log(res); 
      let dateString = '2000-01-01T00:00:00' 
      let newDate = new Date(dateString);
      this.compraBlanco.Folio = +res;
      this.compraBlanco.FechaEntrega = newDate;
      this.compraBlanco.FechaPromesa = newDate;
      this.compraBlanco.TipoCambio = this.TipoCambio;


console.log(this.compraBlanco);

      this.service.addCompra(this.compraBlanco).subscribe(res=>{
        console.log(res);
        this.service.getUltimoIdCompra().subscribe(res=>{
          console.log(res);
          localStorage.setItem('IdCompra', res.toString())
          this.router.navigate(['/formatoCompras']);
        })
    })
    })
    // generarFolio
    // Estatus

  }

  applyFilter(filtervalue: string){  
    this.listData.filter= filtervalue.trim().toLocaleLowerCase();  
  }
}