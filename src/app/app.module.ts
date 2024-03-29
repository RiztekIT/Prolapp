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
// import { CotizacionpedidoComponent } from './components/cotizacionpedido/cotizacionpedido.component';
import { ScannerComponent } from './components/scanner/scanner.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { EmailgeneralComponent } from './components/email/emailgeneral/emailgeneral.component';
import { LoginClienteComponent } from './login-cliente/login-cliente.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
// import { DocumentosclienteComponent } from './documentoscliente/documentoscliente.component';
import { DocumentosclienteComponent } from './documentoscliente/documentoscliente.component';
import { ReportetotalesComponent } from './components/cxc/reportetotales/reportetotales.component';

import { InicioComponent } from './components/inicio/inicio.component';

//Modificacion del apartado Clientes/Usuario Login
import { MatTabsModule, MatIconModule } from '@angular/material';
/* import { ClienteContactoComponent } from './components/cliente-contacto/cliente-contacto.component'; */



/* import { PdfViewerModule } from 'ng2-pdf-viewer'; */















// import { AcusecancelacionComponent } from './components/acusecancelacion/acusecancelacion.component';
// import { FacturacionComponent } from './components/cxc/graficas/facturacion/facturacion.component';
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
    // CotizacionpedidoComponent,
    ScannerComponent,
    LoginClienteComponent,
    DocumentosclienteComponent,
    
    InicioComponent,
    
    
    
    
    
    


    
    
    
    
    
    
   
    
    // AcusecancelacionComponent,
    
    
    
  
 
    
    
    // CalendarioComponent
    ],
  imports: [
    BrowserModule,
    APP_ROUTES,
    /* DocumentosclienteModule, */
    PagesModule,
    FormsModule,    
    ServiceModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ZXingScannerModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),     
    MatTabsModule,
    MatIconModule,
    
    // NgbModule
  ],
  bootstrap: [AppComponent],
 
})
export class AppModule { }
