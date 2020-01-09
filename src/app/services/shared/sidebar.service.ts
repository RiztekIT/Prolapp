import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any = [
    {
      titulo: 'Administracion',
      icono: 'fa fa-gear',
      submenu: [
        { titulo: 'Catalogos', url: '/catalogos' },
        { titulo: 'Permisos', url: '/show-usuario-permiso.component' },
        { titulo: 'Permisos', url: '/permisos' },
        { titulo: 'Empresa', url: '/empresa' },
      ],
      url: '/catalogos',
    },
    {
      titulo: 'Ventas',
      icono: 'fa fa-money',
      submenu: [
        { titulo: 'Pedidos', url: '/pedidosVentas' },
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
        { titulo: 'Pedidos', url: '/pedidosalmacen' },
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
  ];

  constructor() { }
}
