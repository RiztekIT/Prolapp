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
import { DireccionComponent } from './direccion/direccion.component';



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
                { path: '#/calendario_calidad', redirectTo: '/register', pathMatch: 'full' },
                { path: '#/register', redirectTo: '/register', pathMatch: 'full' },
                { path: '', redirectTo: '/login', pathMatch: 'full' },
            ] 
        },

];

export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );