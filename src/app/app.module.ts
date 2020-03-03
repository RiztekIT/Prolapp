import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// Rutas
import { APP_ROUTES } from './app.routes';

// modulos
import { PagesModule } from './pages/pages.module';

// Servicios
import { ServiceModule } from './services/service.module';

// Componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';
import { FormsModule } from '@angular/forms';
import { SaldosComponent } from './components/saldos/saldos.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CalendarioComponent } from './components/cxc/calendario/calendario.component';
// import { NotacreditoComponent } from './components/notacredito/notacredito/notacredito.component';
// import { ComplementoPagoComponent } from './components/complemento-pago/complemento-pago.component';

// import { CalendarioComponent } from './components/calendario/calendario.component';

//Collapse 
// import { BrowserModule } from '@angular/platform-browser';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';






@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    SaldosComponent,
    CalendarioComponent,
    
    
    // CalendarioComponent
    ],
  imports: [
    BrowserModule,
    APP_ROUTES,
    PagesModule,
    FormsModule,
    ServiceModule,
    HttpClientModule,
    BrowserAnimationsModule,
    // NgbModule
  ],
  bootstrap: [AppComponent],
 
})
export class AppModule { }
