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
        // { titulo: 'Dashboard', url: '/dashboard' },
        { titulo: 'Clientes', url: '/dashboard' },
        { titulo: 'Proveedores', url: '/dashboard' },
        { titulo: 'Productos', url: '/dashboard' },
        { titulo: 'Usuarios', url: '/dashboard' },
        // { titulo: 'Promesas', url: '/promesas' },
        // { titulo: 'Graficas', url: '/graficas1' }
      ],
      url: '/dashboard',
    },
    {
      titulo: 'Ventas',
      icono: 'fa fa-money',
      submenu: [
        // { titulo: 'Dashboard', url: '/dashboard' },
        { titulo: 'Pedidos', url: '/dashboard' },
        { titulo: 'Calendario', url: '/dashboard' },
        { titulo: 'Reportes', url: '/dashboard' },
        { titulo: 'Graficos', url: '/dashboard' },
      ],
       url: '/dashboard',
    },
    {
      titulo: 'Compras',
      icono: 'fa fa-shopping-cart',
      submenu: [
        // { titulo: 'Dashboard', url: '/dashboard' },
        { titulo: 'Compras', url: '/dashboard' },
        { titulo: 'Calendario', url: '/dashboard' },
        { titulo: 'Reportes', url: '/dashboard' },
        { titulo: 'Graficos', url: '/dashboard' },
      ],
       url: '/dashboard',
    },
    {
      titulo: 'Importacion',
      icono: 'fa fa-plane',
      submenu: [
        // { titulo: 'Dashboard', url: '/dashboard' },
        { titulo: 'Embarque', url: '/dashboard' },
        { titulo: 'Documentacion', url: '/dashboard' },
        { titulo: 'Calendario', url: '/dashboard' },
        { titulo: 'Reportes', url: '/dashboard' },
        { titulo: 'Graficos', url: '/dashboard' },
      ],
       url: '/dashboard',
    },
    {
      titulo: 'Trafico',
      icono: 'fa fa-truck',
      submenu: [
        // { titulo: 'Dashboard', url: '/dashboard' },
        { titulo: 'Pedidos', url: '/dashboard' },
        { titulo: 'Facturacion Fletes', url: '/dashboard' },
        { titulo: 'Calendario', url: '/dashboard' },
        { titulo: 'Reportes', url: '/dashboard' },
        { titulo: 'Graficos', url: '/dashboard' },
      ],
       url: '/dashboard',
    },
    {
      titulo: 'Calidad',
      icono: 'fa fa-star-o',
      submenu: [
        // { titulo: 'Dashboard', url: '/dashboard' },
        { titulo: 'Incidencias', url: '/dbcalidad' },
        { titulo: 'Evidencias', url: '/dbcalidad' },
        { titulo: 'Calendario', url: '/dbcalidad' },
        { titulo: 'Reportes', url: '/reportescalidad' },
        { titulo: 'Graficos', url: '/graficoscalidad' },
      ],
       url: '/dbcalidad',
    },
    {
      titulo: 'Cuentas por Cobrar',
      icono: 'fa fa-archive',
      submenu: [
        // { titulo: 'Dashboard', url: '/dashboard' },
        { titulo: 'Pedidos', url: '/dashboard' },
        { titulo: 'Facturacion', url: '/dashboard' },
        { titulo: 'Polizas', url: '/dashboard' },
        { titulo: 'Saldos de Cuentas', url: '/dashboard' },
        { titulo: 'Calendario', url: '/dashboard' },
        { titulo: 'Reportes', url: '/dashboard' },
        { titulo: 'Graficos', url: '/dashboard' },
      ],
       url: '/dashboard',
    },
    {
      titulo: 'Cuentas por Pagar',
      icono: 'fa fa-suitcase',
      submenu: [
        // { titulo: 'Dashboard', url: '/dashboard' },
        { titulo: 'Pagos', url: '/dashboard' },
        { titulo: 'Polizas', url: '/dashboard' },
        { titulo: 'Saldos de Cuentas', url: '/dashboard' },
        { titulo: 'Fordwards', url: '/dashboard' },
        { titulo: 'Calendario', url: '/dashboard' },
        { titulo: 'Reportes', url: '/dashboard' },
        { titulo: 'Graficos', url: '/dashboard' },
      ],
       url: '/dashboard',
    },
    {
      titulo: 'Almacen',
      icono: 'fa fa-square-o',
      submenu: [
        // { titulo: 'Dashboard', url: '/dashboard' },
        { titulo: 'Pedidos', url: '/dashboard' },
        { titulo: 'Importaciones', url: '/dashboard' },
        { titulo: 'Inventarios', url: '/dashboard' },
        { titulo: 'Documentos', url: '/dashboard' },
        { titulo: 'Incidencias', url: '/dashboard' },
        { titulo: 'Calendario', url: '/dashboard' },
        { titulo: 'Reportes', url: '/dashboard' },
        { titulo: 'Graficos', url: '/dashboard' },
      ],
       url: '/dashboard',
    },
    {
      titulo: 'Direccion',
      icono: 'fa fa-institution',
      submenu: [
        // { titulo: 'Dashboard', url: '/dashboard' },
        { titulo: 'Calendario', url: '/dashboard' },
        { titulo: 'Reportes', url: '/dashboard' },
        { titulo: 'Graficos', url: '/dashboard' },
      ],
       url: '/dashboard',
    }
  ];

  constructor() { }
}
