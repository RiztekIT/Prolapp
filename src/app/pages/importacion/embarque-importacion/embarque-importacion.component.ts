import { Component, OnInit, ViewChild } from '@angular/core';

import { Router } from '@angular/router';

import { MatTableDataSource, MatSort, MatPaginator, MatDialogConfig, MatDialog } from '@angular/material';

import { TarimaService } from 'src/app/services/almacen/tarima/tarima.service';

import { SelectionModel } from '@angular/cdk/collections';

import Swal from 'sweetalert2';

import { OrdenCargaService } from 'src/app/services/almacen/orden-carga/orden-carga.service';

import { BodegasService } from 'src/app/services/catalogos/bodegas.service';

import { DocumentacionImportacionComponent } from '../documentacion-importacion/documentacion-importacion.component';

import { DocumentacionFormularioImportacionComponent } from '../documentacion-importacion/documentacion-formulario-importacion/documentacion-formulario-importacion.component';

import { DocumentosImportacionService } from 'src/app/services/importacion/documentos-importacion.service';

import { Location } from '@angular/common';

import { TraspasoMercanciaService } from '../../../services/importacion/traspaso-mercancia.service';

import { TraspasomercanciaComponent } from '../../almacen/traspasomercancia/traspasomercancia.component';

import { ResumentraspasoComponent } from '../../almacen/traspasomercancia/resumentraspaso/resumentraspaso.component';

import { DetalleTarima } from 'src/app/Models/almacen/Tarima/detalleTarima-model';
import { ConnectionHubServiceService } from 'src/app/services/shared/ConnectionHub/connection-hub-service.service';

declare function steps();
declare function upload();


let origenNotificacion =[] = [
  {
  "IdNotificacion": 0,
  "Folio": 0,
  "IdUsuario": '',
  "Usuario": '',
  "Mensaje": '',
  "ModuloOrigen": '',
  "FechaEnvio": '',
  "origen": "Almacen", 
  "titulo": 'Traspaso',
  "datosExtra": '',
  },
]

@Component({
  selector: 'app-embarque-importacion',
  templateUrl: './embarque-importacion.component.html',
  styleUrls: ['./embarque-importacion.component.css'],

})
export class EmbarqueImportacionComponent implements OnInit {

  ciudades: any = [
    'Seleccionar Ciudad',
    'Aguascalientes',
    'Baja California',
    'Baja California Sur',
    'Campeche',
    'Coahuila',
    'Colima',
    'Chiapas',
    'Chihuahua',
    'Distrito Federal',
    'Durango',
    'Guanajuato',
    'Guerrero',
    'Hidalgo',
    'Jalisco',
    'México',
    'Michoacán de Ocampo',
    'Morelos',
    'Nayarit',
    'Nuevo León',
    'Oaxaca',
    'Puebla',
    'Querétaro',
    'Quintana Roo',
    'San Luis Potosí',
    'Sinaloa',
    'Sonora',
    'Tabasco',
    'Tamaulipas',
    'Tlaxcala',
    'Veracruz',
    'Yucatán',
    'Zacatecas'
  ];

  public listBodega: Array<Object> = [
    // { Bodega: 'Todos' },
    // { Bodega: 'PasoTx' },
    // { Bodega: 'Chihuahua' },
    // { Bodega: 'Transito' },

  ];


  constructor(public router: Router, public serviceTarima: TarimaService,
    public serviceordencarga: OrdenCargaService,
    private bodegaservice: BodegasService, private dialog: MatDialog, public documentosService: DocumentosImportacionService, public location: Location, 
    public traspasoSVC: TraspasoMercanciaService,
    private ConnectionHubService: ConnectionHubServiceService,) { }

  listData: MatTableDataSource<any>;
  listData2: MatTableDataSource<any>;
  displayedColumns: string[] = ['select', 'PO', 'CBK', 'Factura', 'Clave', 'Producto', 'Lote', 'Fecha Caducidad', 'FechaMFG', 'Cantidad'];
  displayedColumns2: string[] = ['PO', 'CBK', 'Clave', 'Producto', 'Lote', 'Fecha Caducidad', 'FechaMFG', 'Cantidad', 'Options'];
  bodegaSelect;
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  selection = new SelectionModel<any>(true, []);
  detalletraspaso = [];
  inicio = true;

