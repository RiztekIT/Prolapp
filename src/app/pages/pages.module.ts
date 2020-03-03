import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

// Importacion Angular Material
import { MatSliderModule } from '@angular/material/slider';
import { MatSortModule, MatDialogModule, MatSnackBarModule, MatPaginatorModule, MatStepperModule, MatTooltipModule } from '@angular/material';
import { MatNativeDateModule } from '@angular/material';
import { MatDatepickerModule } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule, MatButtonModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatMenuModule} from '@angular/material/menu';
import {MatCheckboxModule, MatCheckbox} from '@angular/material/checkbox';




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
import { CommonModule, CurrencyPipe } from '@angular/common';
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
import { UsuariosServieService } from '../services/catalogos/usuarios-servie.service';
import { UsuariosComponent } from './administracion/catalogos/usuarios/usuarios.component';
import { ProductosComponent } from './administracion/catalogos/productos/productos.component';
import { ProveedoresComponent } from './administracion/catalogos/proveedores/proveedores.component';
import { EmpresaComponent } from './administracion/empresa/empresa.component';
import { ClientesComponent } from './administracion/catalogos/clientes/clientes.component';
import { EditUsuarioComponent } from './administracion/catalogos/usuarios/edit-usuario/edit-usuario.component';
import { ShowUsuarioComponent } from './administracion/catalogos/usuarios/show-usuario/show-usuario.component';
import { AddUsuarioComponent } from './administracion/catalogos/usuarios/add-usuario/add-usuario.component';
import { ShowProveedorComponent } from './administracion/catalogos/proveedores/show-proveedor/show-proveedor.component';
import { EditProveedorComponent } from './administracion/catalogos/proveedores/edit-proveedor/edit-proveedor.component';
import { AddProveedorComponent } from './administracion/catalogos/proveedores/add-proveedor/add-proveedor.component';
import { ShowProductoComponent } from './administracion/catalogos/productos/show-producto/show-producto.component';
import { EditProductoComponent } from './administracion/catalogos/productos/edit-producto/edit-producto.component';
import { AddProductoComponent } from './administracion/catalogos/productos/add-producto/add-producto.component';
import { ProductosService } from '../services/catalogos/productos.service';
import { ProveedoresService } from '../services/catalogos/proveedores.service';
import { ShowClienteComponent } from './administracion/catalogos/clientes/show-cliente/show-cliente.component';
import { EditClienteComponent } from './administracion/catalogos/clientes/edit-cliente/edit-cliente.component';
import { AddClienteComponent } from './administracion/catalogos/clientes/add-cliente/add-cliente.component';
import { ClientesService } from '../services/catalogos/clientes.service';
import { ReciboPagoService } from '../services/complementoPago/recibo-pago.service';
import { VentasPedidoService } from '../services/ventas/ventas-pedido.service';

import { EmpresaService } from '../services/empresas/empresa.service';

import { ImageUploadModule } from 'angular2-image-upload';

  //qr code
import { NgxQRCodeModule } from 'ngx-qrcode2'; 
import { NgxLoadingModule } from 'ngx-loading'


// Importacion Angular Material
import { FacturaComponent } from '../components/factura/factura.component';
import { FacturacioncxcAddComponent } from './cxc/facturacioncxc/facturacioncxc-add/facturacioncxc-add.component';
import { FacturacioncxcEditComponent } from './cxc/facturacioncxc/facturacioncxc-edit/facturacioncxc-edit.component';
import { FacturaService } from '../services/facturacioncxc/factura.service';
import {MatSelectModule} from '@angular/material/select';
import { FacturacioncxcProductoComponent } from './cxc/facturacioncxc/facturacioncxc-producto/facturacioncxc-producto.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { FacturacioncxcEditProductoComponent } from './cxc/facturacioncxc/facturacioncxc-edit-producto/facturacioncxc-edit-producto.component';
import { MatDividerModule } from '@angular/material/divider';
import { ComplementopagocxcComponent } from './cxc/complementopagocxc/complementopagocxc.component';
import { ReciboPagoComponent } from './cxc/complementopagocxc/recibo-pago/recibo-pago.component';
import { ShowUsuarioPermisoComponent } from './administracion/permisos/show-usuario-permiso/show-usuario-permiso.component';
import { ShowUsuarioPrivilegioComponent } from './administracion/permisos/show-usuario-privilegio/show-usuario-privilegio.component'
import { ShowEmpresaComponent } from './administracion/empresa/show-empresa/show-empresa.component';
import { EditEmpresaComponent } from './administracion/empresa/edit-empresa/edit-empresa.component';
import { ExpedienteComponent } from './administracion/expediente/expediente.component';
import { PedidoService } from '../services/pedidos/pedido.service';
import { PagoCFDIEditComponent } from './cxc/complementopagocxc/pago-cfdi-edit/pago-cfdi-edit.component';
import { FoliosComponent } from '../components/folios/folios.component';
import { AddEmpresaComponent } from './administracion/empresa/add-empresa/add-empresa.component';
import { PedidoventasAddComponent } from './ventas/pedido-ventas/pedidoventas-add/pedidoventas-add/pedidoventas-add.component';
import { AddVendedorComponent } from './administracion/catalogos/vendedores/add-vendedor/add-vendedor.component';
import { EditVendedorComponent } from './administracion/catalogos/vendedores/edit-vendedor/edit-vendedor.component';
import { ShowVendedorComponent } from './administracion/catalogos/vendedores/show-vendedor/show-vendedor.component';
import { EmailComponent } from '../components/email/email/email.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { UnidadMedidaComponent } from './administracion/unidad-medida/unidad-medida.component'
import { OrdendescargaComponent } from './almacen/ordendescarga/ordendescarga.component';
import { OrdencargadetalleComponent } from './almacen/pedidosalmacen/ordencargadetalle/ordencargadetalle.component';
import { ComppagoComponent } from './cxc/comppago/comppago/comppago.component';
import { ClienteDireccionComponent } from '../components/cliente-direccion/cliente-direccion.component';
import { ReporteEmisionComponent } from '../components/reporte-emision/reporte-emision.component';
import { ComplementoPagoComponent } from '../components/complemento-pago/complemento-pago.component';
import { NotaCreditocxcComponent } from './cxc/nota-creditocxc/nota-creditocxc.component';
import { HeaderReportesComponent } from "../components/header-reportes/header-reportes.component";
import { FooterReportesComponent } from '../components/footer-reportes/footer-reportes.component';
import { ReportesModalComponent } from '../components/reportes-modal/reportes-modal.component';


