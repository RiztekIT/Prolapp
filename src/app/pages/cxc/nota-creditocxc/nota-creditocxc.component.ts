import { Component, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogConfig } from '@angular/material';

import { MatDialogRef, MatSnackBar } from '@angular/material';

import { NgForm } from '@angular/forms';

import Swal from 'sweetalert2';

import { Router } from '@angular/router';

import { trigger, state, transition, animate, style } from '@angular/animations';

import { NotaCreditoService } from '../../../services/cuentasxcobrar/NotasCreditocxc/notaCredito.service';

import { NotaCredito } from '../../../Models/nota-credito/notaCredito-model';

import { DetalleNotaCredito } from '../../../Models/nota-credito/detalleNotaCredito-model';

import { NotaCreditoMaster } from 'src/app/Models/nota-credito/notaCreditoMaster-model';

import { MessageService } from '../../../services/message.service';

import { ThrowStmt } from '@angular/compiler';

import { ngxLoadingAnimationTypes } from 'ngx-loading';

import { EnviarfacturaService } from 'src/app/services/facturacioncxc/enviarfactura.service';

import { NotacreditoComponent } from 'src/app/components/notacredito/notacredito/notacredito.component';

import { FacturaService } from 'src/app/services/facturacioncxc/factura.service';

import { EmpresaService } from 'src/app/services/empresas/empresa.service';

import * as html2pdf from 'html2pdf.js';

import { EventosService } from 'src/app/services/eventos/eventos.service';


import { ConnectionHubServiceService } from './../../../services/shared/ConnectionHub/connection-hub-service.service';


let origen: { origen: string, titulo: string }[] = [
  {"origen": "Cxc", "titulo": 'Nota'}
]




