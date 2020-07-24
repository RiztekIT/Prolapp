import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { MatDialog, MatTableDataSource, MatSort, MatPaginator, MatDialogConfig } from '@angular/material';
import { CurrencyPipe } from '@angular/common';
import { VentasPedidoService } from 'src/app/services/ventas/ventas-pedido.service';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'src/app/services/message.service';
import { EnviarfacturaService } from 'src/app/services/facturacioncxc/enviarfactura.service';
import { pedidoMaster } from 'src/app/Models/Pedidos/pedido-master';
import { DetallePedido } from 'src/app/Models/Pedidos/detallePedido-model';
import { Pedido } from 'src/app/Models/Pedidos/pedido-model';
import { ReportesModalComponent } from 'src/app/components/reportes-modal/reportes-modal.component';
import { ReporteEmisionComponent } from 'src/app/components/reporte-emision/reporte-emision.component';


import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-ordendecompracliente',
  templateUrl: './ordendecompracliente.component.html',
  styleUrls: ['./ordendecompracliente.component.css'],
  animations: [
    trigger('detailExpand', [
      // state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),  
  ],
})
export class OrdendecompraclienteComponent implements OnInit {

  constructor(public router: Router, private dialog: MatDialog, private currencyPipe: CurrencyPipe, public service: VentasPedidoService, 
    private _formBuilder: FormBuilder,  public _MessageService: MessageService,  public enviarfact: EnviarfacturaService,) { }

    IdPedido: any;
    idCliente;
    xmlparam;
    fileUrl;
    folioparam;
    idparam;
    MasterDetalle = new Array<pedidoMaster>();
  
    listData: MatTableDataSource<any>;
    displayedColumns: string[] = ['IdPedido', 'Nombre', 'Folio', 'Subtotal', 'Descuento', 'Total', 'Observaciones', 'FechaVencimiento', 'OrdenDeCompra', 'FechaDeEntrega', 'CondicionesDePago', 'Vendedor', 'Estatus', 'Usuario',  'LugarDeEntrega', 'Moneda', 'Prioridad', 'Flete', 'Options'];
    
    displayedColumnsVersion: string[] = ['ClaveProducto', 'Producto', 'Cantidad'];
  
    expandedElement: any;
  ngOnInit() {
    console.log('localStorage.getItem("ClienteId"): ', localStorage.getItem("ClienteId"));
    this.idCliente=localStorage.getItem("ClienteId")
    this.refreshPedidoList();

  }

  detalle = new Array<DetallePedido>();
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');

  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  refreshPedidoList() {
    // this.service.getPedidoList().subscribe(data => {
    // this.service.getPedidoclienteId(this.idCliente).subscribe(data => {
    // this.service.getPedidoclienteId(241).subscribe(data => {
    this.service.getPedidoclienteId(this.idCliente).subscribe(data => {
      console.log(data);
      for (let i = 0; i <= data.length - 1; i++) {
        if (data[i].Estatus == 'Creada') {
          // console.log(data[i]);
          // console.log('ELIMINAR ESTE PEDIDO');
          // console.log(i + 1);
          this.service.onDelete(data[i].IdPedido).subscribe(res => {
            this.refreshPedidoList();
          });
        }
        this.service.master[i] = data[i]
        this.service.master[i].DetallePedido = [];
        this.service.getDetallePedidoId(data[i].IdPedido).subscribe(res => {
          for (let l = 0; l <= res.length - 1; l++) {
            this.service.master[i].DetallePedido.push(res[l]);
          }
        });
      }

      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Pedidos por Pagina';
      console.log(this.service.master);
    });
  }

  onEdit(pedido: Pedido) {

    this.service.formDataPedido = pedido;
    this.service.IdCliente = pedido.IdCliente;
    let Id = pedido.IdPedido;
    localStorage.setItem('IdPedido', Id.toString());
    this.router.navigate(['/pedidoventasAdd']);
  }

  openrep2(){

    // console.log();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    this.dialog.open(ReportesModalComponent, dialogConfig);

  }

  openrep(row){

    console.log(row);
    this.service.formt = row
    // console.log();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    this.dialog.open(ReporteEmisionComponent, dialogConfig);

  }

  email(id?: string, folio?:string){
    localStorage.removeItem('xml'+folio);
    localStorage.removeItem('pdf'+folio);
      document.getElementById('enviaremail').click();
      this.folioparam = folio;
      this.idparam = id;
      this._MessageService.correo='ivan.talamantes@live.com';
      this._MessageService.cco='ivan.talamantes@riztek.com.mx';
      this._MessageService.asunto='Envio Factura '+folio;
      this._MessageService.cuerpo='Se ha enviado un comprobante fiscal digital con folio '+folio;
      this._MessageService.nombre='ProlactoIngredientes';
        this.enviarfact.xml(id).subscribe(data => {
          localStorage.setItem('xml' + folio, data)
          this.xmlparam = folio;
          setTimeout(()=>{
            const content: Element = document.getElementById('element-to-PDF');
            const option = {
              margin: [0, 0, 0, 0],
              filename: 'F-' + folio + '.pdf',
              image: { type: 'jpeg', quality: 1 },
              html2canvas: { scale: 2, logging: true, scrollY: content.scrollHeight },
              jsPDF: { format: 'letter', orientation: 'portrait' },
            };
            html2pdf().from(content).set(option).output('datauristring').then(function(pdfAsString){
              localStorage.setItem('pdf'+folio, pdfAsString);
            })
          },1000)
      })
    
    }

      //Filtro para buscar valores de la tabla de pedidos por Nombre de Cliente e IdPedido
  applyFilter(filtervalue: string) {
    this.listData.filterPredicate = (data, filter: string) => {
      return data.Nombre.toString().toLowerCase().includes(filter) || data.IdPedido.toString().includes(filter);
    };
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();

  }





}
