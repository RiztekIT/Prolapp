export class FacturaTimbre{

    Receptor: {
        UID: String;
    };
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
              UUID: any[]
            };
      UsoCFDI: String;
      Serie: Number;
      FormaPago: String;
      MetodoPago: String;
      Moneda: String;
      TipoCambio: String;
      EnviarCorreo: boolean;
      Fecha?:String
      }