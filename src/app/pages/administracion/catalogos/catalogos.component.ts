import { Component, OnInit } from '@angular/core';

declare function EditableTableCatalogosComponent();
declare function EditableTableCatalogosComponent2();
declare function EditableTableCatalogosComponent3();
declare function EditableTableCatalogosComponent4();
declare function editTableJS();

@Component({
  selector: 'app-catalogos',
  templateUrl: './catalogos.component.html',
  styles: []
})
export class CatalogosComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    this.iniciarFunciones();
    
  }

  iniciarFunciones() {

    EditableTableCatalogosComponent();
    // EditableTableCatalogosComponent2();
    EditableTableCatalogosComponent3();
    EditableTableCatalogosComponent4();
    editTableJS();

  }

}
