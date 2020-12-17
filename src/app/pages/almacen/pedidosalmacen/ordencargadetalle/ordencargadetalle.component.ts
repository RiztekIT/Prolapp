import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatTable, MatDialog, MatSnackBar, MatDialogConfig } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { CurrencyPipe } from '@angular/common';
import { OrdenCargaService } from 'src/app/services/almacen/orden-carga/orden-carga.service';
import Swal from 'sweetalert2';
import { EmailComponent } from 'src/app/components/email/email/email.component';
import { MessageService } from 'src/app/services/message.service';
import { EnviarOrdenCargaComponent } from './enviar-orden-carga/enviar-orden-carga.component';
import { AlmacenEmailService } from 'src/app/services/almacen/almacen-email.service';
import { TarimaService } from '../../../../services/almacen/tarima/tarima.service';
import { OrdenDescarga } from 'src/app/Models/almacen/OrdenDescarga/ordenDescarga-model';
import { DetalleOrdenDescarga } from 'src/app/Models/almacen/OrdenDescarga/detalleOrdenDescarga-model';
import { OrdenDescargaService } from 'src/app/services/almacen/orden-descarga/orden-descarga.service';
import { EntradaProductoComponent } from 'src/app/components/almacen/entrada-producto/entrada-producto.component';
import { SalidaProductoComponent } from '../../../../components/almacen/salida-producto/salida-producto.component';
import { CalendarioService } from '../../../../services/calendario/calendario.service';
import { VentasPedidoService } from 'src/app/services/ventas/ventas-pedido.service';

@Component({
  selector: 'app-ordencargadetalle',
  templateUrl: './ordencargadetalle.component.html',
  styleUrls: ['./ordencargadetalle.component.css'],
})
export class OrdencargadetalleComponent implements OnInit {

IdOrdenCarga: number;
  listData: MatTableDataSource<any>;
  displayedColumns: string [] = ['ClaveProducto', 'Producto', 'Kilogramos', 'Lote', 'Proveedor', 'PO', 'FechaMFG', 'FechaCaducidad', 'Shipper', 'USDA', 'Pedimento'];
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  
  DataOrdenCarga: any;
  Folio: number;
  
  constructor(public router: Router, private dialog: MatDialog, public service: OrdenCargaService,  public _MessageService: MessageService, 
    public AlmacenEmailService: AlmacenEmailService, public tarimaService: TarimaService, public ordenDescargaService: OrdenDescargaService, public CalendarioService: CalendarioService, public pedidoSVC: VentasPedidoService) { 

    this.service.listen().subscribe((m:any)=>{
      console.log(m);
      this.getOrdenCarga();
      this.refreshDetalleOrdenCargaList();
      });
  }

  
  
  ngOnInit() {
    this.IdOrdenCarga = +(localStorage.getItem('IdOrdenCarga'));
    console.log(this.IdOrdenCarga)
    this.getOrdenCarga();
    this.refreshDetalleOrdenCargaList();
    //this.ObtenerFolio(this.IdOrdenCarga);
        //^ **** PRIVILEGIOS POR USUARIO *****
        this.obtenerPrivilegios();
        //^ **** PRIVILEGIOS POR USUARIO *****
  }

    //^ **** PRIVILEGIOS POR USUARIO *****
    privilegios: any;
    privilegiosExistentes: boolean = false;
    modulo = 'Almacen';
    area = 'Orden de Carga';
  
    //^ VARIABLES DE PERMISOS
  
