import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { MatTableDataSource, MatPaginator, MatTable, MatSnackBar,  } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { CotizacionComponent } from 'src/app/components/cotizacion/cotizacion.component';
import { trigger, state, transition, animate, style } from '@angular/animations';
import * as html2pdf from 'html2pdf.js';
import { MessageService } from 'src/app/services/message.service';
import { EmailComponent } from 'src/app/components/email/email/email.component';
import { VentasCotizacionService } from '../../../services/ventas/ventas-cotizacion.service';
import { DetalleCotizacion } from '../../../Models/ventas/detalleCotizacion-model';
import { Cotizacion } from '../../../Models/ventas/cotizacion-model';
import { cotizacionMaster } from '../../../Models/ventas/cotizacion-master';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cotizaciones-ventas',
  templateUrl: './cotizaciones-ventas.component.html',
  styleUrls: ['./cotizaciones-ventas.component.css'],
  animations: [
    trigger('detailExpand', [
      // state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),  
  ],
})
export class CotizacionesVentasComponent implements OnInit {

  constructor( public router: Router, private dialog: MatDialog, public _MessageService: MessageService, private service: VentasCotizacionService) {

    this.service.listen().subscribe((m: any) => {
      console.log(m);
      this.refreshCotizacionesList();
    });

   }

  ngOnInit() {
    this.refreshCotizacionesList();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    this.dialog.open(CotizacionComponent, dialogConfig);
  }

  IdCotizacion: any;
  
  MasterDetalle = new Array<cotizacionMaster>();

  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['IdCliente', 'Nombre', 'RFC', 'Subtotal', 'Total', 'Descuento', 'SubtotalDlls', 'TotalDlls', 'DescuentoDlls', 'Observaciones', 'Vendedor', 'Moneda', 'FechaDeExpedicion', 'Flete',  'Folio', 'Telefono', 'Correo', 'Options'];
  
  displayedColumnsVersion: string[] = ['ClaveProducto', 'Producto', 'Cantidad'];

  expandedElement: any;

  detalle = new Array<DetalleCotizacion>();
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  refreshCotizacionesList() {
    // this.service.getPedidoList().subscribe(data => {
    this.service.getCotizaciones().subscribe(data => {
      console.log(data);
      for (let i = 0; i <= data.length - 1; i++) {
        if (data[i].Estatus == 'Creada') {
          // console.log(data[i]);
          // console.log('ELIMINAR ESTE PEDIDO');
          // console.log(i + 1);
          this.service.onDeleteCotizacion(data[i].IdCotizacion).subscribe(res => {
            console.log(data[i].IdCotizacion);
            this.refreshCotizacionesList();
          });
        }
        this.service.master[i] = data[i]
        this.service.master[i].DetalleCotizacion = [];
        this.service.GetDetalleCotizacionId(data[i].IdCotizacion).subscribe(res => {
          // console.log(res); 
          for (let l = 0; l <= res.length - 1; l++) {
            this.service.master[i].DetalleCotizacion.push(res[l]);
          }
        });
      }

      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Pedidos por Pagina';
      // console.log(this.service.master);
    });
  }

  applyFilter(filtervalue: string) {
    this.listData.filterPredicate = (data, filter: string) => {
      return data.Nombre.toString().toLowerCase().includes(filter) || data.IdCotizacion.toString().includes(filter);
    };
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();

  }


