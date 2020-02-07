import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { processors } from 'xml2js'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { FoliosService } from 'src/app/services/direccion/folios.service';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-folios',
  templateUrl: './folios.component.html',
  styleUrls: ['./folios.component.css']
})
export class FoliosComponent implements OnInit {

  constructor(private _http: HttpClient, private sanitizer: DomSanitizer, public service: FoliosService) {
   }


   folios: number;
   fecha: Date;
   saldo: number;
  
  ngOnInit() {
    this.Folios();
  }

  Folios(){
    this.service.getFolios().subscribe(data =>{
      console.log(data);

      this.folios = data[0].Folios;
      this.fecha = data[0].FechaAgregados;
      this.saldo = data[0].SaldoFolios;

    
    })
  }

}
