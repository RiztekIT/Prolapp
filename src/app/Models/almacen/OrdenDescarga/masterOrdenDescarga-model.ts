import { DetalleOrdenDescarga } from './detalleOrdenDescarga-model';
import { OrdenDescarga } from './ordenDescarga-model';
import { MasterDetalleOrdenDescarga } from './masterDetalleOrdenDescarga-model';

export class MasterOrdenDescarga{
    
    OrdenDescarga?: OrdenDescarga[];
    detalleOrdenDescarga?: MasterDetalleOrdenDescarga[];
}