@Component({
  selector: 'app-nota-creditocxc',
  templateUrl: './nota-creditocxc.component.html',
  styleUrls: ['./nota-creditocxc.component.css'],
  animations: [
    /* Trigger para tabla con detalles, cambio de estado colapsado y expandido y sus estilis */
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0px', visibility: 'hidden'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class NotaCreditocxcComponent implements OnInit {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  loadtable = true;
  listData: MatTableDataSource<any>;
  xmlparam;
  fileUrl;
  listEmpresa;

  displayedColumns : string [] = ['Folio', 'Nombre', 'FechaDeExpedicion', 'Subtotal', 'ImpuestosTrasladadosDlls', 'Total', 'Estado', 'Options'];
  displayedColumnsVersion : string [] = ['ClaveProducto'];

  expandedElement: any;
  detalle = new Array<DetalleNotaCredito>();
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  a = document.createElement('a');
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(private service: NotaCreditoService, private dialog: MatDialog, private snackbar: MatSnackBar,
     private router: Router, public _MessageService: MessageService,public enviarfact: EnviarfacturaService,
     private serviceFactura:FacturaService, public serviceEmpresa: EmpresaService,
     private eventosService:EventosService,
     private ConnectionHubService: ConnectionHubServiceService,) { 
    // this.service.listen().subscribe((m:any)=>{
    //   this.refreshNotaList();
    // });
    
  /*   this.ConnectionHubService.listenNota().subscribe((m:any)=>{
      this.refreshNotaList();
      }); */

  }


  ngOnInit() {
    
 /*    this.ConnectionHubService.ConnectionHub(origen[0]); */
    this.serviceFactura.rfcempresa = 'PLA11011243A'
    this.listaempresas()
    this.refreshNotaList();

    
    //^ **** PRIVILEGIOS POR USUARIO *****
    this.obtenerPrivilegios();
    //^ **** PRIVILEGIOS POR USUARIO *****
  }

    
    //^ **** PRIVILEGIOS POR USUARIO *****
    privilegios: any;
    privilegiosExistentes: boolean = false;
    modulo = 'Cuentas por Cobrar';
    area = 'Notas de Credito';
  
    //^ VARIABLES DE PERMISOS
    Editar: boolean = false;
    Borrar: boolean = false;
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
        case ('Editar Notas de Credito'):
          this.Editar = true;
          break;
        case ('Borrar Nota de Credito'):
          this.Borrar = true;
          break;
        default:
          break;
      }
    }
    //^ **** PRIVILEGIOS POR USUARIO *****
  

  

  refreshNotaList(){
    this.loadtable = true;

    // this.service.deleteNotaCreada().subscribe(data =>{
      // console.log(data);


      this.service.getNotasjoinDetalle().subscribe(data=>{
        console.log(data);
        this.service.master = new Array<NotaCreditoMaster>();

        for(let i = 0; i <= data.length-1; i++){
          this.service.master[i] = data[i]
          console.log(this.service.master[i]);
          this.service.master[i].DetalleNotaCredito = [];
          if (data[i].IdCliente != 1){
            console.log(data[i].IdNotaCredito);
            this.service.getNotaCreditoDetalles(data[i].IdNotaCredito).subscribe(res=>{
              console.log(res);
              this.service.master[i].DetalleNotaCredito.pop();
              for(let l = 0; l <= res.length-1; l++){
                this.service.master[i].DetalleNotaCredito.push(res[l]);
              }
              this.listData = new MatTableDataSource(this.service.master);
              this.listData.sort = this.sort;
              this.listData.paginator = this.paginator;
              this.listData.paginator._intl.itemsPerPageLabel = 'Notas de Credito Por Pagina';
              this.loadtable = false;
            })
          }}
      });

      console.log(this.service.master);
    // })
  }

  onEdit(nota: any){
    console.log(nota);
    console.log(nota.IdFactura.toString());
    // localStorage.removeItem('FacturaID');
    localStorage.setItem('FacturaID', nota.IdFactura.toString())
    
    this.eventosService.movimientos('Editar Nota de Credito')
    this.router.navigate(['/facturacionCxcAdd', nota.IdFactura]);
        
  }

  onDelete(row){

    console.log(row);

    Swal.fire({
      title: '¿Seguro de Borrar Nota?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        let id: any = row.IdNotaCredito;
        this.service.deleteNotaCredito(id).subscribe(data=>{
          console.log(data);
          
       /*    this.ConnectionHubService.on(origen[0]); */
          this.refreshNotaList();

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

  applyFilter(filtervalue: string){  
    console.log(this.listData);
    
    this.listData.filterPredicate = (data, filter: string) => {
      if (data.Nombre){
        return data.Folio.toString().toLowerCase().includes(filter) || data.Nombre.toLowerCase().includes(filter);
      } else{
        return data.Folio.toString().toLowerCase().includes(filter);
      }
    };
    this.listData.filter= filtervalue.trim().toLocaleLowerCase();
  }

  verPDF(row){
    console.log(row);
    let folio = row.Folio;
    let uuid = row.UUID

    this.xmlparam = row.Folio
    let xml = 'http://devfactura.in/api/v3/cfdi33/' + uuid + '/xml';
    this.enviarfact.xml(uuid).subscribe(data => {
      localStorage.removeItem('xml' + folio)
      localStorage.setItem('xml' + folio, data)
      const blob = new Blob([data as BlobPart], { type: 'application/xml' });
      this.fileUrl = window.URL.createObjectURL(blob);
      this.a.href = this.fileUrl;
      this.a.target = '_blank';
      this.a.download = 'F-' + folio + '.xml';
      document.body.appendChild(this.a);
      // this.resetForm();
      
      const dialogConfig = new MatDialogConfig();
      // dialogConfig.disableClose = true;
      dialogConfig.autoFocus = false;
      dialogConfig.width = "100%";
      dialogConfig.height = "80%"
      dialogConfig.data =  {
        param : folio
      }
      
     
      this.dialog.open(NotacreditoComponent, dialogConfig);
      return this.fileUrl;
    });


  }

  cambioEmpresa(event){
    

    this.enviarfact.empresa = event;
      this.serviceFactura.rfcempresa = event.RFC;
      localStorage.setItem('Empresa',JSON.stringify(this.enviarfact.empresa))

      //console.clear();
      console.log(this.enviarfact.empresa);
      console.log(this.serviceFactura.rfcempresa);

      this.refreshNotaList();
  }

  listaempresas(){
    this.serviceEmpresa.getEmpresaList().subscribe(data =>{
      console.log(data);
      this.listEmpresa = data;
      
      console.log(this.enviarfact.empresa);
      this.enviarfact.empresa = data[1];
      this.serviceFactura.rfcempresa = this.enviarfact.empresa.RFC;
      // this.enviarfact.rfc = data[0].RFC;
    })
  }

  descargarPDF(row){

    let uuid = row.UUID;
    let folio = row.Folio;

  
    console.log(uuid);
    console.log(folio);
    console.log(this.service.formData);

    /* this.loading = true; */
    // document.getElementById('enviaremail').click();
    let xml = 'http://devfactura.in/api/v3/cfdi33/' + uuid + '/xml';
    this.enviarfact.xml(uuid).subscribe(data => {
      localStorage.setItem('xml' + folio, data)
      const blob = new Blob([data as BlobPart], { type: 'application/xml' });
      this.fileUrl = window.URL.createObjectURL(blob);
      this.a.href = this.fileUrl;
      this.a.target = '_blank';
      this.a.download = 'F-' + folio + '.xml';
      document.body.appendChild(this.a);
      this.a.click();
      const dialogConfig = new MatDialogConfig();
      // dialogConfig.disableClose = true;
      dialogConfig.autoFocus = false;
      dialogConfig.width = "100%";
      dialogConfig.height = "80%";
      dialogConfig.data =  {
        param : folio
      }
      
     
      this.dialog.open(NotacreditoComponent, dialogConfig);

      setTimeout(()=>{
        this.onExportClick(folio);    
        this.dialog.closeAll();
        // this.loading = false;
        
       },1000)
    });

    
 

  
  }

  onExportClick(folio?: string) {
    // this.proceso = 'xml';
    // document.getElementById('element-to-PDFNC').style.zIndex = "1";
    const content: Element = document.getElementById('element-to-PDFNC');
    const option = {
      margin: [.5,.5,.5,0],
      filename: 'F-' + folio + '.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {scale: 2, logging: true, scrollY: -2, scrollX: -15},
      jsPDF: {unit: 'cm', format: 'letter', orientation: 'portrait'}, 
      pagebreak:{ avoid: '.pgbreak'}
      
    };

    html2pdf().from(content).set(option).save(); 
    // this.proceso = '';
  }

 
}
