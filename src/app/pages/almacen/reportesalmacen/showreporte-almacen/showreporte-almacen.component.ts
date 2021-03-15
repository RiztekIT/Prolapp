import { Component, OnInit, Input, SimpleChanges, Inject } from "@angular/core";
import * as html2pdf from "html2pdf.js";
import { MAT_DIALOG_DATA } from "@angular/material";
import { ngxLoadingAnimationTypes } from "ngx-loading";
import { SharedService } from "../../../../services/shared/shared.service";
import { CalendarioService } from "src/app/services/calendario/calendario.service";
import { formatoReporte } from "../../../../Models/formato-reporte";
import { OrdenCargaService } from 'src/app/services/almacen/orden-carga/orden-carga.service';
import { OrdenDescargaService } from 'src/app/services/almacen/orden-descarga/orden-descarga.service';
import { TarimaService } from 'src/app/services/almacen/tarima/tarima.service';
import { ClientesService } from '../../../../services/catalogos/clientes.service';
import { ProveedoresService } from '../../../../services/catalogos/proveedores.service';
import { VentasCotizacionService } from '../../../../services/ventas/ventas-cotizacion.service';
import { resolve } from 'url';
import { TraspasoMercanciaService } from '../../../../services/importacion/traspaso-mercancia.service';
import { EnviarfacturaService } from '../../../../services/facturacioncxc/enviarfactura.service';

