import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialogConfig, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { TarimaService } from '../../../../../services/almacen/tarima/tarima.service';
import { OrdenDescargaService } from 'src/app/services/almacen/orden-descarga/orden-descarga.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { DetalleTarima } from '../../../../../Models/almacen/Tarima/detalleTarima-model';
import { ScannerComponent } from 'src/app/components/scanner/scanner.component';


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
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['IdTarima', 'Sacos', 'PesoTotal', 'QR', 'Bodega', 'Options'];
  displayedColumnsVersion: string[] = ['IdDetalleTarima, IdTarima, ClaveProducto, Producto, Sacos, PesoxSaco, Lote, IdProveedor, Proveedor, PO, FechaMFG, FechaCaducidad, Shipper, USDA, Pedimento'];
  expandedElement: any;
  detalle = new Array<DetalleTarima>();

  enableScan = false;
  qrleido;


  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(public router: Router, public tarimaService: TarimaService, public ordenDescargaService: OrdenDescargaService,private dialog: MatDialog,) {
    this.tarimaService.listenDt().subscribe((m: any) => {
      console.log(m);
      this.actualizarTablaTarima();
    });
   }


  ngOnInit() {
    this.IdOrdenDescarga = +(localStorage.getItem('IdOrdenDescarga'));

    this.actualizarTablaTarima();
  }

  regresar() {
    this.router.navigate(['/ordenDescargadetalle']);
  }


  actualizarTablaTarima() {

    this.ordenDescargaService.GetODOT(1).subscribe(dataID => {
      console.log(dataID, 'loquetraeOD');
      for (let i = 0; i <= dataID.length - 1; i++) {
        this.tarimaService.GetTarimaDttqr(dataID[0].QR).subscribe(dataQR => {
          // es lo que trae detalle tarima con ese QR
          console.log(dataQR[0]); 
          for (let j = 0; j <= dataQR.length - 1; j++) {
            this.tarimaService.masterT[j] = dataID[j];
            this.tarimaService.masterT[j].detalleTarima = [];
            this.tarimaService.getDetalleTarimaID(dataQR[j].IdTarima).subscribe(res => {
              console.log(res);
              for (let l = 0; l <= res.length - 1; l++) {
                console.log(res[l]);
                this.tarimaService.masterT[j].detalleTarima.push(res[l]);
              }
            })
            console.log(this.tarimaService.masterT);
            this.listData = new MatTableDataSource(dataQR);
            this.listData.sort = this.sort;
            this.listData.paginator = this.paginator;
            this.listData.paginator._intl.itemsPerPageLabel = 'Tarimas por Pagina';
            }
            
            
            // this.listData = new MatTableDataSource(dataQR);
            // this.listData.sort = this.sort;
            // this.listData.paginator = this.paginator;
            // this.listData.paginator._intl.itemsPerPageLabel = 'Conceptos por Pagina';
          })
        }
    })
  }

  applyFilter(filtervalue: string) {
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();
  }

  CheckQR(row, posicion){
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
    console.clear();
    console.warn(qrleido);
  }

}
