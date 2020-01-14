import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ProcesoService } from '../../../../services/permisos/procesos.service';
import { Proceso } from '../../../../Models/proceso-model';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { UsuariosServieService } from 'src/app/services/catalogos/usuarios-servie.service';



@Component({
  selector: 'app-show-usuario-privilegio',
  templateUrl: './show-usuario-privilegio.component.html',
  styleUrls: ['./show-usuario-privilegio.component.css']
})
export class ShowUsuarioPrivilegioComponent implements OnInit {

  arrayArea: Array<any> = [];
  id:number;

  constructor(public service: ProcesoService, private service2:UsuariosServieService, public dialogbox: MatDialogRef<ShowUsuarioPrivilegioComponent>, private dialog: MatDialog) {


  }




  ngOnInit() {
    this.refreshProcesosList()

  }

  onClose() {
    this.dialogbox.close();
    this.service.filter('Register click');
  }

   refreshProcesosList() {
     this.service.showAreaPrivilegio(this.service2.formData.IdUsuario).subscribe(data => {

       for (var i = 0; i < data.length; i++) {
         this.arrayArea.push(data[i].Area)
       }
     });
   }







}