  openrep(row){

    console.log(row);
    this.service.formrow = row;
    // console.log();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    this.dialog.open(CotizacionComponent, dialogConfig);
  }

  
email(){
  console.log();
    // console.log();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    this.dialog.open(EmailComponent, dialogConfig);

  console.log('asdasd');
  document.getElementById('enviaremail').click();
  
    // this.folioparam = folio;
    // this.idparam = id;
    this._MessageService.correo='ivan.talamantes@live.com';
    this._MessageService.cco='ivan.talamantes@riztek.com.mx';
    this._MessageService.asunto='Envio Factura ';
    this._MessageService.cuerpo='Se ha enviado un comprobante fiscal digital con folio ';
    this._MessageService.nombre='ProlactoIngredientes';
        setTimeout(()=>{
          const content: Element = document.getElementById('Cotizacion-PDF');
          const option = {
            margin: [0, 0, 0, 0],
            filename: 'F-'  + '.pdf',
            image: { type: 'jpeg', quality: 1 },
            html2canvas: { scale: 2, logging: true, scrollY: 0 },
            jsPDF: { format: 'letter', orientation: 'portrait' },
          };
          html2pdf().from(content).set(option).output('datauristring').then(function(pdfAsString){
            localStorage.setItem('pdf', pdfAsString);
            this.statusparam=true;          
            console.log(this.statusparam);
          })
        },1000)
  }

  
  onAdd(){

    this.ObtenerFolio();
    // this.router.navigate(['/cotizacionesVentasAdd'])
  }


  public CotizacionBlanco: Cotizacion = 
  {
IdCotizacion: 0,
IdCliente: 0,
Nombre: "",
RFC: "",
Subtotal: 0,
Total: 0,
Descuento: 0,
SubtotalDlls: 0,
TotalDlls: 0,
DescuentoDlls: 0,
Observaciones: "",
Vendedor: 0,
Moneda: "MXN",
FechaDeExpedicion: new Date(),
Flete: "Sucursal",
Folio: 0,
Telefono: 0,
Correo:"",
IdDireccion: 0,
Estatus: "Creada", 
  }

  ObtenerFolio() {
    this.service.GetFolio().subscribe(data => {
      console.log(data[0].Folio);
      let folio = data[0].Folio;
      if (folio == "") {
        folio = 1;
      } else {
        folio = +folio + 1;
      }
      console.log(folio);
      this.CotizacionBlanco.Folio = folio.toString();
      console.log(this.CotizacionBlanco);
      //Agregar el nuevo pedido. NECESITA ESTAR DENTRO DEL SUBSCRIBEEEEEEEE :(
      this.service.addCotizacion(this.CotizacionBlanco).subscribe(res => {
        console.log(res);
        //Obtener el pedido que se acaba de generar
        this.ObtenerUltimoPedido();
      });
    });
  }

  ObtenerUltimoPedido() {
    this.service.getUltimaCotizacion().subscribe(res => {
      console.log('NUEVO IDCOTIZACION------');
      console.log(res[0]);
      console.log('NUEVO IDCOTIZACION------');
      this.IdCotizacion = res[0].IdCotizacion;
      // console.log(this.IdPedido);
      localStorage.setItem('IdCotizacion', this.IdCotizacion.toString());
      this.router.navigate(['/cotizacionesVentasAdd']);
    })
  }

  onEdit(cotizacion: Cotizacion) {

    this.service.formDataCotizacion = cotizacion;
    this.service.IdCliente = cotizacion.IdCliente;
    let Id = cotizacion.IdCotizacion;
    localStorage.setItem('IdCotizacion', Id.toString());
    this.router.navigate(['/cotizacionesVentasAdd']);
  }

  onDelete(cotizacion: Cotizacion) {

    Swal.fire({
      title: '¿Segur@ de Borrar Cotizacion  ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        
          this.service.GetDetalleCotizacionId(cotizacion.IdCotizacion).subscribe(data => {
            console.log(data);
            if (data.length > 0) {
              console.log('Si hay valores');
              for (let i = 0; i <= data.length - 1; i++) {
                // this.SumarStock(data[i].Cantidad, data[i].ClaveProducto, data[i].IdDetallePedido);
                this.DeleteCotizacionDetalleCotizacion(cotizacion);
              }
            } else {
              console.log('No hay valores');
              this.DeleteCotizacionDetalleCotizacion(cotizacion);
            }
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

  DeleteCotizacionDetalleCotizacion(cotizacion: Cotizacion) {

    this.service.onDeleteAllDetalleCotizacion(cotizacion.IdCotizacion).subscribe(res => {
      this.service.onDeleteCotizacion(cotizacion.IdCotizacion).subscribe(res => {
        this.refreshCotizacionesList();
      });
    });

  }

  
  

}
