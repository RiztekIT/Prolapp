import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { DbcalidadComponent } from './calidad/dbcalidad/dbcalidad.component';
import { ReportesComponent } from './calidad/reportes/reportes.component';
import { GraficosComponent } from './calidad/graficos/graficos.component';
import { CalendarioCalidadComponent } from './calidad/calendario-calidad/calendario-calidad.component';
import { DireccionComponent } from './direccion/direccion-dashboard/direccion.component';
import { DireccionReportesComponent } from './direccion/direccion-reportes/direccion-reportes.component';
import { DireccionCalendarioComponent } from './direccion/direccion-calendario/direccion-calendario.component';
import { IncidenciasComponent } from './calidad/incidencias/incidencias.component';
import { ReportesVentasComponent } from './ventas/reportes-ventas/reportes-ventas.component';
import { PedidoVentasComponent } from './ventas/pedido-ventas/pedido-ventas.component';
import { EvidenciasComponent } from './calidad/evidencias/evidencias.component';
import { DashboardVentasComponent } from './ventas/dashboard-ventas/dashboard-ventas.component';
import { CalendarioVentasComponent } from './ventas/calendario-ventas/calendario-ventas.component';
import { ProfileComponent } from '../components/profile/profile.component';
import { PedidoTraficoComponent } from './trafico/pedido-trafico/pedido-trafico.component';
import { ReporteTraficoComponent } from './trafico/reporte-trafico/reporte-trafico.component';
import { FormatofacturaTraficoComponent } from './trafico/formatofactura-trafico/formatofactura-trafico.component';
import { DashboardTraficoComponent } from './trafico/dashboard-trafico/dashboard-trafico.component';
import { CalendarioTraficoComponent } from './trafico/calendario-trafico/calendario-trafico.component';
import { CatalogosComponent } from './administracion/catalogos/catalogos.component';
import { ShowUsuarioPermisoComponent } from './administracion/permisos/show-usuario-permiso/show-usuario-permiso.component';
import { DashboardComprasComponent } from './compras/dashboard-compras/dashboard-compras.component';
import { ReporteComprasComponent } from './compras/reporte-compras/reporte-compras.component';
import { GraficasComprasComponent } from './compras/graficas-compras/graficas-compras.component';
import { FormatoComprasComprasComponent } from './compras/formato-compras-compras/formato-compras-compras.component';
import { CalendarioComprasComponent } from './compras/calendario-compras/calendario-compras.component';
import { DashboardImportacionComponent } from './importacion/dashboard-importacion/dashboard-importacion.component';
import { DocumentacionImportacionComponent } from './importacion/documentacion-importacion/documentacion-importacion.component';
import { EmbarqueImportacionComponent } from './importacion/embarque-importacion/embarque-importacion.component';
import { ReportesImportacionComponent } from './importacion/reportes-importacion/reportes-importacion.component';
import { CalendarioImportacionComponent } from './importacion/calendario-importacion/calendario-importacion.component';
import { QuejasComponent } from './calidad/quejas/quejas.component';
import { CalendariocxcComponent } from './cxc/calendariocxc/calendariocxc.component';
import { FacturacioncxcComponent } from './cxc/facturacioncxc/facturacioncxc.component';
import { PedidoscxcComponent } from './cxc/pedidoscxc/pedidoscxc.component';
import { PolizascxcComponent } from './cxc/polizascxc/polizascxc.component';
import { ReportescxcComponent } from './cxc/reportescxc/reportescxc.component';
import { SaldoscxcComponent } from './cxc/saldoscxc/saldoscxc.component';
import { DbcxcComponent } from './cxc/dbcxc/dbcxc.component';
import { DashboardcxpComponent } from './cxp/dashboardcxp/dashboardcxp.component';
import { PagoscxpComponent } from './cxp/pagoscxp/pagoscxp.component';
import { PolizascxpComponent } from './cxp/polizascxp/polizascxp.component';
import { SaldoscxpComponent } from './cxp/saldoscxp/saldoscxp.component';
import { ForwardscxpComponent } from './cxp/forwardscxp/forwardscxp.component';
import { CalendariocxpComponent } from './cxp/calendariocxp/calendariocxp.component';
import { ReportescxpComponent } from './cxp/reportescxp/reportescxp.component';
import { DbalmacenComponent } from './almacen/dbalmacen/dbalmacen.component';
import { PedidosalmacenComponent } from './almacen/pedidosalmacen/pedidosalmacen.component';
import { ImportacionesalmacenComponent } from './almacen/importacionesalmacen/importacionesalmacen.component';
import { InventariosalmacenComponent } from './almacen/inventariosalmacen/inventariosalmacen.component';
import { DocumentosalmacenComponent } from './almacen/documentosalmacen/documentosalmacen.component';
import { IncidenciasalmacenComponent } from './almacen/incidenciasalmacen/incidenciasalmacen.component';
import { CalendarioalmacenComponent } from './almacen/calendarioalmacen/calendarioalmacen.component';
import { ReportesalmacenComponent } from './almacen/reportesalmacen/reportesalmacen.component';
import { FacturacioncxcAddComponent } from './cxc/facturacioncxc/facturacioncxc-add/facturacioncxc-add.component';
import { AuthorizatedGuard } from './auth'
import { LoginguardGuard } from '../services/shared/loginguard.guard';
import { ComplementopagocxcComponent } from './cxc/complementopagocxc/complementopagocxc.component';
import { EmpresaComponent } from './administracion/empresa/empresa.component';
import { ReciboPagoComponent } from './cxc/complementopagocxc/recibo-pago/recibo-pago.component';
import { ExpedienteComponent } from './administracion/expediente/expediente.component';
import { PedidoventasAddComponent } from './ventas/pedido-ventas/pedidoventas-add/pedidoventas-add/pedidoventas-add.component';
import { OrdencargadetalleComponent } from './almacen/pedidosalmacen/ordencargadetalle/ordencargadetalle.component';
import { OrdendescargaComponent } from './almacen/ordendescarga/ordendescarga.component';
import { UnidadMedidaComponent } from './administracion/unidad-medida/unidad-medida.component';
import { NotaCreditocxcComponent } from './cxc/nota-creditocxc/nota-creditocxc.component';
import { CotizacionesVentasComponent } from '../pages/ventas/cotizaciones-ventas/cotizaciones-ventas.component';
import { AddCotizacionComponent } from './ventas/cotizaciones-ventas/add-cotizacion/add-cotizacion.component';
import { PrepararComponent } from './almacen/pedidosalmacen/ordencargadetalle/preparar/preparar.component';
import { CargarComponent } from './almacen/pedidosalmacen/ordencargadetalle/cargar/cargar.component';
import { EnviarOrdenCargaComponent } from './almacen/pedidosalmacen/ordencargadetalle/enviar-orden-carga/enviar-orden-carga.component';
import { OrdendescargadetalleComponent } from './almacen/ordendescarga/ordendescargadetalle/ordendescargadetalle.component';








