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
<<<<<<< HEAD
import { PedidoTraficoComponent } from './trafico/pedido-trafico/pedido-trafico.component';
import { ReporteTraficoComponent } from './trafico/reporte-trafico/reporte-trafico.component';
import { FormatofacturaTraficoComponent } from './trafico/formatofactura-trafico/formatofactura-trafico.component';
import { DashboardTraficoComponent } from './trafico/dashboard-trafico/dashboard-trafico.component';
import { CalendarioTraficoComponent } from './trafico/calendario-trafico/calendario-trafico.component';
=======
import { CatalogosComponent } from './administracion/catalogos/catalogos.component';
import { PermisosComponent } from './administracion/permisos/permisos.component';
>>>>>>> e97cdec731106d602a7ba80e0dc344a5c1c8e7db



const pagesRoutes: Routes = [
    { 
            path: '', component: PagesComponent,
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
                { path: 'direccion', component: DireccionComponent  },
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
                { path: 'profile', component: ProfileComponent  },
                { path: 'catalogos', component: CatalogosComponent  },
                { path: 'permisos', component: PermisosComponent  },
                { path: '#/calendario_calidad', redirectTo: '/register', pathMatch: 'full' },
                { path: '#/register', redirectTo: '/register', pathMatch: 'full' },
                { path: '', redirectTo: '/login', pathMatch: 'full' },
            ]
        },

];

export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );