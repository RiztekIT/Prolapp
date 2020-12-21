import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ClientesService } from '../catalogos/clientes.service';
import { DatePipe } from '@angular/common';
import { StorageServiceService } from './storage-service.service';
import { Observable } from 'rxjs';
import { UsuariosServieService } from '../catalogos/usuarios-servie.service';

export const APIUrl = environment.APIUrl;
// export const APIUrl = "https://localhost:44361/api";
declare function init_plugins();

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu =  Array<menutipo>();
  submenu: Array<submenutipo>;
  privilegios: Array<privilegios>;

  idusuario: number
  usuario: any


  /* menu: any = [
    {
      titulo: 'Administracion',
      icono: 'fa fa-gear',
      submenu: [
        { titulo: 'Catalogos', url: '/catalogos' },
        { titulo: 'Permisos', url: '/permisos' },
        { titulo: 'Empresa', url: '/empresa' },
        { titulo: 'Expediente', url: '/expediente' },
        { titulo: 'Unidad Medida', url: '/unidadMedida' },
      ],
      url: '/catalogos',
    },
    {
      titulo: 'Ventas',
      icono: 'fa fa-money',
      submenu: [
        { titulo: 'Prospecto', url: '/prospectoVentas' },
        { titulo: 'Cotizaciones', url: '/cotizacionesVentas' },
        { titulo: 'Orden de Compra', url: '/pedidosVentas' },
        { titulo: 'Calendario', url: '/calendarioVentas' },
        { titulo: 'Reportes', url: '/reportesVentas' },
        // { titulo: 'Graficos', url: '/dashboard' },
      ],
       url: '/dashboardVentas',
    },
    {
      titulo: 'Compras',
      icono: 'fa fa-shopping-cart',
      submenu: [
        // { titulo: 'Dashboard', url: '/dashboard' },
        { titulo: 'Compras', url: '/formatoCompras' },
        { titulo: 'Calendario', url: '/calendarioCompras' },
        { titulo: 'Reportes', url: '/reportesCompras' },
        // { titulo: 'Graficos', url: '/graficosCompras' },
      ],
       url: '/dashboardCompras',
    },
    {
      titulo: 'Importacion',
      icono: 'fa fa-plane',
      submenu: [
        { titulo: 'Embarque', url: '/embarqueImportacion' },
        { titulo: 'Documentacion', url: '/documentacionImportacion' },
        { titulo: 'Calendario', url: '/calendarioImportacion' },
        { titulo: 'Reportes', url: '/reportesImportacion' },
      ],
       url: '/dashboardImportacion',
    },
    {
      titulo: 'Trafico',
      icono: 'fa fa-truck',
      submenu: [
        // { titulo: 'Dashboard', url: '/dashboard' },
        { titulo: 'Pedidos', url: '/pedidosTrafico' },
        // { titulo: 'Facturacion Fletes', url: '/formatoFacturaTrafico' },
        { titulo: 'Calendario', url: '/calendarioTrafico' },
        { titulo: 'Reportes', url: '/reportesTrafico' },
        // { titulo: 'Graficos', url: '/dashboard' },
      ],
       url: '/dashboardTrafico',
    },
    {
      titulo: 'Calidad',
      icono: 'fa fa-star-o',
      submenu: [
        // { titulo: 'Dashboard', url: '/dashboard' },
        { titulo: 'Incidencias', url: '/incidencias' },
        { titulo: 'Evidencias', url: '/evidencias' },
        { titulo: 'Calendario', url: '/calendario_calidad' },
        { titulo: 'Reportes', url: '/reportescalidad' },
        // { titulo: 'Graficos', url: '/graficoscalidad' },
      ],
       url: '/dbcalidad',
    },
    {
      titulo: 'Cuentas por Cobrar',
      icono: 'fa fa-archive',
      submenu: [
        // { titulo: 'Dashboard', url: '/dashboard' },
        { titulo: 'Pedidos', url: '/pedidosCxc' },
        { titulo: 'Facturacion', url: '/facturacionCxc' },
        { titulo: 'Complemento de Pago', url: '/complementopagoCxc' },
        { titulo: 'Notas de Credito', url: '/notasCreditocxc' },
        { titulo: 'Polizas', url: '/polizasCxc' },
        { titulo: 'Saldos de Cuentas', url: '/saldosCxc' },
        { titulo: 'Calendario', url: '/calendarioCxc' },
        { titulo: 'Reportes', url: '/reportesCxc' },
        // { titulo: 'Graficos', url: '/dashboard' },
      ],
       url: '/dashboardCxc',
    },
    {
      titulo: 'Cuentas por Pagar',
      icono: 'fa fa-suitcase',
      submenu: [
        // { titulo: 'Dashboard', url: '/dashboard' },
        { titulo: 'Pagos', url: '/pagosCxp' },
        { titulo: 'Polizas', url: '/polizasCxp' },
        { titulo: 'Saldos de Cuentas', url: '/saldosCxp' },
        { titulo: 'Forwards', url: '/forwardsCxp' },
        { titulo: 'Calendario', url: '/calendarioCxp' },
        { titulo: 'Reportes', url: '/reportesCxp' },
        // { titulo: 'Graficos', url: '/dashboard' },
      ],
       url: '/dashboardCxp',
    },
    {
      titulo: 'Almacen',
      icono: 'fa fa-square-o',
      submenu: [
        // { titulo: 'Dashboard', url: '/dashboard' },
        { titulo: 'Orden de carga', url: '/pedidosalmacen' },
        { titulo: 'Orden de descarga', url: '/ordendescarga' },
        { titulo: 'Importaciones', url: '/importacionesalmacen' },
        { titulo: 'Inventarios', url: '/inventariosalmacen' },
        { titulo: 'Documentos', url: '/documentosalmacen' },
        { titulo: 'Incidencias', url: '/Incidenciasalmacen' },
        { titulo: 'Calendario', url: '/calendarioalmacen' },
        { titulo: 'Reportes', url: '/reportesalmacen' },
        // { titulo: 'Graficos', url: '/dashboard' },
      ],
       url: '/dashboardalmacen',
    },
    {
      titulo: 'Direccion',
      icono: 'fa fa-institution',
      submenu: [
        // { titulo: 'Dashboard', url: '/dashboard' },
        { titulo: 'Calendario', url: '/direccion-calendario' },
        { titulo: 'Reportes', url: '/direccion-reportes' },
        // { titulo: 'Graficos', url: '/dashboard' },
      ],
       url: '/direccion',
    }
  ]; */

  sessionCliente: any

  constructor(private http:HttpClient,public service: ClientesService,private datePipe: DatePipe, private storageServce: StorageServiceService,
    private usuarioService: UsuariosServieService,
    ) { 
    this.menu = [];
    this.sessionCliente = localStorage.getItem("inicioCliente");
    // console.log('this.sessionCliente = localStorage.getItem("inicioCliente"): ', this.sessionCliente = localStorage.getItem("inicioCliente"));
    if (this.sessionCliente == 'true') {
    this.getMenucliente();
    } else {
      // console.log('Constructor SideBar');
    this.getMenu();
  }
    
  }
  getMenu() {

    let u = JSON.parse(localStorage.getItem('ProlappSession'));
    // console.log('%c⧭', 'color: #ff0000', u);
    this.usuario = u

    
    this.usuarioService.getUsuarioNombreU(this.usuario.user).subscribe(res => {
      // console.log('%c⧭', 'color: #f200e2', res);
      this.idusuario = res[0].IdUsuario
      // console.log('%c⧭', 'color: #00ff00', this.idusuario);
    //! Obtener el Id Usuario del Usuario LOGEADO!
    return this.http.get(APIUrl + '/Menu/'+this.idusuario).subscribe((data:any)=>{
      // console.log(data);
      this.menu = [];
      
      for (let i=0; i< data.length; i++){
        this.menu[i] = {
          "titulo":data[i].titulo,
          "icono":data[i].icono,
          "url":data[i].url
        }
       
        this.menu[i].submenu = [];
        // console.log(this.menu);
        

        // console.log(data[i].idmenu);
        // console.log(this.menu);
        // this.menu[i].submenu
        //! Obtener el Id Usuario del Usuario LOGEADO!
        this.http.get(APIUrl+ '/Menu/Submenu/'+this.idusuario+'/'+data[i].idmenu+'/'+data[i].titulo).subscribe((submenu:any)=>{
          // console.log(data[i].idmenu);
          // console.log(submenu);
          this.submenu = [];
          this.privilegios = [];
          
          this.menu[i].submenu = []
          for (let j=0; j< submenu.length; j++){
            this.menu[i].submenu[j] = {
              "titulo" : submenu[j].titulo,
              "url": submenu[j].url
            }
            this.menu[i].submenu[j].privilegios = [];
            //! Obtener el Id Usuario del Usuario LOGEADO!
            this.http.get(APIUrl + '/Menu/ObtenerPrivilegios/'+this.idusuario+'/'+data[i].titulo+'/'+submenu[j].titulo).subscribe((resPrivilegios:any)=>{
              if(resPrivilegios){
                for (let a=0; a< resPrivilegios.length; a++){
                  this.menu[i].submenu[j].privilegios[a] = {
                    // IdProceso: resPrivilegios[0].IdProcesos,
                    // idPrivilegio: resPrivilegios[0].IdPrivilegios,
                    // idUsuario: resPrivilegios[0].IdUsuario,
                    // area: resPrivilegios[0].Area,
                    nombreProceso: resPrivilegios[a].NombreProceso
                    // modulo: resPrivilegios[0].Modulo
                  }
                }
                // this.menu[i].submenu[j].privilegios[0].IdProceso = resPrivilegios[0].IdProcesos;
                // this.menu[i].submenu[j].privilegios[0].idPrivilegio = resPrivilegios[0].IdPrivilegios;
                // this.menu[i].submenu[j].privilegios[0].idUsuario = resPrivilegios[0].IdUsuario;
                // this.menu[i].submenu[j].privilegios[0].area = resPrivilegios[0].Area;
                // this.menu[i].submenu[j].privilegios[0].nombreProceso = resPrivilegios[0].NombreProceso;
                // this.menu[i].submenu[j].privilegios[0].modulo = resPrivilegios[0].Modulo;
              }
              localStorage.setItem('Permisos', JSON.stringify(this.menu));
            })
          }       
          // console.log('%c⧭', 'color: #09ee2f', this.menu);
          // console.log(this.menu);
        })
      }
      // console.warn(this.menu);
      init_plugins();
 
    });
    });
  }


  // getMenus(): Observable<any[]> {
  //   return this.http.get<any[]>(APIUrl + '/Menu/1');
  // }
  //  getSubmenus(idmenu, titulo): Observable<any[]> {
  //   return this.http.get<any[]>(APIUrl + '/Menu/Submenu/1/'+idmenu+'/'+titulo);
  // }
  // getPermisos(idmenu, titulo, area): Observable<any[]> {
  //   return this.http.get<any[]>(APIUrl + '/Menu/ObtenerPrivilegios/1/'+idmenu+'/'+titulo+'/'+area);
  // }

  // getPrivilegios(): Observable<any[]>{
  //   localStorage.setItem('Permisos', JSON.stringify(this.menu));
  //   return; 
  // }
  
  // getDetalleOrdenCargaList(id: number): Observable<OrdenCarga[]> {
  //   return this.http.get<OrdenCarga[]>(APIUrl + '/OrdenCarga/DetalleOrdenCarga/' + id);
  // }
  


