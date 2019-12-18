import { Component, OnInit } from '@angular/core';
import xml2js  from 'xml2js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']
})
export class FacturaComponent implements OnInit {
  constructor(private _http: HttpClient, private sanitizer: DomSanitizer) {
    this.loadXML();
  }
  title = 'xmljson';
  public xmlItems: any;
  fileUrl:any;
  QRString = 'CodigoQREjemplo';
  loadXML(){
    this._http.get('/assets/F-1.xml',
    {
      headers: new HttpHeaders()
      .set('Content-Type', 'text/xml')
      .append('Access-Control-Allow-Methods', 'GET')
      .append('Access-Control-Allow-Origin', '*')
      .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
    responseType: 'text'
    })
    .subscribe((data) =>{
      this.parseXML(data)
      .then((data) => {
        this.xmlItems = data;
      });
    });
  }

  parseXML(data){
    return new Promise(resolve => {
      let k: string | number,
      arr = [],
      parser = new xml2js.Parser(
        {
          trim:true,
          explicitArray: true
        }); 
        parser.parseString(data, function (err, result){
          var obj = result.Comprobante;
          for (k in obj.Comprobante) {
            var item = obj.Comprobante[k];
            arr.push({
              certificado: item.Certificado[0],
            //   id: item.id[0],  
            // name: item.name[0],  
            // gender: item.gender[0],  
            // mobile: item.mobile[0]
            
            });
          }
          resolve(arr);
        })
    })
  }




  ngOnInit() {
    const blob = new Blob(['/assets/F-1.xml'], { type: 'application/octet-stream' });
  
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
  }
QRstring = ""; 

}
