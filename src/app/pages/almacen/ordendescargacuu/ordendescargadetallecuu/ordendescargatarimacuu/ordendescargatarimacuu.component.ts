import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialogConfig, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { TarimaService } from '../../../../../services/almacen/tarima/tarima.service';
import { OrdenDescargaService } from 'src/app/services/almacen/orden-descarga/orden-descarga.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { DetalleTarima } from '../../../../../Models/almacen/Tarima/detalleTarima-model';
import { ScannerComponent } from 'src/app/components/scanner/scanner.component';
import { Tarima } from 'src/app/Models/almacen/Tarima/tarima-model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-ordendescargatarimacuu',
  templateUrl: './ordendescargatarimacuu.component.html',
  styleUrls: ['./ordendescargatarimacuu.component.css'],
  animations: [
    trigger('detailExpand', [
      // state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OrdendescargatarimacuuComponent implements OnInit {
  IdOrdenDescarga: number;
  displayedColumnsVersion: string[] = ['IdDetalleTarima, IdTarima, ClaveProducto, Producto, Sacos, PesoxSaco, Lote, IdProveedor, Proveedor, PO, FechaMFG, FechaCaducidad, Shipper, USDA, Pedimento'];
  displayedColumnsVersionScan: string[] = ['IdDetalleTarima, IdTarima, ClaveProducto, Producto, Sacos, PesoxSaco, Lote, IdProveedor, Proveedor, PO, FechaMFG, FechaCaducidad, Shipper, USDA, Pedimento'];
  expandedElement: any;
  detalle = new Array<DetalleTarima>();
  isVisible: boolean;
  isVisibleQR: boolean;
  
  clgR = "background-color: white; color: red;"
  
  enableScan = false;
  qrleido;
  
  QRdata = new Tarima();
  QRDetalledata = new Array<DetalleTarima>();
  
  
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['IdTarima', 'Sacos', 'PesoTotal', 'QR', 'Bodega', 'Options'];
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  listDataScan: MatTableDataSource<any>;
  displayedColumnsScan: string[] = ['IdTarima', 'Sacos', 'PesoTotal', 'QR', 'Bodega', 'Options'];
  isExpansionDetailRowScan = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  @ViewChild(MatSort, null) sortScan: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginatorScan: MatPaginator;


  constructor(public router: Router, public tarimaService: TarimaService, public ordenDescargaService: OrdenDescargaService, private dialog: MatDialog,) {
    this.tarimaService.listenDt().subscribe((m: any) => {
      console.log(m);
      this.actualizarTablaTarima();
      this.actualizarTablaTarimaEscaneada();
    });
  }


  ngOnInit() {
    this.isVisible = false;
    this.isVisibleQR = true;
    this.IdOrdenDescarga = +(localStorage.getItem('IdOrdenDescarga'));

    this.actualizarTablaTarima();
  }

  regresar() {
    this.router.navigate(['/ordenDescargadetalle']);
  }

  actualizarTablaTarima() {

    this.ordenDescargaService.GetODOT(1).subscribe(dataID => {
      console.log(dataID, 'loquetraeODOT');
      // for (let i = 0; i <= dataID.length - 1; i++) {
        this.tarimaService.getTarimaQR(dataID[0].QR).subscribe(dataQR => {
          // es lo que trae detalle tarima con ese QR
          let idTarima = dataQR[0].IdTarima
          console.log(idTarima);
          console.log(dataQR[0]);


          for (let j = 0; j <= dataID.length - 1; j++) {
            console.log(dataID.length);
            this.tarimaService.masterT[j].tarima = dataQR[0];
            this.tarimaService.masterT[j].detalleTarima = [];
            this.tarimaService.getDetalleTarimaID(idTarima).subscribe(res => {
              console.log(res[j]);
              for (let l = 0; l <= res.length - 1; l++) {
                console.log(res[l]);
                this.tarimaService.masterT[j].detalleTarima.push(res[l]);
              }
            })
          }
          console.log(this.tarimaService.masterT);
          this.listData = new MatTableDataSource(dataQR);
          this.listData.sort = this.sort;
          this.listData.paginator = this.paginator;
          this.listData.paginator._intl.itemsPerPageLabel = 'Tarimas por Pagina';
        })
      // }
    })
  }

  actualizarTablaTarimaEscaneada(){
    this.ordenDescargaService.GetODOT(1).subscribe(dataID => {
      console.log(dataID, 'loquetraeODOT');
      for (let i = 0; i <= dataID.length - 1; i++) {
        this.tarimaService.getTarimaQR(dataID[i].QR).subscribe(dataQR => {
          // es lo que trae detalle tarima con ese QR
          let idTarima = dataQR[0].IdTarima
          console.log(idTarima);
          console.log(dataQR[0]);


          for (let j = 0; j <= dataID.length - 1; j++) {
            this.tarimaService.masterT[j].tarima = dataQR[0];
            this.tarimaService.masterT[j].detalleTarima = [];
            this.tarimaService.getDetalleTarimaID(idTarima).subscribe(res => {
              console.log(res[j]);
              for (let l = 0; l <= res.length - 1; l++) {
                console.log(res[l]);
                this.tarimaService.masterT[j].detalleTarima.push(res[l]);
              }
            })
          }
          console.log(this.tarimaService.masterT);
          this.listData = new MatTableDataSource(dataQR);
          this.listData.sort = this.sort;
          this.listData.paginator = this.paginator;
          this.listData.paginator._intl.itemsPerPageLabel = 'Tarimas por Pagina';
        })
      }
    })
  }


  applyFilter(filtervalue: string) {
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();
  }

  CheckQR(row, posicion) {
    console.log(row.QR);

  }

  // scanner
  escaner(evento) {
    console.log(evento);
    this.qrleido = evento;
    // this.enableScan = false;
  }

  escanear() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";

    let dialogscan = this.dialog.open(ScannerComponent, dialogConfig);

    dialogscan.afterClosed().subscribe(data => {

      console.log(data);
      this.qrleido = data;
      this.simularQR(this.qrleido);

    })

  }
  cerrarescaner() {
    console.log('cerrar escaner');
    this.enableScan = false;
    console.log(this.enableScan);
  }
  camaras(event) {
    console.log(event);

  }

  simularQR(qrleido: string) {
    this.QRdata = new Tarima();
    // this.QRdata.QR = qrleido;
    this.qrleido = '7AzEQFo';
    this.QRdata.QR = '7AzEQFo';

    console.log(this.qrleido.lenght);

    if (this.qrleido.lenght < 6 || this.qrleido.lenght > 6) {
      Swal.fire({
        icon: 'error',
        // showCancelButton: false,
        // showConfirmButton: false,
        // timer: 1200,
        title: 'ERROR TARIMA',
        text: 'QR incompleto.'
      })
    } else {

      this.isVisible = false;
      this.isVisibleQR = true;

      console.log(this.QRdata);

      this.tarimaService.getTarimaQR(this.QRdata.QR).subscribe(dataQR => {
        console.log(dataQR);
          let TQR = new Tarima();
          TQR = dataQR[0]

          TQR.Bodega = "Chihuahua"

          this.tarimaService.updateTarima(TQR).subscribe(res =>{
            console.log(res);
            Swal.fire({
              icon: 'success',
              // showCancelButton: false,
              // showConfirmButton: false,
              // timer: 1200,
              title: 'Tarima Escaneada Exitosamente',
              text: 'Tarima: '+ TQR.QR
              // text1: 'Bodega: '+ TQR.Bodega
              
            })
          })
      })






    }
  }

  CleanFieldQR() {
    console.log(this.qrleido.lenght);
    if (this.qrleido == null) {
      this.isVisible = false;
      this.isVisibleQR = true;
    }

  }

  ActBtn() {
    this.isVisible = true;
    this.isVisibleQR = false;
  }

}
