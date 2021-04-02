export class pagoTimbre{
    Receptor: {
        UID: String;
    };
    TipoCfdi:String;
    UsoCFDI:String;
    Serie:String;
    Moneda:String;
    Conceptos:[
        {
            ClaveProdServ:String,
            Cantidad:String,
            ClaveUnidad:String,
            Descripcion:String,
            ValorUnitario:String,
            Importe:String
            Complemento:[
                {
                    typeComplement:String,
                    FechaPago:String,
                    FormaDePagoP:String,
                    MonedaP:String,
                    Monto:String,
                    relacionados:{
                            IdDocumento:String,
                            MonedaDR:String,
                            TipoCambioDR:String,
                            MetodoDePagoDR:String,
                            NumParcialidad:String,
                            ImpSaldoAnt:String,
                            ImpPagado:String,
                            ImpSaldoInsoluto:String
                        }[]
                }
            ]
        }
    ];
   

}