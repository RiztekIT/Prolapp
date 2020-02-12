import { Factura } from './factura-model';
import { DetalleFactura } from './detalleFactura-model';

export class facturaMasterDetalle{
    Id: number;
    IdCliente: number;
    Serie: string;
    Folio: string;
    Tipo: string;
    FechaDeExpedicion: Date;
    LugarDeExpedicion: string;
    Certificado: string;
    NumeroDeCertificado: string;
    UUID: string;
    UsoDelCFDI: string;
    Subtotal: string;
    Descuento: string;
    ImpuestosRetenidos: string;
    ImpuestosTrasladados: string;
    Total: string;
    FormaDePago: string;
    MetodoDePago: string;
    Cuenta: string;
    Moneda: string;
    CadenaOriginal: string;
    SelloDigitalSAT: string;
    SelloDigitalCFDI: string;
    NumeroDeSelloSAT: string;
    RFCdelPAC: string;
    Observaciones: string;
    FechaVencimiento: Date;
    OrdenDeCompra: string;
    TipoDeCambio: string;
    FechaDeEntrega: Date;
    CondicionesDePago: string;
    Vendedor: string;
    Estatus: string;
    Version: string;
    Usuario: string;
    detalle?: DetalleFactura[]
}