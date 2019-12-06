import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {HttpClientModule} from '@angular/common/http';



import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { PAGES_ROUTES } from './pages.routes';
import { IngrementadorComponent } from '../components/ingrementador/ingrementador.component';
import { ChartsModule } from 'ng2-charts';
import { GraficoDonaComponent } from '../components/grafico-dona/grafico-dona.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { DbcalidadComponent } from './calidad/dbcalidad/dbcalidad.component';
import { ReportesComponent } from './calidad/reportes/reportes.component';
import { GraficosComponent } from './calidad/graficos/graficos.component';
import { CommonModule } from '@angular/common';
import { CalendarioComponent } from '../components/calendario/calendario.component';
import { CalendarioCalidadComponent } from './calidad/calendario-calidad/calendario-calidad.component';
import { GraficasVentasComponent } from './ventas/graficas-ventas/graficas-ventas.component';
import { DashboardVentasComponent } from './ventas/dashboard-ventas/dashboard-ventas.component';
import { PedidoVentasComponent } from './ventas/pedido-ventas/pedido-ventas.component';
import { PedidoTraficoComponent } from './trafico/pedido-trafico/pedido-trafico.component';
import { FormatofacturaTraficoComponent } from './trafico/formatofactura-trafico/formatofactura-trafico.component';
import { DashboardTraficoComponent } from './trafico/dashboard-trafico/dashboard-trafico.component';
import { ReporteComprasComponent } from './compras/reporte-compras/reporte-compras.component';
import { DashboardComprasComponent } from './compras/dashboard-compras/dashboard-compras.component';
import { GraficasComprasComponent } from './compras/graficas-compras/graficas-compras.component';
import { FormatoComprasComprasComponent } from './compras/formato-compras-compras/formato-compras-compras.component';
import { DashboardImportacionComponent } from './importacion/dashboard-importacion/dashboard-importacion.component';
// tslint:disable-next-line: max-line-length
import { ReportesVentasComponent } from './ventas/reportes-ventas/reportes-ventas.component';
import { ReporteTraficoComponent } from './trafico/reporte-trafico/reporte-trafico.component';
import { LecheHistorialComponent } from '../components/leche-historial/leche-historial.component';
import { StockComponent } from '../components/stock/stock.component';
import { TipoCambioComponent } from '../components/tipo-cambio/tipo-cambio.component';
import { GaleriaComponent } from '../components/galeria/galeria.component';
import { TrackingPedidoComponent } from '../components/tracking-pedido/tracking-pedido.component';
import { DireccionComponent } from './direccion/direccion-dashboard/direccion.component';
import { IncidenciasComponent } from './calidad/incidencias/incidencias.component';
import { EvidenciasComponent } from './calidad/evidencias/evidencias.component';
import { CalendarioVentasComponent } from './ventas/calendario-ventas/calendario-ventas.component';
import { ProfileComponent } from '../components/profile/profile.component';
import { DireccionCalendarioComponent } from './direccion/direccion-calendario/direccion-calendario.component';
import { DireccionReportesComponent } from './direccion/direccion-reportes/direccion-reportes.component';
import { CalendarioTraficoComponent } from './trafico/calendario-trafico/calendario-trafico.component';
import { CatalogosComponent } from './administracion/catalogos/catalogos.component';
import { PermisosComponent } from './administracion/permisos/permisos.component';
import { AgendaComponent } from './calidad/agenda/agenda.component';
import { CalendarioImportacionComponent } from './importacion/calendario-importacion/calendario-importacion.component';
import { ReportesImportacionComponent } from './importacion/reportes-importacion/reportes-importacion.component';
import { EmbarqueImportacionComponent } from './importacion/embarque-importacion/embarque-importacion.component';
import { DocumentacionImportacionComponent } from './importacion/documentacion-importacion/documentacion-importacion.component';
import { QuejasComponent } from './calidad/quejas/quejas.component';
import { CalendarioComprasComponent } from './compras/calendario-compras/calendario-compras.component';
import { PedidoscxcComponent } from './cxc/pedidoscxc/pedidoscxc.component';
import { FacturacioncxcComponent } from './cxc/facturacioncxc/facturacioncxc.component';
import { PolizascxcComponent } from './cxc/polizascxc/polizascxc.component';
import { SaldoscxcComponent } from './cxc/saldoscxc/saldoscxc.component';
import { CalendariocxcComponent } from './cxc/calendariocxc/calendariocxc.component';
import { ReportescxcComponent } from './cxc/reportescxc/reportescxc.component';
import { DbcxcComponent } from './cxc/dbcxc/dbcxc.component';
import { PagoscxpComponent } from './cxp/pagoscxp/pagoscxp.component';
import { PolizascxpComponent } from './cxp/polizascxp/polizascxp.component';
import { ForwardscxpComponent } from './cxp/forwardscxp/forwardscxp.component';
import { CalendariocxpComponent } from './cxp/calendariocxp/calendariocxp.component';
import { ReportescxpComponent } from './cxp/reportescxp/reportescxp.component';
import { SaldoscxpComponent } from './cxp/saldoscxp/saldoscxp.component';
import { DashboardcxpComponent } from './cxp/dashboardcxp/dashboardcxp.component';
import { DbalmacenComponent } from './almacen/dbalmacen/dbalmacen.component';
import { PedidosalmacenComponent } from './almacen/pedidosalmacen/pedidosalmacen.component';
import { ImportacionesalmacenComponent } from './almacen/importacionesalmacen/importacionesalmacen.component';
import { InventariosalmacenComponent } from './almacen/inventariosalmacen/inventariosalmacen.component';
import { DocumentosalmacenComponent } from './almacen/documentosalmacen/documentosalmacen.component';
import { IncidenciasalmacenComponent } from './almacen/incidenciasalmacen/incidenciasalmacen.component';
import { CalendarioalmacenComponent } from './almacen/calendarioalmacen/calendarioalmacen.component';
import { ReportesalmacenComponent } from './almacen/reportesalmacen/reportesalmacen.component';
import { UsuariosServieService } from '../services/catalogos/usuarios/usuarios-servie.service';
import { UsuariosComponent } from './administracion/catalogos/usuarios/usuarios.component';
import { ProductosComponent } from './administracion/catalogos/productos/productos.component';
import { ProveedoresComponent } from './administracion/catalogos/proveedores/proveedores.component';
import { ClientesComponent } from './administracion/catalogos/clientes/clientes.component';



@NgModule({
    declarations: [
        PagesComponent,
        DashboardComponent,
        ProgressComponent,
        Graficas1Component,
        IngrementadorComponent,
        GraficoDonaComponent,
        AccountSettingsComponent,
        PromesasComponent,
        DbcalidadComponent,
        ReportesComponent,
        GraficosComponent,
        CalendarioComponent,
        CalendarioCalidadComponent,
        GraficasVentasComponent,
        DashboardVentasComponent,
        PedidoVentasComponent,
        PedidoTraficoComponent,
        FormatofacturaTraficoComponent,
        DashboardTraficoComponent,
        ReporteComprasComponent,
        DashboardComprasComponent,
        GraficasComprasComponent,
        FormatoComprasComprasComponent,
        DashboardImportacionComponent,
        ReportesVentasComponent,
        ReporteTraficoComponent,
        LecheHistorialComponent,
        StockComponent,
        TipoCambioComponent,
        GaleriaComponent,
        TrackingPedidoComponent,
        DireccionComponent,
        IncidenciasComponent,
        EvidenciasComponent,
        CalendarioVentasComponent,
        ProfileComponent,
        DireccionCalendarioComponent,
        DireccionReportesComponent,
        CalendarioTraficoComponent,
        CatalogosComponent,
        PermisosComponent,
        AgendaComponent,
        CalendarioComprasComponent,
        CalendarioImportacionComponent,
        ReportesImportacionComponent,
        EmbarqueImportacionComponent,
        DocumentacionImportacionComponent,
        QuejasComponent,
        PedidoscxcComponent,
        FacturacioncxcComponent,
        PolizascxcComponent,
        SaldoscxcComponent,
        CalendariocxcComponent,
        ReportescxcComponent,
        DbcxcComponent,
        PagoscxpComponent,
        PolizascxpComponent,
        ForwardscxpComponent,
        CalendariocxpComponent,
        ReportescxpComponent,
        SaldoscxpComponent,
        DashboardcxpComponent,
        DbalmacenComponent,
        PedidosalmacenComponent,
        ImportacionesalmacenComponent,
        InventariosalmacenComponent,
        DocumentosalmacenComponent,
        IncidenciasalmacenComponent,
        CalendarioalmacenComponent,
        ReportesalmacenComponent,
        UsuariosComponent,
        ProductosComponent,
        ProveedoresComponent,
        ClientesComponent
    ],
    exports: [
        DashboardComponent,
        ProgressComponent,
        Graficas1Component
    ],
    imports: [
        PAGES_ROUTES,
        SharedModule,
        FormsModule,
        ChartsModule,
        CommonModule
    ],
    providers: [
        UsuariosServieService
    ],
    entryComponents: [

    ]
})
export class PagesModule { }