import { NotaCreditoService } from '../services/cuentasxcobrar/NotasCreditocxc/notaCredito.service';
import { DetalleNotaCreditoComponent } from './cxc/nota-creditocxc/detalle-nota-credito/detalle-nota-credito.component';
import { ReporteComponent } from '../components/cxc/reporte/reporte.component';
import { ReporteDllsComponent } from '../components/cxc/reporte-dlls/reporte-dlls.component';
import { ReporteMxnComponent } from '../components/cxc/reporte-mxn/reporte-mxn.component';



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
        ClientesComponent,
        AddUsuarioComponent,
        EditUsuarioComponent,
        ShowUsuarioComponent,
        ShowProveedorComponent,
        EditProveedorComponent,
        AddProveedorComponent,
        ShowProductoComponent,
        EditProductoComponent,
        AddProductoComponent,
        ShowClienteComponent,
        EditClienteComponent,
        AddClienteComponent,
        FacturaComponent,
        FacturacioncxcAddComponent,
        FacturacioncxcEditComponent,
        FacturacioncxcProductoComponent,
        FacturacioncxcEditProductoComponent,
        ComplementopagocxcComponent,
        ReciboPagoComponent,
        EmpresaComponent,
        ShowEmpresaComponent,
        EditEmpresaComponent,
        AddEmpresaComponent,
        ShowUsuarioPermisoComponent,
        ShowUsuarioPrivilegioComponent,
        ExpedienteComponent,
        PagoCFDIEditComponent,
        PedidoventasAddComponent,
        AddVendedorComponent,
        EditVendedorComponent,
        ShowVendedorComponent,
        FoliosComponent,
        ShowVendedorComponent,
        EmailComponent,
        UnidadMedidaComponent,
        OrdendescargaComponent,
        OrdencargadetalleComponent,
        ComppagoComponent,
        ClienteDireccionComponent,
        ReporteEmisionComponent,
        ComplementoPagoComponent,
        NotaCreditocxcComponent,
        HeaderReportesComponent,
        FooterReportesComponent,
        ReportesModalComponent,
        DetalleNotaCreditoComponent,
        ReporteComponent,
        ReporteDllsComponent,
        ReporteMxnComponent,
        
    
    ],
    exports: [
        DashboardComponent,
        ProgressComponent,
        Graficas1Component,
    ],
    imports: [
        PAGES_ROUTES,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        ChartsModule,
        CommonModule,
        MatSliderModule,
        MatInputModule,
        MatTableModule,
        MatIconModule,
        MatButtonModule,
        MatSortModule,
        MatDialogModule,
        MatSnackBarModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NgxQRCodeModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatCardModule,
        MatGridListModule,
        MatMenuModule,
        MatDividerModule,
        MatPaginatorModule,
        MatCheckboxModule,
        ImageUploadModule.forRoot(),
        HttpClientModule,
        NgxLoadingModule.forRoot({}),
        MatStepperModule,
        MatTooltipModule,
        NgxDropzoneModule

    ],
    providers: [
        UsuariosServieService,
        ProductosService,
        ProveedoresService,
        ClientesService,
        FacturaService,
        ReciboPagoService,
        EmpresaService,
        PedidoService,
        CurrencyPipe,
        VentasPedidoService,
        NotaCreditoService
        
    ],
    entryComponents: [
        AddUsuarioComponent,
        EditUsuarioComponent,
        AddProveedorComponent,
        EditProveedorComponent,
        AddProductoComponent,
        EditProductoComponent,
        AddClienteComponent,
        EditClienteComponent,
        FacturacioncxcEditComponent,
        FacturacioncxcProductoComponent,
        FacturacioncxcEditProductoComponent,
        ShowUsuarioPrivilegioComponent,
        EditEmpresaComponent,
        PagoCFDIEditComponent,
        AddVendedorComponent,
        EditVendedorComponent,
        ShowVendedorComponent,
        ShowEmpresaComponent,
        AddEmpresaComponent,
        ClienteDireccionComponent,
        ReporteEmisionComponent,
        ComplementoPagoComponent,
        ReportesModalComponent,
        DetalleNotaCreditoComponent,
    ]
})
export class PagesModule { }
