export class DetalleOrdenDescarga {
    IdDetalleOrdenDescarga: number;
    IdOrdenDescarga: number;
    ClaveProducto: string;
Producto: string;
Sacos: string;
PesoxSaco: string;
Lote: string;
IdProveedor: number;
Proveedor: string;
PO: string;
FechaMFG: Date;
FechaCaducidad: Date;
Shipper: string;
USDA: string;
Pedimento: string;
Saldo: string;
//se agrega a la tabla de DOD pero es un dato temporal que no se agrega a la DB
SacosIngresados: string;
}