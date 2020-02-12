import { Component, OnInit } from '@angular/core';


declare function upload();

@Component({
  selector: 'app-documentacion-importacion',
  templateUrl: './documentacion-importacion.component.html',
  styles: []
})
export class DocumentacionImportacionComponent implements OnInit {


  constructor() { }

  ngOnInit() {
    upload();
  }

}
