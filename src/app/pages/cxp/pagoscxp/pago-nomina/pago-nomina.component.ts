import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Proveedor } from 'src/app/Models/catalogos/proveedores-model';
import { Compras } from 'src/app/Models/Compras/compra-model';
import { DetalleCompra } from 'src/app/Models/Compras/detalleCompra-model';
import { Pagos } from 'src/app/Models/Pagos/pagos-model';
import { ProveedoresService } from 'src/app/services/catalogos/proveedores.service';
import { CompraService } from 'src/app/services/compras/compra.service';
import { PagoscxpService } from 'src/app/services/cuentasxpagar/pagoscxp.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-pago-nomina',
  templateUrl: './pago-nomina.component.html',
  styleUrls: ['./pago-nomina.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),  
  ],
})
export class PagoNominaComponent implements OnInit {
  
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  FolioPago;
  FolioModulo: number;
  Cantidad: number;
  arrCompra: any;

  tipoSelect;
  myControlProveedor = new FormControl();

  IdProveedor
  filteredOptionsProveedor: Observable<any[]>;
  options: Proveedor[] = [];
  listProveedores: Proveedor[] = []; 

  compra: Compras;
  detalleCompra: DetalleCompra;
  ProductoPrecio;

  listData: MatTableDataSource<any>;
  displayedColumns: string [] = ['Folio', 'PO', 'Proveedor', 'PesoTotal', 'FechaElaboracion', 'FechaPromesa','Estatus', 'Options'];
  displayedColumnsVersion: string[] = ['ClaveProducto', 'Producto', 'Cantidad', 'PrecioUnitario', 'CostoTotal'];
  expandedElement: any;

  listData2: MatTableDataSource<any>;
  displayedColumns2: string [] = ['Folio', 'PO', 'Proveedor', 'Cantidad','Saldo', 'FechaElaboracion', 'FechaPromesa','Estatus', 'Options'];
  expandedElement2: any;
  

  futuro;

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
  detalleCompraBlanco;



  public listTipos: Array<any> = [
    { tipo: 'Luz' },
    { tipo: 'Gas' },    
    { tipo: 'Telefono' },    
    { tipo: 'Internet' },    
    { tipo: 'Alarmas' },    
    { tipo: 'Nomina' },    
    { tipo: 'Servicios Varios' },    
  ];

  

  constructor(public pagoService: PagoscxpService, public proveedorService: ProveedoresService, private comprasSVC:CompraService) { }

  ngOnInit() {
    this.compra =  this.compraBlanco;
    this.detalleCompra = new DetalleCompra();
    this.pagoService.objetoPago = <Pagos>{};
    this.nuevoFolio()
    this.dropdownRefreshProveedor()
    this.futuro = false;
    this.obtenerCompras();
  }

  nuevoFolio(){
    this.pagoService.getNewFolio().subscribe(folionuevo=>{
      console.log(folionuevo);
      this.FolioPago = folionuevo;

    })
  }

  newPago(){
    this.pagoService.objetoPago.Folio = this.FolioPago;
    this.pagoService.objetoPago.FolioDocumento = this.FolioModulo;
    this.pagoService.objetoPago.TipoDocumento = 'Otros Servicios';
    this.pagoService.objetoPago.Cantidad = this.Cantidad.toString();
    console.log(this.pagoService.objetoPago);
    this.pagoService.addPago(this.pagoService.objetoPago).subscribe(res=>{
      console.log(res);
      Swal.fire({
        title: 'Pago Generado',
        icon: 'success',
        timer: 1000,
        showCancelButton: false,
        showConfirmButton: false
      });
      
    })
  }

