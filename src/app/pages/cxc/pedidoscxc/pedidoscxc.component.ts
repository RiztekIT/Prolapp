import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatPaginator, MatTable, MatDialog, MatSnackBar, MatDialogConfig} from '@angular/material';
import {MatSort} from '@angular/material/sort';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { pedidoMaster } from 'src/app/Models/Pedidos/pedido-master';
import { DetallePedido } from '../../../Models/Pedidos/detallePedido-model';
import { VentasPedidoService } from '../../../services/ventas/ventas-pedido.service';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'src/app/services/message.service';
import { EnviarfacturaService } from 'src/app/services/facturacioncxc/enviarfactura.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { Pedido } from '../../../Models/Pedidos/pedido-model';
import Swal from 'sweetalert2';
import * as html2pdf from 'html2pdf.js';
import { ReportesModalComponent } from 'src/app/components/reportes-modal/reportes-modal.component';
import { ReporteEmisionComponent } from 'src/app/components/reporte-emision/reporte-emision.component';
import { Factura } from 'src/app/Models/facturacioncxc/factura-model';
import { FacturaService } from 'src/app/services/facturacioncxc/factura.service';
import { DetalleFactura } from '../../../Models/facturacioncxc/detalleFactura-model';


@Component({
  selector: 'app-pedidoscxc',
  templateUrl: './pedidoscxc.component.html',
  styleUrls: ['./pedidoscxc.component.css'],
  animations: [
    trigger('detailExpand', [
      // state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PedidoscxcComponent implements OnInit {

  constructor(public router: Router, private dialog: MatDialog, private currencyPipe: CurrencyPipe, public service: VentasPedidoService, 
    private _formBuilder: FormBuilder,  public _MessageService: MessageService,  public enviarfact: EnviarfacturaService, private facturaSVC:FacturaService) {

      this.service.listen().subscribe((m: any) => {
        console.log(m);
        this.refreshPedidoList();
      });
  

   }

  ngOnInit() {
    this.refreshPedidoList();

        //^ **** PRIVILEGIOS POR USUARIO *****
        this.obtenerPrivilegios();
        //^ **** PRIVILEGIOS POR USUARIO *****
  }


    
    //^ **** PRIVILEGIOS POR USUARIO *****
    privilegios: any;
    privilegiosExistentes: boolean = false;
    modulo = 'Cuentas por Cobrar';
    area = 'Orden de Compra';
  
    //^ VARIABLES DE PERMISOS
    Editar: boolean = false;
    Agregar: boolean = false;
    Enviar: boolean = false;
    Borrar: boolean = false;
    //^ VARIABLES DE PERMISOS

    
    //VARIABLE DE CONVERSION A FACTURACION
    IdFactura: any;
  
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
        case ('Crear Orden de Compra'):
          this.Agregar = true;
          break;
        case ('Editar Orden de compra'):
          this.Editar = true;
          break;
        case ('Borrar Orden de compra'):
          this.Borrar = true;
          break;
        case ('Enviar Orden de compra'):
          this.Enviar = true;
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

  public listEstatus: Array<Object> = [
    { Estatus: 'Todos' },
    { Estatus: 'Guardada' },
    { Estatus: 'Cerrada' },
    
  ];
  
  estatusSelect;
  IdPedido: any;
  MasterDetalle = new Array<pedidoMaster>();

  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Folio', 'Nombre', 'Subtotal', 'Total', 'FechaDeExpedicion', 'Estatus',  'Options'];
  
  displayedColumnsVersion: string[] = ['ClaveProducto', 'Producto', 'Cantidad'];

  expandedElement: any;

  // INICIO MODAL EMAIL
  public loading2 = false;
  xmlparam;
  fileUrl;
  folioparam;
  idparam;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
// FIN MODAL EMAIL
  detalle = new Array<DetallePedido>();
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');

  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  refreshPedidoList() {
    // this.service.getPedidoList().subscribe(data => {
    this.service.getPedidoCliente().subscribe(data => {
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

  public PedidoBlanco: Pedido =
    {
      IdPedido: 0,
      IdCliente: 0,
      Folio: "",
      Subtotal: "",
      Descuento: "",
      Total: "",
      Observaciones: "",
      FechaVencimiento: new Date(),
      OrdenDeCompra: "",
      FechaDeEntrega: new Date(),
      CondicionesDePago: "",
      Vendedor: "",
      Estatus: "Creada",
      Usuario: "",
      Factura: 0,
      LugarDeEntrega: "",
      Moneda: "MXN",
      Prioridad: "Normal",
      SubtotalDlls: "",
      DescuentoDlls:"",
      TotalDlls:"",
      Flete: "Sucursal",
      IdDireccion: 0,
      FechaDeExpedicion: new Date()
    }

  //Get the Folio and verify if it comes empty( in this case it will be set to 1) otherwise, it will be added 1 to not repeat the same Folio among the Pedidos
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
      this.PedidoBlanco.Folio = folio.toString();
      console.log(this.PedidoBlanco);
      //Agregar el nuevo pedido. NECESITA ESTAR DENTRO DEL SUBSCRIBEEEEEEEE :(
      this.service.addPedido(this.PedidoBlanco).subscribe(res => {
        console.log(res);
        //Obtener el pedido que se acaba de generar
        this.ObtenerUltimoPedido();
      });
    });
  }

  //agregar nuevo pedido
  onAdd() {
    //Obtener el folio y agregarselo al pedido que se generara
    this.ObtenerFolio();
    // console.log(this.PedidoBlanco.Folio);
  }
  
  //Obtener ultimo pedido y agregarlo al local Storage
  ObtenerUltimoPedido() {
    this.service.getUltimoPedido().subscribe(res => {
      console.log('NUEVO IDPEDIDO------');
      console.log(res[0]);
      console.log('NUEVO IDPEDIDO------');
      this.IdPedido = res[0].IdPedido;
      console.log(this.IdPedido);
      localStorage.setItem('IdPedido', this.IdPedido.toString());
      this.router.navigate(['/pedidoventasAdd']);
    })
  }

  //editar pedido, llenar los formdata de donde se obtendra la informacion en el otro componente.
  //Abrir la sig pagina donde se editara el pedido
  onEdit(pedido: Pedido) {
    // this.service.formt = pedido;
    this.service.formDataPedido = pedido;
    this.service.IdCliente = pedido.IdCliente;
    let Id = pedido.IdPedido;
    localStorage.setItem('pedidopdf',JSON.stringify(pedido))
    localStorage.setItem('IdPedido', Id.toString());
    this.router.navigate(['/pedidoventasAdd']);
  }


  //Eliminar pedido
  //A su vez verificar si existen detalles pedidos relacionados a ese pedido.
  //En caso que si existan, se regresara el stock original a esos productos y se eliminaran los Detalles pedidos y el pedido.
  //en caso que no existan detalles pedido, solamente se eliminara el pedido.
  onDelete(pedido: Pedido) {

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
        
          this.service.GetDetallePedidoId(pedido.IdPedido).subscribe(data => {
            console.log(data);
            if (data.length > 0) {
              console.log('Si hay valores');
              for (let i = 0; i <= data.length - 1; i++) {
                this.SumarStock(data[i].Cantidad, data[i].ClaveProducto, data[i].IdDetallePedido);
                this.DeletePedidoDetallePedido(pedido);
              }
            } else {
              console.log('No hay valores');
              this.DeletePedidoDetallePedido(pedido);
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

  //ELiminar Pedidos y DetallePedido
  DeletePedidoDetallePedido(pedido: Pedido) {

    this.service.onDeleteAllDetallePedido(pedido.IdPedido).subscribe(res => {
      this.service.onDelete(pedido.IdPedido).subscribe(res => {
        this.refreshPedidoList();
      });
    });

  }


  //Metodo para sumar Stock Producto
  SumarStock(Cantidad: string, ClaveProducto: string, Id: number) {
    console.log(ClaveProducto + 'claveproducto');
    console.log(Id + 'IDDDDD');
    this.service.GetProductoDetalleProducto(ClaveProducto, Id).subscribe(data => {
      console.log(data[0]);
      let stock = data[0].Stock;
      console.log(stock);
      stock = (+stock) + (+Cantidad);
      console.log(stock);
      this.service.updateStockProduto(ClaveProducto, stock.toString()).subscribe(res => {
        console.log(res);
      });
    })


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

/* Metodo para enviar por correo, abre el modal con los datos */
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
  applyFilter2(filtervalue: string) {
    this.listData.filterPredicate = (data, filter: string) => {
      return data.Estatus.toString().toLowerCase().includes(filter);
    };
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();

  }


  //CONVERTIR EN FACTURA
  onfact(row){


    
      this.facturaSVC.getFolio().subscribe(data => {
        
         
      
    




    console.log(row);

    let factura: Factura  = 
    {
      Id:0,
      IdCliente:row.IdCliente,
      Serie: "",
      Folio: data,
      Tipo: "",
      FechaDeExpedicion: new Date(),
      LugarDeExpedicion: "",
      Certificado: "",
      NumeroDeCertificado: "",
      UUID: "",
      UsoDelCFDI: "",
      Subtotal: parseFloat(row.Subtotal).toFixed(4),
      SubtotalDlls: parseFloat(row.SubtotalDlls).toFixed(4),
      Descuento: "0",
      ImpuestosRetenidos: "0",
      ImpuestosTrasladados: "0",
      ImpuestosTrasladadosDlls: "0",
      Total: parseFloat(row.Total).toFixed(4),
      TotalDlls: parseFloat(row.TotalDlls).toFixed(4),
      FormaDePago: "",
      MetodoDePago: "",
      Cuenta: "",
      Moneda: row.Moneda,
      CadenaOriginal: "",
      SelloDigitalSAT: "",
      SelloDigitalCFDI: "",
      NumeroDeSelloSAT: "",
      RFCdelPAC: "",
      Observaciones: "",
      FechaVencimiento:  new Date(),
      OrdenDeCompra: row.Folio,
      TipoDeCambio: "0",
      FechaDeEntrega:  new Date(),
      CondicionesDePago: "",
      Vendedor: row.Vendedor,
      Estatus: "Creada",
      Version: "",
      Usuario: row.Usuario
  }

  console.log(factura);

  console.log(this.facturaSVC.rfcempresa);
  this.facturaSVC.Pedido = "1";

  this.facturaSVC.addFactura(factura).subscribe(res => {
    console.log(res);
    this.facturaSVC.getUltimaFactura().subscribe(data => {
      this.facturaSVC.formData = new Factura();
      this.facturaSVC.formData = factura;
      this.IdFactura = data[0].Id; 
      console.log(this.IdFactura);          
      let Id = this.IdFactura;
      this.facturaSVC.formData.Id=Id;

      let count = 0;
      


      for (let i=0; i<row.DetallePedido.length; i++){

        let query
        let clave = row.DetallePedido[i].ClaveProducto;
        let saldo;
        let saldoanterior

        if (this.facturaSVC.rfcempresa==='PLA11011243A'){

          query = "select top 1 factura.*, DetalleFactura.* from factura left join ovfactura on factura.Id=ovfactura.idFactura left join DetalleFactura on Factura.Id=DetalleFactura.IdFactura where ovfactura.FolioPedido='"+row.Folio+"' and DetalleFactura.ClaveProducto='"+clave+"' order by Factura.Id desc"
        }
        else if (this.facturaSVC.rfcempresa=='AIN140101ME3'){
          query = "select top 1 factura2.*, DetalleFactura2.* from factura2 left join ovfactura on factura2.Id=ovfactura.idFactura left join DetalleFactura2 on Factura2.Id=DetalleFactura2.IdFactura where ovfactura.FolioPedido='"+row.Folio+"' and DetalleFactura2.ClaveProducto='"+clave+"' order by Factura2.Id desc"
        }
  
        let consulta = {
          'consulta':query
        };


        console.log(consulta);

        this.facturaSVC.getQuery(consulta).subscribe((res:any)=>{
          console.log(res,'SALDO');
          if (res.length>0){

            saldo = res[0].TextoExtra
            saldoanterior = res[0].TextoExtra
          }else{
            saldo = row.DetallePedido[i].Cantidad
            saldoanterior = 0;
          }

          if (+saldo>0){

            count = count + 1;

        consulta = {
          'consulta':"select ClaveSAT from Producto where ClaveProducto='"+clave.slice(0,2)+"'"
        };
    
        console.log(consulta);
    
        this.facturaSVC.getQuery(consulta).subscribe((res1:any)=>{
          console.log(res1,'CLAVESAT');
          if(res1.length>0){
            
            let temp = Object.assign({}, res1[0]); 
            console.log(temp);
            this.facturaSVC.ClaveSAT =  temp.ClaveSAT
          }else{
            this.facturaSVC.ClaveSAT = '01010101'
          }

          //this.obtenerClaveSAT(row.DetallePedido[i].ClaveProducto)

          let detalleFactura : DetalleFactura = {
            IdDetalle: 0,
            IdFactura: this.IdFactura,
            ClaveProducto: row.DetallePedido[i].ClaveProducto,
            Producto: row.DetallePedido[i].Producto,
            Unidad: row.DetallePedido[i].Unidad,
            ClaveSAT: this.facturaSVC.ClaveSAT,
            PrecioUnitario: row.DetallePedido[i].PrecioUnitario,
            PrecioUnitarioDlls: row.DetallePedido[i].PrecioUnitarioDlls,
            Cantidad: saldo,
            Importe: row.DetallePedido[i].Importe,
            ImporteDlls: row.DetallePedido[i].ImporteDlls,
            Observaciones: '',
            TextoExtra: (+saldo - +saldoanterior).toString(),
            ImporteIVA: '0.00',
            ImporteIVADlls: '0.00'
          }

          console.log(detalleFactura);
  
          this.facturaSVC.addDetalleFactura(detalleFactura).subscribe(res => {                    
           console.log(res);

           if ((i+1)==row.DetallePedido.length){

            if (count>0){

              localStorage.setItem('FacturaID',this.facturaSVC.formData.Id.toString())
            this.router.navigate(['/facturacionCxcAdd', Id]);
            }else{
              Swal.fire({
                title: 'No hay productos para agregar',
                icon: 'error',
              });
            }


  
          }
          });
    
    
        })


          }else{

            if ((i+1)==row.DetallePedido.length){
    
              if (count==0){
                Swal.fire({
                  title: 'No hay productos para agregar',
                  icon: 'error',
                });
              }
            }
          }//fin del si del saldo
          


        })





        
        
       
      }



      /* localStorage.setItem('FacturaID',this.facturaSVC.formData.Id.toString())
    this.router.navigate(['/facturacionCxcAdd', Id]); */
      
      });
    
  });
});

  }

  obtenerClaveSAT(clave){
    let consulta = {
      'consulta':"select ClaveSAT from Producto where ClaveProducto='"+clave.slice(0,2)+"'"
    };

    console.log(consulta);

    this.facturaSVC.getQuery(consulta).subscribe((res:any)=>{
      if(res.length>0){
        let temp = Object.assign({}, res[0]); 
        console.log(temp);
        this.facturaSVC.ClaveSAT =  temp.ClaveSAT
      }else{
        this.facturaSVC.ClaveSAT = '01010101'
      }


    })

  }
}