    Preparar: boolean = false;
    Cargar: boolean = false;
    Salida: boolean = false;
    Enviar: boolean = false;
    Terminar: boolean = false;
  
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
        case ('Preparar'):
          this.Preparar = true;
          break;
        case ('Cargar'):
          this.Cargar = true;
          break;
        case ('Salida'):
          this.Salida = true;
          break;
        case ('Enviar Orden de Carga'):
          this.Enviar = true;
          break;
        case ('Terminar'):
          this.Terminar = true;
          break;
        default:
          break;
      }
    }
    //^ **** PRIVILEGIOS POR USUARIO *****

  //variable para guardar el estatus de la Orden Carga
  estatusOC: string;

  //Obtener informacion Orden Carga
          getOrdenCarga(){
            this.service.getOCID(this.IdOrdenCarga).subscribe( data=> {
              console.log(data)
                  this.service.formData = data[0];
                  this.estatusOC = this.service.formData.Estatus
                  this.Folio = this.service.formData.Folio;
                  console.log(this.estatusOC);
            });
          }

  refreshDetalleOrdenCargaList(){
 /*    this.service.getOrdenCargaIDList(this.IdOrdenCarga).subscribe(data => {
      console.log(data);
      this.service.formDataDOC = data[0];
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    }); */
    this.service.getOrdenCargaIDList2(this.IdOrdenCarga).subscribe(data => {
      console.log(data);
      if (this.estatusOC=='Cargada'){
        for (let i=0; i<data.length; i++){
          console.log('Transito');
          this.tarimaService.updateBodegaTarima('Transito',data[i].QR).subscribe();
        }

      }
      this.service.formDataDOC = data[0];
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    });
  }

   //Obtener Folio de Orden Carga
 /*   ObtenerFolio(id: number) {
    this.service.getOrdenCargaID(id).subscribe(dataOC => {
      console.log(dataOC);
      this.Folio = dataOC[0].Folio;
      console.log(this.Folio);
    })
  } */

  preparar(){
    this.router.navigate(['/ordenCargaPreparar']);
  }
  cargar(){
    let Oc;

    this.service.getOCID(this.IdOrdenCarga).subscribe(data=>{
console.log(data)
Oc= data[0];
if(data[0].Fletera == '0' || data[0].Caja == '0'){
  Swal.fire({
    title: 'Error',
    text:'Favor de asignar Fletera y/o Caja',
    icon: 'error',
    // showCancelButton: false,
    // showConfirmButton: false
  });
}
else{
  Oc.FechaInicioCarga = new Date();

  this.service.updateOrdenCarga(Oc).subscribe(res=>{
console.log(res);
    this.router.navigate(['/ordenCargaCargar']);
  })


    }
    });
  }

  salida(){
    let Oc;
    this.service.getOCID(this.IdOrdenCarga).subscribe(data=>{
      console.log(data)
Oc= data[0];

Oc.Estatus = 'Cargada'
    
    this.service.updateOrdenCarga(Oc).subscribe(res=>{
      console.log(res);
      this.getOrdenCarga();
        })
      })
  }




  enviar(){
   
    this.AlmacenEmailService.correo='ivan.talamantes@live.com';
    this.AlmacenEmailService.cco='javier.sierra@riztek.com.mx';
    this.AlmacenEmailService.asunto='Envio Orden Carga con Folio '+this.Folio.toString();
    this.AlmacenEmailService.cuerpo='Se han enviado Documentos de Orden Carga con el Folio '+this.Folio.toString();
    this.AlmacenEmailService.nombre='ProlactoIngredientes';
    this.AlmacenEmailService.folio = this.Folio;

    const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.height = "90%";
      
        this.dialog.open(EnviarOrdenCargaComponent, dialogConfig);

  }
   terminar(){
     console.log(this.service.formData,'1');
     console.log(this.listData,'2');

     if (this.service.formData.Destino=='Chihuahua'){

       this.generarOrdenDescarga();
       this.generarEventoCalendario(this.Folio);
     }else {
      this.service.updatedetalleOrdenCargaEstatus(this.IdOrdenCarga, 'Terminada').subscribe(rese => {

        Swal.fire({
          title: 'Terminada',
          icon: 'success',
          timer: 1000,
          showCancelButton: false,
          showConfirmButton: false
        });
        
        this.getOrdenCarga();
        this.generarEventoCalendario(this.Folio);
        
      })
     }



     
  }

  generarEventoCalendario(folio){
    // console.log(this.compra);
    //idcalendario, folio, documento, descripcion, inicio, fin, titulo, color, allday, rezi ,rezi, dragga
    // console.log(this.CalendarioService.DetalleCalendarioData);
    //Obtener el id del calendario que le corresponde al usuario y al modulo
    let usuario: any
    usuario = localStorage.getItem('ProlappSession');
    usuario = JSON.parse(usuario);
    console.log(usuario.user);
    this.CalendarioService.getCalendarioComprasUsuarioModulo(usuario.user, 'Almacen').subscribe(res=>{
      console.log(res);
      this.CalendarioService.DetalleCalendarioData.IdCalendario = res[0].IdCalendario;
      //el folio corresponde con la Orden/Documento que se genera junto con el evento.
      this.CalendarioService.DetalleCalendarioData.Folio = folio;
      this.CalendarioService.DetalleCalendarioData.Documento = 'OrdenCarga';
      this.CalendarioService.DetalleCalendarioData.Descripcion = 'Evento Orden de Carga con Folio: '+folio;
      //Las fechas van a variar dependiendo en el modulo en el que se encuentre
      this.CalendarioService.DetalleCalendarioData.Start = this.service.formData.FechaInicioCarga;
      this.CalendarioService.DetalleCalendarioData.Endd = this.service.formData.FechaFinalCarga;
      this.CalendarioService.DetalleCalendarioData.Title = 'Orden de Carga Finalizada ' + folio;
      this.CalendarioService.DetalleCalendarioData.Color = '#0fd8e6';
      console.log(this.CalendarioService.DetalleCalendarioData);
      this.CalendarioService.addDetalleCalendario(this.CalendarioService.DetalleCalendarioData).subscribe(resAdd=>{
        console.log(resAdd);
      })
    })
  }

  regresar(){
    localStorage.removeItem('FormDataOrdenCarga');
    this.router.navigate(['/pedidosalmacen']);
  }

  od: OrdenDescarga;
