export class Prefactura{

    Receptor: {
        UID: String;
        Id: String;
        Nombre: String;
        rfc: String;
        Direccion: String;
        Vendedor: String;
    };
    OrdenCompra: String;
    FechaVencimiento: String;
    Folio: String;
    LugarExpedicion: String;
    FechaEntrega: String;
    CondicionesPago: String;
    TipoDocumento: String;
    Conceptos: [{
        ClaveProdServ: String,
          NoIdentificacion: String,
          Cantidad: String,
          ClaveUnidad: String,
          Unidad: String,
          Descripcion: String,
          ValorUnitario: String,
          Importe: String,
          Descuento: String,
          tipoDesc: String,
          honorarioInverso: String,
          montoHonorario: String,
          Impuestos:{
            Traslados: [
              {
                Base: String,
                Impuesto: String,
                TipoFactor: String,
                TasaOCuota: String,
                Importe: String
              }],
            Retenidos?: [{
                Base?: String,
                Impuesto?: String,
                TipoFactor?: String,
                TasaOCuota?: String,
                Importe?: String
              }],
            Locales?: [{
                Impuesto?: String,
                TasaOCuota?: String,
              }],
          },
          NumeroPedimento: String,
          Predial: String,
          Partes: String,
          Complemento: String
    }];
      Impuestos: {
          Traslados: 
          [{
            Base: String,
            Impuesto: String,
            TipoFactor: String,
            TasaOCuota: String,
            Importe: String,   
       }],
        Retenidos?: [{
            Base?: String,
            Impuesto?: String,
            TipoFactor?: String,
            TasaOCuota?: String,
            Importe?: String,   
        }],
        Locales?: [{
            Impuesto?: String,
            TasaOCuota?: String,
       }]
      };
      CfdiRelacionados: {
              TipoRelacion: String,
              UUID: []
            };
      UsoCFDI: String;
      Serie: Number;
      FormaPago: String;
      MetodoPago: String;
      Moneda: String;
      TipoCambio: String;
      EnviarCorreo: boolean;
      }