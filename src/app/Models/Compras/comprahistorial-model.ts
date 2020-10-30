import { Compras } from './compra-model';
import { OrdenDescargaDODCompras } from '../almacen/OrdenDescarga/OrdenDescargaDODCompras-model';

export class ComprasHistorial{
    Compras?:Compras[];
    OrdenDescargaDODCompras?:OrdenDescargaDODCompras[];
}