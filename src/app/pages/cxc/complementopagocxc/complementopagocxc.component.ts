import { Component, OnInit, ViewChild, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { MatTableDataSource, MatSort, MatPaginator, MatTable } from '@angular/material';
import { Router } from '@angular/router';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { ReciboPagoService } from '../../../services/complementoPago/recibo-pago.service';
import { ReciboPago } from '../../../Models/ComplementoPago/recibopago';
import { PagoCFDI } from '../../../Models/ComplementoPago/pagocfdi';
import { ReciboPagoMasterPagoCFDI } from '../../../Models/ComplementoPago/recibopagoMasterpagoCFDI';


@Component({
  selector: 'app-complementopagocxc',
  templateUrl: './complementopagocxc.component.html',
  styleUrls: ['./complementopagocxc.component.css'],
  animations: [
    trigger('detailExpand', [
      // state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('collapsed', style({ height: '0px', minHeight: '0', visibility:'hidden' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ComplementopagocxcComponent implements OnInit {

  
  constructor(private service: ReciboPagoService, private router: Router) {
    
    this.service.listen().subscribe((m: any) => {
      this.refreshReciboPagoList();
      // this.detallesFactura();
    });
    
  }
  
  ngOnInit() {
    
    this.refreshReciboPagoList();
    // this.detallesFactura();
    // this.Folio();
    this.ObtenerUltimaFactura();
    // this.listData.connect();
  }

  IdReciboPago: any;
  listData: MatTableDataSource<any>;
  MasterDetalle = new Array<ReciboPagoMasterPagoCFDI>();
  listDetalleData;
  displayedColumns: string[] = ['Id', 'Nombre', 'FechaPago', 'Cantidad', 'Estado', 'Options'];
  displayedColumnsVersion: string[] = ['Cantidad'];
  folio: string;
  fileUrl;
  xmlparam;
  expandedElement: any;
  detalle = new Array<PagoCFDI>();
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');

  a = document.createElement('a');
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  //Obtener lista de Recibo de pagos y pagos de CFDI 
  refreshReciboPagoList() {
    this.service.getReciboPagoClienteList().subscribe(data => {
      console.log(data);
      for (let i = 0; i <= data.length - 1; i++) {
        this.service.master[i] = data[i]
        this.service.master[i].pagoCFDI = [];
        this.service.getPagoCFDIFacturaList(data[i].Id).subscribe(res => {
          for (let l = 0; l <= res.length - 1; l++) {
            this.service.master[i].pagoCFDI.push(res[l]);
          }
        });
      }
      this.listData = new MatTableDataSource(this.service.master);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Recibos de Pago por Pagina';
      // console.log(this.service.master);
    });


  }

  //Obtener un solo PagoCFDI por ID
  getPagoCFDI(id) {

  }

  //Obtener lista de PagosCFDI
  getPagosCFDIList() {

  }

  //Generar Recibo Pago en Blanco
  public ReciboPagoBlanco: ReciboPago =
    {
      Id: 0,
      IdCliente: 1,
      FechaExpedicion: new Date(),
      FechaPago: new Date(),
      FormaPago: "",
      Moneda: "",
      TipoCambio: "",
      Cantidad: "0",
      Referencia: "",
      UUID: "",
      Tipo: "Pago",
      Certificado: "",
      NoCertificado: "",
      Cuenta: "",
      CadenaOriginal: "",
      SelloDigitalSAT: "",
      SelloDigitalCFDI: "",
      NoSelloSAT: "",
      RFCPAC: "",
      Estatus: "Creada"
    }

  //Agregar
  onAdd() {

    this.service.addReciboPago(this.ReciboPagoBlanco).subscribe(res => {
      localStorage.setItem('IdRecibo', this.IdReciboPago.toString());
      this.router.navigate(['/recibopago']);
    });

  }
  ObtenerUltimaFactura() {
    // this.service.getUltimaFactura().subscribe(data => {
    //   // console.log(data);
    //   this.IdFactura = data[0].Id;
    //   if (!this.IdFactura){
    //     this.IdFactura='1';
    //   }
    //   // console.log(this.IdFactura);
    //   return this.IdFactura;
    //   // console.log(this.IdFactura);
    //   });

    this.service.getUltimoReciboPago().subscribe(data => {
      this.service.IdReciboPago = data[0].Id;
      this.IdReciboPago = this.service.IdReciboPago
      console.log(this.service.IdReciboPago);
    });

  }

  //Editar
  onEdit(reciboPago: ReciboPago) {
    this.service.formData = reciboPago;
    let Id = reciboPago.Id;
    localStorage.setItem('IdRecibo', Id.toString());
    this.router.navigate(['/recibopago']);
    // console.log(Id);

    // this.router.navigate(['/facturacionCxcAdd', Id]);

  }

  //Eliminar
  onDelete(reciboPago: ReciboPago) {

    Swal.fire({
      title: '¿Seguro de Borrar Pago?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {

        // console.log(reciboPago);
        this.service.deleteReciboPago(reciboPago.Id).subscribe(data => {
          this.refreshReciboPagoList();
          console.log(data);
          Swal.fire({
            title: 'Borrado',
            icon: 'success',
            timer: 1000,
            showCancelButton: false,
            showConfirmButton: false
          });
        });



      }
    })



  }

  applyFilter(filtervalue: string) {
    // console.log(this.listData);
    this.listData.filterPredicate = (data, filter: string) => {
      return data.Nombre.toString().toLowerCase().includes(filter);
      // return data.Folio.toString().toLowerCase().includes(filter) || data.Nombre.toLowerCase().includes(filter);
     };
    this.listData.filter= filtervalue.trim().toLocaleLowerCase();
    // console.log(this.listData);
  }


}