getMenucliente(){

  this.menu = [
    {
      titulo: 'Cliente',
      icono: 'account_circle',
      submenu: [
        { titulo: 'Facturacion', url: '/facturacion' },
        { titulo: 'Orden de Compra', url: '/ordendecompra' },
        { titulo: 'Tracking', url: '/trackingcliente' },
        { titulo: 'Complemento de Pago', url: '/complementodepago' },
        // { titulo: 'Facturacion', url: '/catalogos' },
        // { titulo: 'Orden de Compra', url: '/permisos' },
      ],
      url: '/cliente',
    },
  ]
  // console.warn(this.menu);

  init_plugins();
}







  //funcionando con un solo usuario
//   getMenu() {

//     return this.http.get(APIUrl + '/Menu/1').subscribe((data:any)=>{
//       console.log(data);
//       this.menu = [];
      
//       for (let i=0; i< data.length; i++){
//         this.menu[i] = {
//           "titulo":data[i].titulo,
//           "icono":data[i].icono,
//           "url":data[i].url
//         }
      
//         this.menu[i].submenu = [];
// // console.log(this.menu);
        

//         // console.log(data[i].idmenu);
//         // console.log(this.menu);
//         // this.menu[i].submenu
//         this.http.get(APIUrl+ '/Menu/Submenu/1/'+data[i].idmenu).subscribe((submenu:any)=>{
//           // console.log(data[i].idmenu);
//           // console.log(submenu);
//           this.submenu = [];

//           this.menu[i].submenu = []
//           for (let j=0; j< submenu.length; j++){
//             this.menu[i].submenu[j] = {
//               "titulo" : submenu[j].titulo,
//               "url": submenu[j].url
//             }
//           }


        



//         })




       
//       }
      
     
//       // console.log(this.menu);
//       init_plugins();

//     });
//   }


  // public loadScript() { 
  //   let body = <HTMLDivElement> document.body; 
  //   let script = document.createElement('script'); 
  //   script.innerHTML = ''; 
  //   script.src = './comslider2056140/comsliderd.js?timestamp=1586825732'; 
  //   script.async = true; 
  //   script.defer = true; 
  //   body.appendChild(script); 
  // } 



}


export interface menutipo{
  titulo:string;
  icono:string;
  url:string;
  submenu?:Array<submenutipo>
}
export interface submenutipo{
  titulo:string;
  url:string;
  privilegios?:Array<privilegios>
}

export interface privilegios {
  // idPrivilegio: number,
  // idUsuario: number,
  // IdProceso: number,
  nombreProceso: string
  // area: string
  // modulo: string

}