dod: DetalleOrdenDescarga;

  generarOrdenDescarga(){

    let sacos;
    let kg;
    sacos = 0;
    kg = 0;
    for (let i=0; i< this.listData.data.length;i++){
      sacos = sacos + +this.listData.data[i].Sacos;
      kg = kg + +this.listData.data[i].PesoTotal;
    }


     this.od = new OrdenDescarga();
     this.dod = new DetalleOrdenDescarga();
    
    
     this.od.FechaLlegada = new Date(this.service.formData.FechaInicioCarga)
     //buscar la manera de ingresar las fechas en blanco
     this.od.IdProveedor = 0;
     this.od.Proveedor = this.service.formData.Origen;
     /* this.od.PO = this.compra.PO.toString(); */
     this.od.PO = '0';
     this.od.Fletera = '';
     this.od.Caja = '';
     // this.od.Sacos = this.totalSacos.toString();
     this.od.Sacos = sacos.toString();
     this.od.Kg = kg.toString();
     this.od.Chofer = '';
     this.od.Origen = this.service.formData.Origen;
     this.od.Destino = 'Chihuahua';
     this.od.Observaciones = '';
     //Con que estatus se generara?
     this.od.Estatus = 'Transito';
     //Fechas y usuario
     this.od.FechaInicioDescarga = new Date('10/10/10');
     this.od.FechaFinalDescarga = new Date('10/10/10');
     this.od.FechaExpedicion = new Date();
     this.od.IdUsuario = 1;
     let usuario: any
     usuario = localStorage.getItem('ProlappSession');
     usuario = JSON.parse(usuario);
     this.od.Usuario = usuario.user;
    this.ordenDescargaService.getFolioOrdenDescarga().subscribe(resFolio=>{
    console.log(resFolio);
      //Generar automaticamente el Folio de Orden Descarga
      this.od.Folio = +resFolio;
      // console.log(this.od.Folio);
      
      console.log(this.od);
      this.ordenDescargaService.addOrdenDescarga(this.od).subscribe(res=>{
        //  console.log(res);
        //traer el id generado
        this.ordenDescargaService.getUltimoIdOrdenDescarga().subscribe(ultimoId=>{
          console.log(ultimoId);
          
          //Agregar detalle orden Descarga
          for (let i = 0; i < this.listData.data.length; i++) {
            // console.log(this.detalleCompras[i]);
            this.dod.IdOrdenDescarga = ultimoId;
            this.dod.ClaveProducto = this.listData.data[i].ClaveProducto;
            this.dod.Producto = this.listData.data[i].Producto;
            this.dod.Sacos = this.listData.data[i].Sacos;
            //Verificar el peso x saco
            this.dod.PesoxSaco = this.listData.data[i].PesoxSaco;
            //segun yo no se conoce el lote.
            this.dod.Lote = this.listData.data[i].Lote;
            this.dod.IdProveedor = 0;
            this.dod.Proveedor = 'PasoTx';
            //duda sobre las fechas
            this.dod.FechaMFG = this.listData.data[i].FechaMFG;
            this.dod.FechaCaducidad = this.listData.data[i].FechaCaducidad;
            //duda sobre el shipper
            this.dod.Shipper = this.listData.data[i].Shipper;
            //duda USDA
            this.dod.USDA = this.listData.data[i].USDA;
            //duda pedimento
            this.dod.Pedimento = this.listData.data[i].Pedimento;
            this.dod.Saldo = this.listData.data[i].Sacos;
            
            console.log(this.dod);
            
            this.ordenDescargaService.addDetalleOrdenDescarga(this.dod).subscribe(resDetalle=>{
              console.log(resDetalle);

              //
              this.service.updatedetalleOrdenCargaEstatus(this.IdOrdenCarga, 'Terminada').subscribe(rese => {
                console.log(rese)/* 
                this.router.navigate(['/ordencargadetalle']); */
             


                Swal.fire({
                  title: 'Terminada',
                  icon: 'success',
                  timer: 1000,
                  showCancelButton: false,
                  showConfirmButton: false
                });

                this.getOrdenCarga();

              })
                
              
            })
          }
    
          //GENERAR EVENTO
          /* this.generarEventoCalendario(this.compra.Folio); */
          //GENERAR NOTIFICACION
          //GENERAR NOTIFICACION
          //GENERAR NOTIFICACION
          //GENERAR NOTIFICACION
          //GENERAR NOTIFICACION
          //GENERAR NOTIFICACION
          
        })
      })
    });
      
    }


    pdf() {

      // console.log(row);
      // this.service.formrow = row;
      // console.log();
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.width = "70%";
      this.dialog.open(SalidaProductoComponent, dialogConfig);
      // this.dialog.open(EntradaProductoComponent, dialogConfig);
    }

    validar(){
      console.log(this.service.formData);
      this.pedidoSVC.updateOrdenCarga(this.service.formData.IdPedido).subscribe(resp=>{
        console.log(resp);
        this.getOrdenCarga();
    this.refreshDetalleOrdenCargaList();
      })

      
    }

}
  