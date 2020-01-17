import { Proceso } from './proceso-model';
import { Privilegio } from './privilegio-model';

export class procesoMasterDetalle{
   
    Area: string;
    NombreProcesos?: Proceso[];
    Privilegiopermiso?: Privilegio[];
}