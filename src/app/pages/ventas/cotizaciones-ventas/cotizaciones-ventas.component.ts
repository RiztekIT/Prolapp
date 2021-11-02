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

import { VentasPedidoService } from 'src/app/services/ventas/ventas-pedido.service';

import { DetalleCotizacion } from '../../../Models/ventas/detalleCotizacion-model';

import { Cotizacion } from '../../../Models/ventas/cotizacion-model';

import { cotizacionMaster } from '../../../Models/ventas/cotizacion-master';

import Swal from 'sweetalert2';

import { CotizacionpedidoComponent } from 'src/app/components/cotizacionpedido/cotizacionpedido.component';

import { CotizacionEmailComponent } from 'src/app/components/cotizacion/cotizacion-email/cotizacion-email.component';

import { ngxLoadingAnimationTypes } from 'ngx-loading';

import * as signalr from 'signalr'

import { StorageServiceService } from '../../../services/shared/storage-service.service';

import { Subscription } from 'rxjs';

import { EventosService } from 'src/app/services/eventos/eventos.service';
import { environment } from 'src/environments/environment';


declare var $: any;

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
  private connection: any;
  private proxy: any;  
  private proxyName: string = 'AlertasHub'; 
 
   private hubconnection: signalr;  
   notihub = 'https://riztekserver.ddns.net:44361/signalr'
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  loadtable = true;
  folioparam;
  idparam;
  statusparam;
  emailmodalstatus = false;
  folio: number;
  fileUrl;
  estatusSelect;
  public loading2 = false;
  trueimg:Boolean = false;
