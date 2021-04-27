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

import { ComprasPdfComponent } from '../../../components/compras-reporte/compras-pdf.component';
import { EventosService } from 'src/app/services/eventos/eventos.service';


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
estatusSelect;
hola = 'hola'

constructor(public router: Router,private service:CompraService, private dialog: MatDialog, private http: HttpClient, public CompraService: CompraService,
  private eventosService:EventosService,) {
  
  // this.service.listen().subscribe((m:any)=>{
    //   console.log(m);
    //   this.refreshOrdenCargaList();
    //   });
    
  }
  
  ngOnInit() {
    
    this.obtenerCompras();
    this.tipoDeCambio();

      //^ **** PRIVILEGIOS POR USUARIO *****
      this.obtenerPrivilegios();
      //^ **** PRIVILEGIOS POR USUARIO *****
  }

  
    
    //^ **** PRIVILEGIOS POR USUARIO *****
    privilegios: any;
    privilegiosExistentes: boolean = false;
    modulo = 'Compras';
    area = 'Compras';
  
    //^ VARIABLES DE PERMISOS
    AgregarCompra: boolean = false;
    AgregarCompraAdministrativa: boolean = false;
    BorrarCompra: boolean = false;
    EditarCompra: boolean = false;
    //^ VARIABLES DE PERMISOS
  
  
    obtenerPrivilegios() {
      let arrayPermisosMenu = JSON.parse(localStorage.getItem('Permisos'));
      console.log(arrayPermisosMenu);
      let arrayPrivilegios: any;
      try {
        arrayPrivilegios = arrayPermisosMenu.find(modulo => modulo.titulo == this.modulo);
        // console.log(arrayPrivilegios);
        arrayPrivilegios = arrayPrivilegios.submenu.find(area => area.titulo == this.area);
        // console.log(arrayPrivilegios);
        this.privilegios = [];
        arrayPrivilegios.privilegios.forEach(element => {
          this.privilegios.push(element.nombreProceso);
          this.verificarPrivilegio(element.nombreProceso);
        });
        // console.log(this.privilegios);
      } catch {
        console.log('Ocurrio algun problema');
      }
    }
  
    verificarPrivilegio(privilegio) {
      switch (privilegio) {
        case ('Agregar Compra'):
          this.AgregarCompra = true;
          break;
        case ('Agregar Compra Administrativa'):
          this.AgregarCompraAdministrativa = true;
          break;
        case ('Borrar Compra'):
          this.BorrarCompra = true;
          break;
        case ('Editar Compra'):
          this.EditarCompra = true;
          break;
        default:
          break;
      }
    }
    //^ **** PRIVILEGIOS POR USUARIO *****

  public listEstatus: Array<Object> = [
    { Estatus: 'Todos' },
    { Estatus: 'Guardada' },
    { Estatus: 'Transito' },
    { Estatus: 'Finalizada' },
    { Estatus: 'Administrativa' }
  ];

  estatusCambio(event){
    // console.log(event);
this.estatusSelect = event.value;
console.log(this.estatusSelect);
if (this.estatusSelect==='Todos'){
  this.applyFilter2('')
}else {

  this.applyFilter2(this.estatusSelect)
}

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
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
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
            
          this.eventosService.movimientos('Compra Borrada')
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

  //Generar una compra de materia prima
  onAdd(){
    this.service.getNewFolio().subscribe(res=>{
      console.log(res); 
      let dateString = '1900-01-01T00:00:00' 
      let newDate = new Date(dateString);
      this.compraBlanco.Folio = +res;
      this.compraBlanco.FechaEntrega = newDate;
      // this.compraBlanco.FechaPromesa = newDate;
      this.compraBlanco.TipoCambio = this.TipoCambio;


console.log(this.compraBlanco);

      this.service.addCompra(this.compraBlanco).subscribe(res=>{
        console.log(res);
        this.service.getUltimoIdCompra().subscribe(res=>{
          console.log(res);
          localStorage.setItem('IdCompra', res.toString())
          
          this.eventosService.movimientos('Compra Generada')
          this.router.navigate(['/formatoCompras']);
        })
    })
    })
    // generarFolio
    // Estatus

  }

  
openrep(row){
console.clear();
  console.log(row);
  this.CompraService.formt = row
  this.CompraService.formt.detalleCompra = row.detalleCompra;

  // console.log();
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = false;
  dialogConfig.autoFocus = true;
  dialogConfig.width = "0%";
  dialogConfig.height = "0%";
  this.dialog.open(ComprasPdfComponent, dialogConfig);

}

  //Generar Compra Administrativa

 onAddCompraAdministrativa(){
    this.service.getNewFolio().subscribe(res=>{
      console.log(res); 
      let dateString = '1900-01-01T00:00:00';
      let newDate = new Date(dateString);
      this.compraBlanco.Folio = +res;
      this.compraBlanco.FechaEntrega = newDate;
      this.compraBlanco.FechaPromesa = newDate;
      this.compraBlanco.TipoCambio = this.TipoCambio;
      this.compraBlanco.Estatus = 'Administrativa';


console.log(this.compraBlanco);   

      this.service.addCompra(this.compraBlanco).subscribe(res=>{
        console.log(res);
        this.service.getUltimoIdCompra().subscribe(res=>{
          console.log(res);
          localStorage.setItem('IdCompra', res.toString())
          
          this.eventosService.movimientos('Compra Administrativa Generada')
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
  applyFilter2(filtervalue: string){  
    // this.listData.filter= filtervalue.trim().toLocaleLowerCase(); 
    
    this.listData.filterPredicate = (data, filter: string) => {
      return data.Estatus.toString().toLowerCase().includes(filter);
    };
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();
  }
}
