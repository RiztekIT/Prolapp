import { OrdenCarga } from './ordencarga.model';
import { DetalleOrdenCarga } from './detalleOrdenCarga-model';
import { Tarima } from '../Tarima/tarima-model';
import { DetalleTarima } from '../Tarima/detalleTarima-model';
import { MasterDetalleOrdenCarga } from './masterDetalleOrdenCarga-model';

export class MasterOrdenCarga {

    ordenCarga?: OrdenCarga[];
    detalleOrdenCarga?: DetalleOrdenCarga[];
// detalleOrdenCarga?: DetalleOrdenCarga[];
// tarima?: Tarima[];
// detalleTarima?: DetalleTarima[];

}