  dropdownRefreshProveedor() {
    this.proveedorService.getProveedoresList().subscribe(data => {
      console.log(data)
      for (let i = 0; i < data.length; i++) {
        let Proveedor = data[i];
        this.listProveedores.push(Proveedor);
        this.options.push(Proveedor)
        this.filteredOptionsProveedor = this.myControlProveedor.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filterProveedor(value))
          );
      }
    });

  }

  private _filterProveedor(value: any): any[] {
    if (typeof value !=='undefined'){

      const filterValue = value.toString().toLowerCase();
      return this.listProveedores.filter(option =>
        option.Nombre.toLowerCase().includes(filterValue) ||
        option.IdProveedor.toString().includes(filterValue));
    }
  }

  onSelectionChangeProveedor(options: Proveedor, event: any) {
    if (event.isUserInput) {
      //this.NombreProveedor = options.Nombre;
      this.compra.Proveedor = options.Nombre;
      this.compra.IdProveedor = options.IdProveedor

      if(!this.futuro){

        this.buscarComprasProveedor(options.IdProveedor)

      }
    }
  }

  buscarComprasProveedor(id){

    let query = "select compras.*, (select sum(convert(float,Cantidad)) as Pagos from pagos where FolioDocumento=compras.IdCompra) as Pagos from compras where Estatus='Otros' and idproveedor="+id
    console.log(query);
    this.comprasSVC.generarConsulta(query).subscribe((res:any)=>{

      

      for(let i=0; i<res.length; i++){
                
        res[i].saldo = +res[i].Total - +res[i].Pagos




      }

      

      console.log(res);
      this.listData2 = new MatTableDataSource(res);
      this.listData2.sort = this.sort;
      this.listData2.paginator = this.paginator;

    })

  }

 

  newGasto(){

    this.compra.Estatus = 'Otros'
    this.compra.Total = this.ProductoPrecio;
    this.compra.Subtotal = this.ProductoPrecio;

    console.log(this.compra);
    console.log(this.detalleCompra);

    this.comprasSVC.getNewFolio().subscribe(res=>{
      this.compra.Folio = +res;
      let fecha1 = new Date()
      let fecha2 = new Date(10/10/10)

      let query = "insert into compras output inserted.* values("+this.compra.Folio+",'',"+this.compra.IdProveedor+", '"+this.compra.Proveedor+"','"+this.compra.Subtotal+"', '"+this.compra.Total+"','','','','MXN','','','','','','Otros','0','','"+fecha1.toISOString()+"','"+this.compra.FechaPromesa.toISOString()+"','"+fecha2.toISOString()+"','','','','','' )"
  console.log(query);
  this.comprasSVC.generarConsulta(query).subscribe(res=>{
    
    let idcompra = res[0].IdCompra
    
    let query2 = "insert into detallecompra values ("+idcompra+", 'Otro', '"+this.detalleCompra.Producto+"','1','','','"+this.compra.Total+"', '', '','','','','')"
    console.log(query2);
        this.comprasSVC.generarConsulta(query2).subscribe(res2=>{

          console.log(res2);
          this.obtenerCompras()

        })
  
      })

    })



  }

  obtenerCompras(){
    let query = "select * from compras where Estatus='Otros'"
    this.arrCompra = this.comprasSVC.generarConsulta(query);
    this.arrCompra.subscribe(data =>{
    console.log(data);
    this.comprasSVC.master = []
      for (let i = 0; i <= data.length - 1; i++) {
        this.comprasSVC.master[i] = data[i];
        this.comprasSVC.master[i].detalleCompra = [];
        this.comprasSVC.getDetalleComprasID(data[i].IdCompra).subscribe(res => {
          console.log(res);
          for (let l = 0; l <= res.length - 1; l++) {
            this.comprasSVC.master[i].detalleCompra.push(res[l]); 
          }
        });
      }
      console.log(this.comprasSVC.master);
        this.listData = new MatTableDataSource(this.comprasSVC.master);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
        console.log(this.listData);
        //this.listData.paginator._intl.itemsPerPageLabel = 'Compras por Pagina'
        
    })
        // this.service.getOrdenCargaList().subscribe(data => {
        //   console.log(data);
          
        // });
      }

  nuevoPago(row){
    console.log(row);

  }

  onDeleteCompra(row){

    let query = "delete from compras where idcompra="+row.IdCompra
    console.log(query);
    this.comprasSVC.generarConsulta(query).subscribe(res=>{

      console.log(res);
      let query2 = "delete from detallecompra where idcompra="+row.IdCompra
      console.log(query2);
      this.comprasSVC.generarConsulta(query2).subscribe(res2=>{

        console.log(res2);

      })


    })




  }

  

  addPago(row){

    Swal.fire({
      title: 'Cantidad de Pago',
      input: 'text',      
      inputValue: row.Total,
      showCancelButton: true,

    }).then(res=>{
      if(res){

        this.pagoService.objetoPago.Folio = this.FolioPago;
        this.pagoService.objetoPago.FolioDocumento = row.IdCompra;
        this.pagoService.objetoPago.TipoDocumento = 'Otros Servicios';
        this.pagoService.objetoPago.Cantidad = res.value.toString();
        console.log(this.pagoService.objetoPago);
        this.pagoService.addPago(this.pagoService.objetoPago).subscribe(res=>{
          console.log(res);
          Swal.fire({
            title: 'Pago Generado',
            icon: 'success',
            timer: 1000,
            showCancelButton: false,
            showConfirmButton: false
          });

          this.pagoService.filter('New')
          this.buscarComprasProveedor(this.IdProveedor)
          
        })

      }
    })






    console.log(row);

    this.Cantidad = row.Total;
    this.pagoService.objetoPago.FolioDocumento = row.IdCompra;

    /* this.FolioModulo = row.PO; */

  }

  

}
