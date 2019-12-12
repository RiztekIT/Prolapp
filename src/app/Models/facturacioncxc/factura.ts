export class Factura {
    //Factura
    Id: number;
    Serie: string;
    Folio: string;
    Tipo: string;
    FechaDeExpedicion: string;
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
    FechaVencimiento: string;
    OrdenDeCompra: string;
    TipoDeCambio: string;
    FechaDeEntrega: string;
    CondicionesDePago: string;
    Vendedor: string;
    Estatus: string;
    Version: string;

    //Factura Detalle
    IdDetalle: string;
    IdFactura: string;
    ClaveProducto: string;
    Producto: string;
    Unidad: string;
    ClaveSat: string;
    PrecioUnitario: string;
    Cantidad: string;
    Importe: string;
    ObservacionesConcepto: string;




}