@Component({
  selector: 'app-showreporte-almacen',
  templateUrl: './showreporte-almacen.component.html',
  styleUrls: ['./showreporte-almacen.component.css']
})
export class ShowreporteAlmacenComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public sharedService: SharedService, public ocService: OrdenCargaService,
    public odService: OrdenDescargaService, public serviceTarima: TarimaService, public clienteService: ClientesService, public proveedorService: ProveedoresService,
    public cotizacionService: VentasCotizacionService, public traspasoService: TraspasoMercanciaService, private EnviarfacturaService: EnviarfacturaService) { }

  ngOnInit() {
    this.ReporteInformacion = this.data;
    console.log('%c⧭', 'color: #5200cc', this.data);

    this.EnviarfacturaService.titulo = 'Reporte ' + this.data.modulo
    console.log('%c⧭', 'color: #f27999', this.EnviarfacturaService.titulo);

    console.log(this.ReporteInformacion);
    //Identificar de donde se genero el reporte
    this.identificarTipoDeReporte(this.ReporteInformacion.modulo, this.ReporteInformacion.unsolocliente);
  }

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public loading = false;
  ReporteInformacion: any;
  arrcon: Array<any> = [];

  //Variables totales reporte
  sacos: number;
  kg: number;
  //tipoReporte
  tipoReporte: string;
  //reporteporFechas
  reporteFechas: boolean;
  //repoteporEstatus
  reporteEstatus: boolean;

  iniciarTotales() {
    this.sacos = 0;
    this.kg = 0;
  }

  identificarTipoDeReporte(modulo: string, unCliente: boolean) {
    console.log(unCliente);
    //asignar valores del Reporte
    this.reporteFechas = this.ReporteInformacion.filtradoFecha;
    this.reporteEstatus = this.ReporteInformacion.estatus;


    let unaBodega = this.ReporteInformacion.estatus;
    let bodega = this.ReporteInformacion.tipoEstatus;

    let claveProducto = this.ReporteInformacion.claveProduto;

    // console.log(this.ReporteInformacion.tipoEstatus);
    console.log(claveProducto);
    switch (modulo) {
      case ('OrdenCarga'):
        console.log(modulo);
        if (unCliente == true) {
          this.getunCliente(this.ReporteInformacion.idClienteProveedor);
        } else {
          this.getClientes();
        }
        break;
      case ('Traspaso'):
        console.log(modulo);
        this.obtenerReporteTraspaso();

        break;
      case ('OrdenDescarga'):
        if (unCliente == true) {
          this.getProveedor(this.ReporteInformacion.idClienteProveedor);
        } else {
          this.getProveedores();
        }
        break;
      case ('Inventario'):
        if (unaBodega == true) {
          //Una sola bodega
          this.getReporteUnaBodega(bodega, unCliente, claveProducto);
        } else {
          //Todas las bodegas
          this.getReporteBodegas(unCliente, claveProducto);
        }
        break;

    }
  }

  getunCliente(id) {
    console.log('Un CLiente', id);
    this.cotizacionService.GetCliente(id).subscribe((dataCliente) => {
      // if(modulo == 'OrdenCarga'){
      this.obtenerReporteOrdenCarga(dataCliente.length, dataCliente);
      // }else if(modulo == 'Traspaso'){
      //   this.obtenerReportesTraspaso(dataCliente.length, dataCliente);
      // }
    });
  }

  getClientes() {
    this.cotizacionService.getDepDropDownValues().subscribe((dataClientes) => {
      console.log(dataClientes);
      this.obtenerReporteOrdenCarga(dataClientes.length, dataClientes);
    });
  }

  getProveedor(id) {
    this.proveedorService.getProveedorId(id).subscribe(datapro => {
      console.log(datapro);
      this.obtenerReporteOrdenDescarga(datapro.length, datapro);
    })
  }

  getProveedores() {
    this.proveedorService.getProveedoresList().subscribe(datapro => {
      console.log(datapro);
      this.obtenerReporteOrdenDescarga(datapro.length, datapro);
    })
  }

  // private getTranslations(keys: string[]): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.translateSvc.get(keys).subscribe(success => {
  //       resolve(success);
  //     });
  //   });
  // }

  // return new Promise((resolve, reject)=>{
  //   this.serviceTarima.getProductos().subscribe((data:any)=>{
  //    //  resolve(data);
  //    //  console.log(data,'obtner tarimas');
  //     resolve(this.obtenerProductos(bodega, data));      
  //   })
  // })

  getReporteUnaBodega(bodega: string, unProducto, clave) {
    console.log('UNA BODEGA');

    //^ Verificamos
    if (unProducto == true) {
      // console.log('UN SOLO PRODUCTO');
      // console.log(clave);
      this.serviceTarima.getProductoClave(clave).subscribe(data => {
        console.log(data);
        //^ Verificamos si se agruparan los lotes
        if (this.reporteFechas == true) {
          //^ buscaremos un producto agrupado en x bodega
          this.obtenerInformacionAgrupadaPorLotes(true, bodega);
        } else {
          this.obtenerInformacionReporteUnaBodega(data, bodega);
        }
      })


    } else {
      console.log('MUCHOS PRODUCTOS');

      this.serviceTarima.getProductos().subscribe((data: any) => {
        // console.log(data,'obtner tarimas');
        //^ Verificamos si se agruparan los lotes
        if (this.reporteFechas == true) {
          //^ buscaremos todos los productos agrupados en x bodega
          this.obtenerInformacionAgrupadaPorLotes(true, bodega);
        } else {
          this.obtenerInformacionReporteUnaBodega(data, bodega);
        }

      })
    }



  }

  //^ Variables Generales
  sacostotales: number = 0;
  pesototal: number = 0;




  //^ Recibe como parametro la lista de Producto(s) y la bodega Origen
  obtenerInformacionReporteUnaBodega(data, bodega) {
    let contador = 0;

    this.serviceTarima.master = [];
    // let sacostotales;
    // let pesototal;
    let pesoporTarimaP;
    for (let l = 0; l < data.length; l++) {
      console.log(data[l].Nombre);

      this.serviceTarima.GetTarimaProducto(data[l].Nombre, bodega).subscribe(datadet => {
        console.log(datadet);
        if (datadet.length > 0) {
          pesoporTarimaP = 0;
          this.serviceTarima.master[contador] = data[l];
          for (let i = 0; i < datadet.length; i++) {


            datadet[i].SacosD = +datadet[i].Sacos;

            pesoporTarimaP = ((+datadet[i].Sacos1) * (+datadet[i].PesoxSaco));
            this.pesototal = this.pesototal + +datadet[i].PesoTotal;
            this.sacostotales = this.sacostotales + +datadet[i].Sacos1;

            datadet[i].SacoDetalle = pesoporTarimaP;


            this.serviceTarima.GetTarimaProductoD(datadet[i].Producto, datadet[i].Lote).subscribe(datas => {
              console.log(datas, 'datas');
              if (datas.length > 0) {

                for (let d = 0; d < datas.length; d++) {

                  datadet[i].SacosD = datadet[i].SacosD - +datas[d].Sacos
                  datadet[i].SacoDetalle = datadet[i].SacoDetalle - +datas[d].Sacos
                }

              } else {
                datadet[i].SacosD = datadet[i].SacosD
                datadet[i].SacoDetalle = datadet[i].SacoDetalle
              }
            })
          }
          this.serviceTarima.master[contador].detalle = datadet;
          // this.serviceTarima.master[contador].pesoEnTotal = pesototal;
          // this.serviceTarima.master[contador].Stock = sacostotales;
          contador++;
        }
        this.arrcon = this.serviceTarima.master;
        console.log(this.arrcon);
      })
    }
  }

  obtenerInformacionAgrupadaPorLotes( unaBodega?, bodega?) {
    //^ Agruparemos los lotes de 1 sola bodega
    if (unaBodega == true) {
      console.log('UNA SOLA BODEGA y AGRUPADOS');
      let contador = 0;

      this.serviceTarima.master = [];
      // let sacostotales;
      // let pesototal;
      // let pesoporTarimaP;
      // for (let l = 0; l < data.length; l++) {
        // console.log(data[l].Nombre);

        let query = 'select ClaveProducto, Producto, SUM(cast(PesoTotal as decimal(18,2))) as PesoTotal from DetalleTarima where  Bodega = ' + "'" + bodega + "'" + '  group by ClaveProducto, Producto '
    let consulta = {
      'consulta': query
    };
    console.log('%c⧭', 'color: #9c66cc', consulta);
    this.traspasoService.getQuery(consulta).subscribe((detallesConsulta: any) => {
      console.log(detallesConsulta);

          if (detallesConsulta.length > 0) {

            for (let l = 0; l < detallesConsulta.length; l++) {

            this.serviceTarima.master[contador] = detallesConsulta[l];


              this.pesototal = this.pesototal + +detallesConsulta[l].PesoTotal;

              let Detalle = {
                ClaveProducto: detallesConsulta[l].ClaveProducto,
                Producto: detallesConsulta[l].Producto,
                PesoTotal : +detallesConsulta[l].PesoTotal
              }
              
              console.log('%c⧭', 'color: #ace2e6', Detalle);

              let array = [];
              array[0] = Detalle;
            this.serviceTarima.master[contador].detalle = array;
            contador++;
           }
          }
          this.arrcon = this.serviceTarima.master;
          console.log(this.arrcon);
        })
    }
    //^ Agruparemos los lotes de todas las bodega
    else {
      console.log('MUCHAS BODEGAS y AGRUPADOS');
      let contador = 0;

      this.serviceTarima.master = [];
      // let sacostotales;
      // let pesototal;
      // let pesoporTarimaP;
      // for (let l = 0; l < data.length; l++) {
        // console.log(data[l].Nombre);

        let query = 'select ClaveProducto, Producto, SUM(cast(PesoTotal as decimal(18,2))) as PesoTotal from DetalleTarima  group by ClaveProducto, Producto '
    let consulta = {
      'consulta': query
    };
    console.log('%c⧭', 'color: #9c66cc', consulta);
    this.traspasoService.getQuery(consulta).subscribe((detallesConsulta: any) => {
      console.log(detallesConsulta);

          if (detallesConsulta.length > 0) {

            for (let l = 0; l < detallesConsulta.length; l++) {

            this.serviceTarima.master[contador] = detallesConsulta[l];


              this.pesototal = this.pesototal + +detallesConsulta[l].PesoTotal;

              let Detalle = {
                ClaveProducto: detallesConsulta[l].ClaveProducto,
                Producto: detallesConsulta[l].Producto,
                PesoTotal : +detallesConsulta[l].PesoTotal
              }
              
              console.log('%c⧭', 'color: #ace2e6', Detalle);

              let array = [];
              array[0] = Detalle;
            this.serviceTarima.master[contador].detalle = array;
            contador++;
           }
          }
          this.arrcon = this.serviceTarima.master;
          console.log(this.arrcon);
        })
    }

  }

  obtenerInformacionReporteBodegas(data) {
    let contador = 0;

    this.serviceTarima.master = [];
    let pesoporTarimaP;
    for (let l = 0; l < data.length; l++) {
      console.log(data[l].Nombre);

      this.serviceTarima.GetTarimaProductoAllBodegas(data[l].Nombre).subscribe(datadet => {
        console.log(datadet);
        if (datadet.length > 0) {
          pesoporTarimaP = 0;
          this.serviceTarima.master[contador] = data[l];
          for (let i = 0; i < datadet.length; i++) {


            datadet[i].SacosD = +datadet[i].Sacos;

            pesoporTarimaP = ((+datadet[i].Sacos1) * (+datadet[i].PesoxSaco));
            this.pesototal = this.pesototal + +datadet[i].PesoTotal;
            this.sacostotales = this.sacostotales + +datadet[i].Sacos1;

            datadet[i].SacoDetalle = pesoporTarimaP;


            this.serviceTarima.GetTarimaProductoD(datadet[i].Producto, datadet[i].Lote).subscribe(datas => {
              console.log(datas, 'datas');
              if (datas.length > 0) {

                for (let d = 0; d < datas.length; d++) {

                  datadet[i].SacosD = datadet[i].SacosD - +datas[d].Sacos
                  datadet[i].SacoDetalle = datadet[i].SacoDetalle - +datas[d].Sacos
                }

              } else {
                datadet[i].SacosD = datadet[i].SacosD
                datadet[i].SacoDetalle = datadet[i].SacoDetalle
              }
            })
          }
          this.serviceTarima.master[contador].detalle = datadet;
          // this.serviceTarima.master[contador].pesoEnTotal = pesototal;
          // this.serviceTarima.master[contador].Stock = sacostotales;
          contador++;
        }
        this.arrcon = this.serviceTarima.master;
        console.log(this.arrcon);
      })
    }
  }


  getReporteBodegas(unProducto, clave) {
    console.log('GET iNFO TODAS LAS BODEGAS');


    if (unProducto == true) {
      console.log('UN SOLO PRODUCTO');
      console.log(clave);
      this.serviceTarima.getProductoClave(clave).subscribe(data => {
        //^ Verificamos si se agruparan los lotes
        if (this.reporteFechas == true) {
          //^ buscaremos un producto agrupado en x bodega
          this.obtenerInformacionAgrupadaPorLotes( false, '');
        } else {
        this.obtenerInformacionReporteBodegas(data);
        }
      })

    } else {
      console.log('MUCHOS PRODUCTOS');
      this.serviceTarima.getProductos().subscribe((data: any) => {
        console.log(data, 'obtner tarimas');
        //^ Verificamos si se agruparan los lotes
        if (this.reporteFechas == true) {
          //^ buscaremos un producto agrupado en x bodega
          this.obtenerInformacionAgrupadaPorLotes( false, '');
        } else {
        this.obtenerInformacionReporteBodegas(data);
        }
      })

    }


  }


  obtenerReporteOrdenCarga(numero: number, data: any) {
    this.arrcon = [];
    // ningun filtro
    if (this.reporteFechas == false && this.reporteEstatus == false) {
      this.filtroGeneralOrdenCarga(numero, data);
    }
    //buscar reporte por Fechas
    else if (this.reporteFechas == true && this.reporteEstatus == false) {
      this.filtroFechaOrdenCarga(numero, data, this.ReporteInformacion.fechaInicial, this.ReporteInformacion.fechaFinal);
    }
    //buscar reporte por Estatus 
    else if (this.reporteFechas == false && this.reporteEstatus == true) {
      this.filtroEstatusOrdenCarga(numero, data, this.ReporteInformacion.tipoEstatus);
    }
    //buscar reporte por  Estatus y por Fechas
    else if (this.reporteFechas == true && this.reporteEstatus == true) {
      this.filtroEstatusFechaOrdenCarga(numero, data, this.ReporteInformacion.fechaInicial, this.ReporteInformacion.fechaFinal, this.ReporteInformacion.tipoEstatus);
    }
  }
  //filtro por Id Cliente
  filtroGeneralOrdenCarga(numero, data) {

    console.log('FILTRO GENERAL');
    for (let i = 0; i < numero; i++) {
      this.arrcon[i] = data[i];
      this.arrcon[i].Docs = [];
      //Obtener Reportes por Id Cliente
      this.ocService
        .getReporteClienteId(data[i].IdClientes)
        .subscribe((dataReporte) => {
          if (dataReporte.length > 0) {
            console.log(dataReporte);
            this.iniciarTotales();
            for (let l = 0; l < dataReporte.length; l++) {
              this.sacos = this.sacos + +dataReporte[l].Sacos;
              this.kg = this.kg + +dataReporte[l].Kg;
              this.arrcon[i].Docs.push(dataReporte[l]);
            }
            this.arrcon[i].Sacos = this.sacos;
            this.arrcon[i].Kg = this.kg;
          } else {
            this.iniciarTotales();
          }
        });
    }
  }
  //Filtro por IdCliente y por Las Fechas 
  filtroFechaOrdenCarga(numero, data, fechaInicial, fechaFinal) {

    console.log('FILTRO FECHA IDCLIENTE');
    let fecha1;
    let fecha2;

    let dia = fechaInicial.getDate();
    let mes = fechaInicial.getMonth() + 1;
    let anio = fechaInicial.getFullYear();
    fecha1 = anio + '-' + mes + '-' + dia

    let dia2 = fechaFinal.getDate();
    let mes2 = fechaFinal.getMonth() + 1;
    let anio2 = fechaFinal.getFullYear();
    fecha2 = anio2 + '-' + mes2 + '-' + dia2

    for (let i = 0; i < numero; i++) {
      this.arrcon[i] = data[i];
      this.arrcon[i].Docs = [];
      //Obtener Reportes por Id Cliente
      this.ocService.getReporteFechasClienteId(fecha1, fecha2, data[i].IdClientes).subscribe(dataReporte => {
        if (dataReporte.length > 0) {
          console.log(dataReporte);
          this.iniciarTotales();
          for (let l = 0; l < dataReporte.length; l++) {
            this.sacos = this.sacos + +dataReporte[l].Sacos;
            this.kg = this.kg + +dataReporte[l].Kg;
            this.arrcon[i].Docs.push(dataReporte[l]);
          }
          this.arrcon[i].Sacos = this.sacos;
          this.arrcon[i].Kg = this.kg;
        } else {
          this.iniciarTotales();
        }
      })
    }
  }
  //Filtro por IdCliente y Estatus
  filtroEstatusOrdenCarga(numero, data, estatus) {
    console.log('FILTRO ESTATUS ID CLIENTE');
    for (let i = 0; i < numero; i++) {
      this.arrcon[i] = data[i];
      this.arrcon[i].Docs = [];
      //Obtener Reportes por Id Cliente
      this.ocService.getReporteClienteIdEstatus(data[i].IdClientes, estatus).subscribe(dataReporte => {
        if (dataReporte.length > 0) {
          console.log(dataReporte);
          this.iniciarTotales();
          for (let l = 0; l < dataReporte.length; l++) {
            this.sacos = this.sacos + +dataReporte[l].Sacos;
            this.kg = this.kg + +dataReporte[l].Kg;
            this.arrcon[i].Docs.push(dataReporte[l]);
          }
          this.arrcon[i].Sacos = this.sacos;
          this.arrcon[i].Kg = this.kg;
        } else {
          this.iniciarTotales();
        }
      })
    }
  }

  //Filtro por IdProveedor, Tipo de Compra (Materia Prima), por Las Fechas y Estatus de la Compra 
  filtroEstatusFechaOrdenCarga(numero, data, fechaInicial, fechaFinal, estatus) {

    console.log('FILTRO TODO');

    let fecha1;
    let fecha2;

    let dia = fechaInicial.getDate();
    let mes = fechaInicial.getMonth() + 1;
    let anio = fechaInicial.getFullYear();
    fecha1 = anio + '-' + mes + '-' + dia

    let dia2 = fechaFinal.getDate();
    let mes2 = fechaFinal.getMonth() + 1;
    let anio2 = fechaFinal.getFullYear();
    fecha2 = anio2 + '-' + mes2 + '-' + dia2

    for (let i = 0; i < numero; i++) {
      this.arrcon[i] = data[i];
      this.arrcon[i].Docs = [];
      //Obtener Reportes por Id Cliente
      this.ocService.getReporteFechasClienteIdEstatus(fecha1, fecha2, data[i].IdClientes, estatus).subscribe(dataReporte => {
        if (dataReporte.length > 0) {
          console.log(dataReporte);
          this.iniciarTotales();
          for (let l = 0; l < dataReporte.length; l++) {
            this.sacos = this.sacos + +dataReporte[l].Sacos;
            this.kg = this.kg + +dataReporte[l].Kg;
            this.arrcon[i].Docs.push(dataReporte[l]);
          }
          this.arrcon[i].Sacos = this.sacos;
          this.arrcon[i].Kg = this.kg;
        } else {
          this.iniciarTotales();
        }
      })
    }
  }

  obtenerReporteTraspaso() {
    this.arrcon = [];
    // ningun filtro
    if (this.reporteFechas == false && this.reporteEstatus == false) {
      this.filtroGeneralTraspaso();
    }
    //buscar reporte por Fechas
    else if (this.reporteFechas == true && this.reporteEstatus == false) {
      this.filtroFechaTraspaso(this.ReporteInformacion.fechaInicial, this.ReporteInformacion.fechaFinal);
    }
    //buscar reporte por Estatus 
    else if (this.reporteFechas == false && this.reporteEstatus == true) {
      this.filtroEstatusTraspaso(this.ReporteInformacion.tipoEstatus);
    }
    //buscar reporte por  Estatus y por Fechas
    else if (this.reporteFechas == true && this.reporteEstatus == true) {
      this.filtroEstatusFechaTraspaso(this.ReporteInformacion.fechaInicial, this.ReporteInformacion.fechaFinal, this.ReporteInformacion.tipoEstatus);
    }
  }
  //filtro por Id Cliente
  filtroGeneralTraspaso() {

    this.traspasoService.getReporteTraspasoBodegas(this.ReporteInformacion.bodegaOrigen, this.ReporteInformacion.bodegaDestino).subscribe(dataDocumentos => {
      console.log(dataDocumentos);
      this.iniciarTotales();
      if (dataDocumentos.length > 0) {
        for (let i = 0; i < dataDocumentos.length; i++) {
          this.arrcon[i] = dataDocumentos[i];
          this.kg = this.kg + +dataDocumentos[i].KilogramosTotales;
          this.sacos = this.sacos + +dataDocumentos[i].SacosTotales;
          this.arrcon[i].Docs = [];
          this.traspasoService.getDetalleTraspasoMercancia(dataDocumentos[i].IdTraspasoMercancia).subscribe(dataDetalle => {
            let sacos: number = 0;
            let kilos: number = 0;
            dataDetalle.forEach(element => {
              sacos = sacos + +element.Sacos;
              kilos = kilos + +element.PesoTotal;
              this.arrcon[i].Docs.push(element);
              this.arrcon[i].sac = sacos;
              this.arrcon[i].kil = kilos;
            });
          })
        }
      }
    })

    //   type MyArrayType = Array<{IdClientes: number, Nombre: string}>;

    // const arr: MyArrayType = [
    //     {IdClientes: 0, Nombre: 'Traspaso'}
    // ];

    //   console.log('FILTRO GENERAL');
    //   for (let i = 0; i < numero; i++) {

    //     this.arrcon[i] = arr[0];
    //     this.arrcon[i].Docs = [];
    //     //Obtener Reportes por Id Cliente
    //     this.ocService
    //       .getReporteClienteId(id)
    //       .subscribe((dataReporte) => {
    //         if (dataReporte.length > 0) {
    //           console.log(dataReporte);
    //           this.iniciarTotales();
    //           for (let l = 0; l < dataReporte.length; l++) {
    //             this.sacos = this.sacos + +dataReporte[l].Sacos;
    //             this.kg = this.kg + +dataReporte[l].Kg;
    //             this.arrcon[i].Docs.push(dataReporte[l]);
    //           }
    //           this.arrcon[i].Sacos = this.sacos;
    //           this.arrcon[i].Kg = this.kg;
    //         } else {
    //           this.iniciarTotales();
    //         }
    //         console.log(this.arrcon);
    //       });
    //   }
  }
  //Filtro por IdCliente y por Las Fechas 
  filtroFechaTraspaso(fechaInicial, fechaFinal) {


    let fecha1;
    let fecha2;

    let dia = this.ReporteInformacion.fechaInicial.getDate();
    let mes = this.ReporteInformacion.fechaInicial.getMonth() + 1;
    let anio = this.ReporteInformacion.fechaInicial.getFullYear();
    fecha1 = anio + '-' + mes + '-' + dia

    let dia2 = this.ReporteInformacion.fechaFinal.getDate();
    let mes2 = this.ReporteInformacion.fechaFinal.getMonth() + 1;
    let anio2 = this.ReporteInformacion.fechaFinal.getFullYear();
    fecha2 = anio2 + '-' + mes2 + '-' + dia2

    this.traspasoService.getReporteTraspasoBodegasFechas(this.ReporteInformacion.bodegaOrigen, this.ReporteInformacion.bodegaDestino, fecha1, fecha2).subscribe(dataDocumentos => {
      console.log(dataDocumentos);
      this.iniciarTotales();
      if (dataDocumentos.length > 0) {
        for (let i = 0; i < dataDocumentos.length; i++) {
          this.arrcon[i] = dataDocumentos[i];
          this.kg = this.kg + +dataDocumentos[i].KilogramosTotales;
          this.sacos = this.sacos + +dataDocumentos[i].SacosTotales;
          this.arrcon[i].Docs = [];
          this.traspasoService.getDetalleTraspasoMercancia(dataDocumentos[i].IdTraspasoMercancia).subscribe(dataDetalle => {
            let sacos: number = 0;
            let kilos: number = 0;
            dataDetalle.forEach(element => {
              sacos = sacos + +element.Sacos;
              kilos = kilos + +element.PesoTotal;
              this.arrcon[i].Docs.push(element);
              this.arrcon[i].sac = sacos;
              this.arrcon[i].kil = kilos;
            });
          })
        }
      }
    })

    // type MyArrayType = Array<{IdClientes: number, Nombre: string}>;

    // const arr: MyArrayType = [
    //     {IdClientes: 0, Nombre: 'Traspaso'}
    // ];

    // console.log('FILTRO FECHA IDCLIENTE');
    // let fecha1;
    // let fecha2;

    // let dia = fechaInicial.getDate();
    // let mes = fechaInicial.getMonth() + 1;
    // let anio = fechaInicial.getFullYear();
    // fecha1 = anio + '-' + mes + '-' + dia

    // let dia2 = fechaFinal.getDate();
    // let mes2 = fechaFinal.getMonth() + 1;
    // let anio2 = fechaFinal.getFullYear();
    // fecha2 = anio2 + '-' + mes2 + '-' + dia2

    // for (let i = 0; i < numero; i++) {
    //   this.arrcon[i] = arr[0];
    //   this.arrcon[i].Docs = [];
    //   //Obtener Reportes por Id Cliente
    //   this.ocService.getReporteFechasClienteId(fecha1, fecha2, id).subscribe(dataReporte => {
    //     if (dataReporte.length > 0) {
    //       console.log(dataReporte);
    //       this.iniciarTotales();
    //       for (let l = 0; l < dataReporte.length; l++) {
    //         this.sacos = this.sacos + +dataReporte[l].Sacos;
    //         this.kg = this.kg + +dataReporte[l].Kg;
    //         this.arrcon[i].Docs.push(dataReporte[l]);
    //       }
    //       this.arrcon[i].Sacos = this.sacos;
    //       this.arrcon[i].Kg = this.kg;
    //     } else {
    //       this.iniciarTotales();
    //     }
    //   })
    // }
  }
  //Filtro por IdCliente y Estatus
  filtroEstatusTraspaso(estatus) {

    this.traspasoService.getReporteTraspasoBodegasEstatus(this.ReporteInformacion.bodegaOrigen, this.ReporteInformacion.bodegaDestino, estatus).subscribe(dataDocumentos => {
      console.log(dataDocumentos);
      if (dataDocumentos.length > 0) {
        this.iniciarTotales();
        for (let i = 0; i < dataDocumentos.length; i++) {
          this.arrcon[i] = dataDocumentos[i];
          this.kg = this.kg + +dataDocumentos[i].KilogramosTotales;
          this.sacos = this.sacos + +dataDocumentos[i].SacosTotales;
          this.arrcon[i].Docs = [];
          this.traspasoService.getDetalleTraspasoMercancia(dataDocumentos[i].IdTraspasoMercancia).subscribe(dataDetalle => {
            let sacos: number = 0;
            let kilos: number = 0;
            dataDetalle.forEach(element => {
              sacos = sacos + +element.Sacos;
              kilos = kilos + +element.PesoTotal;
              this.arrcon[i].Docs.push(element);
              this.arrcon[i].sac = sacos;
              this.arrcon[i].kil = kilos;
            });
          })
        }
      }
    })
    // type MyArrayType = Array<{IdClientes: number, Nombre: string}>;

    // const arr: MyArrayType = [
    //     {IdClientes: 0, Nombre: 'Traspaso'}
    // ];
    // console.log('FILTRO ESTATUS ID CLIENTE');
    // for (let i = 0; i < numero; i++) {
    //   this.arrcon[i] = arr[0];
    //   this.arrcon[i].Docs = [];
    //   //Obtener Reportes por Id Cliente
    //   this.ocService.getReporteClienteIdEstatus(id, estatus).subscribe(dataReporte => {
    //     if (dataReporte.length > 0) {
    //       console.log(dataReporte);
    //       this.iniciarTotales();
    //       for (let l = 0; l < dataReporte.length; l++) {
    //         this.sacos = this.sacos + +dataReporte[l].Sacos;
    //         this.kg = this.kg + +dataReporte[l].Kg;
    //         this.arrcon[i].Docs.push(dataReporte[l]);
    //       }
    //       this.arrcon[i].Sacos = this.sacos;
    //       this.arrcon[i].Kg = this.kg;
    //     } else {
    //       this.iniciarTotales();
    //     }
    //   })
    // }
  }

  //Filtro por IdProveedor, Tipo de Compra (Materia Prima), por Las Fechas y Estatus de la Compra 
  filtroEstatusFechaTraspaso(fechaInicial, fechaFinal, estatus) {

    let fecha1;
    let fecha2;

    let dia = this.ReporteInformacion.fechaInicial.getDate();
    let mes = this.ReporteInformacion.fechaInicial.getMonth() + 1;
    let anio = this.ReporteInformacion.fechaInicial.getFullYear();
    fecha1 = anio + '-' + mes + '-' + dia

    let dia2 = this.ReporteInformacion.fechaFinal.getDate();
    let mes2 = this.ReporteInformacion.fechaFinal.getMonth() + 1;
    let anio2 = this.ReporteInformacion.fechaFinal.getFullYear();
    fecha2 = anio2 + '-' + mes2 + '-' + dia2

    this.traspasoService.getReporteTraspasoBodegasFechasEstatus(this.ReporteInformacion.bodegaOrigen, this.ReporteInformacion.bodegaDestino, fecha1, fecha2, estatus).subscribe(dataDocumentos => {
      console.log(dataDocumentos);
      if (dataDocumentos.length > 0) {
        this.iniciarTotales();
        for (let i = 0; i < dataDocumentos.length; i++) {
          this.arrcon[i] = dataDocumentos[i];
          this.kg = this.kg + +dataDocumentos[i].KilogramosTotales;
          this.sacos = this.sacos + +dataDocumentos[i].SacosTotales;
          this.arrcon[i].Docs = [];
          this.traspasoService.getDetalleTraspasoMercancia(dataDocumentos[i].IdTraspasoMercancia).subscribe(dataDetalle => {
            let sacos: number = 0;
            let kilos: number = 0;
            dataDetalle.forEach(element => {
              sacos = sacos + +element.Sacos;
              kilos = kilos + +element.PesoTotal;
              this.arrcon[i].Docs.push(element);
              this.arrcon[i].sac = sacos;
              this.arrcon[i].kil = kilos;
            });
          })
        }
      }
    })

    // type MyArrayType = Array<{IdClientes: number, Nombre: string}>;

    // const arr: MyArrayType = [
    //     {IdClientes: 0, Nombre: 'Traspaso'}
    // ];

    // console.log('FILTRO TODO');

    // let fecha1;
    // let fecha2;

    // let dia = fechaInicial.getDate();
    // let mes = fechaInicial.getMonth() + 1;
    // let anio = fechaInicial.getFullYear();
    // fecha1 = anio + '-' + mes + '-' + dia

    // let dia2 = fechaFinal.getDate();
    // let mes2 = fechaFinal.getMonth() + 1;
    // let anio2 = fechaFinal.getFullYear();
    // fecha2 = anio2 + '-' + mes2 + '-' + dia2

    // for (let i = 0; i < numero; i++) {
    //   this.arrcon[i] = arr[0];
    //   this.arrcon[i].Docs = [];
    //   //Obtener Reportes por Id Cliente
    //   this.ocService.getReporteFechasClienteIdEstatus(fecha1, fecha2, id, estatus).subscribe(dataReporte => {
    //     if (dataReporte.length > 0) {
    //       console.log(dataReporte);
    //       this.iniciarTotales();
    //       for (let l = 0; l < dataReporte.length; l++) {
    //         this.sacos = this.sacos + +dataReporte[l].Sacos;
    //         this.kg = this.kg + +dataReporte[l].Kg;
    //         this.arrcon[i].Docs.push(dataReporte[l]);
    //       }
    //       this.arrcon[i].Sacos = this.sacos;
    //       this.arrcon[i].Kg = this.kg;
    //     } else {
    //       this.iniciarTotales();
    //     }
    //   })
    // }
  }



  obtenerReporteOrdenDescarga(numero: number, data: any) {
    this.arrcon = [];
    // ningun filtro
    if (this.reporteFechas == false && this.reporteEstatus == false) {
      this.filtroGeneralOrdenDescarga(numero, data);
    }
    //buscar reporte por Fechas
    else if (this.reporteFechas == true && this.reporteEstatus == false) {
      this.filtroFechaOrdenDescarga(numero, data, this.ReporteInformacion.fechaInicial, this.ReporteInformacion.fechaFinal);
    }
    //buscar reporte por Estatus 
    else if (this.reporteFechas == false && this.reporteEstatus == true) {
      this.filtroEstatusOrdenDescarga(numero, data, this.ReporteInformacion.tipoEstatus);
    }
    //buscar reporte por  Estatus y por Fechas
    else if (this.reporteFechas == true && this.reporteEstatus == true) {
      this.filtroEstatusFechaOrdenDescarga(numero, data, this.ReporteInformacion.fechaInicial, this.ReporteInformacion.fechaFinal, this.ReporteInformacion.tipoEstatus);
    }
  }


  //filtro por Id Proeveedor
  filtroGeneralOrdenDescarga(numero, data) {

    console.log('FILTRO GENERAL');
    for (let i = 0; i < numero; i++) {
      this.arrcon[i] = data[i];
      this.arrcon[i].Docs = [];
      //Obtener Reportes por Id Proveedor
      this.odService
        .getReporteProveedorId(data[i].IdProveedor)
        .subscribe((dataReporte) => {
          console.log(dataReporte);
          if (dataReporte.length > 0) {
            this.iniciarTotales();
            for (let l = 0; l < dataReporte.length; l++) {
              this.sacos = this.sacos + +dataReporte[l].Sacos;
              this.kg = this.kg + +dataReporte[l].Kg;
              this.arrcon[i].Docs.push(dataReporte[l]);
            }
            this.arrcon[i].Sacos = this.sacos;
            this.arrcon[i].Kg = this.kg;
          } else {
            this.iniciarTotales();
          }
        });
    }
  }
  //Filtro por IdProveedor y por Las Fechas 
  filtroFechaOrdenDescarga(numero, data, fechaInicial, fechaFinal) {

    console.log('FILTRO FECHA IDProveedor');
    let fecha1;
    let fecha2;

    let dia = fechaInicial.getDate();
    let mes = fechaInicial.getMonth() + 1;
    let anio = fechaInicial.getFullYear();
    fecha1 = anio + '-' + mes + '-' + dia

    let dia2 = fechaFinal.getDate();
    let mes2 = fechaFinal.getMonth() + 1;
    let anio2 = fechaFinal.getFullYear();
    fecha2 = anio2 + '-' + mes2 + '-' + dia2

    for (let i = 0; i < numero; i++) {
      this.arrcon[i] = data[i];
      this.arrcon[i].Docs = [];
      //Obtener Reportes por Id Proveedor
      this.odService.getReporteFechasProveedorId(fecha1, fecha2, data[i].IdProveedor).subscribe(dataReporte => {
        console.log(dataReporte);
        if (dataReporte.length > 0) {
          this.iniciarTotales();
          for (let l = 0; l < dataReporte.length; l++) {
            this.sacos = this.sacos + +dataReporte[l].Sacos;
            this.kg = this.kg + +dataReporte[l].Kg;
            this.arrcon[i].Docs.push(dataReporte[l]);
          }
          this.arrcon[i].Sacos = this.sacos;
          this.arrcon[i].Kg = this.kg;
        } else {
          this.iniciarTotales();
        }
      })
    }
  }
  //Filtro por IdProveedor y Estatus
  filtroEstatusOrdenDescarga(numero, data, estatus) {
    console.log('FILTRO ESTATUS ID Proveedor');
    for (let i = 0; i < numero; i++) {
      this.arrcon[i] = data[i];
      this.arrcon[i].Docs = [];
      //Obtener Reportes por Id Proveedor
      this.odService.getReporteProveedorIdEstatus(data[i].IdProveedor, estatus).subscribe(dataReporte => {
        console.log(dataReporte);
        if (dataReporte.length > 0) {
          this.iniciarTotales();
          for (let l = 0; l < dataReporte.length; l++) {
            this.sacos = this.sacos + +dataReporte[l].Sacos;
            this.kg = this.kg + +dataReporte[l].Kg;
            this.arrcon[i].Docs.push(dataReporte[l]);
          }
          this.arrcon[i].Sacos = this.sacos;
          this.arrcon[i].Kg = this.kg;
        } else {
          this.iniciarTotales();
        }
      })
    }
  }

  //Filtro por IdProveedor, Tipo de Compra (Materia Prima), por Las Fechas y Estatus de la Compra 
  filtroEstatusFechaOrdenDescarga(numero, data, fechaInicial, fechaFinal, estatus) {

    console.log('FILTRO TODO');

    let fecha1;
    let fecha2;

    let dia = fechaInicial.getDate();
    let mes = fechaInicial.getMonth() + 1;
    let anio = fechaInicial.getFullYear();
    fecha1 = anio + '-' + mes + '-' + dia

    let dia2 = fechaFinal.getDate();
    let mes2 = fechaFinal.getMonth() + 1;
    let anio2 = fechaFinal.getFullYear();
    fecha2 = anio2 + '-' + mes2 + '-' + dia2

    for (let i = 0; i < numero; i++) {
      this.arrcon[i] = data[i];
      this.arrcon[i].Docs = [];
      //Obtener Reportes por Id Proveedor
      this.odService.getReporteFechasProveedorIdEstatus(fecha1, fecha2, data[i].IdProveedor, estatus).subscribe(dataReporte => {
        console.log(dataReporte);
        if (dataReporte.length > 0) {
          this.iniciarTotales();
          for (let l = 0; l < dataReporte.length; l++) {
            this.sacos = this.sacos + +dataReporte[l].Sacos;
            this.kg = this.kg + +dataReporte[l].Kg;
            this.arrcon[i].Docs.push(dataReporte[l]);
          }
          this.arrcon[i].Sacos = this.sacos;
          this.arrcon[i].Kg = this.kg;
        } else {
          this.iniciarTotales();
        }
      })
    }
  }

  exportarXLS() {
    console.log('export a excel');
    if (this.ReporteInformacion.modulo == 'OrdenCarga') {
      this.sharedService.generarExcelReporteAlmacenOrdenCarga(this.arrcon, 'OrdenCarga');
    } else if (this.ReporteInformacion.modulo == 'OrdenDescarga') {
      this.sharedService.generarExcelReporteAlmacenOrdenDescarga(this.arrcon);
    } else if (this.ReporteInformacion.modulo == 'Inventario') {
      this.sharedService.generarExcelReporteAlmacenInventario(this.arrcon, this.reporteFechas);
    } else if (this.ReporteInformacion.modulo == 'Traspaso') {
      this.sharedService.generarExcelReporteImportacionTraspaso(this.arrcon);
    }
  }

  exportarPDF() {
    setTimeout(() => {
      // setTimeout(this.onExportClick,5)
      const content: Element = document.getElementById('pdfreporte');
      const option = {
        margin: [3, 0, 3, .5],
        filename: 'Reporte.pdf',
        image: { type: 'jpeg', quality: 0.5 },
        html2canvas: { scale: 2, logging: true, scrollY: -2, scrollX: -15 },
        jsPDF: { unit: 'cm', format: 'letter', orientation: 'portrait' },
        pagebreak: { avoid: '.pgbreak' }
      };

      html2pdf().from(content).set(option).toPdf().get('pdf').then(function (pdf) {
        let variableFormato = new formatoReporte();
        // console.log(variableFormato);
        var totalPages = pdf.internal.getNumberOfPages();
        pdf.setFontSize(10);
        pdf.setTextColor(70);
        for (var i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.addImage(variableFormato.header, "PNG", -3, 0, 25, 3)
          pdf.text('Pro lactoIngredientes S. de R.L. M.I. de C.V.', 1, 26);
          pdf.addImage(variableFormato.footer, "PNG", 18, 25, 2, 2);
        }
      }).save();
    }, 1000);
    setTimeout(() => { }, 1000);

  }

}
