import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginClienteComponent } from './login-cliente/login-cliente.component';
import { NopagefoundComponent } from './shared/nopagefound/nopagefound.component';
import { RegisterComponent } from './login/register.component';
import { DocumentosclienteComponent } from './documentoscliente/documentoscliente.component';
// import { DocumentosclienteComponent } from './documentoscliente/documentoscliente.component';





const appRoutes: Routes = [
    { path: 'documento/:token', component: DocumentosclienteComponent },  
    
    { path: 'login', component: LoginComponent },
    { path: 'logincliente', component: LoginClienteComponent },
    { path: 'register', component: RegisterComponent },    
    
    { path: '**', component: NopagefoundComponent }
];

export const APP_ROUTES = RouterModule.forRoot( appRoutes, { useHash: true, scrollPositionRestoration: 'enabled' } );
