import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { FormatoImportacionImportacionComponent } from './importacion/formato-importacion-importacion/formato-importacion-importacion.component';
import { SubirArchivosImportacionComponent } from './importacion/subir-archivos-importacion/subir-archivos-importacion.component';
import { ReportesVentasComponent } from './ventas/reportes-ventas/reportes-ventas.component';
import { ReporteTraficoComponent } from './trafico/reporte-trafico/reporte-trafico.component';
import { LecheHistorialComponent } from '../components/leche-historial/leche-historial.component';
import { StockComponent } from '../components/stock/stock.component';
import { TipoCambioComponent } from '../components/tipo-cambio/tipo-cambio.component';
import { GaleriaComponent } from '../components/galeria/galeria.component';
import { TrackingPedidoComponent } from '../components/tracking-pedido/tracking-pedido.component';
import { DireccionComponent } from './direccion/direccion.component';
import { IncidenciasComponent } from './calidad/incidencias/incidencias.component';
import { EvidenciasComponent } from './calidad/evidencias/evidencias.component';
import { CalendarioVentasComponent } from './ventas/calendario-ventas/calendario-ventas.component';


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
        FormatoImportacionImportacionComponent,
        SubirArchivosImportacionComponent,
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
        CalendarioVentasComponent
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
    ]
})
export class PagesModule { }
