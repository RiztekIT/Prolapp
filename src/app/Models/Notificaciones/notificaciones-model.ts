export class Notificaciones {
    IdNotificacion: number;
    Folio: number;
    IdUsuario: number;
    Usuario: string;
    Mensaje: string;
    ModuloOrigen: string;
    FechaEnvio: Date;

    // ^Opcionales para notificacion
    titulo?: string;
    origen?: string;
}