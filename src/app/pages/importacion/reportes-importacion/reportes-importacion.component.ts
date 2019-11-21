import { Component, OnInit } from '@angular/core';

declare function subirArchivosImport();
declare function Dropify();

@Component({
  selector: 'app-reportes-importacion',
  templateUrl: './reportes-importacion.component.html',
  styles: []
})
export class ReportesImportacionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    subirArchivosImport();
    // Dropify();
  }

}