const pagesRoutes: Routes = [
    {
            path: '', component: PagesComponent,
            canActivate: [LoginguardGuard],
            children: [
                { path: 'dashboard', component: DashboardComponent },
                { path: 'progress', component: ProgressComponent },
                { path: 'graficas1', component: Graficas1Component },
                { path: 'promesas', component: PromesasComponent },
                { path: 'account-settings', component: AccountSettingsComponent  },
                { path: 'dbcalidad', component: DbcalidadComponent  },
                { path: 'reportescalidad', component: ReportesComponent  },
                { path: 'graficoscalidad', component: GraficosComponent  },
                { path: 'calendario_calidad', component: CalendarioCalidadComponent  },
                { path: 'direccion', component: DireccionComponent },
                { path: 'direccion-reportes', component: DireccionReportesComponent  },
                { path: 'direccion-calendario', component: DireccionCalendarioComponent  },
                { path: 'incidencias', component: IncidenciasComponent  },
                { path: 'evidencias', component: EvidenciasComponent  },
                { path: 'reportesVentas', component: ReportesVentasComponent },
                { path: 'pedidosVentas', component: PedidoVentasComponent },
                { path: 'dashboardVentas', component: DashboardVentasComponent },
                { path: 'calendarioVentas', component: CalendarioVentasComponent },
                { path: 'pedidosTrafico', component: PedidoTraficoComponent },
                { path: 'reportesTrafico', component: ReporteTraficoComponent },
                { path: 'formatoFacturaTrafico', component: FormatofacturaTraficoComponent },
                { path: 'dashboardTrafico', component: DashboardTraficoComponent },
                { path: 'calendarioTrafico', component: CalendarioTraficoComponent },
                { path: 'dashboardCompras', component: DashboardComprasComponent },
                { path: 'reportesCompras', component: ReporteComprasComponent },
                { path: 'graficosCompras', component:  GraficasComprasComponent},
                { path: 'formatoCompras', component:  FormatoComprasComprasComponent},
                { path: 'calendarioCompras', component:  CalendarioComprasComponent},
                { path: 'profile', component: ProfileComponent  },
                { path: 'catalogos', component: CatalogosComponent  },
                { path: 'dashboardImportacion', component: DashboardImportacionComponent  },
                { path: 'documentacionImportacion', component: DocumentacionImportacionComponent  },
                { path: 'embarqueImportacion', component: EmbarqueImportacionComponent  },
                { path: 'reportesImportacion', component: ReportesImportacionComponent  },
                { path: 'calendarioImportacion', component: CalendarioImportacionComponent  },
                { path: 'calendarioCxc', component: CalendariocxcComponent  },
                { path: 'facturacionCxc', component: FacturacioncxcComponent  },
                { path: 'facturacionCxcAdd/:id', component: FacturacioncxcAddComponent  },
                { path: 'pedidosCxc', component: PedidoscxcComponent  },
                { path: 'polizasCxc', component: PolizascxcComponent  },
                { path: 'reportesCxc', component: ReportescxcComponent  },
                { path: 'saldosCxc', component: SaldoscxcComponent  },
                { path: 'dashboardCxc', component: DbcxcComponent  },
                { path: 'dashboardCxp', component: DashboardcxpComponent  },
                { path: 'pagosCxp', component: PagoscxpComponent  },
                { path: 'polizasCxp', component: PolizascxpComponent  },
                { path: 'saldosCxp', component: SaldoscxpComponent  },
                { path: 'forwardsCxp', component: ForwardscxpComponent  },
                { path: 'calendarioCxp', component: CalendariocxpComponent  },
                { path: 'reportesCxp', component: ReportescxpComponent  },
                { path: 'dashboardalmacen', component: DbalmacenComponent  },
                { path: 'pedidosalmacen', component: PedidosalmacenComponent  },
                { path: 'importacionesalmacen', component: ImportacionesalmacenComponent  },
                { path: 'inventariosalmacen', component: InventariosalmacenComponent  },
                { path: 'documentosalmacen', component: DocumentosalmacenComponent  },
                { path: 'Incidenciasalmacen', component: IncidenciasalmacenComponent  },
                { path: 'calendarioalmacen', component: CalendarioalmacenComponent  },
                { path: 'reportesalmacen', component: ReportesalmacenComponent  },
                { path: 'empresa', component: EmpresaComponent  },
                { path: 'expediente', component: ExpedienteComponent  },
                { path: 'quejas', component: QuejasComponent  },
                { path: 'complementopagoCxc', component: ComplementopagocxcComponent  },
                { path: 'permisos', component: ShowUsuarioPermisoComponent  },
                { path: 'recibopago', component: ReciboPagoComponent },
                { path: 'pedidoventasAdd', component: PedidoventasAddComponent },
                { path: 'ordencargadetalle', component: OrdencargadetalleComponent },
                { path: 'ordendescarga', component: OrdendescargaComponent },
                { path: 'unidadMedida', component: UnidadMedidaComponent },
                { path: 'notasCreditocxc', component: NotaCreditocxcComponent },
                { path: 'cotizacionesVentas', component: CotizacionesVentasComponent },
                { path: 'cotizacionesVentasAdd', component: AddCotizacionComponent },
                { path: 'ordenCargaPreparar', component: PrepararComponent },
                { path: 'ordenCargaCargar', component: CargarComponent },
                { path: 'ordenCargaEnviar', component: EnviarOrdenCargaComponent },
                { path: 'ordenDescargadetalle', component: OrdendescargadetalleComponent },

                { path: '#/calendario_calidad', redirectTo: '/register', pathMatch: 'full' },
                { path: '#/register', redirectTo: '/register', pathMatch: 'full' },
                { path: '', redirectTo: '/login', pathMatch: 'full' },
            ]
        },

];

export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
