
export class OrdenDescargaDODCompras {
    IdOrdenDescarga?: number;
    Folio?: number;
    FechaLlegada?: Date;
    IdProveedor?: number;
    Proveedor?: string;
    IdPedido?: number;
    PO?: string;
    Fletera?: string;
    Caja?: string;
    Sacos?: string;
    Kg?: string;
    Chofer?: string;
    Origen?: string;
    Destino?: string;
    Observaciones?: string;
    Estatus?: string;
    FechaInicioDescarga?: Date;
    FechaFinalDescarga?: Date;
    FechaExpedicion?: Date;
    IdUsuario?: number;
    Usuario?: string;

    IdDetalleOrdenDescarga?: number;
    ClaveProducto?: string;
    Producto?: string;
    PesoxSaco?: string;
    Lote?: string;
    FechaMFG?: Date;
    FechaCaducidad?: Date;
    Shipper?: string;
    USDA?: string;
    Pedimento?: string;
    Saldo?: string;
    //se agrega a la tabla de DOD pero es un dato temporal que no se agrega a la DB
    SacosIngresados?: string;
    // comprashistorial
    KgDescargados?: string;

}