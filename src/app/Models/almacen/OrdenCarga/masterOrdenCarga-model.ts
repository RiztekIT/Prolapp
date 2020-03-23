import { OrdenCarga } from './ordencarga.model';
import { DetalleOrdenCarga } from './detalleOrdenCarga-model';
import { Tarima } from '../Tarima/tarima-model';
import { DetalleTarima } from '../Tarima/detalleTarima-model';
import { MasterDetalleOrdenCarga } from './masterDetalleOrdenCarga-model';

export class MasterOrdenCarga {

    ordenCarga?: OrdenCarga[];
    detalleOrdenCarga?: MasterDetalleOrdenCarga[];
// detalleOrdenCarga?: DetalleOrdenCarga[];
// tarima?: Tarima[];
// detalleTarima?: DetalleTarima[];

}