  ngOnInit() {
    this.getbodegas();
    this.obtenerTarimas();

    //^ **** PRIVILEGIOS POR USUARIO *****
    this.obtenerPrivilegios();
    //^ **** PRIVILEGIOS POR USUARIO *****

    console.log(this.traspasoSVC.folionuevo);
    console.log(this.traspasoSVC.idnuevo);

  }



  //^ **** PRIVILEGIOS POR USUARIO *****
  privilegios: any;
  privilegiosExistentes: boolean = false;
  modulo = 'Importacion';
  area = 'Traspaso';

  //^ VARIABLES DE PERMISOS
  Agregar: boolean = false;
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
      case ('Agregar Nuevo Traspaso'):
        this.Agregar = true;
        break;
      default:
        break;
    }
  }
  //^ **** PRIVILEGIOS POR USUARIO *****

  bodegaCambio(event) {
    console.log(event);
    this.bodegaSelect = event.value;
    console.log(this.bodegaSelect);
    if (this.bodegaSelect === 'Todos') {
      this.applyFilter2('')
    } else {

      this.applyFilter2(this.bodegaSelect)
    }

  }

  getbodegas() {
    this.bodegaservice.getBodegasList().subscribe(res => {
      /* console.clear(); */
      console.log(res);
      console.log(res[0].Origen);
      for (let i = 0; i <= res.length - 1; i++) {
        let b = res[i].Origen
        this.listBodega.push(b)
      }

    })
  }

  applyFilter(filtervalue: string) {

    this.listData.filterPredicate = (data, filter: string) => {
      return data.Producto.toString().toLowerCase().includes(filter) || data.Lote.toString().includes(filter);
    };
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();

  }

  applyFilter2(filtervalue: string) {
    console.log(filtervalue);
    console.log(this.listData)
    this.listData.filterPredicate = (data, filter: string) => {
      return data.Bodega.toString().toLowerCase().includes(filter);
    };
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();

  }

  obtenerTarimas() {
    this.listData = new MatTableDataSource();
    this.serviceTarima.GetTarimaBodega().subscribe(data => {
      console.log(data, 'obtner tarimas');
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
      this.applyFilter2('PasoTx');
      this.bodegaSelect = 'PasoTx';
    })
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.listData.data.forEach(row => this.selection.select(row));
    console.log(this.selection);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.listData.data.length;
    return numSelected === numRows;
  }
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  toggle(row) {

    /* console.log(this.selection.isSelected(row)); */
    /* if (this.selection.isSelected(row)){

      Swal.fire({
        title: 'Ingresar Numero de Sacos',
        icon: 'info',
        input: 'text',
        inputValue: row.Sacos,
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
      }).then((result) => {
        console.log(result);
        this.detalletraspaso.push({
          "Bodega": row.Bodega,
"ClaveProducto" :  row.ClaveProducto,
"FechaCaducidad" :  row.FechaCaducidad,
"FechaMFG" :  row.FechaMFG,
"IdDetalleTarima" :  row.IdDetalleTarima,
"IdProveedor" :  row.IdProveedor,
"IdTarima" :  row.IdTarima,
"IdTarima1" :  row.IdTarima1,
"Lote" :  row.Lote,
"PO" :  row.PO,
"Pedimento" :  row.Pedimento,
"PesoTotal" :  row.PesoTotal,
"PesoxSaco" :  row.PesoxSaco,
"Producto" :  row.Producto,
"Proveedor" :  row.Proveedor,
"QR" :  row.QR,
"Sacos" :  result.value,
"Sacos1" :  row.Sacos1,
"Shipper" :  row.Shipper,
"USDA" :  row.USDA,
        })

        console.log(this.selection.selected.indexOf(row));
        console.log(this.detalletraspaso);
        console.log(console.log(this.selection.selected));
      })
    }else{
      console.log(this.detalletraspaso);
      console.log(console.log(this.selection.selected));
      console.log(this.selection.selected.indexOf(row));

    } */


    /* this.detalletraspaso. */

  }

  lista() {
    this.listData2 = new MatTableDataSource(this.selection.selected);
    this.listData2.sort = this.sort;
    this.listData2.paginator = this.paginator;
    this.listData2.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
    this.inicio = false;
    console.log(this.selection.selected);
  }
  lista2() {
    this.location.back();
    /* this.inicio = true;
    console.log(this.selection.selected); */

  }

  onEdit(row) {
     

    Swal.fire({
      title: 'Ingresar Kg',
      icon: 'info',
      input: 'text',
      inputValue: row.PesoTotal,
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
    }).then((result) => {
      if(result.value){

        console.log(result);
        row.PesoTotal = result.value
        row.PesoTotal1 = result.value
        row.Sacos = (+row.PesoTotal / +row.PesoxSaco)
        row.SacosTotales = (+row.PesoTotal / +row.PesoxSaco)
        /*   this.detalletraspaso.push({
          "Bodega": row.Bodega,
          "ClaveProducto" :  row.ClaveProducto,
          "FechaCaducidad" :  row.FechaCaducidad,
          "FechaMFG" :  row.FechaMFG,
          "IdDetalleTarima" :  row.IdDetalleTarima,
          "IdProveedor" :  row.IdProveedor,
          "IdTarima" :  row.IdTarima,
          "IdTarima1" :  row.IdTarima1,
          "Lote" :  row.Lote,
          "PO" :  row.PO,
          "Pedimento" :  row.Pedimento,
          "PesoTotal" :  row.PesoTotal,
          "PesoxSaco" :  row.PesoxSaco,
          "Producto" :  row.Producto,
          "Proveedor" :  row.Proveedor,
          "QR" :  row.QR,
          "Sacos" :  result.value,
          "Sacos1" :  row.Sacos1,
          "Shipper" :  row.Shipper,
          "USDA" :  row.USDA,
        }) */
        
        //console.log(this.selection.selected.indexOf(row));
        //console.log(this.detalletraspaso);
        console.log(this.listData2.data);
      }
    })


  }

  hacerTraspaso() {
    console.log(this.listData2.data);
    this.documentosService.folioOrdenDescarga = 0;
    this.documentosService.importacion = true;
    this.documentosService.productosimportacion = this.listData2.data;

    this.crearTraspaso()





  }

  updateTrapspaso(idordencarga, folio, idtraspasomercancia) {
    let query = 'update traspasomercancia set idordencarga=' + idordencarga + ', FolioOrdenCarga = ' + folio + ' where IdTraspasoMercancia= ' + idtraspasomercancia + '';
    let consulta = {
      'consulta': query
    };

    this.traspasoSVC.getQuery(consulta).subscribe((detalles: any) => {
      console.log(detalles);

    })
  }

  crearTraspaso() {
    let traspaso;
    let detalletraspaso;
    let sacos;
    let kg;

    sacos = 0;

    for (let i = 0; i < this.listData2.data.length; i++) {
      sacos = sacos + +this.listData2.data[i].SacosTotales;
      kg = sacos * +this.listData2.data[i].PesoxSaco;
    }

    let query = 'select top 1 TraspasoMercancia.Folio, TraspasoMercancia.IdTraspasoMercancia from TraspasoMercancia order by IdTraspasoMercancia desc'
    let consulta = {
      'consulta': query
    };

    this.traspasoSVC.getQuery(consulta).subscribe((detallesConsulta: any) => {
      console.log(detallesConsulta);

      //   this.traspasoSVC.folio =
      if (detallesConsulta.length > 0) {
        this.traspasoSVC.folionuevo = (+detallesConsulta[0].Folio + 1);
      } else {
        this.traspasoSVC.folionuevo = 1;
      }
      traspaso = {
        // IdTraspasoMercancia: this.traspasoSVC.idnuevo,
        IdTraspasoMercancia: 0,
        Folio: this.traspasoSVC.folionuevo,
        IdOrdenCarga: 0,
        FolioOrdenCarga: 0,
        IdCliente: 0,
        Cliente: 0,
        SacosTotales: sacos,
        KilogramosTotales: kg,
        FechaExpedicion: new Date(),
        Estatus: 'Creada',
        Origen: this.bodegaSelect,
        Destino: 'Chihuahua',
        CampoExtra1: '',
        CampoExtra2: '',
      }
console.log(traspaso);
      this.traspasoSVC.addTraspasoMercancia(traspaso).subscribe(res => {

        origenNotificacion[0].Folio = this.traspasoSVC.folionuevo
        this.ConnectionHubService.generarNotificacion(origenNotificacion[0])
        console.log(res);

        let query = 'select top 1 folio, idtraspasomercancia from traspasomercancia order by folio desc;'
        let consulta = {
          'consulta': query
        };
        this.traspasoSVC.getQuery(consulta).subscribe((resp: any) => {
          console.log(resp);
          // if (resp.length>0){
          // this.traspasoSVC.folionuevo = (+resp[0].folio).toString();
          // console.log('%c%s', 'color: #731d1d', this.traspasoSVC.folionuevo);
          this.traspasoSVC.idnuevo = (+resp[0].idtraspasomercancia).toString();
          console.log('%c%s', 'color: #807160', this.traspasoSVC.idnuevo);

          // }else {
          //   this.traspasoSVC.folionuevo = '1';
          //   this.traspasoSVC.idnuevo = '1';
          //   console.log('%c%s', 'color: #731d1d', this.traspasoSVC.folionuevo);
          //   console.log('%c%s', 'color: #807160', this.traspasoSVC.idnuevo);

          // }






          for (let i = 0; i < this.listData2.data.length; i++) {

            detalletraspaso = {
              IdDetalleTraspasoMercancia: 0,
              IdTraspasoMercancia: this.traspasoSVC.idnuevo,
              IdDetalle: this.listData2.data[i].IdDetalleTarima,
              Cbk: this.listData2.data[i].Pedimento,
              Usda: '',
              IdProveedor: this.listData2.data[i].IdProveedor,
              Proveedor: this.listData2.data[i].Proveedor,
              PO: this.listData2.data[i].PO,
              Producto: this.listData2.data[i].Producto,
              ClaveProducto: this.listData2.data[i].ClaveProducto,
              Lote: this.listData2.data[i].Lote,
              Sacos: this.listData2.data[i].SacosTotales,
              PesoxSaco: this.listData2.data[i].PesoxSaco,
              PesoTotal: this.listData2.data[i].PesoTotal,
              Bodega: this.listData2.data[i].Bodega,
              //^ Guardaremos la Factura de este Producto
              CampoExtra3: this.listData2.data[i].Shipper,
              CampoExtra4: '',
            }

            this.traspasoSVC.selectTraspaso = traspaso;

            console.log(detalletraspaso, 'DETALLE');

             this.traspasoSVC.addDetalleTraspasoMercancia(detalletraspaso).subscribe(data => {
               console.log(data);



              //^ verificar que se el ultimo producto a generar
              if (i == (this.listData2.data.length - 1)) {


                console.log('%c%s', 'color: #007300', 'ULTIMO PRODUCTOOOOOOO');

                // const dialogConfig = new MatDialogConfig();
                // dialogConfig.disableClose = false;
                // dialogConfig.autoFocus = true;
                // dialogConfig.width = "70%";
                // dialogConfig.data = {
                //   tipo: 'Agregar',
                // }
                // this.traspasoSVC.selectTraspaso.IdTraspasoMercancia = this.traspasoSVC.idnuevo;
                // let dl = this.dialog.open(ResumentraspasoComponent, dialogConfig);
                /* let dl = this.dialog.open(DocumentacionFormularioImportacionComponent, dialogConfig); */

                // dl.afterClosed().subscribe(res=>{
                this.inicio = true;
                 this.crearOC(this.traspasoSVC.idnuevo);
                // })


                /*   Swal.fire({
                  icon: 'success',
                  title: 'Traspaso Creado'
                }) */
              }
             })



          }

        })
      })
     })



  }

  crearOC(idtraspaso) {

    let ordencarga;
    let detordencarga;
    let sacos;
    let kg;
    let user;
    user = JSON.parse(localStorage.getItem('ProlappSession')).user;
    //this.service.formDataPedido.Estatus = 'Cerrada';

    //this.service.formDataPedido.Total = this.total;
    //this.service.formDataPedido.Subtotal = this.subtotal;
    //this.service.formDataPedido.TotalDlls = this.totalDlls;
    //this.service.formDataPedido.SubtotalDlls = this.subtotalDlls;

    // this.serviceordencarga.getUltimoFolio().subscribe(data=>{

    // console.log(data[0].Folio);
    let query = 'select top 1 folio from OrdenCarga order by folio desc;'
    let consulta = {
      'consulta': query
    };
    this.traspasoSVC.getQuery(consulta).subscribe((resp: any) => {
      console.log(resp);
      let folioOC = 1;
      if (resp.length) {
        folioOC = ((+resp[0].folio) + (1));
      }

      console.log(resp);

      sacos = 0;

      for (let i = 0; i < this.listData2.data.length; i++) {
        sacos = sacos + +this.listData2.data[i].SacosTotales;
        kg = sacos * +this.listData2.data[i].PesoxSaco;
      }



      ordencarga = {

        IdOrdenCarga: 0,
        Folio: (folioOC),
        FechaEnvio: new Date(),
        IdCliente: '0',
        Cliente: 'Traspaso',
        IdPedido: '0',
        Fletera: '',
        Caja: '',
        Sacos: sacos,
        Kg: kg,
        Chofer: '',
        Origen: this.bodegaSelect,
        Destino: 'Chihuahua',
        //^ Se Genera las observaciones en Transito, para saber que esta orden de carga Se encuentra en Transito y no en la bodega Origen
        Observaciones: 'Transito',
        Estatus: 'Creada',
        FechaInicioCarga: new Date('10/10/10'),
        FechaFinalCarga: new Date('10/10/10'),
        FechaExpedicion: new Date(),
        IdUsuario: '0',
        Usuario: user
      }

      console.log(ordencarga);


      //this.crearTraspaso(data[0].Folio);

       this.serviceordencarga.addOrdenCarga(ordencarga).subscribe(resp2 => {
         /* console.log(data); */

       /*  let query2 = 'select top 1 OrdenCarga.* from OrdenCarga order by folio desc;'
        let consulta2 = {
          'consulta': query2
        }; */
        /* this.traspasoSVC.getQuery(consulta2).subscribe((resp2: any) => { */
          console.log(resp2);

          this.traspasoSVC.selectTraspaso.FolioOrdenCarga = resp2[0].Folio;
          this.traspasoSVC.selectTraspaso.IdOrdenCarga = resp2[0].IdOrdenCarga;

          console.log(resp2[0].IdOrdenCarga, 'IDCARGA');
          console.log(resp2[0].Folio, 'FOLIO');
          console.log(idtraspaso,'IDTRASPASO');

           this.updateTrapspaso(resp2[0].IdOrdenCarga, resp2[0].Folio, idtraspaso)

          console.log(this.listData2.data);

          for (let i = 0; i < this.listData2.data.length; i++) {

            detordencarga = {

              IdDetalleOrdenCarga: 0,
              // IdOrdenCarga: 0,
              IdOrdenCarga: resp2[0].IdOrdenCarga,
              ClaveProducto: this.listData2.data[i].ClaveProducto,
              Producto: this.listData2.data[i].Producto,
              Sacos: this.listData2.data[i].SacosTotales,
              PesoxSaco: this.listData2.data[i].PesoxSaco,
              Lote: this.listData2.data[i].Lote,
              IdProveedor: this.listData2.data[i].IdProveedor,
              Proveedor: this.listData2.data[i].Proveedor,
              PO: this.listData2.data[i].PO,
              FechaMFG: this.listData2.data[i].FechaMFG,
              FechaCaducidad: this.listData2.data[i].FechaCaducidad,
              Shipper: this.listData2.data[i].Shipper,
              USDA: this.listData2.data[i].USDA,
              Pedimento: this.listData2.data[i].Pedimento,
              Saldo: ((this.listData2.data[i].PesoTotal)),
            }
              console.log(detordencarga);
             this.serviceordencarga.addDetalleOrdenCarga(detordencarga).subscribe(data => {
               console.log(data);
              Swal.fire({
                icon: 'success',
                title: 'Traspaso Creado'
              })
              if (i == (this.listData2.data.length - 1)) {
                const dialogConfig = new MatDialogConfig();
                dialogConfig.disableClose = false;
                dialogConfig.autoFocus = true;
                dialogConfig.width = "70%";
                dialogConfig.data = {
                  tipo: 'Agregar',
                }
                this.traspasoSVC.selectTraspaso.IdTraspasoMercancia = this.traspasoSVC.idnuevo;

                
                
                let dl = this.dialog.open(ResumentraspasoComponent, dialogConfig);
              }

             })


          }



          //^ Mover Productos de traspaso a bodega = 'Transito';
           this.moverProductosTransito();


   


          /*  console.log(this.service.formDataPedido);
           this.service.updateVentasPedido(this.service.formDataPedido).subscribe(res => {
             Swal.fire({
               icon: 'success',
               title: 'Pedido Cerrado'
             }) */


          /* this.Inicializar(); */
        /* }) */

      }
      )


     })

  }

  //^ Esta metodo movera los productos que seran traspasados a la bodega transtio. 
  //^ Con el objetivo de descontar los inventarios en la bodega y asi evitar traspasar productos que ya hayan sido traspasados
  moverProductosTransito() {

    console.log(this.listData2.data);

    for (let i = 0; i < this.listData2.data.length; i++) {

      console.log(i);
      console.log(this.listData2.data[i]);

      let Sacos = this.listData2.data[i].Sacos;
      let Lote = this.listData2.data[i].Lote;
      let ClaveProducto = this.listData2.data[i].ClaveProducto;

      let kg = this.listData2.data[i].PesoTotal;

      // this.agregarOrdenTemporal(i, Lote, ClaveProducto, Sacos, kg);
//^ Obtenemos la informacion del producto a traspasar
      // this.serviceTarima.GetGetProductoInformacionBodega(this.listData2.data[i].ClaveProducto, this.listData2.data[i].Lote, this.listData2.data[i].Bodega).subscribe(dataDetalleTarima => {
        let consulta = {
          'consulta':"select * from detalletarima where ClaveProducto='"+this.listData2.data[i].ClaveProducto+ "' and lote='"+this.listData2.data[i].Lote+"' and Bodega='"+this.listData2.data[i].Bodega+"' and Shipper = '"+this.listData2.data[i].Shipper+"';"
        };
    
        console.log(consulta);
        this.serviceTarima.generarConsulta(consulta).subscribe((dataDetalleTarima:any)=>{
        console.log(dataDetalleTarima);

        let dataDetalleTarimaOriginal = dataDetalleTarima;
        let dataDetalleTarimaNueva = dataDetalleTarima;


      //   console.log(Sacos);
      //   console.log(Lote);
      //   console.log(ClaveProducto);
      //   console.log(i);

//^ Verificamos si los kg del producto en la bodega son iguales a los que traspasaremos
//^En dado caso que sea verdadero, actualizaremos la bodega de ese producto a 'Transito'
        if (dataDetalleTarima[0].PesoTotal == kg) {

      //     console.log('Se utilizaran todos los Sacos');
          let updateDetalleTarima: DetalleTarima = dataDetalleTarima[0];
          updateDetalleTarima.Bodega = 'Transito';
          this.serviceTarima.updateDetalleTarimaSacosPesoTarimasBodega(updateDetalleTarima).subscribe(resUpdate => {
      //       console.log(resUpdate);


          })
        } 
        //^ en dado caso que los Kg no coincidan. Se decontaran los kg del producto en la bodega, y se agregaran los kg a la bodega Transito.
        else {

      //     console.log('No todos los sacos seran Utilizados');

          let detalleTarimaNueva: DetalleTarima = dataDetalleTarimaNueva[0];

          console.log(detalleTarimaNueva);
      //     console.log(dataDetalleTarimaNueva[0]);
      //     console.log(Sacos);

          detalleTarimaNueva.SacosTotales = ((+detalleTarimaNueva.SacosTotales) - (+Sacos)).toString();
          detalleTarimaNueva.PesoTotal = ((+detalleTarimaNueva.PesoTotal) - (+kg)).toString();

          detalleTarimaNueva.Bodega = this.listData2.data[i].Bodega;
          detalleTarimaNueva.Estatus = 'Creada';

          this.serviceTarima.addDetalleTarima(detalleTarimaNueva).subscribe(resNuevaTarima => {
      //       console.log(resNuevaTarima);
            let detalleTarimaOriginal: DetalleTarima = dataDetalleTarimaOriginal[0];

            detalleTarimaOriginal.SacosTotales = Sacos;
            detalleTarimaOriginal.PesoTotal = kg.toString();

            detalleTarimaOriginal.Bodega = 'Transito';
            this.serviceTarima.updateDetalleTarimaSacosPesoTarimasBodega(detalleTarimaOriginal).subscribe(resUpdateOriginal => {
      //         console.log(resUpdateOriginal);


            })
          })
        }
      });
      //^ verificar que se el ultimo producto a generar
      if (i == (this.listData2.data.length - 1)) {
       //^ regresar a pantalla principal
        this.router.navigateByUrl('/importacionesalmacen');
        //^ Actualizar Tabla Principal
        this.traspasoSVC.filter('');
      }
    }
  }


}
