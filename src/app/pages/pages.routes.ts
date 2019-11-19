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
<<<<<<< HEAD
import { DashboardVentasComponent } from './ventas/dashboard-ventas/dashboard-ventas.component';
import { CalendarioVentasComponent } from './ventas/calendario-ventas/calendario-ventas.component';
=======
import { ProfileComponent } from '../components/profile/profile.component';
>>>>>>> 28991268ba73504fe2f6d85273152f11428a9b88



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
<<<<<<< HEAD
                { path: 'reportesVentas', component: ReportesVentasComponent },
                { path: 'pedidosVentas', component: PedidoVentasComponent },
                { path: 'dashboardVentas', component: DashboardVentasComponent },
                { path: 'calendarioVentas', component: CalendarioVentasComponent },
=======
                { path: 'profile', component: ProfileComponent  },
>>>>>>> 28991268ba73504fe2f6d85273152f11428a9b88
                { path: '#/calendario_calidad', redirectTo: '/register', pathMatch: 'full' },
                { path: '#/register', redirectTo: '/register', pathMatch: 'full' },
                { path: '', redirectTo: '/login', pathMatch: 'full' },
            ]
        },

];

export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );