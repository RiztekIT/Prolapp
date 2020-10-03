import { Component, OnInit } from '@angular/core';

// import { UsuariosServieService } from '../../../services/catalogos/usuarios/usuarios-servie.service';
// import {Usuario} from '../../../Models/catalogos/usuarios-model/usuarios-model';


declare function EditableTableCatalogosComponent();
declare function EditableTableCatalogosComponent2();
declare function EditableTableCatalogosComponent3();
declare function EditableTableCatalogosComponent4();
declare function EditableTableCatalogosComponent5();
declare function editTableJS();

@Component({
  selector: 'app-catalogos',
  templateUrl: './catalogos.component.html',
  styleUrls: ['./catalogos.component.css']  
})
export class CatalogosComponent implements OnInit {
  
  // private service:UsuariosServieService
  constructor( ) { }

  // listData: any[];

  ngOnInit() {

    this.iniciarFunciones();
    // this.refreshUsuariosList();
  }

  iniciarFunciones() {

    EditableTableCatalogosComponent();
    // EditableTableCatalogosComponent2();
    EditableTableCatalogosComponent3();
    EditableTableCatalogosComponent4();
    // EditableTableCatalogosComponent5();
    editTableJS();
  }

  // refreshUsuariosList() {

  //   this.service.getUsuariosList().subscribe(data => {
  //   this.listData = (data);
  //   console.log(this.listData);
  //   });

  // }






}