loader:Boolean = false;
myimg:string;
final:Boolean = true;
msn:string;

  constructor( public router: Router, 
    private dialog: MatDialog, public _MessageService: MessageService, 
    private service: VentasCotizacionService, private service2: VentasPedidoService, 
    public storageSVC: StorageServiceService,
    private eventosService:EventosService,) {

    this.service.listen().subscribe((m: any) => {
      console.log(m);
      this.refreshCotizacionesList();
    });

   }

  ngOnInit() {
    console.log(environment.APIUrl);
    this.ConnectionHub();
    this.refreshCotizacionesList();
    //^ **** PRIVILEGIOS POR USUARIO *****
    this.obtenerPrivilegios();
    //^ **** PRIVILEGIOS POR USUARIO *****
  }
  ngOnDestroy(): void {
    if(this.subs1){
      this.subs1.unsubscribe();
    }
    if(this.subs2){
      this.subs2.unsubscribe();
    }
  }

    
    //^ **** PRIVILEGIOS POR USUARIO *****
    privilegios: any;
    privilegiosExistentes: boolean = false;
    modulo = 'Ventas';
    area = 'Cotizaciones';
  
    //^ VARIABLES DE PERMISOS
    Agregar: boolean = false;
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
        case ('Agregar Nueva Cotizacion'):
          this.Agregar = true;
          break;
        case ('Editar Cotizacion'):
          this.Editar = true;
          break;
        case ('Borrar Cotizacion'):
          this.Borrar = true;
          break;
        default:
          break;
      }
    }
    //^ **** PRIVILEGIOS POR USUARIO *****

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

  public listEstatus: Array<any> = [
    { Estatus: 'Todos' },
    { Estatus: 'Guardada' },
    { Estatus: 'Cerrada' },
    { Estatus: 'Duplicada' }
  ];

  IdCotizacion: any;
  
  MasterDetalle = new Array<cotizacionMaster>();

  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Folio', 'Nombre', 'Subtotal', 'Total', 'Moneda', 'FechaDeExpedicion', 'Estatus','Options'];
  
  displayedColumnsVersion: string[] = ['ClaveProducto', 'Producto', 'Cantidad'];

  expandedElement: any;

  detalle = new Array<DetalleCotizacion>();
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
subs1: Subscription
subs2: Subscription
  refreshCotizacionesList() {
    // this.service.getPedidoList().subscribe(data => {
    this.subs1 = this.service.getCotizaciones().subscribe(data => {
      console.log(data);
      for (let i = 0; i <= data.length - 1; i++) {
       /*  if (data[i].Estatus == 'Creada') {
          // console.log(data[i]);
          // console.log('ELIMINAR ESTE PEDIDO');
          // console.log(i + 1);
          this.service.onDeleteCotizacion(data[i].IdCotizacion).subscribe(res => {
            console.log(data[i].IdCotizacion);
            this.refreshCotizacionesList();
          });
        } */
        this.service.master[i] = data[i]
        this.service.master[i].DetalleCotizacion = [];
        this.subs2 = this.service.GetDetalleCotizacionId(data[i].IdCotizacion).subscribe(res => {
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

  applyFilter2(filtervalue: string) {
    this.listData.filterPredicate = (data, filter: string) => {
      return data.Estatus.toString().toLowerCase().includes(filter);
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
    dialogConfig.width="0%";
    dialogConfig.height="0%";
    dialogConfig.data = {
      origen: 'normal'
     
    }
    this.dialog.open(CotizacionComponent, dialogConfig);
  }

  
email(id: string, folio:string,row){
console.log(row);
localStorage.setItem('rowcot',JSON.stringify(row));

console.log('asdasd');

this.folioparam = folio;
this.idparam = id;
this._MessageService.correo='';
this._MessageService.cco='';
this._MessageService.asunto='Envio Factura ';
this._MessageService.cuerpo='Se ha enviado un comprobante fiscal digital con folio ';
this._MessageService.nombre='Abarrotodo';



  const dialogConfig2 = new MatDialogConfig();
  dialogConfig2.disableClose = false;
  dialogConfig2.autoFocus = true;
  dialogConfig2.width="70%"; 
  this.dialog.open(CotizacionComponent, dialogConfig2);

        setTimeout(()=>{
          const content: Element = document.getElementById('Cotizacion-PDF');
          const option = {
            margin: [0, 0, 0, 0],
            filename: 'C-'  + '.pdf',
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

      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      // dialogConfig.width = "90%";
      dialogConfig.height = "90%";
      dialogConfig.data = {
        foliop: folio,
        idp: id,
        status: true
      }
      this.dialog.open(CotizacionEmailComponent, dialogConfig);
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
TipoDeCambio: 0,
Vigencia: new Date()
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
        
        this.eventosService.movimientos('Nueva Cotizacion')
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
      this.on();
      this.router.navigate(['/cotizacionesVentasAdd']);
    })
  }

  onEdit(cotizacion: Cotizacion) {

    this.service.formDataCotizacion = cotizacion;
    this.service.IdCliente = cotizacion.IdCliente;
    let Id = cotizacion.IdCotizacion;
    
    this.eventosService.movimientos('Editar Cotizacion')
    localStorage.setItem('IdCotizacion', Id.toString());
    this.router.navigate(['/cotizacionesVentasAdd']);
  }

  onDelete(cotizacion: Cotizacion) {

    console.log(cotizacion);
    Swal.fire({
      title: '¿Segur@ de Borrar Cotizacion  ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
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

          this.eventosService.movimientos('Cotizacion Borrada')
          Swal.fire({
            title: 'Borrado',
            icon: 'success',
            timer: 1000,
            showCancelButton: false,
            showConfirmButton: false,
            
          });
      }
    })

  }

  DeleteCotizacionDetalleCotizacion(cotizacion: Cotizacion) {
    console.log(cotizacion);
    this.service.onDeleteAllDetalleCotizacion(cotizacion.IdCotizacion).subscribe(res => {
      this.service.onDeleteCotizacion(cotizacion.IdCotizacion).subscribe(res => {
        this.on();
        //this.refreshCotizacionesList();
      });
    });

  }

  hacerPedido(row){

    // console.log(row.Estatus);


    if (row.Estatus === 'Guardada'){

      this.service.formcotped = row;
  
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.width="70%";
      this.dialog.open(CotizacionpedidoComponent, dialogConfig);
    }else {
      Swal.fire({
        title: 'No es posible hacer pedido',
        icon: 'warning',
        text: 'Faltan datos de prospecto',
        showCancelButton: false,
        showConfirmButton: true
      });
    }


    // let cotizacion2pedido: any = {
    //   IdCliente: cotizacion.IdCliente,
    //   RFC:cotizacion.RFC,
    //   Subtotal: cotizacion.Subtotal,
    //   Descuento: cotizacion.Descuento,
    //   Total: cotizacion.Total,
    //   Observaciones: cotizacion.Observaciones,
    //   // FechaVencimiento: cotizacion
    //   FechaDeEntrega: cotizacion.FechaDeExpedicion,
    //   // LugarDeEntrega: 
    //   IdDireccion: cotizacion.IdDireccion,
    //   Nombre: cotizacion.Nombre,
    //   Subtotaldlls: cotizacion.SubtotalDlls,
    //   Descuentoddls: cotizacion.DescuentoDlls,
    //   Totaldlls: cotizacion.TotalDlls,
    //   Moneda: cotizacion.Moneda,
    //   Flete: cotizacion.Flete,
      
    // }




    // localStorage.setItem('cotizacionapedido', cotizacion2pedido);
    // this.router.navigate(['/PedidosVentasAdd'])

  }

  ConnectionHub(){
  


    this.connection = $.hubConnection(this.notihub);
  
    this.proxy = this.connection.createHubProxy(this.proxyName); 
  
    this.proxy.on('AlertasHub', (data) => {  
      console.log('received in SignalRService: ', data);  
      this.refreshCotizacionesList();
      
  }); 
  
  
  
    this.connection.start().done((data: any) => {  
      console.log('Now connected ' + data.transport.name + ', connection ID= ' + data.id);  
      /* this.connectionEstablished.emit(true);  */ 
      /* this.connectionExists = true;   */
  })
  }

  public on() {  
  let mensaje = {
      titulo: 'Venta',
      descripcion: 'Mensaje desde Ventas',
      fecha: new Date()
    }
     /*  
    // server side hub method using proxy.invoke with method name pass as param  
       */
    /* this.proxy.invoke('NuevaNotificacion');   */
    this.proxy.invoke('NuevaNotificacion',mensaje);
} 


ver(){
  console.log(this.CotizacionBlanco);
}


whatsapp(form: any){


  Swal.fire({
    title: 'Telefono Receptor',
    input: 'text',       
    inputPlaceholder: '',
    showCancelButton: true,  
  }).then(result => {
    console.log(result);

    console.log(form);

    this.service.formrow = form;
  
  const dialogConfig = new MatDialogConfig();
      // dialogConfig.disableClose = true; 
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.width="0%";
      dialogConfig.height="0%";
      dialogConfig.data = {
        origen: 'whatsapp'
       
      }
      
    
      let dialog = this.dialog.open(CotizacionComponent, dialogConfig);
  
  
  
          dialog.afterClosed().subscribe(res=>{
            let form = new FormData();
            let blob = this.b64toBlob(localStorage.getItem('pdfOC'),'application/pdf',1024)          
            let Archivo: File = new File([blob], 'Archivo.pdf', {
              type: "application/pdf"
            })
       
  
            form.append('file', Archivo);
            this.service.subirImagen(form).subscribe(
              resp => {
                console.log(resp);
                this.loader = false;
                if(resp.status){
                  this.trueimg = true;
                  this.myimg = resp.generatedName;
                  this.msn = "Gracias por visitar riztek.com.mx"
                  console.log(this.myimg);
                  
                  let url = 'https://api.whatsapp.com/send?phone=+52'+result.value+'&text=Envio%20la%20siguiente%20cotizacion,%20https://riztek.com.mx/php/Prolacto/Docs/'+this.myimg
            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank'    
            link.click();
                }
              },
              error => {
                this.loader = false;
                alert('Imagen supera el tamaño permitido');
                
              }
            );
          })
   
    

  })





 
       

      
    

}

b64toBlob(b64Data, contentType, sliceSize) {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

  
  

}
