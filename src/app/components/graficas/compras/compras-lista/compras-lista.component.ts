import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogConfig, MatDialog } from '@angular/material';
import { CompraService } from 'src/app/services/compras/compra.service';
import { Observable, Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ComprasPdfComponent } from 'src/app/components/compras-reporte/compras-pdf.component';
import { Compras } from 'src/app/Models/Compras/compra-model';

const httpOptions = {
  headers: new HttpHeaders({
    'Bmx-Token': 'd83c7088f2823be9f29cc124cf95dc37056de37c340da5477a09ca1ee91a80a6',
    //'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Headers': 'Bmx-Token, Accept, Accept-Encoding, Content-Type, Origin',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'

  })
}

@Component({
  selector: 'app-compras-lista',
  templateUrl: './compras-lista.component.html',
  styleUrls: ['./compras-lista.component.css']
})
export class ComprasListaComponent implements OnInit {
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  listData: MatTableDataSource<any>;
  displayedColumns: string [] = ['Folio', 'Proveedor', 'FechaElaboracion', 'Estatus', 'Options'];
  arrCompra: any;
  TipoCambio: string;

  public compraBlanco: Compras = {
    IdCompra: +"",    
    Folio: +"",
    PO : "",
    IdProveedor : +"",
    Proveedor : "",
    Subtotal :"0",
    Total:"0",
    Descuento:"0",
    ImpuestosRetenidos:"",
    ImpuestosTrasladados:"",
    Moneda:"MXN",
    Observaciones:"",
    TipoCambio:"",
    CondicionesPago:"",
    SacosTotales: "",
    PesoTotal:"",
    Estatus:"Creada",
    Factura: +"",
    Ver:"",
    FechaElaboracion : new Date(),
    FechaPromesa : new Date(),
    FechaEntrega : new Date(),
    Comprador:"",
    SubtotalDlls: "0",
    TotalDlls: "0",
    DescuentoDlls: "0",
    ImpuestosTrasladadosDlls: ""
      }

  constructor(private serviceCompra:CompraService, private http: HttpClient,public router: Router, private dialog: MatDialog) { }

  ngOnInit() {
    this.obtenerCompras();
    this.tipoDeCambio();
  }

  ngOnDestroy(): void {
    if(this.subs1){
      this.subs1.unsubscribe();
    }
    if(this.subs2){
      this.subs2.unsubscribe();
    }
  }
  
  onAdd(){
    this.serviceCompra.getNewFolio().subscribe(res=>{
      console.log(res); 
      let dateString = '1900-01-01T00:00:00' 
      let newDate = new Date(dateString);
      this.compraBlanco.Folio = +res;
      this.compraBlanco.FechaEntrega = newDate;
      // this.compraBlanco.FechaPromesa = newDate;
      this.compraBlanco.TipoCambio = this.TipoCambio;


console.log(this.compraBlanco);

      this.serviceCompra.addCompra(this.compraBlanco).subscribe(res=>{
        console.log(res);
        this.serviceCompra.getUltimoIdCompra().subscribe(res=>{
          console.log(res);
          localStorage.setItem('IdCompra', res.toString())
          this.router.navigate(['/formatoCompras']);
        })
    })
    })
    // generarFolio
    // Estatus

  }


 onAddCompraAdministrativa(){
  this.serviceCompra.getNewFolio().subscribe(res=>{
    console.log(res); 
    let dateString = '1900-01-01T00:00:00';
    let newDate = new Date(dateString);
    this.compraBlanco.Folio = +res;
    this.compraBlanco.FechaEntrega = newDate;
    this.compraBlanco.FechaPromesa = newDate;
    this.compraBlanco.TipoCambio = this.TipoCambio;
    this.compraBlanco.Estatus = 'Administrativa';


console.log(this.compraBlanco);   

    this.serviceCompra.addCompra(this.compraBlanco).subscribe(res=>{
      console.log(res);
      this.serviceCompra.getUltimoIdCompra().subscribe(res=>{
        console.log(res);
        localStorage.setItem('IdCompra', res.toString())
        this.router.navigate(['/formatoCompras']);
      })
  })
  })
  // generarFolio
  // Estatus

}
subs1: Subscription
subs2: Subscription
obtenerCompras(){
   this.arrCompra = this.serviceCompra.getComprasList();
  this.subs1 =this.arrCompra.subscribe(data =>{
  console.log(data);
  this.serviceCompra.master = []
    for (let i = 0; i <= data.length - 1; i++) {
      this.serviceCompra.master[i] = data[i];
      this.serviceCompra.master[i].detalleCompra = [];
    this.subs2 =  this.serviceCompra.getDetalleComprasID(data[i].IdCompra).subscribe(res => {
        console.log(res);
        for (let l = 0; l <= res.length - 1; l++) {
          this.serviceCompra.master[i].detalleCompra.push(res[l]); 
        }
      });
    }
    console.log(this.serviceCompra.master);
      this.listData = new MatTableDataSource(this.serviceCompra.master);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Compras por Pagina';
  })
      // this.service.getOrdenCargaList().subscribe(data => {
      //   console.log(data);
        
      // });
    }

onEdit(compra){
  console.log(compra)
  localStorage.setItem('IdCompra', compra.IdCompra.toString())
  this.router.navigate(['/formatoCompras']);
}

onDelete(compra){
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
      this.serviceCompra.deleteDetalleCompraID(compra.IdCompra).subscribe(resDetalle=>{
        console.log(resDetalle);
        //BorrarCompra
        this.serviceCompra.deleteCompra(compra.IdCompra).subscribe(res=>{
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
openrep(row){
  this.serviceCompra.formt = row
  // console.log();
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = false;
  dialogConfig.autoFocus = true;
  dialogConfig.width="70%";
  this.dialog.open(ComprasPdfComponent, dialogConfig);

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





}
